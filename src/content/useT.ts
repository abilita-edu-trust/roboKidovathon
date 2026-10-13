import { useLanguage } from '../context/LanguageContext';
import { pick, type Bi } from './core';

/** The visitor's language and a picker for CMS texts (empty Swedish shows the English). */
export function useT(): { sv: boolean; t: (b: Bi | undefined) => string } {
  const { language } = useLanguage();
  const sv = language === 'sv';
  return { sv, t: (b) => pick(b, sv) };
}
