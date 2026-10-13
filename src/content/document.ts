import { mergeData } from './core';

/** One section of a site's home page in the CMS document; people sections (Jury, Speakers) carry their own fields. */
export interface SectionDoc {
  id: string;
  type: string;
  visible: boolean;
  data?: Record<string, unknown>;
  [key: string]: unknown;
}

/** Always first and last, always shown; their content appears on every page of the site. */
export const FIXED_FIRST = 'header';
export const FIXED_LAST = 'footer';

/**
 * The sections to render: the saved order, with sections the site does not know dropped, every default section
 * the saved document lacks slotted in after its default predecessor, header first, footer last, and each
 * section's data laid over its default.
 */
export function resolveDocument(
  saved: SectionDoc[] | null,
  defaults: SectionDoc[],
  defaultDataFor: (s: SectionDoc) => Record<string, unknown> | undefined,
  knownTypes: Set<string>,
): SectionDoc[] {
  const seen = new Set<string>();
  const out: SectionDoc[] = [];
  for (const s of saved ?? []) {
    if (seen.has(s.id) || (s.type !== 'people' && !knownTypes.has(s.type))) continue;
    seen.add(s.id);
    out.push(s);
  }

  const defaultIds = new Set(defaults.map((d) => d.id));
  defaults.forEach((d, i) => {
    if (seen.has(d.id)) return;
    seen.add(d.id);
    let at = 0;
    for (let j = i - 1; j >= 0; j--) {
      const k = out.findIndex((s) => s.id === defaults[j].id);
      if (k >= 0) {
        at = k + 1;
        break;
      }
    }
    // Blocks an editor added after that section (Text & media) stay attached to it.
    while (at < out.length && !defaultIds.has(out[at].id)) at++;
    out.splice(at, 0, d);
  });

  const header = out.filter((s) => s.type === FIXED_FIRST);
  const footer = out.filter((s) => s.type === FIXED_LAST);
  const middle = out.filter((s) => s.type !== FIXED_FIRST && s.type !== FIXED_LAST);

  return [...header, ...middle, ...footer].map((s) => {
    const fixed = s.type === FIXED_FIRST || s.type === FIXED_LAST;
    if (s.type === 'people') return s;
    const base = defaultDataFor(s);
    return { ...s, visible: fixed || s.visible !== false, data: base ? mergeData(base, s.data) : (s.data ?? {}) };
  });
}
