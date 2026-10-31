// Which city site is rendering: Västerås Future Innovators (default) or a RoboHack city
// site such as vxo.iniac.se. The shared components (header, hero, footer, forms, voting)
// read it, so every site uses the same components with its own routes, city and wording.
import React, { createContext, useContext } from 'react';
import type { IntakeProgramTab, RegisterProgramme } from '../pages/register/flow';
import type { PartnerLogo } from '../data/roboData';
import type { SecondLanguage } from '../translations';
import type { Language } from './LanguageContext';
import { pick } from '../content/core';

/** Riga's texts also have Latvian (`lv`). */
export type Bilingual = { en: string; sv: string; lv?: string };

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
  eventOptions: { value: string; en: string; sv: string; lv?: string }[];
  eyebrow: Bilingual;
  intro: Bilingual;
  teamName: string;
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

/** An event card in the hero: its date, name, kind and audience, linking to its details or registration. */
export interface HeroEvent {
  date: Bilingual;
  title: Bilingual;
  kind: Bilingual;
  audience: Bilingual;
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
  /** "Meet us at" lists only the bookings in this city; unset = all cities. */
  meetUsCity?: string;
  /** The language next to English in the language switch; unset = Swedish. */
  secondLanguage?: SecondLanguage;

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
    badge: string | Bilingual;
    /** Headline lines; the last one is yellow. */
    lines: Bilingual[];
    intro: Bilingual;
    /** Event cards under the intro; with them the hero shows the events layout (no second button or facts). */
    events?: HeroEvent[];
    primary: SiteAction;
    secondary: SiteAction;
    facts: { label: string; value: string }[];
  };
  /** "<City> Future Innovators 2026" artwork above the programmes (a file in public/); its heading is part of the image. */
  banner?: string;
  /** Dates for the students/parents/teachers guide on the home page; without it the guide is hidden. */
  journey?: {
    /** When and where the final is, read after "the Final", e.g. "on 5 December 2026 at MISV, Västerås". */
    finals: string;
    dates: { label: string; value: string }[];
    /** Added to the students' last step, e.g. the international stage. */
    studentsExtra?: string;
    /** Footnote under the dates. */
    note?: string;
    /** Where the guide's Rules button goes; default the vfi Challenges page. */
    rulesTarget?: string;
    /** Show the RoboKidovation and Young Future InnoHack programme boxes instead of the single guide. */
    audienceJourneys?: boolean;
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
    /** null hides the button (emptied in the Site CMS). */
    register: SiteAction | null;
    /** Heading over the register text; default "REGISTER". */
    registerTitle?: Bilingual;
    /** Line next to the copyright; default the hardware/GDPR line. */
    complianceLine?: Bilingual;
    /** Partner logos row; default the built-in partner list (the Site CMS uses the Partners section's logos). */
    logos?: PartnerLogo[];
    copyright: string;
    /** External admin login; null = the in-app admin portal. */
    adminHref: string | null;
  };
  volunteerCta: { eyebrow: Bilingual; title: Bilingual; body: Bilingual; button: Bilingual };

  intake: {
    eyebrow: string;
    /** Forms this site accepts (in its questions and by ?tab= link); omitted = every form. */
    tabs?: IntakeProgramTab[];
    /** Step-1 cards of the register questions, in order; with one, step 1 is skipped. */
    programmes: RegisterProgramme[];
    /** Who contacts associations, e.g. "the IBK team". */
    associationContact: string;
    showFees: boolean;
    volunteer?: IntakeVolunteerConfig;
    /** Ways a partner can help, on the partner form; omitted = the general list. */
    partnerWays?: Bilingual[];
  };
}

