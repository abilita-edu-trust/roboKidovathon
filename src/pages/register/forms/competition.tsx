// RoboKidovation competition entry (new). Schools and associations enter one or more teams;
// an existing team names its members; a parent signs up a child. Stored in registrations as
// form_type 'competition', with the members in intake_details.team_members.
import React from 'react';
import { Trophy } from 'lucide-react';
import { GRADE_GROUP_OPTIONS, VFI_FACTS } from '../../../data/vfiFacts';
import { pick } from '../../../content/core';
import {
  Chips, FormDef, Grid, LocationFields, MemberRows, Note, Section, TextField,
  byDesign, chipLabels, locationInitial, locationRow, memberRows, namedMembers, resolveLocation, rows, str, submitRegistration,
  type ChipOption, type FieldsProps, type FormCtx,
} from '../ui';

/** Competition categories, stored as the grade group text so the admin's grade stats match. */
const CATEGORY_OPTIONS: ChipOption[] = [
  { value: GRADE_GROUP_OPTIONS[1], en: 'Junior · Grades 3–6', sv: 'Junior · åk 3–6' },
  { value: GRADE_GROUP_OPTIONS[2], en: 'Senior · Grades 7–9', sv: 'Senior · åk 7–9' },
  { value: GRADE_GROUP_OPTIONS[3], en: 'GYM · Upper secondary', sv: 'GYM · gymnasiet' },
];

/** The site's competition categories: on vfi and IBK only Junior and Senior compete (Build & Play, preschool–grade 2, has
 *  its own form and replaces GYM there; older GYM registrations keep their grade group). */
export const categoryOptions = (ctx: FormCtx): ChipOption[] => (ctx.site.intake.buildAndPlay ? CATEGORY_OPTIONS.slice(0, 2) : CATEGORY_OPTIONS);

/** vfi and IBK: RoboKidovation's registration deadline, after the form's intro (other cities: nothing). */
export const robokidoDeadline = (ctx: FormCtx) =>
  ctx.site.designV2
    ? ' ' + ctx.L(`Registration closes on ${VFI_FACTS.registrationCloses.en}.`, `Anmälan stänger den ${VFI_FACTS.registrationCloses.sv}.`)
    : '';

const role = (ctx: FormCtx) => ctx.path.role;
/** Schools and associations may enter several teams and send the names later. */
const isOrg = (ctx: FormCtx) => role(ctx) === 'school' || role(ctx) === 'association';

/** "School qualifiers first, then the final on <date> at <venue>": this site's own programme date and place. */
const finalLine = (ctx: FormCtx) => {
  const date = ctx.programme.date ? pick(ctx.programme.date, ctx.lang) : '';
  const venue = ctx.programme.venue ? pick(ctx.programme.venue, ctx.lang) : '';
  const en = `School qualifiers first, then the final${date ? ` on ${date}` : ''}${venue ? ` at ${venue}` : ''}.`;
  const sv = `Först skolkval, sedan finalen${date ? ` den ${date}` : ''}${venue ? ` på ${venue}` : ''}.`;
  return ctx.L(en, sv);
};

const orgLabel = (ctx: FormCtx) => (role(ctx) === 'association' ? ctx.L('Association or club', 'Förening eller klubb') : ctx.L('School', 'Skola'));

