import { useLanguage, type Language } from '../context/LanguageContext';
import { translateWhole } from '../translations';
import { pick, type Bi } from './core';

/** The visitor's language and pickers for CMS texts (empty Swedish shows the English) and built-in texts:
 *  L(english, swedish) also gives Latvian, from the Latvian dictionary; given the same text twice (a text
 *  from the site settings), it looks the Swedish up in the Swedish dictionary. */
export function useT(): { sv: boolean; lang: Language; t: (b: Bi | undefined) => string; L: (en: string, sv: string) => string } {
  const { language } = useLanguage();
  const sv = language === 'sv';
  return {
    sv,
    lang: language,
    t: (b) => pick(b, language),
    L: (en, svText) =>
      sv ? (svText === en ? translateWhole('sv', en) ?? en : svText) : language === 'lv' ? translateWhole('lv', en) ?? en : en,
  };
}
