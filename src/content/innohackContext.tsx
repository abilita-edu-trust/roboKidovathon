// Future InnoHack's tracks as the site shows them: taken from the Site CMS's Find Your Path box (journey section,
// the programme with tracks), so the home page, the programme section's track cards and the register page's track
// step all read the same entries. Sites without tracks get none.
import React, { createContext, useContext } from 'react';
import { useSite, type SiteConfig } from '../context/SiteContext';
import type { SectionDoc } from './document';
import type { JourneyData } from './sections/journey';
import { programmeTracks, visibleChallenges, type CompanyChallenge, type ProgrammeTrack } from './sections/audienceJourneys';
import { ideasClosed, innohackTracks, type InnohackTrackId } from './sections/innohack';
import { targetToHref } from './sections/frame';
import { useYoungChallenges, type YoungChallenge } from './youngChallenges';

const InnohackContext = createContext<ProgrammeTrack[]>([]);

/** The tracks in a site's resolved home sections (Find Your Path's programme with tracks), or none. */
export function innohackTracksFrom(sections: SectionDoc[], now: number = Date.now()): ProgrammeTrack[] {
  const journey = sections.find((s) => s.type === 'journey');
  const programmes = ((journey?.data ?? {}) as Partial<JourneyData>).programmes ?? [];
  for (const p of Array.isArray(programmes) ? programmes : []) {
    const tracks = programmeTracks(p);
    if (tracks.length) return closeKidAfterDeadline(tracks, now);
  }
  return [];
}

/** After the idea deadline (1 December 2026) Kid InnoHack takes no more ideas: closed, with that said. */
export const closeKidAfterDeadline = (tracks: ProgrammeTrack[], now: number = Date.now()): ProgrammeTrack[] =>
  ideasClosed(now)
    ? tracks.map((t) =>
        t.id === 'kid'
          ? { ...t, registrationOpen: false, closedMessage: { en: 'Idea submissions closed on 1 December 2026', sv: 'Idéinlämningen stängde den 1 december 2026' } }
          : t,
      )
    : tracks;

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
  return hasFutureInnohack(site) ? closeKidAfterDeadline(innohackTracks((tab) => targetToHref(site.nav.registerRoute, tab))) : [];
}

/** One track by id. */
export function useInnohackTrack(id: InnohackTrackId | undefined): ProgrammeTrack | undefined {
  const tracks = useInnohackTracks();
  return id ? tracks.find((t) => t.id === id) : undefined;
}

/** A challenge published in the Admin Panel, in the shape the Site CMS list uses. */
export const asCompanyChallenge = (c: YoungChallenge): CompanyChallenge => ({ visible: true, company: c.company, logo: c.logo, title: c.title, problem: c.problem });

/** Young InnoHack's company challenges: those published in the Admin Panel, else the Site CMS's switched-on ones. */
export function useTrackChallenges(track: ProgrammeTrack | undefined): CompanyChallenge[] {
  const site = useSite();
  const fromAdmin = useYoungChallenges(track?.id === 'young' && hasFutureInnohack(site) ? (site.nav.homeRoute === 'ibk' ? 'ibk' : 'vfi') : null).challenges;
  if (!track) return [];
  return fromAdmin.length ? fromAdmin.map(asCompanyChallenge) : visibleChallenges(track);
}

/** Young InnoHack's published company challenges (none until they are published). */
export function usePublishedChallenges(): CompanyChallenge[] {
  return useTrackChallenges(useInnohackTrack('young'));
}
