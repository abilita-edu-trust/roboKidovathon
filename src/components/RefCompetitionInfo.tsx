import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, HelpCircle, CheckCircle2 } from 'lucide-react';

interface RefCompetitionInfoProps {
  onOpenRegister: () => void;
  onNavigate: (route: string) => void;
}

export const RefCompetitionInfo: React.FC<RefCompetitionInfoProps> = ({
  onOpenRegister,
  onNavigate,
}) => {
  const [sprintTab, setSprintTab] = useState<'explorer' | 'advanced'>('explorer');
  const [quizTab, setQuizTab] = useState<'rounds' | 'domains'>('rounds');

  return (
    <section id="competition-info" className="w-full bg-white text-[#0A1930] py-14 sm:py-20 px-6 sm:px-10 border-t border-slate-200 scroll-mt-24 select-none">
      <div className="max-w-[1440px] mx-auto space-y-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="space-y-2">
            <span className="text-[10px] font-mono-code font-bold tracking-[0.25em] text-[#006AA7] uppercase block">
              COMPETITION CATEGORIES // 2026 EDITION
            </span>
            <h2 className="font-headline font-black text-2xl sm:text-3xl md:text-4xl text-[#0A1930] uppercase tracking-tight leading-tight">
              ROBO SPRINT <span className="text-[#006AA7]">&amp;</span> ROBO QUIZ
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-light max-w-xl">
              Side-by-side competition disciplines: hands-on arena robotics and the inter-school STEM knowledge challenge.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono-code text-slate-500 font-bold uppercase tracking-wider">
              TWO BALANCED DISCIPLINES
            </span>
          </div>
        </div>

        {/* ── SIDE-BY-SIDE 2-COLUMN LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8 items-stretch">

          {/* ════ COLUMN 1: ROBO SPRINT ════ */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-slate-200 bg-[#F8FAFC] p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#006AA7]" />

            <div className="space-y-5">
              {/* Header Badge */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#006AA7] text-white flex items-center justify-center shadow-xs">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono-code font-bold text-[#006AA7] uppercase tracking-wider block">
                      ARENA ROBOTICS
                    </span>
                    <h3 className="font-headline font-black text-xl sm:text-2xl uppercase tracking-tight text-[#0A1930]">
                      Robo-Sprint
                    </h3>
                  </div>
                </div>

                <span className="text-[10px] font-mono-code font-bold px-2.5 py-1 rounded-full bg-[#006AA7]/10 text-[#006AA7] border border-[#006AA7]/20 uppercase">
                  GRADE 3 TO 9
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                Fast-paced head-to-head arena challenge. Student teams engineer differential robots to clear balls across the central arena barrier into the opponent's half in 3-minute matches.
              </p>

              {/* Sub-Tabs: Explorer vs Advanced */}
              <div className="p-1 rounded-2xl bg-slate-200/70 flex items-center gap-1">
                <button
                  onClick={() => setSprintTab('explorer')}
                  className={`flex-1 py-2 text-xs font-mono-code font-bold rounded-xl transition-all ${
                    sprintTab === 'explorer'
                      ? 'bg-white text-[#0A1930] shadow-xs'
                      : 'text-slate-600 hover:text-[#0A1930]'
                  }`}
                >
                  Explorer (Grades 3–6)
                </button>
                <button
                  onClick={() => setSprintTab('advanced')}
                  className={`flex-1 py-2 text-xs font-mono-code font-bold rounded-xl transition-all ${
                    sprintTab === 'advanced'
                      ? 'bg-white text-[#0A1930] shadow-xs'
                      : 'text-slate-600 hover:text-[#0A1930]'
                  }`}
                >
                  Advanced (Grades 7–9)
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 font-mono-code text-xs">
                {sprintTab === 'explorer' ? (
                  <>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">DIVISION:</span>
                      <strong className="text-[#0A1930]">Junior League · Grade 3 to 6</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">CONTROL:</span>
                      <span className="text-slate-700">Wired Dual-Switch Remote</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">ARENA SIZE:</span>
                      <span className="text-slate-700">244 cm × 122 cm Metric Mat</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">MATCH DURATION:</span>
                      <span className="text-[#006AA7] font-bold">3 Minutes (1 vs 1)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">SCORING:</span>
                      <strong className="text-[#006AA7]">5 pts per transferred ball</strong>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">DIVISION:</span>
                      <strong className="text-[#0A1930]">Senior League · Grade 7 to 9</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">CONTROL:</span>
                      <span className="text-slate-700">Tactical Multi-Channel Remote</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">ARENA OBSTACLES:</span>
                      <span className="text-slate-700">Zigzag Barrier &amp; Deflection Arches</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">MATCH DURATION:</span>
                      <span className="text-[#006AA7] font-bold">3 Minutes (1 vs 1)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">EVALUATION:</span>
                      <strong className="text-[#006AA7]">Matches (60%) + Engineering (40%)</strong>
                    </div>
                  </>
                )}
              </div>

              {/* Key Highlights */}
              <div className="space-y-2 text-xs font-light text-slate-700">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#006AA7] shrink-0 mt-0.5" />
                  <span>Low-voltage 6V DC hardware with reusable motors, gearboxes, and chassis parts.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#006AA7] shrink-0 mt-0.5" />
                  <span>Qualifiers held directly in participating schools; winners advance to City Finals.</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenRegister}
                className="btn-pill-lime text-xs font-bold py-3 px-6 shadow-sm flex items-center gap-2"
              >
                <span>REGISTER SPRINT TEAM</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('challenges')}
                className="btn-pill-outline text-xs font-bold py-3 px-5"
              >
                <span>ARENA RULES</span>
              </button>
            </div>
          </motion.div>

          {/* ════ COLUMN 2: ROBO QUIZ ════ */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="rounded-3xl border border-slate-200 bg-[#F8FAFC] p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#FFCD00]" />

            <div className="space-y-5">
              {/* Header Badge */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFCD00] text-[#0A1930] flex items-center justify-center shadow-xs font-bold">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono-code font-bold text-[#D97706] uppercase tracking-wider block">
                      STEM &amp; INNOVATION
                    </span>
                    <h3 className="font-headline font-black text-xl sm:text-2xl uppercase tracking-tight text-[#0A1930]">
                      Robo-Quiz
                    </h3>
                  </div>
                </div>

                <span className="text-[10px] font-mono-code font-bold px-2.5 py-1 rounded-full bg-[#FFCD00]/30 text-[#0A1930] border border-[#FFCD00]/50 uppercase">
                  ALL GRADES
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                The inter-school STEM and robotics knowledge challenge. Test your school team's understanding of mechanical systems, electricity, robotics logic, and future tech solutions.
              </p>

              {/* Sub-Tabs: Rounds vs Domains */}
              <div className="p-1 rounded-2xl bg-slate-200/70 flex items-center gap-1">
                <button
                  onClick={() => setQuizTab('rounds')}
                  className={`flex-1 py-2 text-xs font-mono-code font-bold rounded-xl transition-all ${
                    quizTab === 'rounds'
                      ? 'bg-white text-[#0A1930] shadow-xs'
                      : 'text-slate-600 hover:text-[#0A1930]'
                  }`}
                >
                  Round Structure
                </button>
                <button
                  onClick={() => setQuizTab('domains')}
                  className={`flex-1 py-2 text-xs font-mono-code font-bold rounded-xl transition-all ${
                    quizTab === 'domains'
                      ? 'bg-white text-[#0A1930] shadow-xs'
                      : 'text-slate-600 hover:text-[#0A1930]'
                  }`}
                >
                  Syllabus Domains (Lgr22)
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 font-mono-code text-xs">
                {quizTab === 'rounds' ? (
                  <>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">ROUND 1:</span>
                      <strong className="text-[#0A1930]">Quick-Fire Technical Mechanics</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">ROUND 2:</span>
                      <span className="text-slate-700">Circuit &amp; Sensor Problem Solving</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">ROUND 3:</span>
                      <span className="text-slate-700">Visual Code Logic &amp; Robotics Systems</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">FINAL BUZZER:</span>
                      <span className="text-[#006AA7] font-bold">Championship Face-Off</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">AWARDS:</span>
                      <strong className="text-[#006AA7]">Trophies, medals &amp; certificates</strong>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">TEKNIK:</span>
                      <strong className="text-[#0A1930]">Mechanisms, stability, levers &amp; gears</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">NO / FYSIK:</span>
                      <span className="text-slate-700">Energy, forces, friction &amp; electricity</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">MATEMATIK:</span>
                      <span className="text-slate-700">Ratios, angles, measurements &amp; speed</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">INNOVATION:</span>
                      <span className="text-[#006AA7] font-bold">Sustainable tech for society</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">TEAM FORMAT:</span>
                      <strong className="text-[#006AA7]">3–5 students per school team</strong>
                    </div>
                  </>
                )}
              </div>

              {/* Key Highlights */}
              <div className="space-y-2 text-xs font-light text-slate-700">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                  <span>No prior robotics build required — designed for science, tech &amp; curiosity enthusiasts.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                  <span>Live interactive scoring with instant leaderboard at the December 5 championship.</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenRegister}
                className="px-6 py-3 rounded-full bg-[#0A1930] hover:bg-[#002D52] text-white font-syne font-bold text-xs tracking-wider uppercase transition-all shadow-sm flex items-center gap-2"
              >
                <span>REGISTER QUIZ TEAM</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#FFCD00]" />
              </button>
              <button
                onClick={() => onNavigate('lgr22')}
                className="btn-pill-outline text-xs font-bold py-3 px-5"
              >
                <span>SYLLABUS FIT</span>
              </button>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
