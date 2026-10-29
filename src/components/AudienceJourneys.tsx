import React, { useId, useRef, useState } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { ArrowRight, CalendarDays, CheckCircle2, Sparkles } from 'lucide-react';
import { useT } from '../content/useT';
import { sentenceLines } from '../content/richText';
import { siteIcon } from '../content/icons';
import { hasLabel } from '../content/sections/frame';
import type { JourneyData } from '../content/sections/journey';
import type { ProgrammeAudience, ProgrammeJourney } from '../content/sections/audienceJourneys';

const DATE_DOTS = ['bg-[#FFCD00]', 'bg-[#006AA7]', 'bg-emerald-400', 'bg-sky-300'];

/** Colours per programme accent; blue is the default. */
const ACCENTS = {
  blue: {
    bar: 'bg-[#006AA7]',
    chip: 'bg-[#006AA7] text-white',
    tabActive: 'bg-[#006AA7] text-white border-[#006AA7]',
    tabIcon: 'text-[#FFCD00]',
    number: 'bg-[#006AA7] text-white',
    line: 'bg-[#006AA7]/20',
    button: 'bg-[#006AA7] hover:bg-[#00568A] text-white',
    check: 'text-[#006AA7]',
    fallback: 'from-[#006AA7] to-[#0A1930]',
  },
  yellow: {
    bar: 'bg-[#FFCD00]',
    chip: 'bg-[#FFCD00] text-[#0A1930]',
    tabActive: 'bg-[#0A1930] text-white border-[#0A1930]',
    tabIcon: 'text-[#FFCD00]',
    number: 'bg-[#FFCD00] text-[#0A1930]',
    line: 'bg-[#FFCD00]/40',
    button: 'bg-[#FFCD00] hover:bg-[#E6B800] text-[#0A1930]',
    check: 'text-[#C9A000]',
    fallback: 'from-[#0A1930] to-[#1E3A5F]',
  },
};
type Accent = (typeof ACCENTS)['blue'];

/** CSS object-position for the CMS's image focus choices. */
const POSITIONS: Record<string, string> = { center: 'center', top: 'center top', bottom: 'center bottom', left: 'left center', right: 'right center' };

interface AudienceJourneysProps {
  /** Heading, programmes and season dates from the Site CMS. */
  data: JourneyData;
  go: (href: string) => void;
}

