import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Compass,
  Hammer,
  Gauge,
  RotateCw,
  Trophy,
  Award,
  School,
  FileText,
} from 'lucide-react';

interface WorkflowPageProps {
  onNavigateHome: () => void;
  onOpenRegister: () => void;
  onOpenDeckModal: () => void;
}

export const WorkflowPage: React.FC<WorkflowPageProps> = ({
  onNavigateHome,
  onOpenRegister,
  onOpenDeckModal,
}) => {
  const pathwayPillars = [
    {
      title: 'Hands-on STEM',
      desc: 'Teamwork and problem solving',
    },
    {
      title: 'Engineering & Research',
      desc: 'Mentors and real-world inspiration',
    },
    {
      title: 'University Pathway',
      desc: 'A visible pathway towards higher studies and innovation',
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Explore',
      icon: Compass,
      desc: 'Understand wheels, axles, gears, structural parts, motors and control components.',
      tag: 'COMPONENTS & MECHANICS',
      accent: 'text-[#006AA7]',
      accentBg: 'bg-sky-50 border-sky-200',
    },
    {
      step: '02',
      title: 'Build',
      icon: Hammer,
      desc: 'Create a stable chassis and make the robot move reliably.',
      tag: 'STRUCTURAL ASSEMBLY',
      accent: 'text-[#006AA7]',
      accentBg: 'bg-sky-50 border-sky-200',
    },
    {
      step: '03',
      title: 'Test',
      icon: Gauge,
      desc: 'Experiment with speed, turning, stability, control accuracy and pushing ability.',
      tag: 'DRIVE DYNAMICS',
      accent: 'text-[#006AA7]',
      accentBg: 'bg-sky-50 border-sky-200',
    },
    {
      step: '04',
      title: 'Improve',
      icon: RotateCw,
      desc: 'Change the design based on what works, what fails and what can be better.',
      tag: 'DESIGN ITERATION',
      accent: 'text-[#EA580C]',
      accentBg: 'bg-orange-50 border-orange-200',
    },
    {
      step: '05',
      title: 'School Sprint',
      icon: Trophy,
      desc: 'Teams apply their learning in a friendly school-level Robo-Sprint competition.',
      tag: 'LOCAL QUALIFIERS',
      accent: 'text-[#EA580C]',
      accentBg: 'bg-orange-50 border-orange-200',
    },
    {
      step: '06',
      title: 'City Final',
      icon: Award,
      desc: 'Selected teams represent their school and meet students from other schools in Västerås.',
      tag: 'DECEMBER 4 & 5 GRAND FINALE',
      accent: 'text-[#FFCD00]',
      accentBg: 'bg-[#0A1930] text-white border-slate-700',
      isDark: true,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white text-[#0A1930] pt-28 pb-24 px-3 sm:px-6 select-none">
      <div className="w-full space-y-16">

        {/* ── TOP BREADCRUMB & PROPOSAL CONTEXT ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs font-mono-code font-bold tracking-wider text-[#006AA7] uppercase hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO HOME</span>
          </motion.button>

          <span className="text-[11px] font-mono-code font-bold text-slate-500 uppercase tracking-widest">
            COLLABORATION PROPOSAL · IBK VÄSTERÅS × INIAC · 2026
          </span>
        </div>

        {/* ── HEADER BLOCK: MDU C2 & INSTITUTIONAL PARTNERSHIP ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-slate-100 border border-slate-200 text-xs font-mono-code font-bold uppercase tracking-wider text-[#0A1930]">
            <School className="w-4 h-4 text-[#006AA7]" />
            <span>MDU C2 | VÄSTERÅS FUTURE INNOVATORS 2026</span>
          </div>

          {/* 3 Value Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pathwayPillars.map((pillar, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 bg-[#F8FAFC] border border-slate-200/90 space-y-1"
              >
                <span className="font-mono-code font-bold text-xs text-[#006AA7] uppercase block">
                  {pillar.title}
                </span>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Pathway Flow Strip */}
          <div className="p-3.5 bg-[#0A1930] text-white flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs font-mono-code font-bold uppercase tracking-wider">
            <span>PARTS</span>
            <span className="text-[#FFCD00]">⟶</span>
            <span>BUILD</span>
            <span className="text-[#FFCD00]">⟶</span>
            <span>TEST</span>
            <span className="text-[#FFCD00]">⟶</span>
            <span>IMPROVE</span>
            <span className="text-[#FFCD00]">⟶</span>
            <span>SCHOOL COMPETE</span>
            <span className="text-[#FFCD00]">⟶</span>
            <span className="text-[#FFCD00]">CITY FINAL</span>
          </div>
        </motion.div>

        {/* ── SECTION 1: DUAL LEARNING LEVELS (EXPLORER & ADVANCED) ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border border-slate-200 bg-white p-6 sm:p-10 shadow-lg space-y-8"
        >
          {/* Top Bar: Date & League */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-6 border-b border-slate-100">
            <div className="inline-flex items-center gap-3">
              <span className="bg-[#0A1930] text-white px-4 py-2 text-xs sm:text-sm font-mono-code font-black tracking-wider uppercase">
                4 DECEMBER 2026
              </span>
              <span className="bg-[#FFCD00] text-[#0A1930] px-4 py-2 text-xs sm:text-sm font-mono-code font-black tracking-wider uppercase">
                ROBOKIDOVATION
              </span>
            </div>
            <span className="text-xs font-mono-code text-slate-400 font-bold uppercase tracking-wider">
              SWEDISH SCHOOL STEM PATHWAY
            </span>
          </div>

          {/* Main Headline & Philosophy */}
          <div className="space-y-3 max-w-3xl">
            <h2
              className="font-headline font-black uppercase text-[#0A1930] tracking-tight leading-[1.02]"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.6rem)' }}
            >
              BUILD. TEST. IMPROVE.{' '}
              <span className="text-[#006AA7]">COMPETE.</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-700 font-light leading-relaxed">
              RoboKidovation is the practical STEM pathway. Students do not receive a finished robot:
              they understand the components, build a working solution, test performance, improve the
              design and then compete.
            </p>
          </div>

          {/* Two Columns: Left Challenge Specs & Right Student Experience */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 items-stretch">

            {/* Left: Robo-Sprint & 2 Learning Levels */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-mono-code font-bold text-[#006AA7] uppercase tracking-wider block">
                  ROBO-SPRINT CHALLENGE
                </span>
                <h3 className="font-headline font-black text-xl sm:text-2xl text-[#0A1930] uppercase tracking-tight">
                  Simple to understand. Deep enough to engineer.
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                  Teams control a robot in a 1-vs-1 match and try to move as many balls as possible into
                  the opponent's side. The challenge encourages students to balance speed, stability,
                  control and strategy.
                </p>
              </div>

              {/* 2 Learning Levels Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Explorer */}
                <div className="p-4 bg-[#F8FAFC] border border-slate-200 space-y-2">
                  <span className="text-[11px] font-mono-code font-bold text-[#006AA7] uppercase tracking-wider block">
                    Explorer · Grades 3–6
                  </span>
                  <p className="text-xs text-slate-600 font-normal leading-relaxed">
                    Focus on stable construction, basic mechanisms, movement, motor control, teamwork
                    and simple strategy.
                  </p>
                  <span className="inline-block text-[10px] font-mono-code font-bold text-[#006AA7] uppercase tracking-wider pt-1">
                    ✓ Build confidence
                  </span>
                </div>

                {/* Advanced */}
                <div className="p-4 bg-[#F8FAFC] border border-slate-200 space-y-2">
                  <span className="text-[11px] font-mono-code font-bold text-[#EA580C] uppercase tracking-wider block">
                    Advanced · Grades 7–9
                  </span>
                  <p className="text-xs text-slate-600 font-normal leading-relaxed">
                    Go deeper into engineering design, measurement, optimization, control logic and
                    technical explanation.
                  </p>
                  <span className="inline-block text-[10px] font-mono-code font-bold text-[#EA580C] uppercase tracking-wider pt-1">
                    ✓ Engineer &amp; optimize
                  </span>
                </div>
              </div>

              {/* 4 Technical Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-slate-50 border border-slate-200 text-center font-mono-code">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">ARENA</span>
                  <span className="text-xs font-bold text-[#0A1930] block">2.44 × 1.22 m</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">MATCH</span>
                  <span className="text-xs font-bold text-[#0A1930] block">1 team vs 1 team</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">DURATION</span>
                  <span className="text-xs font-bold text-[#006AA7] block">3 minutes</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">TEAM</span>
                  <span className="text-xs font-bold text-[#0A1930] block">3–4 students</span>
                </div>
              </div>
            </div>

            {/* Right: What Students Experience & School Connection */}
            <div className="lg:col-span-5 space-y-6 lg:border-l lg:border-slate-100 lg:pl-8 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[11px] font-mono-code font-bold text-slate-400 uppercase tracking-widest block">
                  ONE CHALLENGE. TWO LEARNING LEVELS.
                </span>
                <h4 className="font-headline font-bold text-lg text-[#0A1930] uppercase">
                  What students experience
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-700">
                  {[
                    'Construction, wheels, gears and mechanisms',
                    'Motors, movement and control',
                    'Testing, measurement and iterative improvement',
                    'Team strategy, problem solving and technical explanation',
                  ].map((exp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#006AA7] shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-medium">{exp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* School Connection Box */}
              <div className="p-4 bg-sky-50/60 border border-sky-100 space-y-1.5">
                <h5 className="font-headline font-bold text-xs uppercase tracking-wide text-[#006AA7]">
                  School connection
                </h5>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  Practical learning opportunities can connect to <strong>Teknik</strong>,{' '}
                  <strong>Matematik</strong> and <strong>NO/Fysik</strong> in Lgr22, depending on
                  age and the school's own planning.
                </p>
              </div>
            </div>

          </div>
        </motion.div>

        {/* ── SECTION 2: FROM PARTS TO CITY FINAL (THE 6-STAGE WORKFLOW) ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-mono-code font-bold tracking-[0.25em] text-[#006AA7] uppercase block">
              WORKFLOW // FROM PARTS TO CITY FINAL
            </span>
            <h2 className="font-headline font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight text-[#0A1930]">
              From parts to city final
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
              The educational value comes before the competition. Students first learn and build
              inside the school, then use the challenge as a goal and motivation.
            </p>
          </div>

          {/* 6 Connected Workflow Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-stretch">
            {workflowSteps.map((ws, idx) => {
              const Icon = ws.icon;
              return (
                <div
                  key={ws.step}
                  className={`p-5 flex flex-col justify-between space-y-4 border transition-all duration-300 hover:-translate-y-1 shadow-xs hover:shadow-md ${
                    ws.isDark
                      ? 'bg-[#0A1930] text-white border-slate-800'
                      : 'bg-white text-[#0A1930] border-slate-200'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-mono-code font-black text-xl ${
                          ws.isDark ? 'text-[#FFCD00]' : 'text-[#006AA7]'
                        }`}
                      >
                        {ws.step}
                      </span>
                      <div
                        className={`w-8 h-8 flex items-center justify-center ${
                          ws.isDark ? 'bg-white/10 text-[#FFCD00]' : 'bg-slate-100 text-[#006AA7]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <div>
                      <h3
                        className={`font-headline font-black text-base uppercase tracking-tight ${
                          ws.isDark ? 'text-white' : 'text-[#0A1930]'
                        }`}
                      >
                        {ws.title}
                      </h3>
                      <span
                        className={`text-[9px] font-mono-code font-bold uppercase tracking-wider block mt-0.5 ${
                          ws.isDark ? 'text-[#FFCD00]' : 'text-slate-400'
                        }`}
                      >
                        {ws.tag}
                      </span>
                    </div>

                    <p
                      className={`text-xs font-light leading-relaxed ${
                        ws.isDark ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {ws.desc}
                    </p>
                  </div>

                  <div
                    className={`pt-2 border-t text-[10px] font-mono-code font-bold uppercase ${
                      ws.isDark ? 'border-white/10 text-[#FFCD00]' : 'border-slate-100 text-slate-400'
                    }`}
                  >
                    STEP {idx + 1} OF 6
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ── SECTION 3: REUSABLE HANDS-ON STEM PLATFORM ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 sm:p-12 bg-gradient-to-br from-[#0A1930] to-[#012544] text-white border border-slate-800 shadow-xl space-y-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <span className="text-[10px] sm:text-[11px] font-mono-code font-bold tracking-widest text-[#FFCD00] uppercase">
                MDU C2 | VÄSTERÅS FUTURE INNOVATORS 2026
              </span>
              <h2 className="font-headline font-black text-2xl sm:text-3xl md:text-4xl text-white uppercase tracking-tight">
                Reusable hands-on STEM platform
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                A single modular kit lets students move from construction and mechanisms to electronics,
                control and robotics. The competition is the application; the learning is the core.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenRegister}
                className="bg-[#FFCD00] hover:bg-[#FACC15] text-[#0A1930] font-black text-xs sm:text-sm py-4 px-7 shadow-md flex items-center gap-2 transition-transform hover:scale-105 uppercase tracking-wider"
              >
                <span>REGISTER SCHOOL / COHORT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenDeckModal}
                className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-mono-code font-bold uppercase transition-transform hover:scale-105 flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-slate-300" />
                <span>VIEW PROPOSAL DECK</span>
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
