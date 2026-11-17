// RoboKidovation Build & Play (vfi and IBK): children from preschool to grade 2 (also younger than förskoleklass)
// build robots together with a parent or guardian. Free; 5 December 2026 at Mälardalen International School (MISV),
// Västerås; no competition, scoring, judging, rankings or prizes, so no team or category is asked. Stored in
// registrations as form_type 'build-play' with its own grade group (BUILD_PLAY_GRADE_GROUP; historical GYM entries
// keep theirs) and the children and consents in intake_details (no database change: form_type is free text).
import React from 'react';
import { Puzzle, ShieldCheck, Users } from 'lucide-react';
import { BUILD_PLAY_GRADE_GROUP } from '../../../data/vfiFacts';
import {
  FormDef, Grid, Note, Section, TextField, inputCls, labelCls, resolveLocation, rows, str, submitRegistration,
  type FieldsProps, type SetValue, type Values,
} from '../ui';

export interface BuildPlayChild {
  full_name: string;
  grade: string;
}

/** Preschool (younger than förskoleklass), förskoleklass, grade 1 and grade 2. */
export const BUILD_PLAY_GRADES = ['preschool', 'F', '1', '2'];
export const BUILD_PLAY_MAX_CHILDREN = 3;
export const BUILD_PLAY_DATE = { en: '5 December 2026', sv: '5 december 2026' };
export const BUILD_PLAY_VENUE = { en: 'Mälardalen International School (MISV), Västerås', sv: 'Mälardalen International School (MISV), Västerås' };

type Lf = (en: string, sv: string) => string;
export const gradeLabel = (g: string, L: Lf) =>
  g === 'preschool' ? L('Preschool (younger than förskoleklass)', 'Förskola (yngre än förskoleklass)')
    : g === 'F' ? L('Förskoleklass (F)', 'Förskoleklass')
      : L(`Grade ${g}`, `Årskurs ${g}`);
const gradeShort = (g: string, L: Lf) => (g === 'preschool' ? L('preschool', 'förskola') : g === 'F' ? L('förskoleklass', 'förskoleklass') : L(`grade ${g}`, `åk ${g}`));

const blankChild = (): BuildPlayChild => ({ full_name: '', grade: '' });

export const buildPlayChildren = (x: unknown): BuildPlayChild[] =>
  (Array.isArray(x) ? x : []).map((c) => ({ full_name: str(c?.full_name), grade: str(c?.grade) }));

/** The children with a name. */
const named = (v: Values) => buildPlayChildren(v.children).filter((c) => c.full_name);

const ChildRows: React.FC<{ v: Values; set: SetValue; L: Lf }> = ({ v, set, L }) => {
  const list = buildPlayChildren(v.children);
  const children = list.length ? list : [blankChild()];
  const update = (next: BuildPlayChild[]) => set('children', next);
  return (
    <div className="space-y-3">
      {children.map((c, i) => (
        <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_20rem_auto] gap-2 items-end">
          <label className="block">
            <span className={labelCls}>{L(`Child ${i + 1}: name`, `Barn ${i + 1}: namn`)} *</span>
            <input
              id={`reg-child-${i}-name`}
              type="text"
              required
              maxLength={200}
              value={c.full_name}
              onChange={(e) => update(children.map((x, j) => (j === i ? { ...x, full_name: e.target.value } : x)))}
              placeholder={L('Full name', 'Fullständigt namn')}
              className={inputCls}
            />
          </label>
          <label className="block">
            <span className={labelCls}>{L('Age group', 'Ålder / årskurs')} *</span>
            <select
              id={`reg-child-${i}-grade`}
              required
              value={c.grade}
              onChange={(e) => update(children.map((x, j) => (j === i ? { ...x, grade: e.target.value } : x)))}
              className={inputCls}
            >
              <option value="">{L('Choose', 'Välj')}</option>
              {BUILD_PLAY_GRADES.map((g) => (
                <option key={g} value={g}>
                  {gradeLabel(g, L)}
                </option>
              ))}
            </select>
          </label>
          {children.length > 1 && (
            <button
              type="button"
              onClick={() => update(children.filter((_, j) => j !== i))}
              aria-label={L(`Remove child ${i + 1}`, `Ta bort barn ${i + 1}`)}
              className="h-[42px] px-3 border border-slate-300 text-slate-500 hover:text-red-600 hover:border-red-300 text-sm"
            >
              ×
            </button>
          )}
        </div>
      ))}
      {children.length < BUILD_PLAY_MAX_CHILDREN && (
        <button type="button" onClick={() => update([...children, blankChild()])} className="text-xs font-mono-code font-bold uppercase text-[#006AA7] hover:underline">
          + {L('Add another child', 'Lägg till ett barn till')}
        </button>
      )}
    </div>
  );
};

