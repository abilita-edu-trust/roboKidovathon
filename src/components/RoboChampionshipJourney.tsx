import React from 'react';
import { CHAMPIONSHIP_STAGES } from '../data/roboData';
import { MapPin, Calendar } from 'lucide-react';

export const RoboChampionshipJourney: React.FC = () => {
  return (
    <section className="w-full bg-white text-[#07111F] border-b border-[#07111F]/10">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 py-20 md:py-28">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#07111F]/10">
          <div>
            <span className="text-xs font-mono-code font-bold tracking-[0.25em] text-[#0052FF] uppercase block mb-3">
              06 / CHAMPIONSHIP ROADMAP
            </span>
            <h2
              className="font-display font-black uppercase leading-none tracking-tight text-[#07111F]"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)' }}
            >
              Tournament<br />
              <span className="text-[#0052FF]">Progression.</span>
            </h2>
          </div>
          <p className="text-sm text-[#4A5568] font-light max-w-sm leading-relaxed">
            From classroom qualifiers to the central municipal arena and the national Nordic Cup showdown.
          </p>
        </div>

        <div className="relative mt-12">
          <div className="absolute left-6 sm:left-10 top-4 bottom-4 w-[2px] bg-[#07111F]/10" />

          <div className="space-y-0">
            {CHAMPIONSHIP_STAGES.map((stage) => {
              return (
                <div
                  key={stage.stageNumber}
                  className="relative grid grid-cols-1 lg:grid-cols-12 border-b border-[#07111F]/10 last:border-b-0 py-10"
                >
                  <div
                    className={`absolute left-[20px] sm:left-[36px] top-12 w-3.5 h-3.5 rounded-[2px] z-10 ${
                      stage.active
                        ? 'bg-[#0052FF] shadow-[0_0_10px_#0052FF]'
                        : 'bg-white border-2 border-[#07111F]/40'
                    }`}
                  />

                  <div className="lg:col-span-3 pl-16 sm:pl-20 pr-6 flex flex-col justify-center">
                    <span
                      className="font-display font-black text-[#07111F]/10 leading-none tracking-tighter select-none"
                      style={{ fontSize: 'clamp(4rem, 8vw, 7.5rem)' }}
                    >
                      {stage.stageNumber}
                    </span>
                    <span className="text-xs font-mono-code font-bold tracking-[0.2em] text-[#0052FF] uppercase -mt-4">
                      {stage.stageCode}
                    </span>
                  </div>

                  <div className="lg:col-span-6 px-6 sm:px-10 mt-6 lg:mt-0 flex flex-col justify-center">
                    <span className="text-xs font-mono-code font-bold tracking-[0.2em] text-[#4A5568] uppercase mb-1">
                      {stage.subtitle}
                    </span>
                    <h3 className="font-display font-black uppercase text-2xl sm:text-3xl text-[#07111F] tracking-tight">
                      {stage.title}
                    </h3>
                    <p className="mt-3 text-sm text-[#4A5568] font-light leading-relaxed">
                      {stage.description}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 text-[13px] font-mono-code font-bold text-[#0052FF]">
                      <span>ADVANCEMENT:</span>
                      <span className="text-[#07111F]">{stage.advancement}</span>
                    </div>
                  </div>

                  <div className="lg:col-span-3 px-6 sm:px-8 mt-6 lg:mt-0 lg:border-l border-[#07111F]/10 flex flex-col justify-center gap-4">
                    <div>
                      <span className="text-xs font-mono-code font-bold text-[#4A5568] uppercase block mb-1">
                        LOCATION
                      </span>
                      <div className="flex items-start gap-1.5 text-xs font-display font-bold text-[#07111F] uppercase">
                        <MapPin className="w-3.5 h-3.5 text-[#0052FF] shrink-0 mt-0.5" />
                        <span>{stage.location}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-mono-code font-bold text-[#4A5568] uppercase block mb-1">
                        OFFICIAL DATE
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-mono-code font-bold text-[#0052FF]">
                        <Calendar className="w-3.5 h-3.5 text-[#0052FF]" />
                        <span>{stage.date}</span>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
