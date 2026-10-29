import React from 'react';
import { motion } from 'framer-motion';
import { STATS_DATA } from '../data/roboData';

interface RefStatsStripProps {
  onNavigate?: (route: string) => void;
}

export const RefStatsStrip: React.FC<RefStatsStripProps> = () => {
  return (
    <section className="w-full bg-[#0A1930] text-white border-y border-white/10 py-8 sm:py-10 px-6 sm:px-10 select-none">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {STATS_DATA.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className={`pt-4 sm:pt-0 sm:px-6 first:sm:pl-0 last:sm:pr-0 space-y-1`}
            >
              <div className="flex items-baseline gap-2">
                <span className="font-syne font-black text-2xl sm:text-3xl md:text-4xl text-[#FFCD00] tracking-tight">
                  {item.value}
                </span>
              </div>
              <span className="font-mono-code font-bold text-[13px] sm:text-sm text-white uppercase tracking-wider block">
                {item.label}
              </span>
              <span className="font-mono-code text-xs text-slate-400 uppercase tracking-widest block">
                {item.sub}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
