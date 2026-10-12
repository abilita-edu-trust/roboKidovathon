import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { arenaCourtReference } from '../assets/images';
import { useLanguage } from '../context/LanguageContext';
import { useSite, pickLang } from '../context/SiteContext';
import type { IntakeProgramTab } from '../pages/IntakeRegisterPage';

interface RefHeroProps {
  /** Opens a route, optionally on one register form (the hero buttons come from the site). */
  onNavigate: (route: string, tab?: IntakeProgramTab) => void;
}

export const RefHero: React.FC<RefHeroProps> = ({ onNavigate }) => {
  const { hero } = useSite();
  const { language } = useLanguage();
  const sv = language === 'sv';

  return (
    <section className="relative w-full h-screen min-h-[640px] flex flex-col justify-end overflow-hidden select-none bg-[#070709]">

      {/* ── FUTURE INNOVATORS 2026 HERO BANNER ARTWORK ── */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        <motion.img
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          src={arenaCourtReference}
          alt="Future Innovators 2026 Competition Arena and Robotics Platform"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
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
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md border border-[#FFCD00]/40 text-[#FFCD00] text-[10px] sm:text-[11px] font-mono-code font-bold tracking-[0.18em] uppercase shadow-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFCD00] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFCD00]"></span>
              </span>
              <span>{hero.badge}</span>
            </motion.div>

            {/* Main headline - refined & compact */}
            <h1
              className="font-headline font-black uppercase text-white tracking-tight leading-[0.98]"
              style={{ fontSize: 'clamp(1.85rem, 4.2vw, 3.85rem)' }}
            >
              {hero.lines.map((line, i) =>
                i === hero.lines.length - 1 ? (
                  <span key={line.en} className="text-[#FFCD00]">{pickLang(line, sv)}</span>
                ) : (
                  <React.Fragment key={line.en}>
                    {pickLang(line, sv)}
                    <br />
                  </React.Fragment>
                )
              )}
            </h1>

            {/* Sub-copy - refined size */}
            <p className="text-xs sm:text-sm text-white/75 font-light leading-relaxed max-w-md">
              {pickLang(hero.intro, sv)}
            </p>

            {/* CTAs - compact & sharp with playful interactions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1.5">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onNavigate(hero.primary.target, hero.primary.tab)}
                className="group relative overflow-hidden px-5 py-3 sm:px-6 sm:py-3 bg-[#FFCD00] hover:bg-[#E6B800] text-[#0A1930] font-syne font-black text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-2"
              >
                {/* Playful Light Sweep Shimmer */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />
                <span>{pickLang(hero.primary.label, sv)}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNavigate(hero.secondary.target, hero.secondary.tab)}
                className="px-5 py-3 sm:px-6 sm:py-3 bg-white/10 hover:bg-white/20 text-white border border-white/25 hover:border-white/50 font-syne font-bold text-xs tracking-wider uppercase transition-all backdrop-blur-sm flex items-center justify-center gap-2 shadow-xs"
              >
                <span>{pickLang(hero.secondary.label, sv)}</span>
              </motion.button>
            </div>
          </motion.div>

          {/* RIGHT: quick-fact pills with spring hover physics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-wrap gap-2 items-end justify-start lg:justify-end"
          >
            {hero.facts.map((fact) => (
              <motion.div
                key={fact.label}
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
                  {fact.label}
                </span>
                <span className="font-headline font-black text-xs sm:text-sm tracking-wide uppercase">
                  {fact.value}
                </span>
              </motion.div>
            ))}
          </motion.div>

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
