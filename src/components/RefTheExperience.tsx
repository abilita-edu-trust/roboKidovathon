import React from 'react';
import { MapPin } from 'lucide-react';
import { FutureInnovatorsBanner } from './FutureInnovatorsBanner';
import { PathwayCard } from './PathwayCard';
import { RegisterWizard } from '../pages/register/RegisterWizard';
import { useT } from '../content/useT';
import type { ExperienceData } from '../content/sections/programmes';

/** The line under "Find your pathway" on the home page. */
const REGISTER_INTRO = {
  en: 'Choose your programme, tell us how you would like to participate, and complete your registration.',
  sv: 'Välj ditt program, berätta hur du vill delta och slutför din anmälan.',
};

interface RefTheExperienceProps {
  /** Banner, programme cards and venues from the Site CMS. */
  data: ExperienceData;
  go: (href: string) => void;
  /** Opens the ideas page (after an idea is registered). */
  onNavigateVoting?: () => void;
}

export const RefTheExperience: React.FC<RefTheExperienceProps> = ({ data, go, onNavigateVoting }) => {
  const { t } = useT();
  return (
    <section
      id="choose-experience"
      className="w-full bg-gradient-to-b from-[#F2F8FD] via-[#F8FBFE] to-white text-[#0A1930] py-16 sm:py-24 px-4 sm:px-6 lg:px-10 select-none relative overflow-hidden border-t border-slate-200"
    >
      <div className="max-w-[1560px] mx-auto space-y-12 relative z-10">

        {/* ── 01. CITY BANNER: "<City> Future Innovators 2026" over the city skyline ── */}
        <FutureInnovatorsBanner src={data.banner} />

        {/* ── 02. TWO PRIMARY EVENT PATHWAY CARDS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

          {data.cards.map((card, i) => (
            <PathwayCard key={i} data={card} onCta={go} half delay={i * 0.15} />
          ))}
        </div>

        {/* ── 03. VENUES ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 pb-2">
          {data.venues.map((venue, i) => (
            <div key={i} className="flex flex-col bg-white border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="p-5 flex items-start gap-4 flex-1">
                <div
                  className={`w-12 h-12 flex items-center justify-center shrink-0 ${
                    venue.theme !== 'hack' ? 'bg-[#006AA7]/10 text-[#006AA7]' : 'bg-[#059669]/10 text-[#059669]'
                  }`}
                >
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-headline font-bold text-xs sm:text-sm text-[#0A1930] uppercase tracking-wider">
                    {t(venue.label)}
                  </h5>
                  <p
                    className={`font-headline font-black text-lg sm:text-xl mt-1 leading-tight ${
                      venue.theme !== 'hack' ? 'text-[#006AA7]' : 'text-[#059669]'
                    }`}
                  >
                    {t(venue.name)}
                  </p>
                  {t(venue.detail) && <p className="text-xs text-slate-600 font-light mt-0.5">{t(venue.detail)}</p>}
                </div>
              </div>
              <div className="h-32 border-t border-slate-200 bg-[#F8FAFC] flex items-center justify-center p-4">
                {venue.image ? (
                  <img src={venue.image} alt={t(venue.detail) || t(venue.name)} className="max-h-full w-auto object-contain" />
                ) : (
                  <span className="text-[11px] font-mono-code font-bold uppercase tracking-widest text-slate-400">
                    {t(data.noImage)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── 04. REGISTRATION: the register page's wizard, right here ── */}
        <div id="find-your-pathway" className="max-w-5xl mx-auto w-full pt-4 scroll-mt-24 select-text">
          <RegisterWizard intro={REGISTER_INTRO} onNavigateVoting={onNavigateVoting} />
        </div>

        {/* ── 05. FOOTER SUB-STRIP ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs font-mono-code text-slate-400 border-t border-slate-200">
          <span>{t(data.stripLeft)}</span>

          <div className="relative">
            <span className="font-handwriting text-lg sm:text-xl text-[#0A1930]">
              {t(data.stripMiddle)}
            </span>
            <div className="w-full h-0.5 bg-[#FFCD00] -mt-0.5" />
          </div>

          <span className="font-bold text-[#006AA7] tracking-wider">
            {t(data.stripRight)}
          </span>
        </div>

      </div>
    </section>
  );
};
