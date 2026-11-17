// Future InnoHack's tracks as the site shows them: taken from the Site CMS's Find Your Path box (journey section,
// the programme with tracks), so the home page, the programme section's track cards and the register page's track
// step all read the same entries. Sites without tracks get none.
import React, { createContext, useContext } from 'react';
import { useSite, type SiteConfig } from '../context/SiteContext';
import type { SectionDoc } from './document';
import type { JourneyData } from './sections/journey';
import { programmeTracks, visibleChallenges, type CompanyChallenge, type ProgrammeTrack } from './sections/audienceJourneys';
import { innohackTracks, type InnohackTrackId } from './sections/innohack';
import { targetToHref } from './sections/frame';

const InnohackContext = createContext<ProgrammeTrack[]>([]);

/** The tracks in a site's resolved home sections (Find Your Path's programme with tracks), or none. */
export function innohackTracksFrom(sections: SectionDoc[]): ProgrammeTrack[] {
  const journey = sections.find((s) => s.type === 'journey');
  const programmes = ((journey?.data ?? {}) as Partial<JourneyData>).programmes ?? [];
  for (const p of Array.isArray(programmes) ? programmes : []) {
    const tracks = programmeTracks(p);
    if (tracks.length) return tracks;
  }
  return [];
}

export const InnohackProvider: React.FC<{ tracks: ProgrammeTrack[]; children: React.ReactNode }> = ({ tracks, children }) => (
  <InnohackContext.Provider value={tracks}>{children}</InnohackContext.Provider>
);

/** Does this site run Future InnoHack (vfi and IBK)? */
export const hasFutureInnohack = (site: SiteConfig) => Boolean(site.journey?.futureInnohack);

/** The site's tracks: the Site CMS's, else the built-in ones on a Future InnoHack site, else none. */
export function useInnohackTracks(): ProgrammeTrack[] {
  const fromCms = useContext(InnohackContext);
  const site = useSite();
  if (fromCms.length) return fromCms;
  return hasFutureInnohack(site) ? innohackTracks((tab) => targetToHref(site.nav.registerRoute, tab)) : [];
}

/** One track by id. */
export function useInnohackTrack(id: InnohackTrackId | undefined): ProgrammeTrack | undefined {
  const tracks = useInnohackTracks();
  return id ? tracks.find((t) => t.id === id) : undefined;
}

/** Young InnoHack's published company challenges (none until they are switched on in the Site CMS). */
export function usePublishedChallenges(): CompanyChallenge[] {
  const young = useInnohackTrack('young');
  return young ? visibleChallenges(young) : [];
}
