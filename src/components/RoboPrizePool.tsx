import React from 'react';
import { Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

interface RoboPrizePoolProps {
  onOpenRegister: () => void;
}

export const RoboPrizePool: React.FC<RoboPrizePoolProps> = ({ onOpenRegister }) => {
  return (
    <section className="w-full bg-[#040912] text-white border-b border-white/[0.08] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 pt-20 md:pt-28">
        
        {/* Top Eyebrow */}
        <div className="border-b border-white/10 pb-6 flex items-center justify-between">
          <span className="text-[10px] font-mono-code font-bold tracking-[0.25em] text-[#E2FF00] uppercase">
            08 / CHAMPIONSHIP ALLOCATIONS
          </span>
          <span className="text-[10px] font-mono-code text-slate-400 uppercase tracking-widest hidden sm:inline">
            VÄSTERÅS CITY FINALS · MÄLARDALEN INTERNATIONAL SCHOOL
          </span>
        </div>

        {/* Dramatic Headline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-16 md:py-20 border-b border-white/10">
          <div className="lg:col-span-7">
            <h2
              className="font-display font-black uppercase leading-[0.85] tracking-tight text-white"
              style={{ fontSize: 'clamp(4.5rem, 12vw, 11rem)' }}
            >
              PRIZE<br />
              <span className="text-[#E2FF00]">POOL</span>
            </h2>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-end">
            <p className="text-base text-slate-300 font-light leading-relaxed max-w-md">
              Official cash allocations and national championship passes awarded to the top-scoring Junior and Senior teams at the Västerås City Finals.
            </p>
            <div className="mt-6 flex items-center gap-3 text-xs font-mono-code text-[#0052FF]">
              <ShieldCheck className="w-4 h-4 text-[#0052FF]" />
              <span className="text-slate-300">ADJUDICATED BY TECH INDUSTRY & ROBOTICS EXPERTS</span>
            </div>
          </div>
        </div>

        {/* Prize Podium Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/10 py-16">
          
          {/* 2nd Place */}
          <div className="pb-10 lg:pb-0 lg:pr-12 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[9px] font-mono-code font-bold text-white/50 border border-white/20 px-2 py-0.5 rounded-[2px] uppercase">
                  RANK 02
                </span>
                <span className="text-xs font-display font-bold uppercase text-slate-300">
                  SECOND PLACE
                </span>
              </div>

              <span
                className="font-display font-black text-white/60 leading-none tracking-tight block my-2"
                style={{ fontSize: 'clamp(3.5rem, 7vw, 5.5rem)', lineHeight: 0.95 }}
              >
                1,400
              </span>
              <span className="text-xl font-display font-extrabold text-white/40 uppercase tracking-widest block">
                SEK
              </span>
            </div>

            <div className="mt-8 space-y-2 text-xs font-mono-code text-slate-300 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span>SILVER CHAMPIONSHIP MEDAL</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span>OFFICIAL TROPHY & DIPLOMA</span>
              </div>
            </div>
          </div>

          {/* 1st Place (Grand Champion - Neon Volt Yellow Dominance) */}
          <div className="py-10 lg:py-0 lg:px-12 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[9px] font-mono-code font-bold text-[#07111F] bg-[#E2FF00] px-2.5 py-0.5 rounded-[2px] uppercase">
                  RANK 01 // GRAND CHAMPION
                </span>
              </div>

              <span
                className="font-display font-black text-[#E2FF00] leading-none tracking-tight block my-2"
                style={{ fontSize: 'clamp(4.5rem, 9vw, 7.5rem)', lineHeight: 0.95 }}
              >
                2,000
              </span>
              <span className="text-2xl font-display font-extrabold text-[#E2FF00]/70 uppercase tracking-widest block">
                SEK CASH PRIZE
              </span>
            </div>

            <div className="mt-8 space-y-2.5 text-xs font-mono-code text-white pt-6 border-t border-[#E2FF00]/30">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E2FF00]" />
                <span className="font-bold">GOLD CHAMPIONSHIP MEDAL & TROPHY</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E2FF00]" />
                <span className="font-bold">STOCKHOLM GRAND FINALE NATIONAL BERTH</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E2FF00]" />
                <span>FEATURED EVENT MEDIA COVERAGE</span>
              </div>
            </div>

            <button
              onClick={onOpenRegister}
              className="mt-8 w-full btn-volt-primary py-3 text-xs flex items-center justify-center gap-2"
            >
              <span>COMPETE FOR CHAMPIONSHIP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 3rd Place */}
          <div className="pt-10 lg:pt-0 lg:pl-12 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[9px] font-mono-code font-bold text-white/50 border border-white/20 px-2 py-0.5 rounded-[2px] uppercase">
                  RANK 03
                </span>
                <span className="text-xs font-display font-bold uppercase text-slate-300">
                  THIRD PLACE
                </span>
              </div>

              <span
                className="font-display font-black text-white/40 leading-none tracking-tight block my-2"
                style={{ fontSize: 'clamp(3.5rem, 7vw, 5.5rem)', lineHeight: 0.95 }}
              >
                1,000
              </span>
              <span className="text-xl font-display font-extrabold text-white/30 uppercase tracking-widest block">
                SEK
              </span>
            </div>

            <div className="mt-8 space-y-2 text-xs font-mono-code text-slate-300 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span>BRONZE CHAMPIONSHIP MEDAL</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span>OFFICIAL TROPHY & DIPLOMA</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Participant Note */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono-code text-slate-400 uppercase tracking-widest">
          <span>ALL PARTICIPATING STUDENTS RECEIVE OFFICIALLY ENDORSED DIPLOMAS</span>
          <span>COMPETITION CATEGORIES: JUNIOR & SENIOR BRACKETS</span>
        </div>

      </div>
    </section>
  );
};
