import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShieldCheck, BookOpen, Layers, Eye, X, ChevronDown, CheckCircle2 } from 'lucide-react';
import { COMPETITION_CATEGORIES, CompetitionCategory } from '../data/roboData';

interface ChallengesPageProps {
  onNavigateHome: () => void;
  onOpenRegister: () => void;
  onOpenDeckModal: () => void;
}

export const ChallengesPage: React.FC<ChallengesPageProps> = ({
  onNavigateHome,
  onOpenRegister,
  onOpenDeckModal,
}) => {
  const [zoomImage, setZoomImage] = useState<{ src: string; title: string } | null>(null);
  const [openCats, setOpenCats] = useState<Set<string>>(
    new Set(['robo-sprint-explorer', 'robo-sprint-advanced'])
  );

  const toggleCat = (id: string) =>
    setOpenCats((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const TRACK_SUMMARY = [
    {
      id: 'robo-sprint-explorer',
      title: 'Robo-Sprint Explorer',
      grades: 'Grades 3–6',
      format: '3 Min · Ball-Transfer',
      control: 'Wired Dual-Switch Remote',
      arena: '244 × 122 cm Divided Mat',
      focus: 'Mechanical Assembly & Driving Teamwork',
    },
    {
      id: 'robo-sprint-advanced',
      title: 'Robo-Sprint Advanced',
      grades: 'Grades 7–9',
      format: '3 Min · Obstacle Agility',
      control: 'Wired Multi-Channel Controller',
      arena: '244 × 122 cm Divided Mat with Arches',
      focus: 'Gearing, Torque, Speed & Match Tactics',
    },
    {
      id: 'robo-precision',
      title: 'Robo-Precision',
      grades: 'Gymnasium (15+)',
      format: '5 Min · Autonomous Build',
      control: 'Autonomous Coded Sequence',
      arena: 'Podium Stacking Arena',
      focus: 'Crane Kinematics, Autonomy & Software',
    },
  ];

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
            OFFICIAL TECHNICAL SPECIFICATIONS &amp; ARENA REGULATIONS // 2026 SEASON
          </span>

          <h1
            className="font-headline font-black uppercase tracking-tight leading-[1.02]"
            style={{ fontSize: 'clamp(3.2rem, 7.5vw, 6.5rem)' }}
          >
            <span className="text-stroke block">TECHNICAL</span>
            <span className="text-[#0A1930] block">RULEBOOK</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 font-light max-w-2xl leading-relaxed">
            Standardized Swedish school arena regulations. Explorer and Advanced share the official 244 × 122 cm (8 × 4 ft) ball-transfer court in head-to-head 3-minute heats. Robo-Precision is an autonomous challenge for gymnasium competitors.
          </p>
        </motion.div>

        {/* ── QUICK TRACK COMPARISON MATRIX ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline font-black text-xl sm:text-2xl uppercase tracking-tight text-[#0A1930]">
              Track Quick Reference
            </h2>
            <span className="text-[11px] font-mono-code text-slate-500 uppercase">
              Select a track below to inspect technical rules
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 bg-[#F8FAFC]">
            <table className="w-full text-left text-xs font-mono-code border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100 text-[#0A1930] font-bold">
                  <th className="p-4 uppercase">Track</th>
                  <th className="p-4 uppercase">Grades</th>
                  <th className="p-4 uppercase">Format</th>
                  <th className="p-4 uppercase">Control</th>
                  <th className="p-4 uppercase">Arena</th>
                  <th className="p-4 uppercase">Focus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {TRACK_SUMMARY.map((row) => (
                  <tr key={row.id} className="hover:bg-white transition-colors">
                    <td className="p-4 font-bold text-[#006AA7]">{row.title}</td>
                    <td className="p-4 text-slate-700">{row.grades}</td>
                    <td className="p-4 text-slate-700">{row.format}</td>
                    <td className="p-4 text-slate-700">{row.control}</td>
                    <td className="p-4 text-slate-700">{row.arena}</td>
                    <td className="p-4 text-slate-700">{row.focus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── DETAILED CHALLENGE CATEGORY CARDS (SIDE-BY-SIDE HORIZONTAL LAYOUT) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 items-stretch">
          {COMPETITION_CATEGORIES.map((cat: CompetitionCategory, idx: number) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="border border-slate-200 overflow-hidden bg-white shadow-md flex flex-col justify-between"
            >
              <div>
                {/* Category Banner */}
                <div className="relative h-56 sm:h-64 overflow-hidden bg-[#0A1930]">
                  <img
                    src={cat.imageUrl}
                    alt={cat.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1930] via-[#0A1930]/60 to-transparent" />

                  <div className="absolute bottom-5 left-5 sm:left-6 right-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1.5 font-mono-code font-bold text-xs uppercase tracking-wider">
                        <span className="text-[#FFCD00]">
                          {cat.ageRange}
                        </span>
                        <span className="text-white/70">·</span>
                        <span className="text-white">
                          {cat.division}
                        </span>
                      </div>
                      <h2 className="font-headline font-black text-xl sm:text-2xl lg:text-3xl uppercase tracking-tight text-white">
                        {cat.title}
                      </h2>
                    </div>

                    <span className="font-mono-code font-bold text-xs uppercase tracking-widest text-[#FFCD00] shrink-0">
                      {cat.specs[0].value}
                    </span>
                  </div>
                </div>

                {/* Technical Specifications Strip */}
                <div className="p-4 sm:p-6 border-t border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3 bg-[#F8FAFC]">
                  {cat.specs.map((s: { label: string; value: string }) => (
                    <div
                      key={s.label}
                      className="p-3 bg-white border border-slate-200 space-y-0.5"
                    >
                      <span className="block text-[9px] font-mono-code font-bold text-[#006AA7] uppercase">
                        {s.label}
                      </span>
                      <span className="block text-xs font-headline font-bold text-[#0A1930] uppercase tracking-wider">
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Toggle Strip */}
                <button
                  type="button"
                  onClick={() => toggleCat(cat.id)}
                  aria-expanded={openCats.has(cat.id)}
                  className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-3.5 bg-[#F8FAFC] border-t border-slate-200 hover:bg-slate-100 transition-colors"
                >
                  <span className="font-headline font-bold text-xs uppercase tracking-wider text-[#0A1930]">
                    {openCats.has(cat.id) ? 'Hide' : 'Inspect'} Specifications &amp; Rules
                  </span>
                  <motion.div animate={{ rotate: openCats.has(cat.id) ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronDown className="w-4 h-4 text-[#006AA7] shrink-0" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {openCats.has(cat.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 sm:p-6 space-y-6 bg-white border-t border-slate-200">
                        {/* Requirements */}
                        <div className="space-y-3">
                          <h3 className="font-headline font-black text-sm uppercase tracking-wider text-[#0A1930] flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-[#006AA7]" />
                            <span>ROBOT SPECIFICATIONS &amp; RULES</span>
                          </h3>
                          <ul className="space-y-2 text-xs text-slate-600 font-light leading-relaxed">
                            {cat.robotRequirements.map((rule) => (
                              <li key={rule} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#006AA7] shrink-0 mt-0.5" />
                                <span>{rule}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Judging Weights */}
                        <div className="space-y-3 pt-4 border-t border-slate-100">
                          <h3 className="font-headline font-black text-sm uppercase tracking-wider text-[#0A1930]">
                            JUDGING WEIGHTS
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {cat.judgingWeights.map((j) => (
                              <div key={j.label} className="flex items-center justify-between text-xs font-mono-code p-2.5 bg-[#F8FAFC] border border-slate-200">
                                <span className="text-slate-600">{j.label}</span>
                                <span className="font-bold text-[#006AA7]">{j.pct}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Card CTAs */}
                        <div className="flex flex-col sm:flex-row gap-2.5 pt-4 border-t border-slate-100">
                          <button
                            onClick={onOpenRegister}
                            className="btn-pill-lime text-xs font-black py-3 px-6 shadow-md flex-1 text-center"
                          >
                            <span>REGISTER COHORT</span>
                          </button>
                          <button
                            onClick={onOpenDeckModal}
                            className="btn-pill-outline text-xs font-bold py-3 px-5 flex items-center justify-center gap-2 flex-1"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>DOWNLOAD SPECS</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Blueprint & Schematic Row */}
              {cat.arenaMatUrl && cat.kitImageUrl && (
                <div className="p-5 sm:p-6 bg-[#F8FAFC] border-t border-slate-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="w-4 h-4 text-[#006AA7]" />
                    <span className="text-[10px] font-mono-code font-bold text-[#006AA7] uppercase tracking-widest">
                      SCHEMATIC BLUEPRINTS &amp; INVENTORY
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Arena Mat Preview */}
                    <div
                      onClick={() =>
                        setZoomImage({
                          src: cat.arenaMatFocusUrl || cat.arenaMatUrl!,
                          title: `${cat.title} - Official 244 × 122 cm Arena Blueprint`,
                        })
                      }
                      className="p-3.5 bg-white border border-slate-200 group cursor-pointer space-y-2.5 shadow-xs hover:border-[#006AA7]/40 transition-all flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono-code font-bold text-[#006AA7] uppercase">
                          244 × 122 cm ARENA MAT
                        </span>
                        <span className="text-[9px] font-mono-code text-[#006AA7] flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>EXPAND</span>
                        </span>
                      </div>
                      <div className="relative overflow-hidden bg-white p-2 border border-slate-100 flex items-center justify-center min-h-[120px]">
                        <img
                          src={cat.arenaMatFocusUrl || cat.arenaMatUrl}
                          alt={`${cat.title} Arena Mat`}
                          className="w-full h-28 sm:h-32 object-contain mx-auto group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="text-[10px] font-mono-code text-slate-500 flex justify-between">
                        <span>2.44 m × 1.22 m</span>
                        <span className="text-[#006AA7] font-bold">OFFICIAL SPEC</span>
                      </div>
                    </div>

                    {/* Kit Piece Inventory */}
                    <div
                      onClick={() =>
                        setZoomImage({
                          src: cat.kitImageUrl!,
                          title: `${cat.title} - Official Hardware Kit Inventory`,
                        })
                      }
                      className="p-3.5 bg-white border border-slate-200 group cursor-pointer space-y-2.5 shadow-xs hover:border-[#006AA7]/40 transition-all flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono-code font-bold text-[#006AA7] uppercase">
                          OFFICIAL HARDWARE KIT
                        </span>
                        <span className="text-[9px] font-mono-code text-[#006AA7] flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>EXPAND</span>
                        </span>
                      </div>
                      <div className="relative overflow-hidden bg-white p-2 border border-slate-100 flex items-center justify-center min-h-[120px]">
                        <img
                          src={cat.kitImageUrl}
                          alt={`${cat.title} Kit Pieces`}
                          className="w-full h-28 sm:h-32 object-contain mx-auto group-hover:scale-[1.02] transition-transform duration-300"
                        />
                      </div>
                      <div className="text-[10px] font-mono-code text-slate-500 flex justify-between">
                        <span>41+ COMPONENTS</span>
                        <span className="text-[#0A1930] font-bold">CLICK TO ZOOM</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* ── GENERAL ARENA RULES & PENALTIES ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 border border-slate-200 bg-white p-8 space-y-4 shadow-sm">
            <h3 className="font-headline font-black text-lg uppercase tracking-wider text-[#0A1930]">
              General Match Regulations
            </h3>
            <ol className="space-y-2 text-xs sm:text-sm text-slate-600 font-light leading-relaxed list-decimal list-inside">
              <li>Both robots must start fully inside their designated starting perimeter.</li>
              <li>Students may only touch the robot prior to referee match countdown.</li>
              <li>During play, robots must be controlled exclusively via the designated remote or autonomous code.</li>
              <li>Students may not step into the arena or physically interact with game balls.</li>
              <li>If a machine is disabled, the referee may permit one controlled reset to the start box without stopping the match timer.</li>
              <li>Robots may push or redirect balls, but cannot permanently trap or enclose them.</li>
              <li>A ball scores when it has completely crossed the central barrier line into the opponent half.</li>
            </ol>
          </div>

          <div className="lg:col-span-4 border border-slate-200 bg-[#013A63] p-8 space-y-4 text-white shadow-sm">
            <h3 className="font-headline font-black text-lg uppercase tracking-wider text-[#FFCD00]">
              Infringements &amp; Fair Play
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-200 font-light leading-relaxed">
              <li><span className="font-bold text-[#FFCD00]">Minor Infringement</span> — Official referee warning</li>
              <li><span className="font-bold text-[#FFCD00]">Repeated Infringement</span> — &minus;5 point penalty deduction</li>
              <li><span className="font-bold text-[#FFCD00]">Deliberate Arena Interference</span> — Forfeiture of match</li>
              <li><span className="font-bold text-[#FFCD00]">Intentional Damage</span> — Disqualification by head referee</li>
            </ul>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="p-8 sm:p-12 bg-[#F8FAFC] border border-slate-200 text-center space-y-5">
          <h3 className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#0A1930]">
            Need Clarification On Specific Track Rules?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-light max-w-xl mx-auto leading-relaxed">
            Our technical mentors are available to answer questions from teachers and coordinators regarding robot build dimensions, gearing, or arena setups.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onOpenRegister}
              className="btn-pill-lime text-xs sm:text-sm font-black py-3.5 px-8"
            >
              <span>REGISTER SCHOOL / TEAM</span>
            </button>
            <button
              onClick={onNavigateHome}
              className="btn-pill-outline text-xs sm:text-sm font-bold py-3.5 px-6"
            >
              <span>RETURN TO MAIN PORTAL</span>
            </button>
          </div>
        </div>

      </div>

      {/* ── HIGH RES SCHEMATIC LIGHTBOX MODAL ── */}
      <AnimatePresence>
        {zoomImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 select-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setZoomImage(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-4xl w-full max-h-[90vh] bg-white overflow-hidden shadow-2xl z-10 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 bg-slate-50">
                <h3 className="font-syne font-bold text-base sm:text-lg text-[#0A1930] uppercase">
                  {zoomImage.title}
                </h3>
                <button
                  onClick={() => setZoomImage(null)}
                  className="p-2 text-slate-500 hover:text-[#0A1930] hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-white max-h-[70vh]">
                <img
                  src={zoomImage.src}
                  alt={zoomImage.title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="p-4 border-t border-slate-200 text-right bg-slate-50">
                <button
                  onClick={() => setZoomImage(null)}
                  className="px-5 py-2 bg-[#0A1930] text-white font-mono-code text-xs uppercase"
                >
                  CLOSE WINDOW
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
