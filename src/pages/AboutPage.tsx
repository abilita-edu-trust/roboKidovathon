import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ShieldCheck, Award, MapPin, Sparkles } from 'lucide-react';
import { bannerActionStripCollage } from '../assets/images';
import { PARTNER_LOGOS } from '../data/roboData';

interface AboutPageProps {
  onOpenRegister: () => void;
  onNavigateHome: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onOpenRegister,
  onNavigateHome,
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
            LEAGUE ORIGINS, PARTNERS &amp; MISSION // VÄSTERÅS 2026
          </span>

          <h1
            className="font-headline font-black uppercase tracking-tight leading-[1.02]"
            style={{ fontSize: 'clamp(3.2rem, 7.5vw, 6.5rem)' }}
          >
            <span className="text-stroke block">ABOUT</span>
            <span className="text-[#0A1930] block">THE LEAGUE</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 font-light max-w-2xl leading-relaxed">
            INIAC's hands-on STEM programme and Västerås Future Innovators competition pathway for students in Västerås — turning STEM concepts into something students can build, test, improve, and compete with.
          </p>
        </motion.div>

        {/* ── STORY & PHILOSOPHY GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Narrative Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-6"
          >
            <h2 className="font-headline font-black text-2xl sm:text-3xl text-[#0A1930] uppercase tracking-tight">
              From Abstract Screen Exercises to Real Classroom Engineering
            </h2>

            <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed">
              Västerås Future Innovators 2026 is organized by Indisk BarnKlubb (IBK) Västerås alongside INIAC as programme and pedagogy partner, and SkillSkolan as education delivery partner, with Blix supplying the reusable hardware kit as technology partner.
            </p>

            <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed">
              The Robo-Sprint arena format is adapted from Blix-A-Thon, hosted at Techfest, IIT Bombay — engaging 2,000+ students in recent editions. In Västerås, it has been structured specifically for Swedish school curriculum standards (Lgr22 and Gy25).
            </p>

            <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed">
              Rather than screen simulators, students receive physical gearmotors, remote controllers, chassis beams, axles, and roll-out arenas. They build, wire, test, measure, and compete under fair-play referee rules.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-[#F8FAFC] border border-slate-200 flex items-center gap-3">
                <Award className="w-5 h-5 text-[#006AA7] shrink-0" />
                <span className="text-xs font-mono-code font-bold text-[#0A1930] uppercase">
                  Explorer &amp; Advanced Leagues
                </span>
              </div>
              <div className="p-4 bg-[#F8FAFC] border border-slate-200 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#006AA7] shrink-0" />
                <span className="text-xs font-mono-code font-bold text-[#0A1930] uppercase">
                  Lgr22 &amp; Gy25 Alignment
                </span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenRegister}
                className="btn-pill-lime text-xs font-black py-3.5 px-8 flex items-center gap-2 shadow-md"
              >
                <span>REGISTER SCHOOL / TEAM</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Visual Column: Authentic Action Strip Collage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 space-y-4"
          >
            <div className="relative overflow-hidden border-2 border-slate-200 bg-[#0A1930] shadow-xl group aspect-[9/13] max-h-[580px] flex items-center justify-center">
              <img
                src={bannerActionStripCollage}
                alt="Blix-A-Thon hands-on building to arena competition"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Floating Badge */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <span className="bg-[#0A1930]/90 backdrop-blur-md text-[#FFCD00] text-[10px] font-mono-code font-bold px-3 py-1.5 border border-white/10 shadow-md uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>BLIX-A-THON ACTION REEL</span>
                </span>
              </div>

              {/* Bottom Caption Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-[#0A1930] via-[#0A1930]/80 to-transparent">
                <span className="text-[10px] font-mono-code font-bold text-[#FFCD00] uppercase block mb-1">
                  FROM WORKBENCH TO ARENA PODIUM
                </span>
                <p className="font-syne font-bold text-sm sm:text-base text-white uppercase tracking-tight leading-snug">
                  Real students assembling, racing &amp; stacking in live tournament heats
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#F8FAFC] border border-slate-200 flex items-center justify-between text-xs font-mono-code text-slate-500">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#006AA7]" />
                <span>MÄLARDALEN INTERNATIONAL SCHOOL, VÄSTERÅS</span>
              </span>
              <span className="font-bold text-[#0A1930]">DECEMBER 5, 2026</span>
            </div>
          </motion.div>
        </div>

        {/* ── ORGANIZING PARTNERS ── */}
        <div className="space-y-8 pt-8 border-t border-slate-200">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] font-mono-code font-bold tracking-[0.2em] text-[#006AA7] uppercase block">
              COLLABORATIVE ECOSYSTEM
            </span>
            <h2 className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#0A1930]">
              The Four Organizing Partners
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PARTNER_LOGOS.map((partner) => (
              <div
                key={partner.name}
                className="p-6 bg-[#F8FAFC] border border-slate-200 text-center space-y-4 shadow-sm flex flex-col items-center justify-between"
              >
                <div className="h-16 flex items-center justify-center p-2">
                  <img
                    src={partner.file}
                    alt={partner.name}
                    className="max-h-12 w-auto object-contain"
                  />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-headline font-bold text-base text-[#0A1930] uppercase">
                    {partner.name}
                  </h3>
                  <span className="text-xs font-mono-code font-bold text-[#006AA7] block uppercase">
                    {partner.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
