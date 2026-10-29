import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Scale, Server, Cloud, Compass } from 'lucide-react';

export const EvaluationCriteria: React.FC = () => {
  const criteria = [
    {
      weight: '35%',
      title: 'Technical Complexity & Architecture',
      code: 'RUBRIC_01',
      description: 'Sophistication of system topology, low-latency performance, algorithmic elegance, and correct implementation of non-trivial state machines or ML models.',
      subpoints: ['Algorithmic optimization', 'State synchronization', 'Zero-knowledge verification efficiency']
    },
    {
      weight: '25%',
      title: 'Novelty & Domain Innovation',
      code: 'RUBRIC_02',
      description: 'Originality of the conceptual breakthrough. Solving unresolved edge-cases rather than constructing generic wrappers around existing APIs.',
      subpoints: ['First-principles approach', 'Unexplored problem vectors', 'Proprietary IP defensibility']
    },
    {
      weight: '20%',
      title: 'Enterprise Scalability & Security',
      code: 'RUBRIC_03',
      description: 'Robustness against concurrency failures, cryptographic rigor, fault-tolerance, and automated test coverage across containerized endpoints.',
      subpoints: ['Sub-50ms latency tolerance', 'Formal verification', 'Graceful degradation under stress']
    },
    {
      weight: '20%',
      title: 'Product Polish & Presentation',
      code: 'RUBRIC_04',
      description: 'Fluidity of developer experience, clean UI execution, comprehensive documentation, and clarity of the live technical keynote presentation.',
      subpoints: ['Interactive demo deployment', 'SDK/API documentation', 'Production-grade ergonomics']
    }
  ];

  const perks = [
    {
      icon: Cloud,
      title: '$10,000 Cloud & GPU Grant',
      detail: 'Instantly provisioned H100 GPU clusters and enterprise serverless compute nodes.'
    },
    {
      icon: Server,
      title: 'Proprietary Enterprise APIs',
      detail: 'Direct access to unreleased foundation models, financial settlement pipelines & physical testbeds.'
    },
    {
      icon: Compass,
      title: '1-on-1 CTO & Venture Clinics',
      detail: 'Private architectural office hours with partners from Sequoia, a16z, and chief tech architects.'
    },
    {
      icon: ShieldCheck,
      title: 'Alumni Network & Term-Sheets',
      detail: 'Lifetime access to Apex Syndicate founders and priority consideration for $2M institutional rounds.'
    }
  ];

  return (
    <section id="criteria" className="relative w-full py-28 px-6 sm:px-10 bg-[#070709] border-t border-white/[0.08]">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-14 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono-code font-bold tracking-[0.25em] text-cyan-400 uppercase mb-3">
              <Scale className="w-3.5 h-3.5" />
              <span>OFFICIAL JURY BENCHMARK</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white leading-none">
              Judging Rubric.
            </h2>
          </div>
          <p className="max-w-md text-sm text-slate-300 font-light leading-relaxed">
            Evaluated rigorously by a 16-member global jury consisting of enterprise CTOs, principal researchers, and venture capitalists.
          </p>
        </div>

        {/* Criteria Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {criteria.map((item, idx) => (
            <motion.div
              key={item.code}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-white/[0.15] hover:bg-white/[0.04] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono-code font-bold text-indigo-400 uppercase">
                    {item.code}
                  </span>
                  <span className="font-display font-extrabold text-2xl text-white">
                    {item.weight}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-white mb-3 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-300 font-light leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.06] space-y-1.5">
                {item.subpoints.map((pt, i) => (
                  <div key={i} className="text-[13px] font-mono-code text-slate-400 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-indigo-400" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Developer Perks Strip */}
        <div id="perks" className="mt-20 pt-16 border-t border-white/[0.08]">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono-code font-bold tracking-[0.25em] text-indigo-400 uppercase block mb-2">
              COHORT PRIVILEGES
            </span>
            <h3 className="font-display font-extrabold text-2xl sm:text-4xl uppercase tracking-tight text-white">
              Every Accepted Team Receives
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map((perk, idx) => {
              const Icon = perk.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-xl bg-gradient-to-b from-[#111116] to-[#09090C] border border-white/[0.08] hover:border-indigo-500/30 transition-all flex flex-col items-start"
                >
                  <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-display font-bold text-base text-white mb-2">
                    {perk.title}
                  </h4>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    {perk.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
