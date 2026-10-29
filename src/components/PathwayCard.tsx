import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Target } from 'lucide-react';
import { useT } from '../content/useT';
import { useSite } from '../context/SiteContext';
import { siteIcon } from '../content/icons';
import { richText } from '../content/richText';
import { hasLabel } from '../content/sections/frame';
import { registerLink, type PathwayData } from '../content/sections/programmes';

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
    node: 'bg-sky-100 text-[#006AA7]',
    nodeHighlight: 'bg-[#006AA7] text-white',
    connector: 'bg-sky-200',
    ctaSolid: 'text-[#006AA7] hover:bg-sky-50',
    bold: 'font-bold text-[#006AA7]',
    ctaPrimary: 'bg-[#006AA7] hover:bg-[#013A63]',
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
    node: 'bg-emerald-100 text-[#059669]',
    nodeHighlight: 'bg-[#059669] text-white',
    connector: 'bg-emerald-200',
    ctaSolid: 'text-[#059669] hover:bg-emerald-50',
    bold: 'font-bold text-[#059669]',
    ctaPrimary: 'bg-[#059669] hover:bg-[#047857]',
  },
} as const;

interface PathwayCardProps {
  /** The card from the Site CMS: RoboKidovation (theme "robo", blue) or a hackathon ("hack", green). */
  data: PathwayData;
  onCta: (href: string) => void;
  /** Two cards side by side (vfi): a header over a 3-per-row step grid. A single card gets a
   *  coloured panel beside a vertical timeline instead. */
  half?: boolean;
  /** Entrance delay, so two cards side by side arrive one after the other. */
  delay?: number;
}

