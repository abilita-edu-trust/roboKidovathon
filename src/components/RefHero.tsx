import React from 'react';
import { motion, MotionConfig } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ChevronDown } from 'lucide-react';
import { useT } from '../content/useT';
import { hasLabel, type HeroData } from '../content/sections/frame';

interface RefHeroProps {
  /** Texts, buttons, facts and background from the Site CMS. */
  data: HeroData;
  /** Follows a button's link. */
  go: (href: string) => void;
}

/** With event cards the hero shows the events layout; sites without them keep the classic one. */
export const RefHero: React.FC<RefHeroProps> = (props) =>
  props.data.events?.length ? <EventsHero {...props} /> : <ClassicHero {...props} />;

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: EASE },
});

/** Top label, two-line headline, intro, one card per event and the main button. */
const EventsHero: React.FC<RefHeroProps> = ({ data: hero, go }) => {
  const { t } = useT();

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative w-full min-h-[100svh] flex flex-col justify-end overflow-hidden bg-[#070709]">

        {/* ── BACKGROUND ── */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-black">
          {hero.video ? (
            <video
              src={hero.video}
              poster={hero.image || undefined}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover object-center"
            />
          ) : (
            hero.image && (
              <motion.img
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.6, ease: EASE }}
                src={hero.image}
                alt="Future Innovators 2026 Competition Arena and Robotics Platform"
                className="w-full h-full object-cover object-center"
                loading="eager"
              />
            )
          )}
        </div>

        {/* ── OVERLAY: an even dark wash, deeper on the left and at the bottom where the text sits ── */}
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/70 to-transparent" />
        </div>

        {/* ── CONTENT ── */}
        <div className="relative z-10 w-full pl-3 pr-3 sm:pl-6 sm:pr-6 pt-28 pb-12 sm:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end">
            <div className="lg:col-span-7">

              {/* Top label */}
              <motion.p
                {...fadeUp(0)}
                className="flex items-center gap-3 text-[#FFCD00] text-[10px] sm:text-[11px] font-mono-code font-bold tracking-[0.22em] uppercase"
              >
                <span className="h-px w-8 bg-[#FFCD00] shrink-0" aria-hidden="true" />
                <span className="whitespace-pre-line">{t(hero.badge)}</span>
              </motion.p>

              {/* Headline: the last line is yellow */}
              <motion.h1
                {...fadeUp(0.08)}
                className="mt-5 font-headline font-black uppercase text-white tracking-tight leading-[0.95]"
                style={{ fontSize: 'clamp(2.4rem, 5.6vw, 4.75rem)' }}
              >
                {hero.lines.map((line, i) => (
                  <span key={i} className={`block ${i === hero.lines.length - 1 ? 'text-[#FFCD00]' : ''}`}>
                    {t(line)}
                  </span>
                ))}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                {...fadeUp(0.16)}
                className="mt-5 text-sm sm:text-base text-white/80 font-light leading-relaxed max-w-xl"
              >
                {t(hero.intro)}
              </motion.p>

              {/* Event cards: side by side, stacked on phones */}
              <motion.div {...fadeUp(0.24)} className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {hero.events.map((event, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => event.href && go(event.href)}
                    className="group relative flex flex-col justify-start text-left p-5 sm:p-6 bg-black/50 backdrop-blur-md border border-white/15 hover:border-[#FFCD00]/70 hover:bg-black/65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFCD00] transition-colors duration-300"
                  >
                    {/* Accent bar that runs the card's width on hover */}
                    <span
                      className="absolute top-0 left-0 h-[2px] w-10 bg-[#FFCD00] transition-all duration-500 ease-out group-hover:w-full"
                      aria-hidden="true"
                    />
                    <span className="flex items-start justify-between gap-4">
                      <span className="font-mono-code font-bold text-[11px] sm:text-xs tracking-[0.2em] uppercase text-[#FFCD00]">
                        {t(event.date)}
                      </span>
                      <ArrowUpRight
                        className="w-4 h-4 shrink-0 text-white/50 transition-all duration-300 group-hover:text-[#FFCD00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="mt-3 block font-headline font-black text-lg sm:text-xl text-white leading-tight">
                      {t(event.title)}
                    </span>
                    <span className="mt-2 block text-xs sm:text-[13px] text-white/70 leading-relaxed">
                      {t(event.kind)}
                      {t(event.audience) && (
                        <>
                          <span className="mx-2 text-white/30" aria-hidden="true">·</span>
                          {t(event.audience)}
                        </>
                      )}
                    </span>
                  </button>
                ))}
              </motion.div>

              {/* Main button */}
              {hasLabel(hero.primary) && (
                <motion.div {...fadeUp(0.32)} className="mt-8">
                  <button
                    type="button"
                    onClick={() => go(hero.primary.href)}
                    className="group inline-flex w-full sm:w-auto items-center justify-center gap-2.5 px-7 py-3.5 bg-[#FFCD00] hover:bg-[#E6B800] text-[#0A1930] font-syne font-black text-xs sm:text-[13px] tracking-wider uppercase shadow-md hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFCD00] transition-colors duration-200"
                  >
                    <span>{t(hero.primary.label)}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </button>
                </motion.div>
              )}
            </div>

            {/* RIGHT: the fact boxes, unchanged from the classic hero */}
            <FactBoxes facts={hero.facts} />
          </div>
        </div>
      </section>
    </MotionConfig>
  );
};