const CompetitionFields: React.FC<FieldsProps> = (props) => {
  const { v, set, ctx } = props;
  const { L, lang } = ctx;
  const r = role(ctx);
  return (
    <>
      <LocationFields {...props} />
      <Grid>
        {isOrg(ctx) && (
          <TextField k="orgName" v={v} set={set} required list={r === 'school' ? 'registered-schools-list' : undefined} label={orgLabel(ctx)} />
        )}
        {r === 'team' && <TextField k="teamName" v={v} set={set} required label={L('Team name', 'Lagnamn')} />}
        {r === 'individual' && <TextField k="childName" v={v} set={set} required label={byDesign(ctx, L('Your child’s name', 'Ditt barns namn'), L("Child's name", 'Barnets namn'))} placeholder={byDesign(ctx, L('First and last name', 'För- och efternamn'), L('Full name', 'Fullständigt namn'))} />}
        <TextField
          k="contactName"
          v={v}
          set={set}
          required
          label={byDesign(ctx, r === 'individual' ? L('Your name (parent or guardian)', 'Ditt namn (förälder eller vårdnadshavare)') : r === 'school' ? L('Your name (teacher or contact)', 'Ditt namn (lärare eller kontakt)') : L('Your name', 'Ditt namn'), r === 'individual' ? L('Parent / guardian name', 'Vårdnadshavarens namn') : r === 'school' ? L('Teacher / contact person', 'Lärare / kontaktperson') : L('Contact person', 'Kontaktperson'))}
          placeholder={byDesign(ctx, L('First and last name', 'För- och efternamn'), L('Full name', 'Fullständigt namn'))}
        />
        {(r === 'team' || r === 'individual') && (
          <TextField k="orgName" v={v} set={set} list="registered-schools-list" label={L('School (optional)', 'Skola (frivilligt)')} />
        )}
        <TextField k="email" v={v} set={set} type="email" required label={L('Email', 'E-post')} />
        <TextField k="phone" v={v} set={set} type="tel" required={r === 'individual'} label={L('Phone', 'Telefon')} placeholder="+46 70 123 4567" />
      </Grid>

      <Section title={byDesign(ctx, r === 'individual' ? L('Your child', 'Ditt barn') : isOrg(ctx) ? L('Your teams', 'Era lag') : L('The team', 'Laget'), r === 'individual' ? L('About your child', 'Om ditt barn') : L('Your team', 'Ert lag'))} icon={Trophy}>
        <Chips k="category" v={v} set={set} lang={lang} required label={L('Category', 'Kategori')} options={categoryOptions(ctx)} />
        {r === 'individual' ? (
          <Grid>
            <TextField k="childGrade" v={v} set={set} label={byDesign(ctx, L('Class', 'Klass'), L('Grade / class', 'Årskurs / klass'))} placeholder={byDesign(ctx, L('e.g. 5B', 't.ex. 5B'), L('e.g. Grade 5', 't.ex. åk 5'))} />
          </Grid>
        ) : (
          <>
            {isOrg(ctx) && (
              <Grid>
                <TextField k="teamCount" v={v} set={set} type="number" min="1" max="20" required label={byDesign(ctx, L('How many teams?', 'Hur många lag?'), L('Number of teams', 'Antal lag'))} />
              </Grid>
            )}
            <MemberRows
              k="members"
              v={v}
              set={set}
              L={L}
              min={r === 'team' ? 1 : 0}
              max={6}
              label={
                isOrg(ctx)
                  ? byDesign(ctx, L('Who’s in the first team? (optional; you can send names later)', 'Vilka är med i första laget? (valfritt; namnen kan skickas senare)'), L('Team members (first team, optional: you can send names later)', 'Lagmedlemmar (första laget, frivilligt: namnen kan skickas senare)'))
                  : byDesign(ctx, L('Who’s in the team?', 'Vilka är med i laget?'), L('Team members', 'Lagmedlemmar')) + ' *'
              }
            />
          </>
        )}
        <Note>
          {r === 'individual' && ctx.site.intake.buildAndPlay
            ? L(
                'We find your child a team for the school qualifiers. Younger children (preschool to grade 2) can come to Build & Play with you instead: free, on 5 December 2026.',
                'Vi hittar ett lag åt ditt barn inför skolkvalet. Yngre barn (förskola till årskurs 2) kan i stället komma till Build & Play med dig: gratis, den 5 december 2026.',
              )
            : r === 'individual'
            ? L(
                'We place your child in a team for the qualifiers. Grades 1–2 take part as participants, not as a competition category.',
                'Vi placerar ditt barn i ett lag inför kvalet. Årskurs 1–2 deltar som deltagare, inte som tävlingskategori.',
              )
            : byDesign(ctx, L(
                'Each school or association can send up to 4 teams to the final.',
                'Varje skola eller förening kan skicka upp till 4 lag till finalen.',
              ), L(
                'Up to 4 teams from each school or association qualify for the Final.',
                'Upp till 4 lag från varje skola eller förening går vidare till finalen.',
              ))}
        </Note>
      </Section>
    </>
  );
};

