import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Bot,
  Lightbulb,
  Target,
  Users,
  Briefcase,
  Award,
  Trophy,
  Presentation,
  Cpu,
  Wrench,
  Compass,
  Search,
  Layers,
  LineChart,
  Rocket,
  UserPlus,
  GraduationCap,
} from 'lucide-react';

interface RefTheExperienceProps {
  onNavigate: (route: string) => void;
  onOpenRegister?: () => void;
}

export const RefTheExperience: React.FC<RefTheExperienceProps> = ({
  onNavigate,
  onOpenRegister,
}) => {
  // Step definitions for RoboKidovation (Blue)
  const roboSteps = [
    {
      num: 1,
      title: 'School Demo',
      subtitle: 'Intro session at your school',
      date: '7 – 25 September 2026',
      icon: Presentation,
      highlight: false,
    },
    {
      num: 2,
      title: 'Workshop',
      subtitle: 'Hands-on robotics workshop',
      date: '1 – 9 October 2026',
      icon: Cpu,
      highlight: false,
    },
    {
      num: 3,
      title: 'Build & Practice',
      subtitle: 'Test, improve and learn',
      date: '12 – 30 October 2026',
      icon: Wrench,
      highlight: false,
    },
    {
      num: 4,
      title: 'School Finals',
      subtitle: 'Internal school competition',
      date: '2 – 13 November 2026',
      icon: Users,
      highlight: false,
    },
    {
      num: 5,
      title: 'Select 4 Teams',
      subtitle: 'Top teams qualify for Västerås Final',
      date: '16 – 27 November 2026',
      icon: Award,
      highlight: false,
    },
    {
      num: 6,
      title: 'Västerås Final',
      subtitle: 'Compete at Future Innovators',
      date: '4 December 2026',
      icon: Trophy,
      highlight: true,
    },
  ];

  // Step definitions for Young Innovators Hackathon (Green)
  const hackathonSteps = [
    {
      num: 1,
      title: 'Discover',
      subtitle: 'Explore real-world challenges',
      date: '7 – 25 September 2026',
      icon: Compass,
      highlight: false,
    },
    {
      num: 2,
      title: 'Form Teams',
      subtitle: 'Build teams and choose themes',
      date: '1 – 16 October 2026',
      icon: UserPlus,
      highlight: false,
    },
    {
      num: 3,
      title: 'Define the Problem',
      subtitle: 'Research and understand the need',
      date: '19 – 30 October 2026',
      icon: Search,
      highlight: false,
    },
    {
      num: 4,
      title: 'Develop Idea',
      subtitle: 'Create concept or prototype',
      date: '2 – 20 November 2026',
      icon: Layers,
      highlight: false,
    },
    {
      num: 5,
      title: 'Prepare Pitch',
      subtitle: 'Refine solution and presentation',
      date: '23 Nov – 3 Dec 2026',
      icon: LineChart,
      highlight: false,
    },
    {
      num: 6,
      title: 'Hackathon Day',
      subtitle: 'Present to jury and win',
      date: '5 December 2026',
      icon: Rocket,
      highlight: true,
    },
  ];

  return (
    <section
      id="choose-experience"
      className="w-full bg-gradient-to-b from-[#F2F8FD] via-[#F8FBFE] to-white text-[#0A1930] py-16 sm:py-24 px-4 sm:px-6 lg:px-10 select-none relative overflow-hidden border-t border-slate-200"
    >
      {/* ── AMBIENT SKYLINE BACKGROUND SILHOUETTE ── */}
      <div className="absolute top-0 inset-x-0 h-96 pointer-events-none opacity-[0.08] overflow-hidden flex items-end justify-center">
        <svg
          viewBox="0 0 1440 280"
          className="w-full h-full object-cover text-[#006AA7]"
          fill="currentColor"
          preserveAspectRatio="none"
        >
          {/* Västerås style church spire, towers and cityscape silhouette */}
          <path d="M0,280 L0,230 L90,230 L90,190 L120,190 L120,230 L220,230 L220,160 L240,160 L240,120 L245,60 L250,120 L250,160 L280,160 L280,230 L380,230 L380,200 L430,200 L430,230 L550,230 L550,175 L590,175 L590,230 L700,230 L700,180 L740,180 L750,100 L760,180 L790,180 L790,230 L880,230 L880,195 L930,195 L930,230 L1020,230 L1020,150 L1060,150 L1060,230 L1180,230 L1180,210 L1220,210 L1220,230 L1320,230 L1320,170 L1360,170 L1360,230 L1440,230 L1440,280 Z" />
          <circle cx="1090" cy="90" r="46" fill="#FFCD00" opacity="0.3" />
        </svg>
      </div>

      <div className="max-w-[1560px] mx-auto space-y-12 relative z-10">

        {/* ── 01. TOP SECTION HEADER ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2 border-b border-slate-200/80">
          <div className="space-y-1">
            <span className="text-xs sm:text-sm font-mono-code font-bold tracking-[0.25em] text-[#006AA7] uppercase block">
              VÄSTERÅS
            </span>
            <h2
              className="font-headline font-black uppercase tracking-tight text-[#0A1930] leading-[0.95]"
              style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.6rem)' }}
            >
              FUTURE INNOVATORS <span className="text-[#006AA7]">2026</span>
            </h2>
            <p className="text-sm sm:text-base font-bold text-slate-700 uppercase tracking-wider pt-1">
              TWO PATHWAYS. ONE BRIGHTER TOMORROW.
            </p>
          </div>

          {/* Center/Right handwritten motto + badge */}
          <div className="flex flex-col sm:flex-row lg:items-end gap-6 sm:gap-12">
            <div className="relative">
              <span className="font-handwriting text-2xl sm:text-3xl text-[#006AA7] italic tracking-wide block">
                Learn · Build · Innovate · Compete
              </span>
              <svg className="w-48 h-3 text-[#FFCD00] -mt-1" viewBox="0 0 200 12" fill="none">
                <path d="M2 9C60 2 140 2 198 9" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </div>

            <div className="text-left lg:text-right">
              <span className="text-[11px] font-mono-code font-bold tracking-widest text-slate-400 uppercase block">
                REAL IDEAS.
              </span>
              <span className="text-xs font-mono-code font-extrabold tracking-widest text-[#006AA7] uppercase block">
                BRIGHTER TOMORROWS.
              </span>
              <div className="w-10 h-0.5 bg-[#006AA7] ml-0 lg:ml-auto mt-1" />
            </div>
          </div>
        </div>

        {/* ── 02. TWO PRIMARY EVENT PATHWAY CARDS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

          {/* ════════════════════════════════════════════════════════════════
              CARD 01: ROBOKIDOVATION (BLUE THEME)
             ════════════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white border-2 border-[#006AA7] shadow-xl overflow-hidden flex flex-col justify-between hover:shadow-2xl transition-all duration-300"
          >
            {/* Blue Card Top Header Banner */}
            <div className="bg-[#006AA7] text-white p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/15 border border-white/25 flex items-center justify-center text-white shrink-0 shadow-inner">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-headline font-black text-2xl sm:text-3xl text-white tracking-tight leading-none">
                    RoboKidovation
                  </h3>
                  <p className="text-[11px] sm:text-xs font-mono-code font-bold uppercase tracking-[0.2em] text-sky-200 mt-1">
                    LEARN. TEST. IMPROVE. COMPETE.
                  </p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-sky-100 font-light max-w-xs md:text-right border-t md:border-t-0 border-white/15 pt-2 md:pt-0">
                <p>Hands-on robotics challenge for school teams.</p>
                <p className="text-white/80">No previous experience needed.</p>
              </div>
            </div>

            {/* Blue Card 6 Step Flow: NO IMAGES, ICONS ONLY, NO ARROWS */}
            <div className="p-5 sm:p-7 space-y-6 flex-1 flex flex-col justify-between">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5">
                {roboSteps.map((step) => {
                  const StepIcon = step.icon;
                  return (
                    <div
                      key={step.num}
                      className="bg-[#F6FAFD] border border-sky-100 p-3.5 flex flex-col justify-between items-center text-center space-y-3 hover:bg-sky-50/70 hover:border-sky-300 transition-all duration-200 shadow-2xs group"
                    >
                      {/* Step Number */}
                      <div className="w-7 h-7 bg-[#006AA7] text-white flex items-center justify-center font-headline font-bold text-xs shadow-xs group-hover:scale-110 transition-transform">
                        {step.num}
                      </div>

                      {/* Step Icon (Pure Vector Icon, NO Images) */}
                      <div className="w-12 h-12 bg-sky-100/70 text-[#006AA7] flex items-center justify-center group-hover:bg-[#006AA7] group-hover:text-white transition-colors duration-200">
                        <StepIcon className="w-6 h-6" />
                      </div>

                      {/* Step Title & Subtitle */}
                      <div className="space-y-1 min-h-[52px] flex flex-col justify-center">
                        <h4 className="font-headline font-bold text-xs sm:text-sm text-[#0A1930] leading-tight">
                          {step.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-normal leading-tight">
                          {step.subtitle}
                        </p>
                      </div>

                      {/* Step Date Pill */}
                      <div
                        className={`w-full py-1.5 px-2 text-[10px] sm:text-[11px] font-mono-code font-bold tracking-tight text-center ${
                          step.highlight
                            ? 'bg-[#006AA7] text-white shadow-xs'
                            : 'bg-sky-100/80 text-[#006AA7]'
                        }`}
                      >
                        {step.date}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Blue Card Bottom Target Callout */}
              <div className="bg-[#F0F7FD] border border-[#BAE6FD] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#006AA7]/10 flex items-center justify-center text-[#006AA7] shrink-0">
                    <Target className="w-5 h-5" />
                  </div>
                  <p className="text-xs sm:text-sm text-[#0A1930] leading-snug font-medium">
                    From school workshops and internal competitions, we select <span className="font-bold text-[#006AA7]">4 teams</span> to represent each school at the Västerås RoboKidovation Final on <span className="font-bold text-[#006AA7]">4 December 2026</span>.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => onNavigate('challenges')}
                    className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-sky-50 text-[#006AA7] border border-[#006AA7]/30 text-xs font-bold font-syne uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <span>EXPLORE TRACK</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ════════════════════════════════════════════════════════════════
              CARD 02: YOUNG INNOVATORS HACKATHON (GREEN THEME)
             ════════════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-white border-2 border-[#059669] shadow-xl overflow-hidden flex flex-col justify-between hover:shadow-2xl transition-all duration-300"
          >
            {/* Green Card Top Header Banner */}
            <div className="bg-[#059669] text-white p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/15 border border-white/25 flex items-center justify-center text-white shrink-0 shadow-inner">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-headline font-black text-2xl sm:text-3xl text-white tracking-tight leading-none">
                    Young Innovators Hackathon
                  </h3>
                  <p className="text-[11px] sm:text-xs font-mono-code font-bold uppercase tracking-[0.2em] text-emerald-200 mt-1">
                    IDEAS TODAY. A BRIGHTER TOMORROW.
                  </p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-emerald-100 font-light max-w-xs md:text-right border-t md:border-t-0 border-white/15 pt-2 md:pt-0">
                <p>A one-day innovation challenge solving real-world problems.</p>
                <p className="text-white/80">Develop a concept and pitch to the jury.</p>
              </div>
            </div>

            {/* Green Card 6 Step Flow: NO IMAGES, ICONS ONLY, NO ARROWS */}
            <div className="p-5 sm:p-7 space-y-6 flex-1 flex flex-col justify-between">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5">
                {hackathonSteps.map((step) => {
                  const StepIcon = step.icon;
                  return (
                    <div
                      key={step.num}
                      className="bg-[#F4FAF6] border border-emerald-100 p-3.5 flex flex-col justify-between items-center text-center space-y-3 hover:bg-emerald-50/70 hover:border-emerald-300 transition-all duration-200 shadow-2xs group"
                    >
                      {/* Step Number */}
                      <div className="w-7 h-7 bg-[#059669] text-white flex items-center justify-center font-headline font-bold text-xs shadow-xs group-hover:scale-110 transition-transform">
                        {step.num}
                      </div>

                      {/* Step Icon (Pure Vector Icon, NO Images) */}
                      <div className="w-12 h-12 bg-emerald-100/70 text-[#059669] flex items-center justify-center group-hover:bg-[#059669] group-hover:text-white transition-colors duration-200">
                        <StepIcon className="w-6 h-6" />
                      </div>

                      {/* Step Title & Subtitle */}
                      <div className="space-y-1 min-h-[52px] flex flex-col justify-center">
                        <h4 className="font-headline font-bold text-xs sm:text-sm text-[#0A1930] leading-tight">
                          {step.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-normal leading-tight">
                          {step.subtitle}
                        </p>
                      </div>

                      {/* Step Date Pill */}
                      <div
                        className={`w-full py-1.5 px-2 text-[10px] sm:text-[11px] font-mono-code font-bold tracking-tight text-center ${
                          step.highlight
                            ? 'bg-[#059669] text-white shadow-xs'
                            : 'bg-emerald-100/80 text-[#059669]'
                        }`}
                      >
                        {step.date}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Green Card Bottom Target Callout */}
              <div className="bg-[#F0FDF4] border border-[#BBF7D0] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#059669]/10 flex items-center justify-center text-[#059669] shrink-0">
                    <Target className="w-5 h-5" />
                  </div>
                  <p className="text-xs sm:text-sm text-[#0A1930] leading-snug font-medium">
                    Students work on real-world challenges around science, technology, sustainability and innovation. The final presentations take place on <span className="font-bold text-[#059669]">5 December 2026</span>.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => onNavigate('workflow')}
                    className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-emerald-50 text-[#059669] border border-[#059669]/30 text-xs font-bold font-syne uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <span>EXPLORE TRACK</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* ── 03. THREE PILLARS (FOR STUDENTS, FOR SCHOOLS, FOR SOCIETY) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 pb-2">
          {/* Pillar 1 */}
          <div className="flex items-center gap-4 p-5 bg-white border border-slate-200/90 shadow-xs">
            <div className="w-12 h-12 bg-[#006AA7]/10 flex items-center justify-center text-[#006AA7] shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-headline font-bold text-xs sm:text-sm text-[#0A1930] uppercase tracking-wider">
                FOR STUDENTS
              </h5>
              <p className="text-xs text-slate-600 font-light mt-0.5 leading-relaxed">
                Hands-on learning, teamwork and real-world experience.
              </p>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="flex items-center gap-4 p-5 bg-white border border-slate-200/90 shadow-xs">
            <div className="w-12 h-12 bg-[#006AA7]/10 flex items-center justify-center text-[#006AA7] shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-headline font-bold text-xs sm:text-sm text-[#0A1930] uppercase tracking-wider">
                FOR SCHOOLS
              </h5>
              <p className="text-xs text-slate-600 font-light mt-0.5 leading-relaxed">
                Inspire students and develop future skills (Lgr22).
              </p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="flex items-center gap-4 p-5 bg-white border border-slate-200/90 shadow-xs">
            <div className="w-12 h-12 bg-[#006AA7]/10 flex items-center justify-center text-[#006AA7] shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-headline font-bold text-xs sm:text-sm text-[#0A1930] uppercase tracking-wider">
                FOR SOCIETY
              </h5>
              <p className="text-xs text-slate-600 font-light mt-0.5 leading-relaxed">
                A stronger link between education, innovation and working life.
              </p>
            </div>
          </div>
        </div>

        {/* ── 04. REGISTER CTA BAR (SECTION 3 CONVERSION ANCHOR) ── */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#0A1930] via-[#006AA7] to-[#0A1930] text-white flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center lg:text-left">
            <span className="text-[11px] font-mono-code font-bold tracking-[0.25em] text-[#FFCD00] uppercase block">
              REGISTRATION OPEN FOR VÄSTERÅS SCHOOLS
            </span>
            <h3 className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight">
              Ready to bring your school into the 2026 Championship?
            </h3>
            <p className="text-xs sm:text-sm text-white/80 font-light max-w-xl">
              Choose RoboKidovation, Young Innovators Hackathon, or register teams across both tracks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto shrink-0">
            {onOpenRegister && (
              <button
                onClick={onOpenRegister}
                className="w-full sm:w-auto px-8 py-4 bg-[#FFCD00] hover:bg-[#E6B800] text-[#0A1930] font-syne font-black text-xs sm:text-sm tracking-wider uppercase transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2.5 active:scale-95"
              >
                <span>REGISTER SCHOOL / TEAM</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ── 05. FOOTER SUB-STRIP ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs font-mono-code text-slate-400 border-t border-slate-200">
          <span>// VÄSTERÅS FUTURE INNOVATORS 2026</span>

          <div className="relative">
            <span className="font-handwriting text-lg sm:text-xl text-[#0A1930]">
              Students Today. A Brighter Tomorrow.
            </span>
            <div className="w-full h-0.5 bg-[#FFCD00] -mt-0.5" />
          </div>

          <span className="font-bold text-[#006AA7] tracking-wider">
            VÄSTERÅS | 4–5 DECEMBER 2026
          </span>
        </div>

      </div>
    </section>
  );
};
