// Young InnoHack's company challenges (vfi and IBK), as the Admin Panel publishes them (fut_inno_young_challenges).
// Only published challenges ever reach the website. Until the database has the challenges (its migration is not
// applied yet), or while none is published, the list is empty and the site keeps the general Young InnoHack form.
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Bilingual } from '../context/SiteContext';

export interface YoungChallenge {
  id: string;
  slot: number;
  company: string;
  logo: string;
  title: Bilingual;
  problem: Bilingual;
  requirements: Bilingual;
  registration_open: boolean;
  /** Null: not decided yet (no limit applies). */
  team_size_min: number | null;
  team_size_max: number | null;
  max_teams: number | null;
  /** Captains may list their team for anyone to join without the code. */
  listed_teams: boolean;
  teams: number;
  /** No room for more teams (joining a team can still be possible). */
  full: boolean;
}

export interface OpenTeam {
  id: string;
  name: string;
  members: number;
  spaces: number | null;
}

export interface TeamLookup {
  team: string;
  challenge_id: string;
  members: number;
  spaces: number | null;
  joinable: boolean;
}

export type YoungSite = 'vfi' | 'ibk';

const cache = new Map<YoungSite, Promise<YoungChallenge[]>>();

/** The site's published challenges, in slot order; [] when there are none or the database doesn't have them yet. */
export function fetchYoungChallenges(site: YoungSite): Promise<YoungChallenge[]> {
  if (!cache.has(site)) {
    cache.set(
      site,
      Promise.resolve(supabase.rpc('fut_inno_young_challenges_public', { _site: site }))
        .then(({ data, error }) => (error || !Array.isArray(data) ? [] : (data as YoungChallenge[])))
        .catch(() => []),
    );
  }
  return cache.get(site)!;
}

/** For tests and after a registration (team counts change). */
export const forgetYoungChallenges = () => cache.clear();

/** The published challenges, and whether the answer is in. */
export function useYoungChallenges(site: YoungSite | null): { challenges: YoungChallenge[]; ready: boolean } {
  const [state, setState] = useState<{ challenges: YoungChallenge[]; ready: boolean }>({ challenges: [], ready: !site });
  useEffect(() => {
    if (!site) return;
    let live = true;
    fetchYoungChallenges(site).then((challenges) => live && setState({ challenges, ready: true }));
    return () => {
      live = false;
    };
  }, [site]);
  return state;
}

/** Teams anyone may join (listed by their captain, open, not full): name and size only. */
export async function fetchOpenTeams(challengeId: string): Promise<OpenTeam[]> {
  const { data, error } = await supabase.rpc('fut_inno_young_open_teams', { _challenge_id: challengeId });
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
export function teamSizeText(c: Pick<YoungChallenge, 'team_size_min' | 'team_size_max'>, L: (en: string, sv: string) => string): string | null {
  const { team_size_min: min, team_size_max: max } = c;
  if (min != null && max != null) return min === max ? L(`${max} people`, `${max} personer`) : L(`${min}–${max} people`, `${min}–${max} personer`);
  if (max != null) return L(`Up to ${max} people`, `Upp till ${max} personer`);
  if (min != null) return L(`At least ${min} people`, `Minst ${min} personer`);
  return null;
}
