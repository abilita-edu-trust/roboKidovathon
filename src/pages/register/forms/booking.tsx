// Demo and workshop requests (RoboKidovation). The answer to "how are you joining" sets the
// mode: a school books for a class; a team or an individual (or parent) also fills the
// interest card and a guardian.
import React from 'react';
import { Calendar, User } from 'lucide-react';
import {
  Chips, FormDef, Grid, LocationFields, Note, Section, SelectField, TextField,
  chipLabels, locationInitial, locationRow, resolveLocation, rows, str, submitRegistration,
  type ChipOption, type FieldsProps, type FormCtx, type Values,
} from '../ui';

/** Options from the printed Interest Card. */
export const WANTS_TO_OPTIONS: ChipOption[] = [
  { value: 'demo', en: 'Try a robotics demo', sv: 'Prova en robotikdemo' },
  { value: 'workshop', en: 'Join a hands-on workshop', sv: 'Delta i en praktisk workshop' },
  { value: 'team', en: 'Join a RoboKidovation team', sv: 'Gå med i ett RoboKidovation-lag' },
  { value: 'final', en: 'Take part in the final', sv: 'Delta i finalen' },
];

const EXPERIENCE_OPTIONS: ChipOption[] = [
  { value: 'first-time', en: 'First time', sv: 'Första gången' },
  { value: 'a-little', en: 'A little', sv: 'Lite erfarenhet' },
  { value: 'built-before', en: 'I have built or coded before', sv: 'Jag har byggt eller programmerat tidigare' },
];

const INTEREST_OPTIONS: ChipOption[] = [
  { value: 'building', en: 'Building', sv: 'Bygga' },
  { value: 'coding', en: 'Coding', sv: 'Programmering' },
  { value: 'engineering', en: 'Engineering', sv: 'Teknik' },
  { value: 'design', en: 'Design', sv: 'Design' },
  { value: 'problem-solving', en: 'Problem-solving', sv: 'Problemlösning' },
];

/** The grade group a form opens with: the RoboKido Junior level when the site runs it. */
export const defaultGrade = (ctx: FormCtx) =>
  ctx.gradeOptions.find((g) => g.startsWith('Årskurs 3–6')) ?? ctx.gradeOptions[0] ?? '';

const isDemo = (ctx: FormCtx) => ctx.path.activity === 'demo';

/** Date, start and end time, grade and head count: shared with the association form. */
export const DateTimeSection: React.FC<FieldsProps & { countLabel?: string }> = ({ v, set, ctx, countLabel }) => {
  const { L } = ctx;
  return (
    <Section title={L('Date & time', 'Datum och tid')} icon={Calendar}>
      <Grid cols={3}>
        <TextField k="date" v={v} set={set} type="date" required label={L('Date', 'Datum')} />
        <TextField k="startTime" v={v} set={set} type="time" required label={L('Start time', 'Starttid')} />
        <TextField k="endTime" v={v} set={set} type="time" required label={L('End time', 'Sluttid')} />
      </Grid>
      <Grid>
        <SelectField k="gradeGroup" v={v} set={set} label={L('Grade', 'Årskurs')} options={ctx.gradeOptions.map((g) => ({ value: g, label: g }))} />
        {countLabel && <TextField k="studentCount" v={v} set={set} label={countLabel} placeholder={L('e.g. 25', 't.ex. 25')} />}
      </Grid>
    </Section>
  );
};

export const dateTimeRows = (v: Values, ctx: FormCtx) => {
  const { L } = ctx;
  return rows(
    [L('Preferred date', 'Önskat datum'), str(v.date)],
    [L('Preferred time', 'Önskad tid'), v.startTime && v.endTime ? `${v.startTime} – ${v.endTime}` : ''],
    [L('Grade', 'Årskurs'), str(v.gradeGroup)],
  );
};

const BookingFields: React.FC<FieldsProps> = (props) => {
  const { v, set, ctx } = props;
  const { L, sv } = ctx;
  const role = ctx.path.role;
  return (
    <>
      <LocationFields {...props} />
      <Grid>
        {role === 'school' && (
          <TextField k="orgName" v={v} set={set} required list="registered-schools-list" label={L('School', 'Skola')} placeholder={L('School name', 'Skolans namn')} />
        )}
        {role === 'team' && <TextField k="teamName" v={v} set={set} required label={L('Team name', 'Lagnamn')} />}
        <TextField
          k="contactName"
          v={v}
          set={set}
          required
          label={role === 'individual' ? L('Student name', 'Elevens namn') : L('Contact person', 'Kontaktperson')}
          placeholder={L('Full name', 'Fullständigt namn')}
        />
        {role === 'team' && (
          <TextField k="orgName" v={v} set={set} list="registered-schools-list" label={L('School (optional)', 'Skola (frivilligt)')} />
        )}
        <TextField k="email" v={v} set={set} type="email" required label={L('Email', 'E-post')} placeholder="contact@school.se" />
        <TextField k="phone" v={v} set={set} type="tel" label={L('Phone', 'Telefon')} placeholder="+46 70 123 4567" />
      </Grid>

      <DateTimeSection
        {...props}
        countLabel={role === 'individual' ? undefined : role === 'team' ? L('Team members', 'Antal i laget') : L('Number of students', 'Antal elever')}
      />

      {role !== 'school' && (
        <Section title={role === 'team' ? L('About the team', 'Om laget') : L('About the student', 'Om eleven')} icon={User}>
          {role === 'individual' && (
            <Grid>
              <TextField k="studentAge" v={v} set={set} type="number" min="6" max="20" label={L('Age', 'Ålder')} />
            </Grid>
          )}
          <Chips k="wantsTo" v={v} set={set} sv={sv} multi label={L('I would like to', 'Jag skulle vilja')} options={WANTS_TO_OPTIONS} />
          <Chips k="experience" v={v} set={set} sv={sv} label={L('Experience', 'Erfarenhet')} options={EXPERIENCE_OPTIONS} />
          <Chips k="interests" v={v} set={set} sv={sv} multi label={L('What interests me', 'Det här intresserar mig')} options={INTEREST_OPTIONS} />
          <div className="pt-2 border-t border-sky-200">
            <Grid>
              <TextField k="guardianName" v={v} set={set} required label={L('Parent / guardian name', 'Vårdnadshavarens namn')} />
              <TextField k="guardianPhone" v={v} set={set} type="tel" required label={L('Parent / guardian phone', 'Vårdnadshavarens telefon')} placeholder="+46 70 123 4567" />
            </Grid>
          </div>
          <Note>{L('Parent/guardian approval is required before final registration.', 'Vårdnadshavarens godkännande krävs innan slutlig registrering.')}</Note>
        </Section>
      )}
    </>
  );
};

