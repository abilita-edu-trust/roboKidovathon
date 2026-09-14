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
import { Interactive3DTilt } from './Interactive3DTilt';
import { RoboTech3DCanvas } from './RoboTech3DCanvas';

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
      className="w-full bg-gradient-to-b from-[#F2F7FB] via-[#E8F2FA] to-[#F5F9FD] relative py-16 sm:py-20 px-3 sm:px-6 border-t border-slate-200 overflow-hidden select-none"
    >
      {/* ── AMBIENT GRADIENT GLOWS ── */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-bl from-sky-400/20 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-tr from-cyan-400/15 via-[#FFCD00]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

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
              ROBOTICS ECOSYSTEM
              </span>

              <div className="relative inline-block">
                <h2 className="font-headline font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#0A1930] uppercase tracking-tight leading-[0.95]">
                  DESIGN, BUILD &amp; <span className="text-[#006AA7]">COMPETE</span>
                </h2>
                {/* Yellow hand-drawn sparkle */}
                <span className="absolute -top-3 -right-6 text-[#FFCD00] text-2xl font-black">✦</span>
              </div>

              <p className="text-sm text-slate-500 font-light leading-relaxed max-w-md">
                Reusable classroom kits paired with the official roll-out competition arena.
              </p>
            </div>

            {/* Right: 3D Telemetry Gyroscope + Ecosystem 3-Step Progression Strip */}
            <div className="flex items-center gap-4 self-start lg:self-end">
              <div className="w-20 h-20 sm:w-24 sm:h-24 relative shrink-0 hidden md:block">
                <RoboTech3DCanvas speed={1.2} />
              </div>

              <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 text-xs font-mono-code shadow-xs">
                <span className="text-[#006AA7] font-bold">01 BUILD</span>
                <span className="text-slate-300 font-bold">⟶</span>
                <span className="text-slate-600 font-bold">02 TEST</span>
                <span className="text-slate-300 font-bold">⟶</span>
                <span className="text-[#0A1930] font-black">03 COMPETE</span>
              </div>
            </div>

          </div>
        </div>

        {/* ── COHESIVE TWO-CARD GROUPED LAYOUT (3D INTERACTIVE TILT) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-7 items-stretch">

          {/* ════════════════════════════════════════════════════════════════
              CARD 01: ROBO-SPRINT HARDWARE KIT (LIGHT / BLUE THEME)
             ════════════════════════════════════════════════════════════════ */}
          <Interactive3DTilt maxTilt={7} glareOpacity={0.15} className="h-full">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 320, damping: 22 }}
            className="p-6 sm:p-8 bg-white border border-slate-200/90 shadow-xl hover:shadow-2xl flex flex-col justify-between space-y-6 relative overflow-hidden group cursor-pointer h-full"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Subtle card blueprint corner texture */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-sky-100/60 to-transparent pointer-events-none" />

            <div className="space-y-6 relative z-10">
              
              {/* Header: Clean Tag + Card Number */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-[11px] font-mono-code font-bold text-[#006AA7] uppercase tracking-wider block">
                  PHASE 01: BUILD
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

                {/* Handwritten Annotation - Playful gentle float */}
                <motion.div
                  animate={{ rotate: [-7, -5, -7] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="hidden sm:block text-right shrink-0"
                >
                  <span className="font-handwriting text-base font-bold text-[#006AA7] inline-block leading-tight">
                    From Parts to
                    <br />
                    Possibilities
                  </span>
                  <svg className="w-8 h-4 text-[#006AA7] ml-auto mt-0.5" viewBox="0 0 30 15" fill="none">
                    <path d="M5 2 C 15 1, 22 8, 25 12 M 25 12 L 20 12 M 25 12 L 24 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                Mentors deliver official kits to your school — motors, chassis, and batteries included.
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
                      <p className="text-[11px] text-slate-500 leading-snug">Fits any school table or small floor area.</p>
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="flex items-start gap-3 p-2.5 bg-[#F8FAFC] border border-slate-100 transition-colors group-hover:border-sky-200">
                    <div className="w-8 h-8 bg-[#006AA7]/10 text-[#006AA7] flex items-center justify-center shrink-0 mt-0.5">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0A1930]">Zero Lab Budget</h4>
                      <p className="text-[11px] text-slate-500 leading-snug">All motors, chassis &amp; batteries provided.</p>
                    </div>
                  </div>

                  {/* Feature 3 */}
                  <div className="flex items-start gap-3 p-2.5 bg-[#F8FAFC] border border-slate-100 transition-colors group-hover:border-sky-200">
                    <div className="w-8 h-8 bg-[#006AA7]/10 text-[#006AA7] flex items-center justify-center shrink-0 mt-0.5">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0A1930]">Low-Voltage Safe</h4>
                      <p className="text-[11px] text-slate-500 leading-snug">Safe 6V DC — zero soldering required.</p>
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
          </Interactive3DTilt>

          {/* ════════════════════════════════════════════════════════════════
              CARD 02: ARENA MATCH DUAL COURT (DARK NAVY / CYAN THEME)
             ════════════════════════════════════════════════════════════════ */}
          <Interactive3DTilt maxTilt={7} glareOpacity={0.25} className="h-full">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, type: 'spring', stiffness: 320, damping: 22 }}
            className="p-6 sm:p-8 bg-[#0A1930] text-white border border-slate-800 shadow-2xl flex flex-col justify-between space-y-6 relative overflow-hidden group cursor-pointer h-full"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Ambient Cyan Radial Lighting */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#006AA7]/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#38BDF8]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-5 relative z-10">
              
              {/* Header: Eyebrow + Card Number */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-[11px] font-mono-code font-bold tracking-widest text-[#FFCD00] uppercase">
                  PHASE 02: COMPETE
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

                {/* Handwritten Annotation - Playful gentle float */}
                <motion.div
                  animate={{ rotate: [-7, -5, -7] }}
                  transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
                  className="hidden sm:block text-right shrink-0"
                >
                  <span className="font-handwriting text-base font-bold text-sky-400 inline-block leading-tight">
                    Real Challenges.
                    <br />
                    Real Skills.
                  </span>
                  <svg className="w-8 h-4 text-sky-400 ml-auto mt-0.5" viewBox="0 0 30 15" fill="none">
                    <path d="M5 2 C 15 1, 22 8, 25 12 M 25 12 L 20 12 M 25 12 L 24 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              </div>

              {/* Main Centerpiece: 3D Arena Court + Right Feature Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                
                {/* 3D Isometric CAD Arena Model with Animated Laser Scanline */}
                <div className="sm:col-span-8 relative overflow-hidden bg-[#0A1930] border border-white/10 p-1 group-hover:border-sky-500/40 transition-colors">
                  {/* Laser Scanline Beam */}
                  <motion.div
                    animate={{ top: ['-10%', '110%'] }}
                    transition={{ repeat: Infinity, duration: 2.8, ease: 'linear' }}
                    className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"
                  />
                  <img
                    src={arenaCourtReference}
                    alt="Official 244cm x 122cm Dual-Court Competition Arena"
                    className="w-full h-auto max-h-[190px] object-contain mx-auto transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Right: 4 High-Tech Spec Badges with micro-hover physics */}
                <div className="sm:col-span-4 space-y-2">
                  {[
                    { icon: ShieldCheck, text: 'Official Tournament Arena' },
                    { icon: Layers, text: 'Modular & Portable' },
                    { icon: Ruler, text: 'Standardized Dimensions' },
                    { icon: Trophy, text: 'School & Final Rounds' },
                  ].map((badge, bIdx) => {
                    const BIcon = badge.icon;
                    return (
                      <motion.div
                        key={bIdx}
                        whileHover={{ scale: 1.04, x: 2 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 hover:border-sky-400/40 hover:bg-white/10 text-[11px] font-medium text-slate-200 transition-colors"
                      >
                        <BIcon className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span className="leading-tight">{badge.text}</span>
                      </motion.div>
                    );
                  })}
                </div>

              </div>

              {/* Bottom Technical Readout Box */}
              <div className="p-3.5 bg-[#061224] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono-code text-xs">
                <div className="space-y-1 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">STATUS:</span>
                    <span className="text-[#FFCD00] font-bold flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFCD00] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFCD00]"></span>
                      </span>
                      DEPLOYED IN SCHOOLS
                    </span>
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
          </Interactive3DTilt>

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
