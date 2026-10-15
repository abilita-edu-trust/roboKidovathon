// "Join the community" (new): a short sign-up for news about activities. Stored in
// registrations as form_type 'community', so it shows in the city's entries.
import React from 'react';
import {
  Chips, FormDef, Grid, LocationFields, TextArea, TextField,
  chipLabels, locationInitial, locationRow, resolveLocation, rows, str, submitRegistration,
  type ChipOption, type FieldsProps,
} from '../ui';

const INTEREST_OPTIONS: ChipOption[] = [
  { value: 'robotics', en: 'Robotics', sv: 'Robotik' },
  { value: 'innovation', en: 'Innovation & hackathons', sv: 'Innovation och hackathons' },
  { value: 'events', en: 'Events', sv: 'Evenemang' },
  { value: 'all', en: 'All activities', sv: 'Alla aktiviteter' },
];

const CommunityFields: React.FC<FieldsProps> = (props) => {
  const { v, set, ctx } = props;
  const { L, sv } = ctx;
  return (
    <>
      <Grid>
        <TextField k="contactName" v={v} set={set} required label={L('Full name', 'Fullständigt namn')} />
        <TextField k="email" v={v} set={set} type="email" required label={L('Email', 'E-post')} />
        <TextField k="phone" v={v} set={set} type="tel" label={L('Phone', 'Telefon')} />
        <TextField k="orgName" v={v} set={set} label={L('School or organisation (optional)', 'Skola eller organisation (frivilligt)')} />
      </Grid>
      <LocationFields {...props} />
      <Chips k="interests" v={v} set={set} sv={sv} multi required label={L('What interests you?', 'Vad är du intresserad av?')} options={INTEREST_OPTIONS} />
      <TextArea k="message" v={v} set={set} label={L('Anything you would like to tell us?', 'Något du vill berätta för oss?')} />
    </>
  );
};

export const communityForm: FormDef = {
  title: (ctx) => ctx.L('Join the innovation community', 'Gå med i innovationsgemenskapen'),
  intro: (ctx) =>
    ctx.L(
      'Get news about workshops, competitions, hackathons and ways to help. You can talk to the team about anything specific later.',
      'Få nyheter om workshoppar, tävlingar, hackathons och sätt att hjälpa till. Du kan prata med teamet om något särskilt senare.',
    ),
  initial: (ctx) => locationInitial(ctx.site),
  Fields: CommunityFields,
  validate: (v, ctx) => ((v.interests ?? []).length === 0 ? ctx.L('Choose at least one interest.', 'Välj minst ett intresse.') : ''),
  summary: (v, ctx) => {
    const { L, sv } = ctx;
    return [
      ...rows(
        [L('Full name', 'Fullständigt namn'), str(v.contactName)],
        [L('Email', 'E-post'), str(v.email)],
        [L('Phone', 'Telefon'), str(v.phone)],
        [L('School or organisation', 'Skola eller organisation'), str(v.orgName)],
      ),
      ...locationRow(v, ctx),
      ...rows([L('Interests', 'Intressen'), chipLabels(v.interests, INTEREST_OPTIONS, sv)], [L('Message', 'Meddelande'), str(v.message)]),
    ];
  },
  submit: (v, ctx) =>
    submitRegistration({
      language: ctx.language,
      registration_type: 'student',
      ...resolveLocation(v, ctx.site),
      school_name: str(v.orgName),
      team_name: null,
      contact_name: str(v.contactName),
      email: str(v.email),
      phone: str(v.phone),
      category_id: 'innovation-community',
      student_count: '1',
      preferred_date: '',
      workshop_slot: '',
      consent_agreed: !!v.consentAgreed,
      form_type: 'community',
      intake_details: { interests: v.interests ?? [], message: str(v.message) },
    }),
  submitLabel: (ctx) => ctx.L('Join the community', 'Gå med'),
  done: (ctx, v) => ({
    title: ctx.L('Welcome to the community!', 'Välkommen till gemenskapen!'),
    body: ctx.L(
      `A confirmation is on its way to ${str(v.email)}. We will email you about upcoming activities.`,
      `En bekräftelse är på väg till ${str(v.email)}. Vi mejlar dig om kommande aktiviteter.`,
    ),
  }),
};
