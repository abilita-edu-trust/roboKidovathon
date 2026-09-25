import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  ChevronRight,
  CheckCircle2,
  Compass,
  Hammer,
  Gauge,
  RotateCw,
  Trophy,
  Award,
  School,
  FileText,
  GitBranch,
} from 'lucide-react';
import { Interactive3DTilt } from '../components/Interactive3DTilt';

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
  const [activeHover, setActiveHover] = useState<number | null>(null);
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
      subtitle: 'Understand parts',
      icon: Compass,
      desc: 'Understand wheels, axles, gears, structural parts, motors and control components.',
      tag: 'COMPONENTS & MECHANICS',
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
      icon: Hammer,
      desc: 'Create a stable chassis and make the robot move reliably.',
      tag: 'STRUCTURAL ASSEMBLY',
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
      subtitle: 'Drive dynamics',
      icon: Gauge,
      desc: 'Experiment with speed, turning, stability, control accuracy and pushing ability.',
      tag: 'DRIVE DYNAMICS',
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
      icon: RotateCw,
      desc: 'Change the design based on what works, what fails and what can be better.',
      tag: 'DESIGN ITERATION',
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
      subtitle: 'Local qualifiers',
      icon: Trophy,
      desc: 'Teams apply their learning in a friendly school-level Robo-Sprint competition.',
      tag: 'LOCAL QUALIFIERS',
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
      subtitle: 'Dec 5 Grand Finale',
      icon: Award,
      desc: 'Selected teams represent their school and meet students from other schools in Västerås.',
      tag: 'DECEMBER 5 GRAND FINALE',
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
    <div className="w-full min-h-screen bg-gradient-to-b from-[#F6FAFD] via-[#EEF5FB] to-[#E5EFF8] text-[#0A1930] pt-28 pb-24 px-3 sm:px-6 select-none relative overflow-hidden">
      {/* Ambient Gradient Lighting */}
      <div className="absolute top-20 -left-40 w-96 h-96 bg-gradient-to-br from-sky-400/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 -right-40 w-96 h-96 bg-gradient-to-tl from-[#FFCD00]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="w-full space-y-16 relative z-10">

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

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <span className="text-xs text-slate-500 font-mono-code font-bold uppercase tracking-wider">
              READY TO BRING THIS CURRICULUM TO YOUR CLASSROOM?
            </span>
            <button
              onClick={onOpenRegister}
              className="w-full sm:w-auto px-6 py-3 bg-[#FFCD00] hover:bg-[#FACC15] text-[#0A1930] font-syne font-black text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 group active:scale-95"
            >
              <span>ENROL SCHOOL IN 20H WORKFLOW</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
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
                5 DECEMBER 2026
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
          className="space-y-8 relative overflow-hidden border border-slate-200/60 p-6 sm:p-8 bg-white"
        >
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

          {/* Header */}
          <div className="space-y-2 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 text-[#006AA7] text-xs font-mono-code font-bold tracking-[0.25em] uppercase">
              <GitBranch className="w-3.5 h-3.5" />
              <span>WORKFLOW // FROM PARTS TO CITY FINAL</span>
            </div>
            <h2 className="font-headline font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight text-[#0A1930]">
              From parts to city final
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
              The educational value comes before the competition. Students first learn and build
              inside the school, then use the challenge as a goal and motivation.
            </p>
          </div>

          {/* ── MIND MAP NODES TRACK WITH ANIMATED PATHWAYS ── */}
          <div className="relative pt-6 pb-2 z-10">
            {/* Continuous Animated Connecting SVG Rail (Desktop) */}
            <div className="hidden lg:block absolute top-[52px] left-[5%] right-[5%] h-5 z-0 pointer-events-none overflow-visible">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="workflowPathwayGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#006AA7" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#EA580C" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#FFCD00" stopOpacity="0.7" />
                  </linearGradient>
                  <linearGradient id="workflowActiveBeam" x1="0%" y1="0%" x2="100%" y2="0%">
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
                  stroke="url(#workflowPathwayGrad)"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                />
                {/* Animated energy pulse flowing left to right */}
                <motion.line
                  x1="0"
                  y1="2"
                  x2="100%"
                  y2="2"
                  stroke="url(#workflowActiveBeam)"
                  strokeWidth="3.5"
                  strokeDasharray="24 160"
                  animate={{ strokeDashoffset: [368, 0] }}
                  transition={{ repeat: Infinity, duration: 2.4, ease: 'linear' }}
                />
              </svg>
            </div>

            {/* 6 Connected Workflow Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 relative z-10">
              {workflowSteps.map((ws, idx) => {
                const Icon = ws.icon;
                const isCardHovered = activeHover === idx;
                const isNextCardHovered = activeHover === idx + 1;

                return (
                <div key={ws.step} className="relative flex flex-col h-full">
                  <Interactive3DTilt
                    maxTilt={8}
                    glareOpacity={ws.isFinal ? 0.22 : 0.14}
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
                      className={`group relative p-5 border flex-1 flex flex-col justify-between space-y-4 transition-all duration-300 ease-out cursor-pointer ${
                        ws.isFinal
                          ? 'bg-[#0A1930] text-white border-slate-800'
                          : 'bg-white text-[#0A1930] border-slate-200'
                      } ${ws.hoverCardClass}`}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between relative" style={{ transform: 'translateZ(12px)' }}>
                          <span
                            className={`font-mono-code font-black text-xl transition-colors duration-300 ${
                              ws.isFinal ? 'text-[#FFCD00]' : 'text-[#006AA7]'
                            } ${ws.hoverStepClass}`}
                          >
                            {ws.step}
                          </span>
                          <div
                            className={`w-9 h-9 flex items-center justify-center transition-all duration-300 shadow-xs group-hover:scale-110 ${
                              ws.isFinal
                                ? 'bg-white/10 text-[#FFCD00]'
                                : 'bg-slate-100 text-[#006AA7]'
                            } ${ws.hoverIconBoxClass}`}
                          >
                            <Icon className="w-4 h-4 transition-transform duration-300 group-hover:rotate-6" />
                          </div>
                        </div>

                        <div style={{ transform: 'translateZ(10px)' }}>
                          <h3
                            className={`font-headline font-black text-base uppercase tracking-tight transition-colors duration-300 ${
                              ws.isFinal ? 'text-white' : 'text-[#0A1930]'
                            } ${ws.hoverTitleClass}`}
                          >
                            {ws.title}
                          </h3>
                          <span
                            className={`text-[9px] font-mono-code font-bold uppercase tracking-wider block mt-0.5 transition-colors duration-300 ${
                              ws.isFinal ? 'text-[#013A63]' : 'text-slate-400'
                            } ${ws.hoverSubClass}`}
                          >
                            {ws.tag}
                          </span>
                        </div>

                        <p
                          className={`text-xs font-light leading-relaxed transition-colors duration-300 ${
                            ws.isFinal ? 'text-slate-300' : 'text-slate-600'
                          } ${ws.hoverDetailClass}`}
                        >
                          {ws.desc}
                        </p>
                      </div>

                      <div
                        className={`pt-2.5 border-t flex items-center justify-between text-[10px] font-mono-code font-bold uppercase transition-all duration-300 ${
                          ws.isFinal
                            ? 'border-white/10 text-[#FFCD00]'
                            : 'border-slate-100 text-slate-400'
                        } ${ws.hoverCtaClass}`}
                        style={{ transform: 'translateZ(8px)' }}
                      >
                        <span>STEP {idx + 1} OF 6</span>
                        <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1.5" />
                      </div>
                    </motion.div>
                  </Interactive3DTilt>

                    {/* Desktop Inter-Card Animated Arrow Connector */}
                    {idx < workflowSteps.length - 1 && (
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

                    {/* Mobile & Tablet Inter-Card Animated Arrow Connector */}
                    {idx < workflowSteps.length - 1 && (
                      <div className="lg:hidden flex items-center justify-center py-2.5 relative z-20">
                        <div
                          className={`flex items-center gap-1.5 px-3 py-1 border text-[10px] font-mono-code font-bold uppercase tracking-wider transition-colors duration-300 ${
                            isCardHovered || isNextCardHovered
                              ? 'bg-[#FFCD00] text-[#0A1930] border-[#FFCD00] shadow-sm'
                              : 'bg-sky-50 text-[#006AA7] border-sky-200'
                          }`}
                        >
                          <span>STEP {workflowSteps[idx + 1].step}</span>
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
