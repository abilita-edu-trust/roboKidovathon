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

  // Targets are `route` or `route#section`, as the app navigator expects.
  const links = [
    { target: `${event.route}#about`, label: sv ? 'Om oss' : 'About' },
    { target: `${event.route}#tracks`, label: sv ? 'Spår' : 'Tracks' },
    { target: `${event.route}#challenges`, label: sv ? 'Utmaningar' : 'Challenges' },
    { target: `${event.route}-ideas`, label: sv ? 'Idéer och röstning' : 'Ideas & Vote' },
    { target: `${event.route}#partners`, label: sv ? 'Partner' : 'Partners' },
    { target: `${event.route}#details`, label: sv ? 'Praktisk info' : 'Event details' },
    { target: `${event.route}-register`, label: sv ? 'Anmälan' : 'Register' },
  ];

  const hrefFor = (target: string) => {
    const [route, section] = target.split('#');
    return pathForRoute(route) + (section ? `#${section}` : '');
  };

  const handleClick = (e: React.MouseEvent, target: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    onNavigate(target);
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
              {sv ? event.hero.intro.sv : event.hero.intro.en}
            </p>
            <span className="flex items-center gap-1.5 text-xs font-mono-code text-slate-300 uppercase">
              <MapPin className="w-3.5 h-3.5 text-[#FFCD00]" />
              <span>{sv ? event.event.venue.sv : event.event.venue.en} · {sv ? event.event.dates.sv : event.event.dates.en}</span>
            </span>
            <span className="block text-[11px] font-mono-code text-slate-400 uppercase">
              {sv ? 'Arrangeras av' : 'Powered by'} {event.event.poweredBy}
            </span>
          </div>

          <div className="md:col-span-3 space-y-3">
            <span className="font-headline font-bold text-xs uppercase tracking-widest text-white block">
              {sv ? 'Evenemanget' : 'The event'}
            </span>
            <ul className="space-y-2 text-xs text-slate-300 font-light">
              {links.map((l) => (
                <li key={l.target}>
                  <a href={hrefFor(l.target)} onClick={(e) => handleClick(e, l.target)} className="hover:text-[#FFCD00] transition-colors">
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
