// Which city site is rendering: Västerås Future Innovators (default) or a RoboHack city
// site such as vxo.iniac.se. The shared components (header, hero, footer, forms, voting)
// read it, so every site uses the same components with its own routes, city and wording.
import React, { createContext, useContext } from 'react';
import type { IntakeProgramTab } from '../pages/IntakeRegisterPage';

export type Bilingual = { en: string; sv: string };

/** Same text in both languages: the site-wide translator handles Swedish (VFI). */
const same = (text: string): Bilingual => ({ en: text, sv: text });

export interface SiteLocation {
  countrySlug: string;
  citySlug: string;
  countryName: string;
  cityName: string;
}

export interface IdeasCityFilter {
  /** Only ideas from this city. */
  only?: { countrySlug: string; citySlug: string };
  /** Leave out ideas from these city slugs (cities that have their own site). */
  exclude?: string[];
}

export interface IntakeVolunteerConfig {
  eventOptions: { value: string; en: string; sv: string }[];
  eyebrow: Bilingual;
  intro: Bilingual;
  teamName: string;
}

/** An extra option on the register page, e.g. "Become a Partner" on vxo.iniac.se. */
export interface IntakeExtraForm {
  title: string;
  subtitle: string;
  desc: string;
  icon: string;
  render: () => React.ReactNode;
}

/** A link target: a route id or `route#section`. */
export interface SiteLink {
  id: string;
  label: Bilingual;
}

/** A button that opens a route, optionally on one register form. */
export interface SiteAction {
  label: Bilingual;
  target: string;
  tab?: IntakeProgramTab;
}

export interface SiteConfig {
  /** City the site belongs to; null = the open multi-city VFI intake. */
  location: SiteLocation | null;
  cityName: string;
  /** Name of the hackathon programme, e.g. "Young Inno Hack" or "RoboHack". */
  hackLabel: string;
  /** What winning ideas go on to, e.g. "the Västerås Finals". */
  finalsLabel: string;
  /** Who runs it, for consent text. */
  organiser: string;
  /** Path of the public ideas & voting page. */
  ideasPath: string;
  ideasFilter: IdeasCityFilter;

  /** Header: the name top-left and the menu. */
  nav: {
    brand: string;
    brandChip: string;
    homeRoute: string;
    registerRoute: string;
    /** Routes with the dark video hero behind the header. */
    darkRoutes: string[];
    links: SiteLink[];
    registerLabel: Bilingual;
    registerShort: Bilingual;
    /** Line at the bottom of the mobile menu. */
    season: Bilingual;
  };
  /** Video hero on the home page. */
  hero: {
    badge: string;
    /** Headline lines; the last one is yellow. */
    lines: Bilingual[];
    intro: Bilingual;
    primary: SiteAction;
    secondary: SiteAction;
    facts: { label: string; value: string }[];
  };
  footer: {
    title: string;
    description: Bilingual;
    location: string;
    audience: string;
    programmeTitle: Bilingual;
    programmeLinks: SiteLink[];
    orgTitle: Bilingual;
    orgLinks: SiteLink[];
    email: string;
    orgLines: string[];
    registerText: Bilingual;
    register: SiteAction;
    copyright: string;
    /** External admin login; null = the in-app admin portal. */
    adminHref: string | null;
  };
  volunteerCta: { eyebrow: Bilingual; title: Bilingual; body: Bilingual; button: Bilingual };

  intake: {
    eyebrow: string;
    /** Forms offered on the register page, in order; omitted = all six VFI forms. */
    tabs?: IntakeProgramTab[];
    /** Form opened when none (or one not offered here) is asked for. */
    defaultTab: IntakeProgramTab;
    /** Name of the hackathon team form, e.g. "Hackathon Squad". */
    squadTitle: string;
    hackathonDesc: string;
    volunteerDesc: string;
    associationContact: string;
    showFees: boolean;
    volunteer?: IntakeVolunteerConfig;
    extraForm?: IntakeExtraForm;
  };
}

/** Cities with their own site; their ideas are kept off the Västerås pages. */
export const CITY_SITE_SLUGS = ['vaxjo'];

