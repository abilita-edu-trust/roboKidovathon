// RoboKidovation competition entry (new). Schools and associations enter one or more teams;
// an existing team names its members; a parent signs up a child. Stored in registrations as
// form_type 'competition', with the members in intake_details.team_members.
import React from 'react';
import { Trophy } from 'lucide-react';
import { GRADE_GROUP_OPTIONS } from '../../../data/vfiFacts';
import {
  Chips, FormDef, Grid, LocationFields, MemberRows, Note, Section, TextField,
  chipLabels, locationInitial, locationRow, memberRows, namedMembers, resolveLocation, rows, str, submitRegistration,
  type ChipOption, type FieldsProps, type FormCtx,
} from '../ui';

/** Competition categories, stored as the grade group text so the admin's grade stats match. */
const CATEGORY_OPTIONS: ChipOption[] = [
  { value: GRADE_GROUP_OPTIONS[1], en: 'Junior · Grades 3–6', sv: 'Junior · åk 3–6' },
  { value: GRADE_GROUP_OPTIONS[2], en: 'Senior · Grades 7–9', sv: 'Senior · åk 7–9' },
  { value: GRADE_GROUP_OPTIONS[3], en: 'GYM · Upper secondary', sv: 'GYM · gymnasiet' },
];

const role = (ctx: FormCtx) => ctx.path.role;
/** Schools and associations may enter several teams and send the names later. */
const isOrg = (ctx: FormCtx) => role(ctx) === 'school' || role(ctx) === 'association';

const orgLabel = (ctx: FormCtx) => (role(ctx) === 'association' ? ctx.L('Association or club', 'Förening eller klubb') : ctx.L('School', 'Skola'));

const CompetitionFields: React.FC<FieldsProps> = (props) => {
  const { v, set, ctx } = props;
  const { L, sv } = ctx;
  const r = role(ctx);
  return (
    <>
      <LocationFields {...props} />
      <Grid>
        {isOrg(ctx) && (
          <TextField k="orgName" v={v} set={set} required list={r === 'school' ? 'registered-schools-list' : undefined} label={orgLabel(ctx)} />
        )}
        {r === 'team' && <TextField k="teamName" v={v} set={set} required label={L('Team name', 'Lagnamn')} />}
        {r === 'individual' && <TextField k="childName" v={v} set={set} required label={L("Child's name", 'Barnets namn')} placeholder={L('Full name', 'Fullständigt namn')} />}
        <TextField
          k="contactName"
          v={v}
          set={set}
          required
          label={r === 'individual' ? L('Parent / guardian name', 'Vårdnadshavarens namn') : r === 'school' ? L('Teacher / contact person', 'Lärare / kontaktperson') : L('Contact person', 'Kontaktperson')}
          placeholder={L('Full name', 'Fullständigt namn')}
        />
        {(r === 'team' || r === 'individual') && (
          <TextField k="orgName" v={v} set={set} list="registered-schools-list" label={L('School (optional)', 'Skola (frivilligt)')} />
        )}
        <TextField k="email" v={v} set={set} type="email" required label={L('Email', 'E-post')} />
        <TextField k="phone" v={v} set={set} type="tel" required={r === 'individual'} label={L('Phone', 'Telefon')} placeholder="+46 70 123 4567" />
      </Grid>

      <Section title={r === 'individual' ? L('About your child', 'Om ditt barn') : L('Your team', 'Ert lag')} icon={Trophy}>
        <Chips k="category" v={v} set={set} sv={sv} required label={L('Category', 'Kategori')} options={CATEGORY_OPTIONS} />
        {r === 'individual' ? (
          <Grid>
            <TextField k="childGrade" v={v} set={set} label={L('Grade / class', 'Årskurs / klass')} placeholder={L('e.g. Grade 5', 't.ex. åk 5')} />
          </Grid>
        ) : (
          <>
            {isOrg(ctx) && (
              <Grid>
                <TextField k="teamCount" v={v} set={set} type="number" min="1" max="20" required label={L('Number of teams', 'Antal lag')} />
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
                  ? L('Team members (first team, optional: you can send names later)', 'Lagmedlemmar (första laget, frivilligt: namnen kan skickas senare)')
                  : L('Team members', 'Lagmedlemmar') + ' *'
              }
            />
          </>
        )}
        <Note>
          {r === 'individual'
            ? L(
                'We place your child in a team for the qualifiers. Grades 1–2 take part as participants, not as a competition category.',
                'Vi placerar ditt barn i ett lag inför kvalet. Årskurs 1–2 deltar som deltagare, inte som tävlingskategori.',
              )
            : L(
                'Up to 4 teams from each school or association qualify for the Final.',
                'Upp till 4 lag från varje skola eller förening går vidare till finalen.',
              )}
        </Note>
      </Section>
    </>
  );
};

export const competitionForm: FormDef = {
  fees: true,
  title: (ctx) => ctx.L('Competition registration', 'Tävlingsanmälan'),
  intro: (ctx) =>
    role(ctx) === 'individual'
      ? ctx.L('Sign up your child for the RoboKidovation competition. We find them a team.', 'Anmäl ditt barn till RoboKidovation-tävlingen. Vi hittar ett lag åt hen.')
      : ctx.L('Enter your team in the RoboKidovation competition: qualifiers first, then the Final.', 'Anmäl ert lag till RoboKidovation-tävlingen: först kvalet, sedan finalen.'),
  initial: (ctx) => ({
    ...locationInitial(ctx.site),
    teamCount: isOrg(ctx) ? '1' : '',
    members: memberRows(role(ctx) === 'team' ? 2 : 1),
  }),
  Fields: CompetitionFields,
  validate: (v, ctx) => {
    if (!v.category) return ctx.L('Choose a category.', 'Välj en kategori.');
    if (role(ctx) === 'team' && namedMembers(v.members).length === 0) return ctx.L('Add the names of your team members.', 'Lägg till namnen på lagmedlemmarna.');
    return '';
  },
  summary: (v, ctx) => {
    const { L, sv } = ctx;
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
        [L('Category', 'Kategori'), chipLabels(v.category, CATEGORY_OPTIONS, sv)],
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
  submitLabel: (ctx) => ctx.L('Send competition registration', 'Skicka tävlingsanmälan'),
  done: (ctx, v) => ({
    title: ctx.L('Team entry received!', 'Tävlingsanmälan mottagen!'),
    body: ctx.L(
      `A receipt is on its way to ${str(v.email)}. The coordinator reviews your entry and contacts you with the next steps.`,
      `Ett kvitto är på väg till ${str(v.email)}. Samordnaren går igenom anmälan och kontaktar dig med nästa steg.`,
    ),
  }),
};
