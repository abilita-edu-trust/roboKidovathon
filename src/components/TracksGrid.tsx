import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TRACKS_DATA, TrackItem } from '../data/hackathonData';
import { Cpu, Bot, CreditCard, Leaf, ArrowUpRight, Terminal, Code2 } from 'lucide-react';

interface TracksGridProps {
  onSelectTrack: (track: TrackItem) => void;
}

export const TracksGrid: React.FC<TracksGridProps> = ({ onSelectTrack }) => {
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-6 h-6 text-indigo-400" />;
      case 'Bot': return <Bot className="w-6 h-6 text-cyan-400" />;
      case 'CreditCard': return <CreditCard className="w-6 h-6 text-purple-400" />;
      case 'Leaf': return <Leaf className="w-6 h-6 text-emerald-400" />;
      default: return <Cpu className="w-6 h-6 text-indigo-400" />;
    }
  };

  return (
    <section id="tracks" className="relative w-full py-28 px-6 sm:px-10 bg-black/60 z-10">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono-code font-bold tracking-[0.25em] text-indigo-400 uppercase mb-3">
              <Terminal className="w-3.5 h-3.5" />
              <span>FRONTIER DOMAINS // 4 PARALLEL TRACKS</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white leading-none">
              Competition Tracks.
            </h2>
          </div>
          <p className="max-w-md text-sm text-slate-300 font-light leading-relaxed">
            Choose your specialization. Each track is supported by dedicated hardware clusters, proprietary API sandboxes, and enterprise engineering jury panels.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {TRACKS_DATA.map((track, index) => {
            const isFirst = index === 0;
            const isHovered = hoveredTrack === track.id;

            return (
              <motion.div
                key={track.id}
                onMouseEnter={() => setHoveredTrack(track.id)}
                onMouseLeave={() => setHoveredTrack(null)}
                onClick={() => onSelectTrack(track)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative group cursor-pointer rounded-2xl p-8 sm:p-10 bg-gradient-to-b from-[#0E0E14] to-[#08080C] border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                  isFirst ? 'lg:col-span-7' : index === 1 ? 'lg:col-span-5' : 'lg:col-span-6'
                } ${
                  isHovered
                    ? 'border-indigo-500/40 shadow-2xl shadow-indigo-950/40 -translate-y-1'
                    : 'border-white/[0.08] hover:border-white/[0.18]'
                }`}
              >
                {/* Radial Glow Highlight */}
                <div
                  className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-[90px] pointer-events-none transition-opacity duration-500 ${
                    isHovered ? 'opacity-40' : 'opacity-10'
                  }`}
                  style={{ backgroundColor: track.accentColor }}
                />

                {/* Top Row: Category + Badge + Arrow */}
                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
                        {getIcon(track.iconName)}
                      </div>
                      <span className="text-xs font-mono-code font-bold tracking-[0.2em] text-slate-400 uppercase">
                        {track.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono-code font-semibold px-2.5 py-1 rounded-full bg-white/[0.04] text-slate-300 border border-white/[0.08]">
                        {track.badge}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all duration-200">
                        <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>

                  {/* Title & Pool Share */}
                  <div className="mt-4">
                    <div className="inline-block text-xs font-mono-code font-bold px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-3">
                      {track.poolShare}
                    </div>
                    <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight uppercase leading-snug group-hover:text-indigo-200 transition-colors">
                      {track.title}
                    </h3>
                    <p className="mt-4 text-sm text-slate-300 font-light leading-relaxed">
                      {track.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Tech Stack Tags */}
                <div className="mt-8 pt-6 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2 mb-3">
                    <Code2 className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs font-mono-code tracking-[0.15em] text-slate-400 uppercase">
                      BENCHMARK TECH STACK
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {track.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[13px] font-mono-code px-2.5 py-1 rounded-md bg-black/40 text-slate-300 border border-white/[0.06] group-hover:border-white/[0.12] transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
