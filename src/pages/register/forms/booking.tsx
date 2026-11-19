// Demo and workshop requests (RoboKidovation). The answer to "how are you joining" sets the
// mode: a school books for a class; a team or an individual (or parent) also fills the
// interest card and a guardian.
import React from 'react';
import { Calendar, User } from 'lucide-react';
import {
  Chips, FormDef, Grid, LocationFields, Note, Section, SelectField, TextField,
  byDesign, chipLabels, locationInitial, locationRow, resolveLocation, rows, str, submitRegistration,
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
    <Section title={byDesign(ctx, L('When suits you?', 'När passar det?'), L('Date & time', 'Datum och tid'))} icon={Calendar}>
      <Grid cols={3}>
        <TextField k="date" v={v} set={set} type="date" required label={byDesign(ctx, L('Preferred date', 'Önskat datum'), L('Date', 'Datum'))} />
        <TextField k="startTime" v={v} set={set} type="time" required label={byDesign(ctx, L('From', 'Från'), L('Start time', 'Starttid'))} />
        <TextField k="endTime" v={v} set={set} type="time" required label={byDesign(ctx, L('To', 'Till'), L('End time', 'Sluttid'))} />
      </Grid>
      <Grid>
        <SelectField k="gradeGroup" v={v} set={set} label={L('Grade', 'Årskurs')} options={ctx.gradeOptions.map((g) => ({ value: g, label: L(g, g) }))} />
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
  const { L, lang } = ctx;
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
          label={byDesign(ctx, role === 'individual' ? L('Child’s name', 'Barnets namn') : L('Your name', 'Ditt namn'), role === 'individual' ? L('Student name', 'Elevens namn') : L('Contact person', 'Kontaktperson'))}
          placeholder={byDesign(ctx, L('First and last name', 'För- och efternamn'), L('Full name', 'Fullständigt namn'))}
        />
        {role === 'team' && (
          <TextField k="orgName" v={v} set={set} list="registered-schools-list" label={L('School (optional)', 'Skola (frivilligt)')} />
        )}
        <TextField k="email" v={v} set={set} type="email" required label={L('Email', 'E-post')} placeholder="contact@school.se" />
        <TextField k="phone" v={v} set={set} type="tel" label={L('Phone', 'Telefon')} placeholder="+46 70 123 4567" />
      </Grid>

      <DateTimeSection
        {...props}
        countLabel={role === 'individual' ? undefined : byDesign(ctx, role === 'team' ? L('How many in the team?', 'Hur många i laget?') : L('How many pupils?', 'Hur många elever?'), role === 'team' ? L('Team members', 'Antal i laget') : L('Number of students', 'Antal elever'))}
      />

      {role !== 'school' && (
        <Section title={role === 'team' ? L('About the team', 'Om laget') : byDesign(ctx, L('About your child', 'Om ditt barn'), L('About the student', 'Om eleven'))} icon={User}>
          {role === 'individual' && (
            <Grid>
              <TextField k="studentAge" v={v} set={set} type="number" min="6" max="20" label={L('Age', 'Ålder')} />
            </Grid>
          )}
          <Chips k="wantsTo" v={v} set={set} lang={lang} multi label={byDesign(ctx, L('Would like to', 'Vill gärna'), L('I would like to', 'Jag skulle vilja'))} options={WANTS_TO_OPTIONS} />
          <Chips k="experience" v={v} set={set} lang={lang} label={L('Experience', 'Erfarenhet')} options={EXPERIENCE_OPTIONS} />
          <Chips k="interests" v={v} set={set} lang={lang} multi label={byDesign(ctx, L('Interested in', 'Intresserad av'), L('What interests me', 'Det här intresserar mig'))} options={INTEREST_OPTIONS} />
          <div className="pt-2 border-t border-sky-200">
            <Grid>
              <TextField k="guardianName" v={v} set={set} required label={L('Parent / guardian name', 'Vårdnadshavarens namn')} />
              <TextField k="guardianPhone" v={v} set={set} type="tel" required label={L('Parent / guardian phone', 'Vårdnadshavarens telefon')} placeholder="+46 70 123 4567" />
            </Grid>
          </div>
          <Note>{byDesign(ctx, L('A parent or guardian approves before the booking is final.', 'En förälder eller vårdnadshavare godkänner innan bokningen blir klar.'), L('Parent/guardian approval is required before final registration.', 'Vårdnadshavarens godkännande krävs innan slutlig registrering.'))}</Note>
        </Section>
      )}
    </>
  );
};

