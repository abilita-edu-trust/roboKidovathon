import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ChevronDown } from 'lucide-react';
import {
  LEARNING_BLOCKS,
  LearningBlock,
  STEM_PROJECT_SESSIONS,
  ProjectSession,
  STEM_PROJECT_DELIVERABLES,
  ProjectDeliverable,
} from '../data/roboData';

interface HowItWorksPageProps {
  onNavigateHome: () => void;
  onOpenRegister: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({
  onNavigateHome,
  onOpenRegister,
}) => {
  const [openBlock, setOpenBlock] = useState<string | null>(null);

  // 6-step verified participant journey
  const JOURNEY_STEPS = [
    {
      num: '01',
      title: 'REGISTER',
      subtitle: 'School & Cohort Intake',
      desc: 'Schools or student teams register online. INIAC coordinates dates, student numbers, and equipment logistics directly with the school coordinator.',
      badge: 'SPRING / AUTUMN',
    },
    {
      num: '02',
      title: 'PREPARE',
      subtitle: 'Kits Delivered to Classroom',
      desc: 'Mentors deliver official Robo-Sprint hardware kits, 6V powertrains, gearboxes, and the 244 × 122 cm arena mat directly to your school. Zero lab budget required.',
      badge: 'IN-SCHOOL DELIVERY',
    },
    {
      num: '03',
      title: 'BUILD & LEARN',
      subtitle: '20-Hour STEM Project',
      desc: 'Across 10 structured 2-hour sessions, student pairs learn mechanical fundamentals, assemble working robots, test movement, and iterate their designs.',
      badge: '10 SESSIONS',
    },
    {
      num: '04',
      title: 'QUALIFY',
      subtitle: 'School Robo-Sprint Matches',
      desc: 'Held inside each participating school during October 2026. Teams compete on the official mat. The top Explorer and Advanced teams qualify for the city final.',
      badge: 'OCTOBER 2026',
    },
    {
      num: '05',
      title: 'REFINE',
      subtitle: 'Team Strategy & Documentation',
      desc: 'Qualifying teams refine their robot kinematics, defense tactics, and engineering reflection portfolios with mentor feedback.',
      badge: 'TEAM WORKSHOP',
    },
    {
      num: '06',
      title: 'GRAND FINALE',
      subtitle: 'Västerås City Final',
      desc: 'School champions compete live on Friday & Saturday, December 4 & 5, 2026 in Västerås for SEK 3,000 in prizes, official trophies, and certificates.',
      badge: 'DECEMBER 4 & 5, 2026',
      highlight: true,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white text-[#0A1930] pt-28 pb-24 px-3 sm:px-6 select-none">
      <div className="w-full space-y-16">

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 text-xs font-mono-code font-bold tracking-wider text-[#006AA7] uppercase hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO HOME</span>
        </motion.button>

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="border-b border-slate-200 pb-12"
        >
          <span className="text-[10px] font-mono-code font-medium tracking-[0.2em] text-slate-500 uppercase block mb-3">
            A STRUCTURED PROJECT, NOT JUST A ONE-OFF WORKSHOP // VÄSTERÅS 2026
          </span>

          <h1
            className="font-headline font-black uppercase tracking-tight leading-[1.02]"
            style={{ fontSize: 'clamp(3.2rem, 7.5vw, 6.5rem)' }}
          >
            <span className="text-stroke block">HOW IT</span>
            <span className="text-[#0A1930] block">WORKS</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 font-light max-w-2xl leading-relaxed">
            Västerås Future Innovators begins with a practical in-school STEM programme where students understand how a working robot is engineered from the ground up — then build, test, and optimize their own machine for the arena challenge.
          </p>
        </motion.div>

        {/* ── 6-STAGE COMPLETE PARTICIPANT JOURNEY TIMELINE ── */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-[10px] font-mono-code font-bold tracking-[0.2em] text-[#006AA7] uppercase block">
                PARTICIPANT JOURNEY // FROM CLASSROOM TO ARENA
              </span>
              <h2 className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#0A1930] mt-1">
                The Six Competition Stages
              </h2>
            </div>
            <span className="text-xs font-mono-code text-slate-400">
              COMPLETE PARTICIPANT PATHWAY
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {JOURNEY_STEPS.map((step, idx) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                className={`p-7 border flex flex-col justify-between space-y-5 transition-all shadow-sm ${
                  step.highlight
                    ? 'bg-[#0A1930] text-white border-slate-800'
                    : 'bg-white text-[#0A1930] border-slate-200 hover:border-[#006AA7]/40'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`font-mono-code font-black text-2xl ${
                      step.highlight ? 'text-[#FFCD00]' : 'text-[#006AA7]'
                    }`}>
                      {step.num}
                    </span>
                    <span className={`text-[9px] font-mono-code font-bold uppercase tracking-wider ${
                      step.highlight ? 'text-[#FFCD00]' : 'text-[#006AA7]'
                    }`}>
                      {step.badge}
                    </span>
                  </div>

                  <h3 className="font-headline font-black text-xl uppercase tracking-tight">
                    {step.title}
                  </h3>

                  <p className={`text-xs font-mono-code font-bold uppercase ${
                    step.highlight ? 'text-slate-300' : 'text-[#006AA7]'
                  }`}>
                    {step.subtitle}
                  </p>

                  <p className={`text-xs sm:text-sm font-light leading-relaxed ${
                    step.highlight ? 'text-slate-200' : 'text-slate-600'
                  }`}>
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── 5 LEARNING BLOCKS ── */}
        <div className="space-y-4 pt-4">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-[10px] font-mono-code font-bold tracking-[0.2em] text-[#006AA7] uppercase block">
              PEDAGOGICAL BUILDING BLOCKS
            </span>
            <h2 className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#0A1930] mt-1">
              Five Core Learning Competencies
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 items-start">
            {LEARNING_BLOCKS.map((block: LearningBlock, idx: number) => {
              const isOpen = openBlock === block.tag;
              return (
                <motion.button
                  key={block.tag}
                  type="button"
                  onClick={() => setOpenBlock(isOpen ? null : block.tag)}
                  aria-expanded={isOpen}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className={`text-center border bg-[#F8FAFC] p-5 space-y-1.5 transition-colors w-full ${
                    isOpen ? 'border-[#006AA7]/40 shadow-sm' : 'border-slate-200 hover:border-[#006AA7]/30'
                  }`}
                >
                  <span className="font-headline font-black text-sm sm:text-base text-[#006AA7] uppercase tracking-wide block">
                    {block.tag}
                  </span>
                  <span className="text-[11px] text-slate-500 font-light leading-snug block">
                    {block.desc}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex justify-center pt-1"
                  >
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </motion.div>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="text-[10px] text-slate-500 font-light leading-relaxed pt-2 border-t border-slate-200">
                          {block.detail}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── 20-HOUR SESSION BREAKDOWN ── */}
        <div className="space-y-6 pt-4">
          <div className="border-b border-slate-200 pb-6">
            <span className="text-[10px] font-mono-code font-bold tracking-[0.2em] text-[#006AA7] uppercase block mb-2">
              SESSION-BY-SESSION CURRICULUM
            </span>
            <h2 className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#0A1930]">
              20-Hour STEM Project Structure (10 Sessions × 2h)
            </h2>
            <p className="mt-2 text-sm text-slate-600 font-light max-w-2xl leading-relaxed">
              Designed for Swedish school timetables. Delivered across ten 2-hour sessions (or a lighter 10–12 hour version for younger cohorts) mapping directly to Teknik, Matematik, and NO/Fysik goals.
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-200">
                  <th className="px-5 py-3 text-[10px] font-mono-code font-bold text-slate-500 uppercase tracking-wider">Session</th>
                  <th className="px-5 py-3 text-[10px] font-mono-code font-bold text-slate-500 uppercase tracking-wider">Hours</th>
                  <th className="px-5 py-3 text-[10px] font-mono-code font-bold text-slate-500 uppercase tracking-wider">Curricular &amp; Practical Focus</th>
                </tr>
              </thead>
              <tbody>
                {STEM_PROJECT_SESSIONS.map((s: ProjectSession) => (
                  <tr key={s.session} className="border-b border-slate-100 last:border-0 hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3.5 text-sm font-headline font-bold text-[#006AA7]">
                      {String(s.session).padStart(2, '0')}
                    </td>
                    <td className="px-5 py-3.5 text-xs font-mono-code text-slate-500">
                      {s.hours}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-[#0A1930] font-light">
                      {s.focus}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── WHAT STUDENTS PRODUCE ── */}
        <div className="space-y-6 pt-4">
          <div className="border-b border-slate-200 pb-6">
            <h2 className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#0A1930]">
              What Students Produce &amp; Take Home
            </h2>
            <p className="mt-2 text-sm text-slate-600 font-light max-w-2xl leading-relaxed">
              Documented evidence of learning that teachers can use for subject evaluations under Lgr22.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {STEM_PROJECT_DELIVERABLES.map((d: ProjectDeliverable, idx: number) => (
              <motion.div
                key={d.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                className="p-6 bg-[#F8FAFC] border border-slate-200 space-y-2 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#006AA7]" />
                  <h3 className="font-headline font-bold text-sm uppercase text-[#0A1930]">
                    {d.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 font-light leading-relaxed pl-6">
                  {d.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="p-8 sm:p-12 bg-[#0A1930] text-white text-center space-y-6">
          <h3 className="font-headline font-black text-2xl sm:text-4xl uppercase tracking-tight">
            Ready to Plan a STEM Project for Your School?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 font-light max-w-xl mx-auto leading-relaxed">
            Our delivery partners bring all kits, arena mats, and teacher briefings directly to your school.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onOpenRegister}
              className="btn-pill-lime text-xs sm:text-sm font-black py-4 px-8"
            >
              <span>REGISTER SCHOOL / TEAM</span>
            </button>
            <button
              onClick={onNavigateHome}
              className="px-6 py-4 border border-white/20 hover:border-white text-white text-xs font-bold uppercase tracking-wider transition-all"
            >
              <span>BACK TO HOME</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
