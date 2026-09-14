import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Wrench, Target, Trophy, Calendar } from 'lucide-react';

interface RefCompetitionFlowProps {
  onOpenRegister?: () => void;
  onNavigate?: (route: string) => void;
}

export const RefCompetitionFlow: React.FC<RefCompetitionFlowProps> = ({
  onOpenRegister,
  onNavigate,
}) => {
  const stages = [
    {
      num: '01',
      badge: 'STAGE 01 · IN-SCHOOL',
      title: 'WORKSHOP',
      tagline: 'Build the foundation.',
      timing: 'OCTOBER · 20H STEM',
      icon: Wrench,
      description:
        'Hands-on robotics curriculum delivered directly to school classrooms. Every student builds, wires, and drives a working competition rover from turnkey mechanical kits.',
      specs: [
        { label: 'DELIVERY', value: 'Turnkey 6V DC Kits' },
        { label: 'COHORTS', value: 'Grades 3–6 & 7–9' },
        { label: 'DURATION', value: '10 Sessions (20h)' },
      ],
      isDark: false,
    },
    {
      num: '02',
      badge: 'STAGE 02 · QUALIFIERS',
      title: 'INTER-SCHOOL HEATS',
      tagline: 'Put the skills to the test.',
      timing: 'NOVEMBER · SCHOOL ARENA',
      icon: Target,
      description:
        'Fast-paced 1 vs 1 match heats on the standardized 2.44 × 1.22 m Dual Court. Students navigate obstacles, clear ball transfer hurdles, and battle for the school slot.',
      specs: [
        { label: 'ARENA', value: '2.44 × 1.22 m Mat' },
        { label: 'MATCH DURATION', value: '03:00 (1 vs 1)' },
        { label: 'ADVANCEMENT', value: 'Top Team to Finals' },
      ],
      isDark: false,
    },
    {
      num: '03',
      badge: 'STAGE 03 · FINALS',
      title: 'GRAND FINALE',
      tagline: 'Compete at the highest level.',
      timing: 'DECEMBER 4 & 5, 2026',
      icon: Trophy,
      description:
        'The championship showdown in Västerås. Qualifying school cohorts battle live before teachers, parents, and industry judges for medals, trophies, and the grand title.',
      specs: [
        { label: 'VENUE', value: 'Västerås Arena' },
        { label: 'PRIZE POOL', value: 'SEK 3,000' },
        { label: 'SHOWCASE', value: 'Live Audience Heats' },
      ],
      isDark: true,
    },
  ];

  return (
    <section
      id="competition-flow"
      className="w-full bg-[#F4F8FB] text-[#0A1930] py-16 sm:py-20 px-3 sm:px-6 border-t border-slate-200 select-none relative overflow-hidden"
    >
      <div className="w-full space-y-12 relative z-10">

        {/* ── SECTION HEADER ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-4">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-mono-code font-bold tracking-[0.25em] text-[#006AA7] uppercase block">
              COMPETITION JOURNEY // VÄSTERÅS 2026
            </span>

            <h2
              className="font-headline font-black uppercase tracking-tight text-[#0A1930] leading-[1.02]"
              style={{ fontSize: 'clamp(2.2rem, 4.8vw, 3.8rem)' }}
            >
              FROM CLASSROOM BUILD<br />
              <span className="text-[#006AA7]">TO THE ARENA FINALS</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed max-w-xl pt-1">
              A structured three-phase competition journey designed for Swedish schools. Students engineer rovers in the classroom, qualify locally, and compete on the championship stage.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onOpenRegister && (
              <button
                onClick={onOpenRegister}
                className="bg-[#FFCD00] hover:bg-[#FACC15] text-[#0A1930] font-black text-xs sm:text-sm py-3 px-6 shadow-xs flex items-center gap-2 transition-transform hover:scale-105 uppercase tracking-wider"
              >
                <span>REGISTER SCHOOL</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            {onNavigate && (
              <button
                onClick={() => onNavigate('how-it-works')}
                className="bg-white hover:bg-slate-50 text-[#0A1930] border border-slate-300 font-bold text-xs sm:text-sm py-3 px-5 shadow-2xs transition-transform hover:scale-105 uppercase tracking-wider"
              >
                <span>PROGRAMME DETAILS</span>
              </button>
            )}
          </div>
        </div>

        {/* ── 3-STAGE PROGRESSION TIMELINE ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch relative">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;

            return (
              <motion.div
                key={stage.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                className={`p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-all duration-300 relative ${
                  stage.isDark
                    ? 'bg-[#0A1930] text-white border border-slate-800 shadow-xl'
                    : 'bg-white text-[#0A1930] border border-slate-200/90 shadow-md hover:shadow-xl'
                }`}
              >
                <div className="space-y-5">
                  {/* Top Bar: Stage Number + Clean Tag */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-mono-code font-black text-2xl sm:text-3xl ${
                          stage.isDark ? 'text-[#FFCD00]' : 'text-[#006AA7]'
                        }`}
                      >
                        {stage.num}
                      </span>
                      <span
                        className={`text-[10px] font-mono-code font-bold uppercase tracking-wider ${
                          stage.isDark
                            ? 'text-[#FFCD00]'
                            : 'text-[#006AA7]'
                        }`}
                      >
                        {stage.badge}
                      </span>
                    </div>

                    <div
                      className={`w-9 h-9 flex items-center justify-center ${
                        stage.isDark ? 'bg-white/10 text-[#FFCD00]' : 'bg-slate-100 text-[#006AA7]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Stage Title & Tagline */}
                  <div>
                    <h3
                      className={`font-headline font-black text-xl sm:text-2xl uppercase tracking-tight ${
                        stage.isDark ? 'text-white' : 'text-[#0A1930]'
                      }`}
                    >
                      {stage.title}
                    </h3>
                    <p
                      className={`text-xs font-mono-code font-bold mt-1 uppercase tracking-wider ${
                        stage.isDark ? 'text-[#FFCD00]' : 'text-[#006AA7]'
                      }`}
                    >
                      {stage.tagline}
                    </p>
                  </div>

                  {/* Stage Narrative Description */}
                  <p
                    className={`text-xs sm:text-sm font-light leading-relaxed ${
                      stage.isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {stage.description}
                  </p>
                </div>

                {/* Technical Metric Modules (Real Info as Design) */}
                <div className="space-y-4 pt-2">
                  <div
                    className={`grid grid-cols-3 gap-2 p-3 border font-mono-code ${
                      stage.isDark
                        ? 'bg-[#061224] border-white/10 text-white'
                        : 'bg-[#F8FAFC] border-slate-100 text-[#0A1930]'
                    }`}
                  >
                    {stage.specs.map((spec) => (
                      <div key={spec.label} className="space-y-0.5">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">
                          {spec.label}
                        </span>
                        <span className="text-[11px] font-bold block truncate">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Timing Footer Ribbon */}
                  <div
                    className={`pt-3 border-t flex items-center justify-between text-xs font-mono-code font-bold ${
                      stage.isDark ? 'border-white/10 text-[#FFCD00]' : 'border-slate-100 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 opacity-80" />
                      <span className="text-[11px] uppercase tracking-wider">{stage.timing}</span>
                    </div>

                    {idx < stages.length - 1 && (
                      <span className="hidden lg:inline text-[10px] text-slate-400 uppercase tracking-widest font-normal">
                        STEP {idx + 1} OF 3
                      </span>
                    )}
                    {stage.isDark && (
                      <span className="text-[10px] text-[#FFCD00] uppercase tracking-widest font-bold">
                        GRAND FINALE
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── SECTION FOOTER ── */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-xs font-mono-code uppercase font-semibold">
          <span>PATHWAY: CLASSROOM (20H) ⟶ LOCAL QUALIFIER ⟶ VÄSTERÅS FINALS</span>
          <span>DECEMBER 4 & 5, 2026 · LIVE AUDIENCE EVENT</span>
        </div>

      </div>
    </section>
  );
};
