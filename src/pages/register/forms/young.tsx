// Young InnoHack (vfi and IBK), step 3: about you. How you take part (on your own, a new team or one you join) and the
// two theme choices (a team's when joining it) come from the two steps before; here: hybrid or fully online, the
// sessions you can attend, and a parent or guardian for anyone under 18 (who confirms by email).
// submit_fut_inno_young_registration checks them all again, keeps one registration per email and returns a new team's
// invite code to its captain. Organisers allocate the final theme later.
import React from 'react';
import { CalendarDays, Laptop, MapPin, ShieldCheck, UserRound } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { forgetYoungChallenges, formatCode } from '../../../content/youngChallenges';
import { kidSiteKey } from './kid';
import { SKILL_OPTIONS, YOUNG_CATEGORIES } from './squad';
import { ChoiceGroup } from '../ChoiceCards';
import {
  Chips, Grid, Note, Section, TextArea, TextField, UserFacingError, chipLabels, rows, str,
  type ChipOption, type FieldsProps, type FormCtx, type FormDef, type Values,
} from '../ui';

const PARTICIPATION = { individual: 'individual', create: 'create-team', join: 'join-team' } as const;

/** Young InnoHack's three sessions (keys stored with each registration's availability). */
export const YOUNG_SESSION_KEYS = ['y1', 'y2', 'y3'] as const;
export type YoungSessionKey = (typeof YOUNG_SESSION_KEYS)[number];
export const YOUNG_SESSIONS: Record<YoungSessionKey, { en: string; sv: string; where: { en: string; sv: string } }> = {
  y1: { en: '10 December · Kickoff, 17:00–18:30', sv: '10 december · Kickoff, kl. 17.00–18.30', where: { en: 'online', sv: 'digitalt' } },
  y2: { en: '11 December · Checkpoints and team work', sv: '11 december · Avstämningar och lagarbete', where: { en: 'online', sv: 'digitalt' } },
  y3: { en: '12 December · Finale, 09:00–17:00', sv: '12 december · Final, kl. 09.00–17.00', where: { en: 'at MDU, or online', sv: 'på MDU, eller digitalt' } },
};
const youngSessions = (v: Values): YoungSessionKey[] =>
  (Array.isArray(v.youngSessions) ? v.youngSessions : []).filter((k: string): k is YoungSessionKey => (YOUNG_SESSION_KEYS as readonly string[]).includes(k));
const UNDER_18: ChipOption[] = [
  { value: 'no', en: 'No, 18 or older', sv: 'Nej, 18 år eller äldre' },
  { value: 'yes', en: 'Yes, under 18', sv: 'Ja, under 18 år' },
];
const ATTENDANCE = (L: FormCtx['L']) => ({
  hybrid: L('Hybrid: online on 10–11 December, at MDU on 12 December', 'Hybrid: digitalt 10–11 december, på MDU 12 december'),
  online: L('Fully online, throughout the hackathon', 'Helt digitalt, under hela hackathonet'),
});

/** What stops the form from going to review, in the visitor's words; '' when it is complete. */
export function youngProblem(v: Values, L: FormCtx['L']): string {
  if (!YOUNG_CATEGORIES.some((c) => c.value === v.category))
    return L('Tell us whether you’re at gymnasium, at university or working.', 'Berätta om du går på gymnasiet, pluggar på universitetet eller jobbar.');
  if (v.attendance !== 'hybrid' && v.attendance !== 'online') return L('Choose hybrid or fully online.', 'Välj hybrid eller helt digitalt.');
  if (!youngSessions(v).length) return L('Tick the sessions you can attend.', 'Kryssa i vilka träffar du kan vara med på.');
  if (v.under18 !== 'yes' && v.under18 !== 'no') return L('Tell us whether you’ll be under 18 on 10 December 2026.', 'Berätta om du är under 18 år den 10 december 2026.');
  if (v.under18 === 'yes') {
    const g = str(v.guardianEmail).toLowerCase();
    if (!str(v.guardianName) || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(g))
      return L('Add your parent or guardian’s name and email.', 'Fyll i din förälders eller vårdnadshavares namn och e-post.');
    if (g === str(v.email).toLowerCase()) return L('Use your parent or guardian’s own email, not yours.', 'Använd din förälders eller vårdnadshavares egen e-post, inte din.');
  }
  return '';
}

