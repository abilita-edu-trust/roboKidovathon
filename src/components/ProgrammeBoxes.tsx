// The programme section's two boxes on vfi and IBK: RoboKidovation (a row per category: Build & Play, Junior Robo
// Sprint, Senior Robo Sprint, each leading to its section with the full poster and rules) and Future InnoHack (a
// panel per track with its key date and registration). Desktop: two equal columns of equal height with aligned
// footers (the final day and venue, then a link); below 1024px the boxes stack and take their natural height.
import React from 'react';
import { ArrowRight, CalendarDays, ChevronRight, Lock, MapPin } from 'lucide-react';
import { useT } from '../content/useT';
import { useSite } from '../context/SiteContext';
import { siteIcon } from '../content/icons';
import { targetToHref } from '../content/sections/frame';
import type { ExperienceData, PathwayData } from '../content/sections/programmes';
import type { ProgrammeTrack } from '../content/sections/audienceJourneys';
import type { Bi, CmsLink } from '../content/core';

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006AA7]';

/** A same-site link that the app routes (and scrolls) itself; other addresses open normally. */
const linkProps = (href: string, go: (href: string) => void) => ({
  href,
  onClick: (e: React.MouseEvent) => {
    if (/^https?:/.test(href)) return;
    e.preventDefault();
    go(href);
  },
});

