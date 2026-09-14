import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Sparkles, Trophy, Landmark, X, Maximize2, Layers } from 'lucide-react';
import {
  bannerActionStripCollage,
  roboSprintDuel,
  roboPrecisionActionWide,
  roboPrecisionFacingDual,
  TOURNAMENT_GALLERY,
  CompetitionMediaItem,
} from '../assets/images';

export const RefPhotoStrip: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<CompetitionMediaItem | null>(null);

  const highlights = [
    {
      id: 'sprint-duel',
      span: 'lg:col-span-8',
      image: roboSprintDuel,
      tag: 'ROBO-SPRINT ARENA',
      icon: Trophy,
      title: 'Live Hurdle-Passing & Speed Agility Duels',
      desc: 'Student robots clear obstacles, navigate turning gates, and score in authentic head-to-head match conditions.',
      fullItem: TOURNAMENT_GALLERY[3],
    },
    {
      id: 'action-strip',
      span: 'lg:col-span-4',
      image: bannerActionStripCollage,
      tag: 'CLASSROOM TO ARENA',
      icon: Sparkles,
      title: 'Build, Navigate & Precision Stacking',
      desc: 'Hands-on chassis assembly, speed trials, and arena podium cup stacking.',
      fullItem: TOURNAMENT_GALLERY[0],
    },
    {
      id: 'precision-crowd',
      span: 'lg:col-span-5',
      image: roboPrecisionActionWide,
      tag: 'GRAND FINALE ARENA',
      icon: Landmark,
      title: 'Inter-School Championship Showcase',
      desc: 'Qualifying school teams compete surrounded by cheering peers, teachers, and technical referees.',
      fullItem: TOURNAMENT_GALLERY[2],
    },
    {
      id: 'precision-duel',
      span: 'lg:col-span-7',
      image: roboPrecisionFacingDual,
      tag: 'PROVEN HARDWARE & RULES',
      icon: ShieldCheck,
      title: 'Proven Across 2,000+ Students',
      desc: 'Bringing authentic robotic hardware and high-stakes arena rules to Swedish classrooms.',
      fullItem: TOURNAMENT_GALLERY[5],
    },
  ];

  return (
    <section className="w-full bg-white text-[#0A1930] py-16 sm:py-20 px-3 sm:px-6 border-t border-slate-200 overflow-hidden select-none">
      <div className="w-full space-y-10">

        {/* ── SECTION HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2 text-[#006AA7]">
              <Layers className="w-4 h-4" />
              <span className="text-[10px] font-mono-code font-bold uppercase tracking-[0.25em]">
                COMPETITION HIGHLIGHTS
              </span>
            </div>
            <h2
              className="font-headline font-black uppercase tracking-tight text-[#0A1930] leading-[1.02]"
              style={{ fontSize: 'clamp(2.4rem, 5.2vw, 4.2rem)' }}
            >
              TOURNAMENT <span className="text-[#006AA7]">HIGHLIGHTS</span>
            </h2>
          </motion.div>

          <div className="space-y-3 md:text-right">
            <p className="text-xs sm:text-sm text-slate-500 font-light max-w-md leading-relaxed">
              Real hardware, real school matches, and live arena heats from Blix-A-Thon — now arriving across Västerås.
            </p>
          </div>
        </div>

        {/* ── MAIN FEATURED BENTO SHOWCASE ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            const idleRotation = idx === 0 ? -0.5 : idx === 1 ? 0.6 : idx === 2 ? 0.5 : -0.6;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40, rotate: idleRotation }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{
                  y: -8,
                  rotate: 0,
                  scale: 1.01,
                  borderColor: 'rgba(0, 106, 167, 0.65)',
                }}
                onClick={() => setSelectedPhoto(item.fullItem)}
                className={`relative overflow-hidden border border-slate-200 bg-[#0A1930] shadow-md hover:shadow-2xl group cursor-pointer min-h-[340px] sm:min-h-[420px] flex flex-col justify-end p-6 sm:p-8 ${item.span}`}
              >
                {/* Background Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:opacity-95 transition-all duration-700 group-hover:scale-106"
                />

                {/* Playful Camera Flash Effect */}
                <div className="absolute inset-0 bg-white/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />

                {/* Dark Gradient Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1930] via-[#0A1930]/75 to-transparent pointer-events-none z-10" />

                {/* Enlarge Indicator */}
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className="absolute top-5 right-5 w-9 h-9 bg-black/50 backdrop-blur-md border border-white/25 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-md"
                >
                  <Maximize2 className="w-4 h-4" />
                </motion.div>

                {/* Content */}
                <div className="relative space-y-2.5 z-20">
                  <div className="flex items-center gap-2 text-[10px] font-mono-code font-bold text-[#FFCD00] uppercase tracking-wider">
                    <motion.div
                      whileHover={{ rotate: 15, scale: 1.2 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </motion.div>
                    <span>{item.tag}</span>
                  </div>

                  <h3 className="font-headline font-bold text-2xl sm:text-3xl text-white uppercase tracking-wide group-hover:text-[#FFCD00] transition-colors leading-tight">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-200 font-light leading-relaxed max-w-xl">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* ── FULLSCREEN LIGHTBOX MODAL ── */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 select-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-4xl w-full max-h-[90vh] bg-[#0A1930] border border-white/20 overflow-hidden shadow-2xl z-10 flex flex-col"
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-[#070709]">
                <div>
                  <span className="text-[10px] font-mono-code font-bold text-[#FFCD00] uppercase tracking-wider block">
                    {selectedPhoto.tag}
                  </span>
                  <h3 className="font-syne font-bold text-lg sm:text-xl text-white uppercase">
                    {selectedPhoto.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close photo view"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Image Display */}
              <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden p-2 sm:p-4 max-h-[60vh]">
                <img
                  src={selectedPhoto.src}
                  alt={selectedPhoto.title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Bottom Caption */}
              <div className="p-4 sm:p-6 bg-[#070709] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed max-w-xl">
                  {selectedPhoto.desc}
                </p>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-mono-code text-xs uppercase tracking-wider transition-colors shrink-0 self-start sm:self-auto"
                >
                  CLOSE VIEW
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

