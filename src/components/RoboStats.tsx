import React from 'react';

export const RoboStats: React.FC = () => {
  const stats = [
    { value: '15+', label: 'SCHOOLS', sub: 'CONFIRMED INSTITUTIONS', accent: 'text-[#07111F]' },
    { value: '600+', label: 'STUDENTS', sub: 'REGISTERED COMPETITORS', accent: 'text-[#0052FF]' },
    { value: '45+', label: 'EDUCATORS', sub: 'CERTIFIED MENTORS & VOLUNTEERS', accent: 'text-[#07111F]' },
    { value: '600+', label: 'COMMUNITY', sub: 'PARENTS & STAKEHOLDERS ENGAGED', accent: 'text-[#0052FF]' },
  ];

  return (
    <section className="w-full bg-[#F8F9FA] text-[#07111F] border-b border-[#07111F]/10">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 py-20 md:py-24">
        
        {/* Eyebrow + Section Headline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 pb-8 border-b border-[#07111F]/10">
          <div>
            <span className="text-xs font-mono-code font-bold tracking-[0.25em] text-[#0052FF] uppercase block mb-3">
              02 / SCALE & IMPACT — 2026 PILOT COHORT
            </span>
            <h2
              className="font-display font-black uppercase leading-none tracking-tight text-[#07111F]"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)' }}
            >
              Proven Scale.<br className="hidden sm:block" />
              <span className="text-[#0052FF]">Real Impact.</span>
            </h2>
          </div>
          <p className="text-sm text-[#4A5568] font-light max-w-sm leading-relaxed">
            Direct institutional engagement across the Västerås municipal school cluster — establishing Sweden's most rigorous student robotics competition.
          </p>
        </div>

        {/* Large Typography Statistics Row (Minimal Dividers, Zero Cheap Floating Cards) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[#07111F]/10">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="py-8 lg:py-0 lg:px-10 first:lg:pl-0 last:lg:pr-0 flex flex-col gap-2"
            >
              <span
                className={`font-display font-extrabold leading-none tracking-tight ${stat.accent}`}
                style={{ fontSize: 'clamp(3.5rem, 6.5vw, 6.8rem)', lineHeight: 0.95 }}
              >
                {stat.value}
              </span>
              <div className="mt-2">
                <span className="block font-display font-extrabold text-base uppercase tracking-wider text-[#07111F]">
                  {stat.label}
                </span>
                <span className="block text-xs font-mono-code tracking-[0.15em] text-[#4A5568] uppercase mt-0.5">
                  {stat.sub}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
