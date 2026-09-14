import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { roboPrecisionActionWide } from '../assets/images';

const HERO_VIDEO_URL = 'https://res.cloudinary.com/joeek52k/video/upload/v1789013088/Blix-A-Thon_2nd_Edition_IIT_Bombay_Techfest___Blix_Robotix_1080P_60FPS.mp4';

interface RefHeroProps {
  onNavigate: (route: string) => void;
  onOpenRegister: () => void;
}

export const RefHero: React.FC<RefHeroProps> = ({
  onNavigate,
  onOpenRegister,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Skip to competition/arena footage — avoids the opening person close-up
    video.currentTime = 90;
    video.play().catch((err) => {
      console.log('Video autoplay error:', err);
    });
  }, []);

  return (
    <section className="relative w-full h-screen min-h-[640px] flex flex-col justify-end overflow-hidden select-none bg-[#070709]">

      {/* ── FULL-SCREEN BACKGROUND VIDEO ── */}
      {/* Wrapper clips letterbox bars; scale(1.38) pushes baked-in 132px black bars out of view */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster={roboPrecisionActionWide}
          className="w-full h-full object-cover scale-[1.38] origin-center"
          style={{ transform: 'scale(1.38)', transformOrigin: 'center center' }}
        >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>
      </div>

      {/* ── GRADIENT SCRIM ── */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        {/* Soft left fade — keeps headline readable while letting video shine */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />
        {/* Bottom-up fade — grounds bottom content gently */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        {/* Top subtle vignette */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/20 to-transparent" />
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
            {/* Eyebrow */}
            <span className="font-mono-code font-bold text-[10px] sm:text-[11px] text-[#FFCD00] tracking-[0.2em] uppercase block">
              4–5 DECEMBER 2026 · VÄSTERÅS, SWEDEN
            </span>

            {/* Main headline - refined & compact */}
            <h1
              className="font-headline font-black uppercase text-white tracking-tight leading-[0.98]"
              style={{ fontSize: 'clamp(1.85rem, 4.2vw, 3.85rem)' }}
            >
              Build ideas.<br />
              Test them.<br />
              <span className="text-[#FFCD00]">Take them further.</span>
            </h1>

            {/* Sub-copy - refined size */}
            <p className="text-xs sm:text-sm text-white/75 font-light leading-relaxed max-w-md">
              Västerås Future Innovators — hands-on STEM robotics and the Young Innovators Hackathon,
              built for Swedish schools, grades 3–9 and Gymnasium.
            </p>

            {/* CTAs - compact & sharp */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1.5">
              <button
                onClick={onOpenRegister}
                className="px-5 py-3 sm:px-6 sm:py-3 bg-[#FFCD00] hover:bg-[#E6B800] text-[#0A1930] font-syne font-black text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <span>REGISTER SCHOOL / TEAM</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigate('events')}
                className="px-5 py-3 sm:px-6 sm:py-3 bg-white/10 hover:bg-white/20 text-white border border-white/25 font-syne font-bold text-xs tracking-wider uppercase transition-all backdrop-blur-sm flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <span>EXPLORE EVENTS</span>
              </button>
            </div>
          </motion.div>

          {/* RIGHT: quick-fact pills, bottom-aligned - refined & compact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-wrap gap-2 items-end justify-start lg:justify-end"
          >
            {[
              { label: 'GRADES', value: '3–9 + GYM' },
              { label: 'PRIZE POOL', value: 'SEK 3,000' },
              { label: 'PROGRAMME', value: '20H STEM' },
              { label: 'LGR22', value: 'CURRICULUM FIT' },
              { label: 'ARENA', value: '244 × 122 CM' },
              { label: 'FINAL DATE', value: 'DEC 4 & 5, 2026' },
            ].map((fact) => (
              <div
                key={fact.label}
                className="flex flex-col gap-0.5 px-3 py-2 sm:px-3.5 sm:py-2.5 bg-white/10 backdrop-blur-md border border-white/15 text-white"
              >
                <span className="font-mono-code font-bold text-[8.5px] sm:text-[9px] text-white/55 uppercase tracking-widest">
                  {fact.label}
                </span>
                <span className="font-headline font-black text-xs sm:text-sm tracking-wide uppercase">
                  {fact.value}
                </span>
              </div>
            ))}
          </motion.div>

        </div>
      </div>

      {/* ── SCROLL CUE ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/40"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>

    </section>
  );
};
