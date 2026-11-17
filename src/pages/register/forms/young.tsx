// Young InnoHack with company challenges (vfi and IBK), step 3: your details. The challenge and the team (on your own,
// a new team or one you join) were chosen on the two steps before; submit_fut_inno_young_registration checks them all
// again, keeps one registration per email and returns the team's invite code to its captain.
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
    challenge_id: ctx.path.challenge,
    participation: PARTICIPATION[team],
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
        'This email is already registered for Young InnoHack. To change your team or challenge, contact the organisers.',
        'Den här e-postadressen är redan anmäld till Young InnoHack. Kontakta arrangörerna om du vill byta lag eller utmaning.',
      );
    case 'team_name_taken':
      return L('A team with this name already takes on this challenge. Choose another name.', 'Ett lag med det namnet finns redan i den här utmaningen. Välj ett annat namn.');
    case 'team_full':
      return L('This team is not taking new members. Choose another team, or take part on your own.', 'Laget tar inte emot fler medlemmar. Välj ett annat lag eller delta på egen hand.');
    case 'team_not_found':
    case 'wrong_challenge':
      return L('We could not find that team in this challenge. Check the invite code with your captain.', 'Vi hittar inte laget i den här utmaningen. Kontrollera inbjudningskoden med din lagkapten.');
    case 'challenge_full':
      return L('This challenge has no room for more teams. Join a team or take part on your own.', 'Utmaningen har inte plats för fler lag. Gå med i ett lag eller delta på egen hand.');
    case 'closed':
    case 'not_found':
      return L('Registration for this challenge is closed.', 'Anmälan till den här utmaningen är stängd.');
    case 'rate_limited':
      return L('Too many attempts from this network. Please try again in an hour.', 'För många försök från det här nätverket. Försök igen om en timme.');
    default:
      return '';
  }
}

const YoungFields: React.FC<FieldsProps> = ({ v, set, ctx }) => {
  const { L, lang } = ctx;
  return (
    <>
      <Section title={L('You', 'Du')} icon={UserRound} green={false}>
        <Grid>
          <TextField k="contactName" v={v} set={set} required maxLength={120} label={L('Your name', 'Ditt namn')} placeholder={L('First and last name', 'För- och efternamn')} />
          <TextField k="email" v={v} set={set} type="email" required maxLength={254} label={L('Email', 'E-post')} />
          <TextField k="phone" v={v} set={set} type="tel" maxLength={40} label={L('Phone (optional)', 'Telefon (valfritt)')} placeholder="+46 70 123 4567" />
          <TextField k="organisation" v={v} set={set} maxLength={200} label={L('School, university or workplace (optional)', 'Skola, universitet eller arbetsplats (valfritt)')} />
        </Grid>
        <Chips k="category" v={v} set={set} lang={lang} required label={L('You are a', 'Du är')} options={YOUNG_CATEGORIES} />
        <Chips k="skills" v={v} set={set} lang={lang} multi label={L('What you are good at (optional)', 'Vad du är bra på (valfritt)')} options={SKILL_OPTIONS} />
        <TextArea k="experience" v={v} set={set} rows={2} label={L('Anything the organisers should know (optional)', 'Något arrangörerna bör veta (valfritt)')} />
      </Section>
    </>
  );
};

export const youngForm: FormDef = {
  fees: false,
  title: (ctx) => ctx.L('Your details', 'Dina uppgifter'),
  intro: (ctx) =>
    ctx.L(
      'We use these to confirm your place and to send you the event details.',
      'Vi använder dem för att bekräfta din plats och skicka information om evenemanget.',
    ),
  initial: () => ({ category: '', skills: [] }),
  Fields: YoungFields,
  validate: (v, ctx) =>
    !YOUNG_CATEGORIES.some((c) => c.value === v.category)
      ? ctx.L('Choose whether you are a gymnasium student, a university student or a professional.', 'Välj om du är gymnasieelev, universitetsstudent eller yrkesverksam.')
      : '',
  summary: (v, ctx) => {
    const { L, lang } = ctx;
    return rows(
      [L('Name', 'Namn'), str(v.contactName)],
      [L('Email', 'E-post'), str(v.email)],
      [L('Phone', 'Telefon'), str(v.phone)],
      [L('You are a', 'Du är'), chipLabels([v.category].filter(Boolean), YOUNG_CATEGORIES, lang)],
      [L('School, university or workplace', 'Skola, universitet eller arbetsplats'), str(v.organisation)],
      [L('Good at', 'Bra på'), chipLabels(v.skills, SKILL_OPTIONS, lang)],
      [L('For the organisers', 'Till arrangörerna'), str(v.experience)],
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
      ? ctx.L('Create the team and register', 'Skapa laget och anmäl dig')
      : ctx.path.team === 'join'
        ? ctx.L('Join the team', 'Gå med i laget')
        : ctx.L('Register', 'Anmäl dig'),
  done: (ctx, v) => ({
    title:
      ctx.path.team === 'create'
        ? ctx.L('Your team is registered', 'Ditt lag är anmält')
        : ctx.path.team === 'join'
          ? ctx.L('You have joined the team', 'Du har gått med i laget')
          : ctx.L('You are registered', 'Du är anmäld'),
    body:
      ctx.path.team === 'create'
        ? ctx.L(
            `Share the invite code below with your teammates; we also emailed it to ${str(v.email)} with a receipt.`,
            `Dela inbjudningskoden nedan med dina lagkamrater; vi har också mejlat den till ${str(v.email)} med ett kvitto.`,
          )
        : ctx.L(`A receipt is on its way to ${str(v.email)}. The organisers contact you before the kickoff.`, `Ett kvitto är på väg till ${str(v.email)}. Arrangörerna hör av sig före kickoffen.`),
  }),
};
