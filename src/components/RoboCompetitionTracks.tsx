import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

interface RoboCompetitionTracksProps {
  onNavigate: (route: string) => void;
  onOpenRegister: () => void;
}

export const RoboCompetitionTracks: React.FC<RoboCompetitionTracksProps> = ({
  onNavigate,
  onOpenRegister,
}) => {
  return (
    <section id="challenges" className="w-full bg-white text-[#07111F] border-b border-[#07111F]/10">
      
      {/* Section Header */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 pt-20 md:pt-28 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#07111F]/10">
          <div>
            <span className="text-xs font-mono-code font-bold tracking-[0.25em] text-[#0052FF] uppercase block mb-3">
              04 / TOURNAMENT DISCIPLINES
            </span>
            <h2
              className="font-display font-black uppercase leading-none tracking-tight text-[#07111F]"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)' }}
            >
              The Competition<br />
              <span className="text-[#0052FF]">Tracks.</span>
            </h2>
          </div>

          <button
            onClick={() => onNavigate('challenges')}
            className="text-xs font-display font-bold tracking-[0.14em] uppercase text-[#0052FF] hover:text-[#0043D6] inline-flex items-center gap-1.5 border-b border-[#0052FF]/30 pb-0.5 hover:border-[#0052FF] transition-all self-start md:self-end"
          >
            <span>VIEW COMPLETE TECHNICAL RULEBOOK</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── TRACK 01: ROBO-SPRINT (Junior Category) ── */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 border-t border-[#07111F]/10">
        <div className="lg:col-span-6 bg-[#0052FF] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 mb-8">
              <span className="text-xs font-mono-code font-bold tracking-[0.25em] text-white/70 uppercase border border-white/30 px-2.5 py-1 rounded-[2px]">
                CAT A // JUNIOR LEAGUE
              </span>
              <span className="text-xs font-mono-code font-bold tracking-[0.15em] text-white bg-black/30 px-3 py-1 rounded-[2px]">
                ⏱ 3 MIN NON-STOP
              </span>
            </div>

            <h3
              className="font-display font-black uppercase leading-[0.88] tracking-tight text-white"
              style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}
            >
              ROBO-<br />
              <span className="text-[#E2FF00]">SPRINT</span>
            </h3>

            <p className="mt-4 text-base text-white/85 font-light leading-relaxed max-w-lg">
              Air-hockey ball transfer arena. Competitors construct rapid differential bots to clear balls from their court across the arena divider before the match timer expires.
            </p>

            <div className="mt-8 space-y-3.5 border-t border-white/20 pt-6">
              {[
                { label: 'AGE DIVISION', value: 'Junior Cohort (Up to 15 Years Old)' },
                { label: 'OBJECTIVE', value: 'Transfer maximum balls to opponent court' },
                { label: 'ROBOT LIMIT', value: '1.5 ft × 1.5 ft Chassis Boundary' },
                { label: 'SCORING CRITERIA', value: 'Fewest remaining balls in own court wins' },
              ].map((row) => (
                <div key={row.label} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-xs font-mono-code border-b border-white/10 pb-2.5">
                  <span className="text-white/60 text-xs uppercase">{row.label}</span>
                  <span className="text-white font-bold">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 pt-6 flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenRegister}
              className="btn-volt-primary text-xs"
            >
              <span>REGISTER JUNIOR TEAM</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('challenges')}
              className="text-xs font-display font-bold tracking-wider uppercase text-white/80 hover:text-white border-b border-white/40 pb-0.5"
            >
              ROBO-SPRINT RULES →
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 relative overflow-hidden min-h-[380px] lg:min-h-0 bg-[#07111F]">
          <img
            src="https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=900&q=85"
            alt="Robo-Sprint fast arena competition"
            className="absolute inset-0 w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07111F]/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-6 left-6 right-6 p-4 rounded-[2px] bg-black/80 backdrop-blur-md border border-white/15">
            <span className="block text-xs font-mono-code text-[#0052FF] uppercase font-bold">
              [ ARENA SPECIFICATION 01 ]
            </span>
            <span className="block text-xs font-display font-bold text-white uppercase tracking-wider mt-0.5">
              High-Velocity Ball Ejection & Dynamic Agility Challenge
            </span>
          </div>
        </div>
      </div>

      {/* ── TRACK 02: ROBO-PRECISION (Senior Category) ── */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 border-t border-[#07111F]/10">
        <div className="lg:col-span-6 relative overflow-hidden min-h-[380px] lg:min-h-0 bg-[#07111F] order-2 lg:order-1">
          <img
            src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=85"
            alt="Robo-Precision autonomous tower stacking"
            className="absolute inset-0 w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07111F]/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-6 left-6 right-6 p-4 rounded-[2px] bg-black/80 backdrop-blur-md border border-white/15">
            <span className="block text-xs font-mono-code text-[#E2FF00] uppercase font-bold">
              [ ARENA SPECIFICATION 02 ]
            </span>
            <span className="block text-xs font-display font-bold text-white uppercase tracking-wider mt-0.5">
              Multi-Tier Autonomous Stacking & Servo Kinematics
            </span>
          </div>
        </div>

        <div className="lg:col-span-6 bg-[#07111F] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between order-1 lg:order-2">
          <div>
            <div className="flex items-center justify-between gap-4 mb-8">
              <span className="text-xs font-mono-code font-bold tracking-[0.25em] text-[#E2FF00] uppercase border border-[#E2FF00]/30 px-2.5 py-1 rounded-[2px]">
                CAT B // SENIOR LEAGUE
              </span>
              <span className="text-xs font-mono-code font-bold tracking-[0.15em] text-white bg-white/10 px-3 py-1 rounded-[2px]">
                ⏱ 5 MIN STRATEGIC
              </span>
            </div>

            <h3
              className="font-display font-black uppercase leading-[0.88] tracking-tight text-white"
              style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}
            >
              ROBO-<br />
              <span className="text-[#0052FF]">PRECISION</span>
            </h3>

            <p className="mt-4 text-base text-slate-300 font-light leading-relaxed max-w-lg">
              Autonomous 5-level cup tower assembly. Senior teams engineer articulated robotic crane arms to grasp, lift, balance, and erect precision towers with zero human touch.
            </p>

            <div className="mt-8 space-y-3.5 border-t border-white/10 pt-6">
              {[
                { label: 'AGE DIVISION', value: 'Senior Cohort (15+ Years / Gymnasium)' },
                { label: 'OBJECTIVE', value: 'Assemble tallest stable 5-level cup pyramid' },
                { label: 'ROBOT LIMIT', value: '2.5 ft × 2.5 ft Chassis & Crane Arm' },
                { label: 'SCORING CRITERIA', value: 'Tower height, tier count & stability at buzzer' },
              ].map((row) => (
                <div key={row.label} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-xs font-mono-code border-b border-white/8 pb-2.5">
                  <span className="text-slate-400 text-xs uppercase">{row.label}</span>
                  <span className="text-white font-bold">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 pt-6 flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenRegister}
              className="btn-electric-primary text-xs"
            >
              <span>REGISTER SENIOR TEAM</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('challenges')}
              className="text-xs font-display font-bold tracking-wider uppercase text-slate-300 hover:text-white border-b border-slate-500 pb-0.5"
            >
              ROBO-PRECISION RULES →
            </button>
          </div>
        </div>
      </div>

    </section>
  );
};
