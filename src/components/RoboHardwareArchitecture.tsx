import React from 'react';
import { roboSprintKitPieces } from '../assets/images';

export const RoboHardwareArchitecture: React.FC = () => {
  const annotations = [
    { label: 'MOTOR & GEARBOX', spec: '12V DC · 250 RPM Metal', pos: 'top-[12%] left-[4%]', dir: 'right' },
    { label: 'IR SENSOR ARRAY', spec: '8-Channel Track Matrix', pos: 'top-[32%] left-[3%]', dir: 'right' },
    { label: 'MCU CORE', spec: 'MicroPython / C++ Autonomous', pos: 'top-[56%] left-[4%]', dir: 'right' },
    { label: 'CHASSIS BOUNDARY', spec: 'Max 1.5ft × 1.5ft Spec', pos: 'top-[15%] right-[4%]', dir: 'left' },
    { label: 'TACTICAL GRABBER', spec: 'Multi-Axis Precision Servo', pos: 'top-[42%] right-[3%]', dir: 'left' },
    { label: 'DIFFERENTIAL DRIVE', spec: 'High-Traction Grip Wheels', pos: 'top-[70%] right-[4%]', dir: 'left' },
  ];

  const specs = [
    { code: 'M-01', title: 'DRIVE POWERTRAIN', detail: 'High-torque 12V metal gearmotors with differential dual-wheel steering.' },
    { code: 'S-02', title: 'OPTICAL SENSOR ARRAY', detail: 'Sub-millisecond infrared ground reflection trackers & ultrasonic ranging.' },
    { code: 'C-03', title: 'LOGIC & CONTROLLER', detail: 'Programmable core supporting autonomous navigation and match strategies.' },
    { code: 'A-04', title: 'OFFICIAL MATCH MATS', detail: 'Standardized arena courts with electronic timing and boundary fences.' },
  ];

  return (
    <section className="w-full bg-[#07111F] text-white border-b border-white/[0.08] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 py-20 md:py-28">
        
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 pb-10 border-b border-white/[0.08]">
          <div className="lg:col-span-7">
            <span className="text-xs font-mono-code font-bold tracking-[0.25em] text-[#0052FF] uppercase block mb-3">
              03 / PHYSICAL SYSTEMS & HARDWARE SPECIFICATION
            </span>
            <h2
              className="font-display font-black uppercase leading-[0.88] tracking-tight text-white"
              style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5.8rem)' }}
            >
              Real Robots.<br />
              Real Hardware.<br />
              <span className="text-[#E2FF00]">Real Skills.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 flex flex-col justify-end">
            <p className="text-sm text-slate-300 font-light leading-relaxed">
              No simulations. No plastic toy blocks. Every student engineers and programs genuine electronic circuits, DC powertrains, optical sensors, and autonomous microcontroller firmware.
            </p>
          </div>
        </div>

        {/* Annotated Visual Diagram Display */}
        <div className="relative w-full rounded-[2px] overflow-hidden border border-white/[0.12] bg-[#040912]" style={{ aspectRatio: '16/7', minHeight: '340px' }}>
          <img
            src={roboSprintKitPieces}
            alt="Robotics engineering hardware piece list"
            className="w-full h-full object-contain p-4 opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07111F]/60 via-transparent to-[#07111F]/60 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#07111F]/40 via-transparent to-[#07111F]/70 pointer-events-none" />

          {/* Floating Callout Annotations */}
          {annotations.map((ann, i) => (
            <div
              key={i}
              className={`absolute ${ann.pos} hidden sm:flex items-center gap-2 ${
                ann.dir === 'right' ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              <div className={`p-2 rounded-[2px] bg-black/85 backdrop-blur-md border border-white/15 ${
                ann.dir === 'right' ? 'text-left' : 'text-right'
              }`}>
                <span className="block text-xs font-mono-code font-bold tracking-wider text-[#0052FF] uppercase">
                  {ann.label}
                </span>
                <span className="block text-xs font-mono-code text-slate-300">
                  {ann.spec}
                </span>
              </div>
              <div className="w-6 h-px bg-white/30" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#E2FF00] shadow-[0_0_8px_#E2FF00] shrink-0" />
            </div>
          ))}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-[2px] bg-black/80 border border-white/10 backdrop-blur-md">
            <span className="text-xs font-mono-code tracking-[0.25em] text-slate-400 uppercase">
              [ OFFICIAL HARDWARE ARCHITECTURE // 12V DC LIMIT ]
            </span>
          </div>
        </div>

        {/* Bottom 4-Column Spec Table */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08] border-t border-b border-white/[0.08] py-6">
          {specs.map((item) => (
            <div key={item.code} className="py-4 sm:py-0 px-0 sm:px-6 first:sm:pl-0 last:sm:pr-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono-code font-bold text-[#E2FF00] border border-[#E2FF00]/30 px-1.5 py-0.5 rounded-[2px]">
                  {item.code}
                </span>
                <span className="text-xs font-display font-bold text-white uppercase tracking-wider">
                  {item.title}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                {item.detail}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
