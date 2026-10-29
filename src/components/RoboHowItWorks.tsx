import React from 'react';
import { ROADMAP_STEPS } from '../data/roboData';
import { ArrowRight } from 'lucide-react';

interface RoboHowItWorksProps {
  onNavigate: (route: string) => void;
}

export const RoboHowItWorks: React.FC<RoboHowItWorksProps> = ({ onNavigate }) => {
  return (
    <section id="how-it-works" className="w-full bg-[#F8F9FA] text-[#07111F] border-b border-[#07111F]/10">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 py-20 md:py-28">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#07111F]/10">
          <div>
            <span className="text-xs font-mono-code font-bold tracking-[0.25em] text-[#0052FF] uppercase block mb-3">
              05 / TOURNAMENT JOURNEY
            </span>
            <h2
              className="font-display font-black uppercase leading-none tracking-tight text-[#07111F]"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)' }}
            >
              How It Works.
            </h2>
          </div>
          <p className="text-xs font-mono-code text-[#4A5568] tracking-widest uppercase">
            5-STAGE PARTICIPANT ROADMAP // ZERO PRIOR CODING REQUIRED
          </p>
        </div>

        <div className="hidden lg:grid grid-cols-5 relative mt-16 pt-6">
          <div className="absolute top-[32px] left-[10%] right-[10%] h-[2px] bg-[#07111F]/15" />

          {ROADMAP_STEPS.map((step, idx) => {
            const isLast = idx === ROADMAP_STEPS.length - 1;

            return (
              <div key={step.stepNumber} className="flex flex-col items-center text-center px-4 relative group">
                <div
                  className={`w-5 h-5 rounded-[2px] z-10 mb-6 flex items-center justify-center transition-all ${
                    isLast
                      ? 'bg-[#E2FF00] border-2 border-[#07111F] shadow-[0_0_12px_#E2FF00]'
                      : 'bg-white border-2 border-[#0052FF] group-hover:bg-[#0052FF]'
                  }`}
                />

                <span className="text-xs font-mono-code font-bold tracking-[0.2em] text-[#0052FF] uppercase mb-1">
                  {step.tag}
                </span>

                <span
                  className="font-display font-black uppercase leading-none tracking-tight text-[#07111F] my-2"
                  style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)' }}
                >
                  {step.stepNumber}<br />
                  <span className={isLast ? 'text-[#0052FF]' : 'text-[#07111F]'}>{step.title}</span>
                </span>

                <span className="text-xs font-display font-bold text-[#07111F]/80 uppercase mb-2">
                  {step.subtitle}
                </span>

                <p className="text-xs text-[#4A5568] font-light leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="lg:hidden relative pl-8 mt-12 space-y-8">
          <div className="absolute left-3 top-2 bottom-2 w-[2px] bg-[#07111F]/15" />

          {ROADMAP_STEPS.map((step, idx) => {
            const isLast = idx === ROADMAP_STEPS.length - 1;

            return (
              <div key={step.stepNumber} className="relative pb-2">
                <div
                  className={`absolute -left-5 top-1 w-4 h-4 rounded-[2px] ${
                    isLast ? 'bg-[#E2FF00] border-2 border-[#07111F]' : 'bg-white border-2 border-[#0052FF]'
                  }`}
                />
                <span className="text-xs font-mono-code font-bold tracking-wider text-[#0052FF] uppercase block mb-1">
                  {step.tag}
                </span>
                <h3 className="font-display font-black uppercase text-xl text-[#07111F]">
                  {step.stepNumber} {step.title} — {step.subtitle}
                </h3>
                <p className="text-xs text-[#4A5568] font-light leading-relaxed mt-2">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 pt-8 border-t border-[#07111F]/10 flex justify-center">
          <button
            onClick={() => onNavigate('how-it-works')}
            className="btn-editorial-ghost-light"
          >
            <span>EXPLORE FULL STAGE-BY-STAGE GUIDE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
