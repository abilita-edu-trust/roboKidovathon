import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useT } from '../../content/useT';
import { HomeSections, type SectionEnv } from '../../content/registry';
import type { ResolvedPage } from '../../content/useSiteDocument';

/**
 * One of a city site's own pages from the Site CMS (e.g. indiskbarnklubb.se/ibk/about): its title, then its
 * blocks. The site's header and footer are around it, as on every page.
 */
export const CityPage: React.FC<{ env: SectionEnv; page: ResolvedPage | undefined; ready: boolean; onNavigateHome: () => void }> = ({
  env,
  page,
  ready,
  onNavigateHome,
}) => {
  const { t, L } = useT();
  const title = page ? t(page.title) : ready ? L('Page not found', 'Sidan finns inte') : '';

  // A link straight to a block (e.g. /ibk/about#contact): its blocks arrive with the site's content, so scroll once they are there.
  const pageId = page?.id;
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!pageId || !id) return;
    const timer = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
    return () => clearTimeout(timer);
  }, [pageId]);

  return (
    <div className="w-full bg-white text-[#0A1930] pt-28">
      <div className="px-4 sm:px-6 lg:px-10 pb-6">
        <div className="max-w-[1400px] mx-auto space-y-6 border-b border-slate-200 pb-8">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs font-mono-code font-bold tracking-wider text-[#006AA7] uppercase hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{L('Back to home', 'Tillbaka till startsidan')}</span>
          </button>
          {title && (
            <h1 className="font-headline font-black uppercase tracking-tight leading-[1.02]" style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)' }}>
              {title}
            </h1>
          )}
          {ready && !page && (
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
              {L('This page has moved or no longer exists.', 'Sidan har flyttats eller finns inte längre.')}
            </p>
          )}
        </div>
      </div>
      {page && <HomeSections env={env} sections={page.sections} />}
    </div>
  );
};
