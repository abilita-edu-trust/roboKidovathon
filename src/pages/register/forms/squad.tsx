// Hackathon squad (Young InnoHack on vfi and IBK, RoboHack on vxo, Young Inno Hack on Riga). Elsewhere the challenge
// area is the theme card chosen before the form; Young InnoHack instead asks the category (gymnasium, university,
// professional), team preference and interest in the companies' challenges, and is free. Individuals may register
// alone and get matched to a squad.
import React from 'react';
import { Briefcase, Compass, Lightbulb } from 'lucide-react';
import { GRADE_GROUP_OPTIONS, PROFESSIONALS_GRADE_GROUP } from '../../../data/vfiFacts';
import { usePublishedChallenges } from '../../../content/innohackContext';
import {
  Chips, FormDef, Grid, LocationFields, MemberRows, Note, Section, SelectField, TextArea, TextField,
  chipLabels, list, locationInitial, locationRow, memberRows, namedMembers, resolveLocation, rows, str, submitRegistration,
  type ChipOption, type FieldsProps, type FormCtx, type Values,
} from '../ui';

export const SKILL_OPTIONS: ChipOption[] = [
  { value: 'Robotics & Hardware', en: 'Robotics & Hardware', sv: 'Robotik och hårdvara' },
  { value: 'Coding & Software', en: 'Coding & Software', sv: 'Kod och mjukvara' },
  { value: '3D Design & CAD', en: '3D Design & CAD', sv: '3D-design och CAD' },
  { value: 'Pitch & Storytelling', en: 'Pitch & Storytelling', sv: 'Pitch och berättande' },
  { value: 'Science & Research', en: 'Science & Research', sv: 'Naturvetenskap och forskning' },
];

const role = (ctx: FormCtx) => ctx.path.role;
const minMembers = (ctx: FormCtx) => (role(ctx) === 'individual' ? 1 : 2);
/** Young InnoHack (Future InnoHack's track); other hackathons keep the form as it was. */
export const isYoung = (ctx: FormCtx) => ctx.path.track === 'young';

/** Young InnoHack's participant categories, stored as the existing grade groups (professionals: a new one). */
export const YOUNG_CATEGORIES: (ChipOption & { gradeGroup: string })[] = [
  { value: 'gymnasium', en: 'Gymnasium student', sv: 'Gymnasieelev', gradeGroup: GRADE_GROUP_OPTIONS[3] },
  { value: 'university', en: 'University student', sv: 'Universitetsstudent', gradeGroup: GRADE_GROUP_OPTIONS[4] },
  { value: 'professional', en: 'Professional', sv: 'Yrkesverksam', gradeGroup: PROFESSIONALS_GRADE_GROUP },
];

const TEAM_PREFERENCES: ChipOption[] = [
  { value: 'full-team', en: 'We are a full team', sv: 'Vi är ett fullt lag' },
  { value: 'want-members', en: 'We would like more members', sv: 'Vi vill ha fler medlemmar' },
  { value: 'match-me', en: 'Match me with a team', sv: 'Matcha mig med ett lag' },
];

/** Young InnoHack: category, organisation, team preference, challenge interests and experience. */
const YoungFields: React.FC<FieldsProps> = ({ v, set, ctx }) => {
  const { L, lang } = ctx;
  const challenges = usePublishedChallenges();
  const options: ChipOption[] = challenges.map((c) => ({ value: c.title.en || c.company, en: [c.company, c.title.en].filter(Boolean).join(': '), sv: [c.company, c.title.sv || c.title.en].filter(Boolean).join(': ') }));
  return (
    <Section title={L('About you', 'Om dig')} icon={Briefcase} green={false}>
      <Chips k="category" v={v} set={set} lang={lang} required label={L('You are a', 'Du är')} options={YOUNG_CATEGORIES} />
      <Grid>
        {role(ctx) !== 'school' && (
          <TextField k="organisation" v={v} set={set} label={L('School, university or organisation', 'Skola, universitet eller organisation')} />
        )}
        <SelectField k="teamPreference" v={v} set={set} required label={L('Team', 'Lag')} options={TEAM_PREFERENCES.map((o) => ({ value: o.value, label: L(o.en, o.sv) }))} />
      </Grid>
      {options.length > 0 ? (
        <Chips k="challengeInterests" v={v} set={set} lang={lang} multi label={L('Company challenges that interest you', 'Utmaningar från företag som intresserar dig')} options={options} />
      ) : (
        <Note>{L('The six company challenges are revealed at the online kickoff on 10 December 2026. You choose one with your team then.', 'De sex utmaningarna från företag presenteras på den digitala kickoffen den 10 december 2026. Då väljer ni en med ert lag.')}</Note>
      )}
      <TextArea k="experience" v={v} set={set} rows={2} label={L('Skills and experience (optional)', 'Färdigheter och erfarenhet (valfritt)')} />
    </Section>
  );
};

