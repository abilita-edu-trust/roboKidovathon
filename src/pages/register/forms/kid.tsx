// Kid InnoHack (Future InnoHack, vfi and IBK): an idea from one child or a team of up to four, sent by a school /
// teacher, a team's contact or a parent. Every child's parent or guardian confirms by email before the idea counts
// (submit_fut_inno_kid_innohack saves it as "awaiting guardian confirmation" and emails each guardian a link).
import React from 'react';
import { Lightbulb, ShieldCheck, Users } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { KID_MAX_CHILDREN } from '../../../content/sections/innohack';
import {
  FormDef, Grid, Note, Section, TextArea, TextField, inputCls, labelCls, rows, str,
  type FieldsProps, type FormCtx, type SetValue, type Values,
} from '../ui';

export interface KidChild {
  full_name: string;
  grade: string;
  guardian_name: string;
  guardian_email: string;
  guardian_phone: string;
}

export type KidRole = 'school' | 'team' | 'individual';

export const KID_GRADES = ['3', '4', '5', '6', '7', '8', '9'];
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const role = (ctx: FormCtx): KidRole => (ctx.path.role === 'school' || ctx.path.role === 'team' ? ctx.path.role : 'individual');

/** How many children a Kid InnoHack idea may have: a team 2–4, an individual 1, a school's idea 1–4. */
export const kidChildLimits = (r: KidRole): { min: number; max: number } =>
  r === 'team' ? { min: 2, max: KID_MAX_CHILDREN } : r === 'individual' ? { min: 1, max: 1 } : { min: 1, max: KID_MAX_CHILDREN };

const blankChild = (): KidChild => ({ full_name: '', grade: '', guardian_name: '', guardian_email: '', guardian_phone: '' });

export const kidChildren = (x: unknown): KidChild[] =>
  (Array.isArray(x) ? x : []).map((c) => ({
    full_name: str(c?.full_name),
    grade: str(c?.grade),
    guardian_name: str(c?.guardian_name),
    guardian_email: str(c?.guardian_email).toLowerCase(),
    guardian_phone: str(c?.guardian_phone),
  }));

/** What stops the form from going to review, in the visitor's language; '' when it is complete. */
export function kidProblem(v: Values, r: KidRole, L: FormCtx['L']): string {
  const children = kidChildren(v.children);
  const { min, max } = kidChildLimits(r);
  const named = children.filter((c) => c.full_name);
  if (named.length < min || named.length > max) {
    return min === max
      ? L('Add the child’s details.', 'Fyll i barnets uppgifter.')
      : L(`Add ${min}–${max} children.`, `Lägg till ${min}–${max} barn.`);
  }
  for (const [i, c] of named.entries()) {
    const n = i + 1;
    if (!KID_GRADES.includes(c.grade)) return L(`Choose a grade (3–9) for child ${n}.`, `Välj årskurs (3–9) för barn ${n}.`);
    if (!c.guardian_name) return L(`Add the parent or guardian of child ${n}.`, `Fyll i vårdnadshavare för barn ${n}.`);
    if (!EMAIL.test(c.guardian_email)) return L(`Add a valid guardian email for child ${n}.`, `Fyll i en giltig e-post till vårdnadshavaren för barn ${n}.`);
  }
  if (!v.guardianNotice) return L('Tick the box about guardian confirmation.', 'Kryssa i rutan om vårdnadshavarnas bekräftelse.');
  return '';
}

