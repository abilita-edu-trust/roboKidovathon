import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, ShieldCheck, Trophy, Sparkles } from 'lucide-react';
import { PARTNER_LOGOS } from '../data/roboData';

interface RefManifestoProps {
  onNavigate: (route: string) => void;
}

export const RefManifesto: React.FC<RefManifestoProps> = ({ onNavigate }) => {
  const pillars = [
    {
      icon: Cpu,
      title: '20-Hour STEM Project',
      badge: 'GRADES 3–6 & 7–9',
      desc: 'Ten sessions, delivered in your classroom. Mentors bring official Robo-Sprint kits so every student builds a functioning robot.',
      action: 'STEM Programme',
      route: 'how-it-works',
    },
    {
      icon: ShieldCheck,
      title: 'Lgr22-Linked Learning',
      badge: 'CURRICULUM FIT',
      desc: 'Practical learning linked to Teknik, Matematik & Fysik in Lgr22 — with real documentation students can use in teacher assessment.',
      action: 'Lgr22 Alignment',
      route: 'lgr22',
    },
    {
      icon: Trophy,
      title: 'Grand Finale, Dec 4 & 5',
      badge: 'CITY FINAL · SEK 3,000',
      desc: 'School qualifier champions compete live in Västerås for SEK 3,000 in prizes, trophies, and certificates.',
      action: 'Event Details',
      route: 'events',
    },
  ];

  return (
    <section className="w-full bg-white text-[#0A1930] py-14 sm:py-18 px-3 sm:px-6 border-t border-slate-200 overflow-hidden">
      <div className="w-full mx-auto space-y-16">

        {/* ── MANIFESTO HEADLINE & INTRO ── */}
        <div className="text-center max-w-4xl mx-auto space-y-6">

        <div className="inline-flex items-center gap-2 text-[#006AA7] text-xs font-mono-code font-bold uppercase tracking-widest mx-auto">
            <Sparkles className="w-4 h-4" />
            <span>VÄSTERÅS FUTURE INNOVATORS 2026</span>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-syne font-extrabold uppercase tracking-tight text-[#0A1930] leading-[1.15] text-center flex flex-col items-center justify-center space-y-1 sm:space-y-1.5"
            style={{ fontSize: 'clamp(1.6rem, 5.5vw, 3.8rem)' }}
          >
            <span className="whitespace-nowrap">REAL HARDWARE.</span>
            <span className="whitespace-nowrap text-[#006AA7]">REAL ENGINEERING.</span>
            <span className="whitespace-nowrap">REAL COMPETITION.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-sm sm:text-base text-slate-600 font-light leading-relaxed max-w-2xl mx-auto"
          >
            Real motors, gearboxes, and chassis — building engineering intuition and team confidence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-2 flex flex-wrap items-center justify-center gap-3"
          >
            <button
              onClick={() => onNavigate('for-schools')}
              className="btn-pill-lime text-xs sm:text-sm font-bold py-3.5 px-7 flex items-center gap-2 shadow-md"
            >
              <span>EXPLORE FOR SCHOOLS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="btn-pill-outline text-xs sm:text-sm font-bold py-3.5 px-6 flex items-center gap-2"
            >
              <span>ABOUT THE LEAGUE</span>
            </button>
          </motion.div>
        </div>

        {/* ── 3-COLUMN VALUE PILLARS BENTO ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, borderColor: 'rgba(0, 106, 167, 0.3)' }}
                className="p-8 bg-[#F8FAFC] border border-slate-200 space-y-4 flex flex-col justify-between hover:border-[#006AA7]/30 transition-all shadow-sm"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-[#006AA7]/10 border border-[#006AA7]/20 flex items-center justify-center text-[#006AA7]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono-code font-bold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 uppercase tracking-wider">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="font-syne font-bold text-lg sm:text-xl text-[#0A1930] uppercase tracking-wide">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <button
                    onClick={() => onNavigate(pillar.route)}
                    className="text-xs font-bold text-[#006AA7] hover:text-[#0A1930] inline-flex items-center gap-1.5 transition-colors uppercase font-mono-code"
                  >
                    <span>{pillar.action}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── HOST & PARTNER LOGO STRIP ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="pt-12 border-t border-slate-200 text-center space-y-6"
        >
          <span className="block text-[10px] font-mono-code font-bold tracking-[0.25em] text-slate-500 uppercase">
            HOSTED &amp; PRESENTED BY
          </span>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14">
            {PARTNER_LOGOS.map((logo) => (
              <motion.div
                key={logo.name}
                whileHover={{ scale: 1.06 }}
                className="flex flex-col items-center gap-2 transition-all"
              >
                <img
                  src={logo.file}
                  alt={logo.name}
                  className="h-9 sm:h-11 w-auto object-contain transition-all"
                />
                <span className="text-[9px] font-mono-code text-slate-500 uppercase tracking-wide">
                  {logo.role}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};
