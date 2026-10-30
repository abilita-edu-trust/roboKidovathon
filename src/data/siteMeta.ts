// Each site's title, description and link-preview image. LinkedIn, WhatsApp and Facebook
// don't run JavaScript, so the build writes these into one HTML page per site
// (vite.config.ts) and public/.htaccess serves each host or path its own page. App.tsx
// sets the same title and description while people move between pages.
// Keep this file free of imports: vite.config.ts reads it.

export interface SiteMeta {
  title: string;
  description: string;
  /** Address the preview image is served from. */
  origin: string;
  /** Preview image, a file in public/. */
  image: string;
}

export type SiteMetaKey = 'vfi' | 'esk' | 'vxo' | 'riga' | 'ibk';

export const SITE_META: Record<SiteMetaKey, SiteMeta> = {
  // vfi.iniac.se and every page without its own entry
  vfi: {
    title: 'Västerås Future Innovators 2026 | INIAC',
    description:
      'Hands-on robotics and youth innovation for schools, associations and independent teams in Västerås, by INIAC. Final on 5 December 2026.',
    origin: 'https://vfi.iniac.se',
    image: '/ves.jpeg',
  },
  // esk.iniac.se and /esk
  esk: {
    title: 'Eskilstuna Future Innovators 2026 | INIAC',
    description:
      'Hands-on RoboKidovation robotics for schools, associations and independent teams in Eskilstuna, by INIAC.',
    origin: 'https://esk.iniac.se',
    image: '/esk.jpeg',
  },
  // vxo.iniac.se and /vxo
  vxo: {
    title: 'YNG RoboHack Växjö | INIAC',
    description:
      'YNG RoboHack Växjö, 21–22 November 2026 at Linnaeus University. One event, three tracks: Robotics, Code and Hack. By INIAC.',
    origin: 'https://vxo.iniac.se',
    image: '/vxo.jpeg',
  },
  // riga.iniac.se and /riga
  riga: {
    title: 'Riga Future Innovators 2027 | INIAC',
    description:
      'Hands-on robotics and youth innovation for schools, associations and independent teams in Riga, by INIAC. RoboKidovation final on 6 February 2027 at the International School of Riga; Young Inno Hack on 12–13 February 2027 (dates to be confirmed).',
    origin: 'https://riga.iniac.se',
    // No Riga banner yet: the arena photo from the hero.
    image: '/site/arena_court_hd.jpg',
  },
  // indiskbarnklubb.se/ibk
  ibk: {
    title: 'Indisk Barnklubb (IBK) Västerås | INIAC',
    description:
      'IBK is a non-profit club in Västerås that fills the lives of children and youth with culture, creativity and community — and helps them find their place in Swedish society.',
    origin: 'https://indiskbarnklubb.se',
    image: '/ibk logo.png',
  },
};

/** Built page that carries each site's meta; public/.htaccess must serve the same names. */
export const SITE_META_PAGES: Record<SiteMetaKey, string> = {
  vfi: 'index.html',
  esk: 'esk.html',
  vxo: 'vxo.html',
  riga: 'riga.html',
  ibk: 'ibk.html',
};
