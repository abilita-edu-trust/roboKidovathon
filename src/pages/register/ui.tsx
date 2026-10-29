// Building blocks shared by the register forms: one values object per wizard, field
// components bound to it by key, and the contract each form fills in (FormDef).
import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { SiteConfig } from '../../context/SiteContext';
import type { Language } from '../../context/LanguageContext';
import type { RegisterPath, RegisterProgramme } from './flow';
import { COUNTRIES, CITIES_BY_COUNTRY } from './locations';

export type Values = Record<string, any>;
export type SetValue = (key: string, value: unknown) => void;
export type SummaryRow = [label: string, value: string];

export interface FormCtx {
  site: SiteConfig;
  language: Language;
  sv: boolean;
  L: (en: string, sv: string) => string;
  path: RegisterPath;
  programme: RegisterProgramme;
  /** Grade groups for the programmes this site runs. */
  gradeOptions: string[];
}

export interface FieldsProps {
  v: Values;
  set: SetValue;
  ctx: FormCtx;
}

/** One form at the end of the questions. Native `required` covers plain inputs. */
export interface FormDef {
  title: (ctx: FormCtx) => string;
  intro: (ctx: FormCtx) => string;
  /** Values the form opens with, e.g. the activity already chosen. */
  initial?: (ctx: FormCtx) => Values;
  Fields: React.FC<FieldsProps>;
  /** Checks native validation can't do (chip groups, member lists); '' when fine. */
  validate?: (v: Values, ctx: FormCtx) => string;
  summary: (v: Values, ctx: FormCtx) => SummaryRow[];
  /** Sends the entry; returns its reference. v.consentAgreed / v.gdprAgreed are set on Review. */
  submit: (v: Values, ctx: FormCtx) => Promise<string>;
  submitLabel: (ctx: FormCtx) => string;
  done: (ctx: FormCtx, v: Values) => { title: string; body: string };
  /** Show the participation fees under the form (sites with showFees). */
  fees?: boolean;
}

// ── Styles (the register page's own) ──

export const labelCls = 'block text-xs font-headline font-bold uppercase tracking-wider text-slate-700 mb-1';
export const inputCls =
  'w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-[#006AA7] focus:bg-white focus:outline-none text-xs sm:text-sm text-[#0A1930]';

export const str = (x: unknown) => (typeof x === 'string' ? x.trim() : x == null ? '' : String(x));
export const list = (x: unknown): string[] => (Array.isArray(x) ? x : []);

// ── Fields bound to a values key ──

