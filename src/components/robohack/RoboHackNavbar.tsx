import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { pathForRoute } from '../../lib/routes';
import type { RoboHackEvent } from '../../data/robohack/types';

interface RoboHackNavbarProps {
  event: RoboHackEvent;
  onNavigate: (target: string) => void;
}

/**
 * Header for a RoboHack event page. Same look as the main Navbar, but every link stays
 * on the event page so visitors on the event subdomain never leave it.
 */
export const RoboHackNavbar: React.FC<RoboHackNavbarProps> = ({ event, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const sv = language === 'sv';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { section: 'tracks', label: sv ? 'Spår' : 'Tracks' },
    { section: 'journey', label: sv ? 'Resan' : 'Journey' },
    { section: 'details', label: sv ? 'Praktisk info' : 'Details' },
    { section: 'register', label: sv ? 'Anmälan' : 'Register' },
  ];

  const hrefFor = (section?: string) => pathForRoute(event.route) + (section ? `#${section}` : '');

  const handleLinkClick = (e: React.MouseEvent, section?: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(section ? `${event.route}#${section}` : event.route);
  };

  const isDarkHeader = !isScrolled && !mobileMenuOpen;

  const langButton = (lang: 'sv' | 'en', activeBg: string) => (
    <button
      type="button"
      onClick={() => setLanguage(lang)}
      className={`px-2.5 py-1 text-xs font-mono-code font-bold transition-all ${
        language === lang
          ? `${activeBg} text-white`
          : isDarkHeader
          ? 'text-white/70 hover:text-white hover:bg-white/10'
          : 'text-slate-600 hover:text-[#0A1930] hover:bg-slate-200/60'
      }`}
      aria-label={lang === 'sv' ? 'Byt språk till svenska' : 'Switch language to English'}
    >
      {lang.toUpperCase()}
    </button>
  );

  return (
    <header
      data-no-translate="true"
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 select-none ${
        isDarkHeader
          ? 'bg-transparent border-b border-transparent py-4 sm:py-5 text-white'
          : 'bg-white/95 backdrop-blur-md border-b border-slate-200 py-3 text-[#0A1930] shadow-sm'
      }`}
    >
      <div className="w-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Brand */}
        <a href={hrefFor()} onClick={(e) => handleLinkClick(e)} className="text-left group focus:outline-none flex items-center gap-2.5">
          <div className="w-5 h-5 bg-[#006AA7] flex items-center justify-center relative overflow-hidden flex-shrink-0">
            <div className="absolute top-0 bottom-0 left-[35%] w-[22%] bg-[#FFCD00]" />
            <div className="absolute left-0 right-0 top-[38%] h-[24%] bg-[#FFCD00]" />
          </div>
          <span
            className={`flex flex-col items-start gap-0.5 font-headline font-black text-sm sm:text-base 2xl:text-lg leading-none tracking-tight uppercase whitespace-nowrap transition-colors duration-300 ${
              isDarkHeader ? 'text-white group-hover:text-[#FFCD00]' : 'text-[#0A1930] group-hover:text-[#006AA7]'
            }`}
          >
            <span>{event.brand.name}</span>
            <span
              className={`font-mono-code font-bold text-[10px] leading-none px-1.5 py-0.5 border transition-colors ${
                isDarkHeader ? 'text-[#FFCD00] bg-white/10 border-white/20' : 'text-[#006AA7] bg-slate-100 border-slate-200'
              }`}
            >
              {event.brand.city.toUpperCase()}
            </span>
          </span>
        </a>

        {/* Desktop links */}
        <nav
          className={`hidden lg:flex items-center gap-1 p-1 transition-all duration-300 ${
            isDarkHeader ? 'bg-black/30 border border-white/20 backdrop-blur-sm' : 'bg-slate-100 border border-slate-200'
          }`}
        >
          {navLinks.map((item) => (
            <a
              key={item.section}
              href={hrefFor(item.section)}
              onClick={(e) => handleLinkClick(e, item.section)}
              className={`px-3 py-1.5 text-xs font-display font-medium tracking-wide whitespace-nowrap transition-all duration-200 ${
                isDarkHeader ? 'text-white/90 hover:text-white hover:bg-white/15' : 'text-slate-700 hover:text-[#0A1930] hover:bg-slate-200/60'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Language + register */}
        <div className="hidden sm:flex items-center gap-2.5">
          <div
            className={`flex items-center p-0.5 transition-all duration-300 ${
              isDarkHeader ? 'bg-black/40 border border-white/20 backdrop-blur-sm' : 'bg-slate-100 border border-slate-200'
            }`}
          >
            {langButton('sv', 'bg-[#006AA7]')}
            {langButton('en', 'bg-[#0A1930]')}
          </div>
          <motion.a
            href={hrefFor('register')}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={(e) => handleLinkClick(e, 'register')}
            className="btn-pill-lime text-xs font-black py-2.5 px-4 2xl:px-5 whitespace-nowrap shadow-md flex items-center gap-2 group"
          >
            <span>{sv ? 'ANMÄLAN' : 'REGISTER'}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.a>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`lg:hidden p-2 focus:outline-none transition-colors ${
            isDarkHeader ? 'text-white hover:bg-white/10' : 'text-[#0A1930] hover:bg-slate-100'
          }`}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden overflow-hidden bg-white border-b border-slate-200 shadow-2xl text-[#0A1930]"
          >
            <div className="px-6 py-6 space-y-4">
              <div className="flex flex-col gap-1">
                {navLinks.map((item) => (
                  <a
                    key={item.section}
                    href={hrefFor(item.section)}
                    onClick={(e) => handleLinkClick(e, item.section)}
                    className="py-3 px-4 text-left text-sm font-display font-medium text-slate-700 hover:text-[#0A1930] hover:bg-slate-50"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-xs font-display font-medium text-slate-700">{sv ? 'Språk' : 'Language'}</span>
                <div className="flex items-center p-0.5 bg-slate-100 border border-slate-200">
                  {langButton('sv', 'bg-[#006AA7]')}
                  {langButton('en', 'bg-[#0A1930]')}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
