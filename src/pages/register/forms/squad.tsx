// Hackathon squad (Young Inno Hack on vfi, RoboHack on vxo). The challenge area is the theme
// card chosen before the form; individuals may register alone and get matched to a squad.
import React from 'react';
import { Compass, Lightbulb } from 'lucide-react';
import {
  Chips, FormDef, Grid, LocationFields, MemberRows, Note, Section, SelectField, TextArea, TextField,
  chipLabels, locationInitial, locationRow, memberRows, namedMembers, resolveLocation, rows, str, submitRegistration,
  type ChipOption, type FieldsProps, type FormCtx,
} from '../ui';

const SKILL_OPTIONS: ChipOption[] = [
  { value: 'Robotics & Hardware', en: 'Robotics & Hardware', sv: 'Robotik och hårdvara' },
  { value: 'Coding & Software', en: 'Coding & Software', sv: 'Kod och mjukvara' },
  { value: '3D Design & CAD', en: '3D Design & CAD', sv: '3D-design och CAD' },
  { value: 'Pitch & Storytelling', en: 'Pitch & Storytelling', sv: 'Pitch och berättande' },
  { value: 'Science & Research', en: 'Science & Research', sv: 'Naturvetenskap och forskning' },
];

const role = (ctx: FormCtx) => ctx.path.role;
const minMembers = (ctx: FormCtx) => (role(ctx) === 'individual' ? 1 : 2);

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
        <SelectField k="gradeGroup" v={v} set={set} label={L('Grade', 'Årskurs')} options={ctx.gradeOptions.map((g) => ({ value: g, label: L(g, g) }))} />
      </Grid>

      <Section title={L('Squad profile', 'Lagprofil')} icon={Compass} green>
        <MemberRows
          k="members"
          v={v}
          set={set}
          L={L}
          green
          min={minMembers(ctx)}
          max={4}
          label={
            r === 'individual'
              ? L('You (and teammates, if you have any) *', 'Du (och lagkamrater om du har några) *')
              : L('Squad members (2–4) *', 'Lagmedlemmar (2–4) *')
          }
        />
        <Chips k="skills" v={v} set={set} lang={lang} multi green label={L('Squad skills', 'Lagets färdigheter')} options={SKILL_OPTIONS} />
        {r === 'individual' && (
          <Note>{L('No team yet? Register on your own and we help you find teammates.', 'Inget lag än? Anmäl dig själv så hjälper vi dig att hitta lagkamrater.')}</Note>
        )}
      </Section>

      {/* Optional: squads that already have an idea can describe it; everyone else skips this. */}
      <Section title={L('Add your idea (optional)', 'Lägg till din idé (valfritt)')} icon={Lightbulb} green>
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

export const squadForm: FormDef = {
  fees: true,
  title: (ctx) => ctx.L(`Register your squad for ${ctx.site.hackLabel}`, `Anmäl ert lag till ${ctx.site.hackLabel}`),
  intro: (ctx) =>
    ctx.L(
      'Form a squad of 2–4 to tackle real-world challenges in the live arena finals.',
      'Bilda ett lag med 2–4 personer och anta verkliga utmaningar i finalen.',
    ),
  initial: (ctx) => ({
    ...locationInitial(ctx.site),
    gradeGroup: defaultHackGrade(ctx),
    members: memberRows(minMembers(ctx)),
    skills: ['Robotics & Hardware', 'Coding & Software'],
  }),
  Fields: SquadFields,
  validate: (v, ctx) =>
    namedMembers(v.members).length < minMembers(ctx)
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
        [L('Grade', 'Årskurs'), str(v.gradeGroup)],
        [L('Squad members', 'Lagmedlemmar'), namedMembers(v.members).map((m) => (m.grade ? `${m.full_name} (${m.grade})` : m.full_name)).join(', ')],
        [L('Squad skills', 'Lagets färdigheter'), chipLabels(v.skills, SKILL_OPTIONS, lang)],
        [L('Idea', 'Idé'), str(v.idea)],
      ),
    ];
  },
  submit: (v, ctx) => {
    const r = role(ctx);
    const members = namedMembers(v.members).map((m) => ({ full_name: m.full_name, grade: m.grade || null }));
    const teamName = str(v.teamName);
    return submitRegistration({
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
      grade_group: v.gradeGroup,
      consent_agreed: !!v.consentAgreed,
      form_type: 'hackathon',
      intake_details: { squad_skills: v.skills ?? [], challenge_domain: ctx.path.theme ?? '', ...(str(v.idea) ? { idea: str(v.idea) } : {}) },
    });
  },
  submitLabel: (ctx) => ctx.L('Register squad', 'Anmäl laget'),
  done: (ctx, v) => ({
    title: ctx.L('Squad registered!', 'Laget är anmält!'),
    body: ctx.L(
      `A receipt is on its way to ${str(v.email)}. The coordinator reviews your squad and contacts you with the next steps.`,
      `Ett kvitto är på väg till ${str(v.email)}. Samordnaren går igenom er anmälan och kontaktar er med nästa steg.`,
    ),
  }),
};