/** The payload for submit_fut_inno_young_registration. */
export function youngPayload(v: Values, ctx: FormCtx): Record<string, unknown> {
  const team = ctx.path.team ?? 'individual';
  return {
    site: kidSiteKey(ctx),
    language: ctx.language,
    participation: PARTICIPATION[team],
    attendance: v.attendance === 'online' ? 'online' : v.attendance === 'hybrid' ? 'hybrid' : null,
    availability: Object.fromEntries(YOUNG_SESSION_KEYS.map((k) => [k, youngSessions(v).includes(k)])),
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
      under_18: v.under18 === 'yes' ? true : v.under18 === 'no' ? false : null,
    },
    guardian: v.under18 === 'yes' ? { name: str(v.guardianName), email: str(v.guardianEmail), phone: str(v.guardianPhone) } : null,
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
      return L('One of your themes isn’t available any more. Go back and choose again.', 'Ett av dina teman finns inte längre. Gå tillbaka och välj igen.');
    case 'closed':
      return L('Registration for Young InnoHack is closed.', 'Anmälan till Young InnoHack är stängd.');
    case 'hybrid_full':
      return L('All 50 on-campus places are taken. You can still take part fully online.', 'Alla 50 platser på campus är tagna. Du kan fortfarande delta helt digitalt.');
    case 'online_full':
      return L('All 25 online places are taken. You can still take part in the hybrid format.', 'Alla 25 digitala platser är tagna. Du kan fortfarande delta i hybridformatet.');
    case 'teams_full':
      return L('All 15 teams have been started. Join a team with its code, or register on your own.', 'Alla 15 lag är startade. Gå med i ett lag med dess kod, eller anmäl dig själv.');
    case 'guardian':
      return L('Under 18, we need your parent or guardian’s name and their own email.', 'Under 18 år behöver vi din förälders eller vårdnadshavares namn och egen e-post.');
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
      <Section title={L('How you take part', 'Hur du deltar')} icon={CalendarDays} green={false}>
        <ChoiceGroup
          label={L('Hybrid or fully online *', 'Hybrid eller helt digitalt *')}
          accent="hack"
          columns={2}
          value={typeof v.attendance === 'string' ? v.attendance : undefined}
          onChoose={(id) => set('attendance', id)}
          items={[
            { id: 'hybrid', icon: MapPin, title: L('Hybrid', 'Hybrid'), desc: L('Online on 10–11 December, in person at MDU on 12 December. 50 places.', 'Digitalt 10–11 december, på plats på MDU 12 december. 50 platser.') },
            { id: 'online', icon: Laptop, title: L('Fully online', 'Helt digitalt'), desc: L('Remote throughout the hackathon, 10–12 December. 25 places.', 'På distans under hela hackathonet, 10–12 december. 25 platser.') },
          ]}
        />
        <fieldset className="space-y-2">
          <legend className="block text-[15px] font-semibold text-[#0A1930] mb-1.5">{L('Sessions you can attend', 'Träffar du kan vara med på')} *</legend>
          <div className="flex flex-wrap gap-2">
            {YOUNG_SESSION_KEYS.map((key) => {
              const on = youngSessions(v).includes(key);
              const s = YOUNG_SESSIONS[key];
              return (
                <label
                  key={key}
                  className={`inline-flex items-center gap-2 min-h-[40px] px-3 py-2 border-2 text-sm cursor-pointer select-none ${
                    on ? 'border-[#006AA7] bg-[#EEF5FC] text-[#013A63] font-semibold' : 'border-[#E1E7EF] bg-white text-slate-700 hover:border-slate-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => set('youngSessions', YOUNG_SESSION_KEYS.filter((k) => (k === key ? !on : youngSessions(v).includes(k))))}
                    className="w-4 h-4 accent-[#006AA7]"
                  />
                  {L(s.en, s.sv)} · {L(s.where.en, s.where.sv)}
                </label>
              );
            })}
          </div>
        </fieldset>
      </Section>
      <Section title={L('Age', 'Ålder')} icon={ShieldCheck} green={false}>
        <Chips k="under18" v={v} set={set} lang={lang} required label={L('Will you be under 18 on 10 December 2026?', 'Är du under 18 år den 10 december 2026?')} options={UNDER_18} />
        {v.under18 === 'yes' && (
          <>
            <Note>
              {L(
                'Your parent or guardian gets an email with a link to confirm that you may take part, by 10 December 2026 at 12:00 Swedish time.',
                'Din förälder eller vårdnadshavare får ett mejl med en länk för att bekräfta att du får delta, senast den 10 december 2026 kl. 12.00 svensk tid.',
              )}
            </Note>
            <Grid>
              <TextField k="guardianName" v={v} set={set} required maxLength={120} label={L('Parent or guardian’s name', 'Förälderns eller vårdnadshavarens namn')} />
              <TextField k="guardianEmail" v={v} set={set} type="email" required maxLength={254} label={L('Parent or guardian’s email', 'Förälderns eller vårdnadshavarens e-post')} />
              <TextField k="guardianPhone" v={v} set={set} type="tel" maxLength={40} label={L('Parent or guardian’s phone (optional)', 'Förälderns eller vårdnadshavarens telefon (valfritt)')} />
            </Grid>
          </>
        )}
      </Section>
    </>
  );
};

/** On the done screen for someone under 18: their guardian confirms by email. */
const guardianLine = (v: Values, ctx: FormCtx) =>
  v.under18 === 'yes'
    ? ctx.L(
        ` Your parent or guardian (${str(v.guardianEmail)}) now gets an email to confirm by 10 December 2026 at 12:00.`,
        ` Din förälder eller vårdnadshavare (${str(v.guardianEmail)}) får nu ett mejl för att bekräfta senast den 10 december 2026 kl. 12.00.`,
      )
    : '';

export const youngForm: FormDef = {
  fees: false,
  title: (ctx) => ctx.L('About you', 'Om dig'),
  intro: (ctx) =>
    ctx.L(
      'We use this to confirm your place and send you the event details.',
      'Vi använder det för att bekräfta din plats och skicka information om evenemanget.',
    ),
  initial: () => ({ category: '', skills: [], attendance: '', youngSessions: [], under18: '' }),
  Fields: YoungFields,
  validate: (v, ctx) => youngProblem(v, ctx.L),
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
      [L('Taking part', 'Deltar'), v.attendance === 'hybrid' || v.attendance === 'online' ? ATTENDANCE(L)[v.attendance as 'hybrid' | 'online'] : ''],
      [L('Can attend', 'Kan vara med'), youngSessions(v).map((k) => `${L(YOUNG_SESSIONS[k].en, YOUNG_SESSIONS[k].sv)} (${L(YOUNG_SESSIONS[k].where.en, YOUNG_SESSIONS[k].where.sv)})`).join('\n')],
      [L('Under 18', 'Under 18 år'), v.under18 === 'yes' ? L('Yes', 'Ja') : v.under18 === 'no' ? L('No', 'Nej') : ''],
      [L('Parent or guardian', 'Förälder eller vårdnadshavare'), v.under18 === 'yes' ? [str(v.guardianName), str(v.guardianEmail), str(v.guardianPhone)].filter(Boolean).join(' · ') : ''],
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
            `Share the code below with your teammates. We’ll email ${str(v.email)} which theme your team gets.${guardianLine(v, ctx)}`,
            `Dela koden nedan med dina lagkamrater. Vi mejlar ${str(v.email)} vilket tema laget får.${guardianLine(v, ctx)}`,
          )
        : ctx.path.team === 'join'
          ? ctx.L(
              `We’ll email ${str(v.email)} which theme you get. The organisers decide using everyone’s choices.${guardianLine(v, ctx)}`,
              `Vi mejlar ${str(v.email)} vilket tema du får. Arrangörerna bestämmer utifrån allas val.${guardianLine(v, ctx)}`,
            )
          : ctx.L(
              `We’ll email ${str(v.email)} which theme you get. The organisers decide using everyone’s choices, and put you in a team with others.${guardianLine(v, ctx)}`,
              `Vi mejlar ${str(v.email)} vilket tema du får. Arrangörerna bestämmer utifrån allas val och sätter ihop dig med andra i ett lag.${guardianLine(v, ctx)}`,
            ),
  }),
};
