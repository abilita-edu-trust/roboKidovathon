import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Trophy, MapPin } from 'lucide-react';

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
    <section className="w-full bg-white text-[#0A1930] py-14 sm:py-18 px-3 sm:px-6 border-t border-slate-200 overflow-hidden select-none">
      <div className="w-full">

        {/* Clean, High-Impact Pre-Footer CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden p-8 sm:p-12 md:p-14 bg-[#F2F6FA] border border-slate-200/90 shadow-sm text-center flex flex-col items-center justify-center space-y-7"
        >
          {/* Main Headline */}
          <div className="relative space-y-3 max-w-3xl">
            <h2
              className="font-headline font-black uppercase text-[#0A1930] tracking-tight leading-[1.08]"
              style={{ fontSize: 'clamp(1.8rem, 5.5vw, 4.8rem)' }}
            >
              BRING HANDS-ON STEM<br />
              <span className="text-[#006AA7]">TO YOUR SCHOOL</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed max-w-xl mx-auto pt-2">
              Start with a workshop, run a 20-hour STEM project, or prepare a school team for Västerås Future Innovators 2026.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="relative flex flex-wrap items-center justify-center gap-4 pt-2">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenRegister}
              className="btn-pill-lime text-xs sm:text-sm font-black py-4 px-8 flex items-center gap-2 shadow-md"
            >
              <span>BOOK A SCHOOL MEETING</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenDeckModal}
              className="btn-pill-outline text-xs sm:text-sm font-bold py-4 px-7 flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>REQUEST PROGRAMME DETAILS</span>
            </motion.button>
          </div>

          {/* Key Facts Ribbon */}
          <div className="relative pt-6 border-t border-slate-200 w-full max-w-3xl flex flex-wrap items-center justify-around gap-4 text-[11px] font-mono-code text-slate-500">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#006AA7]" />
              <span>VÄSTERÅS, SWEDEN</span>
            </span>
            <span>•</span>
            <span className="text-[#0A1930] font-semibold">GRAND FINALE · DECEMBER 4 & 5, 2026</span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-[#006AA7]" />
              <span>SEK 3,000 PRIZE POOL</span>
            </span>
          </div>

        </motion.div>

      </div>
    </section>
  );
};