export const competitionForm: FormDef = {
  fees: true,
  title: (ctx) => byDesign(ctx, (role(ctx) === 'individual' ? ctx.L('Sign up your child', 'Anmäl ditt barn') : ctx.L('Enter a team', 'Anmäl ett lag')), ctx.L('Competition registration', 'Tävlingsanmälan')),
  intro: (ctx) =>
    (role(ctx) === 'individual'
      ? byDesign(ctx, ctx.L('For Robo Sprint, grades 3–9. We find your child a team.', 'För Robo Sprint, årskurs 3–9. Vi hittar ett lag åt ditt barn.'), ctx.L('Sign up your child for the RoboKidovation competition. We find them a team.', 'Anmäl ditt barn till RoboKidovation-tävlingen. Vi hittar ett lag åt hen.'))
      : byDesign(ctx, finalLine(ctx), ctx.L('Enter your team in the RoboKidovation competition: qualifiers first, then the Final.', 'Anmäl ert lag till RoboKidovation-tävlingen: först kvalet, sedan finalen.'))) +
    robokidoDeadline(ctx),
  initial: (ctx) => ({
    ...locationInitial(ctx.site),
    teamCount: isOrg(ctx) ? '1' : '',
    members: memberRows(role(ctx) === 'team' ? 2 : 1),
  }),
  Fields: CompetitionFields,
  validate: (v, ctx) => {
    if (!v.category) return byDesign(ctx, ctx.L('Choose Junior or Senior.', 'Välj Junior eller Senior.'), ctx.L('Choose a category.', 'Välj en kategori.'));
    if (role(ctx) === 'team' && namedMembers(v.members).length === 0) return byDesign(ctx, ctx.L('Add at least one name to the team.', 'Lägg till minst ett namn i laget.'), ctx.L('Add the names of your team members.', 'Lägg till namnen på lagmedlemmarna.'));
    return '';
  },
  summary: (v, ctx) => {
    const { L, lang } = ctx;
    const r = role(ctx);
    const members = r === 'individual' ? [] : namedMembers(v.members);
    return [
      ...locationRow(v, ctx),
      ...rows(
        [isOrg(ctx) ? orgLabel(ctx) : L('School', 'Skola'), str(v.orgName)],
        [L('Team name', 'Lagnamn'), r === 'team' ? str(v.teamName) : ''],
        [L("Child's name", 'Barnets namn'), r === 'individual' ? str(v.childName) : ''],
        [r === 'individual' ? L('Parent / guardian', 'Vårdnadshavare') : L('Contact person', 'Kontaktperson'), str(v.contactName)],
        [L('Email', 'E-post'), str(v.email)],
        [L('Phone', 'Telefon'), str(v.phone)],
        [L('Category', 'Kategori'), chipLabels(v.category, categoryOptions(ctx), lang)],
        [L('Grade / class', 'Årskurs / klass'), r === 'individual' ? str(v.childGrade) : ''],
        [L('Number of teams', 'Antal lag'), isOrg(ctx) ? str(v.teamCount) : ''],
        [L('Team members', 'Lagmedlemmar'), members.map((m) => (m.grade ? `${m.full_name} (${m.grade})` : m.full_name)).join(', ')],
      ),
    ];
  },
  submit: (v, ctx) => {
    const r = role(ctx);
    const members = r === 'individual' ? [{ full_name: str(v.childName), grade: str(v.childGrade) }] : namedMembers(v.members);
    return submitRegistration({
      language: ctx.language,
      registration_type: isOrg(ctx) ? 'school' : 'student',
      ...resolveLocation(v, ctx.site),
      school_name: str(v.orgName) || (r === 'team' ? `${str(v.teamName)} (Team)` : ''),
      team_name: r === 'team' ? str(v.teamName) : null,
      contact_name: str(v.contactName),
      email: str(v.email),
      phone: str(v.phone),
      category_id: `${ctx.site.location?.citySlug ?? 'vasteras'}-robokidovation-competition`,
      student_count: members.length ? String(members.length) : '',
      preferred_date: '',
      workshop_slot: '',
      grade_group: v.category,
      consent_agreed: !!v.consentAgreed,
      form_type: 'competition',
      intake_details: {
        applicant_kind: r,
        team_count: isOrg(ctx) ? str(v.teamCount) : '1',
        team_members: members.map((m) => (m.grade ? `${m.full_name} (${m.grade})` : m.full_name)),
      },
    });
  },
  submitLabel: (ctx) => byDesign(ctx, (role(ctx) === 'individual' ? ctx.L('Sign up my child', 'Anmäl mitt barn') : ctx.L('Enter the team', 'Anmäl laget')), ctx.L('Send competition registration', 'Skicka tävlingsanmälan')),
  done: (ctx, v) => ({
    title: byDesign(ctx, role(ctx) === 'individual' ? ctx.L('Your child is signed up', 'Ditt barn är anmält') : ctx.L('Your team is in', 'Ert lag är med'), ctx.L('Team entry received!', 'Tävlingsanmälan mottagen!')),
    body: byDesign(ctx, ctx.L(
      `A confirmation is on its way to ${str(v.email)}. We’ll be in touch before the school qualifiers.`,
      `En bekräftelse är på väg till ${str(v.email)}. Vi hör av oss före skolkvalet.`,
    ), ctx.L(
      `A receipt is on its way to ${str(v.email)}. The coordinator reviews your entry and contacts you with the next steps.`,
      `Ett kvitto är på väg till ${str(v.email)}. Samordnaren går igenom anmälan och kontaktar dig med nästa steg.`,
    )),
  }),
};
