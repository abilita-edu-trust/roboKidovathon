import { useMemo } from 'react';
import { useSiteContentState, type Bilingual } from '../lib/siteContent';
import { resolveDocument, type SectionDoc } from './document';
import { defaultSections, KNOWN_SECTION_TYPES, SECTION_DEFS, type SectionEnv } from './registry';

/** One of the site's own pages (Site CMS), its sections ready to render. */
export interface ResolvedPage {
  id: string;
  path: string;
  title: Bilingual;
  sections: SectionDoc[];
}

/**
 * The site's sections as they should render: the saved CMS document laid over the built-in defaults, and the
 * site's own pages (each block's data over its type's defaults). `ready` is false while the database is still
 * being asked (at most 2.5 s).
 */
export function useSiteDocument(env: SectionEnv): { sections: SectionDoc[]; pages: ResolvedPage[]; ready: boolean } {
  const { content, ready } = useSiteContentState(env.siteKey);
  const { siteKey, config, city } = env;
  // Defaults depend only on the site, not on the navigation callbacks.
  const defaults = useMemo(() => defaultSections(env), [siteKey, config, city]);

  const sections = useMemo(() => {
    const dataFor = (s: SectionDoc) => {
      const d = defaults.find((x) => x.id === s.id);
      return d && d.type === s.type ? d.data : SECTION_DEFS[s.type]?.defaults(env);
    };
    return resolveDocument(content.sections as SectionDoc[], defaults, dataFor, KNOWN_SECTION_TYPES);
  }, [content, defaults]);

  const pages = useMemo(
    () =>
      (content.pages ?? []).map((p) => ({
        ...p,
        sections: resolveDocument(p.sections as SectionDoc[], [], (s) => SECTION_DEFS[s.type]?.defaults(env), KNOWN_SECTION_TYPES),
      })),
    [content, siteKey, config, city],
  );

  return { sections, pages, ready };
}