const Check: React.FC<{ k: string; v: Values; set: SetValue; required?: boolean; children: React.ReactNode }> = ({ k, v, set, required, children }) => (
  <label className="flex items-start gap-2.5 cursor-pointer select-none">
    <input
      id={`reg-${k}`}
      type="checkbox"
      required={required}
      checked={!!v[k]}
      onChange={(e) => set(k, e.target.checked)}
      className="mt-0.5 w-4 h-4 shrink-0 cursor-pointer accent-[#006AA7]"
    />
    <span className="text-sm text-slate-700 leading-snug">{children}</span>
  </label>
);

const BuildPlayFields: React.FC<FieldsProps> = ({ v, set, ctx }) => {
  const { L } = ctx;
  return (
    <>
      <p className="flex flex-wrap gap-x-4 gap-y-1 border-l-4 border-[#FFCD00] bg-[#FFF8E1] px-4 py-3 text-sm font-semibold text-[#0A1930]">
        <span>{L('Free participation', 'Gratis deltagande')}</span>
        <span>{L(BUILD_PLAY_DATE.en, BUILD_PLAY_DATE.sv)}</span>
        <span>{L(BUILD_PLAY_VENUE.en, BUILD_PLAY_VENUE.sv)}</span>
      </p>
      <Section title={L('Parent / guardian', 'Förälder / vårdnadshavare')} icon={Users}>
        <Grid>
          <TextField k="contactName" v={v} set={set} required label={L('Your name', 'Ditt namn')} placeholder={L('Full name', 'Fullständigt namn')} />
          <TextField k="email" v={v} set={set} type="email" required label={L('Email', 'E-post')} />
          <TextField k="phone" v={v} set={set} type="tel" required label={L('Phone', 'Telefon')} placeholder="+46 70 123 4567" />
          <TextField k="orgName" v={v} set={set} list="registered-schools-list" label={L("Child's preschool or school (optional)", 'Barnets förskola eller skola (frivilligt)')} />
        </Grid>
      </Section>
      <Section title={L('Your child', 'Ditt barn')} icon={Puzzle}>
        <ChildRows v={v} set={set} L={L} />
        <Note>
          {L(
            'For children from preschool to grade 2, including children younger than förskoleklass. You build robots together: there is no competition, scoring, judging, rankings or prizes, and no previous robotics knowledge is needed.',
            'För barn från förskola till årskurs 2, även barn som är yngre än förskoleklass. Ni bygger robotar tillsammans: det finns ingen tävling, poäng, jury, rankning eller priser, och inga förkunskaper i robotik behövs.',
          )}
        </Note>
      </Section>
      <Section title={L('Accompanying adult and privacy', 'Medföljande vuxen och integritet')} icon={ShieldCheck}>
        <Check k="accompany" v={v} set={set} required>
          {L(
            "I am the child's parent or guardian, and I (or another parent or guardian) will stay with the child during Build & Play. *",
            'Jag är barnets förälder eller vårdnadshavare, och jag (eller en annan förälder eller vårdnadshavare) stannar med barnet under Build & Play. *',
          )}
        </Check>
        <Check k="mediaConsent" v={v} set={set}>
          <strong>{L('Optional: photos and videos. ', 'Frivilligt: foton och filmer. ')}</strong>
          {L(
            'I allow the organisers to publish photos or videos of my child from Build & Play. You can say no and your child still takes part.',
            'Jag tillåter att arrangörerna publicerar foton eller filmer av mitt barn från Build & Play. Du kan säga nej och ditt barn deltar ändå.',
          )}
        </Check>
        <Note>
          {L(
            "We use your contact details and your child's name and age group only to organise Build & Play and to contact you about it. They are not used for marketing or shared outside the organisers, and you can ask us to delete them at any time.",
            'Vi använder dina kontaktuppgifter och ditt barns namn och ålder bara för att organisera Build & Play och kontakta dig om det. De används inte för marknadsföring och lämnas inte ut utanför arrangörerna, och du kan när som helst be oss radera dem.',
          )}
        </Note>
      </Section>
    </>
  );
};

