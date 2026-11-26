// Kid InnoHack (Future InnoHack, vfi and IBK): registration for the programme, 5–12 December 2026. A parent or guardian,
// a teacher or an existing team registers one child or a group of up to four (a team 2–4). No idea is asked: the
// challenges are released at the kickoff and the organisers form five teams of four (up to 20 children). Each child's
// availability for the five sessions helps them. Every child's parent or guardian confirms by email before the child
// can be given a place (submit_fut_inno_kid_innohack saves it as "awaiting guardian confirmation" and emails each
// guardian a link). Public ideas are a separate activity (the idea form).
import React from 'react';
import { CalendarDays, ShieldCheck, Users } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { KID_MAX_CHILDREN, KID_PLACES, KID_REGISTRATION_CLOSE, KID_SESSIONS } from '../../../content/sections/innohack';
import {
  FormDef, Grid, Note, Section, TextField, inputCls, labelCls, rows, str,
  type FieldsProps, type FormCtx, type SetValue, type Values,
} from '../ui';

export type KidSessionKey = 's1' | 's2' | 's3' | 's4' | 's5';
export const KID_SESSION_KEYS = KID_SESSIONS.map((s) => s.key as KidSessionKey);

export interface KidChild {
  full_name: string;
  grade: string;
  guardian_name: string;
  guardian_email: string;
  guardian_phone: string;
  /** The sessions the child can attend (s1–s5). */
  availability: KidSessionKey[];
}
/** individual = a parent or guardian, school = a teacher, team = an existing team (the ids the database stores). */
export type KidRole = 'school' | 'team' | 'individual';
export const KID_GRADES = ['3', '4', '5', '6', '7', '8', '9'];
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const role = (ctx: FormCtx): KidRole => (ctx.path.role === 'school' || ctx.path.role === 'team' ? ctx.path.role : 'individual');

/** How many children one registration may have: an existing team 2–4, a parent or a teacher 1–4. */
export const kidChildLimits = (r: KidRole): { min: number; max: number } =>
  r === 'team' ? { min: 2, max: KID_MAX_CHILDREN } : { min: 1, max: KID_MAX_CHILDREN };

const blankChild = (): KidChild => ({ full_name: '', grade: '', guardian_name: '', guardian_email: '', guardian_phone: '', availability: [] });

export const kidChildren = (x: unknown): KidChild[] =>
  (Array.isArray(x) ? x : []).map((c) => ({
    full_name: str(c?.full_name),
    grade: str(c?.grade),
    guardian_name: str(c?.guardian_name),
    guardian_email: str(c?.guardian_email).toLowerCase(),
    guardian_phone: str(c?.guardian_phone),
    availability: (Array.isArray(c?.availability) ? c.availability : []).filter((k: string) => KID_SESSION_KEYS.includes(k as KidSessionKey)),
  }));

/** A session's short label for the availability boxes: "5 December · Kickoff". */
export const kidSessionLabel = (key: string, L: FormCtx['L']) => {
  const s = KID_SESSIONS.find((x) => x.key === key)!;
  // An empty Swedish text means "the same as the English" (bi), e.g. "Kickoff".
  const both = (b: { en: string; sv: string }) => L(b.en, b.sv || b.en);
  return `${both(s.date).replace(/ \d{4}$/, '')} · ${both(s.title)}`;
};

/** What stops the form from going to review, in the visitor's language; '' when it is complete. */
export function kidProblem(v: Values, r: KidRole, L: FormCtx['L']): string {
  const children = kidChildren(v.children);
  const { min, max } = kidChildLimits(r);
  const named = children.filter((c) => c.full_name);
  if (named.length < min || named.length > max) {
    return min === max ? L('Add the child’s details.', 'Fyll i barnets uppgifter.') : L(`Add ${min}–${max} children.`, `Lägg till ${min}–${max} barn.`);
  }
  for (const [i, c] of named.entries()) {
    const n = i + 1;
    if (!KID_GRADES.includes(c.grade)) return L(`Choose a grade (3–9) for child ${n}.`, `Välj årskurs (3–9) för barn ${n}.`);
    if (!c.guardian_name) return L(`Add the parent or guardian of child ${n}.`, `Fyll i vårdnadshavare för barn ${n}.`);
    if (!EMAIL.test(c.guardian_email)) return L(`Add a valid guardian email for child ${n}.`, `Fyll i en giltig e-post till vårdnadshavaren för barn ${n}.`);
    if (!c.availability.length) return L(`Tick the sessions child ${n} can attend.`, `Kryssa i vilka träffar barn ${n} kan vara med på.`);
  }
  if (!v.guardianNotice) return L('Tick the box about guardian confirmation.', 'Kryssa i rutan om vårdnadshavarnas bekräftelse.');
  return '';
}