export const bookingForm: FormDef = {
  fees: true,
  title: (ctx) => (isDemo(ctx) ? ctx.L('Request a school demo session', 'Boka ett demopass på skolan') : ctx.L('Book a hands-on robotics workshop', 'Boka en praktisk robotikworkshop')),
  intro: (ctx) =>
    isDemo(ctx)
      ? ctx.L(
          'A live robotics demonstration and robot challenge trials in your school hall. Pick the date and time that suit you.',
          'En live-demonstration av robotik och robotutmaningar i skolans aula. Välj det datum och den tid som passar er.',
        )
      : ctx.L(
          'We bring the rover kits, arena mats and the 20-hour curriculum to you. Pick the date and time that suit you.',
          'Vi tar med rover-kit, banor och den 20 timmar långa läroplanen. Välj det datum och den tid som passar er.',
        ),
  initial: (ctx) => ({
    ...locationInitial(ctx.site),
    startTime: '10:00',
    endTime: '12:30',
    gradeGroup: defaultGrade(ctx),
    studentCount: ctx.path.role === 'school' ? '25' : '',
    wantsTo: [ctx.path.activity],
  }),
  Fields: BookingFields,
  summary: (v, ctx) => {
    const { L, sv, path } = ctx;
    const student = path.role !== 'school';
    return [
      ...locationRow(v, ctx),
      ...rows(
        [L('School', 'Skola'), str(v.orgName)],
        [L('Team name', 'Lagnamn'), path.role === 'team' ? str(v.teamName) : ''],
        [path.role === 'individual' ? L('Student name', 'Elevens namn') : L('Contact person', 'Kontaktperson'), str(v.contactName)],
        [L('Email', 'E-post'), str(v.email)],
        [L('Phone', 'Telefon'), str(v.phone)],
      ),
      ...dateTimeRows(v, ctx),
      ...rows(
        [L('Participants', 'Deltagare'), path.role === 'individual' ? '' : str(v.studentCount)],
        student && [L('Age', 'Ålder'), str(v.studentAge)],
        student && [L('Would like to', 'Vill gärna'), chipLabels(v.wantsTo, WANTS_TO_OPTIONS, sv)],
        student && [L('Experience', 'Erfarenhet'), chipLabels(v.experience, EXPERIENCE_OPTIONS, sv)],
        student && [L('Interests', 'Intressen'), chipLabels(v.interests, INTEREST_OPTIONS, sv)],
        student && [L('Parent / guardian', 'Vårdnadshavare'), [str(v.guardianName), str(v.guardianPhone)].filter(Boolean).join(' · ')],
      ),
    ];
  },
  submit: (v, ctx) => {
    const { path, site } = ctx;
    const role = path.role;
    const school = role === 'school';
    return submitRegistration({
      language: ctx.language,
      registration_type: school ? 'school' : 'student',
      ...resolveLocation(v, site),
      school_name: role === 'team' ? `${str(v.teamName)} (Team)` : str(v.orgName),
      team_name: role === 'team' ? str(v.teamName) : null,
      contact_name: str(v.contactName),
      email: str(v.email),
      phone: str(v.phone),
      category_id: path.activity === 'demo' ? 'school-demo-session' : `${site.location?.citySlug ?? 'vasteras'}-school-workshop`,
      student_count: role === 'individual' ? '1' : str(v.studentCount),
      preferred_date: `Custom Date: ${v.date}`,
      custom_date: v.date,
      custom_time: v.startTime,
      time_range: `${v.startTime} – ${v.endTime}`,
      workshop_slot: 'custom',
      grade_group: v.gradeGroup,
      consent_agreed: !!v.consentAgreed,
      form_type: path.activity === 'demo' ? 'demo' : 'workshop',
      intake_details: school
        ? null
        : {
            applicant_kind: role,
            student_age: str(v.studentAge),
            would_like_to: v.wantsTo ?? [],
            experience: v.experience ?? '',
            interests: v.interests ?? [],
            guardian_name: str(v.guardianName),
            guardian_phone: str(v.guardianPhone),
          },
    });
  },
  submitLabel: (ctx) => (isDemo(ctx) ? ctx.L('Request demo session', 'Skicka demoförfrågan') : ctx.L('Send workshop request', 'Skicka workshopförfrågan')),
  done: (ctx, v) => ({
    title: ctx.L('Request received!', 'Förfrågan mottagen!'),
    body: ctx.L(
      `Your request has gone to the city coordinator. A receipt is on its way to ${str(v.email)}, and the coordinator will contact you to confirm.`,
      `Förfrågan har skickats till stadens samordnare. Ett kvitto är på väg till ${str(v.email)}, och samordnaren kontaktar dig för att bekräfta.`,
    ),
  }),
};
