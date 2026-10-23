import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { CONTACT_EMAIL, TEAM_CONTACTS, initials } from './teamContacts';

const read = (p: string) => readFileSync(new URL(p, import.meta.url), 'utf8');

describe('Contact us on the city sites', () => {
  it('shows the same team as iniac.se, in the agreed order', () => {
    expect(TEAM_CONTACTS.map((p) => [p.name, p.place.en])).toEqual([
      ['Pramod', 'Sweden'], ['Bhavya', 'Sweden'], ['Sriram', 'Germany'], ['Richa', 'Sweden'],
      ['Atchyuth Karri', 'London, UK'], ['Pavan Surya Chintada', 'India'],
    ]);
    expect(CONTACT_EMAIL).toBe('contact@iniac.se');
    expect(initials('Pavan Surya Chintada')).toBe('PC');
  });

  it('sends every site’s Contact link to the section, not to IBK', () => {
    const vfi = read('../context/SiteContext.tsx');
    expect(vfi).not.toContain("'ibk#contact'");
    expect(vfi).toContain("{ id: 'future-innovators#contact-us', label: { en: 'Contact', sv: 'Kontakt' } }");
    expect(read('./cities/eskilstuna.ts')).toContain("{ id: 'esk#contact-us', label: { en: 'Contact', sv: 'Kontakt' } }");
    expect(read('../components/robohack/robohackSite.tsx')).toContain('{ id: `${home}#contact-us`, label: { en: \'Contact\', sv: \'Kontakt\' } }');
  });

  it('uses contact@iniac.se as the footer address on every site', () => {
    for (const f of ['../context/SiteContext.tsx', './cities/eskilstuna.ts', '../components/robohack/robohackSite.tsx']) {
      expect(read(f), f).not.toContain('contact@robokidovation.se');
    }
  });

  it('is on every page except IBK’s own page', () => {
    const app = read('../App.tsx');
    expect(app.match(/<TeamContact \/>/g)?.length).toBe(2);
    expect(app).toContain("currentRoute !== 'ibk' && <TeamContact />");
  });
});
