import React from 'react';
import { ArrowRight, MapPin, Mail } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { pathForRoute } from '../../lib/routes';
import type { RoboHackEvent } from '../../data/robohack/types';

interface RoboHackFooterProps {
  event: RoboHackEvent;
  onNavigate: (target: string) => void;
}

/** Footer for a RoboHack event page; links only to sections of the same event. */
export const RoboHackFooter: React.FC<RoboHackFooterProps> = ({ event, onNavigate }) => {
  const { language } = useLanguage();
  const sv = language === 'sv';

  const links = [
    { section: 'about', label: sv ? 'Om' : 'About' },
    { section: 'tracks', label: sv ? 'Spår' : 'Tracks' },
    { section: 'journey', label: sv ? 'Resan' : 'Journey' },
    { section: 'details', label: sv ? 'Praktisk info' : 'Event details' },
    { section: 'register', label: sv ? 'Anmälan' : 'Register' },
  ];

  const handleClick = (e: React.MouseEvent, section: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    onNavigate(`${event.route}#${section}`);
  };

  return (
    <footer data-no-translate="true" className="w-full bg-[#013A63] text-white pt-16 pb-12 px-3 sm:px-6 border-t border-white/10 select-none">
      <div className="w-full space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14">
          <div className="md:col-span-6 space-y-4">
            <span className="font-headline font-bold text-xl sm:text-2xl tracking-tight text-white uppercase block">
              {event.brand.name} {event.brand.city}
            </span>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed max-w-sm">
              {sv
                ? 'Ett hackathon för unga innovatörer, med ett kodspår och ett fysiskt spår.'
                : 'A hackathon for young innovators, with a Coding track and a Physical track.'}
            </p>
            <span className="flex items-center gap-1.5 text-xs font-mono-code text-slate-300 uppercase">
              <MapPin className="w-3.5 h-3.5 text-[#FFCD00]" />
              <span>{event.brand.city}, {sv ? 'Sverige' : 'Sweden'}</span>
            </span>
          </div>

          <div className="md:col-span-3 space-y-3">
            <span className="font-headline font-bold text-xs uppercase tracking-widest text-white block">
              {sv ? 'Evenemanget' : 'The event'}
            </span>
            <ul className="space-y-2 text-xs text-slate-300 font-light">
              {links.map((l) => (
                <li key={l.section}>
                  <a href={`${pathForRoute(event.route)}#${l.section}`} onClick={(e) => handleClick(e, l.section)} className="hover:text-[#FFCD00] transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <span className="font-headline font-bold text-xs uppercase tracking-widest text-white block">
              {sv ? 'Kontakt' : 'Contact'}
            </span>
            {event.contactEmail ? (
              <a href={`mailto:${event.contactEmail}`} className="text-xs text-slate-300 hover:text-[#FFCD00] flex items-center gap-1.5 transition-colors">
                <Mail className="w-3.5 h-3.5 text-[#FFCD00]" />
                <span>{event.contactEmail}</span>
              </a>
            ) : (
              <p className="text-xs text-slate-400 font-light">{sv ? 'Kontaktuppgifter meddelas senare.' : 'Contact details coming soon.'}</p>
            )}
          </div>
        </div>

        {event.partners.length > 0 && (
          <div className="pt-10 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {event.partners.map((p) => (
              <div key={p.name} className="bg-white px-4 py-2.5 flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity">
                <img src={p.logo} alt={p.name} className="h-7 sm:h-8 w-auto object-contain" />
              </div>
            ))}
          </div>
        )}

        <div className="pt-8 border-t border-white/10 text-[10px] font-mono-code text-slate-400 uppercase">
          © {new Date().getFullYear()} {event.brand.name} {event.brand.city}
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
