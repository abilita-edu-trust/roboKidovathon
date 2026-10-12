import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Target, type LucideIcon } from 'lucide-react';

export interface PathwayStep {
  title: string;
  subtitle: string;
  /** Shown as a pill under the step; steps without a fixed date leave it out. */
  date?: string;
  icon: LucideIcon;
  highlight?: boolean;
}

/** A programme card's content: RoboKidovation (blue) or a hackathon (green). */
export interface PathwayContent {
  theme: 'robo' | 'hack';
  icon: LucideIcon;
  title: string;
  tagline: string;
  /** First line in full colour, the rest a little dimmer. */
  intro: string[];
  steps: PathwayStep[];
  callout: React.ReactNode;
  ctaLabel: string;
}

const THEMES = {
  robo: {
    card: 'border-[#006AA7]',
    header: 'bg-[#006AA7]',
    tagline: 'text-sky-200',
    intro: 'text-sky-100',
    step: 'bg-[#F6FAFD] border-sky-100 hover:bg-sky-50/70 hover:border-sky-300',
    num: 'bg-[#006AA7]',
    iconBox: 'bg-sky-100/70 text-[#006AA7] group-hover:bg-[#006AA7]',
    pill: 'bg-sky-100/80 text-[#006AA7]',
    pillHighlight: 'bg-[#006AA7] text-white shadow-xs',
    callout: 'bg-[#F0F7FD] border-[#BAE6FD]',
    calloutIcon: 'bg-[#006AA7]/10 text-[#006AA7]',
    cta: 'hover:bg-sky-50 text-[#006AA7] border-[#006AA7]/30',
  },
  hack: {
    card: 'border-[#059669]',
    header: 'bg-[#059669]',
    tagline: 'text-emerald-200',
    intro: 'text-emerald-100',
    step: 'bg-[#F4FAF6] border-emerald-100 hover:bg-emerald-50/70 hover:border-emerald-300',
    num: 'bg-[#059669]',
    iconBox: 'bg-emerald-100/70 text-[#059669] group-hover:bg-[#059669]',
    pill: 'bg-emerald-100/80 text-[#059669]',
    pillHighlight: 'bg-[#059669] text-white shadow-xs',
    callout: 'bg-[#F0FDF4] border-[#BBF7D0]',
    calloutIcon: 'bg-[#059669]/10 text-[#059669]',
    cta: 'hover:bg-emerald-50 text-[#059669] border-[#059669]/30',
  },
} as const;

// Steps sit in one row on wide screens; eight steps wrap into two rows of four.
const STEP_COLS: Record<number, string> = {
  4: 'sm:grid-cols-4 lg:grid-cols-4',
  5: 'sm:grid-cols-3 lg:grid-cols-5',
  6: 'sm:grid-cols-3 lg:grid-cols-6',
  8: 'sm:grid-cols-4 lg:grid-cols-4',
};

interface PathwayCardProps extends PathwayContent {
  onCta: () => void;
  /** Two cards side by side: steps go three to a row so titles and dates fit. */
  half?: boolean;
  /** Entrance delay, so two cards side by side arrive one after the other. */
  delay?: number;
}

export const PathwayCard: React.FC<PathwayCardProps> = ({
  theme, icon: Icon, title, tagline, intro, steps, callout, ctaLabel, onCta, half = false, delay = 0,
}) => {
  const t = THEMES[theme];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={`bg-white border-2 ${t.card} shadow-xl overflow-hidden flex flex-col justify-between hover:shadow-2xl transition-all duration-300`}
    >
      {/* Header */}
      <div className={`${t.header} text-white p-6 sm:p-7 flex flex-col items-start gap-4`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/15 border border-white/25 flex items-center justify-center text-white shrink-0 shadow-inner">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="font-headline font-black text-2xl sm:text-3xl text-white tracking-tight leading-none whitespace-nowrap">
              {title}
            </h3>
            <p className={`text-[11px] sm:text-xs font-mono-code font-bold uppercase tracking-[0.2em] ${t.tagline} mt-1`}>
              {tagline}
            </p>
          </div>
        </div>

        <div className={`text-xs sm:text-sm ${t.intro} font-light w-full border-t border-white/15 pt-3`}>
          {intro.map((line, i) => (
            <p key={line} className={i > 0 ? 'text-white/80' : undefined}>
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="p-5 sm:p-7 space-y-6 flex-1 flex flex-col justify-between">
        <div className={`grid grid-cols-2 ${half ? 'sm:grid-cols-3' : STEP_COLS[steps.length] ?? STEP_COLS[6]} gap-3 sm:gap-3.5`}>
          {steps.map((step, i) => {
            const StepIcon = step.icon;
            return (
              <div
                key={step.title}
                className={`${t.step} border p-3.5 flex flex-col items-center text-center gap-3 transition-all duration-200 shadow-2xs group`}
              >
                <div className={`w-7 h-7 ${t.num} text-white flex items-center justify-center font-headline font-bold text-xs shadow-xs group-hover:scale-110 transition-transform`}>
                  {i + 1}
                </div>
                <div className={`w-12 h-12 ${t.iconBox} flex items-center justify-center group-hover:text-white transition-colors duration-200`}>
                  <StepIcon className="w-6 h-6" />
                </div>
                <div className="space-y-1 flex flex-col justify-center">
                  <h4 className="font-headline font-bold text-xs sm:text-sm text-[#0A1930] leading-tight">{step.title}</h4>
                  <p className="text-[11px] text-slate-500 font-normal leading-tight">{step.subtitle}</p>
                </div>
                {step.date && (
                  <div
                    className={`mt-auto w-full py-1.5 px-2 text-[10px] sm:text-[11px] font-mono-code font-bold tracking-tight text-center ${
                      step.highlight ? t.pillHighlight : t.pill
                    }`}
                  >
                    {step.date}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Who goes to the final, and where to read more */}
        <div className={`${t.callout} border p-4 flex flex-col sm:flex-row items-center justify-between gap-4`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 ${t.calloutIcon} flex items-center justify-center shrink-0`}>
              <Target className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm text-[#0A1930] leading-snug font-medium">{callout}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={onCta}
              className={`group w-full sm:w-auto px-4 py-2.5 bg-white ${t.cta} border text-xs font-bold font-syne uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-2xs`}
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
