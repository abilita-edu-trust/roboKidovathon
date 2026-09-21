import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { svTranslations } from '../translations/sv';

export type Language = 'en' | 'sv';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Normalize whitespace helper
function normalize(str: string): string {
  return str.replace(/\s+/g, ' ').trim();
}

function isAllCaps(str: string): boolean {
  return str.length > 2 && str === str.toUpperCase() && /[A-Z]/.test(str);
}

// Build pre-indexed normalized translation map
const normalizedMap = new Map<string, string>();
// Also sort phrase keys for substring matching (longer phrases first)
const phraseKeys: { en: string; sv: string; regex: RegExp }[] = [];

Object.keys(svTranslations).forEach((key) => {
  const normKey = normalize(key).toLowerCase();
  if (!normalizedMap.has(normKey)) {
    normalizedMap.set(normKey, svTranslations[key]);
  }
  // For phrases longer than 12 characters, enable substring matching
  if (key.length >= 12 && !key.includes('<') && !key.includes('>')) {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
    try {
      phraseKeys.push({
        en: key,
        sv: svTranslations[key],
        regex: new RegExp(escaped, 'gi'),
      });
    } catch {
      // ignore invalid regex
    }
  }
});

// Sort phrases by descending length
phraseKeys.sort((a, b) => b.en.length - a.en.length);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('app_language');
      if (saved === 'en' || saved === 'sv') return saved;
    } catch {
      // ignore
    }
    return 'en';
  });

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

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'sv' : 'en');
  }, [language, setLanguage]);

  // Translate lookup function
  const t = useCallback((key: string): string => {
    if (language === 'sv') {
      const norm = normalize(key).toLowerCase();
      if (normalizedMap.has(norm)) {
        const trans = normalizedMap.get(norm)!;
        return isAllCaps(key) ? trans.toUpperCase() : trans;
      }
    }
    return key;
  }, [language]);

  // Translate a single text string
  const getSwedishTranslation = useCallback((rawText: string): string | null => {
    const norm = normalize(rawText);
    const lowerNorm = norm.toLowerCase();

    // 1. Direct exact or normalized match
    if (normalizedMap.has(lowerNorm)) {
      const trans = normalizedMap.get(lowerNorm)!;
      return isAllCaps(norm) ? trans.toUpperCase() : trans;
    }

    // 2. Phrase-level replacement within larger multiline string
    let working = rawText;
    let modified = false;

    for (let i = 0; i < phraseKeys.length; i++) {
      const p = phraseKeys[i];
      if (p.regex.test(working)) {
        working = working.replace(p.regex, (matched) => {
          modified = true;
          return isAllCaps(matched) ? p.sv.toUpperCase() : p.sv;
        });
      }
    }

    if (modified && working !== rawText) {
      return working;
    }

    return null;
  }, []);

  // Translate a single DOM node
  const translateNode = useCallback(
    (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const parent = node.parentElement;
        if (!parent) return;
        const tag = parent.tagName.toLowerCase();
        if (['script', 'style', 'noscript', 'code', 'pre'].includes(tag)) return;
        if (parent.closest('[data-no-translate="true"]')) return;

        const originalVal = node.nodeValue || '';
        const trimmed = originalVal.trim();
        if (!trimmed) return;

        const translated = getSwedishTranslation(trimmed);
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

        // Check attributes: placeholder, title, aria-label
        ['placeholder', 'title', 'aria-label'].forEach((attr) => {
          const attrVal = el.getAttribute(attr);
          if (attrVal) {
            const translated = getSwedishTranslation(attrVal.trim());
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
    [getSwedishTranslation]
  );

  // Effect to apply translation across the entire DOM tree
  useEffect(() => {
    document.documentElement.lang = language;

    if (language === 'sv') {
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
          } else if (mutation.type === 'characterData') {
            const node = mutation.target;
            const parent = node.parentElement;
            if (parent && !['script', 'style'].includes(parent.tagName.toLowerCase())) {
              const currentVal = node.nodeValue || '';
              const trimmed = currentVal.trim();
              if (trimmed) {
                const translated = getSwedishTranslation(trimmed);
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
      });

      return () => {
        observer.disconnect();
      };
    }
  }, [language, translateNode, getSwedishTranslation]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
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
