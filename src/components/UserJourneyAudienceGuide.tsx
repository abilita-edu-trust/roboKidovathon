import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Users,
  School,
  ArrowRight,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import type { IntakeProgramTab } from '../pages/IntakeRegisterPage';
import { useSite } from '../context/SiteContext';

const DATE_DOTS = ['bg-[#FFCD00]', 'bg-[#006AA7]', 'bg-emerald-400', 'bg-sky-300'];


interface UserJourneyAudienceGuideProps {
  onNavigate: (route: string, tab?: IntakeProgramTab) => void;
  onOpenRegister: (tab?: IntakeProgramTab) => void;
}

type AudienceType = 'students' | 'parents' | 'teachers';

export const UserJourneyAudienceGuide: React.FC<UserJourneyAudienceGuideProps> = ({
  onNavigate,
  onOpenRegister,
}) => {
  const [activeAudience, setActiveAudience] = useState<AudienceType>('students');
  const { journey, intake } = useSite();
  // Sites without RoboKidovation dates (e.g. the RoboHack-only vxo) don't show the guide.
  if (!journey) return null;
  const hasHackathon = !intake.tabs || intake.tabs.includes('hackathon');

  const audiences = [
    {
      id: 'students' as const,
      label: 'For Students',
      icon: GraduationCap,
      tagline: 'Invent, Build Robots & Compete',
      summary:
        'Join hands-on robotics, program autonomous rovers, or submit your bold ideas for the future.',
      eligibility: 'Grades 1–9 & Gymnasium (Individuals, School Teams & Independent Squads)',
      ctaLabel: 'Register a Student or Team',
      ctaTab: 'workshop' as IntakeProgramTab,
      altCtaLabel: 'Submit Your Innovation Idea',
      altCtaTab: 'submit-idea' as IntakeProgramTab,
      steps: [
        {
          num: 1,
          title: 'Discover the Competition',
          desc: hasHackathon
            ? 'Explore Robo-Sprint, Robo-Precision, and the Young Inno Hack innovation arena.'
            : 'Explore the Robo-Sprint and Robo-Precision challenges and pick your category.',
          badge: 'Explore Tracks',
        },
        {
          num: 2,
          title: 'Check Your Category',
          desc: 'Junior (Grades 3–6), Senior (Grades 7–9), Gymnasium, or Grades 1–2 participant session.',
          badge: 'Eligibility',
        },
        {
          num: 3,
          title: 'Register Online',
          desc: 'Sign up as a team or submit an idea with voice notes, sketches, or video pitches.',
          badge: 'Online Intake',
        },
        {
          num: 4,
          title: 'Hands-On Build & Practice',
          desc: 'Assemble official hardware kits and practice on regulation 244 × 122 cm arena mats.',
          badge: 'Preparation',
        },
        {
          num: 5,
          title: journey.studentsExtra ? 'Grand Finals & Elevation' : 'Compete in the Final',
          desc: `Compete in the Final ${journey.finals}.${journey.studentsExtra ? ` ${journey.studentsExtra}` : ''}`,
          badge: 'Arena Showdown',
        },
      ],
    },
    {
      id: 'parents' as const,
      label: 'For Parents',
      icon: Users,
      tagline: 'Empower Practical STEM Skills',
      summary:
        'Give your child real-world engineering, teamwork, and problem-solving experience with official mentors.',
      eligibility: 'All students aged 7–19. Independent family & neighbourhood teams welcome.',
      ctaLabel: 'Register Your Child / Team',
      ctaTab: 'workshop' as IntakeProgramTab,
      altCtaLabel: 'Submit an Idea',
      altCtaTab: 'submit-idea' as IntakeProgramTab,
      steps: [
        {
          num: 1,
          title: 'Discover the Programme',
          desc: 'Structured 20-hour STEM robotics curriculum and open innovation challenges.',
          badge: 'Hands-On STEM',
        },
        {
          num: 2,
          title: 'Understand Requirements',
          desc: 'No prior robotics experience needed. All kits, tools, and training materials are supplied.',
          badge: 'Zero Barrier',
        },
        {
          num: 3,
          title: 'Register Easily',
          desc: 'Complete the quick registration form and receive an official confirmation token.',
          badge: 'Instant Token',
        },
        {
          num: 4,
          title: 'Guided Mentorship',
          desc: 'Children learn mechanics, motors, sensors, and coding in supportive, friendly sessions.',
          badge: 'Mentorship',
        },
        {
          num: 5,
          title: 'Finals Day Celebration',
          desc: `Attend the Final ${journey.finals} and celebrate student achievements.`,
          badge: 'Family Friendly',
        },
      ],
    },
    {
      id: 'teachers' as const,
      label: 'For Teachers & Schools',
      icon: School,
      tagline: 'Bring STEM & Robotics to Your Class',
      summary:
        'Lgr22 curriculum-aligned robotics demos and 20-hour STEM workshops delivered straight to your school.',
      eligibility: 'Primary, Middle, and Secondary schools, and educational associations across Sweden.',
      ctaLabel: 'Book School Demo or Workshop',
      ctaTab: 'demo' as IntakeProgramTab,
      altCtaLabel: 'Register Association / Class',
      altCtaTab: 'association' as IntakeProgramTab,
      steps: [
        {
          num: 1,
          title: 'Discover School Pathways',
          desc: 'Auditorium demos, hands-on classroom workshops, and in-school qualifiers.',
          badge: 'Lgr22 Aligned',
        },
        {
          num: 2,
          title: 'Review Curriculum Fit',
          desc: 'Integrates with Technology and Physics syllabus requirements without altering lesson plans.',
          badge: 'Turnkey Solution',
        },
        {
          num: 3,
          title: 'Request a Session',
          desc: 'Pick your preferred school dates and schedule a coordinator call.',
          badge: 'Flexible Dates',
        },
        {
          num: 4,
          title: 'Equipment & Delivery',
          desc: 'Kits, mats, and certified instructors arrive at your school. Zero school budget required.',
          badge: 'All Provided',
        },
        {
          num: 5,
          title: 'Represent Your School',
          desc: `Up to 4 teams per school or association qualify for the Final ${journey.finals}.`,
          badge: 'School Glory',
        },
      ],
    },
  ];

  const current = audiences.find((a) => a.id === activeAudience) || audiences[0];

  return (
    <section className="w-full bg-white text-[#0A1930] py-14 sm:py-20 px-4 sm:px-6 lg:px-10 border-t border-slate-200 select-none">
      <div className="max-w-[1560px] mx-auto space-y-10">

        {/* ── SECTION HEADER ── */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 border border-[#006AA7]/20 text-[#006AA7] text-xs font-mono-code font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#FFCD00]" />
            <span>NAVIGATE YOUR COMPETITION JOURNEY</span>
          </div>

          <h2 className="font-headline font-black text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-[#0A1930]">
            Designed for Students, Parents &amp; Teachers
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
            Whether you want to build robots, enroll your child, or bring hands-on STEM into your classroom, follow these clear visual steps to get started immediately.
          </p>
        </div>

        {/* ── AUDIENCE TAB SELECTOR ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-2xl mx-auto">
          {audiences.map((aud) => {
            const Icon = aud.icon;
            const active = activeAudience === aud.id;
            return (
              <button
                key={aud.id}
                type="button"
                onClick={() => setActiveAudience(aud.id)}
                className={`w-full sm:w-1/3 py-3.5 px-4 flex items-center justify-center gap-2.5 font-headline font-black text-xs uppercase tracking-wider border-2 transition-all ${
                  active
                    ? 'bg-[#006AA7] text-white border-[#006AA7] shadow-md ring-2 ring-[#006AA7]/25'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#FFCD00]' : 'text-slate-500'}`} />
                <span>{aud.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── AUDIENCE DETAILS & 5 VISUAL STEPS ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="space-y-8"
          >
            {/* Context Card */}
            <div className="bg-[#F8FAFC] border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1.5 max-w-2xl">
                <div className="text-[11px] font-mono-code font-bold text-[#006AA7] uppercase tracking-wider flex items-center gap-2">
                  <span>{current.tagline}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-500">{current.eligibility}</span>
                </div>
                <h3 className="font-headline font-black text-xl sm:text-2xl uppercase tracking-tight text-[#0A1930]">
                  {current.summary}
                </h3>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => onOpenRegister(current.ctaTab)}
                  className="px-6 py-3.5 bg-[#FFCD00] hover:bg-[#E6B800] text-[#0A1930] font-headline font-black text-xs uppercase tracking-wider shadow-sm transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>{current.ctaLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onOpenRegister(current.altCtaTab)}
                  className="px-5 py-3.5 bg-white hover:bg-slate-50 text-[#006AA7] border border-slate-300 font-headline font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>{current.altCtaLabel}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate(journey.rulesTarget ?? 'challenges')}
                  className="px-4 py-3.5 bg-transparent hover:bg-slate-100 text-slate-600 font-headline font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1"
                >
                  <span>Rules</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 5 Clear Visual Steps */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {current.steps.map((st) => (
                <div
                  key={st.num}
                  className="bg-white border-2 border-slate-200 hover:border-[#006AA7] p-5 flex flex-col justify-between transition-all group relative shadow-xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="w-7 h-7 rounded-full bg-[#0A1930] text-[#FFCD00] font-headline font-black text-xs flex items-center justify-center">
                        {st.num}
                      </span>
                      <span className="text-[10px] font-mono-code font-bold text-slate-400 group-hover:text-[#006AA7] uppercase tracking-wider">
                        {st.badge}
                      </span>
                    </div>

                    <h4 className="font-headline font-black text-sm uppercase tracking-tight text-[#0A1930] pt-1">
                      {st.title}
                    </h4>

                    <p className="text-xs text-slate-600 font-light leading-relaxed">
                      {st.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center text-[11px] font-mono-code text-slate-400 group-hover:text-[#006AA7]">
                    <span>Step {st.num} of 5</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>

            {/* Confirmed dates highlight ribbon */}
            <div className="bg-[#0A1930] text-white p-5 sm:p-6 flex flex-col lg:flex-row items-center justify-between gap-4 border border-[#0A1930]">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-8 text-xs font-mono-code">
                {journey.dates.map((d, i) => (
                  <div key={d.label} className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${DATE_DOTS[i % DATE_DOTS.length]}`} />
                    <span className="text-slate-400 uppercase">{d.label}:</span>
                    <span className="text-white font-bold">{d.value}</span>
                  </div>
                ))}
              </div>

              {journey.note && (
                <div className="text-[11px] font-mono-code text-slate-400 text-center lg:text-right shrink-0">{journey.note}</div>
              )}
            </div>

          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};