export const PathwayCard: React.FC<PathwayCardProps> = ({ data, onCta: go, half = false, delay = 0 }) => {
  const { t: tr } = useT();
  const site = useSite();
  const t = THEMES[data.theme === 'hack' ? 'hack' : 'robo'];
  const Icon = siteIcon(data.icon);
  const title = tr(data.title);
  const tagline = tr(data.tagline);
  const intro = data.intro.map(tr);
  const steps = data.steps.map((s) => ({ icon: siteIcon(s.icon), title: tr(s.title), subtitle: tr(s.subtitle), date: tr(s.date), highlight: s.highlight }));
  const callout = richText(tr(data.callout), t.bold);
  const ctaLabel = tr(data.cta.label);
  const showCta = hasLabel(data.cta);
  const onCta = () => go(data.cta.href);
  // Saved cards from before the Register button (merged in with a blank link) get the programme's form.
  const register = hasLabel(data.register) ? data.register : registerLink(data.theme, site.nav.registerRoute);

  if (!half) {
    // Long journeys run as two timelines side by side on wide screens.
    const split = steps.length > 6 ? Math.ceil(steps.length / 2) : steps.length;
    const columns = split < steps.length ? [steps.slice(0, split), steps.slice(split)] : [steps];
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
        className={`bg-white border-2 ${t.card} shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]`}
      >
        <div className={`${t.header} text-white p-6 sm:p-8 flex flex-col gap-5`}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/15 border border-white/25 flex items-center justify-center shrink-0 shadow-inner">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-headline font-black text-3xl sm:text-4xl tracking-tight leading-none">{title}</h3>
              <p className={`text-[13px] sm:text-sm font-mono-code font-bold uppercase tracking-[0.2em] ${t.tagline} mt-1.5`}>{tagline}</p>
            </div>
          </div>

          <div className={`space-y-1 text-sm ${t.intro} font-light border-t border-white/15 pt-4`}>
            {intro.map((line, i) => (
              <p key={i} className={i > 0 ? 'text-white/85' : undefined}>
                {line}
              </p>
            ))}
          </div>

          <div className="mt-auto space-y-4">
            <div className="flex gap-3 bg-white/10 border border-white/20 p-4">
              <Target className="w-5 h-5 shrink-0 text-white" />
              <p className="text-sm leading-snug font-medium">{callout}</p>
            </div>
            {showCta && (
            <button
              type="button"
              onClick={onCta}
              className={`group w-full sm:w-auto px-5 py-3 bg-white ${t.ctaSolid} text-xs font-bold font-syne uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 shadow-md`}
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
            )}
          </div>
        </div>

        <div className={`p-6 sm:p-8 grid grid-cols-1 gap-x-8 ${columns.length > 1 ? 'lg:grid-cols-2' : ''}`}>
          {columns.map((list, c) => (
            // Steps spread over the card's full height, joined by one line behind the icons.
            <ol key={c} className={`relative flex flex-col justify-between gap-5 h-full ${c > 0 ? 'pt-5 lg:pt-0' : ''}`}>
              <span className={`absolute left-5 top-5 bottom-5 w-0.5 ${t.connector} ${c > 0 ? 'mt-5 lg:mt-0' : ''}`} aria-hidden />
              {list.map((step, i) => {
                const StepIcon = step.icon;
                const n = c * split + i + 1;
                return (
                  <li key={i} className="relative flex gap-4 group">
                    <span
                      className={`relative z-10 w-10 h-10 shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-110 ${
                        step.highlight ? t.nodeHighlight : t.node
                      }`}
                    >
                      <StepIcon className="w-5 h-5" />
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#0A1930] text-white text-xs font-bold flex items-center justify-center">
                        {n}
                      </span>
                    </span>
                    <div
                      className={`flex-1 min-w-0 flex flex-col gap-x-4 gap-y-1.5 pt-0.5 ${
                        columns.length > 1 ? '' : 'sm:flex-row sm:items-start sm:justify-between'
                      }`}
                    >
                      <div className="min-w-0">
                        <h4 className="font-headline font-bold text-sm uppercase tracking-tight text-[#0A1930] leading-tight">{step.title}</h4>
                        <p className="text-xs text-slate-500 leading-snug mt-0.5">{step.subtitle}</p>
                      </div>
                      {step.date && (
                        <span
                          className={`shrink-0 self-start px-2.5 py-1 text-[13px] font-mono-code font-bold whitespace-nowrap ${
                            step.highlight ? t.pillHighlight : t.pill
                          }`}
                        >
                          {step.date}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          ))}
        </div>
      </motion.div>
    );
  }

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
            <p className={`text-[13px] sm:text-sm font-mono-code font-bold uppercase tracking-[0.2em] ${t.tagline} mt-1`}>
              {tagline}
            </p>
          </div>
        </div>

        <div className={`text-sm sm:text-base ${t.intro} w-full border-t border-white/15 pt-3`}>
          {intro.map((line, i) => (
            <p key={i} className={i > 0 ? 'text-white/80' : undefined}>
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* Steps: one numbered timeline, dates on the right */}
      <div className="p-5 sm:p-7 space-y-6 flex-1 flex flex-col justify-between">
        <ol className="relative">
          {steps.map((step, i) => {
            const StepIcon = step.icon;
            return (
              <li key={i} className="relative flex gap-4 pb-4 last:pb-0 group">
                {i < steps.length - 1 && <span className={`absolute left-6 top-12 bottom-0 w-0.5 ${t.connector}`} aria-hidden />}
                <span
                  className={`relative z-10 w-12 h-12 shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${
                    step.highlight ? t.nodeHighlight : t.node
                  }`}
                >
                  <StepIcon className="w-6 h-6" />
                  <span className="absolute -top-2 -left-2 w-6 h-6 bg-[#0A1930] text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </span>
                <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-x-4 gap-y-1.5 min-h-12">
                  <div className="min-w-0">
                    <h4 className="font-headline font-bold text-base uppercase tracking-tight text-[#0A1930] leading-tight">{step.title}</h4>
                    <p className="text-sm text-slate-600 leading-snug mt-0.5">{step.subtitle}</p>
                  </div>
                  {step.date && (
                    <span
                      className={`shrink-0 self-start sm:self-center px-3 py-1.5 text-[13px] font-mono-code font-bold whitespace-nowrap ${
                        step.highlight ? t.pillHighlight : t.pill
                      }`}
                    >
                      {step.date}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        {/* Who goes to the final, then register or read more */}
        <div className={`${t.callout} border p-4 sm:p-5 space-y-4`}>
          <div className="flex items-start gap-3">
            <div className={`w-9 h-9 ${t.calloutIcon} flex items-center justify-center shrink-0`}>
              <Target className="w-5 h-5" />
            </div>
            <p className="text-sm sm:text-[15px] text-[#0A1930] leading-snug font-medium">{callout}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={() => go(register.href)}
              className={`group flex-1 px-5 py-3 ${t.ctaPrimary} text-white text-sm font-bold font-syne uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-xs`}
            >
              <span>{tr(register.label)}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            {showCta && (
              <button
                type="button"
                onClick={onCta}
                className={`group flex-1 px-5 py-3 bg-white ${t.cta} border text-sm font-bold font-syne uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-2xs`}
              >
                <span>{ctaLabel}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
