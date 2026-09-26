import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface RegistrationStats {
  schools_count: number;
  students_count: number;
}

const CountUpStat: React.FC<{ target: number; label: string; inView: boolean }> = ({
  target,
  label,
  inView,
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
    <div className="flex flex-col items-center text-center">
      <span className="font-headline font-black text-3xl sm:text-4xl text-[#0A1930] tracking-tight leading-none">
        {value}+
      </span>
      <span className="text-[10px] sm:text-xs font-mono-code font-bold text-slate-500 uppercase tracking-widest mt-1">
        {label}
      </span>
    </div>
  );
};

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

  const marqueeItems = schools.length > 0 ? [...schools, ...schools, ...schools] : [];

  return (
    <div ref={sectionRef} className="pt-2 space-y-6 border-t border-slate-200">
      <span className="block text-center text-[11px] font-mono-code font-bold tracking-[0.25em] text-[#006AA7] uppercase">
        Our Collaborators
      </span>

      {marqueeItems.length > 0 && (
        <div className="w-full overflow-hidden relative group">
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />

          <div className="animate-marquee-track group-hover:[animation-play-state:paused] flex items-center gap-3 sm:gap-4">
            {marqueeItems.map((name, idx) => (
              <span
                key={`${name}-${idx}`}
                className="flex-shrink-0 px-5 py-2.5 bg-[#F8FAFC] border border-slate-200 font-headline font-bold text-xs sm:text-sm uppercase tracking-wide text-[#0A1930] whitespace-nowrap"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      )}

      {(schoolsCount > 0 || studentsCount > 0) && (
        <div className="flex items-center justify-center gap-10 sm:gap-16">
          <CountUpStat target={studentsCount} label="Students Registered" inView={isInView} />
          <CountUpStat target={schoolsCount} label="Schools Registered" inView={isInView} />
        </div>
      )}
    </div>
  );
};
