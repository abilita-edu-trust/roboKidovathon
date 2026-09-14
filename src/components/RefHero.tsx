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
        {/* Strong left fade — keeps headline readable over any video content */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />
        {/* Bottom-up fade — grounds the content block */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        {/* Top vignette — softens the navbar edge */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/40 to-transparent" />
      </div>

      {/* ── CONTENT: pinned to bottom of screen ── */}
      <div className="relative z-10 w-full pl-3 pr-3 sm:pl-6 sm:pr-6 pb-16 sm:pb-20 pt-28">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-end">

          {/* LEFT: headline block */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-5"
          >
            {/* Eyebrow */}
            <span className="font-mono-code font-bold text-[11px] sm:text-xs text-[#FFCD00] tracking-[0.25em] uppercase">
              4–5 DECEMBER 2026 · VÄSTERÅS, SWEDEN
            </span>

            {/* Main headline - decreased by 10% */}
            <h1
              className="font-headline font-black uppercase text-white tracking-tight leading-[0.95]"
              style={{ fontSize: 'clamp(2.5rem, 6.3vw, 5.85rem)' }}
            >
              Build ideas.<br />
              Test them.<br />
              <span className="text-[#FFCD00]">Take them further.</span>
            </h1>

            {/* Sub-copy - decreased by 10% */}
            <p className="text-xs sm:text-sm md:text-base text-white/70 font-light leading-relaxed max-w-lg">
              Västerås Future Innovators — hands-on STEM robotics and the Young Innovators Hackathon,
              built for Swedish schools, grades 3–9 and Gymnasium.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 pt-2">
              <button
                onClick={onOpenRegister}
                className="px-7 py-4 bg-[#FFCD00] hover:bg-[#E6B800] text-[#0A1930] font-syne font-black text-xs sm:text-sm tracking-wider uppercase transition-all shadow-xl flex items-center justify-center gap-2"
              >
                <span>REGISTER SCHOOL / TEAM</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('events')}
                className="px-7 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/25 font-syne font-bold text-xs sm:text-sm tracking-wider uppercase transition-all backdrop-blur-sm flex items-center justify-center gap-2"
              >
                <span>EXPLORE EVENTS</span>
              </button>
            </div>
          </motion.div>

          {/* RIGHT: quick-fact pills, bottom-aligned */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-wrap gap-2.5 items-end justify-start lg:justify-end"
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
                className="flex flex-col gap-0.5 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/15 text-white"
              >
                <span className="font-mono-code font-bold text-[9px] sm:text-[10px] text-white/50 uppercase tracking-widest">
                  {fact.label}
                </span>
                <span className="font-headline font-black text-sm sm:text-base tracking-wide uppercase">
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
