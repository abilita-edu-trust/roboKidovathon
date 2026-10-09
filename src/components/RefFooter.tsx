import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, ShieldCheck, Mail } from 'lucide-react';
import { PARTNER_LOGOS } from '../data/roboData';
import { useLanguage } from '../context/LanguageContext';
import { useSite, pickLang } from '../context/SiteContext';
import type { IntakeProgramTab } from '../pages/IntakeRegisterPage';

interface RefFooterProps {
  onNavigate: (route: string, tab?: IntakeProgramTab) => void;
}

/** Site footer; the site (VFI or a city site like vxo.iniac.se) sets its text and links. */
export const RefFooter: React.FC<RefFooterProps> = ({ onNavigate }) => {
  const { footer } = useSite();
  const { language } = useLanguage();
  const sv = language === 'sv';

  return (
    <footer id="site-footer" className="w-full bg-[#013A63] text-white pt-16 pb-12 px-3 sm:px-6 border-t border-white/10 select-none scroll-mt-24">
      <div className="w-full space-y-12">

        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14">

          {/* Brand Col */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-headline font-bold text-xl sm:text-2xl tracking-tight text-white uppercase">
                {footer.title}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed max-w-sm">
              {pickLang(footer.description, sv)}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono-code text-slate-300 pt-1">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FFCD00]" />
                <span>{footer.location}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FFCD00]" />
                <span>{footer.audience}</span>
              </span>
            </div>
          </div>

          {/* Programme Navigation */}
          <div className="md:col-span-2 space-y-3">
            <span className="font-headline font-bold text-xs uppercase tracking-widest text-white block">
              {pickLang(footer.programmeTitle, sv)}
            </span>
            <ul className="space-y-2 text-xs text-slate-300 font-light">
              {footer.programmeLinks.map((l) => (
                <li key={l.id}>
                  <button onClick={() => onNavigate(l.id)} className="hover:text-[#FFCD00] transition-colors">{pickLang(l.label, sv)}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Organization & Trust */}
          <div className="md:col-span-3 space-y-3">
            <span className="font-headline font-bold text-xs uppercase tracking-widest text-white block">
              {pickLang(footer.orgTitle, sv)}
            </span>
            <ul className="space-y-2 text-xs text-slate-300 font-light">
              {footer.orgLinks.map((l) => (
                <li key={l.id}>
                  <button onClick={() => onNavigate(l.id)} className="hover:text-[#FFCD00] transition-colors">{pickLang(l.label, sv)}</button>
                </li>
              ))}
              <li className="text-slate-300 flex items-center gap-1.5 pt-1">
                <Mail className="w-3.5 h-3.5 text-[#FFCD00]" />
                <span>{footer.email}</span>
              </li>
              {footer.orgLines.map((line, i) => (
                <li key={line} className={`text-slate-400 text-[11px] font-mono-code${i === 0 ? ' pt-1' : ''}`}>
                  {line}
                </li>
              ))}
            </ul>
          </div>

          {/* Cohort CTA */}
          <div className="md:col-span-3 space-y-4">
            <span className="font-headline font-bold text-xs uppercase tracking-widest text-white block">
              REGISTER
            </span>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              {pickLang(footer.registerText, sv)}
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate(footer.register.target, footer.register.tab)}
              className="bg-[#FFCD00] hover:bg-[#FACC15] text-[#0A1930] text-xs font-syne font-black py-3.5 px-6 flex items-center justify-center gap-2 shadow-md uppercase tracking-wider transition-all"
            >
              <span>{pickLang(footer.register.label, sv)}</span>
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
          <span>{footer.copyright}</span>
          <div className="flex flex-wrap items-center gap-4">
            <span>LOW-VOLTAGE 6V HARDWARE · GDPR-COMPLIANT STUDENT PRIVACY</span>
            {footer.adminHref ? (
              <a
                href={footer.adminHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-[#FFCD00] transition-colors underline uppercase tracking-wider"
              >
                [ Admin Portal 🛡️ ]
              </a>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate('admin')}
                className="text-slate-400 hover:text-[#FFCD00] transition-colors underline uppercase tracking-wider"
              >
                [ Admin Portal 🛡️ ]
              </button>
            )}
          </div>
        </div>

        {/* Developer credit */}
        <div className="pt-6 border-t border-white/10 flex justify-center">
          <a
            href="https://www.artechstudio.co.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2.5 border border-white/15 hover:border-[#FFCD00] transition-colors"
          >
            <span className="text-[10px] sm:text-[11px] font-mono-code font-bold uppercase tracking-[0.2em] text-slate-300">
              Developed &amp; maintained by
            </span>
            <span className="font-headline font-black normal-case text-base sm:text-lg tracking-tight text-[#FFCD00] group-hover:text-white transition-colors">
              ArTechStudio
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#FFCD00] transition-transform group-hover:translate-x-1" />
          </a>
        </div>

      </div>
    </footer>
  );
};
