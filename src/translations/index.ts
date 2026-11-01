// Looks English texts up in the second-language dictionaries (sv.ts for Swedish, lv.ts for Latvian): the whole
// text first, ignoring case and spacing (an all-caps text gets an all-caps translation), then the patterns for
// texts with a name or address in them. The site-wide translator also replaces known phrases inside longer texts.
import { svPatterns, svTranslations } from './sv';
import { lvTranslations, lvPatterns } from './lv';

export type SecondLanguage = 'sv' | 'lv';

const normalize = (str: string) => str.replace(/\s+/g, ' ').trim();
const isAllCaps = (str: string) => str.length > 2 && str === str.toUpperCase() && /[A-Z]/.test(str);
const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

interface Index {
  exact: Map<string, string>;
  /** Every translation, so a text that is already translated is left alone. */
  translated: Set<string>;
  /** For phrases longer than 12 characters, longest first. */
  phrases: { en: string; tr: string; regex: RegExp }[];
  patterns: { regex: RegExp; tr: string }[];
}

function buildIndex(dict: Record<string, string>, patterns: [string, string][]): Index {
  const exact = new Map<string, string>();
  const translated = new Set<string>();
  const phrases: Index['phrases'] = [];
  for (const key of Object.keys(dict)) {
    const norm = normalize(key).toLowerCase();
    if (!exact.has(norm)) exact.set(norm, dict[key]);
    translated.add(normalize(dict[key]).toLowerCase());
    if (key.length >= 12 && !key.includes('<') && !key.includes('>')) {
      const escaped = escapeRegExp(key).replace(/\s+/g, '\\s+');
      try {
        phrases.push({ en: key, tr: dict[key], regex: new RegExp(escaped, 'gi') });
      } catch {
        // ignore invalid regex
      }
    }
  }
  phrases.sort((a, b) => b.en.length - a.en.length);
  // "{0}" in a pattern matches any text; the translation puts it back where its own "{0}" is.
  const compiled = patterns.map(([en, tr]) => ({
    regex: new RegExp(`^${normalize(en).split(/(\{\d\})/).map((part) => (/^\{\d\}$/.test(part) ? `(?<p${part[1]}>.+?)` : escapeRegExp(part))).join('')}$`, 'i'),
    tr,
  }));
  return { exact, translated, phrases, patterns: compiled };
}

const SOURCES: Record<SecondLanguage, () => Index> = {
  sv: () => buildIndex(svTranslations, svPatterns),
  lv: () => buildIndex(lvTranslations, lvPatterns),
};
const built: Partial<Record<SecondLanguage, Index>> = {};
const indexFor = (lang: SecondLanguage) => (built[lang] ??= SOURCES[lang]());

/** The translation of a whole text, or null when the dictionary does not have it. */
export function translateWhole(lang: SecondLanguage, text: string): string | null {
  const norm = normalize(text);
  if (!norm) return null;
  const index = indexFor(lang);
  const found = index.exact.get(norm.toLowerCase());
  if (found !== undefined) return isAllCaps(norm) ? found.toUpperCase() : found;
  for (const p of index.patterns) {
    const m = p.regex.exec(norm);
    if (m) return p.tr.replace(/\{(\d)\}/g, (_, n: string) => m.groups?.[`p${n}`] ?? '');
  }
  return null;
}

/** As translateWhole, else the text with the known phrases in it replaced (the site-wide translator). */
export function translateInText(lang: SecondLanguage, text: string): string | null {
  const whole = translateWhole(lang, text);
  if (whole !== null) return whole;
  // Already a translation (the translator can see a text again after changing it): leave it.
  if (indexFor(lang).translated.has(normalize(text).toLowerCase())) return null;
  let working = text;
  let modified = false;
  for (const p of indexFor(lang).phrases) {
    if (p.regex.test(working)) {
      working = working.replace(p.regex, (matched) => {
        modified = true;
        return isAllCaps(matched) ? p.tr.toUpperCase() : p.tr;
      });
    }
  }
  return modified && working !== text ? working : null;
}