export const bookingForm: FormDef = {
  fees: true,
  title: (ctx) => byDesign(ctx, (isDemo(ctx) ? ctx.L('Ask for a school demo', 'Be om en skoldemo') : ctx.L('Book a robotics workshop', 'Boka en robotikworkshop')), (isDemo(ctx) ? ctx.L('Request a school demo session', 'Boka ett demopass på skolan') : ctx.L('Book a hands-on robotics workshop', 'Boka en praktisk robotikworkshop'))),
  intro: (ctx) =>
    isDemo(ctx)
      ? byDesign(ctx, ctx.L(
          'A short robot show for a class or an assembly, with a few challenges to try.',
          'En kort robotvisning för en klass eller en samling, med några utmaningar att testa.',
        ), ctx.L(
          'A live robotics demonstration and robot challenge trials in your school hall. Pick the date and time that suit you.',
          'En live-demonstration av robotik och robotutmaningar i skolans aula. Välj det datum och den tid som passar er.',
        ))
      : byDesign(ctx, ctx.L(
          'Tell us what suits your class. We bring the kits, the mats and the 20-hour programme.',
          'Berätta vad som passar klassen. Vi tar med kit, banor och programmet på 20 timmar.',
        ), ctx.L(
          'We bring the rover kits, arena mats and the 20-hour curriculum to you. Pick the date and time that suit you.',
          'Vi tar med rover-kit, banor och den 20 timmar långa läroplanen. Välj det datum och den tid som passar er.',
        )),
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
    const { L, lang, path } = ctx;
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
        student && [L('Would like to', 'Vill gärna'), chipLabels(v.wantsTo, WANTS_TO_OPTIONS, lang)],
        student && [L('Experience', 'Erfarenhet'), chipLabels(v.experience, EXPERIENCE_OPTIONS, lang)],
        student && [L('Interests', 'Intressen'), chipLabels(v.interests, INTEREST_OPTIONS, lang)],
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
    }, ctx);
  },
  submitLabel: (ctx) => byDesign(ctx, (isDemo(ctx) ? ctx.L('Ask for a demo', 'Be om en demo') : ctx.L('Send the booking request', 'Skicka bokningsförfrågan')), (isDemo(ctx) ? ctx.L('Request demo session', 'Skicka demoförfrågan') : ctx.L('Send workshop request', 'Skicka workshopförfrågan'))),
  done: (ctx, v) => ({
    title: byDesign(ctx, isDemo(ctx) ? ctx.L('Thanks, we’ll be in touch', 'Tack, vi hör av oss') : ctx.L('Request sent', 'Förfrågan skickad'), ctx.L('Request received!', 'Förfrågan mottagen!')),
    body: byDesign(ctx, ctx.L(
      `A copy is on its way to ${str(v.email)}. We’ll contact you to confirm a date.`,
      `En kopia är på väg till ${str(v.email)}. Vi hör av oss för att bekräfta ett datum.`,
    ), ctx.L(
      `Your request has gone to the city coordinator. A receipt is on its way to ${str(v.email)}, and the coordinator will contact you to confirm.`,
      `Förfrågan har skickats till stadens samordnare. Ett kvitto är på väg till ${str(v.email)}, och samordnaren kontaktar dig för att bekräfta.`,
    )),
  }),
};
