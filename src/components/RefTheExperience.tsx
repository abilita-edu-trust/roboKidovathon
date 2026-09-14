import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Bot,
  Lightbulb,
} from 'lucide-react';

interface RefTheExperienceProps {
  onNavigate: (route: string) => void;
  onOpenRegister?: () => void;
}

export const RefTheExperience: React.FC<RefTheExperienceProps> = ({
  onNavigate,
  onOpenRegister,
}) => {
  const experiences = [
    {
      id: 'robokidovation',
      date: 'FRIDAY · 13 NOVEMBER',
      subdate: 'DAY 01 // HANDS-ON ROBOTICS',
      title: 'RoboKidovation',
      subtitle: 'Robot Building & Arena Competition',
      description:
        'Learn STEM by building, testing and improving a working robot, then apply the learning in the Robo-Sprint challenge.',
      gradient:
        'bg-gradient-to-br from-[#005B94] via-[#006AA7] to-[#0284C7]',
      border: 'border-[#38BDF8]/30 hover:border-[#38BDF8]/60',
      glow: 'hover:shadow-[0_25px_60px_rgba(0,106,167,0.35)]',
      badgeBg: 'bg-white/15 text-white border-white/20',
      tagBg: 'bg-white/12 hover:bg-white/20 text-white border-white/20',
      buttonBg:
        'bg-white text-[#0A1930] hover:bg-[#FFCD00] hover:text-[#0A1930]',
      icon: Bot,
      iconColor: 'text-[#38BDF8]',
      tags: ['Grades 4–6', 'Grades 7–9', 'Robo-Sprint', 'Lgr22 connections'],
      cta: 'Explore RoboKidovation',
      route: 'challenges',
    },
    {
      id: 'hackathon',
      date: 'SATURDAY · 14 NOVEMBER',
      subdate: 'DAY 02 // OPEN INNOVATION',
      title: 'Young Innovators Hackathon',
      subtitle: 'Real-World STEM Innovation Challenge',
      description:
        'A one-day innovation challenge where teams identify a real-world problem, develop a concept or prototype, and pitch their solution.',
      gradient:
        'bg-gradient-to-br from-[#047857] via-[#0D9488] to-[#059669]',
      border: 'border-[#34D399]/30 hover:border-[#34D399]/60',
      glow: 'hover:shadow-[0_25px_60px_rgba(13,148,136,0.35)]',
      badgeBg: 'bg-white/15 text-white border-white/20',
      tagBg: 'bg-white/12 hover:bg-white/20 text-white border-white/20',
      buttonBg:
        'bg-white text-[#0A1930] hover:bg-[#FFCD00] hover:text-[#0A1930]',
      icon: Lightbulb,
      iconColor: 'text-[#34D399]',
      tags: ['Science', 'Technology', 'Sustainability', 'Entrepreneurship'],
      cta: 'Explore the Hackathon',
      route: 'workflow',
    },
  ];

  return (
    <section
      id="choose-experience"
      className="w-full bg-white text-[#0A1930] py-12 sm:py-16 px-3 sm:px-5 lg:px-6 select-none relative overflow-hidden border-t border-slate-200"
    >
      {/* Technical Blueprint Grid Accent */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'linear-gradient(to right, #006AA70F 1px, transparent 1px), linear-gradient(to bottom, #006AA70F 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="w-full mx-auto space-y-12 relative z-10">

        {/* ── 01. SECTION HEADER ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-mono-code font-bold tracking-[0.25em] text-[#006AA7] uppercase block">
              EVENT PATHWAYS
            </span>

            <div className="relative inline-block">
              <h2
                className="font-headline font-black uppercase tracking-tight text-[#0A1930] leading-[1.02]"
                style={{ fontSize: 'clamp(2.4rem, 5.2vw, 4.4rem)' }}
              >
                CHOOSE YOUR <span className="text-[#006AA7]">EXPERIENCE</span>
              </h2>
            </div>

            <p className="text-sm text-slate-600 font-light leading-relaxed max-w-md pt-1">
              Two paths, one championship. Pick the experience that suits your school.
            </p>
          </div>
        </div>

        {/* ── 02. TWO PRIMARY EXPERIENCE CARDS (SIDE-BY-SIDE) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch">
          {experiences.map((exp, idx) => {
            const Icon = exp.icon;
            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className={`p-7 sm:p-8 text-white border-2 shadow-xl flex flex-col justify-between space-y-6 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group ${exp.gradient} ${exp.border} ${exp.glow}`}
              >
                {/* Ambient Radial Accent */}
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-black/10 blur-3xl pointer-events-none" />

                {/* Card Top: Date & Category Icon */}
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between gap-3 border-b border-white/15 pb-4">
                    <span className="text-xs sm:text-sm font-mono-code font-black uppercase tracking-wider text-white border-l-2 border-[#FFCD00] pl-2.5 inline-block">
                      {exp.date}
                    </span>

                    <div className="w-10 h-10 bg-white/15 border border-white/20 flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-110">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-3">
                    <h3 className="font-headline font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.05]">
                      {exp.title}
                    </h3>
                    <p className="text-sm sm:text-base text-white/90 font-light leading-relaxed max-w-xl">
                      {exp.description}
                    </p>
                  </div>

                  {/* Tag Cloud */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-mono-code font-semibold px-3 py-1.5 border border-white/20 bg-white/10 text-white"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Bottom: CTA Button */}
                <div className="pt-6 border-t border-white/15 relative z-10 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => onNavigate(exp.route)}
                    className={`font-bold text-xs sm:text-sm py-3.5 px-7 inline-flex items-center gap-2.5 transition-all duration-300 shadow-md ${exp.buttonBg}`}
                  >
                    <span>{exp.cta}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>

                  <div className="flex items-center gap-4">
                    {onOpenRegister && (
                      <button
                        onClick={onOpenRegister}
                        className="text-xs font-mono-code font-bold uppercase tracking-wider text-white/80 hover:text-white underline underline-offset-4 transition-colors"
                      >
                        Register Team
                      </button>
                    )}
                    <span className="text-[11px] font-mono-code uppercase text-white/70 font-semibold tracking-wider hidden md:inline-block">
                      {exp.subdate}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
