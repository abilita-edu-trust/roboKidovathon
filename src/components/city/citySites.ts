// City sites served from this app on their own subdomains. Each runs the same VFI
// components with its own SiteConfig (name, menu, routes, city, forms) and home sections.
// To add a city: a config here, its three routes in ROUTE_PATHS and HOST_ROUTES
// (lib/routes.ts), its title and preview image in SITE_META and SITE_META_PAGES
// (data/siteMeta.ts), and host rules in public/.htaccess (root redirect + its page).
import type { Bilingual, SiteConfig } from '../../context/SiteContext';
import type { IntakeProgramTab } from '../../pages/IntakeRegisterPage';
import type { RoboHackEvent } from '../../data/robohack/types';
import type { CityDetail } from './CitySections';
import { vaxjo } from '../../data/robohack';
import { eskilstunaPathway, eskilstunaSite, ESKILSTUNA_DETAILS } from '../../data/cities/eskilstuna';
import { rigaSite } from '../../data/cities/riga';
import { ibkSite } from '../../data/cities/ibk';
import { SITE_META } from '../../data/siteMeta';
import { robohackSite } from '../robohack/robohackSite';
import { robohackPathway } from '../robohack/robohackPathway';
import type { PathwaySource } from '../../content/sections/programmes';

export interface CitySite {
  /** Home route, e.g. 'vxo'; the site also has '<route>-register' and '<route>-ideas'. */
  route: string;
  /** Title and description on all the site's pages: its entry in SITE_META (data/siteMeta.ts). */
  meta: { title: string; description: string };
  site: SiteConfig;
  /** The city's own home sections (registry types), in their default order between the programme card and the Jury. */
  home: string[];
  /** Rows of the "Event details" section; null values show as TBC. */
  details: CityDetail[];
  /** The RoboHack event behind the RoboHack sections (vxo). */
  event?: RoboHackEvent;
  /** Site-specific texts on the "Get involved" cards. */
  joinOverrides?: Partial<Record<IntakeProgramTab, { title?: Bilingual; desc?: Bilingual }>>;
  /** The programme card under the city banner (the same card as on vfi), and where its button goes. */
  pathway?: { content: (sv: boolean) => PathwaySource; target: string };
  /** The site has its own board and contact details, so the INIAC "Contact us" team is left out (IBK). */
  ownContact?: boolean;
}

export const CITY_SITES: Record<string, CitySite> = {
  // vxo.iniac.se — YNG RoboHack Växjö (hackathon only)
  vxo: {
    route: 'vxo',
    meta: vaxjo.meta,
    site: robohackSite(vaxjo),
    home: ['about', 'problem', 'event', 'tracks', 'challenges', 'programmes', 'partners-ask', 'details', 'vote', 'join'],
    details: vaxjo.details,
    event: vaxjo,
    joinOverrides: {
      hackathon: {
        title: { en: 'Join the RoboHack', sv: 'Var med i RoboHack' },
        desc: { en: `Register your team for ${vaxjo.event.dates.en}`, sv: `Anmäl ert lag till ${vaxjo.event.dates.sv}` },
      },
      volunteer: {
        desc: { en: `Help run ${vaxjo.brand.name} ${vaxjo.brand.city}`, sv: `Hjälp till på ${vaxjo.brand.name} ${vaxjo.brand.city}` },
      },
      partner: { title: vaxjo.partners.cta },
    },
    pathway: { content: (sv) => robohackPathway(vaxjo, sv), target: 'vxo#tracks' },
  },
  // esk.iniac.se — Eskilstuna Future Innovators (RoboKidovation + ideas)
  esk: {
    route: 'esk',
    meta: SITE_META.esk,
    site: eskilstunaSite,
    home: ['teams', 'details', 'vote', 'join'],
    details: ESKILSTUNA_DETAILS,
    pathway: { content: eskilstunaPathway, target: 'esk#teams-final-day' },
  },
  // riga.iniac.se — Riga Future Innovators (RoboKidovation + Young Inno Hack, like vfi)
  riga: {
    route: 'riga',
    meta: SITE_META.riga,
    site: rigaSite,
    // The vfi programme cards, venues and registration, then the categories and the ideas vote.
    home: ['experience', 'teams', 'vote'],
    details: [],
  },
  // indiskbarnklubb.se — Indisk Barnklubb (IBK) Västerås: the vfi site under IBK's name, with its board and contact
  ibk: {
    route: 'ibk',
    meta: SITE_META.ibk,
    site: ibkSite,
    home: ['experience', 'teams', 'vote'],
    details: [],
    ownContact: true,
  },
};

/** 'page' is one of the site's own pages from the Site CMS (route '<site>/<path>', e.g. 'ibk/about'). */
export type CityPageKind = 'home' | 'register' | 'ideas' | 'page';

/** The city site and page a route belongs to (with the page's address for 'page'), or null for VFI routes. */
export function cityPageFor(route: string): { city: CitySite; page: CityPageKind; path?: string } | null {
  if (route.includes('/')) {
    const [base, path] = route.split('/');
    const city = CITY_SITES[base];
    return city && path ? { city, page: 'page', path } : null;
  }
  const [base, suffix] = route.split(/-(register|ideas)$/);
  const city = CITY_SITES[base];
  if (!city) return null;
  return { city, page: (suffix as CityPageKind | undefined) ?? 'home' };
}