/** Cities with their own site; their ideas are kept off the Västerås pages. */
export const CITY_SITE_SLUGS = ['vaxjo', 'eskilstuna', 'riga'];

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
      { id: 'future-innovators#contact-us', label: { en: 'Contact', sv: 'Kontakt' } },
    ],
    registerLabel: { en: 'REGISTER SCHOOL, ASSOCIATION OR TEAM', sv: 'REGISTRERA SKOLA, FÖRENING ELLER LAG' },
    registerShort: { en: 'REGISTER', sv: 'REGISTRERA' },
    season: { en: 'Västerås, Sweden · Autumn 2026 Season', sv: 'Västerås, Sverige · Höstterminen 2026' },
  },

  hero: {
    badge: { en: 'VÄSTERÅS, SWEDEN · DECEMBER 2026', sv: 'VÄSTERÅS, SVERIGE · DECEMBER 2026' },
    lines: [same('Young Future'), same('Innovators.')],
    intro: {
      en: 'Two events. One mission. Inspiring the next generation of builders, creators and innovators.',
      sv: 'Två evenemang. Ett uppdrag. Vi inspirerar nästa generation byggare, skapare och innovatörer.',
    },
    events: [
      {
        date: same('5 DECEMBER'),
        title: same('RoboKidovation'),
        kind: { en: 'Robotics Competition', sv: 'Robottävling' },
        audience: { en: 'Grades 3–9', sv: 'Årskurs 3–9' },
        target: 'register',
        tab: 'competition',
      },
      {
        date: same('11–12 DECEMBER'),
        title: same('Young Future InnoHack'),
        kind: { en: 'Innovation Hackathon', sv: 'Innovationshackathon' },
        audience: { en: 'Students and young innovators', sv: 'Elever och unga innovatörer' },
        target: 'register',
        tab: 'hackathon',
      },
    ],
    primary: { label: { en: 'Explore Events & Register', sv: 'Utforska evenemang och registrera dig' }, target: 'events' },
    secondary: { label: same('EXPLORE EVENTS'), target: 'events' },
    facts: [
      { label: 'GRADES', value: '1–9 + GYM' },
      { label: 'PRIZE POOL', value: 'SEK 3,000' },
      { label: 'PROGRAMME', value: '20H STEM' },
      { label: 'LGR22', value: 'CURRICULUM FIT' },
      { label: 'ARENA', value: '244 × 122 CM' },
      { label: 'FINAL DATE', value: '5 DECEMBER 2026' },
    ],
  },

  banner: '/ves.jpeg',
  journey: {
    finals: 'on 5 December 2026 at MISV, Västerås',
    audienceJourneys: true,
    dates: [
      { label: 'School demos', value: '1–14 October 2026' },
      { label: 'School qualifiers', value: '12–25 November 2026' },
      { label: 'RoboKidovation', value: '5 December 2026 (MISV, Västerås)' },
      { label: 'Young Inno Hack', value: '11–12 December 2026 (venue TBC)' },
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
      { id: 'future-innovators#contact-us', label: { en: 'Contact us', sv: 'Kontakta oss' } },
      { id: 'about', label: same('About the League') },
    ],
    email: 'contact@iniac.se',
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
    programmes: [
      {
        id: 'robo',
        title: same('RoboKidovation'),
        subtitle: { en: 'School robotics · Grades 1–9 & GYM', sv: 'Skolrobotik · åk 1–9 och gymnasiet' },
        date: { en: '5 December 2026', sv: '5 december 2026' },
        venue: same('MISV, Västerås'),
        image: '/register/robokidovation.jpg',
      },
      {
        id: 'hack',
        title: same('Young Inno Hack'),
        subtitle: { en: 'Ideas and squads · Grade 7 to university', sv: 'Idéer och lag · åk 7 till universitet' },
        date: { en: '11–12 December 2026', sv: '11–12 december 2026' },
        venue: { en: 'Venue to be confirmed', sv: 'Lokal meddelas senare' },
        image: '/register/hackathon.jpg',
      },
      {
        id: 'community',
        title: { en: 'Join the Innovation Community', sv: 'Gå med i innovationsgemenskapen' },
        subtitle: { en: 'Volunteer, mentor, partner or stay connected.', sv: 'Bli volontär, mentor eller partner, eller håll kontakten.' },
      },
    ],
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
/** The text in the visitor's language; `true`/`false` mean Swedish/English. */
export const pickLang = (b: Bilingual, lang: Language | boolean): string => pick(b, lang);
