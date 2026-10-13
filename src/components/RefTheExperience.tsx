import React from 'react';
import {
  ArrowRight,
  Bot,
  Lightbulb,
  Users,
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
  MapPin,
} from 'lucide-react';
import { FutureInnovatorsBanner } from './FutureInnovatorsBanner';
import { PathwayCard } from './PathwayCard';

const VENUES: { label: string; name: string; detail?: string; image?: string; track: 'robo' | 'hack' }[] = [
  {
    label: 'RoboKidovation Final Venue',
    name: 'MISV',
    detail: 'Mälardalen International School Västerås',
    image: '/venue.png',
    track: 'robo',
  },
  { label: 'Young Inno Hack Opening AW', name: 'TBD', detail: 'Opening After Work · venue to be announced', track: 'hack' },
  { label: 'Young Inno Hack Final Venue', name: 'TBC', detail: 'Venue to be confirmed', track: 'hack' },
];

interface RefTheExperienceProps {
  onNavigate: (route: string) => void;
  onOpenRegister?: () => void;
}

export const RefTheExperience: React.FC<RefTheExperienceProps> = ({
  onNavigate,
  onOpenRegister,
}) => {
  // Step definitions for RoboKidovation (Blue) — matches the official Västerås Future
  // Innovators Robokidovation 2026 timeline flyer (School Demo → Final)
  const roboSteps = [
    {
      num: 1,
      title: 'School Demo',
      subtitle: 'See the robots, try simple challenges',
      date: '1 – 14 October 2026',
      icon: Presentation,
      highlight: false,
    },
    {
      num: 2,
      title: 'Hands-On Workshop',
      subtitle: 'Learn and build with real robots',
      date: '15 – 28 October 2026',
      icon: Cpu,
      highlight: false,
    },
    {
      num: 3,
      title: 'Team Formation',
      subtitle: 'Form teams and start practising',
      date: '29 October – 11 November 2026',
      icon: Users,
      highlight: false,
    },
    {
      num: 4,
      title: 'School Qualification',
      subtitle: 'Internal challenge to select best teams',
      date: '12 – 25 November 2026',
      icon: Award,
      highlight: false,
    },
    {
      num: 5,
      title: 'Final Preparation',
      subtitle: 'Practise and get final-ready',
      date: '26 November – 3 December 2026',
      icon: Wrench,
      highlight: false,
    },
    {
      num: 6,
      title: 'Västerås Future Innovators Final',
      subtitle: 'Compete, showcase & celebrate innovation',
      date: '4–5 December 2026',
      icon: Trophy,
      highlight: true,
    },
  ];

  // Step definitions for Young Inno Hack (Green) — matches the official
  // Track 2 Young Innovators Hackathon flyer (Listen → Select → Connect → Build → Demonstrate)
  const hackathonSteps = [
    {
      num: 1,
      title: 'Listen',
      subtitle: 'Collect ideas from schools',
      date: '1 – 14 October 2026',
      icon: Compass,
      highlight: false,
    },
    {
      num: 2,
      title: 'Select',
      subtitle: 'Identify key challenges',
      date: '15 – 28 October 2026',
      icon: Search,
      highlight: false,
    },
    {
      num: 3,
      title: 'Connect',
      subtitle: 'Form mixed teams with mentors',
      date: '29 October – 11 November 2026',
      icon: UserPlus,
      highlight: false,
    },
    {
      num: 4,
      title: 'Build',
      subtitle: 'Turn ideas into a prototype',
      date: '12 – 25 November 2026',
      icon: Layers,
      highlight: false,
    },
    {
      num: 5,
      title: 'Prepare Pitch',
      subtitle: 'Refine your solution and pitch',
      date: '26 November – 3 December 2026',
      icon: LineChart,
      highlight: false,
    },
    {
      num: 6,
      title: 'Demonstrate',
      subtitle: 'Present to the jury and win',
      date: '4–5 December 2026',
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

          <PathwayCard
            theme="robo"
            icon={Bot}
            title="RoboKidovation"
            tagline="LEARN. TEST. IMPROVE. COMPETE."
            intro={[
              'Hands-on robotics challenge for teams from schools and associations.',
              'No previous experience needed.',
              'Junior: grades 3–6 · Senior: grades 7–9 · GYM: programmable bot.',
            ]}
            steps={roboSteps}
            callout={
              <>
                From school workshops and internal competitions, up to <span className="font-bold text-[#006AA7]">4 teams</span> from each participating school or association qualify for the Västerås RoboKidovation Final on <span className="font-bold text-[#006AA7]">4–5 December 2026</span>.
              </>
            }
            ctaLabel="EXPLORE TRACK"
            onCta={() => onNavigate('challenges')}
            half
          />

          <PathwayCard
            theme="hack"
            icon={Lightbulb}
            title="Young Inno Hack"
            tagline="IDEAS TODAY. A BRIGHTER TOMORROW."
            intro={[
              'A one-day innovation challenge solving real-world problems.',
              'Develop a concept and pitch to the jury.',
              'Basic: grades 7–9 · Medium: gymnasiet · Advanced: university students.',
            ]}
            steps={hackathonSteps}
            callout={
              <>
                Students work on real-world challenges around science, technology, sustainability and innovation. The final presentations take place on <span className="font-bold text-[#059669]">4–5 December 2026</span>.
              </>
            }
            ctaLabel="EXPLORE TRACK"
            onCta={() => onNavigate('workflow')}
            half
            delay={0.15}
          />
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
