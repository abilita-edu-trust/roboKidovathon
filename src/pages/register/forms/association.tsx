// Group / association demo or workshop request (RoboKidovation, "Association / club").
// Stored as an organisation: registration_type 'school', form_type 'association'.
import React from 'react';
import { Building } from 'lucide-react';
import {
  Chips, FormDef, Grid, LocationFields, Note, Section, TextField,
  byDesign, chipLabels, locationInitial, locationRow, resolveLocation, rows, str, submitRegistration,
  type ChipOption, type FieldsProps,
} from '../ui';
import { DateTimeSection, dateTimeRows, defaultGrade } from './booking';

const ASSOCIATION_WANTS_OPTIONS: ChipOption[] = [
  { value: 'workshop', en: 'Hands-on workshop', sv: 'Praktisk workshop' },
  { value: 'demo', en: 'Robotics demo', sv: 'Robotikdemo' },
  { value: 'competition-teams', en: 'Enter competition teams', sv: 'Anmäla tävlingslag' },
  { value: 'grade-1-2-participants', en: 'Grades 1–2 participant session', sv: 'Deltagarpass för åk 1–2' },
  { value: 'young-inno-hack', en: 'Future InnoHack ideas', sv: 'Idéer till Future InnoHack' },
];

export const ASSOCIATION_TYPE_OPTIONS: ChipOption[] = [
  { value: 'cultural-association', en: 'Cultural association', sv: 'Kulturförening' },
  { value: 'sports-club', en: 'Sports club', sv: 'Idrottsförening' },
  { value: 'study-association', en: 'Study association', sv: 'Studieförbund' },
  { value: 'parent-group', en: 'Parent group', sv: 'Föräldragrupp' },
  { value: 'other', en: 'Other', sv: 'Annat' },
];

const AssociationFields: React.FC<FieldsProps> = (props) => {
  const { v, set, ctx } = props;
  const { L, lang } = ctx;
  return (
    <>
      <LocationFields {...props} />
      <Grid>
        <TextField k="orgName" v={v} set={set} required label={byDesign(ctx, L('Name of the club or association', 'Klubbens eller föreningens namn'), L('Association or group name', 'Förening eller grupp'))} />
        <TextField k="contactName" v={v} set={set} required label={byDesign(ctx, L('Your name', 'Ditt namn'), L('Contact person', 'Kontaktperson'))} placeholder={byDesign(ctx, L('First and last name', 'För- och efternamn'), L('Full name', 'Fullständigt namn'))} />
        <TextField k="email" v={v} set={set} type="email" required label={L('Email', 'E-post')} />
        <TextField k="phone" v={v} set={set} type="tel" label={L('Phone', 'Telefon')} placeholder="+46 70 123 4567" />
      </Grid>
      <Section title={byDesign(ctx, L('About the group', 'Om gruppen'), L('About your group', 'Om er grupp'))} icon={Building}>
        <Chips k="associationType" v={v} set={set} lang={lang} label={byDesign(ctx, L('What kind of group?', 'Vilken sorts grupp?'), L('Type of group', 'Typ av grupp'))} options={ASSOCIATION_TYPE_OPTIONS} />
        <Chips k="associationWants" v={v} set={set} lang={lang} multi required label={byDesign(ctx, L('What would you like to do?', 'Vad vill ni göra?'), L('We would like', 'Vi vill gärna'))} options={ASSOCIATION_WANTS_OPTIONS} />
        <Grid>
          <TextField k="teamCount" v={v} set={set} label={byDesign(ctx, L('Teams in the competition (if any)', 'Lag i tävlingen (om några)'), L('Number of teams (if competing)', 'Antal lag (om ni tävlar)'))} placeholder={L('e.g. 2', 't.ex. 2')} />
        </Grid>
        <Note>
          {byDesign(ctx, L(
            'Grades 1–2 take part without competing. Each association can send up to 4 teams to the final.',
            'Årskurs 1–2 deltar utan att tävla. Varje förening kan skicka upp till 4 lag till finalen.',
          ), L(
            'Grades 1–2 take part as participants, not as a competition category. Up to 4 teams per association qualify for the Final.',
            'Årskurs 1–2 deltar som deltagare, inte som tävlingskategori. Upp till 4 lag per förening går vidare till finalen.',
          ))}
        </Note>
      </Section>
      <DateTimeSection {...props} countLabel={L('Number of children', 'Antal barn')} />
    </>
  );
};

