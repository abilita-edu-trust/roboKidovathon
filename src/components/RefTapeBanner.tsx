import React from 'react';
import { motion } from 'framer-motion';

interface RefTapeBannerProps {
  onOpenRegister: () => void;
  onNavigate: (route: string) => void;
}

export const RefTapeBanner: React.FC<RefTapeBannerProps> = ({
  onOpenRegister,
  onNavigate,
}) => {
  return (
    <section className="w-full bg-white text-[#0A1930] py-20 px-6 sm:px-10 border-t border-slate-200">
      <div className="max-w-[1440px] mx-auto">

        {/* Graphic Banner Box with Motion */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -4, borderColor: 'rgba(0, 106, 167, 0.35)' }}
          className="rounded-3xl p-8 sm:p-14 bg-[#013A63] border border-[#013A63] space-y-8 text-center lg:text-left shadow-md transition-all"
        >
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6">
            <span
              className="font-headline font-black text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white leading-none"
            >
              SCANDINAVIAN
            </span>

            {/* Yellow Caution Tape Pill with Animation */}
            <motion.div
              animate={{ rotate: [-1, 1, -1] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FFCD00] text-[#0A1930] font-headline font-black text-xs sm:text-sm tracking-wider uppercase shadow-md"
            >
              <span>★★★★★</span>
              <span>ON-SITE</span>
            </motion.div>

            <span
              className="font-headline font-black text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white leading-none"
            >
              ROBOTICS LEAGUE
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/15">
            <span className="font-headline font-black text-xl sm:text-2xl tracking-wider text-slate-300 uppercase">
              VÄSTERÅS GRAND FINALE · DECEMBER 5, 2026
            </span>

            <div className="flex flex-wrap items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenRegister}
                className="btn-pill-lime text-xs font-bold py-3 px-6 shadow-md"
              >
                <span>GET STARTED →</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('for-schools')}
                className="px-6 py-3 rounded-full border border-white/30 hover:border-white text-white text-xs font-bold uppercase tracking-wider transition-all"
              >
                <span>FOR SCHOOLS →</span>
              </motion.button>
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
};
