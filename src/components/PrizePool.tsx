import React from 'react';
import { motion } from 'framer-motion';
import { PRIZE_TIERS, CATEGORY_AWARDS } from '../data/hackathonData';
import { Trophy, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

interface PrizePoolProps {
  onOpenRegister: () => void;
}

export const PrizePool: React.FC<PrizePoolProps> = ({ onOpenRegister }) => {
  return (
    <section id="prizes" className="relative w-full py-28 px-6 sm:px-10 bg-[#070709] border-t border-b border-white/[0.08] overflow-hidden">
      {/* Background glow matrix */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-indigo-900/10 via-cyan-900/10 to-transparent blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-[1440px] mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 text-xs font-mono-code font-bold tracking-[0.25em] text-cyan-400 uppercase mb-3">
            <Trophy className="w-3.5 h-3.5" />
            <span>NON-DILUTIVE CAPITAL ALLOCATIONS</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white leading-none">
            $1.25M Prize Pool.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            Equity-free grants, compute access vouchers, and fast-track venture review. Distributed transparently directly upon final jury evaluation.
          </p>
        </div>

        {/* Podium Visualization Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
          {/* Rank 2 - Silver Laureate */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="order-2 lg:order-1 rounded-2xl p-8 bg-gradient-to-b from-[#111116] to-[#0A0A0E] border border-white/[0.08] hover:border-white/[0.18] transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono-code font-bold tracking-[0.2em] text-slate-400 uppercase">
                  {PRIZE_TIERS[0].rank}
                </span>
                <span className="text-xs font-mono-code px-2 py-0.5 rounded bg-white/[0.05] text-slate-300 border border-white/[0.08]">
                  {PRIZE_TIERS[0].badge}
                </span>
              </div>
              <h3 className="font-display font-bold text-xl text-slate-200 uppercase tracking-tight">
                {PRIZE_TIERS[0].tierName}
              </h3>
              <div className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight my-4">
                {PRIZE_TIERS[0].amount}
              </div>
              <p className="text-xs text-slate-400 font-light leading-relaxed mb-6">
                Direct non-dilutive foundation capital awarded to the second-highest scoring team overall.
              </p>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/[0.06]">
              {PRIZE_TIERS[0].perks.map((perk, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300 font-light">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Rank 1 - Grand Champion (Elevated Podium) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2 rounded-2xl p-8 sm:p-10 bg-gradient-to-b from-[#161622] via-[#0E0E18] to-[#0A0A0E] border border-indigo-500/40 shadow-2xl shadow-indigo-950/60 relative overflow-hidden flex flex-col justify-between transform lg:-translate-y-4"
          >
            {/* Top Glowing Tag */}
            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500" />
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono-code font-bold tracking-[0.2em] text-indigo-400 uppercase">
                  {PRIZE_TIERS[1].rank}
                </span>
                <span className="text-xs font-mono-code font-bold px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 animate-pulse">
                  {PRIZE_TIERS[1].badge}
                </span>
              </div>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight">
                {PRIZE_TIERS[1].tierName}
              </h3>
              <div className="font-display font-extrabold text-5xl sm:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400 tracking-tight my-4">
                {PRIZE_TIERS[1].amount}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed mb-6">
                Apex world championship seed capital + enterprise compute bundle + direct term-sheet review by leading VC syndicates.
              </p>
            </div>

            <div className="space-y-3.5 pt-6 border-t border-indigo-500/20">
              {PRIZE_TIERS[1].perks.map((perk, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 font-light">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>

            <button
              onClick={onOpenRegister}
              className="mt-8 w-full py-3.5 rounded-xl text-xs font-display font-bold tracking-[0.15em] uppercase text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
            >
              <span>COMPETE FOR GRAND PRIZE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Rank 3 - Bronze Laureate */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="order-3 rounded-2xl p-8 bg-gradient-to-b from-[#111116] to-[#0A0A0E] border border-white/[0.08] hover:border-white/[0.18] transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono-code font-bold tracking-[0.2em] text-slate-400 uppercase">
                  {PRIZE_TIERS[2].rank}
                </span>
                <span className="text-xs font-mono-code px-2 py-0.5 rounded bg-white/[0.05] text-slate-300 border border-white/[0.08]">
                  {PRIZE_TIERS[2].badge}
                </span>
              </div>
              <h3 className="font-display font-bold text-xl text-slate-200 uppercase tracking-tight">
                {PRIZE_TIERS[2].tierName}
              </h3>
              <div className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight my-4">
                {PRIZE_TIERS[2].amount}
              </div>
              <p className="text-xs text-slate-400 font-light leading-relaxed mb-6">
                Direct grant and cloud infrastructure allocation for third-place overall honors.
              </p>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/[0.06]">
              {PRIZE_TIERS[2].perks.map((perk, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300 font-light">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Category Specific Special Awards */}
        <div className="mt-20 pt-16 border-t border-white/[0.08]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <div className="text-xs font-mono-code font-bold tracking-[0.2em] text-indigo-400 uppercase mb-1">
                SPECIALTY GRANTS // 6 CATEGORIES
              </div>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight">
                Category Awards ($300,000 Pool)
              </h3>
            </div>
            <span className="text-xs font-mono-code text-slate-400">
              $50,000 PER WINNING CATEGORY
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORY_AWARDS.map((award, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono-code text-slate-400 uppercase">
                      AWARD 0{idx + 1}
                    </span>
                    <span className="text-xs font-mono-code font-bold text-cyan-400">
                      {award.amount}
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-base text-white">
                    {award.title}
                  </h4>
                </div>
                <div className="text-[13px] font-mono-code text-slate-400 uppercase mt-4 pt-3 border-t border-white/[0.04]">
                  SPONSORED BY: {award.sponsor}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
