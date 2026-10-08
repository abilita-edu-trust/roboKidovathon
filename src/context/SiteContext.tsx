// Which city site is rendering: Västerås Future Innovators (default) or a RoboHack city
// site such as vxo.iniac.se. The shared forms and voting components read it to file
// entries under the right city, show that city's ideas and use its own wording.
import React, { createContext, useContext } from 'react';

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
  eyebrow: { en: string; sv: string };
  intro: { en: string; sv: string };
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

export interface SiteConfig {
  /** City the site belongs to; null = the open multi-city VFI intake. */
  location: SiteLocation | null;
  cityName: string;
  /** Name of the hackathon programme, e.g. "Young Inno Hack" or "YNG RoboHack". */
  hackLabel: string;
  /** What winning ideas go on to, e.g. "the Västerås Finals". */
  finalsLabel: string;
  /** Who runs it, for consent text. */
  organiser: string;
  /** Path of the public ideas & voting page. */
  ideasPath: string;
  ideasFilter: IdeasCityFilter;
  intake: {
    eyebrow: string;
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
  intake: {
    eyebrow: 'OFFICIAL PROGRAM INTAKE // VÄSTERÅS 2026',
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
