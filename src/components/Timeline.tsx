import React from 'react';
import { motion } from 'framer-motion';
import { TIMELINE_DATA } from '../data/hackathonData';
import { Clock, Calendar, Check, FileCode } from 'lucide-react';

export const Timeline: React.FC = () => {
  return (
    <section id="timeline" className="relative w-full py-28 px-6 sm:px-10 bg-black z-10">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-14 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono-code font-bold tracking-[0.25em] text-indigo-400 uppercase mb-3">
              <Calendar className="w-3.5 h-3.5" />
              <span>COHORT 2026 // EXECUTION TIMELINE</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white leading-none">
              Milestone Roadmap.
            </h2>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono-code text-slate-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>SYNCHRONIZED GLOBAL TIMEZONE: UTC</span>
          </div>
        </div>

        {/* Vertical Timeline Spindle */}
        <div className="relative mt-16 max-w-5xl mx-auto">
          {/* Neon Spine Line */}
          <div className="absolute left-4 sm:left-1/2 top-4 bottom-8 w-[2px] -translate-x-1/2 bg-gradient-to-b from-indigo-500 via-cyan-500/60 to-slate-800 shadow-[0_0_12px_rgba(99,102,241,0.5)]" />

          <div className="space-y-12 sm:space-y-16">
            {TIMELINE_DATA.map((item, index) => {
              const isEven = index % 2 === 0;
              const isActive = item.status === 'active';
              const isCompleted = item.status === 'completed';

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex flex-col sm:flex-row items-start ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Center Node */}
                  <div className="absolute left-4 sm:left-1/2 top-6 -translate-x-1/2 z-20 flex items-center justify-center">
                    {isActive ? (
                      <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center shadow-[0_0_20px_#06B6D4] animate-pulse">
                        <div className="w-3.5 h-3.5 rounded-full bg-cyan-400" />
                      </div>
                    ) : isCompleted ? (
                      <div className="w-6 h-6 rounded-full bg-indigo-600 border border-indigo-400 flex items-center justify-center shadow-[0_0_10px_#6366F1]">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-[#111116] border border-white/20" />
                    )}
                  </div>

                  {/* Spacer for Alternate side */}
                  <div className="hidden sm:block sm:w-1/2" />

                  {/* Content Card */}
                  <div
                    className={`w-full sm:w-1/2 pl-12 sm:pl-0 ${
                      isEven ? 'sm:pr-12 sm:text-right' : 'sm:pl-12 sm:text-left'
                    }`}
                  >
                    <div
                      className={`p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#111118] to-[#08080C] border transition-all duration-300 ${
                        isActive
                          ? 'border-cyan-500/40 shadow-2xl shadow-cyan-950/40'
                          : 'border-white/[0.08] hover:border-white/[0.15]'
                      }`}
                    >
                      {/* Meta Header */}
                      <div
                        className={`flex flex-wrap items-center gap-2 mb-3 ${
                          isEven ? 'sm:justify-end' : 'sm:justify-start'
                        }`}
                      >
                        <span
                          className={`text-xs font-mono-code font-bold px-2 py-0.5 rounded uppercase ${
                            isActive
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                              : isCompleted
                              ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                              : 'bg-white/[0.04] text-slate-400 border border-white/[0.08]'
                          }`}
                        >
                          {item.phase}
                        </span>

                        <div className="flex items-center gap-1.5 text-xs font-mono-code text-slate-300">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.date} · {item.time}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight">
                        {item.title}
                      </h3>

                      <p className="mt-3 text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                        {item.description}
                      </p>

                      {/* Deliverables tags */}
                      <div className="mt-5 pt-4 border-t border-white/[0.06]">
                        <div
                          className={`flex items-center gap-2 mb-2 text-xs font-mono-code text-slate-400 uppercase ${
                            isEven ? 'sm:justify-end' : 'sm:justify-start'
                          }`}
                        >
                          <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                          <span>MANDATORY DELIVERABLES</span>
                        </div>
                        <div
                          className={`flex flex-wrap gap-1.5 ${
                            isEven ? 'sm:justify-end' : 'sm:justify-start'
                          }`}
                        >
                          {item.deliverables.map((deliv, i) => (
                            <span
                              key={i}
                              className="text-xs font-mono-code px-2 py-0.5 rounded bg-black/40 text-slate-300 border border-white/[0.05]"
                            >
                              {deliv}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
