// Young InnoHack with company challenges (vfi and IBK), step 3: about you. How you take part (on your own, a new team
// or one you join) and the two challenge choices (a team's when joining it) come from the two steps before;
// submit_fut_inno_young_registration checks them all again, keeps one registration per email and returns a new
// team's invite code to its captain. Organisers allocate the final challenge later.
import React from 'react';
import { UserRound } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { forgetYoungChallenges, formatCode } from '../../../content/youngChallenges';
import { kidSiteKey } from './kid';
import { SKILL_OPTIONS, YOUNG_CATEGORIES } from './squad';
import {
  Chips, Grid, Section, TextArea, TextField, UserFacingError, chipLabels, rows, str,
  type FieldsProps, type FormCtx, type FormDef, type Values,
} from '../ui';

const PARTICIPATION = { individual: 'individual', create: 'create-team', join: 'join-team' } as const;

/** The payload for submit_fut_inno_young_registration. */
export function youngPayload(v: Values, ctx: FormCtx): Record<string, unknown> {
  const team = ctx.path.team ?? 'individual';
  return {
    site: kidSiteKey(ctx),
    language: ctx.language,
    participation: PARTICIPATION[team],
    // A team's choices are the team's: the database ignores these for someone joining it.
    first_choice_id: team === 'join' ? null : ctx.path.first,
    second_choice_id: team === 'join' ? null : ctx.path.second,
    team:
      team === 'create'
        ? { name: str(v.teamName), listed: !!v.teamListed }
        : team === 'join'
          ? v.joinTeamId ? { id: v.joinTeamId } : { code: str(v.joinCode) }
          : null,
    person: {
      name: str(v.contactName),
      email: str(v.email),
      phone: str(v.phone),
      category: str(v.category),
      organisation: str(v.organisation),
      skills: Array.isArray(v.skills) ? v.skills : [],
      experience: str(v.experience),
    },
    consent: { accurate: !!v.consentAgreed, privacy: !!v.gdprAgreed },
  };
}

/** The database's reasons (its HINT) in the visitor's words. */
export function youngError(hint: string, L: FormCtx['L']): string {
  switch (hint) {
    case 'already_registered':
      return L(
        'This email is already registered for Young InnoHack. Write to the organisers if you need to change team.',
        'Den här e-postadressen är redan anmäld till Young InnoHack. Skriv till arrangörerna om du behöver byta lag.',
      );
    case 'team_name_taken':
      return L('Another team already has that name. Try a different one.', 'Ett annat lag har redan det namnet. Prova ett annat.');
    case 'team_full':
      return L('That team is full or not taking new people. Choose another way to take part.', 'Laget är fullt eller tar inte emot fler. Välj ett annat sätt att delta.');
    case 'team_not_found':
      return L('We can’t find that team. Ask your captain to check the code.', 'Vi hittar inte laget. Be din lagkapten kontrollera koden.');
    case 'invalid_choice':
      return L('One of your choices isn’t available any more. Go back and choose again.', 'Ett av dina val finns inte längre. Gå tillbaka och välj igen.');
    case 'closed':
      return L('Registration for the company challenges is closed.', 'Anmälan till företagens utmaningar är stängd.');
    case 'rate_limited':
      return L('Too many tries from this network. Please try again in an hour.', 'För många försök från det här nätverket. Försök igen om en timme.');
    default:
      return '';
  }
}

const YoungFields: React.FC<FieldsProps> = ({ v, set, ctx }) => {
  const { L, lang } = ctx;
  return (
    <>
      <Section title={L('About you', 'Om dig')} icon={UserRound} green={false}>
        <Grid>
          <TextField k="contactName" v={v} set={set} required maxLength={120} label={L('Your name', 'Ditt namn')} placeholder={L('First and last name', 'För- och efternamn')} />
          <TextField k="email" v={v} set={set} type="email" required maxLength={254} label={L('Email', 'E-post')} />
          <TextField k="phone" v={v} set={set} type="tel" maxLength={40} label={L('Phone (optional)', 'Telefon (valfritt)')} placeholder="+46 70 123 4567" />
          <TextField k="organisation" v={v} set={set} maxLength={200} label={L('Where you study or work (optional)', 'Var du pluggar eller jobbar (valfritt)')} />
        </Grid>
        <Chips k="category" v={v} set={set} lang={lang} required label={L('You are a', 'Du är')} options={YOUNG_CATEGORIES} />
        <Chips k="skills" v={v} set={set} lang={lang} multi label={L('What you’re good at (optional)', 'Vad du är bra på (valfritt)')} options={SKILL_OPTIONS} />
        <TextArea k="experience" v={v} set={set} rows={2} label={L('Anything we should know? (optional)', 'Något vi bör veta? (valfritt)')} />
      </Section>
    </>
  );
};

