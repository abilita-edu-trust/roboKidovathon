import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, MapPin, Calendar } from 'lucide-react';
import { UPCOMING_EVENTS, UpcomingEvent } from '../data/roboData';
import { VenueBanner } from '../components/VenueBanner';

interface EventsPageProps {
  onNavigateHome: () => void;
  onOpenRegister: () => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({
  onNavigateHome,
  onOpenRegister,
}) => {
  return (
    <div className="w-full min-h-screen bg-white text-[#0A1930] pt-28 pb-24 px-3 sm:px-6 select-none">
      <div className="w-full space-y-16">

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 text-xs font-mono-code font-bold tracking-wider text-[#006AA7] uppercase hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO HOME</span>
        </motion.button>

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="border-b border-slate-200 pb-12"
        >
          <span className="text-[10px] font-mono-code font-medium tracking-[0.2em] text-slate-500 uppercase block mb-3">
            VÄSTERÅS TOURNAMENT CALENDAR // AUTUMN 2026
          </span>

          <h1
            className="font-headline font-black uppercase tracking-tight leading-[1.02]"
            style={{ fontSize: 'clamp(3.2rem, 7.5vw, 6.5rem)' }}
          >
            <span className="text-stroke block">UPCOMING</span>
            <span className="text-[#0A1930] block">EVENTS</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 font-light max-w-2xl leading-relaxed">
            A clear timeline of the autumn season in Västerås: in-school qualifiers in October, then the Robo-Sprint City Final and the Young Innovators Hackathon together on December 5, 2026 at Mälardalen International School.
          </p>
        </motion.div>

        {/* ── CHRONOLOGICAL EVENT CARDS ── */}
        <div className="space-y-8">

          {/* Pre-Event: School Qualifiers */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border border-slate-200 bg-[#F8FAFC] p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 shadow-sm"
          >
            <div className="lg:col-span-3 space-y-2">
              <span className="inline-block text-[10px] font-mono-code font-bold text-[#006AA7] uppercase tracking-wider">
                STAGE 01 QUALIFIERS
              </span>
              <div className="flex items-center gap-2 text-[#006AA7] pt-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-mono-code font-bold uppercase">OCTOBER 2026</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-mono-code uppercase">IN EACH PARTICIPATING SCHOOL</span>
              </div>
            </div>

            <div className="lg:col-span-9 space-y-3">
              <h2 className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#0A1930]">
                RoboSkolan In-School Qualifiers
              </h2>
              <p className="text-xs font-mono-code font-bold text-[#006AA7] uppercase tracking-wide">
                10-Session In-School STEM Project Climax
              </p>
              <p className="text-sm text-slate-600 font-light leading-relaxed max-w-2xl">
                Held inside each participating school across the final sessions of the 20-hour STEM project. Student teams test their built robots under official 3-minute referee match conditions. One winning Explorer team (Grades 3–6) and one winning Advanced team (Grades 7–9) qualify to represent their school in the municipal final.
              </p>
              <div className="pt-2">
                <span className="text-xs font-mono-code font-bold text-[#0A1930] uppercase tracking-wider">
                  Advancement: 1 Explorer + 1 Advanced Team per School
                </span>
              </div>
            </div>
          </motion.div>

          {/* Event 1: Friday City Final */}
          {UPCOMING_EVENTS.map((event: UpcomingEvent, idx: number) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`border p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 shadow-sm ${
                event.id === 'robokidovation-final'
                  ? 'border-[#006AA7]/40 bg-white'
                  : 'border-slate-200 bg-[#F8FAFC]'
              }`}
            >
              <div className="lg:col-span-3 space-y-2">
                <span className="inline-block text-[10px] font-mono-code font-bold text-[#0A1930] uppercase tracking-wider">
                  {event.day}
                </span>
                <div className="flex items-center gap-2 text-[#006AA7] pt-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-mono-code font-bold uppercase">{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs font-mono-code uppercase">{event.location}</span>
                </div>
              </div>

              <div className="lg:col-span-9 space-y-3">
                <h2 className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#0A1930]">
                  {event.title}
                </h2>
                <p className="text-xs sm:text-sm font-mono-code font-bold text-slate-500 uppercase tracking-wide">
                  {event.subtitle}
                </p>
                <p className="text-sm text-slate-600 font-light leading-relaxed max-w-2xl">
                  {event.description}
                </p>

                {event.curriculumNote && (
                  <p className="text-xs text-slate-500 font-light leading-relaxed max-w-2xl pt-2 border-t border-slate-100">
                    {event.curriculumNote}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
                  {event.categories && (
                    <div className="flex flex-wrap gap-2">
                      {event.categories.map((c) => (
                        <span
                          key={c}
                          className="text-[10px] font-mono-code font-bold text-[#0A1930] bg-[#F8FAFC] border border-slate-200 px-3 py-1.5 uppercase tracking-wide"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={onOpenRegister}
                    className="bg-[#FFCD00] hover:bg-[#FACC15] text-[#0A1930] font-syne font-black text-xs uppercase tracking-wider py-3.5 px-6 shadow-md flex items-center gap-2 transition-all active:scale-95"
                  >
                    <span>{event.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── FINAL VENUE ── */}
        <VenueBanner />

        {/* ── BOTTOM FAQ BANNER ── */}
        <div className="p-8 sm:p-12 bg-[#013A63] text-white text-center space-y-4">
          <h3 className="font-headline font-black text-2xl uppercase tracking-tight">
            Questions About Event Attendance &amp; Schedules?
          </h3>
          <p className="text-xs sm:text-sm text-slate-200 font-light max-w-lg mx-auto leading-relaxed">
            School coordinators and parents can register student teams or request spectator passes for the Grand Finale in Västerås.
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenRegister}
              className="bg-[#FFCD00] hover:bg-[#FACC15] text-[#0A1930] font-syne font-black text-xs sm:text-sm uppercase tracking-wider py-3.5 px-8 shadow-md transition-all active:scale-95"
            >
              <span>REGISTER FOR AUTUMN 2026</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
