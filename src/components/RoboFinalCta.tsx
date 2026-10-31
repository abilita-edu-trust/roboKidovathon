import React from 'react';
import { ArrowRight } from 'lucide-react';

interface RoboFinalCtaProps {
  onOpenRegister: () => void;
  onNavigate: (route: string) => void;
}

export const RoboFinalCta: React.FC<RoboFinalCtaProps> = ({
  onOpenRegister,
  onNavigate,
}) => {
  return (
    <section className="relative w-full bg-[#07111F] text-white overflow-hidden select-none">
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="font-display font-black uppercase text-white/[0.025] whitespace-nowrap leading-none tracking-tighter"
          style={{ fontSize: 'clamp(8rem, 24vw, 22rem)' }}
        >
          2026
        </span>
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 py-20 md:py-28">
        <div className="border-b border-white/10 pb-6 mb-12 flex items-center justify-between">
          <span className="text-xs font-mono-code font-bold tracking-[0.25em] text-[#E2FF00] uppercase">
            REGISTRATION OPEN // VÄSTERÅS 2026 SEASON
          </span>
          <span className="text-xs font-mono-code text-slate-400 uppercase tracking-widest hidden sm:inline">
            SWEDEN NATIONAL PILOT
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8 space-y-6">
            <h2
              className="font-display font-black uppercase leading-[0.88] tracking-tight text-white"
              style={{ fontSize: 'clamp(2.8rem, 7vw, 6.5rem)' }}
            >
              Ready to<br />
              <span className="text-[#0052FF]">Compete?</span>
            </h2>

            <p className="text-base sm:text-lg text-slate-300 font-light max-w-xl leading-relaxed">
              Enrol your school or register your student engineering team. Receive your official hardware kits and mentor support in February 2026.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-2xl">
              {[
                { label: 'REGISTRATION CLOSES', date: '31 JANUARY 2026' },
                { label: 'SCHOOL WORKSHOPS', date: 'FEBRUARY 2026' },
                { label: 'CITY FINALS ARENA', date: '21 MARCH 2026', highlight: true },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <span className="block text-xs font-mono-code font-bold text-slate-400 uppercase">
                    {item.label}
                  </span>
                  <span className={`block text-xs font-display font-bold uppercase ${
                    item.highlight ? 'text-[#E2FF00]' : 'text-white'
                  }`}>
                    {item.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3.5">
            <button
              onClick={onOpenRegister}
              className="w-full btn-volt-primary py-4 text-xs sm:text-sm font-display font-bold tracking-[0.14em]"
            >
              <span>REGISTER TEAM NOW</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('for-schools')}
              className="w-full btn-editorial-ghost-dark py-4 text-xs font-display font-bold tracking-[0.14em]"
            >
              <span>INSTITUTIONAL PARTNERSHIP →</span>
            </button>

            <button
              onClick={() => onNavigate('challenges')}
              className="w-full py-3.5 text-xs font-display font-bold tracking-[0.14em] uppercase text-slate-400 hover:text-white transition-colors"
            >
              VIEW TECHNICAL RULEBOOK →
            </button>

            <p className="text-xs font-mono-code text-slate-500 text-center uppercase tracking-widest pt-2">
              TURNKEY EXECUTION · ZERO ADMINISTRATIVE BURDEN
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
