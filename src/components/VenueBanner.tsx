import React from 'react';
import { MapPin } from 'lucide-react';

export const VenueBanner: React.FC = () => {
  return (
    <div className="border border-slate-200 bg-[#F8FAFC] p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-sm">
      <div className="lg:col-span-4 flex items-center justify-center bg-white border border-slate-200 p-6 sm:p-8">
        <img
          src="/venue.png"
          alt="Mälardalen International School"
          className="w-full h-auto max-h-28 object-contain"
        />
      </div>
      <div className="lg:col-span-8 space-y-2">
        <span className="inline-block text-xs font-mono-code font-bold text-[#006AA7] uppercase tracking-wider">
          FINAL VENUE
        </span>
        <h2 className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#0A1930]">
          Mälardalen International School
        </h2>
        <div className="flex items-center gap-2 text-slate-500">
          <MapPin className="w-4 h-4 text-[#006AA7]" />
          <span className="text-xs sm:text-sm font-mono-code uppercase">Västerås, Sweden · 5 December 2026</span>
        </div>
        <p className="text-sm text-slate-600 font-light leading-relaxed max-w-2xl pt-1">
          The Robo-Sprint City Final is held at Mälardalen International School (MISV) on 5 December 2026. The venue for the Young Inno Hack final presentations on 11–12 December 2026 will be confirmed.
        </p>
      </div>
    </div>
  );
};
