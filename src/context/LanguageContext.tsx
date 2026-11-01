import React, { createContext, useContext, useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import { translateInText, translateWhole, type SecondLanguage } from '../translations';

/** English, plus each site's second language: Swedish on the Swedish sites, Latvian on Riga. */
export type Language = 'en' | SecondLanguage;

interface LanguageContextType {
  language: Language;
  /** The site's other language next to English. */
  secondLanguage: SecondLanguage;
  setLanguage: (lang: Language) => void;
  setSecondLanguage: (lang: SecondLanguage) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('app_language');
      if (saved === 'en' || saved === 'sv' || saved === 'lv') return saved;
    } catch {
      // ignore
    }
    return 'en';
  });
  const [secondLanguage, setSecondLanguage] = useState<SecondLanguage>('sv');

  const isTranslatingRef = useRef(false);

  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem('app_language', newLang);
      window.dispatchEvent(new CustomEvent('app_language_changed', { detail: newLang }));
    } catch {
      // ignore
    }
  }, []);

  // A language the site does not offer (Swedish saved on Riga, Latvian on a Swedish site) shows English.
  const active: Language = language === 'en' || language === secondLanguage ? language : 'en';

  const toggleLanguage = useCallback(() => {
    setLanguage(active === 'en' ? secondLanguage : 'en');
  }, [active, secondLanguage, setLanguage]);

  // Translate lookup function
  const t = useCallback((key: string): string => (active === 'en' ? key : translateWhole(active, key) ?? key), [active]);

  // Translate a single DOM node
  const translateNode = useCallback(
    (node: Node) => {
      if (active === 'en') return;
      if (node.nodeType === Node.TEXT_NODE) {
        const parent = node.parentElement;
        if (!parent) return;
        const tag = parent.tagName.toLowerCase();
        if (['script', 'style', 'noscript', 'code', 'pre'].includes(tag)) return;
        if (parent.closest('[data-no-translate="true"]')) return;

        const originalVal = node.nodeValue || '';
        const trimmed = originalVal.trim();
        if (!trimmed) return;

        const translated = translateInText(active, trimmed);
        if (translated && translated !== trimmed) {
          const leading = originalVal.match(/^\s*/)?.[0] || '';
          const trailing = originalVal.match(/\s*$/)?.[0] || '';
          const newVal = leading + translated + trailing;
          if (node.nodeValue !== newVal) {
            node.nodeValue = newVal;
          }
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const tag = el.tagName.toLowerCase();
        if (['script', 'style', 'noscript'].includes(tag)) return;
        if (el.getAttribute('data-no-translate') === 'true') return;

        // Check attributes: placeholder, title, aria-label, alt
        ['placeholder', 'title', 'aria-label', 'alt'].forEach((attr) => {
          const attrVal = el.getAttribute(attr);
          if (attrVal) {
            const translated = translateInText(active, attrVal.trim());
            if (translated && translated !== attrVal) {
              el.setAttribute(attr, translated);
            }
          }
        });

        // Walk children
        const children = el.childNodes;
        for (let i = 0; i < children.length; i++) {
          translateNode(children[i]);
        }
      }
    },
    [active]
  );

  // Effect to apply translation across the entire DOM tree
  useEffect(() => {
    document.documentElement.lang = active;

    if (active !== 'en') {
      isTranslatingRef.current = true;
      translateNode(document.body);
      isTranslatingRef.current = false;

      // MutationObserver translates any dynamically mounted elements or routes
      const observer = new MutationObserver((mutations) => {
        if (isTranslatingRef.current) return;
        isTranslatingRef.current = true;

        for (const mutation of mutations) {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((addedNode) => {
              translateNode(addedNode);
            });
          } else if (mutation.type === 'attributes') {
            // A tooltip or label that changed after the first translation (e.g. "Show details" → "Hide details").
            const el = mutation.target as HTMLElement;
            const name = mutation.attributeName!;
            const val = el.getAttribute(name);
            if (val && !el.closest('[data-no-translate="true"]')) {
              const translated = translateInText(active, val.trim());
              if (translated && translated !== val) el.setAttribute(name, translated);
            }
          } else if (mutation.type === 'characterData') {
            const node = mutation.target;
            const parent = node.parentElement;
            if (parent && !['script', 'style'].includes(parent.tagName.toLowerCase())) {
              const currentVal = node.nodeValue || '';
              const trimmed = currentVal.trim();
              if (trimmed) {
                const translated = translateInText(active, trimmed);
                if (translated && translated !== trimmed) {
                  const leading = currentVal.match(/^\s*/)?.[0] || '';
                  const trailing = currentVal.match(/\s*$/)?.[0] || '';
                  node.nodeValue = leading + translated + trailing;
                }
              }
            }
          }
        }

        isTranslatingRef.current = false;
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['placeholder', 'title', 'aria-label', 'alt'],
      });

      return () => {
        observer.disconnect();
      };
    }
  }, [active, translateNode]);

  return (
    <LanguageContext.Provider value={{ language: active, secondLanguage, setLanguage, setSecondLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

/** Tells the language switch which second language the current site offers (before the page paints). */
export function useSiteLanguage(second: SecondLanguage) {
  const { setSecondLanguage } = useLanguage();
  useLayoutEffect(() => setSecondLanguage(second), [second, setSecondLanguage]);
}