/** The journey section with one box per programme, each with its own audience tabs. */
export const AudienceJourneys: React.FC<AudienceJourneysProps> = ({ data, go }) => {
  const { t } = useT();

  return (
    <MotionConfig reducedMotion="user">
      <section className="w-full bg-white text-[#0A1930] py-8 sm:py-10 px-4 sm:px-6 lg:px-10 border-t border-slate-200">
        <div className="max-w-[1400px] mx-auto space-y-8">

          {/* ── SECTION HEADER ── */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            {t(data.eyebrow) && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 border border-[#006AA7]/20 text-[#006AA7] text-xs font-mono-code font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-[#FFCD00]" aria-hidden="true" />
                <span>{t(data.eyebrow)}</span>
              </div>
            )}
            <h2 className="font-headline font-black text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-[#0A1930]">
              {sentenceLines(t(data.title))}
            </h2>
            {t(data.intro) && <p className="text-sm text-slate-600 font-light leading-relaxed">{t(data.intro)}</p>}
          </div>

          {/* ── PROGRAMME BOXES ── */}
          <div className="space-y-8 sm:space-y-10">
            {(data.programmes ?? []).map((p, i) => (
              <ProgrammeBox key={p.id || i} programme={p} go={go} />
            ))}
          </div>

          {/* ── SEASON DATES ── */}
          {(data.dates ?? []).length > 0 && (
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
              {t(data.note) && <div className="text-[13px] font-mono-code text-slate-400 text-center lg:text-right shrink-0">{t(data.note)}</div>}
            </div>
          )}
        </div>
      </section>
    </MotionConfig>
  );
};

/** One programme: title, date, audience tabs and the selected audience's journey. */
const ProgrammeBox: React.FC<{ programme: ProgrammeJourney; go: (href: string) => void }> = ({ programme, go }) => {
  const { t } = useT();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();
  const accent = ACCENTS[programme.accent as keyof typeof ACCENTS] ?? ACCENTS.blue;
  const audiences = programme.audiences ?? [];
  const index = Math.min(active, Math.max(audiences.length - 1, 0));
  const current = audiences[index];
  const tabId = (i: number) => `${uid}-tab-${i}`;
  const panelId = `${uid}-panel`;

  // Arrow keys move between tabs (and select them), Home/End jump to the first/last.
  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = audiences.length - 1;
    const next = { ArrowRight: index + 1, ArrowDown: index + 1, ArrowLeft: index - 1, ArrowUp: index - 1, Home: 0, End: last }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    const target = next < 0 ? last : next > last ? 0 : next;
    setActive(target);
    tabRefs.current[target]?.focus();
  };

  return (
    <article className="relative bg-white border border-slate-200 shadow-sm" aria-labelledby={`${uid}-title`}>
      <span className={`absolute top-0 left-0 right-0 h-1 ${accent.bar}`} aria-hidden="true" />

      {/* Header */}
      <header className="px-5 sm:px-8 pt-7 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-100">
        <div className="space-y-1">
          <h3 id={`${uid}-title`} className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#0A1930]">
            {t(programme.title)}
          </h3>
          {t(programme.subtitle) && <p className="text-sm text-slate-600">{t(programme.subtitle)}</p>}
        </div>
        {t(programme.dateLabel) && (
          <span className={`inline-flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 font-mono-code font-bold text-xs uppercase tracking-wider ${accent.chip}`}>
            <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
            {t(programme.dateLabel)}
          </span>
        )}
      </header>

      {/* Audience tabs: one per row on phones (the labels are too long for three across), side by side from sm */}
      <div className="px-5 sm:px-8 pt-5">
        <div
          role="tablist"
          aria-label={t(programme.title)}
          onKeyDown={onKeyDown}
          className="grid grid-cols-1 sm:grid-cols-[repeat(var(--tab-count),minmax(0,1fr))] gap-2"
          style={{ '--tab-count': Math.max(audiences.length, 1) } as React.CSSProperties}
        >
          {audiences.map((a, i) => {
            const Icon = siteIcon(a.icon);
            const selected = i === index;
            return (
              <button
                key={a.id || i}
                ref={(el) => { tabRefs.current[i] = el; }}
                id={tabId(i)}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={panelId}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                className={`min-h-[44px] sm:min-h-[48px] px-4 py-2.5 flex items-center justify-start sm:justify-center gap-2.5 sm:gap-2 text-left sm:text-center font-headline font-black text-xs uppercase tracking-wide leading-tight border-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006AA7] ${
                  selected ? accent.tabActive : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${selected ? accent.tabIcon : 'text-slate-500'}`} aria-hidden="true" />
                <span>{t(a.label)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected audience */}
      <div id={panelId} role="tabpanel" aria-labelledby={tabId(index)} tabIndex={0} className="px-5 sm:px-8 pt-6 pb-7 sm:pb-8 focus:outline-none">
        {current && (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id || index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <AudiencePanel audience={current} accent={accent} go={go} />
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </article>
  );
};

/**
 * Left (about 55%): heading, description, steps and button. Right (about 45%): image and benefits.
 * On phones the columns dissolve (display: contents) so the image follows the introduction.
 */
const AudiencePanel: React.FC<{ audience: ProgrammeAudience; accent: Accent; go: (href: string) => void }> = ({ audience: a, accent, go }) => {
  const { t } = useT();
  const benefits = (a.benefits ?? []).filter((b) => t(b));
  const steps = a.steps ?? [];

  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[55fr_45fr] lg:gap-10">
      <div className="contents lg:flex lg:flex-col lg:gap-6">
        {/* Heading and description */}
        <div className="order-1 lg:order-none space-y-2">
          <h4 className="font-headline font-black text-xl sm:text-2xl uppercase tracking-tight text-[#0A1930]">{t(a.heading)}</h4>
          {t(a.description) && <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">{t(a.description)}</p>}
        </div>

        {/* Five numbered steps */}
        {steps.length > 0 && (
          <ol className="order-3 lg:order-none space-y-0">
            {steps.map((s, i) => (
              <li key={i} className="relative flex gap-4 pb-4 last:pb-0">
                {i < steps.length - 1 && <span className={`absolute left-[15px] top-8 bottom-0 w-0.5 ${accent.line}`} aria-hidden="true" />}
                <span className={`relative z-[1] w-8 h-8 shrink-0 rounded-full flex items-center justify-center font-headline font-black text-sm ${accent.number}`}>
                  {i + 1}
                </span>
                <div className="pt-1 min-w-0">
                  <p className="font-headline font-black text-sm uppercase tracking-tight text-[#0A1930]">{t(s.title)}</p>
                  {t(s.description) && <p className="mt-0.5 text-[13px] text-slate-600 leading-relaxed">{t(s.description)}</p>}
                </div>
              </li>
            ))}
          </ol>
        )}

        {/* Button */}
        {hasLabel(a.cta) && (
          <div className="order-5 lg:order-none">
            <button
              type="button"
              onClick={() => go(a.cta.href)}
              className={`group inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3.5 font-headline font-black text-xs uppercase tracking-wider shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006AA7] ${accent.button}`}
            >
              <span>{t(a.cta.label)}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      <div className="contents lg:flex lg:flex-col lg:gap-5">
        {/* Audience image */}
        <div className="order-2 lg:order-none">
          <AudienceImage audience={a} accent={accent} />
        </div>

        {/* Why participate? */}
        {(t(a.benefitsHeading) || benefits.length > 0) && (
          <div className="order-4 lg:order-none bg-slate-50 border border-slate-200 p-5">
            {t(a.benefitsHeading) && <p className="font-headline font-black text-sm uppercase tracking-tight text-[#0A1930]">{t(a.benefitsHeading)}</p>}
            <ul className="mt-3 space-y-2">
              {benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 leading-snug">
                  <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${accent.check}`} aria-hidden="true" />
                  <span>{t(b)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

/** The uploaded image, or an illustrated placeholder while there is none (or it fails to load). */
const AudienceImage: React.FC<{ audience: ProgrammeAudience; accent: Accent }> = ({ audience: a, accent }) => {
  const { t } = useT();
  const [failed, setFailed] = useState<string | null>(null);
  const src = a.image?.trim();

  if (src && failed !== src) {
    return (
      <div className="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[3/2] w-full overflow-hidden bg-slate-100 border border-slate-200">
        <img
          src={src}
          alt={t(a.imageAlt)}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(src)}
          className="w-full h-full object-cover"
          style={{ objectPosition: POSITIONS[a.imagePosition] ?? 'center' }}
        />
      </div>
    );
  }

  const Icon = siteIcon(a.icon);
  return (
    <div className={`relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[3/2] w-full overflow-hidden bg-gradient-to-br ${accent.fallback} flex items-center justify-center`} aria-hidden="true">
      <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle,white_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="relative flex flex-col items-center gap-3 text-white">
        <span className="w-20 h-20 rounded-full bg-white/10 border border-white/25 flex items-center justify-center">
          <Icon className="w-9 h-9 text-[#FFCD00]" />
        </span>
        <span className="font-headline font-black text-sm uppercase tracking-wider text-white/85">{t(a.label)}</span>
      </div>
    </div>
  );
};