export const associationForm: FormDef = {
  fees: true,
  title: (ctx) => byDesign(ctx, ctx.L('Bring your club along', 'Ta med er förening'), ctx.L('Register your group or association', 'Anmäl er grupp eller förening')),
  intro: (ctx) =>
    byDesign(ctx, ctx.L(
      `For clubs, scouts and parent groups taking part together. ${ctx.site.intake.associationContact.replace(/^./, (c) => c.toUpperCase())} will get in touch to plan it with you.`,
      'För klubbar, scouter och föräldragrupper som deltar tillsammans. Vi hör av oss för att planera det med er.',
    ), ctx.L(
      `For associations, clubs and community groups. Tell us about your group; ${ctx.site.intake.associationContact} will contact you to coordinate.`,
      'För föreningar, klubbar och grupper. Berätta om er grupp så kontaktar vi er för att samordna.',
    )),
  initial: (ctx) => ({
    ...locationInitial(ctx.site),
    startTime: '10:00',
    endTime: '12:30',
    gradeGroup: defaultGrade(ctx),
    studentCount: '25',
    associationWants: ctx.path.activity ? [ctx.path.activity] : [],
  }),
  Fields: AssociationFields,
  validate: (v, ctx) =>
    (v.associationWants ?? []).length === 0 ? byDesign(ctx, ctx.L('Choose at least one thing you’d like to do.', 'Välj minst en sak ni vill göra.'), ctx.L('Choose what your group would like to take part in.', 'Välj vad er grupp vill delta i.')) : '',
  summary: (v, ctx) => {
    const { L, lang } = ctx;
    return [
      ...locationRow(v, ctx),
      ...rows(
        [L('Association', 'Förening'), str(v.orgName)],
        [L('Contact person', 'Kontaktperson'), str(v.contactName)],
        [L('Email', 'E-post'), str(v.email)],
        [L('Phone', 'Telefon'), str(v.phone)],
        [L('Type of group', 'Typ av grupp'), chipLabels(v.associationType, ASSOCIATION_TYPE_OPTIONS, lang)],
        [L('We would like', 'Vi vill gärna'), chipLabels(v.associationWants, ASSOCIATION_WANTS_OPTIONS, lang)],
        [L('Teams', 'Lag'), str(v.teamCount)],
      ),
      ...dateTimeRows(v, ctx),
      ...rows([L('Children', 'Barn'), str(v.studentCount)]),
    ];
  },
  submit: (v, ctx) =>
    submitRegistration({
      language: ctx.language,
      registration_type: 'school',
      ...resolveLocation(v, ctx.site),
      school_name: str(v.orgName),
      team_name: null,
      contact_name: str(v.contactName),
      email: str(v.email),
      phone: str(v.phone),
      category_id: 'association-group-programme',
      student_count: str(v.studentCount),
      preferred_date: `Custom Date: ${v.date}`,
      custom_date: v.date,
      custom_time: v.startTime,
      time_range: `${v.startTime} – ${v.endTime}`,
      workshop_slot: 'custom',
      grade_group: v.gradeGroup,
      consent_agreed: !!v.consentAgreed,
      form_type: 'association',
      intake_details: {
        applicant_kind: 'association',
        association_type: v.associationType ?? '',
        would_like_to: v.associationWants ?? [],
        team_count: str(v.teamCount),
      },
    }, ctx),
  submitLabel: (ctx) => byDesign(ctx, ctx.L('Register the group', 'Anmäl gruppen'), ctx.L('Register group / association', 'Anmäl grupp / förening')),
  done: (ctx, v) => ({
    title: byDesign(ctx, ctx.L('Your group is registered', 'Er grupp är anmäld'), ctx.L('Registration received!', 'Anmälan mottagen!')),
    body: byDesign(ctx, ctx.L(
      `A confirmation is on its way to ${str(v.email)}. ${ctx.site.intake.associationContact.replace(/^./, (c) => c.toUpperCase())} will get in touch to plan it with you.`,
      `En bekräftelse är på väg till ${str(v.email)}. Vi hör av oss för att planera det med er.`,
    ), ctx.L(
      `A receipt is on its way to ${str(v.email)}. ${ctx.site.intake.associationContact.replace(/^./, (c) => c.toUpperCase())} will contact you to coordinate.`,
      `Ett kvitto är på väg till ${str(v.email)}. Vi kontaktar er för att samordna.`,
    )),
  }),
};
