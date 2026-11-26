// Young InnoHack's themes (and any company challenges) for vfi and IBK, as the Admin Panel publishes them. Participants give a 1st and a
// 2nd choice; organisers allocate the final challenge. Only published challenges reach the website, and the database
// decides whether registration is open (one switch, at least two published challenges). While nothing is published,
// the site keeps the general Young InnoHack form.
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Bilingual } from '../context/SiteContext';

export interface YoungChallenge {
  id: string;
  slot: number;
  company: string;
  logo: string;
  title: Bilingual;
  /** The card's short description (up to 200 characters). */
  short: Bilingual;
  problem: Bilingual;
  requirements: Bilingual;
}

/** What the website knows: published challenges, whether registration is open, and the team rules. */
export interface YoungState {
  registrationOpen: boolean;
  /** Null: not decided yet. */
  teamSizeMin: number | null;
  teamSizeMax: number | null;
  listedTeams: boolean;
  challenges: YoungChallenge[];
  /** When registration closes (7 December 2026, 23:59), if the database says. */
  closeAt?: string | null;
  /** Places left: on campus (hybrid), online, and teams that can still be started. Null: not known. */
  places?: { hybrid: number; online: number; teams: number } | null;
}

export const NO_YOUNG: YoungState = { registrationOpen: false, teamSizeMin: null, teamSizeMax: null, listedTeams: false, challenges: [] };

/** Young InnoHack's registration deadline: 7 December 2026 at 23:59 Swedish time. */
export const YOUNG_REGISTRATION_CLOSE_AT = '2026-12-07T23:59:59+01:00';
export const youngRegistrationClosed = (now: number = Date.now()) => now > Date.parse(YOUNG_REGISTRATION_CLOSE_AT);

export interface OpenTeam {
  id: string;
  name: string;
  members: number;
  spaces: number | null;
  first_choice: string;
  second_choice: string;
}

export interface TeamLookup {
  team: string;
  members: number;
  spaces: number | null;
  first_choice: string;
  second_choice: string;
  joinable: boolean;
}

export type YoungSite = 'vfi' | 'ibk';

/** The database's answer as the website uses it; anything else (an older database, an error) means "nothing yet". */
export function toYoungState(data: unknown): YoungState {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return NO_YOUNG;
  const d = data as Record<string, unknown>;
  const challenges = Array.isArray(d.challenges) ? (d.challenges as YoungChallenge[]) : [];
  const n = (x: unknown) => (typeof x === 'number' ? x : null);
  return {
    registrationOpen: d.registration_open === true && challenges.length >= 2,
    teamSizeMin: n(d.team_size_min),
    teamSizeMax: n(d.team_size_max),
    listedTeams: d.listed_teams === true,
    challenges,
    closeAt: typeof d.registration_close_at === 'string' ? d.registration_close_at : null,
    places:
      d.places && typeof d.places === 'object'
        ? {
            hybrid: n((d.places as Record<string, unknown>).hybrid) ?? 0,
            online: n((d.places as Record<string, unknown>).online) ?? 0,
            teams: n((d.places as Record<string, unknown>).teams) ?? 0,
          }
        : null,
  };
}

const cache = new Map<YoungSite, Promise<YoungState>>();

export function fetchYoungState(site: YoungSite): Promise<YoungState> {
  if (!cache.has(site)) {
    cache.set(
      site,
      Promise.resolve(supabase.rpc('fut_inno_young_challenges_public', { _site: site }))
        .then(({ data, error }) => (error ? NO_YOUNG : toYoungState(data)))
        .catch(() => NO_YOUNG),
    );
  }
  return cache.get(site)!;
}

/** For tests and after a registration. */
export const forgetYoungChallenges = () => cache.clear();

export function useYoungState(site: YoungSite | null): YoungState & { ready: boolean } {
  const [state, setState] = useState<YoungState & { ready: boolean }>({ ...NO_YOUNG, ready: !site });
  useEffect(() => {
    if (!site) return;
    let live = true;
    fetchYoungState(site).then((s) => live && setState({ ...s, ready: true }));
    return () => {
      live = false;
    };
  }, [site]);
  return state;
}

/** Teams anyone may join (listed by their captain, while the organisers allow it): name, size and their choices. */
export async function fetchOpenTeams(site: YoungSite): Promise<OpenTeam[]> {
  const { data, error } = await supabase.rpc('fut_inno_young_open_teams', { _site: site });
  return error || !Array.isArray(data) ? [] : (data as OpenTeam[]);
}

/** What an invite code is for; null for a code that matches no team. Throws when the network is rate limited. */
export async function lookupTeamCode(code: string): Promise<TeamLookup | null> {
  const { data, error } = await supabase.rpc('fut_inno_young_team_lookup', { _code: code });
  if (error) throw new Error(error.message);
  return (data as TeamLookup | null) ?? null;
}

/** An invite code as people type it: letters and digits only, upper case. */
export const normaliseCode = (raw: string) => raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);

/** "ABCDE-FGHJK", easier to read out and copy. */
export const formatCode = (code: string) => (code.length === 10 ? `${code.slice(0, 5)}-${code.slice(5)}` : code);

/** "2–4 people", "up to 4 people", "at least 2 people", or null while the organisers haven't decided. */
export function teamSizeText(min: number | null, max: number | null, L: (en: string, sv: string) => string): string | null {
  if (min != null && max != null) return min === max ? L(`${max} people`, `${max} personer`) : L(`${min}–${max} people`, `${min}–${max} personer`);
  if (max != null) return L(`up to ${max} people`, `upp till ${max} personer`);
  if (min != null) return L(`at least ${min} people`, `minst ${min} personer`);
  return null;
}

/** "Company: Title" in the visitor's language. */
export const challengeName = (c: YoungChallenge | undefined, T: (b: Bilingual) => string) => (c ? `${c.company}: ${T(c.title)}` : '');
