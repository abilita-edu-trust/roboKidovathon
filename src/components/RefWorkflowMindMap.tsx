import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  Hammer,
  Gauge,
  RotateCw,
  Trophy,
  Award,
  ArrowRight,
  ArrowDown,
  ChevronRight,
  GitBranch,
  Sparkles,
} from 'lucide-react';
import { Interactive3DTilt } from './Interactive3DTilt';

interface RefWorkflowMindMapProps {
  onNavigate: (route: string) => void;
  onOpenRegister?: () => void;
}

export const RefWorkflowMindMap: React.FC<RefWorkflowMindMapProps> = ({
  onNavigate,
  onOpenRegister,
}) => {
  const [activeHover, setActiveHover] = useState<number | null>(null);

  const nodes = [
    {
      step: '01',
      title: 'Explore',
      subtitle: 'Understand parts',
      detail: 'Wheels, axles, gears & motors',
      icon: Compass,
      color: '#006AA7',
      hoverCardClass: 'hover:bg-[#006AA7] hover:border-[#006AA7] hover:shadow-[0_14px_30px_rgba(0,106,167,0.28)]',
      hoverStepClass: 'group-hover:text-[#FFCD00]',
      hoverTitleClass: 'group-hover:text-white',
      hoverSubClass: 'group-hover:text-sky-100',
      hoverDetailClass: 'group-hover:text-white/90',
      hoverIconBoxClass: 'group-hover:bg-white group-hover:text-[#006AA7]',
      hoverCtaClass: 'group-hover:text-white group-hover:border-white/20',
    },
    {
      step: '02',
      title: 'Build',
      subtitle: 'Stable chassis',
      detail: 'Assemble drivetrain & power',
      icon: Hammer,
      color: '#013A63',
      hoverCardClass: 'hover:bg-[#013A63] hover:border-[#013A63] hover:shadow-[0_14px_30px_rgba(1,58,99,0.28)]',
      hoverStepClass: 'group-hover:text-[#FFCD00]',
      hoverTitleClass: 'group-hover:text-white',
      hoverSubClass: 'group-hover:text-sky-100',
      hoverDetailClass: 'group-hover:text-white/90',
      hoverIconBoxClass: 'group-hover:bg-white group-hover:text-[#013A63]',
      hoverCtaClass: 'group-hover:text-white group-hover:border-white/20',
    },
    {
      step: '03',
      title: 'Test',
      subtitle: 'Speed & turning',
      detail: 'Stability & control accuracy',
      icon: Gauge,
      color: '#0284C7',
      hoverCardClass: 'hover:bg-[#0284C7] hover:border-[#0284C7] hover:shadow-[0_14px_30px_rgba(2,132,199,0.28)]',
      hoverStepClass: 'group-hover:text-[#FFCD00]',
      hoverTitleClass: 'group-hover:text-white',
      hoverSubClass: 'group-hover:text-cyan-100',
      hoverDetailClass: 'group-hover:text-white/90',
      hoverIconBoxClass: 'group-hover:bg-white group-hover:text-[#0284C7]',
      hoverCtaClass: 'group-hover:text-white group-hover:border-white/20',
    },
    {
      step: '04',
      title: 'Improve',
      subtitle: 'Design loops',
      detail: 'Iterate based on test trials',
      icon: RotateCw,
      color: '#EA580C',
      hoverCardClass: 'hover:bg-[#EA580C] hover:border-[#EA580C] hover:shadow-[0_14px_30px_rgba(234,88,12,0.28)]',
      hoverStepClass: 'group-hover:text-[#FFCD00]',
      hoverTitleClass: 'group-hover:text-white',
      hoverSubClass: 'group-hover:text-orange-100',
      hoverDetailClass: 'group-hover:text-white/90',
      hoverIconBoxClass: 'group-hover:bg-white group-hover:text-[#EA580C]',
      hoverCtaClass: 'group-hover:text-white group-hover:border-white/20',
    },
    {
      step: '05',
      title: 'School Sprint',
      subtitle: 'In-school heats',
      detail: 'Friendly qualifier matches',
      icon: Trophy,
      color: '#D97706',
      hoverCardClass: 'hover:bg-[#D97706] hover:border-[#D97706] hover:shadow-[0_14px_30px_rgba(217,119,6,0.28)]',
      hoverStepClass: 'group-hover:text-[#FFCD00]',
      hoverTitleClass: 'group-hover:text-white',
      hoverSubClass: 'group-hover:text-amber-100',
      hoverDetailClass: 'group-hover:text-white/90',
      hoverIconBoxClass: 'group-hover:bg-white group-hover:text-[#D97706]',
      hoverCtaClass: 'group-hover:text-white group-hover:border-white/20',
    },
    {
      step: '06',
      title: 'City Final',
      subtitle: 'Dec 4 & 5, 2026',
      detail: 'Championship live in Västerås',
      icon: Award,
      color: '#FFCD00',
      isFinal: true,
      hoverCardClass: 'hover:bg-[#FFCD00] hover:border-[#FFCD00] hover:shadow-[0_14px_34px_rgba(255,205,0,0.38)]',
      hoverStepClass: 'group-hover:text-[#0A1930]',
      hoverTitleClass: 'group-hover:text-[#0A1930]',
      hoverSubClass: 'group-hover:text-[#013A63]',
      hoverDetailClass: 'group-hover:text-[#0A1930]/85',
      hoverIconBoxClass: 'group-hover:bg-[#0A1930] group-hover:text-[#FFCD00]',
      hoverCtaClass: 'group-hover:text-[#0A1930] group-hover:border-[#0A1930]/20',
    },
  ];

  return (
    <section className="w-full bg-gradient-to-b from-[#F6FAFD] via-[#EEF5FB] to-[#E5EFF8] text-[#0A1930] py-14 sm:py-18 px-3 sm:px-6 border-b border-slate-200 select-none relative overflow-hidden">
      {/* Ambient Gradient Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-sky-400/15 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-tl from-[#FFCD00]/15 via-amber-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />

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

        {/* ── HEADER ROW WITH TRANSITIONS ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-2"
        >
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[#006AA7] text-[11px] font-mono-code font-bold tracking-[0.25em] uppercase">
              <GitBranch className="w-3.5 h-3.5" />
              <span>STEM LEARNING PATHWAY</span>
            </div>

            <h2
              className="font-headline font-black uppercase tracking-tight text-[#0A1930] leading-[1.02]"
              style={{ fontSize: 'clamp(2rem, 4.2vw, 3.2rem)' }}
            >
              HOW STUDENTS <span className="text-[#006AA7]">PROGRESS</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
              Six steps from first parts to the city championship.
            </p>
          </div>

          {/* More Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('workflow')}
              className="group inline-flex items-center gap-2.5 px-5 py-3 bg-[#0A1930] hover:bg-[#006AA7] text-white text-xs font-mono-code font-bold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>VIEW FULL WORKFLOW</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>

        {/* ── MIND MAP NODES TRACK WITH ANIMATED PATHWAYS ── */}
        <div className="relative pt-6 pb-2">

          {/* Continuous Animated Connecting SVG Rail (Desktop) */}
          <div className="hidden lg:block absolute top-[52px] left-[5%] right-[5%] h-5 z-0 pointer-events-none overflow-visible">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="pathwayGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#006AA7" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#EA580C" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FFCD00" stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id="activeBeam" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#006AA7" />
                  <stop offset="50%" stopColor="#EA580C" />
                  <stop offset="100%" stopColor="#FFCD00" />
                </linearGradient>
              </defs>
              {/* Base track */}
              <line
                x1="0"
                y1="2"
                x2="100%"
                y2="2"
                stroke="url(#pathwayGrad)"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
              {/* Animated energy pulse flowing left to right */}
              <motion.line
                x1="0"
                y1="2"
                x2="100%"
                y2="2"
                stroke="url(#activeBeam)"
                strokeWidth="3.5"
                strokeDasharray="24 160"
                animate={{ strokeDashoffset: [368, 0] }}
                transition={{ repeat: Infinity, duration: 2.4, ease: 'linear' }}
              />
            </svg>
          </div>

          {/* 6 Connected Mind Map Node Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 relative z-10">
            {nodes.map((node, idx) => {
              const Icon = node.icon;
              const isCardHovered = activeHover === idx;
              const isNextCardHovered = activeHover === idx + 1;

              return (
                <div key={node.step} className="relative flex flex-col h-full">
                  <Interactive3DTilt
                    maxTilt={8}
                    glareOpacity={node.isFinal ? 0.22 : 0.14}
                    className="h-full flex-1 flex flex-col"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 28 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{
                        duration: 0.55,
                        delay: idx * 0.08,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      onMouseEnter={() => setActiveHover(idx)}
                      onMouseLeave={() => setActiveHover(null)}
                      onClick={() => onNavigate('workflow')}
                      className={`group relative p-5 border cursor-pointer flex-1 flex flex-col justify-between space-y-4 transition-all duration-300 ease-out ${
                        node.isFinal
                          ? 'bg-[#0A1930] text-white border-slate-800'
                          : 'bg-white text-[#0A1930] border-slate-200'
                      } ${node.hoverCardClass}`}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* Top: Step Badge & Node Pin */}
                      <div className="flex items-center justify-between relative" style={{ transform: 'translateZ(12px)' }}>
                        <span
                          className={`font-mono-code font-black text-lg transition-colors duration-300 ${
                            node.isFinal ? 'text-[#FFCD00]' : 'text-[#006AA7]'
                          } ${node.hoverStepClass}`}
                        >
                          {node.step}
                        </span>

                        {/* Central Mind Map Node Indicator */}
                        <div
                          className={`w-9 h-9 flex items-center justify-center transition-all duration-300 shadow-xs group-hover:scale-110 ${
                            node.isFinal
                              ? 'bg-white/10 text-[#FFCD00]'
                              : 'bg-slate-100 text-[#006AA7]'
                          } ${node.hoverIconBoxClass}`}
                        >
                          <Icon className="w-4 h-4 transition-transform duration-300 group-hover:rotate-6" />
                        </div>
                      </div>

                      {/* Title & Subtitle */}
                      <div className="space-y-1" style={{ transform: 'translateZ(10px)' }}>
                        <h3
                          className={`font-headline font-black text-base uppercase tracking-tight transition-colors duration-300 ${
                            node.isFinal ? 'text-white' : 'text-[#0A1930]'
                          } ${node.hoverTitleClass}`}
                        >
                          {node.title}
                        </h3>
                        <p
                          className={`text-[11px] font-mono-code font-bold uppercase tracking-wider transition-colors duration-300 ${
                            node.isFinal ? 'text-[#FFCD00]' : 'text-[#006AA7]'
                          } ${node.hoverSubClass}`}
                        >
                          {node.subtitle}
                        </p>
                        <p
                          className={`text-xs font-light leading-snug pt-1 transition-colors duration-300 ${
                            node.isFinal ? 'text-slate-300' : 'text-slate-600'
                          } ${node.hoverDetailClass}`}
                        >
                          {node.detail}
                        </p>
                      </div>

                      {/* Card Bottom CTA Hint */}
                      <div
                        className={`pt-2.5 border-t flex items-center justify-end text-[10px] font-mono-code font-bold uppercase transition-all duration-300 ${
                          node.isFinal
                            ? 'border-white/10 text-[#FFCD00]'
                            : 'border-slate-100 text-slate-400'
                        } ${node.hoverCtaClass}`}
                        style={{ transform: 'translateZ(8px)' }}
                      >
                        <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1.5" />
                      </div>
                    </motion.div>
                  </Interactive3DTilt>

                  {/* ── INTER-CARD ANIMATED ARROW CONNECTORS (DESKTOP) ── */}
                  {idx < nodes.length - 1 && (
                    <div className="hidden lg:flex absolute -right-[13px] top-[26px] z-30 pointer-events-none items-center justify-center">
                      <div
                        className={`w-6 h-6 flex items-center justify-center border shadow-xs transition-all duration-300 ${
                          isCardHovered || isNextCardHovered
                            ? 'bg-[#FFCD00] text-[#0A1930] border-[#FFCD00] scale-110 shadow-md ring-2 ring-[#FFCD00]/40'
                            : 'bg-white text-[#006AA7] border-slate-300'
                        }`}
                      >
                        <motion.div
                          animate={{ x: [0, 3, 0] }}
                          transition={{
                            repeat: Infinity,
                            duration: 1.1,
                            ease: 'easeInOut',
                            delay: idx * 0.15,
                          }}
                        >
                          <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                        </motion.div>
                      </div>
                    </div>
                  )}

                  {/* ── INTER-CARD ANIMATED ARROW CONNECTORS (MOBILE & TABLET) ── */}
                  {idx < nodes.length - 1 && (
                    <div className="lg:hidden flex items-center justify-center py-2.5 relative z-20">
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1 border text-[10px] font-mono-code font-bold uppercase tracking-wider transition-colors duration-300 ${
                          isCardHovered || isNextCardHovered
                            ? 'bg-[#FFCD00] text-[#0A1930] border-[#FFCD00] shadow-sm'
                            : 'bg-sky-50 text-[#006AA7] border-sky-200'
                        }`}
                      >
                        <span>STEP {nodes[idx + 1].step}</span>
                        <motion.div
                          animate={{ y: [0, 3, 0] }}
                          transition={{
                            repeat: Infinity,
                            duration: 1,
                            ease: 'easeInOut',
                            delay: idx * 0.12,
                          }}
                        >
                          <ArrowDown className="w-3 h-3" />
                        </motion.div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── ALTERNATIVE CTA: 20H STEM WORKFLOW INTAKE ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-[#0A1930] text-white p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5 my-6"
        >
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-[10px] font-mono-code font-bold tracking-widest text-[#FFCD00] uppercase block">
              STEPS 01 TO 06 · IN-CLASS CURRICULUM
            </span>
            <h4 className="font-headline font-black text-xl sm:text-2xl uppercase tracking-tight text-white">
              Ready to introduce this 20-hour workflow at your school?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 font-light max-w-xl">
              All physical kits, lesson blueprints, and arena mats delivered directly to your classroom. No lab prerequisites.
            </p>
          </div>

          <div className="shrink-0 w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
            {onOpenRegister && (
              <button
                onClick={onOpenRegister}
                className="w-full sm:w-auto px-7 py-4 bg-[#FFCD00] hover:bg-[#FACC15] text-[#0A1930] font-syne font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 group active:scale-95"
              >
                <span>BOOK IN-CLASS WORKSHOP</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            )}
          </div>
        </motion.div>

        {/* ── FOOTER RIBBON WITH TRANSITIONS ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 text-[11px] font-mono-code text-slate-500"
        >
          <div className="flex items-center gap-2 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#006AA7]" />
            <span>IBK VÄSTERÅS × INIAC × SKILLSKOLAN 2026</span>
          </div>
          <button
            onClick={() => onNavigate('workflow')}
            className="group text-[#006AA7] font-bold hover:underline inline-flex items-center gap-1.5 uppercase tracking-wider transition-colors"
          >
            <span>VIEW FULL 20H CURRICULUM</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </motion.div>

      </div>
    </section>
  );
};
