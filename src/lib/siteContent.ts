import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';
import { DEFAULT_SITE_CONTENT } from '../data/siteContent.default';

/**
 * The editable home sections of a city website (Jury, Speakers, …), edited in the iniac.se admin
 * (Site CMS; table `eu_skola_site_content`, one row per site: vfi, esk, vxo, …). The built-in default
 * shows until the database answers, and whenever it can't be reached.
 */
export type Bilingual = { en: string; sv: string };

export interface SitePerson {
  id: string;
  name: string;
  role: Bilingual;
  organisation: string;
  photo: string;
}

export interface PeopleSection {
  id: string;
  type: 'people';
  visible: boolean;
  title: Bilingual;
  intro: Bilingual;
  emptyText: Bilingual;
  people: SitePerson[];
}

export interface OtherSection {
  id: string;
  type: string;
  visible: boolean;
  [key: string]: unknown;
}

export type SiteSection = PeopleSection | OtherSection;

export interface SiteContent {
  sections: SiteSection[];
}

export const isPeople = (s: SiteSection): s is PeopleSection => s.type === 'people';

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const str = (v: unknown): string => (typeof v === 'string' ? v : '');
const bi = (v: unknown): Bilingual => (isObj(v) ? { en: str(v.en), sv: str(v.sv) } : { en: '', sv: '' });

/** Fills missing fields so a half-filled document still renders; other section types pass through. */
export function normalizeContent(raw: unknown): SiteContent {
  const sections = isObj(raw) && Array.isArray(raw.sections) ? raw.sections : [];
  return {
    sections: sections.filter(isObj).map((s, i): SiteSection => {
      const id = str(s.id) || `section-${i}`;
      if (s.type !== 'people') return { ...s, id, type: str(s.type), visible: s.visible !== false };
      return {
        id,
        type: 'people',
        visible: s.visible !== false,
        title: bi(s.title),
        intro: bi(s.intro),
        emptyText: bi(s.emptyText),
        people: (Array.isArray(s.people) ? s.people : []).filter(isObj).map((p, j) => ({
          id: str(p.id) || `${id}-${j}`,
          name: str(p.name),
          role: bi(p.role),
          organisation: str(p.organisation),
          photo: str(p.photo),
        })),
      };
    }),
  };
}

export const initials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('');

const cache = new Map<string, SiteContent>();

/**
 * The live content of a site; the default until the database answers. `ready` turns true once the
 * database answered, failed, or took longer than 2.5 s, so pages can wait briefly instead of flashing
 * the default first.
 */
export function useSiteContentState(site: string): { content: SiteContent; ready: boolean } {
  const [content, setContent] = useState<SiteContent>(() => cache.get(site) ?? DEFAULT_SITE_CONTENT);
  const [ready, setReady] = useState<boolean>(() => cache.has(site) || !isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let active = true;
    const timeout = setTimeout(() => active && setReady(true), 2500);
    supabase
      .from('eu_skola_site_content')
      .select('content')
      .eq('site', site)
      .maybeSingle()
      .then(({ data, error }: { data: { content: unknown } | null; error: unknown }) => {
        if (!active) return;
        if (!error && data?.content) {
          const next = normalizeContent(data.content);
          cache.set(site, next);
          setContent(next);
        }
        setReady(true);
      })
      .catch(() => active && setReady(true));
    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [site]);

  return { content, ready };
}

export function useSiteContent(site: string): SiteContent {
  return useSiteContentState(site).content;
}