/** One row per child: name, grade 3–9, the child's parent or guardian, and the sessions the child can attend. */
const ChildRows: React.FC<{ v: Values; set: SetValue; ctx: FormCtx }> = ({ v, set, ctx }) => {
  const { L } = ctx;
  const { min, max } = kidChildLimits(role(ctx));
  const list: KidChild[] = Array.isArray(v.children) && v.children.length ? kidChildren(v.children) : [blankChild()];
  const update = (i: number, patch: Partial<KidChild>) => set('children', list.map((c, j) => (j === i ? { ...c, ...patch } : c)));
  const toggle = (i: number, key: KidSessionKey) => {
    const has = list[i].availability.includes(key);
    update(i, { availability: KID_SESSION_KEYS.filter((k) => (k === key ? !has : list[i].availability.includes(k))) });
  };
  const field = (i: number, key: 'full_name' | 'guardian_name' | 'guardian_email' | 'guardian_phone', label: string, type = 'text', required = true) => (
    <div>
      <label htmlFor={`kid-${i}-${key}`} className={labelCls}>
        {label} {required && '*'}
      </label>
      <input
        id={`kid-${i}-${key}`}
        type={type}
        required={required}
        value={list[i][key] ?? ''}
        onChange={(e) => update(i, { [key]: e.target.value })}
        maxLength={key === 'guardian_email' ? 254 : 120}
        className={inputCls}
      />
    </div>
  );
  return (
    <div className="space-y-4">
      {list.map((c, i) => (
        <div key={i} className="p-4 bg-white border border-slate-200 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-headline font-bold text-[#0A1930]">{list.length === 1 ? L('The child', 'Barnet') : L(`Child ${i + 1}`, `Barn ${i + 1}`)}</span>
            {list.length > Math.max(min, 1) && (
              <button type="button" onClick={() => set('children', list.filter((__, j) => j !== i))} className="text-sm text-slate-500 hover:text-red-600 hover:underline">
                {L('Remove', 'Ta bort')}
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_9rem] gap-3">
            {field(i, 'full_name', L('Child’s full name', 'Barnets fullständiga namn'))}
            <div>
              <label htmlFor={`kid-${i}-grade`} className={labelCls}>
                {L('Grade', 'Årskurs')} *
              </label>
              <select id={`kid-${i}-grade`} required value={c.grade} onChange={(e) => update(i, { grade: e.target.value })} className={inputCls}>
                <option value="" disabled>
                  {L('Choose', 'Välj')}
                </option>
                {KID_GRADES.map((g) => (
                  <option key={g} value={g}>
                    {L(`Grade ${g}`, `Årskurs ${g}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            {i > 0 && list[0].guardian_email && (
              <button
                type="button"
                onClick={() => update(i, { guardian_name: list[0].guardian_name, guardian_email: list[0].guardian_email, guardian_phone: list[0].guardian_phone })}
                className="text-sm font-semibold text-[#006AA7] hover:underline"
              >
                {L('Same parent or guardian as child 1', 'Samma vårdnadshavare som barn 1')}
              </button>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {field(i, 'guardian_name', L('Parent or guardian', 'Förälder eller vårdnadshavare'))}
              {field(i, 'guardian_email', L('Guardian’s email', 'Vårdnadshavarens e-post'), 'email')}
              {field(i, 'guardian_phone', L('Guardian’s phone', 'Vårdnadshavarens telefon'), 'tel', false)}
            </div>
          </div>
          <fieldset className="space-y-2">
            <legend className={labelCls}>{L('Sessions the child can attend', 'Träffar barnet kan vara med på')} *</legend>
            <div className="flex flex-wrap gap-2">
              {KID_SESSION_KEYS.map((key) => {
                const on = c.availability.includes(key);
                return (
                  <label
                    key={key}
                    className={`inline-flex items-center gap-2 min-h-[40px] px-3 py-2 border-2 text-sm cursor-pointer select-none ${
                      on ? 'border-[#006AA7] bg-[#EEF5FC] text-[#013A63] font-semibold' : 'border-[#E1E7EF] bg-white text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <input type="checkbox" checked={on} onChange={() => toggle(i, key)} className="w-4 h-4 accent-[#006AA7]" />
                    {kidSessionLabel(key, L)}
                  </label>
                );
              })}
            </div>
            {c.availability.length < KID_SESSION_KEYS.length && (
              <button type="button" onClick={() => update(i, { availability: [...KID_SESSION_KEYS] })} className="text-sm font-semibold text-[#006AA7] hover:underline">
                {L('Tick all five', 'Kryssa i alla fem')}
              </button>
            )}
          </fieldset>
        </div>
      ))}
      {list.length < max && (
        <button type="button" onClick={() => set('children', [...list, blankChild()])} className="text-sm font-semibold text-[#006AA7] hover:underline">
          + {L('Add a child', 'Lägg till ett barn')}
        </button>
      )}
    </div>
  );
};

const KidFields: React.FC<FieldsProps> = ({ v, set, ctx }) => {
  const { L } = ctx;
  const r = role(ctx);
  return (
    <>
      <p className="flex flex-wrap gap-x-4 gap-y-1 border-l-4 border-[#FFCD00] bg-[#FFF8E1] px-4 py-3 text-sm font-semibold text-[#0A1930]">
        <span>{L('Free', 'Gratis')}</span>
        <span>{L('5–12 December 2026', '5–12 december 2026')}</span>
        <span>{L(`Up to ${KID_PLACES} children, five teams of four`, `Upp till ${KID_PLACES} barn, fem lag med fyra barn`)}</span>
        <span>{L(`Register by ${KID_REGISTRATION_CLOSE.en}`, `Anmäl senast ${KID_REGISTRATION_CLOSE.sv}`)}</span>
      </p>
      <Section title={r === 'school' ? L('You and your school', 'Du och skolan') : r === 'team' ? L('The team and its contact', 'Laget och dess kontakt') : L('You', 'Du')} icon={Users}>
        <Grid>
          {r === 'team' && <TextField k="teamName" v={v} set={set} required maxLength={120} label={L('Team name', 'Lagnamn')} />}
          <TextField
            k="orgName"
            v={v}
            set={set}
            required={r === 'school'}
            maxLength={200}
            list="registered-schools-list"
            label={r === 'school' ? L('School', 'Skola') : r === 'team' ? L('School or schools (optional)', 'Skola eller skolor (valfritt)') : L('The child’s school (optional)', 'Barnets skola (valfritt)')}
          />
          <TextField
            k="contactName"
            v={v}
            set={set}
            required
            maxLength={120}
            label={r === 'school' ? L('Teacher’s name', 'Lärarens namn') : L('Your name', 'Ditt namn')}
            placeholder={L('Full name', 'Fullständigt namn')}
          />
          <TextField k="email" v={v} set={set} type="email" required maxLength={254} label={L('Your email', 'Din e-post')} />
          <TextField k="phone" v={v} set={set} type="tel" maxLength={40} label={L('Your phone (optional)', 'Din telefon (valfritt)')} placeholder="+46 70 123 4567" />
        </Grid>
      </Section>
      <Section title={r === 'team' ? L('The children (2–4)', 'Barnen (2–4)') : L('The children (1–4)', 'Barnen (1–4)')} icon={CalendarDays}>
        <ChildRows v={v} set={set} ctx={ctx} />
        <Note>
          {r === 'team'
            ? L('We keep an existing team together when we can. Teams have four children, so we may add others.', 'Vi håller ihop ett befintligt lag när vi kan. Lagen har fyra barn, så vi kan lägga till fler.')
            : L('The organisers form five teams of four. Children who can come to all five sessions are easiest to place.', 'Arrangörerna bildar fem lag med fyra barn. Barn som kan komma på alla fem träffarna är lättast att placera.')}
        </Note>
      </Section>
      <Section title={L('Guardian confirmation', 'Vårdnadshavarens bekräftelse')} icon={ShieldCheck}>
        <Note>
          {L(
            `After you send this, each child’s parent or guardian gets an email with a secure link to confirm that the child takes part, by 5 December 2026 at 10:00 Swedish time. There are ${KID_PLACES} places: the organisers confirm each child’s place and team by email after that.`,
            `När du har skickat får varje barns förälder eller vårdnadshavare ett mejl med en säker länk för att bekräfta att barnet deltar, senast den 5 december 2026 kl. 10.00 svensk tid. Det finns ${KID_PLACES} platser: arrangörerna bekräftar sedan varje barns plats och lag via e-post.`,
          )}
        </Note>
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input type="checkbox" checked={!!v.guardianNotice} onChange={(e) => set('guardianNotice', e.target.checked)} className="mt-0.5 w-4 h-4 cursor-pointer accent-[#006AA7]" />
          <span className="text-sm text-slate-700 leading-snug">
            {L(
              'I understand that every child’s parent or guardian must confirm by email, and that the guardian details above are correct. *',
              'Jag förstår att varje barns förälder eller vårdnadshavare måste bekräfta via e-post, och att uppgifterna om vårdnadshavarna ovan stämmer. *',
            )}
          </span>
        </label>
      </Section>
    </>
  );
};

/** The site the form was sent from: the guardian's link opens there (vfi.iniac.se or indiskbarnklubb.se). */
export const kidSiteKey = (ctx: FormCtx): 'vfi' | 'ibk' => (ctx.site.nav.homeRoute === 'ibk' ? 'ibk' : 'vfi');

/** The payload for submit_fut_inno_kid_innohack (a registration for the programme: no idea). */
export function kidPayload(v: Values, ctx: FormCtx): Record<string, unknown> {
  const r = role(ctx);
  return {
    kind: 'participation',
    language: ctx.language,
    site: kidSiteKey(ctx),
    role: r,
    school_name: str(v.orgName),
    team_name: r === 'team' ? str(v.teamName) : '',
    contact_name: str(v.contactName),
    contact_email: str(v.email),
    contact_phone: str(v.phone),
    children: kidChildren(v.children)
      .filter((c) => c.full_name)
      .map(({ availability, ...c }) => ({ ...c, availability: Object.fromEntries(KID_SESSION_KEYS.map((k) => [k, availability.includes(k)])) })),
    consent: { submitter_confirmed: !!v.consentAgreed, privacy_accepted: !!v.gdprAgreed, guardian_notice: !!v.guardianNotice },
  };
}

const ROLE_LABEL: Record<KidRole, [string, string]> = {
  individual: ['A parent or guardian', 'En förälder eller vårdnadshavare'],
  school: ['A teacher', 'En lärare'],
  team: ['An existing team', 'Ett lag som redan finns'],
};

export const kidForm: FormDef = {
  fees: false,
  title: (ctx) => ctx.L('Register for Kid InnoHack', 'Anmäl till Kid InnoHack'),
  intro: (ctx) =>
    ctx.L(
      'Register one child or up to four. You don’t need an idea: the challenges are released at the kickoff on 5 December. Each child’s guardian confirms by email.',
      'Anmäl ett barn eller upp till fyra. Ni behöver ingen idé: utmaningarna presenteras på kickoffen den 5 december. Varje barns vårdnadshavare bekräftar via e-post.',
    ),
  initial: (ctx) => ({ children: Array.from({ length: kidChildLimits(role(ctx)).min }, blankChild), guardianNotice: false }),
  Fields: KidFields,
  validate: (v, ctx) => kidProblem(v, role(ctx), ctx.L),
  summary: (v, ctx) => {
    const { L } = ctx;
    const r = role(ctx);
    const children = kidChildren(v.children).filter((c) => c.full_name);
    return rows(
      [L('Registered by', 'Anmäld av'), L(...ROLE_LABEL[r])],
      [L('Team name', 'Lagnamn'), r === 'team' ? str(v.teamName) : ''],
      [L('School', 'Skola'), str(v.orgName)],
      [L('Contact', 'Kontakt'), [str(v.contactName), str(v.email), str(v.phone)].filter(Boolean).join(' · ')],
      [
        L('Children', 'Barn'),
        children
          .map((c) => `${c.full_name} (${L(`grade ${c.grade}`, `åk ${c.grade}`)}) · ${L('guardian', 'vårdnadshavare')}: ${c.guardian_name}, ${c.guardian_email} · ${L('sessions', 'träffar')}: ${
            c.availability.length === KID_SESSION_KEYS.length ? L('all five', 'alla fem') : c.availability.map((k) => kidSessionLabel(k, L)).join(', ')
          }`)
          .join('\n'),
      ],
    );
  },
  submit: async (v, ctx) => {
    const { data, error } = await supabase.rpc('submit_fut_inno_kid_innohack', { payload: kidPayload(v, ctx) });
    if (error) throw new Error(error.message || 'Failed to submit');
    return str((data as { reference?: string } | null)?.reference);
  },
  submitLabel: (ctx) => ctx.L('Send and email the guardians', 'Skicka och mejla vårdnadshavarna'),
  done: (ctx, v) => ({
    title: ctx.L('Thanks! Now the guardians confirm', 'Tack! Nu bekräftar vårdnadshavarna'),
    body: ctx.L(
      `Each child’s parent or guardian has an email with a link to confirm by 5 December 2026 at 10:00 Swedish time. The organisers then form five teams of four and confirm each child’s place and team by email. A copy is on its way to ${str(v.email)}.`,
      `Varje barns förälder eller vårdnadshavare har fått ett mejl med en länk för att bekräfta senast den 5 december 2026 kl. 10.00 svensk tid. Arrangörerna bildar sedan fem lag med fyra barn och bekräftar varje barns plats och lag via e-post. En kopia är på väg till ${str(v.email)}.`,
    ),
  }),
};