export const youngForm: FormDef = {
  fees: false,
  title: (ctx) => ctx.L('About you', 'Om dig'),
  intro: (ctx) =>
    ctx.L(
      'We use this to confirm your place and send you the event details.',
      'Vi använder det för att bekräfta din plats och skicka information om evenemanget.',
    ),
  initial: () => ({ category: '', skills: [] }),
  Fields: YoungFields,
  validate: (v, ctx) =>
    !YOUNG_CATEGORIES.some((c) => c.value === v.category)
      ? ctx.L('Tell us whether you’re at gymnasium, at university or working.', 'Berätta om du går på gymnasiet, pluggar på universitetet eller jobbar.')
      : '',
  summary: (v, ctx) => {
    const { L, lang } = ctx;
    return rows(
      [L('Name', 'Namn'), str(v.contactName)],
      [L('Email', 'E-post'), str(v.email)],
      [L('Phone', 'Telefon'), str(v.phone)],
      [L('You are a', 'Du är'), chipLabels([v.category].filter(Boolean), YOUNG_CATEGORIES, lang)],
      [L('Studies or works at', 'Pluggar eller jobbar på'), str(v.organisation)],
      [L('Good at', 'Bra på'), chipLabels(v.skills, SKILL_OPTIONS, lang)],
      [L('Note to the organisers', 'Till arrangörerna'), str(v.experience)],
    );
  },
  submit: async (v, ctx) => {
    const { data, error } = await supabase.rpc('submit_fut_inno_young_registration', { payload: youngPayload(v, ctx) });
    if (error) {
      const message = youngError(String((error as { hint?: string }).hint ?? ''), ctx.L);
      throw message ? new UserFacingError(message) : new Error(error.message || 'Failed to submit');
    }
    forgetYoungChallenges();
    const d = (data ?? {}) as { reference?: string; role?: 'individual' | 'captain' | 'member'; team?: { name?: string } | null; invite_code?: string | null; invite_link?: string | null };
    return {
      id: str(d.reference),
      role: d.role,
      team: d.team?.name ?? undefined,
      inviteCode: d.invite_code ? formatCode(d.invite_code) : undefined,
      inviteLink: d.invite_link ?? undefined,
    };
  },
  submitLabel: (ctx) =>
    ctx.path.team === 'create'
      ? ctx.L('Start the team', 'Starta laget')
      : ctx.path.team === 'join'
        ? ctx.L('Join the team', 'Gå med i laget')
        : ctx.L('Register', 'Anmäl dig'),
  done: (ctx, v) => ({
    title:
      ctx.path.team === 'create'
        ? ctx.L('Your team is registered', 'Ditt lag är anmält')
        : ctx.path.team === 'join'
          ? ctx.L('You’re in the team', 'Du är med i laget')
          : ctx.L('You’re registered', 'Du är anmäld'),
    body:
      ctx.path.team === 'create'
        ? ctx.L(
            `Share the code below with your teammates. We’ll email ${str(v.email)} which challenge your team gets.`,
            `Dela koden nedan med dina lagkamrater. Vi mejlar ${str(v.email)} vilken utmaning laget får.`,
          )
        : ctx.path.team === 'join'
          ? ctx.L(
              `We’ll email ${str(v.email)} which challenge you get. The organisers decide using everyone’s choices.`,
              `Vi mejlar ${str(v.email)} vilken utmaning du får. Arrangörerna bestämmer utifrån allas val.`,
            )
          : ctx.L(
              `We’ll email ${str(v.email)} which challenge you get. The organisers decide using everyone’s choices, and they may put you in a team with others.`,
              `Vi mejlar ${str(v.email)} vilken utmaning du får. Arrangörerna bestämmer utifrån allas val, och de kan sätta ihop dig med andra i ett lag.`,
            ),
  }),
};
