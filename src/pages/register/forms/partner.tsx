// "Become a partner" (Community path; vxo also links straight to it). Stored as a partner
// request for the site's city (submit_fut_inno_partner).
import React from 'react';
import { supabase } from '../../../lib/supabase';
import type { Bilingual } from '../../../context/SiteContext';
import {
  Chips, FormDef, Grid, LocationFields, TextArea, TextField,
  byDesign, chipLabels, locationInitial, locationRow, resolveLocation, rows, str,
  type ChipOption, type FieldsProps, type FormCtx,
} from '../ui';

const DEFAULT_WAYS: Bilingual[] = [
  { en: 'Bringing real-world problem statements', sv: 'Bidra med verkliga problemformuleringar' },
  { en: 'Providing mentors', sv: 'Ställa upp med mentorer' },
  { en: 'Hosting workshops', sv: 'Hålla workshoppar' },
  { en: 'Supporting technology or equipment', sv: 'Bidra med teknik eller utrustning' },
  { en: 'Sponsoring challenges', sv: 'Sponsra utmaningar' },
  { en: 'Supporting girls in STEM', sv: 'Stötta tjejer inom STEM' },
];

/** Stored as the English text, as on the vxo form. */
const ways = (ctx: FormCtx): ChipOption[] => (ctx.site.intake.partnerWays ?? DEFAULT_WAYS).map((w) => ({ value: w.en, en: w.en, sv: w.sv }));

const PartnerFields: React.FC<FieldsProps> = (props) => {
  const { v, set, ctx } = props;
  const { L, lang } = ctx;
  return (
    <>
      <Grid>
        <TextField k="orgName" v={v} set={set} required className="sm:col-span-2" label={L('Company or organisation', 'Företag eller organisation')} />
        <TextField k="contactName" v={v} set={set} required label={L('Contact person', 'Kontaktperson')} />
        <TextField k="email" v={v} set={set} type="email" required label={L('Email', 'E-post')} />
        <TextField k="phone" v={v} set={set} type="tel" label={L('Phone', 'Telefon')} />
        <TextField k="website" v={v} set={set} label={L('Website', 'Webbplats')} />
      </Grid>
      <LocationFields {...props} allowCustom={false} />
      <Chips k="ways" v={v} set={set} lang={lang} multi required label={L('How would you like to take part?', 'Hur vill ni delta?')} options={ways(ctx)} />
      <TextArea k="message" v={v} set={set} rows={4} label={L('Message', 'Meddelande')} />
    </>
  );
};

export const partnerForm: FormDef = {
  title: (ctx) => byDesign(ctx, ctx.L('Partner with us', 'Bli partner'), ctx.L('Become a partner', 'Bli partner')),
  intro: (ctx) =>
    byDesign(ctx, ctx.L(
      'Tell us how your organisation would like to take part: a challenge, mentors, workshops, equipment or sponsorship.',
      'Berätta hur er organisation vill vara med: en utmaning, mentorer, workshoppar, utrustning eller sponsring.',
    ), ctx.L(
      'Bring problem statements, mentors, workshops, equipment or sponsorship. We contact you to talk about how to work together.',
      'Bidra med problemformuleringar, mentorer, workshoppar, utrustning eller sponsring. Vi kontaktar er för att prata om samarbetet.',
    )),
  initial: (ctx) => locationInitial(ctx.site),
  Fields: PartnerFields,
  validate: (v, ctx) => ((v.ways ?? []).length === 0 ? byDesign(ctx, ctx.L('Choose at least one way to take part.', 'Välj minst ett sätt att vara med.'), ctx.L('Please choose at least one way to take part.', 'Välj minst ett sätt att delta.')) : ''),
  summary: (v, ctx) => {
    const { L, lang } = ctx;
    return [
      ...rows(
        [L('Organisation', 'Organisation'), str(v.orgName)],
        [L('Contact person', 'Kontaktperson'), str(v.contactName)],
        [L('Email', 'E-post'), str(v.email)],
        [L('Phone', 'Telefon'), str(v.phone)],
        [L('Website', 'Webbplats'), str(v.website)],
      ),
      ...locationRow(v, ctx),
      ...rows([L('Ways to take part', 'Sätt att delta'), chipLabels(v.ways, ways(ctx), lang)], [L('Message', 'Meddelande'), str(v.message)]),
    ];
  },
  submit: async (v, ctx) => {
    const loc = resolveLocation(v, ctx.site);
    const { data, error } = await supabase.rpc('submit_fut_inno_partner', {
      payload: {
        language: ctx.language,
        country_slug: loc.country_slug,
        city_slug: loc.city_slug,
        organisation: str(v.orgName),
        contact_name: str(v.contactName),
        email: str(v.email),
        phone: str(v.phone),
        website: str(v.website),
        ways_to_help: v.ways ?? [],
        message: str(v.message),
        consent_agreed: !!v.consentAgreed && !!v.gdprAgreed,
      },
    });
    if (error) throw new Error(error.message || 'Failed to submit');
    return (data as string) || '';
  },
  submitLabel: (ctx) => byDesign(ctx, ctx.L('Send to the team', 'Skicka till teamet'), ctx.L('Send partner request', 'Skicka partnerförfrågan')),
  done: (ctx) => ({
    title: byDesign(ctx, ctx.L('Thanks, we’ll get back to you', 'Tack, vi återkommer'), ctx.L('Thank you!', 'Tack!')),
    body: byDesign(ctx, ctx.L('Someone from the team will contact you to talk it through.', 'Någon i teamet kontaktar er för att prata igenom det.'), ctx.L('We have received your partner request and will contact you soon.', 'Vi har tagit emot er partnerförfrågan och kontaktar er snart.')),
  }),
};
