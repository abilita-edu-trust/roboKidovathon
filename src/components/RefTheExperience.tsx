import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Bot,
  Lightbulb,
  Target,
  Users,
  Trophy,
  Presentation,
  Cpu,
  Compass,
  Search,
  Rocket,
  UserPlus,
  MapPin,
} from 'lucide-react';
import { FutureInnovatorsBanner } from './FutureInnovatorsBanner';

const VENUES: { label: string; name: string; detail?: string; image?: string; track: 'robo' | 'hack' }[] = [
  {
    label: 'Competition Finals Venue',
    name: 'IES Eskilstuna',
    detail: 'Internationella Engelska Skolan Eskilstuna · 2 December 2026',
    image: '/venue.png',
    track: 'robo',
  },
  {
    label: 'Next Stage (International)',
    name: 'Global Finals Stage',
    detail: 'April 2027 · Possibility of flight tickets for top 1–2 teams (subject to official rules & confirmation)',
    track: 'hack',
  },
];

interface RefTheExperienceProps {
  onNavigate: (route: string) => void;
  onOpenRegister?: () => void;
}

export const RefTheExperience: React.FC<RefTheExperienceProps> = ({
  onNavigate,
  onOpenRegister,
}) => {
  // Step definitions for RoboKidovation (Blue) — matches confirmed schedule
  const roboSteps = [
    {
      num: 1,
      title: 'Registration Opens',
      subtitle: 'Portal opens for schools, associations & independent teams',
      date: '12 October 2026',
      icon: Presentation,
      highlight: false,
    },
    {
      num: 2,
      title: 'School Demo',
      subtitle: 'Live robotics assembly, sensor trials & interactive challenges',
      date: '16 October 2026',
      icon: Cpu,
      highlight: false,
    },
    {
      num: 3,
      title: 'Hands-On Workshops',
      subtitle: '20-hour STEM project & team robot engineering',
      date: 'October – November 2026',
      icon: Users,
      highlight: false,
    },
    {
      num: 4,
      title: 'Competition Finals',
      subtitle: 'Official arena tournament at IES Eskilstuna',
      date: '2 December 2026',
      icon: Trophy,
      highlight: true,
    },
    {
      num: 5,
      title: 'International Opportunity',
      subtitle: 'Possibility of flight tickets for 1–2 teams to compete internationally*',
      date: 'April 2027',
      icon: Rocket,
      highlight: true,
    },
  ];

  // Step definitions for Young Inno Hack (Green) — matches official timeline
  const hackathonSteps = [
    {
      num: 1,
      title: 'Registration & Listen',
      subtitle: 'Registration opens; collect challenges and vision ideas',
      date: '12 October 2026',
      icon: Compass,
      highlight: false,
    },
    {
      num: 2,
      title: 'School Demo & Problem Selection',
      subtitle: 'Identify key community and sustainability challenges',
      date: '16 October 2026',
      icon: Search,
      highlight: false,
    },
    {
      num: 3,
      title: 'Team Formation & Mentorship',
      subtitle: 'Connect student squads with industry and academic mentors',
      date: 'Late October – November 2026',
      icon: UserPlus,
      highlight: false,
    },
    {
      num: 4,
      title: 'Grand Finals Showcase',
      subtitle: 'Live prototype demonstrations & jury pitch at IES Eskilstuna',
      date: '2 December 2026',
      icon: Trophy,
      highlight: true,
    },
    {
      num: 5,
      title: 'International Elevation',
      subtitle: 'Opportunity to advance to the April 2027 international stage*',
      date: 'April 2027',
      icon: Rocket,
      highlight: true,
    },
  ];

  return (
    <section
      id="choose-experience"
      className="w-full bg-gradient-to-b from-[#F2F8FD] via-[#F8FBFE] to-white text-[#0A1930] py-16 sm:py-24 px-4 sm:px-6 lg:px-10 select-none relative overflow-hidden border-t border-slate-200"
    >
      <div className="max-w-[1560px] mx-auto space-y-12 relative z-10">

        {/* ── 01. CITY BANNER: "<City> Future Innovators 2026" over the city skyline ── */}
        <FutureInnovatorsBanner />

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
            <div className="bg-[#006AA7] text-white p-6 sm:p-7 flex flex-col items-start gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/15 border border-white/25 flex items-center justify-center text-white shrink-0 shadow-inner">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-headline font-black text-2xl sm:text-3xl text-white tracking-tight leading-none whitespace-nowrap">
                    RoboKidovation
                  </h3>
                  <p className="text-[11px] sm:text-xs font-mono-code font-bold uppercase tracking-[0.2em] text-sky-200 mt-1">
                    LEARN. TEST. IMPROVE. COMPETE.
                  </p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-sky-100 font-light w-full border-t border-white/15 pt-3">
                <p>Hands-on robotics challenge for teams from schools and associations.</p>
                <p className="text-white/80">No previous experience needed.</p>
                <p className="text-white/80">Junior: grades 3–6 · Senior: grades 7–9 · GYM: programmable bot.</p>
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
                    From school workshops and internal competitions, up to <span className="font-bold text-[#006AA7]">4 teams</span> from each participating school or association qualify for the Västerås RoboKidovation Final on <span className="font-bold text-[#006AA7]">5 December 2026</span>.
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
              CARD 02: YOUNG INNO HACK (GREEN THEME)
             ════════════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-white border-2 border-[#059669] shadow-xl overflow-hidden flex flex-col justify-between hover:shadow-2xl transition-all duration-300"
          >
            {/* Green Card Top Header Banner */}
            <div className="bg-[#059669] text-white p-6 sm:p-7 flex flex-col items-start gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/15 border border-white/25 flex items-center justify-center text-white shrink-0 shadow-inner">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-headline font-black text-2xl sm:text-3xl text-white tracking-tight leading-none whitespace-nowrap">
                    Young Inno Hack
                  </h3>
                  <p className="text-[11px] sm:text-xs font-mono-code font-bold uppercase tracking-[0.2em] text-emerald-200 mt-1">
                    IDEAS TODAY. A BRIGHTER TOMORROW.
                  </p>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-emerald-100 font-light w-full border-t border-white/15 pt-3">
                <p>A one-day innovation challenge solving real-world problems.</p>
                <p className="text-white/80">Develop a concept and pitch to the jury.</p>
                <p className="text-white/80">Basic: grades 7–9 · Medium: gymnasiet · Advanced: university students.</p>
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

        {/* ── 03. VENUES ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 pb-2">
          {VENUES.map((venue) => (
            <div key={venue.label} className="flex flex-col bg-white border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="p-5 flex items-start gap-4 flex-1">
                <div
                  className={`w-12 h-12 flex items-center justify-center shrink-0 ${
                    venue.track === 'robo' ? 'bg-[#006AA7]/10 text-[#006AA7]' : 'bg-[#059669]/10 text-[#059669]'
                  }`}
                >
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-headline font-bold text-xs sm:text-sm text-[#0A1930] uppercase tracking-wider">
                    {venue.label}
                  </h5>
                  <p
                    className={`font-headline font-black text-lg sm:text-xl mt-1 leading-tight ${
                      venue.track === 'robo' ? 'text-[#006AA7]' : 'text-[#059669]'
                    }`}
                  >
                    {venue.name}
                  </p>
                  {venue.detail && <p className="text-xs text-slate-600 font-light mt-0.5">{venue.detail}</p>}
                </div>
              </div>
              <div className="h-32 border-t border-slate-200 bg-[#F8FAFC] flex items-center justify-center p-4">
                {venue.image ? (
                  <img src={venue.image} alt={venue.detail || venue.name} className="max-h-full w-auto object-contain" />
                ) : (
                  <span className="text-[11px] font-mono-code font-bold uppercase tracking-widest text-slate-400">
                    Image coming soon
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Official Rules & International Opportunity Note ── */}
        <div className="p-4 bg-amber-50/80 border border-amber-200 text-amber-900 text-xs font-mono-code leading-relaxed flex items-start gap-3">
          <span className="text-base leading-none">✈️</span>
          <div>
            <span className="font-bold uppercase tracking-wider text-amber-950 block mb-0.5">
              * International Stage & Flight Tickets Policy
            </span>
            <span>
              Top 1 or 2 winning teams may qualify for sponsored flight tickets to the International-level competition in April 2027.
              This opportunity is subject to official competition rules, partner sponsorship allocation, and final coordinator confirmation.
            </span>
          </div>
        </div>

        {/* ── 04. REGISTER CTA BAR (SECTION 3 CONVERSION ANCHOR) ── */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#0A1930] via-[#006AA7] to-[#0A1930] text-white flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center lg:text-left">
            <span className="text-[11px] font-mono-code font-bold tracking-[0.25em] text-[#FFCD00] uppercase block">
              REGISTRATION OPEN FOR SCHOOLS, ASSOCIATIONS & TEAMS
            </span>
            <h3 className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight">
              Ready to join the 2026 Championship?
            </h3>
            <p className="text-xs sm:text-sm text-white/80 font-light max-w-xl">
              Choose RoboKidovation, Young Inno Hack, or register teams across both tracks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto shrink-0">
            {onOpenRegister && (
              <button
                onClick={onOpenRegister}
                className="w-full sm:w-auto px-8 py-4 bg-[#FFCD00] hover:bg-[#E6B800] text-[#0A1930] font-syne font-black text-xs sm:text-sm tracking-wider uppercase transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2.5 active:scale-95"
              >
                <span>REGISTER SCHOOL, ASSOCIATION OR TEAM</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ── 05. FOOTER SUB-STRIP ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs font-mono-code text-slate-400 border-t border-slate-200">
          <span>// FUTURE INNOVATORS 2026</span>

          <div className="relative">
            <span className="font-handwriting text-lg sm:text-xl text-[#0A1930]">
              Students Today. A Brighter Tomorrow.
            </span>
            <div className="w-full h-0.5 bg-[#FFCD00] -mt-0.5" />
          </div>

          <span className="font-bold text-[#006AA7] tracking-wider">
            FINALS: 2 DECEMBER 2026 · IES ESKILSTUNA
          </span>
        </div>

      </div>
    </section>
  );
};
