import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
import { fill } from '../content/core';
import { useT } from '../content/useT';
import { sentenceLines } from '../content/richText';
import { siteIcon } from '../content/icons';
import { hasLabel } from '../content/sections/frame';
import type { JourneyData } from '../content/sections/journey';

const DATE_DOTS = ['bg-[#FFCD00]', 'bg-[#006AA7]', 'bg-emerald-400', 'bg-sky-300'];

interface UserJourneyAudienceGuideProps {
  /** Texts, audiences, steps and dates from the Site CMS. */
  data: JourneyData;
  go: (href: string) => void;
}

export const UserJourneyAudienceGuide: React.FC<UserJourneyAudienceGuideProps> = ({ data, go }) => {
  const [activeAudience, setActiveAudience] = useState(0);
  const { t } = useT();
  const current = data.audiences[activeAudience] ?? data.audiences[0];

  return (
    <section className="w-full bg-white text-[#0A1930] py-8 sm:py-10 px-4 sm:px-6 lg:px-10 border-t border-slate-200 select-none">
      <div className="max-w-[1560px] mx-auto space-y-10">

        {/* ── SECTION HEADER ── */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 border border-[#006AA7]/20 text-[#006AA7] text-xs font-mono-code font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#FFCD00]" />
            <span>{t(data.eyebrow)}</span>
          </div>

          <h2 className="font-headline font-black text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-[#0A1930]">
            {sentenceLines(t(data.title))}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
            {t(data.intro)}
          </p>
        </div>

        {/* ── AUDIENCE TAB SELECTOR ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-2xl mx-auto">
          {data.audiences.map((aud, i) => {
            const Icon = siteIcon(aud.icon);
            const active = current === aud;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActiveAudience(i)}
                className={`w-full sm:w-1/3 py-3.5 px-4 flex items-center justify-center gap-2.5 font-headline font-black text-xs uppercase tracking-wider border-2 transition-all ${
                  active
                    ? 'bg-[#006AA7] text-white border-[#006AA7] shadow-md ring-2 ring-[#006AA7]/25'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#FFCD00]' : 'text-slate-500'}`} />
                <span>{t(aud.label)}</span>
              </button>
            );
          })}
        </div>

        {/* ── AUDIENCE DETAILS & 5 VISUAL STEPS ── */}
        {current && (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeAudience}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="space-y-8"
          >
            {/* Context Card */}
            <div className="bg-[#F8FAFC] border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1.5 max-w-2xl">
                <div className="text-[13px] font-mono-code font-bold text-[#006AA7] uppercase tracking-wider flex items-center gap-2">
                  <span>{t(current.tagline)}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-500">{t(current.eligibility)}</span>
                </div>
                <h3 className="font-headline font-black text-xl sm:text-2xl uppercase tracking-tight text-[#0A1930]">
                  {t(current.summary)}
                </h3>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
                {hasLabel(current.cta) && (
                <button
                  type="button"
                  onClick={() => go(current.cta.href)}
                  className="px-6 py-3.5 bg-[#FFCD00] hover:bg-[#E6B800] text-[#0A1930] font-headline font-black text-xs uppercase tracking-wider shadow-sm transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>{t(current.cta.label)}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                )}

                {hasLabel(current.altCta) && (
                <button
                  type="button"
                  onClick={() => go(current.altCta.href)}
                  className="px-5 py-3.5 bg-white hover:bg-slate-50 text-[#006AA7] border border-slate-300 font-headline font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>{t(current.altCta.label)}</span>
                </button>
                )}

                {hasLabel(data.rulesButton) && (
                <button
                  type="button"
                  onClick={() => go(data.rulesButton.href)}
                  className="px-4 py-3.5 bg-transparent hover:bg-slate-100 text-slate-600 font-headline font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1"
                >
                  <span>{t(data.rulesButton.label)}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                )}
              </div>
            </div>

            {/* 5 Clear Visual Steps */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {current.steps.map((st, i) => (
                <div
                  key={i}
                  className="bg-white border-2 border-slate-200 hover:border-[#006AA7] p-5 flex flex-col justify-between transition-all group relative shadow-xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="w-7 h-7 rounded-full bg-[#0A1930] text-[#FFCD00] font-headline font-black text-xs flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="text-xs font-mono-code font-bold text-slate-400 group-hover:text-[#006AA7] uppercase tracking-wider">
                        {t(st.badge)}
                      </span>
                    </div>

                    <h4 className="font-headline font-black text-sm uppercase tracking-tight text-[#0A1930] pt-1">
                      {t(st.title)}
                    </h4>

                    <p className="text-xs text-slate-600 font-light leading-relaxed">
                      {t(st.desc)}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center text-[13px] font-mono-code text-slate-400 group-hover:text-[#006AA7]">
                    <span>{fill(t(data.stepLabel).replace('{total}', String(current.steps.length)), { n: i + 1 })}</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>

            {/* Confirmed dates highlight ribbon */}
            <div className="bg-[#0A1930] text-white p-5 sm:p-6 flex flex-col lg:flex-row items-center justify-between gap-4 border border-[#0A1930]">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-8 text-xs font-mono-code">
                {data.dates.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${DATE_DOTS[i % DATE_DOTS.length]}`} />
                    <span className="text-slate-400 uppercase">{t(d.label)}:</span>
                    <span className="text-white font-bold">{t(d.value)}</span>
                  </div>
                ))}
              </div>

              {t(data.note) && (
                <div className="text-[13px] font-mono-code text-slate-400 text-center lg:text-right shrink-0">{t(data.note)}</div>
              )}
            </div>

          </motion.div>
        </AnimatePresence>
        )}

      </div>
    </section>
  );
};
