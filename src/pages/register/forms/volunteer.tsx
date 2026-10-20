// Volunteer and mentor sign-ups (Community path). Mentor is the volunteer form with the
// mentor role already chosen. Stored in volunteer_registrations (submit_vfi_volunteer).
import React from 'react';
import { supabase } from '../../../lib/supabase';
import {
  Chips, FormDef, Grid, LocationFields, SelectField, TextArea, TextField,
  chipLabels, locationInitial, locationRow, resolveLocation, rows, str,
  type ChipOption, type FieldsProps, type FormCtx,
} from '../ui';

// Stored values are English and shared with the Fut Inno admin filters.
const VOLUNTEER_EVENTS: ChipOption[] = [
  { value: 'robo-sprint-city-final', en: 'Robo-Sprint City Final (4–5 Dec 2026)', sv: 'Robo-Sprint stadsfinal (4–5 dec 2026)' },
  { value: 'young-inno-hack', en: 'Young Inno Hack (4–5 Dec 2026)', sv: 'Young Inno Hack (4–5 dec 2026)' },
  { value: 'school-workshops-demos', en: 'In-school workshops & demos', sv: 'Workshoppar och demos på skolor' },
  { value: 'any-vfi-event', en: 'Any VFI event', sv: 'Valfritt VFI-evenemang' },
];

const VOLUNTEER_ROLES: ChipOption[] = [
  { value: 'mentor', en: 'Mentor for student teams', sv: 'Mentor för elevlag' },
  { value: 'stage-backstage', en: 'Stage / backstage', sv: 'Scen / backstage' },
  { value: 'registration-desk', en: 'Registration desk', sv: 'Registreringsdisk' },
  { value: 'kids-activities', en: "Kids' activities", sv: 'Aktiviteter för barn' },
  { value: 'food-stalls', en: 'Food stalls', sv: 'Matstånd' },
  { value: 'setup-teardown', en: 'Setup / teardown', sv: 'Uppbyggnad / nedmontering' },
  { value: 'photo-media', en: 'Photo / media', sv: 'Foto / media' },
  { value: 'tech-robotics', en: 'Tech / robotics support', sv: 'Teknik- / robotiksupport' },
];

const AVAILABILITY: ChipOption[] = [
  { value: 'full-day', en: 'Full day', sv: 'Heldag' },
  { value: 'morning', en: 'Morning', sv: 'Förmiddag' },
  { value: 'afternoon', en: 'Afternoon', sv: 'Eftermiddag' },
];

const AGE_GROUPS: ChipOption[] = [
  { value: 'under-18', en: 'Under 18', sv: 'Under 18' },
  { value: '18-plus', en: '18 or older', sv: '18 år eller äldre' },
];

const TSHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const events = (ctx: FormCtx): ChipOption[] => ctx.site.intake.volunteer?.eventOptions ?? VOLUNTEER_EVENTS;
const isMentor = (ctx: FormCtx) => ctx.path.role === 'mentor';
const team = (ctx: FormCtx) => ctx.site.intake.volunteer?.teamName ?? 'VFI';

const VolunteerFields: React.FC<FieldsProps> = (props) => {
  const { v, set, ctx } = props;
  const { L, sv } = ctx;
  return (
    <>
      <Grid>
        <TextField k="contactName" v={v} set={set} required className="sm:col-span-2" label={L('Full name', 'Fullständigt namn')} />
        <TextField k="email" v={v} set={set} type="email" required label={L('Email', 'E-post')} />
        <TextField k="phone" v={v} set={set} type="tel" required label={L('Phone', 'Telefon')} />
      </Grid>
      <Chips k="ageGroup" v={v} set={set} sv={sv} required label={L('Age group', 'Åldersgrupp')} options={AGE_GROUPS} />
      {v.ageGroup === 'under-18' && (
        <div className="p-4 bg-amber-50 border border-amber-200">
          <Grid>
            <TextField k="guardianName" v={v} set={set} required label={L('Parent / guardian name', 'Förälder / vårdnadshavare')} />
            <TextField k="guardianPhone" v={v} set={set} type="tel" required label={L('Parent / guardian phone', 'Vårdnadshavarens telefon')} />
          </Grid>
        </div>
      )}
      <LocationFields {...props} allowCustom={false} />
      <Chips k="events" v={v} set={set} sv={sv} multi required label={L('Which event(s)?', 'Vilket/vilka evenemang?')} options={events(ctx)} />
      <Chips k="roles" v={v} set={set} sv={sv} multi required label={L('Preferred roles', 'Önskade roller')} options={VOLUNTEER_ROLES} />
      <Chips k="availability" v={v} set={set} sv={sv} required label={L('Availability', 'Tillgänglighet')} options={AVAILABILITY} />
      <Grid>
        <TextField k="languages" v={v} set={set} required label={L('Languages spoken', 'Språk du talar')} placeholder={L('e.g. Swedish, English, Hindi', 't.ex. svenska, engelska, hindi')} />
        <SelectField
          k="tshirtSize"
          v={v}
          set={set}
          required
          label={L('T-shirt size', 'T-shirtstorlek')}
          prompt={L('Select size', 'Välj storlek')}
          options={TSHIRT_SIZES.map((s) => ({ value: s, label: s }))}
        />
      </Grid>
      <TextArea
        k="experience"
        v={v}
        set={set}
        required
        label={isMentor(ctx) ? L('Experience you can share with students', 'Erfarenhet du kan dela med eleverna') : L('Previous volunteering experience', 'Tidigare erfarenhet av volontärarbete')}
        placeholder={L('Tell us briefly. Write "None" if this is your first time.', 'Berätta kort. Skriv "Ingen" om det är första gången.')}
      />
    </>
  );
};

