import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, ShieldCheck, Mail } from 'lucide-react';
import { PARTNER_LOGOS } from '../data/roboData';

interface RefFooterProps {
  onNavigate: (route: string) => void;
  onOpenRegister: () => void;
}

export const RefFooter: React.FC<RefFooterProps> = ({
  onNavigate,
  onOpenRegister,
}) => {
  return (
    <footer id="site-footer" className="w-full bg-[#013A63] text-white pt-16 pb-12 px-3 sm:px-6 border-t border-white/10 select-none scroll-mt-24">
      <div className="w-full space-y-12">

        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14">

          {/* Brand Col */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-headline font-bold text-xl sm:text-2xl tracking-tight text-white uppercase">
                VÄSTERÅS FUTURE INNOVATORS 2026
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed max-w-sm">
              Hands-on STEM programme and school robotics competition pathway bringing schools together through robotics. Hosted by Indisk BarnKlubb (IBK) Västerås, INIAC, and SkillSkolan, with Blix as technology and kit partner.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono-code text-slate-300 pt-1">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FFCD00]" />
                <span>VÄSTERÅS, SWEDEN</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FFCD00]" />
                <span>GRADES 3–9 &amp; GYMNASIUM</span>
              </span>
            </div>
          </div>

          {/* Programme Navigation */}
          <div className="md:col-span-2 space-y-3">
            <span className="font-headline font-bold text-xs uppercase tracking-widest text-white block">
              PROGRAMME
            </span>
            <ul className="space-y-2 text-xs text-slate-300 font-light">
              <li><button onClick={() => onNavigate('for-schools')} className="hover:text-[#FFCD00] transition-colors">For Schools</button></li>
              <li><button onClick={() => onNavigate('workflow')} className="hover:text-[#FFCD00] transition-colors">STEM Workflow</button></li>
              <li><button onClick={() => onNavigate('challenges')} className="hover:text-[#FFCD00] transition-colors">Competition Tracks</button></li>
              <li><button onClick={() => onNavigate('how-it-works')} className="hover:text-[#FFCD00] transition-colors">How It Works</button></li>
              <li><button onClick={() => onNavigate('lgr22')} className="hover:text-[#FFCD00] transition-colors">Lgr22 Curriculum</button></li>
              <li><button onClick={() => onNavigate('events')} className="hover:text-[#FFCD00] transition-colors">Events &amp; Final</button></li>
            </ul>
          </div>

          {/* Organization & Trust */}
          <div className="md:col-span-3 space-y-3">
            <span className="font-headline font-bold text-xs uppercase tracking-widest text-white block">
              ORGANIZATION &amp; CONTACT
            </span>
            <ul className="space-y-2 text-xs text-slate-300 font-light">
              <li><button onClick={() => onNavigate('about')} className="hover:text-[#FFCD00] transition-colors">About the League</button></li>
              <li className="text-slate-300 flex items-center gap-1.5 pt-1">
                <Mail className="w-3.5 h-3.5 text-[#FFCD00]" />
                <span>contact@robokidovation.se</span>
              </li>
              <li className="text-slate-400 text-[11px] font-mono-code pt-1">
                Indisk BarnKlubb (IBK) Västerås &amp; INIAC
              </li>
              <li className="text-slate-400 text-[11px] font-mono-code">
                Västerås, Sweden
              </li>
            </ul>
          </div>

          {/* Cohort CTA */}
          <div className="md:col-span-3 space-y-4">
            <span className="font-headline font-bold text-xs uppercase tracking-widest text-white block">
              ENROL COHORT
            </span>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              Registrations for Västerås schools and student cohorts are open ahead of the October qualifiers and December 5, 2026 Grand Finale.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenRegister}
              className="bg-[#FFCD00] hover:bg-[#FACC15] text-[#0A1930] text-xs font-syne font-black py-3.5 px-6 flex items-center justify-center gap-2 shadow-md uppercase tracking-wider transition-all"
            >
              <span>REGISTER SCHOOL / TEAM</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>

        </div>

        {/* Partner Logos Row */}
        <div className="pt-10 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {PARTNER_LOGOS.map((logo) => (
            <div
              key={logo.name}
              className="bg-white px-4 py-2.5 flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity"
            >
              <img
                src={logo.file}
                alt={logo.name}
                className="h-7 sm:h-8 w-auto object-contain"
              />
            </div>
          ))}
        </div>

        {/* Bottom copyright & compliance */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono-code text-slate-400">
          <span>© 2026 VÄSTERÅS FUTURE INNOVATORS · ALL RIGHTS RESERVED</span>
          <span>LOW-VOLTAGE 6V HARDWARE · GDPR-COMPLIANT STUDENT PRIVACY</span>
        </div>

      </div>
    </footer>
  );
};
