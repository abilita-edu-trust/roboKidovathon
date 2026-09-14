import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Trophy, MapPin } from 'lucide-react';
import { Interactive3DTilt } from './Interactive3DTilt';

interface RefWorkshopTapeBannerProps {
  onOpenRegister?: () => void;
  onOpenDeckModal?: () => void;
  onNavigate?: (route: string) => void;
}

export const RefWorkshopTapeBanner: React.FC<RefWorkshopTapeBannerProps> = ({
  onOpenRegister,
  onOpenDeckModal,
}) => {
  return (
    <section className="w-full bg-gradient-to-b from-white via-slate-50 to-[#F2F7FB] py-14 sm:py-18 px-3 sm:px-6 border-t border-slate-200 overflow-hidden select-none">
      <div className="w-full">

        {/* Animated Moving Caution Tape */}
        <div className="w-full h-2 overflow-hidden relative shadow-xs">
          <motion.div
            animate={{ x: [0, -32] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            className="w-[200%] h-full"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, #FFCD00, #FFCD00 10px, #0A1930 10px, #0A1930 20px)',
            }}
          />
        </div>

        {/* High-Impact Pre-Footer CTA Card with 3D Interactive Tilt & Deep Gradient */}
        <Interactive3DTilt maxTilt={5} glareOpacity={0.16} className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden p-8 sm:p-12 md:p-14 bg-gradient-to-br from-[#061224] via-[#0A1930] to-[#02284A] text-white border border-slate-700/80 shadow-2xl text-center flex flex-col items-center justify-center space-y-7 cursor-pointer"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Ambient Radial Accent */}
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#FFCD00]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Playful Floating Stamp Badge */}
            <motion.div
              animate={{ rotate: [-3, -1, -3], scale: [1, 1.04, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFCD00] text-[#0A1930] text-[10px] sm:text-[11px] font-mono-code font-black uppercase tracking-widest shadow-md"
            >
              <span>OFFICIAL MDU C2 INTAKE · AUTUMN 2026</span>
            </motion.div>

            {/* Main Headline */}
            <div className="relative space-y-3 max-w-3xl">
              <h2
                className="font-headline font-black uppercase text-white tracking-tight leading-[1.08]"
                style={{ fontSize: 'clamp(1.8rem, 5.5vw, 4.8rem)' }}
              >
                BRING HANDS-ON STEM<br />
                <span className="text-[#FFCD00]">TO YOUR SCHOOL</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-xl mx-auto pt-2">
                Start with a workshop, run a 20-hour STEM project, or prepare a school team for Västerås Future Innovators 2026.
              </p>
            </div>

            {/* Action CTAs */}
            <div className="relative flex flex-wrap items-center justify-center gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenRegister}
                className="group relative overflow-hidden bg-[#FFCD00] hover:bg-[#FACC15] text-[#0A1930] text-xs sm:text-sm font-black py-4 px-8 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />
                <span>BOOK A SCHOOL MEETING</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenDeckModal}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/25 text-xs sm:text-sm font-mono-code font-bold py-4 px-7 flex items-center gap-2 shadow-2xs hover:shadow-xs transition-all backdrop-blur-sm"
              >
                <FileText className="w-4 h-4 text-slate-300" />
                <span>REQUEST PROGRAMME DETAILS</span>
              </motion.button>
            </div>

            {/* Key Facts Ribbon */}
            <div className="relative pt-6 border-t border-white/10 w-full max-w-3xl flex flex-wrap items-center justify-around gap-4 text-[11px] font-mono-code text-slate-300">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FFCD00]" />
                <span>VÄSTERÅS, SWEDEN</span>
              </span>
              <span>•</span>
              <span className="text-[#FFCD00] font-bold">GRAND FINALE · DECEMBER 4 & 5, 2026</span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-[#FFCD00]" />
                <span>SEK 3,000 PRIZE POOL</span>
              </span>
            </div>

          </motion.div>
        </Interactive3DTilt>

      </div>
    </section>
  );
};
