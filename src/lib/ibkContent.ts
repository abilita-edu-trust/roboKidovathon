import { useEffect, useState } from 'react';
import {
  Award, Baby, BookOpen, Bird, Bot, Building2, Cake, Calendar, Camera, Clock, Code2, Drama, Flag, Flame,
  FlaskConical, Gamepad2, Ghost, Gift, Globe2, GraduationCap, HandHeart, Handshake, Heart, Home, Image,
  Info, Leaf, Lightbulb, Link, Mail, MapPin, Megaphone, Mic, Music, Palette, PartyPopper, PenTool, Phone,
  Puzzle, Rocket, School, Smile, Sparkles, Star, Sun, Ticket, Timer, TreePine, Trophy, Users, Video, Wrench,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from './supabase';
import defaultContent from '../data/ibkContent.default.json';

/**
 * Content of the /ibk page. Edited by IBK users in the iniac.se admin panel
 * (table `ibk_site_content`, row `main`); the JSON file is the built-in default
 * and the fallback when the database cannot be reached.
 */
export type IbkContent = typeof defaultContent;
export type Bilingual = { en: string; sv: string };

/** Icons the editor can choose from. Keep in sync with IBK_ICON_NAMES in the admin panel. */
export const IBK_ICONS: Record<string, React.ElementType> = {
  Award, Baby, BookOpen, Bird, Bot, Building2, Cake, Calendar, Camera, Clock, Code2, Drama, Flag, Flame,
  FlaskConical, Gamepad2, Ghost, Gift, Globe2, GraduationCap, HandHeart, Handshake, Heart, Home, Image,
  Info, Leaf, Lightbulb, Link, Mail, MapPin, Megaphone, Mic, Music, Palette, PartyPopper, PenTool, Phone,
  Puzzle, Rocket, School, Smile, Sparkles, Star, Sun, Ticket, Timer, TreePine, Trophy, Users, Video, Wrench,
};

export const ibkIcon = (name: string | undefined): React.ElementType => (name && IBK_ICONS[name]) || Sparkles;

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/** Saved content wins; objects merge key by key so fields added later still get their default. */
function mergeWithDefaults<T>(base: T, saved: unknown): T {
  if (saved === undefined || saved === null) return base;
  if (isPlainObject(base) && isPlainObject(saved)) {
    const out: Record<string, unknown> = { ...base };
    for (const key of Object.keys(saved)) {
      out[key] = mergeWithDefaults((base as Record<string, unknown>)[key], saved[key]);
    }
    return out as T;
  }
  if (Array.isArray(base) && Array.isArray(saved)) {
    // Lists are replaced wholesale; each item is merged with the first default item's shape.
    const template = base[0];
    return saved.map((item) => (template === undefined ? item : mergeWithDefaults(template, item))) as T;
  }
  return typeof saved === typeof base || base === undefined ? (saved as T) : base;
}

let cache: IbkContent | null = null;

/** Loads the live IBK content; `ready` is false until the database answered (or failed). */
export function useIbkContent(): { content: IbkContent; ready: boolean } {
  const [content, setContent] = useState<IbkContent>(cache ?? defaultContent);
  const [ready, setReady] = useState<boolean>(cache !== null || !isSupabaseConfigured);

  useEffect(() => {
    if (cache || !isSupabaseConfigured) return;
    let active = true;
    const timeout = setTimeout(() => active && setReady(true), 4000);

    supabase
      .from('ibk_site_content')
      .select('content')
      .eq('id', 'main')
      .maybeSingle()
      .then(({ data, error }: { data: { content: unknown } | null; error: unknown }) => {
        if (!active) return;
        if (!error && data?.content) {
          cache = mergeWithDefaults(defaultContent, data.content);
          setContent(cache);
        }
        setReady(true);
      })
      .catch(() => active && setReady(true));

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, []);

  return { content, ready };
}

/** Resolves a stored path like "/ibk-assets/a b.png" to a safe URL; leaves full URLs alone. */
export const mediaUrl = (src: string): string => (/^(https?:|data:|blob:)/.test(src) ? src : encodeURI(src));