export const VFI_SITE: SiteConfig = {
  location: null,
  cityName: 'Västerås',
  hackLabel: 'Young Inno Hack',
  finalsLabel: 'the Västerås Finals',
  organiser: 'Västerås Future Innovators / INIAC',
  ideasPath: '/ideas',
  ideasFilter: { exclude: CITY_SITE_SLUGS },

  nav: {
    brand: 'VÄSTERÅS FUTURE INNOVATORS',
    brandChip: '2026',
    homeRoute: 'future-innovators',
    registerRoute: 'register',
    darkRoutes: ['ibk', 'future-innovators'],
    links: [
      { id: 'future-innovators', label: { en: 'Home', sv: 'Hem' } },
      { id: 'challenges', label: { en: 'Competition', sv: 'Tävling' } },
      { id: 'events', label: { en: 'Events', sv: 'Evenemang' } },
      { id: 'register', label: { en: 'Register', sv: 'Registrering' } },
      { id: 'about', label: { en: 'About', sv: 'Om oss' } },
      { id: 'ibk', label: same('Indisk Barnklubb (IBK)') },
      { id: 'ibk#contact', label: { en: 'Contact', sv: 'Kontakt' } },
    ],
    registerLabel: { en: 'REGISTER SCHOOL, ASSOCIATION OR TEAM', sv: 'REGISTRERA SKOLA, FÖRENING ELLER LAG' },
    registerShort: { en: 'REGISTER', sv: 'REGISTRERA' },
    season: { en: 'Västerås, Sweden · Autumn 2026 Season', sv: 'Västerås, Sverige · Höstterminen 2026' },
  },

  hero: {
    badge: '5 DECEMBER 2026 · VÄSTERÅS, SWEDEN',
    lines: [same('Build ideas.'), same('Test them.'), same('Take them further.')],
    intro: same(
      'Västerås Future Innovators — hands-on STEM robotics and the Young Inno Hack, for schools, associations and independent teams — RoboKido Junior, Senior and GYM, the Young Inno Hack from grade 7 to university, and grades 1–2 as participants.'
    ),
    primary: { label: same('REGISTER SCHOOL, ASSOCIATION OR TEAM'), target: 'register' },
    secondary: { label: same('EXPLORE EVENTS'), target: 'events' },
    facts: [
      { label: 'GRADES', value: '1–9 + GYM' },
      { label: 'PRIZE POOL', value: 'SEK 3,000' },
      { label: 'PROGRAMME', value: '20H STEM' },
      { label: 'LGR22', value: 'CURRICULUM FIT' },
      { label: 'ARENA', value: '244 × 122 CM' },
      { label: 'FINAL DATE', value: 'DEC 5, 2026' },
    ],
  },

  footer: {
    title: 'VÄSTERÅS FUTURE INNOVATORS 2026',
    description: same(
      'Hands-on STEM programme and robotics competition for schools, associations and independent teams. Hosted by Indisk BarnKlubb (IBK) Västerås, INIAC and SkillSkolan, with Blix as technology and kit partner.'
    ),
    location: 'VÄSTERÅS, SWEDEN',
    audience: 'GRADES 1–9 & GYMNASIUM',
    programmeTitle: same('PROGRAMME'),
    programmeLinks: [
      { id: 'future-innovators', label: same('Future Innovators') },
      { id: 'for-schools', label: same('For Schools') },
      { id: 'workflow', label: same('STEM Workflow') },
      { id: 'challenges', label: same('Competition Tracks') },
      { id: 'how-it-works', label: same('How It Works') },
      { id: 'lgr22', label: same('Lgr22 Curriculum') },
      { id: 'events', label: same('Events & Final') },
    ],
    orgTitle: same('ORGANIZATION & CONTACT'),
    orgLinks: [
      { id: 'ibk', label: same('Indisk Barnklubb (IBK)') },
      { id: 'ibk#contact', label: same('Contact IBK') },
      { id: 'about', label: same('About the League') },
    ],
    email: 'contact@robokidovation.se',
    orgLines: ['Indisk BarnKlubb (IBK) Västerås & INIAC', 'Västerås, Sweden'],
    registerText: same(
      'Registration is open for schools, associations and independent teams ahead of the 12–25 November qualifiers and the 5 December 2026 Final.'
    ),
    register: { label: same('REGISTER SCHOOL, ASSOCIATION OR TEAM'), target: 'register' },
    copyright: '© 2026 VÄSTERÅS FUTURE INNOVATORS · INDISK BARNKLUBB VÄSTERÅS',
    adminHref: null,
  },

  volunteerCta: {
    eyebrow: { en: 'VOLUNTEERS // VÄSTERÅS 2026', sv: 'VOLONTÄRER // VÄSTERÅS 2026' },
    title: { en: 'Volunteer with Västerås Future Innovators', sv: 'Bli volontär hos Västerås Future Innovators' },
    body: {
      en: 'Help us run robotics finals, hackathons and school events across Västerås. Pick your role, your time and the events you want to support.',
      sv: 'Hjälp oss att genomföra robotikfinaler, hackathons och skolevenemang i Västerås. Välj din roll, din tid och de evenemang du vill stötta.',
    },
    button: { en: 'REGISTER AS A VOLUNTEER', sv: 'ANMÄL DIG SOM VOLONTÄR' },
  },

  intake: {
    eyebrow: 'OFFICIAL PROGRAM INTAKE // VÄSTERÅS 2026',
    defaultTab: 'workshop',
    squadTitle: 'Hackathon Squad',
    hackathonDesc: 'Register a student team for the Young Inno Hack final on 5 Dec (venue to be confirmed)',
    volunteerDesc: 'Help run Västerås Future Innovators events as a volunteer',
    associationContact: 'the IBK team',
    showFees: true,
  },
};

const SiteContext = createContext<SiteConfig>(VFI_SITE);

export const SiteProvider: React.FC<{ site: SiteConfig; children: React.ReactNode }> = ({ site, children }) => (
  <SiteContext.Provider value={site}>{children}</SiteContext.Provider>
);

export const useSite = (): SiteConfig => useContext(SiteContext);

/** Picks the visitor's language from a Bilingual text. */
export const pickLang = (b: Bilingual, sv: boolean): string => (sv ? b.sv || b.en : b.en);
