import React from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  Hammer,
  Gauge,
  RotateCw,
  Trophy,
  Award,
  ArrowRight,
  GitBranch,
} from 'lucide-react';

interface RefWorkflowMindMapProps {
  onNavigate: (route: string) => void;
}

export const RefWorkflowMindMap: React.FC<RefWorkflowMindMapProps> = ({ onNavigate }) => {
  const nodes = [
    {
      step: '01',
      title: 'Explore',
      subtitle: 'Understand parts',
      detail: 'Wheels, axles, gears & motors',
      icon: Compass,
      color: '#006AA7',
      bg: 'bg-sky-50 text-[#006AA7] border-sky-200',
      dotColor: 'bg-[#006AA7]',
    },
    {
      step: '02',
      title: 'Build',
      subtitle: 'Stable chassis',
      detail: 'Assemble drivetrain & power',
      icon: Hammer,
      color: '#006AA7',
      bg: 'bg-sky-50 text-[#006AA7] border-sky-200',
      dotColor: 'bg-[#006AA7]',
    },
    {
      step: '03',
      title: 'Test',
      subtitle: 'Speed & turning',
      detail: 'Stability & control accuracy',
      icon: Gauge,
      color: '#006AA7',
      bg: 'bg-sky-50 text-[#006AA7] border-sky-200',
      dotColor: 'bg-[#006AA7]',
    },
    {
      step: '04',
      title: 'Improve',
      subtitle: 'Design loops',
      detail: 'Iterate based on test trials',
      icon: RotateCw,
      color: '#EA580C',
      bg: 'bg-orange-50 text-[#EA580C] border-orange-200',
      dotColor: 'bg-[#EA580C]',
    },
    {
      step: '05',
      title: 'School Sprint',
      subtitle: 'In-school heats',
      detail: 'Friendly qualifier matches',
      icon: Trophy,
      color: '#EA580C',
      bg: 'bg-orange-50 text-[#EA580C] border-orange-200',
      dotColor: 'bg-[#EA580C]',
    },
    {
      step: '06',
      title: 'City Final',
      subtitle: 'Dec 4 & 5, 2026',
      detail: 'Championship live in Västerås',
      icon: Award,
      color: '#FFCD00',
      bg: 'bg-[#0A1930] text-white border-slate-700',
      dotColor: 'bg-[#FFCD00]',
      isFinal: true,
    },
  ];

  return (
    <section className="w-full bg-white text-[#0A1930] py-14 sm:py-18 px-3 sm:px-6 border-b border-slate-200 select-none relative overflow-hidden">
      {/* Background blueprint grid */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'linear-gradient(to right, #006AA70F 1px, transparent 1px), linear-gradient(to bottom, #006AA70F 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="w-full space-y-8 relative z-10">

        {/* ── HEADER ROW ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-2">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[#006AA7] text-[11px] font-mono-code font-bold tracking-[0.25em] uppercase">
              <GitBranch className="w-3.5 h-3.5" />
              <span>STEM LEARNING PATHWAY // FROM PARTS TO CITY FINAL</span>
            </div>

            <h2
              className="font-headline font-black uppercase tracking-tight text-[#0A1930] leading-[1.02]"
              style={{ fontSize: 'clamp(2rem, 4.2vw, 3.2rem)' }}
            >
              HOW STUDENTS <span className="text-[#006AA7]">PROGRESS</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
              RoboKidovation connects classroom engineering to the arena. Students explore mechanical components, build a working rover, iterate design flaws, and qualify for the city final.
            </p>
          </div>

          {/* More Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('workflow')}
              className="group inline-flex items-center gap-2.5 px-5 py-3 bg-[#0A1930] hover:bg-[#006AA7] text-white text-xs font-mono-code font-bold uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>VIEW FULL WORKFLOW</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* ── MIND MAP NODES TRACK ── */}
        <div className="relative pt-6 pb-2">

          {/* Horizontal Connecting Rail (Desktop) */}
          <div className="hidden lg:block absolute top-[54px] left-[6%] right-[6%] h-[2px] bg-gradient-to-r from-sky-300 via-orange-300 to-[#FFCD00] z-0 opacity-60" />

          {/* 6 Connected Mind Map Node Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 relative z-10">
            {nodes.map((node, idx) => {
              const Icon = node.icon;

              return (
                <motion.div
                  key={node.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  onClick={() => onNavigate('workflow')}
                  className={`group relative p-5 border cursor-pointer transition-all duration-300 flex flex-col justify-between space-y-4 hover:-translate-y-1.5 hover:shadow-lg ${
                    node.isFinal
                      ? 'bg-[#0A1930] text-white border-slate-800 hover:border-[#FFCD00]/50'
                      : 'bg-white text-[#0A1930] border-slate-200 hover:border-[#006AA7]/40'
                  }`}
                >
                  {/* Top: Step Badge & Node Pin */}
                  <div className="flex items-center justify-between relative">
                    <span
                      className={`font-mono-code font-black text-lg ${
                        node.isFinal ? 'text-[#FFCD00]' : 'text-[#006AA7]'
                      }`}
                    >
                      {node.step}
                    </span>

                    {/* Central Mind Map Node Indicator */}
                    <div
                      className={`w-9 h-9 flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs ${
                        node.isFinal
                          ? 'bg-white/10 text-[#FFCD00]'
                          : 'bg-slate-100 text-[#006AA7] group-hover:bg-[#006AA7] group-hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="space-y-1">
                    <h3
                      className={`font-headline font-black text-base uppercase tracking-tight ${
                        node.isFinal ? 'text-white' : 'text-[#0A1930]'
                      }`}
                    >
                      {node.title}
                    </h3>
                    <p
                      className={`text-[11px] font-mono-code font-bold uppercase tracking-wider ${
                        node.isFinal ? 'text-[#FFCD00]' : 'text-[#006AA7]'
                      }`}
                    >
                      {node.subtitle}
                    </p>
                    <p
                      className={`text-xs font-light leading-snug pt-1 ${
                        node.isFinal ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {node.detail}
                    </p>
                  </div>

                  {/* Card Bottom CTA Hint */}
                  <div
                    className={`pt-2.5 border-t flex items-center justify-between text-[10px] font-mono-code font-bold uppercase ${
                      node.isFinal
                        ? 'border-white/10 text-[#FFCD00]'
                        : 'border-slate-100 text-slate-400 group-hover:text-[#006AA7]'
                    }`}
                  >
                    <span>MORE DETAILS</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── FOOTER RIBBON WITH DIRECT LINK ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 text-[11px] font-mono-code text-slate-500">
          <span className="font-medium">
            COLLABORATION PROPOSAL · MDU C2 × IBK VÄSTERÅS × INIAC 2026
          </span>
          <button
            onClick={() => onNavigate('workflow')}
            className="text-[#006AA7] font-bold hover:underline inline-flex items-center gap-1 uppercase tracking-wider"
          >
            <span>LEARN ABOUT THE 20H CLASSROOM CURRICULUM</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>
    </section>
  );
};
