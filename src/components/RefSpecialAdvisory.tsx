import React from 'react';
import { motion } from 'framer-motion';
import { Award, Calendar, Trophy, Sparkles, FileText } from 'lucide-react';
import { CHAMPIONSHIP_STAGES } from '../data/roboData';

const FRAMEWORK_STEPS = [
  'Explore Components',
  'Build The Robot',
  'Test Movement',
  'Improve Design',
  'School Qualifiers',
  'City Grand Finale',
];

interface RefSpecialAdvisoryProps {
  onNavigate?: (route: string) => void;
  onOpenDeckModal?: () => void;
}

export const RefSpecialAdvisory: React.FC<RefSpecialAdvisoryProps> = ({
  onNavigate = () => {},
  onOpenDeckModal = () => {},
}) => {
  return (
    <section id="advisory-section" className="w-full bg-[#F2F6FA] text-[#0A1930] py-24 sm:py-28 px-6 sm:px-10 border-t border-slate-200 overflow-hidden scroll-mt-24">
      <div className="max-w-[1280px] mx-auto space-y-16">

        {/* ── HEADER ── */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono-code font-bold tracking-[0.25em] text-[#006AA7] uppercase block">
            OFFICIAL LAUNCH &amp; INSTITUTIONAL FRAMEWORK
          </span>
          <h2
            className="font-headline font-black uppercase tracking-tight leading-[1.02]"
            style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.5rem)' }}
          >
            <span className="text-stroke block">SPECIAL</span>
            <span className="text-[#0A1930] block">ADVISORY</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed max-w-xl mx-auto">
            Västerås Future Innovators 2026 is organized by Indisk BarnKlubb (IBK) Västerås alongside INIAC and SkillSkolan, with Blix as technology and kit partner — turning STEM concepts into something students build, test, improve, and compete with.
          </p>
        </div>

        {/* ── AMBASSADOR LAUNCH CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl bg-white border border-slate-200 shadow-sm p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          <div className="lg:col-span-2 flex justify-center lg:justify-start">
            <div className="w-16 h-16 rounded-2xl bg-[#FFCD00]/20 border border-[#FFCD00]/50 flex items-center justify-center text-[#0A1930]">
              <Award className="w-8 h-8 text-[#006AA7]" />
            </div>
          </div>
          <div className="lg:col-span-10 space-y-2 text-center lg:text-left">
            <span className="text-xs font-mono-code font-bold tracking-[0.2em] text-[#006AA7] uppercase block">
              OFFICIAL PATRONAGE &amp; LAUNCH
            </span>
            <h3 className="font-headline font-black text-xl sm:text-2xl uppercase tracking-tight text-[#0A1930]">
              H.E. Ambassador Anurag Bhushan
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
              Ambassador of India to Sweden &amp; Latvia — formally launching Västerås Future Innovators 2026 and addressing participating students, educators, and community representatives.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="text-[13px] font-mono-code font-bold text-[#0A1930] bg-[#FFCD00]/30 border border-[#FFCD00]/60 px-3 py-1 rounded-full uppercase tracking-wide">
                Theme: Bringing Schools Together Through Robotics
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── FRAMEWORK FLOW ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-2 justify-center text-[#006AA7]">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-mono-code font-bold tracking-[0.2em] uppercase">
              From Classroom Learning To City Competition
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {FRAMEWORK_STEPS.map((step, i) => (
              <div
                key={step}
                className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 text-center space-y-1 flex flex-col justify-center"
              >
                <span className="text-xs font-mono-code font-bold text-[#006AA7]">
                  0{i + 1}
                </span>
                <span className="font-syne font-bold text-xs text-[#0A1930] uppercase tracking-wide">
                  {step}
                </span>
              </div>
            ))}
          </div>

          <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed max-w-2xl mx-auto text-center">
            The Robo-Sprint arena format is adapted from Blix-A-Thon, proven at Techfest, IIT Bombay. In Västerås it is delivered as INIAC's dedicated STEM programme and pedagogy, with Blix supplying the reusable hardware kit as technology partner.
          </p>
        </motion.div>

        {/* ── TWO-STAGE COMPETITION STRUCTURE ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CHAMPIONSHIP_STAGES.map((stage) => (
            <motion.div
              key={stage.stageNumber}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl bg-white border border-slate-200 shadow-sm p-8 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[#006AA7]">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-mono-code font-bold tracking-[0.2em] uppercase">
                      {stage.stageCode} · {stage.date}
                    </span>
                  </div>
                  <span className="text-xs font-mono-code font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                    {stage.location}
                  </span>
                </div>

                <h3 className="font-headline font-black text-lg sm:text-xl uppercase tracking-tight text-[#0A1930]">
                  {stage.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                  {stage.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 text-[13px] font-mono-code font-bold text-[#006AA7] uppercase tracking-wide">
                {stage.advancement}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── CREDIBILITY & KIT RESOURCE BANNER ── */}
        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-[#006AA7]">
              <Trophy className="w-4 h-4" />
              <span className="text-xs font-mono-code font-bold uppercase tracking-wider">
                COMPETITION SPECIFICATIONS &amp; INVENTORY
              </span>
            </div>
            <h3 className="font-headline font-black text-xl uppercase tracking-tight text-[#0A1930]">
              Official Kit Inventories &amp; Arena Blueprints
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-light max-w-xl">
              Detailed hardware piece inventories (41+ part types including DC gearmotors, wired transmitters, chassis beams, and axles) and 3D arena blueprints are available in the rulebook and downloadable event prospectus.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('challenges')}
              className="w-full sm:w-auto btn-pill-lime text-xs font-bold py-3.5 px-6"
            >
              <span>VIEW KIT &amp; TECHNICAL DETAILS</span>
            </button>
            <button
              onClick={onOpenDeckModal}
              className="w-full sm:w-auto btn-pill-outline text-xs font-bold py-3.5 px-5 flex items-center justify-center gap-2"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>DOWNLOAD DECK (PDF)</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
