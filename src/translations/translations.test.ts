import { describe, expect, it } from 'vitest';
import { translateInText, translateWhole } from './index';
import { lvPatterns, lvTranslations } from './lv';
import { svTranslations } from './sv';
import { pick } from '../content/core';

describe('Latvian dictionary', () => {
  it('translates whole texts, ignoring case and spacing, and keeps all caps', () => {
    expect(translateWhole('lv', 'Continue')).toBe('Turpināt');
    expect(translateWhole('lv', '  continue ')).toBe('Turpināt');
    expect(translateWhole('lv', 'REGISTER')).toBe('REĢISTRĒTIES');
    expect(translateWhole('lv', 'Not in the dictionary')).toBeNull();
  });

  it('fills in the changing parts of patterns', () => {
    expect(translateWhole('lv', 'A receipt is on its way to anna@skola.lv. The coordinator reviews your entry and contacts you with the next steps.')).toBe(
      'Apstiprinājums tiek nosūtīts uz anna@skola.lv. Koordinators izskatīs jūsu pieteikumu un sazināsies ar jums par nākamajiem soļiem.'
    );
    expect(translateWhole('lv', 'Step 2 of 5')).toBe('2. solis no 5');
  });

  it('has a translation for every entry, and patterns only use their own placeholders', () => {
    for (const [en, lv] of Object.entries(lvTranslations)) expect(lv.trim(), en).not.toBe('');
    for (const [en, lv] of lvPatterns) {
      const own = new Set(en.match(/\{\d\}/g));
      for (const p of lv.match(/\{\d\}/g) ?? []) expect(own.has(p), en).toBe(true);
    }
  });

  it('leaves Swedish as it was', () => {
    expect(translateInText('sv', 'Developed & maintained by')).toBe('Utvecklad och förvaltad av');
  });
});

describe('Swedish dictionary', () => {
  it('translates the texts that showed in English on the Swedish pages', () => {
    expect(translateWhole('sv', 'Students Registered')).toBe('Anmälda elever');
    expect(translateWhole('sv', 'VOTE FOR AN IDEA OF YOUNG MINDS')).toBe('RÖSTA PÅ UNGA IDÉER');
    expect(translateWhole('sv', 'Future Innovators')).toBe('Framtida Innovatörer');
  });

  it('fills in the changing parts of patterns', () => {
    expect(translateWhole('sv', 'Explore INIAC (Preview)')).toBe('Utforska INIAC (förhandsvisning)');
    expect(translateWhole('sv', 'OFFICIAL PROGRAM INTAKE // ESKILSTUNA 2026')).toBe('OFFICIELL ANMÄLAN // ESKILSTUNA 2026');
  });

  it('leaves a text that is already translated alone', () => {
    // "Framtida Innovatörer 2026: …" holds no English, but it used to be changed again by phrase replacement.
    expect(translateInText('sv', 'Framtida Innovatörer 2026: idéer idag, en ljusare morgondag')).toBeNull();
    expect(translateInText('sv', 'Future Innovators 2026: ideas today, a brighter tomorrow')).toBe('Framtida Innovatörer 2026: idéer idag, en ljusare morgondag');
  });

  it('has no entries that translate a text to itself', () => {
    for (const [en, sv] of Object.entries(svTranslations)) expect(sv, en).not.toBe(en);
  });
});

describe('pick', () => {
  it('shows Latvian, then the Latvian dictionary, then the English', () => {
    expect(pick({ en: 'Home', sv: 'Hem', lv: 'Sākums' }, 'lv')).toBe('Sākums');
    expect(pick({ en: 'Continue', sv: 'Fortsätt' }, 'lv')).toBe('Turpināt');
    expect(pick({ en: 'Riga Future Innovators', sv: '' }, 'lv')).toBe('Riga Future Innovators');
  });

  it('works as before for Swedish and English', () => {
    expect(pick({ en: 'Home', sv: 'Hem', lv: 'Sākums' }, true)).toBe('Hem');
    expect(pick({ en: 'Home', sv: '', lv: 'Sākums' }, 'sv')).toBe('Home');
    expect(pick({ en: 'Home', sv: 'Hem', lv: 'Sākums' }, 'en')).toBe('Home');
    expect(pick(undefined, 'lv')).toBe('');
  });
});
