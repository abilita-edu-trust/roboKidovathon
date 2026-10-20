import { supabase } from './supabase';

export interface HackathonWinner {
  track: string;
  rank: number;
  squad: string;
  school: string | null;
}

export interface HackathonResults {
  name: string;
  published_at: string;
  results: HackathonWinner[];
}

/** A city's published hackathon winners, or null until an admin publishes them. */
export async function fetchHackathonResults(countrySlug: string, citySlug: string): Promise<HackathonResults | null> {
  const { data, error } = await supabase.rpc('fut_inno_hackathon_results', { _country_slug: countrySlug, _city_slug: citySlug });
  if (error) throw error;
  const results = data as HackathonResults | null;
  return results && Array.isArray(results.results) && results.results.length > 0 ? results : null;
}
