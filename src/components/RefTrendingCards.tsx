import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, GraduationCap, Trophy } from 'lucide-react';
import {
  roboSprintObstacleClose,
  roboPrecisionActionWide,
  roboPrecisionFacingDual,
} from '../assets/images';

interface RefTrendingCardsProps {
  onNavigate: (route: string) => void;
  onOpenRegister: () => void;
}

export const RefTrendingCards: React.FC<RefTrendingCardsProps> = ({
  onNavigate,
}) => {
  const resources = [
    {
      image: roboSprintObstacleClose,
      category: 'FOR TEACHERS & REKTORER',
      date: 'GUIDE',
      icon: BookOpen,
      title: 'How to Run the 20-Hour STEM Project in Your Classroom',
      desc: 'Learn how kits, lesson plans, and 10 structured 2-hour sessions fit into standard timetables with zero lab budget.',
      route: 'how-it-works',
      actionLabel: 'EXPLORE STEM PROGRAMME',
    },
    {
      image: roboPrecisionActionWide,
      category: 'CURRICULUM INTEGRATION',
      date: 'LGR22 & GY25',
      icon: GraduationCap,
      title: 'Lgr22 Curriculum Fit: Teknik, Matematik & NO/Fysik',
      desc: 'Review practical learning opportunities and how documented engineering reflections assist teacher assessment.',
      route: 'lgr22',
      actionLabel: 'VIEW CURRICULUM FIT',
    },
    {
      image: roboPrecisionFacingDual,
      category: 'COMPETITION RULEBOOK',
      date: 'TECHNICAL SPECS',
      icon: Trophy,
      title: 'Arena Rules, Match Scoring & Judging Weights',
      desc: 'Understand the 3-minute ball-transfer arena format for Explorer & Advanced, and the autonomous build for Precision.',
      route: 'challenges',
      actionLabel: 'VIEW TECHNICAL RULES',
    },
  ];

  return (
    <section className="w-full bg-white text-[#0A1930] py-24 px-6 sm:px-10 border-t border-slate-200 overflow-hidden">
      <div className="max-w-[1440px] mx-auto space-y-12">

        {/* ── SECTION TITLE ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200">
          <div className="space-y-2">
            <span className="text-xs font-mono-code font-bold tracking-[0.25em] text-[#006AA7] uppercase block">
              EDUCATOR &amp; COMPETITOR GUIDES
            </span>
            <h2
              className="font-headline font-black uppercase tracking-tight leading-[1.02] text-[#0A1930]"
              style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.5rem)' }}
            >
              USEFUL <span className="text-[#006AA7]">RESOURCES.</span>
            </h2>
          </div>
          <p className="text-sm text-slate-500 font-light max-w-md leading-relaxed">
            Essential documentation, curriculum maps, and rules for school principals, teachers, mentors, and competing teams.
          </p>
        </div>

        {/* ── 3-COLUMN RESOURCE CARDS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {resources.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6 }}
                onClick={() => onNavigate(item.route)}
                className="rounded-3xl p-5 bg-[#F8FAFC] border border-slate-200 space-y-4 flex flex-col justify-between hover:border-[#006AA7]/40 transition-all group cursor-pointer shadow-sm"
              >
                <div className="space-y-4">
                  <div className="relative overflow-hidden rounded-2xl h-52 bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 text-xs font-mono-code font-bold text-[#006AA7] uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                      <Icon className="w-3 h-3" />
                      <span>{item.category}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-mono-code font-bold text-slate-400 uppercase">
                      {item.date}
                    </span>
                    <h3 className="font-headline font-bold text-lg sm:text-xl uppercase tracking-wide text-[#0A1930] group-hover:text-[#006AA7] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <span className="font-headline font-bold text-xs uppercase tracking-wider text-[#006AA7] group-hover:text-[#0A1930] flex items-center gap-1.5 transition-colors">
                    <span>{item.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
