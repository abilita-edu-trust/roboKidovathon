import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Download, ArrowRight, ArrowLeft, ChevronDown, HelpCircle, Sparkles, BookOpen, Cpu, Users } from 'lucide-react';

const WHY_ICONS = [Sparkles, Cpu, Users, BookOpen];

const WHY_SCHOOLS_PARTICIPATE = [
  {
    title: 'Zero Procurement Overhead',
    desc: 'All hardware, arena mats, and kits are brought to your school — no lab budget or capital expenditure needed.',
    detail: 'Schools receive complete Robo-Sprint kits including gearmotors, wired transmitters, chassis beams, axles, and the official 244 × 122 cm roll-out arena mat.',
  },
  {
    title: 'Lgr22 Curriculum Fit',
    desc: 'Directly aligned to Swedish curriculum goals within Teknik, Matematik, and NO/Fysik.',
    detail: 'Students apply iterative engineering loops (prototype, test, measure, optimize) and produce documented portfolios teachers can evaluate in ordinary coursework.',
  },
  {
    title: 'Accessible Team Learning',
    desc: 'Students work in pairs to build, test, and compete — building collaborative problem-solving skills.',
    detail: 'No prior robotics or coding background required to start. Step-by-step guidance builds foundational mechanical confidence before competition heats begin.',
  },
  {
    title: 'School-to-City Pathway',
    desc: 'School qualifiers feed directly into the Västerås City Final on December 4 & 5, 2026.',
    detail: 'Winning Explorer (Grades 3–6) and Advanced (Grades 7–9) teams represent their school in a high-stakes municipal showdown with SEK 3,000 in prizes and certificates.',
  },
];

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Logistics & Equipment',
    question: 'How does equipment and kit delivery work for our school?',
    answer: 'Our team delivers all kits, arena mats, tools, and mentor materials directly to your school ahead of the workshop dates. Kits are low-voltage (6V DC) and safe for ordinary classrooms.',
  },
  {
    id: 'faq-2',
    category: 'Eligibility & Grades',
    question: 'Which grades can participate in Västerås Future Innovators 2026?',
    answer: 'Robo-Sprint Explorer is designed for Grades 3–6 (Grundskola). Robo-Sprint Advanced is for Grades 7–9. The Robo-Precision autonomous challenge is structured for Gymnasium and upper-level students.',
  },
  {
    id: 'faq-3',
    category: 'Classroom Time & Timetables',
    question: 'How much time commitment is required from teachers?',
    answer: 'The programme is structured as a 20-hour project (typically ten 2-hour sessions), or a lighter 10–12 hour format. Sessions can be integrated into regular science/tech classes or run during project weeks.',
  },
  {
    id: 'faq-4',
    category: 'Curriculum & Assessment',
    question: 'Does participation generate assessment evidence under Lgr22?',
    answer: 'Yes. Students produce design sketches, measurement logs, engineering reflections, and a final competition presentation that teachers can incorporate directly into subject assessments.',
  },
  {
    id: 'faq-5',
    category: 'Data Privacy & Safety',
    question: 'How is student safety and data privacy handled?',
    answer: 'All electronics operate on safe 6V low-voltage battery packs with zero high-temperature or soldering tools. All student and school data is handled in strict compliance with Swedish GDPR standards.',
  },
];

interface ForSchoolsPageProps {
  onNavigateHome: () => void;
  onOpenRegister: () => void;
  onOpenDeckModal: () => void;
}