export const buildPlayForm: FormDef = {
  // Build & Play is free: no fees are shown.
  fees: false,
  title: (ctx) => ctx.L('Build & Play registration', 'Anmälan till Build & Play'),
  intro: (ctx) =>
    ctx.L(
      'Sign up for RoboKidovation Build & Play: a free, hands-on robotics activity for a parent and child, from preschool to grade 2.',
      'Anmäl er till RoboKidovation Build & Play: en gratis, praktisk robotikaktivitet för förälder och barn, från förskola till årskurs 2.',
    ),
  initial: () => ({ children: [blankChild()], accompany: false, mediaConsent: false }),
  Fields: BuildPlayFields,
  validate: (v, ctx) => {
    const children = named(v);
    if (!children.length) return ctx.L("Add your child's name.", 'Lägg till ditt barns namn.');
    if (children.some((c) => !BUILD_PLAY_GRADES.includes(c.grade)))
      return ctx.L('Choose an age group for each child: preschool, förskoleklass, grade 1 or grade 2.', 'Välj ålder för varje barn: förskola, förskoleklass, årskurs 1 eller årskurs 2.');
    if (!v.accompany) return ctx.L('Confirm that a parent or guardian stays with the child.', 'Bekräfta att en förälder eller vårdnadshavare stannar med barnet.');
    return '';
  },
  summary: (v, ctx) => {
    const { L } = ctx;
    return rows(
      [L('Fee', 'Avgift'), L('Free', 'Gratis')],
      [L('Parent / guardian', 'Förälder / vårdnadshavare'), str(v.contactName)],
      [L('Email', 'E-post'), str(v.email)],
      [L('Phone', 'Telefon'), str(v.phone)],
      [L("Child's preschool or school", 'Barnets förskola eller skola'), str(v.orgName)],
      [L('Children', 'Barn'), named(v).map((c) => `${c.full_name} (${gradeShort(c.grade, L)})`).join(', ')],
      [L('Accompanied by', 'Medföljande'), v.accompany ? L('A parent or guardian', 'En förälder eller vårdnadshavare') : ''],
      [L('Photos and videos', 'Foton och filmer'), v.mediaConsent ? L('May be published', 'Får publiceras') : L('Not published', 'Publiceras inte')],
    );
  },
  submit: (v, ctx) => {
    const children = named(v);
    return submitRegistration({
      language: ctx.language,
      registration_type: 'student',
      ...resolveLocation({}, ctx.site),
      school_name: str(v.orgName),
      team_name: null,
      contact_name: str(v.contactName),
      email: str(v.email),
      phone: str(v.phone),
      category_id: `${ctx.site.location?.citySlug ?? 'vasteras'}-robokidovation-build-play`,
      student_count: String(children.length),
      // The activity's day, so the receipt and the Admin Panel show it.
      preferred_date: BUILD_PLAY_DATE.en,
      workshop_slot: '',
      grade_group: BUILD_PLAY_GRADE_GROUP,
      consent_agreed: !!v.consentAgreed,
      form_type: 'build-play',
      intake_details: {
        robokido_category: 'build-play',
        applicant_kind: 'parent',
        participation: 'free',
        children,
        team_members: children.map((c) => `${c.full_name} (${gradeShort(c.grade, (en) => en)})`),
        accompanied_by_guardian: !!v.accompany,
        media_consent: !!v.mediaConsent,
      },
    });
  },
  submitLabel: (ctx) => ctx.L('Send Build & Play registration', 'Skicka anmälan till Build & Play'),
  done: (ctx, v) => ({
    title: ctx.L('Build & Play registration received!', 'Anmälan till Build & Play mottagen!'),
    body: ctx.L(
      `See you on 5 December 2026 at Mälardalen International School (MISV), Västerås. Participation is free. A receipt is on its way to ${str(v.email)}.`,
      `Vi ses den 5 december 2026 på Mälardalen International School (MISV) i Västerås. Deltagandet är gratis. Ett kvitto är på väg till ${str(v.email)}.`,
    ),
  }),
};
