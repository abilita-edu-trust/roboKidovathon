// indiskbarnklubb.se — Indisk Barnklubb (IBK) Västerås: the vfi site under IBK's name, for the same Västerås
// programme (RoboKidovation and the Young Inno Hack), with IBK's board, contact details and stories in its own
// Site CMS content ("ibk"). Registrations and ideas are Västerås ones, as on vfi; the pages only vfi has
// (events, competition rules, curriculum, ...) open on vfi.iniac.se.
import { VFI_SITE, type Bilingual, type SiteConfig } from '../../context/SiteContext';
import { pathForRoute } from '../../lib/routes';

const same = (text: string): Bilingual => ({ en: text, sv: text });
const VFI = 'https://vfi.iniac.se';

/** A vfi route as seen from the IBK site: its own home and registration, the rest on vfi.iniac.se. */
const fromVfi = (id: string): string => {
  if (id === 'future-innovators' || id === 'ibk') return 'ibk';
  if (id === 'future-innovators#contact-us') return 'ibk/about#contact';
  if (id === 'register') return 'ibk-register';
  return `${VFI}${pathForRoute(id)}`;
};

export const ibkSite: SiteConfig = {
  ...VFI_SITE,
  organiser: 'Indisk Barnklubb (IBK) Västerås / INIAC',
  ideasPath: pathForRoute('ibk-ideas'),

  nav: {
    ...VFI_SITE.nav,
    brand: 'INDISK BARNKLUBB (IBK)',
    homeRoute: 'ibk',
    registerRoute: 'ibk-register',
    darkRoutes: ['ibk'],
    links: [
      { id: 'ibk', label: { en: 'Home', sv: 'Hem' } },
      { id: 'ibk#journey-robokidovation', label: same('RoboKidovation') },
      { id: 'ibk#journey-innohack', label: same('Young InnoHack') },
      { id: 'ibk-register', label: { en: 'Register', sv: 'Registrering' } },
      // IBK's own page (Site CMS): welcome, why join, the board and the contact details.
      { id: 'ibk/about', label: { en: 'About IBK', sv: 'Om IBK' } },
      { id: 'ibk/about#contact', label: { en: 'Contact', sv: 'Kontakt' } },
    ],
  },

  hero: {
    ...VFI_SITE.hero,
    events: VFI_SITE.hero.events?.map((e) => ({ ...e, target: 'ibk-register' })),
    primary: { ...VFI_SITE.hero.primary, target: 'ibk#choose-experience' },
    secondary: { ...VFI_SITE.hero.secondary, target: 'ibk#choose-experience' },
  },

  footer: {
    ...VFI_SITE.footer,
    title: 'INDISK BARNKLUBB (IBK) VÄSTERÅS',
    programmeLinks: VFI_SITE.footer.programmeLinks.map((l) => ({ ...l, id: fromVfi(l.id) })),
    orgLinks: VFI_SITE.footer.orgLinks.map((l) => ({ ...l, id: fromVfi(l.id) })),
    email: 'Vasteras@indiskbarnklubb.se',
    register: VFI_SITE.footer.register && { ...VFI_SITE.footer.register, target: 'ibk-register' },
    copyright: '© 2026 INDISK BARNKLUBB (IBK) VÄSTERÅS · VÄSTERÅS FUTURE INNOVATORS',
  },
};
