// Shape of one YNG RoboHack event. Each city/event is a single config file of this type
// (see vaxjo.ts); the page, navbar and footer render entirely from it.
import type { LucideIcon } from 'lucide-react';

export type Bilingual = { en: string; sv: string };

export interface RoboHackTrack {
  id: string;
  icon: LucideIcon;
  title: Bilingual;
  description: Bilingual;
  /** What teams build with, shown as tags. */
  buildWith: Bilingual[];
  /** Problem statements for this track. Empty until they are published. */
  challenges: Bilingual[];
  /** Off hides the track everywhere (e.g. the School Programme until a city activates it). */
  enabled: boolean;
}

export interface RoboHackStep {
  icon: LucideIcon;
  title: Bilingual;
  description: Bilingual;
}

export interface RoboHackDetail {
  label: Bilingual;
  /** Leave null until confirmed; the page shows "TBC". */
  value: Bilingual | null;
}

export interface RoboHackPartner {
  name: string;
  logo: string;
}

export interface RoboHackEvent {
  /** Route id, e.g. 'vxo'. Must also exist in ROUTE_PATHS. */
  route: string;
  /** Browser tab title and meta description while the page is open. */
  meta: { title: string; description: string };
  brand: { name: string; city: string };
  hero: { eyebrow: Bilingual; intro: Bilingual };
  about: {
    tagline: Bilingual;
    /** Short statements about the format. */
    points: Bilingual[];
    /** Participant levels, e.g. Basic · Grades 7–9. */
    levels: { level: Bilingual; who: Bilingual }[];
  };
  /** Areas the problem statements are drawn from. */
  themes: Bilingual[];
  /** How the event fits the school curriculum. Empty hides the block. */
  curriculum: Bilingual[];
  /** Key facts. The first four also appear in the hero. */
  details: RoboHackDetail[];
  tracks: RoboHackTrack[];
  journey: RoboHackStep[];
  /** mailto: or https: link for "Register interest". Empty shows "Registration opens soon". */
  registerHref: string;
  contactEmail: string;
  partners: RoboHackPartner[];
}
