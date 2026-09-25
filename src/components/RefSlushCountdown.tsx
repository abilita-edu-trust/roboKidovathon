import React from 'react';
import { motion } from 'framer-motion';
import { useCountdown } from '../hooks/useCountdown';
import { Calendar, Trophy, ArrowRight } from 'lucide-react';

interface RefSlushCountdownProps {
  onOpenRegister?: () => void;
}

export const RefSlushCountdown: React.FC<RefSlushCountdownProps> = ({ onOpenRegister }) => {
  // Verifiable Grand Finale Date: December 5, 2026
  const countdown = useCountdown('2026-12-05T09:00:00+01:00');

  const units = [
    { value: countdown.days, label: 'DAYS' },
    { value: countdown.hours, label: 'HRS' },
    { value: countdown.minutes, label: 'MIN' },
    { value: countdown.seconds, label: 'SEC' },
  ];

  return (
    <section className="w-full bg-white py-12 sm:py-16 px-4 sm:px-6 select-none">
      <div className="max-w-[980px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full bg-[#F8FAFC] border border-slate-200 rounded-3xl py-10 sm:py-12 px-6 sm:px-12 text-center shadow-sm flex flex-col items-center justify-center space-y-6"
        >
          {/* Top Label */}
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-4 h-4 text-[#006AA7]" />
            <span className="text-xs sm:text-sm font-sans font-medium tracking-wide">
              Västerås Future Innovators 2026 · Grand Finale · December 5, 2026
            </span>
          </div>

          {/* Horizontal numbers with side labels */}
          <div className="grid grid-cols-4 gap-3 sm:flex sm:items-center sm:justify-center sm:gap-10 md:gap-14 pt-1 w-full max-w-sm sm:max-w-none">
            {countdown.isExpired ? (
              <span className="col-span-4 font-headline font-black text-2xl sm:text-4xl text-[#0A1930] tracking-tight leading-none uppercase">
                Grand Finale is underway!
              </span>
            ) : (
              units.map((unit) => (
                <div key={unit.label} className="flex flex-col sm:flex-row items-center sm:items-baseline gap-1 sm:gap-2">
                  <span className="font-headline font-black text-3xl sm:text-5xl md:text-6xl text-[#0A1930] tracking-tight leading-none">
                    {unit.value}
                  </span>
                  <span className="text-[9px] sm:text-xs font-mono-code font-bold text-slate-500 uppercase tracking-wider">
                    {unit.label}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Milestone context & real action CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
            <div className="text-[11px] font-mono-code text-slate-500 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-[#006AA7]" />
              <span>School Qualifiers: October 2026</span>
            </div>

            <span className="hidden sm:inline text-slate-300">•</span>

            <button
              onClick={onOpenRegister}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-syne font-black text-xs sm:text-sm uppercase tracking-wider bg-[#FFCD00] hover:bg-[#E6B800] text-[#0A1930] transition-all shadow-md cursor-pointer"
            >
              <span>REGISTER SCHOOL / TEAM</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
