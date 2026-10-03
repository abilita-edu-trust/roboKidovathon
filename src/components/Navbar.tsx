import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { pathForRoute } from '../lib/routes';

interface NavbarProps {
  activeTab: string;
  onNavigate: (route: string) => void;
  onOpenRegister: () => void;
  onOpenFaq?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onNavigate,
  onOpenRegister,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, toggleLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { id: 'future-innovators', label: language === 'sv' ? 'Hem' : 'Home' },
    { id: 'challenges', label: language === 'sv' ? 'Tävling' : 'Competition' },
    { id: 'events', label: language === 'sv' ? 'Evenemang' : 'Events' },
    { id: 'register', label: language === 'sv' ? 'Registrering' : 'Register' },
    { id: 'about', label: language === 'sv' ? 'Om oss' : 'About' },
    { id: 'ibk', label: 'Indisk Barnklubb (IBK)' },
    { id: 'ibk#contact', label: language === 'sv' ? 'Kontakt' : 'Contact' },
  ];

  const registerLabel =
    language === 'sv' ? 'REGISTRERA SKOLA, FÖRENING ELLER LAG' : 'REGISTER SCHOOL, ASSOCIATION OR TEAM';

  // Real links (shareable, open-in-new-tab) that navigate in-app on a plain click.
  const handleLinkClick = (e: React.MouseEvent, id: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  const hrefFor = (id: string) => {
    const [route, section] = id.split('#');
    return pathForRoute(route) + (section ? `#${section}` : '');
  };

  const isDarkHeader = (activeTab === 'ibk' || activeTab === 'future-innovators') && !isScrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 select-none ${
          isDarkHeader
            ? 'bg-transparent border-b border-transparent py-4 sm:py-5 text-white'
            : 'bg-white/95 backdrop-blur-md border-b border-slate-200 py-3 text-[#0A1930] shadow-sm'
        }`}
      >
        <div className="w-full px-4 sm:px-6 flex items-center justify-between gap-4">

          {/* Brand Mark Logo */}
          <motion.a
            href="/"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => handleLinkClick(e, 'future-innovators')}
            className="text-left group focus:outline-none flex items-center gap-2.5"
          >
            {/* Swedish Flag / STEM Mark */}
            <div className="w-5 h-5 bg-[#006AA7] flex items-center justify-center relative overflow-hidden shadow-2xs flex-shrink-0">
              <div className="absolute top-0 bottom-0 left-[35%] w-[22%] bg-[#FFCD00]" />
              <div className="absolute left-0 right-0 top-[38%] h-[24%] bg-[#FFCD00]" />
            </div>

            <span
              className={`flex flex-col items-start gap-0.5 font-headline font-black text-sm sm:text-base 2xl:text-lg leading-none tracking-tight uppercase whitespace-nowrap transition-colors duration-300 ${
                isDarkHeader
                  ? 'text-white group-hover:text-[#FFCD00]'
                  : 'text-[#0A1930] group-hover:text-[#006AA7]'
              }`}
            >
              <span>VÄSTERÅS FUTURE INNOVATORS</span>
              <span
                className={`font-mono-code font-bold text-[10px] leading-none px-1.5 py-0.5 border transition-colors ${
                  isDarkHeader
                    ? 'text-[#FFCD00] bg-white/10 border-white/20'
                    : 'text-[#006AA7] bg-slate-100 border-slate-200'
                }`}
              >
                2026
              </span>
            </span>
          </motion.a>

          {/* Desktop Navigation Links */}
          <nav
            className={`hidden lg:flex items-center gap-1 p-1 transition-all duration-300 ${
              isDarkHeader
                ? 'bg-black/30 border border-white/20 backdrop-blur-sm'
                : 'bg-slate-100 border border-slate-200'
            }`}
          >
            {navLinks.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <a
                  key={item.id}
                  href={hrefFor(item.id)}
                  onClick={(e) => handleLinkClick(e, item.id)}
                  className={`relative px-2.5 2xl:px-3 py-1.5 text-xs font-display font-medium tracking-wide whitespace-nowrap transition-all duration-200 ${
                    isDarkHeader
                      ? isActive
                        ? 'text-[#0A1930] font-bold'
                        : 'text-white/90 hover:text-white hover:bg-white/15'
                      : isActive
                      ? 'text-white font-bold'
                      : 'text-slate-700 hover:text-[#0A1930] hover:bg-slate-200/60'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                      className={`absolute inset-0 ${
                        isDarkHeader ? 'bg-[#FFCD00]' : 'bg-[#006AA7]'
                      }`}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Action Button & Swedish Language Toggle (Right) */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Swedish / English Language Switcher Pill */}
            <div
              className={`flex items-center p-0.5 transition-all duration-300 ${
                isDarkHeader
                  ? 'bg-black/40 border border-white/20 text-white backdrop-blur-sm'
                  : 'bg-slate-100 border border-slate-200 text-[#0A1930]'
              }`}
            >
              <button
                type="button"
                onClick={() => setLanguage('sv')}
                className={`relative flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono-code font-bold transition-all ${
                  language === 'sv'
                    ? 'bg-[#006AA7] text-white shadow-xs'
                    : isDarkHeader
                    ? 'text-white/70 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 hover:text-[#0A1930] hover:bg-slate-200/60'
                }`}
                title="Växla hela webbplatsen till svenska"
                aria-label="Byt språk till svenska"
              >
                <span className="hidden 2xl:inline text-xs leading-none">🇸🇪</span>
                <span>SV</span>
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`relative flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono-code font-bold transition-all ${
                  language === 'en'
                    ? 'bg-[#0A1930] text-white shadow-xs'
                    : isDarkHeader
                    ? 'text-white/70 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 hover:text-[#0A1930] hover:bg-slate-200/60'
                }`}
                title="Switch whole site to English"
                aria-label="Switch language to English"
              >
                <span className="hidden 2xl:inline text-xs leading-none">🇬🇧</span>
                <span>EN</span>
              </button>
            </div>

            <motion.a
              href={pathForRoute('register')}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={(e) => handleLinkClick(e, 'register')}
              className="btn-pill-lime text-xs font-black py-2.5 px-4 2xl:px-5 whitespace-nowrap transition-all duration-200 shadow-md flex items-center gap-2 group relative overflow-hidden"
            >
              <span className="xl:hidden">{language === 'sv' ? 'REGISTRERA' : 'REGISTER'}</span>
              <span className="hidden xl:inline">{registerLabel}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.a>
          </div>

          {/* Mobile Right Controls: Fast Language Button + Hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleLanguage}
              className={`px-2.5 py-1.5 text-xs font-mono-code font-bold border flex items-center gap-1.5 transition-colors ${
                isDarkHeader
                  ? 'bg-black/30 border-white/20 text-white hover:bg-white/15'
                  : 'bg-slate-100 border-slate-200 text-[#0A1930] hover:bg-slate-200'
              }`}
              title={language === 'sv' ? 'Byt till engelska' : 'Byt till svenska'}
              aria-label="Växla språk"
            >
              <span>{language === 'sv' ? '🇸🇪 SV' : '🇬🇧 EN'}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg focus:outline-none transition-colors ${
                isDarkHeader ? 'text-white hover:bg-white/10' : 'text-[#0A1930] hover:bg-slate-100'
              }`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden overflow-hidden bg-white border-b border-slate-200 shadow-2xl max-h-[calc(100vh-80px)] overflow-y-auto text-[#0A1930]"
            >
              <div className="px-6 py-6 space-y-4">
                <div className="flex flex-col gap-1">
                  {navLinks.map((item, idx) => {
                    const isActive = activeTab === item.id;
                    return (
                      <motion.a
                        key={item.id}
                        href={hrefFor(item.id)}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25, delay: idx * 0.03 }}
                        onClick={(e) => handleLinkClick(e, item.id)}
                        className={`py-3 px-4 rounded-xl text-left text-sm font-display font-medium transition-all ${
                          isActive
                            ? 'text-[#006AA7] bg-slate-100 font-bold border border-slate-200'
                            : 'text-slate-700 hover:text-[#0A1930] hover:bg-slate-50'
                        }`}
                      >
                        {item.label}
                      </motion.a>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-3">
                  {/* Mobile Language Selector Card */}
                  <div className="p-3 bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                    <span className="text-xs font-display font-medium text-slate-700 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-[#006AA7]" />
                      <span>{language === 'sv' ? 'Språk / Language' : 'Language / Språk'}:</span>
                    </span>
                    <div className="flex items-center p-0.5 bg-slate-200 border border-slate-300">
                      <button
                        type="button"
                        onClick={() => setLanguage('sv')}
                        className={`flex items-center gap-1 px-3 py-1 text-xs font-mono-code font-bold transition-all ${
                          language === 'sv'
                            ? 'bg-[#006AA7] text-white shadow-xs'
                            : 'text-slate-700 hover:text-[#0A1930]'
                        }`}
                      >
                        <span>🇸🇪 SV</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setLanguage('en')}
                        className={`flex items-center gap-1 px-3 py-1 text-xs font-mono-code font-bold transition-all ${
                          language === 'en'
                            ? 'bg-[#0A1930] text-white shadow-xs'
                            : 'text-slate-700 hover:text-[#0A1930]'
                        }`}
                      >
                        <span>🇬🇧 EN</span>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenRegister();
                    }}
                    className="w-full btn-pill-lime py-3.5 text-xs font-black flex items-center justify-center gap-2 shadow-md"
                  >
                    <span>{registerLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="p-3 bg-slate-50 border border-slate-200 text-[11px] font-mono-code text-slate-500 text-center">
                    {language === 'sv'
                      ? 'Västerås, Sverige · Höstterminen 2026'
                      : 'Västerås, Sweden · Autumn 2026 Season'}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

    </>
  );
};