interface BoundProps {
  k: string;
  v: Values;
  set: SetValue;
  label: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export const TextField: React.FC<
  BoundProps & { type?: string; list?: string; min?: string; max?: string; maxLength?: number }
> = ({ k, v, set, label, required, placeholder, className, type = 'text', list: listId, min, max, maxLength }) => (
  <div className={className}>
    <label htmlFor={`reg-${k}`} className={labelCls}>
      {label} {required && '*'}
    </label>
    <input
      id={`reg-${k}`}
      type={type}
      required={required}
      value={v[k] ?? ''}
      onChange={(e) => set(k, e.target.value)}
      placeholder={placeholder}
      list={listId}
      min={min}
      max={max}
      maxLength={maxLength}
      className={inputCls}
    />
  </div>
);

export const TextArea: React.FC<BoundProps & { rows?: number }> = ({ k, v, set, label, required, placeholder, className, rows = 3 }) => (
  <div className={className}>
    <label htmlFor={`reg-${k}`} className={labelCls}>
      {label} {required && '*'}
    </label>
    <textarea
      id={`reg-${k}`}
      rows={rows}
      required={required}
      value={v[k] ?? ''}
      onChange={(e) => set(k, e.target.value)}
      placeholder={placeholder}
      className={inputCls}
    />
  </div>
);

export const SelectField: React.FC<BoundProps & { options: { value: string; label: string }[]; prompt?: string }> = ({
  k, v, set, label, required, className, options, prompt,
}) => (
  <div className={className}>
    <label htmlFor={`reg-${k}`} className={labelCls}>
      {label} {required && '*'}
    </label>
    <select id={`reg-${k}`} required={required} value={v[k] ?? ''} onChange={(e) => set(k, e.target.value)} className={inputCls}>
      {prompt !== undefined && (
        <option value="" disabled>
          {prompt}
        </option>
      )}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

export type ChipOption = { value: string; en: string; sv: string };

/** Toggle chips; `multi` keeps a list, otherwise one value (click again to clear). */
export const Chips: React.FC<{
  k: string;
  v: Values;
  set: SetValue;
  label: string;
  options: ChipOption[];
  sv: boolean;
  multi?: boolean;
  required?: boolean;
  green?: boolean;
}> = ({ k, v, set, label, options, sv, multi, required, green }) => {
  const on = green ? 'bg-[#059669] border-[#059669]' : 'bg-[#006AA7] border-[#006AA7]';
  const selected = multi ? list(v[k]) : v[k] ? [v[k]] : [];
  const toggle = (value: string) => {
    if (multi) set(k, selected.includes(value) ? selected.filter((x) => x !== value) : [...selected, value]);
    else set(k, v[k] === value ? '' : value);
  };
  return (
    <div>
      <span className="block text-xs font-headline font-bold uppercase tracking-wider text-slate-700 mb-2">
        {label} {required && '*'}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = selected.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => toggle(o.value)}
              aria-pressed={active}
              className={`py-1.5 px-3 text-xs border transition-all text-left ${
                active ? `${on} text-white font-bold` : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {sv ? o.sv : o.en}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/** A tinted box with a small heading, as on the old forms. */
export const Section: React.FC<{ title: string; icon: LucideIcon; green?: boolean; children: React.ReactNode }> = ({
  title, icon: Icon, green, children,
}) => (
  <div className={`p-4 border space-y-4 ${green ? 'bg-emerald-50/50 border-emerald-200' : 'bg-sky-50/50 border-sky-200'}`}>
    <div className={`flex items-center gap-2 text-xs font-headline font-bold uppercase tracking-wider ${green ? 'text-[#059669]' : 'text-[#006AA7]'}`}>
      <Icon className="w-4 h-4" />
      <span>{title}</span>
    </div>
    {children}
  </div>
);

export const Grid: React.FC<{ cols?: 2 | 3; children: React.ReactNode }> = ({ cols = 2, children }) => (
  <div className={`grid grid-cols-1 gap-4 ${cols === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>{children}</div>
);

export const Note: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[13px] text-slate-600 italic leading-relaxed">{children}</p>
);

// ── Name + grade rows (hackathon squads, competition teams) ──

export type Member = { full_name: string; grade: string };

export const namedMembers = (x: unknown): Member[] =>
  (Array.isArray(x) ? (x as Member[]) : [])
    .map((m) => ({ full_name: str(m?.full_name), grade: str(m?.grade) }))
    .filter((m) => m.full_name);

export const MemberRows: React.FC<{
  k: string;
  v: Values;
  set: SetValue;
  label: string;
  min: number;
  max: number;
  L: FormCtx['L'];
  green?: boolean;
}> = ({ k, v, set, label, min, max, L, green }) => {
  const rows: Member[] = Array.isArray(v[k]) && v[k].length ? v[k] : [{ full_name: '', grade: '' }];
  const update = (next: Member[]) => set(k, next);
  const focus = green ? 'focus:border-emerald-600' : 'focus:border-[#006AA7]';
  return (
    <div className="space-y-2">
      <span className={labelCls}>{label}</span>
      {rows.map((m, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            value={m.full_name}
            onChange={(e) => update(rows.map((r, j) => (j === i ? { ...r, full_name: e.target.value } : r)))}
            placeholder={L(`Member ${i + 1}: full name`, `Medlem ${i + 1}: fullständigt namn`)}
            aria-label={L(`Member ${i + 1} name`, `Medlem ${i + 1} namn`)}
            maxLength={200}
            className={`flex-1 px-3.5 py-2.5 bg-white border border-slate-300 ${focus} focus:outline-none text-xs sm:text-sm text-[#0A1930]`}
          />
          <input
            type="text"
            value={m.grade}
            onChange={(e) => update(rows.map((r, j) => (j === i ? { ...r, grade: e.target.value } : r)))}
            placeholder={L('Grade', 'Åk')}
            aria-label={L(`Member ${i + 1} grade`, `Medlem ${i + 1} årskurs`)}
            maxLength={50}
            className={`w-28 sm:w-32 px-3 py-2.5 bg-white border border-slate-300 ${focus} focus:outline-none text-xs sm:text-sm text-[#0A1930]`}
          />
          {rows.length > Math.max(min, 1) && (
            <button
              type="button"
              onClick={() => update(rows.filter((_, j) => j !== i))}
              aria-label={L(`Remove member ${i + 1}`, `Ta bort medlem ${i + 1}`)}
              title={L('Remove', 'Ta bort')}
              className="px-3 border border-slate-300 text-slate-500 hover:text-red-600 hover:border-red-300 text-sm"
            >
              ×
            </button>
          )}
        </div>
      ))}
      {rows.length < max && (
        <button
          type="button"
          onClick={() => update([...rows, { full_name: '', grade: '' }])}
          className={`text-xs font-mono-code font-bold uppercase hover:underline ${green ? 'text-emerald-700' : 'text-[#006AA7]'}`}
        >
          + {L('Add member', 'Lägg till medlem')}
        </button>
      )}
    </div>
  );
};

export const memberRows = (n: number): Member[] => Array.from({ length: n }, () => ({ full_name: '', grade: '' }));

// ── Location: city sites are locked to their city; the VFI site asks ──

/** Initial location values for an unlocked site. */
export const locationInitial = (site: SiteConfig): Values =>
  site.location ? {} : { countrySlug: 'sweden', citySlug: 'vasteras', customCity: '' };

export const LocationFields: React.FC<FieldsProps & { allowCustom?: boolean }> = ({ v, set, ctx, allowCustom = true }) => {
  const { L, site } = ctx;
  if (site.location) return null;
  const cities = CITIES_BY_COUNTRY[v.countrySlug] || [];
  const changeCountry = (slug: string) => {
    set('countrySlug', slug);
    set('citySlug', (CITIES_BY_COUNTRY[slug] || [])[0]?.slug ?? (allowCustom ? 'custom' : ''));
  };
  return (
    <Grid>
      <div>
        <label htmlFor="reg-country" className={labelCls}>
          {L('Country', 'Land')} *
        </label>
        <select id="reg-country" required value={v.countrySlug ?? 'sweden'} onChange={(e) => changeCountry(e.target.value)} className={inputCls}>
          {COUNTRIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="reg-city" className={labelCls}>
          {L('City', 'Stad')} *
        </label>
        <select id="reg-city" required value={v.citySlug ?? ''} onChange={(e) => set('citySlug', e.target.value)} className={inputCls}>
          {cities.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
          {allowCustom && <option value="custom">{L('+ Other city…', '+ Annan stad…')}</option>}
        </select>
        {allowCustom && v.citySlug === 'custom' && (
          <input
            type="text"
            required
            value={v.customCity ?? ''}
            onChange={(e) => set('customCity', e.target.value)}
            placeholder={L('City name', 'Stadens namn')}
            aria-label={L('City name', 'Stadens namn')}
            className={`${inputCls} mt-2`}
          />
        )}
      </div>
    </Grid>
  );
};

export interface ResolvedLocation {
  country_slug: string;
  city_slug: string;
  country_name: string;
  city_name: string;
}

export function resolveLocation(v: Values, site: SiteConfig): ResolvedLocation {
  if (site.location) {
    const l = site.location;
    return { country_slug: l.countrySlug, city_slug: l.citySlug, country_name: l.countryName, city_name: l.cityName };
  }
  const country = v.countrySlug || 'sweden';
  const city = v.citySlug || 'vasteras';
  return {
    country_slug: country,
    city_slug: city,
    country_name: COUNTRIES.find((c) => c.slug === country)?.name ?? country,
    city_name: city === 'custom' ? str(v.customCity) || 'Custom City' : CITIES_BY_COUNTRY[country]?.find((c) => c.slug === city)?.name ?? city,
  };
}

/** The review row for the location (unlocked sites only). */
export const locationRow = (v: Values, ctx: FormCtx): SummaryRow[] => {
  if (ctx.site.location) return [];
  const l = resolveLocation(v, ctx.site);
  return [[ctx.L('Location', 'Plats'), `${l.city_name}, ${l.country_name}`]];
};

/** Drops rows without a value. */
export const rows = (...items: (SummaryRow | false | null | undefined)[]): SummaryRow[] =>
  items.filter((r): r is SummaryRow => !!r && !!str(r[1]));

/** Labels of the chosen chips, in the visitor's language. */
export const chipLabels = (values: unknown, options: ChipOption[], sv: boolean) =>
  (Array.isArray(values) ? values : values ? [values] : [])
    .map((x) => options.find((o) => o.value === x))
    .filter(Boolean)
    .map((o) => (sv ? o!.sv : o!.en))
    .join(', ');

/** School bookings, groups, squads, teams and community sign-ups (registrations table). */
export async function submitRegistration(payload: Record<string, unknown>): Promise<string> {
  const { data, error } = await supabase.rpc('submit_fut_inno_registration', { payload });
  if (error) throw new Error(error.message || 'Failed to submit registration');
  return (data as string) || '';
}
