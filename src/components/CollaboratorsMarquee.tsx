import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { School } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface RegistrationStats {
  schools_count: number;
  students_count: number;
}

const CountUpStat: React.FC<{ target: number; label: string; inView: boolean; accentClass: string }> = ({
  target,
  label,
  inView,
  accentClass,
}) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView || target <= 0) return;

    const duration = 1400;
    const start = performance.now();

    let frame: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [inView, target]);

  return (
    <div className="px-8 sm:px-14 py-6 flex flex-col items-center text-center">
      <span className={`font-headline font-black text-3xl sm:text-4xl tracking-tight leading-none ${accentClass}`}>
        {value}+
      </span>
      <span className="text-[10px] sm:text-xs font-mono-code font-bold text-slate-500 uppercase tracking-widest mt-1.5">
        {label}
      </span>
    </div>
  );
};

const SchoolChip: React.FC<{ name: string }> = ({ name }) => (
  <div className="flex-shrink-0 group flex items-center gap-3 px-6 py-3.5 sm:py-4 bg-[#0A1930] hover:bg-[#006AA7] border border-[#0A1930] shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white/10 flex items-center justify-center text-[#FFCD00] shrink-0">
      <School className="w-4 h-4 sm:w-5 sm:h-5" />
    </div>
    <span className="font-headline font-black text-sm sm:text-base uppercase tracking-wide text-white whitespace-nowrap">
      {name}
    </span>
  </div>
);

export const CollaboratorsMarquee: React.FC = () => {
  const [schools, setSchools] = useState<string[]>([]);
  const [stats, setStats] = useState<RegistrationStats | null>(null);
  const [loaded, setLoaded] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.4 });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [schoolsRes, statsRes] = await Promise.all([
        supabase.from('approved_schools').select('school_name'),
        supabase.from('registration_stats').select('*'),
      ]);

      if (cancelled) return;

      if (!schoolsRes.error && Array.isArray(schoolsRes.data)) {
        setSchools(
          schoolsRes.data
            .map((row: { school_name: string }) => row.school_name)
            .filter(Boolean)
        );
      }

      if (!statsRes.error && Array.isArray(statsRes.data) && statsRes.data[0]) {
        setStats(statsRes.data[0] as RegistrationStats);
      }

      setLoaded(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const schoolsCount = stats?.schools_count ?? 0;
  const studentsCount = stats?.students_count ?? 0;
  const hasContent = schools.length > 0 || schoolsCount > 0 || studentsCount > 0;

  // Nothing approved yet — render nothing rather than a fake/empty section.
  if (loaded && !hasContent) return null;

  // A handful of names looping in an infinite marquee just repeats the same
  // pill over and over — reads as broken, not lively. Only animate once
  // there are enough collaborators for a marquee to actually feel continuous.
  const MIN_SCHOOLS_FOR_MARQUEE = 6;
  const useMarquee = schools.length >= MIN_SCHOOLS_FOR_MARQUEE;
  const marqueeItems = useMarquee ? [...schools, ...schools, ...schools] : [];

  return (
    <div ref={sectionRef} className="pt-2 space-y-8 border-t border-slate-200">
      <div className="text-center space-y-2">
        <span className="block text-[11px] font-mono-code font-bold tracking-[0.25em] text-[#006AA7] uppercase">
          Collaborative Ecosystem
        </span>
        <h2 className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#0A1930]">
          Our Collaborators
        </h2>
      </div>

      {useMarquee ? (
        <div className="w-full overflow-hidden relative group">
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />

          <div className="animate-marquee-track group-hover:[animation-play-state:paused] flex items-center gap-4 sm:gap-5">
            {marqueeItems.map((name, idx) => (
              <SchoolChip key={`${name}-${idx}`} name={name} />
            ))}
          </div>
        </div>
      ) : schools.length > 0 ? (
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
          {schools.map((name) => (
            <SchoolChip key={name} name={name} />
          ))}
        </div>
      ) : null}

      {(schoolsCount > 0 || studentsCount > 0) && (
        <>
          <div className="border-t border-slate-200" />
          <div className="flex justify-center">
            <div className="inline-flex divide-x divide-slate-200 border border-slate-200 bg-white shadow-xs">
              <CountUpStat
                target={studentsCount}
                label="Students Registered"
                inView={isInView}
                accentClass="text-[#006AA7]"
              />
              <CountUpStat
                target={schoolsCount}
                label="Schools Registered"
                inView={isInView}
                accentClass="text-[#0A1930]"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
