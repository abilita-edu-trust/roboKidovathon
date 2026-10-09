// City sites served from this app on their own subdomains. Each runs the same VFI
// components with its own SiteConfig (name, menu, routes, city, forms) and home sections.
// To add a city: a config here, its three routes in ROUTE_PATHS and HOST_ROUTES
// (lib/routes.ts), and a host rule in public/.htaccess.
import React from 'react';
import type { SiteConfig } from '../../context/SiteContext';
import type { IntakeProgramTab } from '../../pages/IntakeRegisterPage';
import { RoboHackPage } from '../../pages/RoboHackPage';
import { RoboKidoCityHome } from '../../pages/RoboKidoCityHome';
import { vaxjo } from '../../data/robohack';
import { eskilstunaSite, ESKILSTUNA_DETAILS, ESKILSTUNA_META } from '../../data/cities/eskilstuna';
import { robohackSite } from '../robohack/robohackSite';

export interface CityHomeProps {
  onRegister: (tab?: IntakeProgramTab) => void;
  onOpenIdeas: () => void;
}

export interface CitySite {
  /** Home route, e.g. 'vxo'; the site also has '<route>-register' and '<route>-ideas'. */
  route: string;
  /** Browser tab title and meta description on all the site's pages. */
  meta: { title: string; description: string };
  site: SiteConfig;
  /** Sections between the hero/logo marquee and the volunteer banner on the home page. */
  Home: React.FC<CityHomeProps>;
}

export const CITY_SITES: Record<string, CitySite> = {
  // vxo.iniac.se — YNG RoboHack Växjö (hackathon only)
  vxo: {
    route: 'vxo',
    meta: vaxjo.meta,
    site: robohackSite(vaxjo),
    Home: (props) => <RoboHackPage event={vaxjo} {...props} />,
  },
  // esk.iniac.se — Eskilstuna Future Innovators (RoboKidovation + ideas)
  esk: {
    route: 'esk',
    meta: ESKILSTUNA_META,
    site: eskilstunaSite,
    Home: (props) => <RoboKidoCityHome details={ESKILSTUNA_DETAILS} {...props} />,
  },
};

export type CityPageKind = 'home' | 'register' | 'ideas';

/** The city site and page a route belongs to, or null for VFI routes. */
export function cityPageFor(route: string): { city: CitySite; page: CityPageKind } | null {
  const [base, suffix] = route.split(/-(register|ideas)$/);
  const city = CITY_SITES[base];
  if (!city) return null;
  return { city, page: (suffix as CityPageKind | undefined) ?? 'home' };
}