export const ForSchoolsPage: React.FC<ForSchoolsPageProps> = ({
  onNavigateHome,
  onOpenRegister,
  onOpenDeckModal,
}) => {
  const [openReason, setOpenReason] = useState<string | null>(null);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const ONBOARDING_STEPS = [
    {
      num: '01',
      title: 'BOOK A SCHOOL MEETING',
      desc: 'Connect with our team to discuss cohort size, schedule fit, and curriculum goals for your school district.',
    },
    {
      num: '02',
      title: 'RECEIVE KITS & BRIEFING',
      desc: 'All official Robo-Sprint hardware kits, arena mats, and teacher briefing notes are delivered directly to your classroom.',
    },
    {
      num: '03',
      title: 'RUN PROJECT & QUALIFY',
      desc: 'Students complete the 10-session project, run in-school qualifiers in October, and top teams advance to the December 4 & 5 Final.',
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
            REKTORER &amp; LÄRARE // VÄSTERÅS 2026
          </span>

          <h1
            className="font-headline font-black uppercase tracking-tight leading-[1.02]"
            style={{ fontSize: 'clamp(3.2rem, 7.5vw, 6.5rem)' }}
          >
            <span className="text-stroke block">FOR</span>
            <span className="text-[#0A1930] block">SCHOOLS</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 font-light max-w-2xl leading-relaxed">
            A turnkey robotics education model created to eliminate procurement overhead, supply all physical hardware, and seamlessly integrate into Swedish curriculum goals.
          </p>

          <div className="pt-6 flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenRegister}
              className="btn-pill-lime text-xs font-black py-3.5 px-7 shadow-md flex items-center gap-2"
            >
              <span>BOOK A SCHOOL MEETING</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenDeckModal}
              className="btn-pill-outline text-xs font-bold py-3.5 px-6 flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>REQUEST PROGRAMME DETAILS (PDF)</span>
            </button>
          </div>
        </motion.div>

        {/* ── 3-STEP ONBOARDING PROCESS ── */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-[10px] font-mono-code font-bold tracking-[0.2em] text-[#006AA7] uppercase block">
              HOW SCHOOL REGISTRATION WORKS
            </span>
            <h2 className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#0A1930] mt-1">
              Simple 3-Step School Onboarding
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ONBOARDING_STEPS.map((step) => (
              <div
                key={step.num}
                className="p-8 bg-[#F8FAFC] border border-slate-200 space-y-3 shadow-sm"
              >
                <span className="font-headline font-black text-4xl text-[#006AA7] block">
                  {step.num}
                </span>
                <h3 className="font-headline font-bold text-lg uppercase tracking-wide text-[#0A1930]">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── WHY SCHOOLS PARTICIPATE ── */}
        <div className="space-y-6">
          <h2 className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#0A1930]">
            Educational Value for Schools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
            {WHY_SCHOOLS_PARTICIPATE.map((reason, idx) => {
              const Icon = WHY_ICONS[idx] ?? Sparkles;
              const isOpen = openReason === reason.title;
              return (
                <motion.button
                  key={reason.title}
                  type="button"
                  onClick={() => setOpenReason(isOpen ? null : reason.title)}
                  aria-expanded={isOpen}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className={`text-left w-full p-6 bg-[#F8FAFC] border space-y-3 transition-colors ${
                    isOpen ? 'border-[#006AA7]/40 shadow-sm' : 'border-slate-200 hover:border-[#006AA7]/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 bg-[#006AA7]/10 border border-[#006AA7]/20 flex items-center justify-center text-[#006AA7]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    </motion.div>
                  </div>
                  <h3 className="font-headline font-bold text-sm uppercase tracking-wide text-[#0A1930]">
                    {reason.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    {reason.desc}
                  </p>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="text-[11px] text-slate-500 font-light leading-relaxed pt-2 border-t border-slate-200">
                          {reason.detail}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── WHAT THE SCHOOL NEEDS ── */}
        <div className="p-8 sm:p-12 bg-[#F8FAFC] border border-slate-200 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-[10px] font-mono-code font-bold text-[#006AA7] uppercase tracking-wider block">
              REQUIREMENTS CHECKLIST
            </span>
            <h2 className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#0A1930] mt-1">
              What Does Your School Need?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs sm:text-sm">
            <div className="space-y-1.5">
              <span className="font-mono-code font-bold text-[#006AA7] uppercase block">01. CLASSROOM SPACE</span>
              <p className="text-slate-600 font-light leading-relaxed">
                Standard classroom or common room with enough table/floor space for a 244 × 122 cm arena mat.
              </p>
            </div>
            <div className="space-y-1.5">
              <span className="font-mono-code font-bold text-[#006AA7] uppercase block">02. TIME COMMITMENT</span>
              <p className="text-slate-600 font-light leading-relaxed">
                Ten 2-hour sessions (20h total) or an accelerated 10–12h workshop for younger student groups.
              </p>
            </div>
            <div className="space-y-1.5">
              <span className="font-mono-code font-bold text-[#006AA7] uppercase block">03. TEACHER ROLE</span>
              <p className="text-slate-600 font-light leading-relaxed">
                Coordinating dates with INIAC mentors and guiding student teams during ordinary school hours.
              </p>
            </div>
            <div className="space-y-1.5">
              <span className="font-mono-code font-bold text-[#006AA7] uppercase block">04. HARDWARE &amp; TOOLS</span>
              <p className="text-slate-600 font-light leading-relaxed">
                None. All kits, screwdrivers, batteries, arena mats, and replacement parts are supplied.
              </p>
            </div>
          </div>
        </div>

        {/* ── SAFETY & PRIVACY COMPLIANCE ── */}
        <div className="p-8 bg-[#F8FAFC] border border-slate-200 space-y-4">
          <div className="flex items-center gap-3 text-[#006AA7]">
            <ShieldCheck className="w-6 h-6" />
            <h3 className="font-headline font-bold text-xl uppercase tracking-wider text-[#0A1930]">
              Safety, Low Voltage &amp; Swedish School Compliance
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
            <p>
              All robot hardware operates strictly on safe 6V DC low-voltage battery packs. No mains electricity, high temperatures, or soldering are used during student workshops.
            </p>
            <p>
              Student data is handled with full respect for Swedish GDPR and student privacy guidelines. No sensitive personal or academic records are collected.
            </p>
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#0A1930]">
              Frequently Asked Questions from Principals &amp; Teachers
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item: FAQItem) => {
              const isOpen = openFaqId === item.id;
              return (
                <div
                  key={item.id}
                  className={`border bg-[#F8FAFC] overflow-hidden transition-colors ${
                    isOpen ? 'border-[#006AA7]/40 shadow-sm' : 'border-slate-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? null : item.id)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-slate-100/60 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-4 h-4 text-[#006AA7] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[9px] font-mono-code font-bold tracking-widest text-[#006AA7] uppercase block mb-1">
                          {item.category}
                        </span>
                        <span className="font-headline font-bold text-sm sm:text-base text-[#0A1930]">
                          {item.question}
                        </span>
                      </div>
                    </div>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 pl-12 text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── ENROL COHORT ACTION BANNER ── */}
        <div className="p-8 sm:p-12 bg-[#FFCD00] text-[#0A1930] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-md">
          <div className="lg:col-span-8 space-y-2">
            <span className="text-[10px] font-mono-code font-bold uppercase tracking-widest text-[#0A1930] block">
              RESERVE WORKSHOP DATES FOR AUTUMN 2026
            </span>
            <h3 className="font-headline font-black text-3xl sm:text-4xl uppercase">
              REGISTER YOUR SCHOOL COHORT
            </h3>
            <p className="text-xs sm:text-sm text-[#0A1930]/80 font-medium max-w-lg">
              Intake for schools in Västerås is open for the 2026 season ahead of the October in-school qualifiers and December 4 & 5 City Final.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
            <button
              onClick={onOpenRegister}
              className="btn-pill-white text-xs font-bold py-3.5 px-6 shadow-md"
            >
              <span>BOOK A SCHOOL MEETING</span>
            </button>

            <button
              onClick={onOpenDeckModal}
              className="px-6 py-3.5 border border-black/30 hover:border-black text-xs font-mono-code text-[#0A1930] uppercase tracking-wider transition-colors flex items-center justify-center gap-2 font-bold"
            >
              <Download className="w-4 h-4" />
              <span>REQUEST PROGRAMME DETAILS</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
