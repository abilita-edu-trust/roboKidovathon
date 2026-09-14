import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  GraduationCap,
  Package,
  Zap,
  ShieldCheck,
  Layers,
  Ruler,
  Trophy,
  Download,
} from 'lucide-react';
import {
  kitRoverOfficial,
  arenaCourtReference,
  cadBlueprintReference,
} from '../assets/images';

interface RefKioskShowcaseProps {
  onNavigate: (route: string) => void;
  onOpenRegister: () => void;
}

export const RefKioskShowcase: React.FC<RefKioskShowcaseProps> = ({
  onNavigate,
  onOpenRegister,
}) => {
  return (
    <section
      id="design-build-compete"
      className="w-full bg-[#F4F8FB] relative py-16 sm:py-20 px-3 sm:px-6 border-t border-slate-200 overflow-hidden select-none"
    >
      {/* ── TECHNICAL BACKGROUND GRID SYSTEM & AMBIENT ACCENTS ── */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'linear-gradient(to right, #006AA712 1px, transparent 1px), linear-gradient(to bottom, #006AA712 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="w-full space-y-10 relative z-10">

        {/* ── SECTION HERO HEADER ── */}
        <div className="relative pb-4">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            
            {/* Left Column: Heading & Description */}
            <div className="space-y-3 max-w-2xl relative z-10">
              <span className="text-[11px] sm:text-xs font-mono-code font-bold tracking-[0.25em] text-[#006AA7] uppercase block">
                ROBOTICS ECOSYSTEM // FROM CLASSROOM TO ARENA
              </span>

              <div className="relative inline-block">
                <h2 className="font-headline font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#0A1930] uppercase tracking-tight leading-[0.95]">
                  DESIGN, BUILD &amp; <span className="text-[#006AA7]">COMPETE</span>
                </h2>
                {/* Yellow hand-drawn sparkle */}
                <span className="absolute -top-3 -right-6 text-[#FFCD00] text-2xl font-black">✦</span>
              </div>

              <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed max-w-xl">
                Turnkey classroom delivery and tournament equipment. Reusable hardware kits paired with the official roll-out competition arena.
              </p>
            </div>

            {/* Right: Ecosystem 3-Step Progression Strip */}
            <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 bg-white border border-slate-200 text-xs font-mono-code shadow-xs self-start lg:self-end">
              <span className="text-[#006AA7] font-bold">01 BUILD</span>
              <span className="text-slate-300 font-bold">⟶</span>
              <span className="text-slate-600 font-bold">02 TEST</span>
              <span className="text-slate-300 font-bold">⟶</span>
              <span className="text-[#0A1930] font-black">03 COMPETE</span>
            </div>

          </div>
        </div>

        {/* ── COHESIVE TWO-CARD GROUPED LAYOUT (50% / 50% CLOSE GAP) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-7 items-stretch">

          {/* ════════════════════════════════════════════════════════════════
              CARD 01: ROBO-SPRINT HARDWARE KIT (LIGHT / BLUE THEME)
             ════════════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-6 sm:p-8 bg-white border border-slate-200/90 shadow-xl hover:shadow-2xl flex flex-col justify-between space-y-6 transition-all duration-300 hover:-translate-y-1.5 relative overflow-hidden group"
          >
            {/* Subtle card blueprint corner texture */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-sky-100/60 to-transparent pointer-events-none" />

            <div className="space-y-6 relative z-10">
              
              {/* Header: Clean Tag + Card Number */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-[11px] font-mono-code font-bold text-[#006AA7] uppercase tracking-wider block">
                  PHASE 01: BUILD // CLASSROOM HARDWARE KIT
                </span>
                <span className="text-xs font-mono-code text-slate-400 font-bold tracking-wider">
                  CARD 01
                </span>
              </div>

              {/* Title & Technical Subtitle + Handwritten Annotation */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-headline font-black text-2xl sm:text-3xl text-[#0A1930] uppercase tracking-tight">
                    ROBO-SPRINT HARDWARE KIT
                  </h3>
                  <p className="text-xs font-mono-code text-[#006AA7] font-bold mt-1 uppercase tracking-wider">
                    TURNKEY CLASSROOM DELIVERY • SAFE 6V DC
                  </p>
                </div>

                {/* Handwritten Annotation - Positioned cleanly in header, completely away from image */}
                <div className="hidden sm:block text-right shrink-0">
                  <span className="font-handwriting text-base font-bold text-[#006AA7] -rotate-6 inline-block leading-tight">
                    From Parts to
                    <br />
                    Possibilities
                  </span>
                  <svg className="w-8 h-4 text-[#006AA7] ml-auto mt-0.5" viewBox="0 0 30 15" fill="none">
                    <path d="M5 2 C 15 1, 22 8, 25 12 M 25 12 L 20 12 M 25 12 L 24 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                Mentors arrive directly at your school with official mechanical kits, gearboxes, wired controllers, and battery packs. Every student cohort builds, tests, and refines a working competition robot.
              </p>

              {/* 2-Column Inside Layout: Feature Chips (Left) + High-End Rover (Right) */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center pt-1">
                
                {/* Left: 3 Feature Chips */}
                <div className="sm:col-span-7 space-y-3.5">
                  
                  {/* Feature 1 */}
                  <div className="flex items-start gap-3 p-2.5 bg-[#F8FAFC] border border-slate-100 transition-colors group-hover:border-sky-200">
                    <div className="w-8 h-8 bg-[#006AA7]/10 text-[#006AA7] flex items-center justify-center shrink-0 mt-0.5">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0A1930]">Classroom Footprint</h4>
                      <p className="text-[11px] text-slate-500 leading-snug">Fits standard school tables or a small floor area.</p>
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="flex items-start gap-3 p-2.5 bg-[#F8FAFC] border border-slate-100 transition-colors group-hover:border-sky-200">
                    <div className="w-8 h-8 bg-[#006AA7]/10 text-[#006AA7] flex items-center justify-center shrink-0 mt-0.5">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0A1930]">Zero Lab Budget</h4>
                      <p className="text-[11px] text-slate-500 leading-snug">All motors, chassis, controllers &amp; batteries provided.</p>
                    </div>
                  </div>

                  {/* Feature 3 */}
                  <div className="flex items-start gap-3 p-2.5 bg-[#F8FAFC] border border-slate-100 transition-colors group-hover:border-sky-200">
                    <div className="w-8 h-8 bg-[#006AA7]/10 text-[#006AA7] flex items-center justify-center shrink-0 mt-0.5">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0A1930]">Low-Voltage Safe</h4>
                      <p className="text-[11px] text-slate-500 leading-snug">Operates entirely on safe 6V DC power — zero soldering.</p>
                    </div>
                  </div>

                </div>

                {/* Right: Clean Rover Visual Area with NO overlapping text */}
                <div className="sm:col-span-5 relative flex items-center justify-center">
                  <div className="relative w-full max-w-[240px] aspect-square flex items-center justify-center">
                    <img
                      src={kitRoverOfficial}
                      alt="Official Robo-Sprint Hardware Competition Rover"
                      className="w-full h-full object-contain mix-blend-multiply drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>

              </div>

            </div>

            {/* Footer Action Row */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 relative z-10">
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => onNavigate('for-schools')}
                  className="bg-[#FFCD00] hover:bg-[#FACC15] text-[#0A1930] font-black text-xs sm:text-sm py-3 px-5 sm:px-6 shadow-xs flex items-center gap-2 transition-transform hover:scale-105"
                >
                  <span>FOR SCHOOLS GUIDE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onOpenRegister}
                  className="bg-white hover:bg-slate-50 text-[#0A1930] border border-slate-300 font-bold text-xs sm:text-sm py-3 px-4 sm:px-5 shadow-2xs transition-transform hover:scale-105"
                >
                  <span>REQUEST KITS</span>
                </button>
              </div>

              {/* Download Specs Link */}
              <a
                href="#specs"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('challenges');
                }}
                className="text-slate-500 hover:text-[#006AA7] text-xs font-mono-code font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>DOWNLOAD KIT SPECS</span>
              </a>
            </div>
          </motion.div>

          {/* ════════════════════════════════════════════════════════════════
              CARD 02: ARENA MATCH DUAL COURT (DARK NAVY / CYAN THEME)
             ════════════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="p-6 sm:p-8 bg-[#0A1930] text-white border border-slate-800 shadow-2xl flex flex-col justify-between space-y-6 transition-all duration-300 hover:-translate-y-1.5 relative overflow-hidden group"
          >
            {/* Ambient Cyan Radial Lighting */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#006AA7]/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#38BDF8]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-5 relative z-10">
              
              {/* Header: Eyebrow + Card Number */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-[11px] font-mono-code font-bold tracking-widest text-[#FFCD00] uppercase">
                  PHASE 02: COMPETE // OFFICIAL TOURNAMENT ARENA
                </span>
                <span className="text-xs font-mono-code text-slate-400 font-bold tracking-wider">
                  CARD 02
                </span>
              </div>

              {/* Title & Dimensions Subtitle + Handwritten Annotation */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-headline font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
                    ARENA MATCH DUAL COURT
                  </h3>
                  <p className="text-xs font-mono-code text-[#FFCD00] font-bold mt-1 uppercase tracking-wider">
                    244 CM × 122 CM ROLL-OUT METRIC MAT
                  </p>
                </div>

                {/* Handwritten Annotation - In header area, pointing down to arena */}
                <div className="hidden sm:block text-right shrink-0">
                  <span className="font-handwriting text-base font-bold text-sky-400 -rotate-6 inline-block leading-tight">
                    Real Challenges.
                    <br />
                    Real Skills.
                  </span>
                  <svg className="w-8 h-4 text-sky-400 ml-auto mt-0.5" viewBox="0 0 30 15" fill="none">
                    <path d="M5 2 C 15 1, 22 8, 25 12 M 25 12 L 20 12 M 25 12 L 24 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Main Centerpiece: 3D Arena Court + Right Feature Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                
                {/* 3D Isometric CAD Arena Model - Clean, HD, No overlapping badges */}
                <div className="sm:col-span-8 relative overflow-hidden bg-[#0A1930] border border-white/10 p-1 group-hover:border-sky-500/40 transition-colors">
                  <img
                    src={arenaCourtReference}
                    alt="Official 244cm x 122cm Dual-Court Competition Arena"
                    className="w-full h-auto max-h-[190px] object-contain mx-auto transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Right: 4 High-Tech Spec Badges */}
                <div className="sm:col-span-4 space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 text-[11px] font-medium text-slate-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="leading-tight">Official Tournament Arena</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 text-[11px] font-medium text-slate-200">
                    <Layers className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="leading-tight">Modular &amp; Portable</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 text-[11px] font-medium text-slate-200">
                    <Ruler className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="leading-tight">Standardized Dimensions</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 text-[11px] font-medium text-slate-200">
                    <Trophy className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="leading-tight">School &amp; Final Rounds</span>
                  </div>
                </div>

              </div>

              {/* Bottom Technical Readout Box */}
              <div className="p-3.5 bg-[#061224] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono-code text-xs">
                <div className="space-y-1 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">STATUS:</span>
                    <span className="text-[#FFCD00] font-bold">DEPLOYED IN SCHOOLS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">FOOTPRINT:</span>
                    <span className="text-white font-bold">2.44 m × 1.22 m ROLL-OUT</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">ARCHITECTURE:</span>
                    <span className="text-white">ZIGZAG CENTRAL BARRIER</span>
                  </div>
                </div>

                {/* High-Tech CAD Blueprint Diagram Frame */}
                <div className="border border-white/15 p-1 bg-white/5 flex items-center justify-center self-end sm:self-center">
                  <img
                    src={cadBlueprintReference}
                    alt="Arena Technical Blueprint Floorplan"
                    className="h-10 w-auto object-contain opacity-80"
                  />
                </div>
              </div>

            </div>

            {/* Footer Action Row */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 relative z-10">
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={onOpenRegister}
                  className="bg-[#FFCD00] hover:bg-[#FACC15] text-[#0A1930] font-black text-xs sm:text-sm py-3 px-5 sm:px-6 shadow-xs flex items-center gap-2 transition-transform hover:scale-105"
                >
                  <span>REGISTER COHORT</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onNavigate('challenges')}
                  className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-mono-code font-bold uppercase transition-transform hover:scale-105"
                >
                  <span>ARENA RULES</span>
                </button>
              </div>

              {/* Handwritten note matching reference */}
              <div className="hidden sm:block">
                <span className="font-handwriting text-sm font-bold text-sky-400 tracking-wide">
                  SAME ARENA. BIGGER DREAMS.
                </span>
              </div>
            </div>

          </motion.div>

        </div>

        {/* ── SECTION FOOTER STRIP ── */}
        <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-xs font-mono-code uppercase font-semibold">
          <span>STANDARDIZED LGR22 EQUIPMENT</span>
          <span>ZERO SCHOOL LAB PREREQUISITES · ALL HARDWARE SUPPLIED</span>
        </div>

      </div>
    </section>
  );
};
