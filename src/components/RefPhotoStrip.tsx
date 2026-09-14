import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Sparkles, Trophy, Landmark, X, Maximize2, Layers } from 'lucide-react';
import {
  bannerActionStripCollage,
  roboSprintActionWide,
  roboSprintDuel,
  roboPrecisionTowerBot,
  roboPrecisionActionWide,
  roboPrecisionFacingDual,
  roboSprintObstacleClose,
  roboSprintTopDown,
  roboPrecisionArenaEmpty,
  TOURNAMENT_GALLERY,
  CompetitionMediaItem,
} from '../assets/images';

export const RefPhotoStrip: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<CompetitionMediaItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'sprint' | 'precision'>('all');

  const highlights = [
    {
      id: 'sprint-duel',
      span: 'lg:col-span-8',
      image: roboSprintDuel,
      tag: 'ROBO-SPRINT LEAGUE ARENA',
      icon: Trophy,
      title: 'Live Hurdle-Passing & Speed Agility Duels',
      desc: 'Student-built machines battle head-to-head across the central barrier, clearing obstacles and scoring ping pong balls in real match conditions.',
      fullItem: TOURNAMENT_GALLERY[3],
    },
    {
      id: 'action-strip',
      span: 'lg:col-span-4',
      image: bannerActionStripCollage,
      tag: 'CLASSROOM TO ARENA // BLIX-A-THON',
      icon: Sparkles,
      title: 'Build, Navigate & Precision Stacking',
      desc: 'Three-stage competition progression: tactical obstacle racing, hands-on chassis assembly, and arena podium cup stacking.',
      fullItem: TOURNAMENT_GALLERY[0],
    },
    {
      id: 'precision-crowd',
      span: 'lg:col-span-5',
      image: roboPrecisionActionWide,
      tag: 'GRAND FINALE ARENA',
      icon: Landmark,
      title: 'Inter-School Championship Showcase',
      desc: 'Qualifying teams from schools compete surrounded by cheering peers, teachers, and technical referees.',
      fullItem: TOURNAMENT_GALLERY[2],
    },
    {
      id: 'precision-duel',
      span: 'lg:col-span-7',
      image: roboPrecisionFacingDual,
      tag: 'INDIA ORIGIN · TECHFEST IIT BOMBAY',
      icon: ShieldCheck,
      title: 'Proven Across 2,000+ Students',
      desc: 'Direct from Blix-A-Thon India at IIT Bombay Techfest — bringing authentic robotic hardware and high-stakes arena rules to Swedish classrooms.',
      fullItem: TOURNAMENT_GALLERY[5],
    },
  ];

  const additionalPhotos = [
    {
      title: 'Agile Chassis Face-Off',
      cat: 'sprint' as const,
      src: roboSprintActionWide,
      tag: 'ROBO-SPRINT',
      item: TOURNAMENT_GALLERY[1],
    },
    {
      title: 'Vertical Lifter Engineering',
      cat: 'precision' as const,
      src: roboPrecisionTowerBot,
      tag: 'PRECISION',
      item: TOURNAMENT_GALLERY[4],
    },
    {
      title: 'Chassis Clearing Passage',
      cat: 'sprint' as const,
      src: roboSprintObstacleClose,
      tag: 'MECHANISM',
      item: TOURNAMENT_GALLERY[6],
    },
    {
      title: 'Tactical Overhead Arena',
      cat: 'sprint' as const,
      src: roboSprintTopDown,
      tag: 'OVERHEAD',
      item: TOURNAMENT_GALLERY[7],
    },
    {
      title: 'Tournament Floor Setup',
      cat: 'precision' as const,
      src: roboPrecisionArenaEmpty,
      tag: 'ARENA',
      item: TOURNAMENT_GALLERY[8],
    },
  ];

  const filteredReel = activeCategory === 'all'
    ? additionalPhotos
    : additionalPhotos.filter((p) => p.cat === activeCategory);

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
                AUTHENTIC COMPETITION FOOTAGE
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
            {/* Filter Buttons */}
            <div className="inline-flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1 text-[10px] font-mono-code font-bold uppercase transition-all ${
                  activeCategory === 'all'
                    ? 'bg-[#0A1930] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#0A1930]'
                }`}
              >
                All Heats
              </button>
              <button
                onClick={() => setActiveCategory('sprint')}
                className={`px-3 py-1 text-[10px] font-mono-code font-bold uppercase transition-all ${
                  activeCategory === 'sprint'
                    ? 'bg-[#006AA7] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#0A1930]'
                }`}
              >
                Robo-Sprint
              </button>
              <button
                onClick={() => setActiveCategory('precision')}
                className={`px-3 py-1 text-[10px] font-mono-code font-bold uppercase transition-all ${
                  activeCategory === 'precision'
                    ? 'bg-[#FFCD00] text-[#0A1930] shadow-sm'
                    : 'text-slate-600 hover:text-[#0A1930]'
                }`}
              >
                Robo-Precision
              </button>
            </div>
          </div>
        </div>

        {/* ── MAIN FEATURED BENTO SHOWCASE ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, borderColor: 'rgba(0, 106, 167, 0.45)' }}
                onClick={() => setSelectedPhoto(item.fullItem)}
                className={`relative overflow-hidden border border-slate-200 bg-[#0A1930] shadow-md group cursor-pointer min-h-[340px] sm:min-h-[420px] flex flex-col justify-end p-6 sm:p-8 ${item.span}`}
              >
                {/* Background Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:opacity-95 transition-all duration-700 group-hover:scale-105"
                />

                {/* Dark Gradient Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1930] via-[#0A1930]/70 to-transparent pointer-events-none" />

                {/* Enlarge Indicator */}
                <div className="absolute top-5 right-5 w-9 h-9 bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="relative space-y-2.5">
                  <div className="flex items-center gap-2 text-[10px] font-mono-code font-bold text-[#FFCD00] uppercase tracking-wider">
                    <Icon className="w-3.5 h-3.5" />
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

        {/* ── ADDITIONAL LIVE ACTION REEL ── */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono-code font-bold text-slate-500 uppercase tracking-widest">
              MORE ARENA ACTION &amp; HARDWARE PERSPECTIVES ({filteredReel.length})
            </span>
            <span className="text-[10px] font-mono-code text-slate-400">
              CLICK ANY TILE TO ENLARGE
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredReel.map((tile) => (
              <motion.div
                key={tile.title}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedPhoto(tile.item)}
                className="relative h-44 sm:h-52 overflow-hidden border border-slate-200 group cursor-pointer bg-[#0A1930] shadow-sm"
              >
                <img
                  src={tile.src}
                  alt={tile.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 space-y-0.5">
                  <span className="text-[9px] font-mono-code font-bold text-[#FFCD00] uppercase block">
                    {tile.tag}
                  </span>
                  <span className="text-xs font-syne font-bold text-white uppercase truncate block">
                    {tile.title}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
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

