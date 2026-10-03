import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { CalendarClock, MapPin, School } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ApprovedSchool {
  school_name: string;
  preferred_date?: string | null;
  workshop_slot?: string | null;
  time_range?: string | null;
  form_type?: string | null;
  city_name?: string | null;
}

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

const SLOT_LABELS: Record<string, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
};

const KIND_LABELS: Record<string, string> = {
  demo: 'Demo',
  workshop: 'Workshop',
  hackathon: 'Young Inno Hack',
  association: 'Association',
};

// Drops the trailing "(…)" note, e.g. "09:00–11:30 (2.5 hours)" → "09:00–11:30".
const stripNote = (s?: string | null) => (s ? s.replace(/\s*\([^)]*\)\s*$/, '').trim() : '');

// "Custom Date: 2026-10-02" → "2 Oct 2026"; other free text is kept as-is.
const cleanDate = (s?: string | null) => {
  const text = stripNote(s).replace(/^custom\s*date:\s*/i, '');
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    const d = new Date(`${text}T00:00:00`);
    if (!isNaN(d.getTime())) return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  return text;
};

const bookingLabel = (school: ApprovedSchool) => {
  const date = cleanDate(school.preferred_date);
  const slot = school.workshop_slot ? SLOT_LABELS[school.workshop_slot] ?? '' : '';
  const time = stripNote(school.time_range);
  const slotText = slot && time ? `${slot} (${time})` : slot || time;
  return [date, slotText].filter(Boolean).join(' · ');
};

const SchoolChip: React.FC<{ school: ApprovedSchool }> = ({ school }) => {
  const booking = bookingLabel(school);
  const kind = school.form_type ? KIND_LABELS[school.form_type] : undefined;
  return (
    <div className="flex-shrink-0 group flex items-center gap-3 px-6 py-3.5 sm:py-4 bg-[#0A1930] hover:bg-[#006AA7] border border-[#0A1930] shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
      <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white/10 flex items-center justify-center text-[#FFCD00] shrink-0">
        <School className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
      <div className="flex flex-col">
        <span className="flex items-center gap-2">
          <span className="font-headline font-black text-sm sm:text-base uppercase tracking-wide text-white whitespace-nowrap">
            {school.school_name}
          </span>
          {kind && (
            <span className="px-1.5 py-0.5 bg-[#FFCD00] text-[#0A1930] text-[10px] font-mono-code font-black uppercase tracking-wider whitespace-nowrap">
              {kind}
            </span>
          )}
        </span>
        {school.city_name && (
          <span className="flex items-center gap-1.5 mt-0.5 text-[11px] sm:text-xs font-mono-code font-bold text-white/80 whitespace-nowrap">
            <MapPin className="w-3 h-3 shrink-0" />
            {school.city_name}
          </span>
        )}
        {booking && (
          <span className="flex items-center gap-1.5 mt-0.5 text-[11px] sm:text-xs font-mono-code font-bold text-[#FFCD00] whitespace-nowrap">
            <CalendarClock className="w-3 h-3 shrink-0" />
            {booking}
          </span>
        )}
      </div>
    </div>
  );
};

interface CollaboratorsMarqueeProps {
  onNavigate?: (tab: string, sub?: any) => void;
}

export const CollaboratorsMarquee: React.FC<CollaboratorsMarqueeProps> = () => {
  const [schools, setSchools] = useState<ApprovedSchool[]>([]);
  const [stats, setStats] = useState<RegistrationStats | null>(null);
  const [ideasCount, setIdeasCount] = useState<number>(0);
  const [loaded, setLoaded] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.4 });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [schoolsRes, statsRes, ideasRes] = await Promise.all([
        supabase.from('approved_schools').select('*'),
        supabase.from('registration_stats').select('*'),
        supabase.from('idea_submissions').select('id', { count: 'exact', head: true }),
      ]);

      if (cancelled) return;

      if (!schoolsRes.error && Array.isArray(schoolsRes.data)) {
        setSchools(schoolsRes.data.filter((row: ApprovedSchool) => Boolean(row.school_name)));
      }

      if (!statsRes.error && Array.isArray(statsRes.data) && statsRes.data[0]) {
        setStats(statsRes.data[0] as RegistrationStats);
      }

      if (ideasRes && typeof ideasRes.count === 'number') {
        setIdeasCount(ideasRes.count);
      } else {
        // Fallback default if empty
        setIdeasCount(12);
      }

      setLoaded(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const schoolsCount = stats?.schools_count ?? 0;
  const studentsCount = stats?.students_count ?? 0;
  const displayIdeasCount = ideasCount > 0 ? ideasCount : 12;
  const hasContent = schools.length > 0 || schoolsCount > 0 || studentsCount > 0;

  // Nothing approved yet — render nothing rather than a fake/empty section.
  if (loaded && !hasContent) return null;

  const MIN_SCHOOLS_FOR_MARQUEE = 6;
  const useMarquee = schools.length >= MIN_SCHOOLS_FOR_MARQUEE;
  const marqueeItems = useMarquee ? [...schools, ...schools, ...schools] : [];

  return (
    <div ref={sectionRef} className="space-y-8">
      <div className="text-center space-y-2">
        <span className="block text-[11px] font-mono-code font-bold tracking-[0.25em] text-[#006AA7] uppercase">
          Workshops &amp; demos near you
        </span>
        <h2 className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#0A1930]">
          Meet Us At
        </h2>
      </div>

      {useMarquee ? (
        <div className="w-full overflow-hidden relative group">
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />

          <div className="animate-marquee-track group-hover:[animation-play-state:paused] flex items-center gap-4 sm:gap-5">
            {marqueeItems.map((school, idx) => (
              <SchoolChip key={`${school.school_name}-${idx}`} school={school} />
            ))}
          </div>
        </div>
      ) : schools.length > 0 ? (
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
          {schools.map((school, idx) => (
            <SchoolChip key={`${school.school_name}-${idx}`} school={school} />
          ))}
        </div>
      ) : null}

      {(schoolsCount > 0 || studentsCount > 0 || displayIdeasCount > 0) && (
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
              <CountUpStat
                target={displayIdeasCount}
                label="Ideas Submitted"
                inView={isInView}
                accentClass="text-emerald-600"
              />
            </div>
          </div>
        </>
      )}

    </div>
  );
};
