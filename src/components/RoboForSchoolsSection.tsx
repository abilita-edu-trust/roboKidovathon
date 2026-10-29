import React from 'react';
import { ArrowRight, FileText, ShieldCheck } from 'lucide-react';

interface RoboForSchoolsSectionProps {
  onNavigate: (route: string) => void;
  onOpenRegister: () => void;
  onOpenDeckModal: () => void;
}

export const RoboForSchoolsSection: React.FC<RoboForSchoolsSectionProps> = ({
  onNavigate,
  onOpenRegister,
  onOpenDeckModal
}) => {
  return (
    <section id="for-schools" className="w-full bg-[#07111F] text-white border-b border-white/[0.08]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 py-20 md:py-28">
        
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6 pb-10 border-b border-white/10">
          <div>
            <span className="text-xs font-mono-code font-bold tracking-[0.25em] text-[#E2FF00] uppercase block mb-3">
              07 / PRINCIPALS & EDUCATORS PORTAL
            </span>
            <h2
              className="font-display font-black uppercase leading-[0.88] tracking-tight text-white"
              style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5.5rem)' }}
            >
              Bring The Challenge<br />
              To Your <span className="text-[#0052FF]">School.</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenDeckModal}
              className="btn-editorial-ghost-dark text-xs py-3.5 px-6 flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-[#E2FF00]" />
              <span>DOWNLOAD EVENT PROSPECTUS (PDF)</span>
            </button>
            <button
              onClick={() => onNavigate('for-schools')}
              className="text-xs font-display font-bold tracking-wider uppercase text-white/80 hover:text-white border-b border-white/30 pb-0.5"
            >
              FULL EDUCATOR PORTAL →
            </button>
          </div>
        </div>

        {/* 3-Column Structured Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 border-t border-b border-white/10 py-10">
          
          {/* Column 01: What We Deliver */}
          <div className="pr-0 md:pr-10 pb-8 md:pb-0 space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-code font-bold text-[#0052FF] bg-[#0052FF]/20 px-2 py-0.5 rounded-[2px]">
                PART 01
              </span>
              <h3 className="font-display font-black text-lg uppercase tracking-wider text-white">
                WHAT WE DELIVER
              </h3>
            </div>

            <div className="space-y-3.5">
              {[
                { code: 'KITS', text: 'Complete mechanical & electronic robotics kits' },
                { code: 'MENTOR', text: 'Certified STEM trainers & competition mentors' },
                { code: 'CERTS', text: 'Official diplomas & certificates for all students' },
                { code: 'ARENA', text: 'Standardized competition mat infrastructure' },
                { code: 'MEDIA', text: 'Full event photography & tournament media pack' },
              ].map((item) => (
                <div key={item.code} className="flex items-start gap-3">
                  <span className="text-xs font-mono-code font-bold text-[#0052FF] border border-[#0052FF]/30 px-1.5 py-0.5 rounded-[2px] shrink-0 mt-0.5">
                    {item.code}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 02: School Requirements */}
          <div className="px-0 md:px-10 py-8 md:py-0 space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-code font-bold text-[#E2FF00] bg-[#E2FF00]/10 px-2 py-0.5 rounded-[2px]">
                PART 02
              </span>
              <h3 className="font-display font-black text-lg uppercase tracking-wider text-white">
                SCHOOL REQUIREMENTS
              </h3>
            </div>

            <div className="space-y-3.5">
              {[
                'Open room/hall for a 2-hour hands-on workshop in Feb 2026',
                '4 teacher volunteers during the school qualifying round',
                '1 teacher volunteer during the Västerås City Finals',
                'Student registration coordination and cohort support',
                'Zero financial cost on school budgets or administration',
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-white/30 font-bold mt-0.5 shrink-0">—</span>
                  <span className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 03: Transparent Cost Model */}
          <div className="pl-0 md:pl-10 pt-8 md:pt-0 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono-code font-bold text-white bg-white/10 px-2 py-0.5 rounded-[2px]">
                  PART 03
                </span>
                <h3 className="font-display font-black text-lg uppercase tracking-wider text-white">
                  PARTICIPATION FEE
                </h3>
              </div>

              <div>
                <span
                  className="font-display font-black text-[#E2FF00] leading-none tracking-tight block"
                  style={{ fontSize: 'clamp(4.5rem, 10vw, 8rem)', lineHeight: 0.95 }}
                >
                  100
                </span>
                <span className="text-2xl font-display font-extrabold text-white/50 uppercase tracking-widest mt-1 block">
                  SEK
                </span>
                <span className="block text-xs font-mono-code text-slate-400 uppercase tracking-wider mt-2">
                  + VAT · 125 SEK TOTAL PER STUDENT
                </span>
              </div>

              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Turnkey tournament entry. Covers kit allocation, workshop instruction, arena entry, and official diplomas.
              </p>
            </div>

            <div className="mt-8">
              <button
                onClick={onOpenRegister}
                className="w-full btn-electric-primary py-4 text-xs font-display font-bold tracking-[0.14em]"
              >
                <span>REGISTER YOUR SCHOOL NOW</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Nordic Standards & Safety Assurance Strip */}
        <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-mono-code text-slate-400">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#E2FF00]" />
            <span>SWEDISH LGR22 CURRICULUM MAPPED</span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#E2FF00]" />
            <span>12V DC LOW-VOLTAGE SAFETY LIMITS</span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#E2FF00]" />
            <span>FULL GDPR STUDENT DATA PROTECTION</span>
          </div>
        </div>

      </div>
    </section>
  );
};
