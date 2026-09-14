import React from 'react';
import { PARTNER_LOGOS } from '../data/roboData';

export const RefHeroMarquee: React.FC = () => {
  // Triple-duplicate for a seamless infinite loop across all screen sizes
  const items = [...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS];

  return (
    <div className="w-full overflow-hidden bg-white border-b border-slate-100 py-5 select-none relative group">
      {/* Edge Fade Gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />

      <div className="animate-marquee-track group-hover:[animation-play-state:paused] flex items-center gap-12 sm:gap-16 md:gap-20">
        {items.map((logo, idx) => (
          <div
            key={`${logo.name}-${idx}`}
            className="flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer transition-all duration-300 hover:scale-110 hover:-translate-y-1"
          >
            <img
              src={logo.file}
              alt={logo.name}
              className="h-9 sm:h-11 w-auto object-contain transition-transform duration-300"
            />
            <span className="text-[9px] sm:text-[10px] font-mono-code font-bold text-slate-400 group-hover:text-slate-600 uppercase tracking-widest whitespace-nowrap">
              {logo.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