/** One row per child: name, grade 3–9 and the child's parent or guardian. */
const ChildRows: React.FC<{ v: Values; set: SetValue; ctx: FormCtx }> = ({ v, set, ctx }) => {
  const { L } = ctx;
  const { min, max } = kidChildLimits(role(ctx));
  const list: KidChild[] = Array.isArray(v.children) && v.children.length ? v.children : [blankChild()];
  const update = (i: number, key: keyof KidChild, value: string) =>
    set('children', list.map((c, j) => (j === i ? { ...c, [key]: value } : c)));
  const field = (i: number, key: keyof KidChild, label: string, type = 'text', required = true) => (
    <div>
      <label htmlFor={`kid-${i}-${key}`} className={labelCls}>
        {label} {required && '*'}
      </label>
      <input
        id={`kid-${i}-${key}`}
        type={type}
        required={required}
        value={list[i][key] ?? ''}
        onChange={(e) => update(i, key, e.target.value)}
        maxLength={key === 'guardian_email' ? 254 : 120}
        className={inputCls}
      />
    </div>
  );
  return (
    <div className="space-y-4">
      {list.map((_, i) => (
        <div key={i} className="p-4 bg-white border border-slate-200 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-headline font-bold uppercase tracking-wider text-[#0A1930]">
              {max === 1 ? L('The child', 'Barnet') : L(`Child ${i + 1}`, `Barn ${i + 1}`)}
            </span>
            {list.length > Math.max(min, 1) && (
              <button
                type="button"
                onClick={() => set('children', list.filter((__, j) => j !== i))}
                className="text-xs font-mono-code text-slate-500 hover:text-red-600 hover:underline"
              >
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
              <select id={`kid-${i}-grade`} required value={list[i].grade} onChange={(e) => update(i, 'grade', e.target.value)} className={inputCls}>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {field(i, 'guardian_name', L('Parent or guardian', 'Förälder eller vårdnadshavare'))}
            {field(i, 'guardian_email', L('Guardian’s email', 'Vårdnadshavarens e-post'), 'email')}
            {field(i, 'guardian_phone', L('Guardian’s phone', 'Vårdnadshavarens telefon'), 'tel', false)}
          </div>
        </div>
      ))}
      {list.length < max && (
        <button type="button" onClick={() => set('children', [...list, blankChild()])} className="text-xs font-mono-code font-bold uppercase text-[#006AA7] hover:underline">
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
      <Grid>
        <TextField k="orgName" v={v} set={set} required list="registered-schools-list" label={r === 'individual' ? L('The child’s school', 'Barnets skola') : L('School', 'Skola')} />
        {r === 'team' && <TextField k="teamName" v={v} set={set} required label={L('Team name', 'Lagnamn')} />}
        <TextField
          k="contactName"
          v={v}
          set={set}
          required
          label={r === 'school' ? L('Teacher’s name', 'Lärarens namn') : L('Your name', 'Ditt namn')}
          placeholder={L('Full name', 'Fullständigt namn')}
        />
        <TextField k="email" v={v} set={set} type="email" required label={L('Your email', 'Din e-post')} />
        <TextField k="phone" v={v} set={set} type="tel" label={L('Your phone', 'Din telefon')} placeholder="+46 70 123 4567" />
      </Grid>

      <Section title={r === 'individual' ? L('The child', 'Barnet') : L('The children (1–4 per idea)', 'Barnen (1–4 per idé)')} icon={Users}>
        <ChildRows v={v} set={set} ctx={ctx} />
      </Section>

      <Section title={L('Your idea', 'Er idé')} icon={Lightbulb}>
        <TextField k="ideaTitle" v={v} set={set} required maxLength={200} label={L('Idea title', 'Idéns titel')} />
        <TextArea k="ideaProblem" v={v} set={set} required rows={3} label={L('What problem does it solve?', 'Vilket problem löser den?')}
          placeholder={L('In school, society, the environment, technology or everyday life.', 'I skolan, samhället, miljön, tekniken eller vardagen.')} />
        <TextArea k="ideaSolution" v={v} set={set} required rows={3} label={L('How would you solve it?', 'Hur skulle ni lösa det?')} />
        <Note>{L('No prototype is needed. Selected ideas get a week of guided mentoring.', 'Ingen prototyp behövs. De utvalda idéerna får en veckas handledning.')}</Note>
      </Section>

      <Section title={L('Guardian confirmation', 'Vårdnadshavarens bekräftelse')} icon={ShieldCheck}>
        <Note>
          {L(
            'After you send this, each child’s parent or guardian gets an email with a secure link to confirm that the child takes part. The idea only counts once every guardian has confirmed, by 5 December 2026 at 10:00 Swedish time. Ideas close on 1 December 2026 at 23:59 Swedish time.',
            'När du har skickat får varje barns förälder eller vårdnadshavare ett e-postmeddelande med en säker länk för att bekräfta att barnet deltar. Idén räknas först när alla vårdnadshavare har bekräftat, senast den 5 december 2026 kl. 10.00 svensk tid. Idéinlämningen stänger den 1 december 2026 kl. 23.59 svensk tid.',
          )}
        </Note>
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input type="checkbox" checked={!!v.guardianNotice} onChange={(e) => set('guardianNotice', e.target.checked)} className="mt-0.5 w-4 h-4 cursor-pointer accent-[#006AA7]" />
          <span className="text-xs text-slate-700 leading-snug">
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

/** The payload for submit_fut_inno_kid_innohack. */
export function kidPayload(v: Values, ctx: FormCtx): Record<string, unknown> {
  const r = role(ctx);
  return {
    language: ctx.language,
    site: kidSiteKey(ctx),
    role: r,
    school_name: str(v.orgName),
    team_name: r === 'team' ? str(v.teamName) : '',
    contact_name: str(v.contactName),
    contact_email: str(v.email),
    contact_phone: str(v.phone),
    children: kidChildren(v.children).filter((c) => c.full_name),
    idea: { title: str(v.ideaTitle), problem: str(v.ideaProblem), solution: str(v.ideaSolution) },
    consent: { submitter_confirmed: !!v.consentAgreed, privacy_accepted: !!v.gdprAgreed, guardian_notice: !!v.guardianNotice },
  };
}

export const kidForm: FormDef = {
  fees: false,
  title: (ctx) => ctx.L('Submit your idea for Kid InnoHack', 'Skicka in din idé till Kid InnoHack'),
  intro: (ctx) =>
    ctx.L(
      'One idea from one child or a team of up to four children in grades 3–9. Every child’s guardian confirms by email.',
      'En idé från ett barn eller ett lag med upp till fyra barn i årskurs 3–9. Varje barns vårdnadshavare bekräftar via e-post.',
    ),
  initial: (ctx) => ({ children: Array.from({ length: kidChildLimits(role(ctx)).min }, blankChild), guardianNotice: false }),
  Fields: KidFields,
  validate: (v, ctx) => kidProblem(v, role(ctx), ctx.L),
  summary: (v, ctx) => {
    const { L } = ctx;
    const children = kidChildren(v.children).filter((c) => c.full_name);
    return rows(
      [L('School', 'Skola'), str(v.orgName)],
      [L('Team name', 'Lagnamn'), role(ctx) === 'team' ? str(v.teamName) : ''],
      [L('Sent by', 'Skickad av'), [str(v.contactName), str(v.email), str(v.phone)].filter(Boolean).join(' · ')],
      [
        L('Children', 'Barn'),
        children.map((c) => `${c.full_name} (${L(`grade ${c.grade}`, `åk ${c.grade}`)}) · ${L('guardian', 'vårdnadshavare')}: ${c.guardian_name}, ${c.guardian_email}`).join('\n'),
      ],
      [L('Idea title', 'Idéns titel'), str(v.ideaTitle)],
      [L('Problem', 'Problem'), str(v.ideaProblem)],
      [L('Solution', 'Lösning'), str(v.ideaSolution)],
    );
  },
  submit: async (v, ctx) => {
    const { data, error } = await supabase.rpc('submit_fut_inno_kid_innohack', { payload: kidPayload(v, ctx) });
    if (error) throw new Error(error.message || 'Failed to submit');
    return str((data as { reference?: string } | null)?.reference);
  },
  submitLabel: (ctx) => ctx.L('Send the idea and email the guardians', 'Skicka idén och mejla vårdnadshavarna'),
  done: (ctx, v) => ({
    title: ctx.L('Idea received: waiting for the guardians', 'Idén är mottagen: väntar på vårdnadshavarna'),
    body: ctx.L(
      `We have emailed each child’s parent or guardian a link to confirm. The idea counts once every guardian has confirmed, by 5 December 2026 at 10:00 Swedish time. A receipt is on its way to ${str(v.email)}.`,
      `Vi har mejlat varje barns förälder eller vårdnadshavare en länk för att bekräfta. Idén räknas när alla vårdnadshavare har bekräftat, senast den 5 december 2026 kl. 10.00 svensk tid. Ett kvitto är på väg till ${str(v.email)}.`,
    ),
  }),
};
