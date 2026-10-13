// Building blocks of the editable site content (Site CMS, edited at iniac.se): texts in two languages,
// links, and how a saved section is laid over its built-in default.

/** A text in English and Swedish. Empty Swedish shows the English (vfi's translator still applies). */
export type Bi = { en: string; sv: string };

/** A button or link. An empty label hides it; `href` is a site path (/register?tab=…, /#vote-ideas), https:, mailto: or tel:. */
export interface CmsLink {
  label: Bi;
  href: string;
}

/** A text from its English and Swedish; Swedish equal to the English is stored empty. */
export const bi = (en: string, sv?: string): Bi => ({ en, sv: sv === undefined || sv === en ? '' : sv });

export const pick = (b: Bi | undefined, sv: boolean): string => (!b ? '' : sv ? b.sv || b.en : b.en);

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

/** An empty copy with the same shape, used as the base for list items. Icons keep their value. */
export function blankLike<T>(v: T, key = ''): T {
  if (Array.isArray(v)) return [] as T;
  if (isObj(v)) return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, blankLike(x, k)])) as T;
  if (typeof v === 'string') return (key === 'icon' ? v : '') as T;
  if (typeof v === 'number') return 0 as T;
  if (typeof v === 'boolean') return false as T;
  return v;
}

/**
 * Saved content laid over the default: objects merge key by key, a saved list replaces the default list
 * (its items filled from a blank copy of the first default item), and a value of the wrong type is ignored.
 */
export function mergeData<T>(base: T, saved: unknown): T {
  if (saved === undefined || saved === null) return base;
  if (isObj(base)) {
    if (!isObj(saved)) return base;
    const out: Record<string, unknown> = { ...base };
    for (const key of Object.keys(saved)) out[key] = mergeData((base as Record<string, unknown>)[key], saved[key]);
    return out as T;
  }
  if (Array.isArray(base)) {
    if (!Array.isArray(saved)) return base;
    const template = base[0];
    return saved.map((item) => (template === undefined ? item : mergeData(blankLike(template), item))) as T;
  }
  if (base === undefined) return saved as T;
  return typeof saved === typeof base ? (saved as T) : base;
}
