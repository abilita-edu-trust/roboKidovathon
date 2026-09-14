import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Gamepad2,
  Settings,
  Target,
} from 'lucide-react';
import {
  bannerRoboSprint,
  bannerRoboSprintAdvanced,
  bannerRoboTrials,
} from '../assets/images';

interface RefTrackComparisonProps {
  onNavigate: (route: string) => void;
  onOpenRegister: () => void;
}

export const RefTrackComparison: React.FC<RefTrackComparisonProps> = ({
  onNavigate,
  onOpenRegister,
}) => {
  const tracks = [
    {
      id: 'robo-sprint',
      badge: 'GRADES 3 – 6',
      title: 'ROBO SPRINT',
      division: 'JUNIOR LEAGUE • GRADE 3 TO 6',
      description: 'Build a reliable moving robot, solve the obstacle challenge and score together.',
      bannerImage: bannerRoboSprint,
      subtitleColor: 'text-[#0284C7]',
      checkColor: 'text-[#0284C7]',
      borderColor: 'border-[#38BDF8]/40 hover:border-[#0284C7]',
      glowShadow: 'hover:shadow-[0_20px_50px_rgba(2,132,199,0.18)]',
      cornerIcon: Gamepad2,
      cornerBg: 'bg-white text-[#006AA7] border border-sky-100',
      skills: [
        'Mechanical Assembly',
        'Gear Ratios',
        'Chassis Stability',
        'Teamwork',
      ],
      registerLabel: 'REGISTER FOR GRADES 3 – 6 →',
    },
    {
      id: 'robo-sprint-advanced',
      badge: 'GRADES 7 – 9',
      title: 'ROBO SPRINT ADVANCED',
      division: 'SENIOR LEAGUE • GRADE 7 TO 9',
      description: 'Engineer, measure, and optimize mechanical advantages under competition conditions.',
      bannerImage: bannerRoboSprintAdvanced,
      subtitleColor: 'text-[#EA580C]',
      checkColor: 'text-[#EA580C]',
      borderColor: 'border-[#FB923C]/40 hover:border-[#EA580C]',
      glowShadow: 'hover:shadow-[0_20px_50px_rgba(234,88,12,0.18)]',
      cornerIcon: Settings,
      cornerBg: 'bg-[#FFCD00] text-[#0A1930] border border-amber-200',
      skills: [
        'Engineering Loops',
        'Gear Reduction',
        'Tactical Strategy',
        'Documentation',
      ],
      registerLabel: 'REGISTER FOR GRADES 7 – 9 →',
    },
    {
      id: 'robo-trials',
      badge: 'ALL GRADES • ROBO TRIALS',
      title: 'ROBO TRIALS',
      division: 'WE BUILD THE ROBOTS. YOU TEST THE LIMITS.',
      description: 'Take the Challenge. Master the Robot.',
      bannerImage: bannerRoboTrials,
      subtitleColor: 'text-[#9333EA]',
      checkColor: 'text-[#9333EA]',
      borderColor: 'border-[#C084FC]/40 hover:border-[#9333EA]',
      glowShadow: 'hover:shadow-[0_20px_50px_rgba(147,51,234,0.18)]',
      cornerIcon: Target,
      cornerBg: 'bg-white text-[#9333EA] border border-purple-100',
      skills: [
        'Control',
        'Strategy',
        'Accuracy',
        'Teamwork',
      ],
      taglinePill: 'CONTROL • STRATEGY • ACCURACY • TEAMWORK',
      registerLabel: 'REGISTER FOR ROBO TRIALS →',
    },
  ];

  return (
    <section id="competition-tracks" className="w-full bg-[#F4F8FB] text-[#0A1930] py-16 sm:py-20 px-3 sm:px-6 select-none relative overflow-hidden">
      
      {/* ── TECHNICAL BLUEPRINT GRID BACKGROUND ── */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'linear-gradient(to right, #006AA70F 1px, transparent 1px), linear-gradient(to bottom, #006AA70F 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="w-full space-y-10 relative z-10">

        {/* ── SECTION HEADER ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-4">
          
          {/* Left Column: Heading, Subtitle, Description */}
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-mono-code font-bold tracking-[0.25em] text-[#006AA7] uppercase block">
              COMPETITION TRACKS
            </span>

            <div className="relative inline-block">
              <h2
                className="font-headline font-black uppercase tracking-tight text-[#0A1930] leading-[1.02]"
                style={{ fontSize: 'clamp(2.4rem, 5.2vw, 4.2rem)' }}
              >
                CHOOSE YOUR{' '}
                <span className="text-[#006AA7] relative inline-block">
                  DISCIPLINE.
                  {/* Hand-drawn Orange Sparkle */}
                  <span className="absolute -top-3 -right-6 text-[#F97316] text-xl font-bold">✦</span>
                  {/* Hand-drawn Blue Underline */}
                  <svg
                    className="absolute left-0 -bottom-3 w-full h-3.5 text-[#006AA7]"
                    viewBox="0 0 240 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 8 C 65 13, 175 3, 237 7"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h2>
            </div>

            <p className="text-sm text-slate-500 font-light pt-3 max-w-md">
              Three disciplines. Three grade cohorts. One championship.
            </p>
          </div>

          {/* Right Column: CTA Action */}
          <div className="flex items-center self-start lg:self-end">
            <button
              onClick={() => onNavigate('challenges')}
              className="bg-white hover:bg-slate-50 text-[#0A1930] border border-slate-300 text-xs font-bold py-3 px-6 shadow-xs flex items-center gap-2 transition-transform hover:scale-105"
            >
              <span>VIEW FULL RULEBOOK</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── 3 VIBRANT DISCIPLINE CARDS WITH CLEAN UNBLEMISHED ARTWORK ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {tracks.map((track, idx) => {
            const CornerIcon = track.cornerIcon;

            return (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                className={`overflow-hidden bg-white border-2 shadow-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 group ${track.borderColor} ${track.glowShadow}`}
              >
                
                {/* ════ TOP HALF: 100% CLEAN ARTWORK (NO BLACK OVERLAY, NO OVERLAPPING TEXT) ════ */}
                <div className="relative aspect-[16/10.5] w-full overflow-hidden select-none bg-slate-900">
                  <img
                    src={track.bannerImage}
                    alt={track.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Top Corner Floating Badges (Clean & Out of the Way) */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10 pointer-events-none">
                    {track.id === 'robo-trials' || track.id === 'robo-quiz' ? (
                      <span className="bg-white/95 backdrop-blur-xs text-[#0A1930] text-[11px] font-mono-code font-black px-3.5 py-1.5 shadow-md tracking-wider uppercase border border-slate-100">
                        {track.badge}
                      </span>
                    ) : (
                      <span />
                    )}

                    <div className={`w-9 h-9 ${track.cornerBg} flex items-center justify-center shadow-md transition-transform group-hover:scale-110 ml-auto`}>
                      <CornerIcon className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* ════ BOTTOM HALF: CLEAN WHITE CARD DETAILS ════ */}
                <div className="bg-white p-5 sm:p-6 flex flex-col justify-between flex-1 space-y-4">
                  
                  {/* Division Label & Description */}
                  <div className="space-y-1.5">
                    <span className={`text-[11px] font-mono-code font-black uppercase tracking-wider block ${track.subtitleColor}`}>
                      {track.division}
                    </span>
                    <p className="text-sm text-slate-700 font-medium leading-snug">
                      {track.description}
                    </p>
                  </div>

                  {/* Skills as compact tag pills */}
                  <div className="flex flex-wrap gap-1.5 pb-1">
                    {track.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className={`inline-flex items-center gap-1.5 text-[11px] font-mono-code font-bold px-2.5 py-1 border ${track.subtitleColor} border-current/20 bg-current/5`}
                      >
                        <CheckCircle2 className={`w-3 h-3 ${track.checkColor}`} />
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Register CTA */}
                  <button
                    onClick={onOpenRegister}
                    className="w-full bg-[#FFCD00] hover:bg-[#FACC15] text-[#0A1930] font-black text-xs sm:text-sm py-3.5 px-6 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wider"
                  >
                    <span>{track.registerLabel}</span>
                  </button>

                </div>

              </motion.div>
            );
          })}
        </div>

        {/* ── SECTION FOOTER RIBBON ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200 text-[11px] font-mono-code text-slate-500 font-bold uppercase tracking-widest">
          <span>VÄSTERÅS FUTURE INNOVATORS 2026 · OFFICIAL COMPETITION LEAGUE</span>
          <span className="hidden sm:inline">DECEMBER 4 & 5, 2026 · STANDARDIZED LGR22 FORMAT</span>
        </div>

      </div>
    </section>
  );
};
