import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';

interface HeroProps {
  onOpenRegister: () => void;
  onNavigate?: (route: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenRegister,
}) => {
  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between bg-[#000000] text-white overflow-hidden select-none">
      
      {/* ── 1. CINEMATIC VIDEO INSTALLATION (45-65% Asymmetric Visual Canvas) ── */}
      <div className="absolute inset-0 lg:left-[35%] lg:right-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full relative"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1920&q=80"
            className="w-full h-full object-cover opacity-60 lg:opacity-75"
          >
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-robotic-arm-working-in-a-factory-42866-large.mp4"
              type="video/mp4"
            />
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-person-working-on-a-circuit-board-42878-large.mp4"
              type="video/mp4"
            />
          </video>

          {/* Architectural Edge Vignettes (Soft seamless blending with black canvas) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#000000]/40 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-[#000000]/60 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/80 via-transparent to-[#000000] pointer-events-none" />
        </motion.div>
      </div>

      {/* ── 2. EDITORIAL FOREGROUND TYPOGRAPHY & CTA ── */}
      <div className="relative z-10 max-w-[1440px] mx-auto w-full px-6 sm:px-10 flex-1 flex flex-col justify-center pt-32 pb-16">
        <div className="max-w-4xl">
          
          {/* Event Brand Tag */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-2 mb-6"
          >
            <span className="w-1.5 h-1.5 bg-[#0052FF]" />
            <span className="text-[13px] font-mono-code font-bold tracking-[0.25em] text-slate-400 uppercase">
              ROBO-KIDO-A-THON
            </span>
          </motion.div>

          {/* Massive Confident Editorial Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1
              className="font-display font-black uppercase leading-[0.88] tracking-tight text-white"
              style={{
                fontSize: 'clamp(3.2rem, 9vw, 8.5rem)',
                textWrap: 'balance',
              }}
            >
              The Next<br />
              Generation<br />
              of Innovators<br />
              Starts Here.
            </h1>
          </motion.div>

          {/* Primary Action Button (No extra text, no taglines) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 sm:mt-12"
          >
            <button
              onClick={onOpenRegister}
              className="inline-flex items-center justify-center gap-3 bg-white text-black font-display font-black text-xs sm:text-sm tracking-[0.14em] uppercase py-4 px-9 border border-white hover:bg-[#0052FF] hover:text-white hover:border-[#0052FF] transition-all duration-200 shadow-2xl group"
            >
              <span>REGISTER NOW</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

        </div>
      </div>

      {/* ── 3. MINIMAL CORNER REGISTRATION MARKS & SCROLL CUE ── */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-10 pb-8 flex items-center justify-between text-xs font-mono-code text-slate-500">
        <div className="flex items-center gap-3">
          <span className="text-xs tracking-[0.2em] uppercase text-slate-400">
            [ 01 // 04 ]
          </span>
        </div>

        <a
          href="#mission"
          className="flex items-center gap-1.5 text-xs tracking-[0.2em] text-slate-400 hover:text-white uppercase transition-colors"
        >
          <span>SCROLL</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#0052FF] animate-bounce" />
        </a>
      </div>

    </section>
  );
};