/** Quick-fact pills with spring hover physics, the right-hand column of both layouts. */
const FactBoxes: React.FC<{ facts: HeroData['facts'] }> = ({ facts }) => {
  const { t } = useT();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="lg:col-span-5 flex flex-wrap gap-2 items-end justify-start lg:justify-end"
    >
      {facts.map((fact, i) => (
        <motion.div
          key={i}
          whileHover={{
            scale: 1.06,
            y: -3,
            borderColor: 'rgba(255, 205, 0, 0.7)',
            backgroundColor: 'rgba(255, 255, 255, 0.18)',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="flex flex-col gap-0.5 px-3 py-2 sm:px-3.5 sm:py-2.5 bg-white/10 backdrop-blur-md border border-white/15 text-white cursor-pointer shadow-xs transition-colors duration-200"
        >
          <span className="font-mono-code font-bold text-[8.5px] sm:text-[9px] text-white/60 uppercase tracking-widest">
            {t(fact.label)}
          </span>
          <span className="font-headline font-black text-xs sm:text-sm tracking-wide uppercase">
            {t(fact.value)}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
};

/** The original hero: badge, headline, intro, two buttons and fact boxes. */
const ClassicHero: React.FC<RefHeroProps> = ({ data: hero, go }) => {
  const { t } = useT();

  return (
    <section className="relative w-full h-screen min-h-[640px] flex flex-col justify-end overflow-hidden select-none bg-[#070709]">

      {/* ── FUTURE INNOVATORS 2026 HERO BANNER ARTWORK ── */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        {hero.video ? (
          <video
            src={hero.video}
            poster={hero.image || undefined}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover object-center"
          />
        ) : (
          hero.image && (
            <motion.img
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              src={hero.image}
              alt="Future Innovators 2026 Competition Arena and Robotics Platform"
              className="w-full h-full object-cover object-center"
              loading="eager"
            />
          )
        )}
      </div>

      {/* ── GRADIENT SCRIM ── */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        {/* Deep dark gradient scrim — ensures maximum contrast for text across all screen sizes */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/35" />
        {/* Bottom-up fade — grounds bottom content gently */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        {/* Top subtle vignette */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/70 to-transparent" />
      </div>

      {/* ── CONTENT: pinned to bottom of screen ── */}
      <div className="relative z-10 w-full pl-3 pr-3 sm:pl-6 sm:pr-6 pb-12 sm:pb-16 pt-24">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end">

          {/* LEFT: headline block */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-3.5 sm:space-y-4"
          >
            {/* Eyebrow / Playful Floating Badge */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
              className="inline-flex items-start gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md border border-[#FFCD00]/40 text-[#FFCD00] text-[10px] sm:text-[11px] font-mono-code font-bold tracking-[0.18em] uppercase shadow-md"
            >
              <span className="relative flex h-2 w-2 mt-1 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFCD00] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFCD00]"></span>
              </span>
              <span className="whitespace-pre-line leading-relaxed">
                {t(hero.badge)}
              </span>
            </motion.div>

            {/* Main headline - refined & compact */}
            <h1
              className="font-headline font-black uppercase text-white tracking-tight leading-[0.98]"
              style={{ fontSize: 'clamp(1.85rem, 4.2vw, 3.85rem)' }}
            >
              {hero.lines.map((line, i) =>
                i === hero.lines.length - 1 ? (
                  <span key={i} className="text-[#FFCD00]">{t(line)}</span>
                ) : (
                  <React.Fragment key={i}>
                    {t(line)}
                    <br />
                  </React.Fragment>
                )
              )}
            </h1>

            {/* Sub-copy - refined size */}
            <p className="text-xs sm:text-sm text-white/75 font-light leading-relaxed max-w-md">
              {t(hero.intro)}
            </p>

            {/* CTAs - compact & sharp with playful interactions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1.5">
              {hasLabel(hero.primary) && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => go(hero.primary.href)}
                className="group relative overflow-hidden px-5 py-3 sm:px-6 sm:py-3 bg-[#FFCD00] hover:bg-[#E6B800] text-[#0A1930] font-syne font-black text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-2"
              >
                {/* Playful Light Sweep Shimmer */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />
                <span>{t(hero.primary.label)}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>
              )}

              {hasLabel(hero.secondary) && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => go(hero.secondary.href)}
                className="px-5 py-3 sm:px-6 sm:py-3 bg-white/10 hover:bg-white/20 text-white border border-white/25 hover:border-white/50 font-syne font-bold text-xs tracking-wider uppercase transition-all backdrop-blur-sm flex items-center justify-center gap-2 shadow-xs"
              >
                <span>{t(hero.secondary.label)}</span>
              </motion.button>
              )}
            </div>
          </motion.div>

          {/* RIGHT: quick-fact pills with spring hover physics */}
          <FactBoxes facts={hero.facts} />

        </div>
      </div>

      {/* ── SCROLL CUE ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-0.5 text-white/45 pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 stroke-[2.5]" />
        </motion.div>
      </motion.div>

    </section>
  );
};