/** The hackathon's youngest level on sites without RoboKidovation, else grade 7–9. */
const defaultHackGrade = (ctx: FormCtx) => ctx.gradeOptions.find((g) => g.startsWith('Årskurs 7–9')) ?? ctx.gradeOptions[0] ?? '';

const SquadFields: React.FC<FieldsProps> = (props) => {
  const { v, set, ctx } = props;
  const { L, lang } = ctx;
  const r = role(ctx);
  return (
    <>
      <LocationFields {...props} />
      <Grid>
        {r === 'school' && <TextField k="orgName" v={v} set={set} required list="registered-schools-list" label={L('School', 'Skola')} />}
        {r === 'team' && <TextField k="teamName" v={v} set={set} required label={L('Team name', 'Lagnamn')} />}
        {r === 'individual' && <TextField k="teamName" v={v} set={set} label={L('Team name (if you have one)', 'Lagnamn (om ni har ett)')} />}
        <TextField
          k="contactName"
          v={v}
          set={set}
          required
          label={r === 'individual' ? L('Your name', 'Ditt namn') : L('Contact person', 'Kontaktperson')}
          placeholder={L('Full name', 'Fullständigt namn')}
        />
        <TextField k="email" v={v} set={set} type="email" required label={L('Email', 'E-post')} />
        <TextField k="phone" v={v} set={set} type="tel" label={L('Phone', 'Telefon')} placeholder="+46 70 123 4567" />
        {!isYoung(ctx) && (
          <SelectField k="gradeGroup" v={v} set={set} label={L('Grade', 'Årskurs')} options={ctx.gradeOptions.map((g) => ({ value: g, label: L(g, g) }))} />
        )}
      </Grid>

      {isYoung(ctx) && <YoungFields {...props} />}

      <Section title={L('Squad profile', 'Lagprofil')} icon={Compass} green={!isYoung(ctx)}>
        <MemberRows
          k="members"
          v={v}
          set={set}
          L={L}
          green={!isYoung(ctx)}
          min={minMembers(ctx)}
          max={4}
          label={
            r === 'individual'
              ? L('You (and teammates, if you have any) *', 'Du (och lagkamrater om du har några) *')
              : L('Squad members (2–4) *', 'Lagmedlemmar (2–4) *')
          }
        />
        <Chips k="skills" v={v} set={set} lang={lang} multi green={!isYoung(ctx)} label={L('Squad skills', 'Lagets färdigheter')} options={SKILL_OPTIONS} />
        {r === 'individual' && (
          <Note>{L('No team yet? Register on your own and we help you find teammates.', 'Inget lag än? Anmäl dig själv så hjälper vi dig att hitta lagkamrater.')}</Note>
        )}
      </Section>

      {/* Optional: squads that already have an idea can describe it; everyone else skips this. */}
      <Section title={L('Add your idea (optional)', 'Lägg till din idé (valfritt)')} icon={Lightbulb} green={!isYoung(ctx)}>
        <TextArea
          k="idea"
          v={v}
          set={set}
          rows={3}
          label={L('Your idea', 'Din idé')}
          placeholder={L(
            'Already have an idea? Describe it in a few lines. You can skip this.',
            'Har ni redan en idé? Beskriv den med några rader. Du kan hoppa över detta.',
          )}
        />
      </Section>
    </>
  );
};

/** The stored grade group: Young InnoHack's category, else the grade chosen in the form. */
const gradeGroupOf = (v: Values, ctx: FormCtx) =>
  isYoung(ctx) ? YOUNG_CATEGORIES.find((c) => c.value === v.category)?.gradeGroup ?? '' : v.gradeGroup;

/** What a squad registration sends to submit_fut_inno_registration (form_type 'hackathon'). */
export function squadPayload(v: Values, ctx: FormCtx): Record<string, unknown> {
  const r = role(ctx);
  const members = namedMembers(v.members).map((m) => ({ full_name: m.full_name, grade: m.grade || null }));
  const teamName = str(v.teamName);
  return {
    language: ctx.language,
    registration_type: r === 'school' ? 'school' : 'student',
    ...resolveLocation(v, ctx.site),
    school_name: r === 'school' ? str(v.orgName) : teamName ? `${teamName} (Team)` : '',
    team_name: r === 'school' ? null : teamName || null,
    contact_name: str(v.contactName),
    email: str(v.email),
    phone: str(v.phone),
    category_id: 'young-innovators-hackathon',
    student_count: String(members.length),
    members,
    preferred_date: 'To be confirmed',
    custom_date: null,
    custom_time: null,
    time_range: null,
    workshop_slot: 'custom',
    grade_group: gradeGroupOf(v, ctx),
    consent_agreed: !!v.consentAgreed,
    form_type: 'hackathon',
    intake_details: isYoung(ctx)
      ? {
          innohack_track: 'young',
          participant_category: str(v.category),
          organisation: str(v.organisation),
          team_preference: str(v.teamPreference),
          challenge_interests: list(v.challengeInterests),
          // The squad view shows the challenge area; Young InnoHack's interests take its place.
          challenge_domain: list(v.challengeInterests).join(', '),
          squad_skills: v.skills ?? [],
          ...(str(v.experience) ? { experience: str(v.experience) } : {}),
          ...(str(v.idea) ? { idea: str(v.idea) } : {}),
        }
      : { squad_skills: v.skills ?? [], challenge_domain: ctx.path.theme ?? '', ...(str(v.idea) ? { idea: str(v.idea) } : {}) },
  };
}

