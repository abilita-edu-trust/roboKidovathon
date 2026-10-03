import React from 'react';
import { ArrowRight, BookOpen, Calendar, Trophy, Wrench } from 'lucide-react';

interface FutureInnovatorsDetailLinksProps {
  onNavigate: (route: string) => void;
}

const LINKS = [
  {
    route: 'challenges',
    icon: Trophy,
    title: 'Competition rules',
    text: 'Categories, qualification, match format and arena specifications.',
  },
  {
    route: 'lgr22',
    icon: BookOpen,
    title: 'Curriculum',
    text: 'How the 20-hour programme maps to Lgr22 and Gy25.',
  },
  {
    route: 'workflow',
    icon: Wrench,
    title: 'Equipment & workshops',
    text: 'Kits, sessions and the step-by-step learning pathway.',
  },
  {
    route: 'events',
    icon: Calendar,
    title: 'Events & final',
    text: 'The season timeline, qualifiers and the 5 December 2026 Final.',
  },
];

export const FutureInnovatorsDetailLinks: React.FC<FutureInnovatorsDetailLinksProps> = ({ onNavigate }) => (
  <section className="w-full bg-[#F8FAFC] text-[#0A1930] py-14 sm:py-16 px-4 sm:px-6 lg:px-10 border-t border-slate-200">
    <div className="max-w-[1560px] mx-auto space-y-6">
      <div>
        <span className="text-[11px] font-mono-code font-bold tracking-[0.2em] text-[#006AA7] uppercase block mb-2">
          PROGRAMME DETAILS
        </span>
        <h2 className="font-headline font-black text-3xl sm:text-4xl uppercase tracking-tight">Read the full details</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {LINKS.map((l) => (
          <button
            key={l.route}
            onClick={() => onNavigate(l.route)}
            className="text-left bg-white border-2 border-slate-200 hover:border-[#006AA7] p-5 space-y-2 transition-colors group"
          >
            <l.icon className="w-6 h-6 text-[#006AA7]" />
            <div className="font-headline font-black text-lg uppercase tracking-tight flex items-center gap-2">
              {l.title}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
            <p className="text-sm text-slate-600 font-light">{l.text}</p>
          </button>
        ))}
      </div>
    </div>
  </section>
);
