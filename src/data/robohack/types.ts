// Shape of one YNG RoboHack event. Each city/event is a single config file of this type
// (see vaxjo.ts); the page, navbar, footer and forms render entirely from it.
import type { LucideIcon } from 'lucide-react';

export type Bilingual = { en: string; sv: string };

export interface RoboHackTrack {
  id: string;
  icon: LucideIcon;
  title: Bilingual;
  /** Short subtitle, e.g. "Build & Control". */
  tagline: Bilingual;
  description: Bilingual;
  /** "For participants interested in" tags. */
  interests: Bilingual[];
  /** Off hides the track everywhere (e.g. the School Programme until a city activates it). */
  enabled: boolean;
}

export interface RoboHackCard {
  icon: LucideIcon;
  title: Bilingual;
  description: Bilingual;
}

export interface RoboHackChallenge {
  title: Bilingual;
  question: Bilingual;
  examples: Bilingual[];
}

export interface RoboHackProgramme {
  name: string;
  audience: Bilingual;
  description: Bilingual;
  flow: Bilingual[];
}

export interface RoboHackDetail {
  label: Bilingual;
  /** Leave null until confirmed; the page shows "TBC". */
  value: Bilingual | null;
}

export interface RoboHackEvent {
  /** Route id, e.g. 'vxo'. Must also exist in ROUTE_PATHS. */
  route: string;
  /** Browser tab title and meta description while the page is open. */
  meta: { title: string; description: string };
  brand: { name: string; city: string };
  /** EU Skola city that every form entry is filed under. */
  location: { countrySlug: string; citySlug: string; countryName: string; cityName: string };

  hero: { eyebrow: Bilingual; lines: Bilingual[]; intro: Bilingual; keywords: string[] };
  platform: { title: Bilingual; intro: Bilingual; flow: Bilingual[] };
  problem: {
    title: Bilingual;
    question: Bilingual;
    body: Bilingual[];
    flow: Bilingual[];
    cards: RoboHackCard[];
    ideasTitle: Bilingual;
    ideas: Bilingual[];
    closing: Bilingual[];
  };
  event: {
    title: Bilingual;
    intro: Bilingual;
    name: string;
    venue: Bilingual;
    dates: Bilingual;
    poweredBy: string;
  };
  tracks: RoboHackTrack[];
  journey: RoboHackCard[];
  challenges: {
    question: Bilingual;
    intro: Bilingual;
    items: RoboHackChallenge[];
    closing: Bilingual;
    flow: Bilingual[];
  };
  programmes: RoboHackProgramme[];
  partners: { headline: Bilingual; intro: Bilingual; ways: Bilingual[]; cta: Bilingual };
  /** Key facts shown in the details grid. */
  details: RoboHackDetail[];
  contactEmail: string;
}