const makeForm = (mentor: boolean): FormDef => ({
  title: (ctx) => (mentor ? ctx.L('Become a mentor', 'Bli mentor') : ctx.L('Work as a volunteer', 'Arbeta som volontär')),
  intro: (ctx) =>
    mentor
      ? ctx.L('Support student teams and their projects. All fields are required.', 'Stötta elevlag och deras projekt. Alla fält är obligatoriska.')
      : ctx.site.intake.volunteer
      ? ctx.L(ctx.site.intake.volunteer.intro.en, ctx.site.intake.volunteer.intro.sv)
      : ctx.L(
          'Help us run Västerås Future Innovators events. All fields are required.',
          'Hjälp oss att genomföra Västerås Future Innovators evenemang. Alla fält är obligatoriska.',
        ),
  initial: (ctx) => {
    const options = events(ctx);
    return {
      ...locationInitial(ctx.site),
      // A single event is preselected so the volunteer doesn't have to tick it.
      events: options.length === 1 ? [options[0].value] : [],
      roles: mentor ? ['mentor'] : [],
    };
  },
  Fields: VolunteerFields,
  validate: (v, ctx) => {
    const { L } = ctx;
    if (!v.ageGroup) return L('Please select your age group.', 'Välj din åldersgrupp.');
    if ((v.events ?? []).length === 0) return L('Please select at least one event.', 'Välj minst ett evenemang.');
    if ((v.roles ?? []).length === 0) return L('Please select at least one preferred role.', 'Välj minst en roll.');
    if (!v.availability) return L('Please select your availability.', 'Välj när du är tillgänglig.');
    return '';
  },
  summary: (v, ctx) => {
    const { L, sv } = ctx;
    return [
      ...rows(
        [L('Full name', 'Fullständigt namn'), str(v.contactName)],
        [L('Email', 'E-post'), str(v.email)],
        [L('Phone', 'Telefon'), str(v.phone)],
        [L('Age group', 'Åldersgrupp'), chipLabels(v.ageGroup, AGE_GROUPS, sv)],
        [L('Parent / guardian', 'Vårdnadshavare'), v.ageGroup === 'under-18' ? [str(v.guardianName), str(v.guardianPhone)].filter(Boolean).join(' · ') : ''],
      ),
      ...locationRow(v, ctx),
      ...rows(
        [L('Events', 'Evenemang'), chipLabels(v.events, events(ctx), sv)],
        [L('Roles', 'Roller'), chipLabels(v.roles, VOLUNTEER_ROLES, sv)],
        [L('Availability', 'Tillgänglighet'), chipLabels(v.availability, AVAILABILITY, sv)],
        [L('Languages', 'Språk'), str(v.languages)],
        [L('T-shirt size', 'T-shirtstorlek'), str(v.tshirtSize)],
        [L('Experience', 'Erfarenhet'), str(v.experience)],
      ),
    ];
  },
  submit: async (v, ctx) => {
    const under18 = v.ageGroup === 'under-18';
    const { data, error } = await supabase.rpc('submit_vfi_volunteer', {
      payload: {
        language: ctx.language,
        full_name: str(v.contactName),
        email: str(v.email),
        phone: str(v.phone),
        age_group: v.ageGroup,
        guardian_name: under18 ? str(v.guardianName) : '',
        guardian_phone: under18 ? str(v.guardianPhone) : '',
        ...resolveLocation(v, ctx.site),
        events: v.events ?? [],
        roles: v.roles ?? [],
        availability: v.availability,
        languages: str(v.languages),
        experience: str(v.experience),
        tshirt_size: v.tshirtSize,
        consent_agreed: !!v.consentAgreed,
        gdpr_agreed: !!v.gdprAgreed,
      },
    });
    if (error) throw new Error(error.message || 'Failed to submit');
    return (data as string) || '';
  },
  submitLabel: (ctx) => (mentor ? ctx.L('Send mentor sign-up', 'Skicka mentorsanmälan') : ctx.L('Send volunteer sign-up', 'Skicka volontäranmälan')),
  done: (ctx) => ({
    title: mentor ? ctx.L('Thank you for offering to mentor!', 'Tack för att du vill bli mentor!') : ctx.L('Thank you for volunteering!', 'Tack för att du vill bli volontär!'),
    body: ctx.L(
      `We have received your sign-up. The ${team(ctx)} team will contact you by email with the next steps.`,
      `Vi har tagit emot din anmälan. ${team(ctx)}-teamet kontaktar dig via e-post med nästa steg.`,
    ),
  }),
});

export const volunteerForm = makeForm(false);
export const mentorForm = makeForm(true);