export const squadForm: FormDef = {
  // Young InnoHack is free; other hackathons show the site's fees as before.
  fees: (ctx) => !isYoung(ctx),
  title: (ctx) =>
    isYoung(ctx)
      ? ctx.L('Take part in Young InnoHack', 'Delta i Young InnoHack')
      : ctx.L(`Register your squad for ${ctx.site.hackLabel}`, `Anmäl ert lag till ${ctx.site.hackLabel}`),
  intro: (ctx) =>
    isYoung(ctx)
      ? ctx.L('Come as a team of 2–4, or on your own and we help you find one.', 'Kom som ett lag med 2–4 personer, eller ensam så hjälper vi dig att hitta ett.')
      : ctx.L(
          'Form a squad of 2–4 to tackle real-world challenges in the live arena finals.',
          'Bilda ett lag med 2–4 personer och anta verkliga utmaningar i finalen.',
        ),
  initial: (ctx) =>
    isYoung(ctx)
      ? {
          ...locationInitial(ctx.site),
          members: memberRows(minMembers(ctx)),
          skills: ['Coding & Software', 'Pitch & Storytelling'],
          category: '',
          teamPreference: role(ctx) === 'individual' ? 'match-me' : 'full-team',
          challengeInterests: [],
        }
      : {
          ...locationInitial(ctx.site),
          gradeGroup: defaultHackGrade(ctx),
          members: memberRows(minMembers(ctx)),
          skills: ['Robotics & Hardware', 'Coding & Software'],
        },
  Fields: SquadFields,
  validate: (v, ctx) =>
    isYoung(ctx) && !YOUNG_CATEGORIES.some((c) => c.value === v.category)
      ? ctx.L('Tell us whether you’re at gymnasium, at university or working.', 'Berätta om du går på gymnasiet, pluggar på universitetet eller jobbar.')
      : namedMembers(v.members).length < minMembers(ctx)
      ? minMembers(ctx) === 1
        ? ctx.L('Add your name as the first member.', 'Skriv ditt namn som första medlem.')
        : ctx.L('Add at least 2 squad members with their names.', 'Lägg till minst 2 lagmedlemmar med namn.')
      : '',
  summary: (v, ctx) => {
    const { L, lang } = ctx;
    return [
      ...locationRow(v, ctx),
      ...rows(
        [L('School', 'Skola'), role(ctx) === 'school' ? str(v.orgName) : ''],
        [L('Team name', 'Lagnamn'), role(ctx) === 'school' ? '' : str(v.teamName)],
        [L('Contact person', 'Kontaktperson'), str(v.contactName)],
        [L('Email', 'E-post'), str(v.email)],
        [L('Phone', 'Telefon'), str(v.phone)],
        [L('Grade', 'Årskurs'), isYoung(ctx) ? '' : str(v.gradeGroup)],
        [L('Category', 'Kategori'), isYoung(ctx) ? chipLabels([v.category].filter(Boolean), YOUNG_CATEGORIES, lang) : ''],
        [L('Organisation', 'Organisation'), isYoung(ctx) ? str(v.organisation) : ''],
        [L('Team', 'Lag'), isYoung(ctx) ? chipLabels([v.teamPreference].filter(Boolean), TEAM_PREFERENCES, lang) : ''],
        [L('Challenge interests', 'Intressanta utmaningar'), isYoung(ctx) ? list(v.challengeInterests).join(', ') : ''],
        [L('Skills and experience', 'Färdigheter och erfarenhet'), isYoung(ctx) ? str(v.experience) : ''],
        [L('Squad members', 'Lagmedlemmar'), namedMembers(v.members).map((m) => (m.grade ? `${m.full_name} (${m.grade})` : m.full_name)).join(', ')],
        [L('Squad skills', 'Lagets färdigheter'), chipLabels(v.skills, SKILL_OPTIONS, lang)],
        [L('Idea', 'Idé'), str(v.idea)],
      ),
    ];
  },
  submit: (v, ctx) => submitRegistration(squadPayload(v, ctx), ctx),
  submitLabel: (ctx) => ctx.L('Register squad', 'Anmäl laget'),
  done: (ctx, v) => ({
    title: ctx.L('Squad registered!', 'Laget är anmält!'),
    body: ctx.L(
      `A receipt is on its way to ${str(v.email)}. The coordinator reviews your squad and contacts you with the next steps.`,
      `Ett kvitto är på väg till ${str(v.email)}. Samordnaren går igenom er anmälan och kontaktar er med nästa steg.`,
    ),
  }),
};