const Box: React.FC<{
  id: string;
  card: PathwayData;
  dark: boolean;
  finalLabel: Bi;
  final: { date: Bi; venue: Bi };
  cta: CmsLink;
  go: (href: string) => void;
  children: React.ReactNode;
}> = ({ id, card, dark, finalLabel, final, cta, go, children }) => {
  const { t } = useT();
  const Icon = siteIcon(card.icon);
  return (
    <article aria-labelledby={`${id}-title`} className="min-w-0 flex flex-col bg-white border border-slate-200 shadow-[0_12px_32px_-16px_rgba(10,25,48,0.35)]">
      <header className={`min-h-[90px] md:min-h-[110px] shrink-0 flex items-center gap-3 md:gap-5 lg:gap-4 xl:gap-5 px-4 md:px-6 ${dark ? 'bg-[#0A1930]' : 'bg-[#006AA7]'}`}>
        <span
          className={`w-12 h-12 md:w-16 md:h-16 lg:w-14 lg:h-14 xl:w-16 xl:h-16 shrink-0 flex items-center justify-center border-2 ${dark ? 'border-[#FFCD00]/50 bg-[#FFCD00]/10 text-[#FFCD00]' : 'border-white/40 bg-white/10 text-white'}`}
          aria-hidden="true"
        >
          <Icon className="w-6 h-6 md:w-8 md:h-8" />
        </span>
        <span className="w-px self-stretch my-5 md:my-6 bg-white/25" aria-hidden="true" />
        <span className="min-w-0">
          <h3 id={`${id}-title`} className="font-headline font-black uppercase tracking-tight leading-none text-white text-[1.35rem] md:text-[2rem] lg:text-[1.6rem] xl:text-[2rem] break-words">
            {t(card.title)}
          </h3>
          {t(card.tagline) && (
            <span className={`block mt-1.5 md:mt-2 font-mono-code font-bold uppercase tracking-[0.18em] md:tracking-[0.25em] lg:tracking-[0.15em] xl:tracking-[0.25em] text-[10px] md:text-[12px] lg:text-[10px] xl:text-[12px] ${dark ? 'text-[#FFCD00]' : 'text-sky-100'}`}>
              {t(card.tagline)}
            </span>
          )}
        </span>
      </header>
      <div className="flex-1 flex flex-col gap-[10px] md:gap-3 p-4 md:p-6">{children}</div>
      <div className="flex flex-col gap-3 px-4 pb-4 md:px-6 md:pb-6">
        <p className="flex flex-wrap items-center justify-center gap-x-3 xl:gap-x-4 gap-y-1.5 bg-[#EEF5FC] px-3 md:px-4 py-3 md:py-4 text-[#0A1930] font-bold text-[15px] md:text-[17px] leading-tight text-center">
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="w-5 h-5 md:w-6 md:h-6 text-[#006AA7] shrink-0" aria-hidden="true" />
            {t(finalLabel)}: {t(final.date)}
          </span>
          <span className="hidden sm:block w-px h-6 bg-slate-300" aria-hidden="true" />
          <span className="inline-flex items-center gap-2">
            <MapPin className="w-5 h-5 md:w-6 md:h-6 text-[#006AA7] shrink-0" aria-hidden="true" />
            {t(final.venue)}
          </span>
        </p>
        {cta.href && t(cta.label) && (
          <a
            {...linkProps(cta.href, go)}
            className={`group w-full inline-flex items-center justify-center gap-2 border-2 border-[#0A1930] bg-white text-[#0A1930] hover:bg-[#0A1930] hover:text-white px-4 py-3 font-headline font-black uppercase tracking-wider text-[13px] md:text-sm motion-safe:transition-colors ${focusRing}`}
          >
            {t(cta.label)}
            <ArrowRight className="w-4 h-4 motion-safe:transition-transform motion-safe:group-hover:translate-x-1" aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  );
};

/** The two programme boxes (vfi, IBK). `tracks` are Future InnoHack's tracks from Find Your Path. */
export const ProgrammeBoxes: React.FC<{ data: ExperienceData; robo: PathwayData; hack: PathwayData; tracks: ProgrammeTrack[]; go: (href: string) => void }> = ({
  data,
  robo,
  hack,
  tracks,
  go,
}) => {
  const { t, L } = useT();
  const site = useSite();
  return (
    <div className="w-full max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 items-stretch" data-programme-boxes="">
      <Box id="programme-robo" card={robo} dark={false} finalLabel={data.finalLabel} final={data.roboFinal} cta={data.roboFinal.cta} go={go}>
        <nav aria-label={t(data.categoriesLabel)} className="flex-1 flex flex-col gap-[10px] md:gap-3">
          {data.categories.map((c) => (
            <a
              key={c.id}
              {...linkProps(c.href, go)}
              data-category={c.id}
              className={`group flex-1 xl:flex-none min-h-[110px] md:min-h-[140px] xl:h-[140px] flex items-center gap-3 md:gap-5 lg:gap-4 xl:gap-5 p-3 md:p-[15px] bg-white border border-slate-200 hover:border-[#006AA7] hover:bg-[#F6FAFD] motion-safe:transition-colors ${focusRing}`}
            >
              <span className="shrink-0 w-[120px] h-[80px] md:w-[180px] md:h-[110px] lg:w-[150px] lg:h-[92px] xl:w-[180px] xl:h-[110px] overflow-hidden bg-[#0A1930]">
                <img
                  src={c.image}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
                  style={{ objectPosition: c.imagePosition }}
                />
              </span>
              <span className="min-w-0 flex-1 flex flex-col items-start gap-1">
                <span className="bg-[#FFCD00] text-[#0A1930] font-headline font-black uppercase text-[11px] md:text-[15px] leading-tight px-1.5 md:px-2 py-0.5 md:py-1">{t(c.name)}</span>
                <span className="font-extrabold text-[#006AA7] text-[15px] md:text-xl leading-tight">{t(c.grades)}</span>
                <span className="text-[12.5px] md:text-[15px] text-slate-600 leading-snug">{t(c.description)}</span>
              </span>
              <span
                className="shrink-0 w-8 h-8 md:w-10 md:h-10 hidden sm:flex lg:hidden xl:flex items-center justify-center bg-sky-100 text-[#006AA7] group-hover:bg-[#006AA7] group-hover:text-white motion-safe:transition-colors"
                aria-hidden="true"
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </span>
            </a>
          ))}
        </nav>
      </Box>

      <Box id="programme-hack" card={hack} dark finalLabel={data.finalLabel} final={data.hackFinal} cta={hack.cta} go={go}>
        <div className="flex-1 flex flex-col gap-[10px] md:gap-3">
          {tracks.map((track) => {
            const panel = data.trackPanels.find((p) => p.id === track.id);
            const Icon = siteIcon(panel?.icon);
            const kid = track.id === 'kid';
            const first = track.schedule?.[0];
            const keyDate = first ? [t(first.date), t(first.activity)].filter(Boolean).join(' · ') : t(track.dateLabel);
            const registerTab = kid ? 'kid-innohack' : track.id === 'young' ? 'young-innohack' : 'hackathon';
            const steps = targetToHref(`${site.nav.homeRoute}#innohack-${track.id}`);
            const register = targetToHref(site.nav.registerRoute, registerTab);
            return (
              <div
                key={track.id}
                data-track={track.id}
                className={`flex-1 min-h-[110px] grid grid-cols-[auto_minmax(0,1fr)] xl:grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 p-4 border ${
                  kid ? 'bg-[#FFF8E1] border-[#F3DE9A]' : 'bg-[#EEF5FC] border-[#C9DFF2]'
                }`}
              >
                <span className="row-span-2 xl:row-span-1 self-stretch flex items-center pr-4 border-r border-slate-300 text-[#0A1930]" aria-hidden="true">
                  <Icon className="w-9 h-9 md:w-10 md:h-10" />
                </span>
                <div className="min-w-0">
                  <a {...linkProps(steps, go)} className={`inline-block font-headline font-black uppercase tracking-tight leading-tight text-[#0A1930] text-[1.15rem] md:text-[1.45rem] hover:underline ${focusRing}`}>
                    {t(track.label)}
                  </a>
                  <p className="font-extrabold text-[#006AA7] text-[14px] md:text-[15px] leading-snug">{t(track.eligibility)}</p>
                  {t(panel?.description) && <p className="mt-1 text-[13px] md:text-[14px] text-slate-700 leading-snug">{t(panel?.description)}</p>}
                  {keyDate && (
                    <p className="mt-1.5 inline-flex items-start gap-1.5 text-[12px] md:text-[13px] font-semibold text-[#0A1930]">
                      <CalendarDays className="w-3.5 h-3.5 mt-px shrink-0" aria-hidden="true" />
                      <span>{keyDate}</span>
                    </p>
                  )}
                </div>
                <div className="col-start-2 xl:col-start-3">
                  {track.registrationOpen === false ? (
                    <span className="inline-flex items-center gap-2 border-2 border-[#FFCD00] bg-white px-3 py-2 text-[#0A1930] font-headline font-black uppercase text-[12px] tracking-wide leading-tight xl:max-w-[10.5rem]">
                      <Lock className="w-4 h-4 shrink-0" aria-hidden="true" />
                      {t(track.closedMessage) || L('Opens soon', 'Öppnar snart')}
                    </span>
                  ) : (
                    <a
                      {...linkProps(register, go)}
                      aria-label={L(`Register for ${t(track.label)}`, `Anmäl dig till ${t(track.label)}`)}
                      className={`group inline-flex items-center gap-2 px-4 py-2.5 font-headline font-black text-[13px] md:text-[14px] whitespace-nowrap motion-safe:transition-colors ${
                        kid ? 'bg-[#FFCD00] hover:bg-[#E6B800] text-[#0A1930]' : 'bg-[#006AA7] hover:bg-[#00558A] text-white'
                      } ${focusRing}`}
                    >
                      {L('Register', 'Anmäl dig')}
                      <ArrowRight className="w-4 h-4 motion-safe:transition-transform motion-safe:group-hover:translate-x-1" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Box>
    </div>
  );
};
