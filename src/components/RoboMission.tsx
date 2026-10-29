import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface RoboMissionProps {
  onNavigate: (route: string) => void;
}

export const RoboMission: React.FC<RoboMissionProps> = ({ onNavigate }) => {
  return (
    <section id="mission" className="w-full bg-white text-[#07111F] border-b border-[#07111F]/10">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12">
        
        {/* LEFT — Asymmetric Editorial Typography */}
        <div className="lg:col-span-7 px-6 sm:px-10 py-20 md:py-28 flex flex-col justify-center border-r border-[#07111F]/8">
          <span className="text-xs font-mono-code font-bold tracking-[0.25em] text-[#0052FF] uppercase block mb-4">
            01 / THE MANIFESTO
          </span>

          <h2
            className="font-display font-black uppercase leading-[0.88] tracking-tight text-[#07111F]"
            style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5.8rem)' }}
          >
            Physical<br />
            Robots.<br />
            <span className="text-[#0052FF]">Real Engineering.</span><br />
            Zero Simulations.
          </h2>

          <div className="mt-8 max-w-xl space-y-4 border-t border-[#07111F]/10 pt-6">
            <p className="text-base sm:text-lg text-[#1E293B] leading-relaxed font-normal">
              Most coding education happens exclusively on screens. Robo-Kido-A-Thon changes the equation by placing genuine motors, electronic circuits, optical sensor arrays, and microcontroller logic directly into students' hands.
            </p>
            <p className="text-sm text-[#4A5568] leading-relaxed font-light">
              Originating from the international Techfest IIT Bombay robotics tournament model and adapted for Swedish school standards — fostering collaborative engineering, physical mechanical intuition, and high-intensity match problem solving.
            </p>
          </div>

          {/* 4-Column Technical Spec Strip */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 border-t border-[#07111F]/10 pt-6 gap-4">
            {[
              { code: 'HW', label: 'HARDWARE', detail: 'Physical Circuitry & Chassis' },
              { code: 'SW', label: 'SOFTWARE', detail: 'Autonomous Microcontroller' },
              { code: 'TM', label: 'TEAMWORK', detail: 'Collaborative Engineering' },
              { code: 'LV', label: 'LIVE ARENA', detail: 'Official Refereed Heats' },
            ].map((item) => (
              <div key={item.code} className="space-y-1">
                <span className="block text-xs font-mono-code font-bold tracking-[0.2em] text-[#0052FF] uppercase">
                  [{item.code}] {item.label}
                </span>
                <span className="block text-xs text-[#4A5568] font-normal leading-snug">
                  {item.detail}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-4">
            <button
              onClick={() => onNavigate('about')}
              className="text-xs font-display font-bold tracking-[0.14em] uppercase text-[#0052FF] hover:text-[#0043D6] inline-flex items-center gap-1.5 border-b border-[#0052FF]/30 pb-0.5 hover:border-[#0052FF] transition-all"
            >
              <span>LEARN ABOUT THE TOURNAMENT PEDAGOGY</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* RIGHT — High Quality Cinematic Photography */}
        <div className="lg:col-span-5 relative overflow-hidden min-h-[420px] lg:min-h-0 bg-[#000000]">
          <img
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=85"
            alt="Students building physical robotics hardware"
            className="absolute inset-0 w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/90 via-transparent to-transparent pointer-events-none" />

          {/* Photo Caption Overlay */}
          <div className="absolute bottom-6 left-6 right-6 p-4 rounded-[2px] bg-black/85 backdrop-blur-md border border-white/10">
            <span className="block text-xs font-mono-code font-bold tracking-[0.2em] text-[#0052FF] uppercase mb-1">
              [ WORKSHOP ENVIRONMENT · VÄSTERÅS · 2026 ]
            </span>
            <span className="block text-xs font-display font-bold text-white uppercase tracking-wider">
              Component-Level Assembly & Autonomous Firmware Validation
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
