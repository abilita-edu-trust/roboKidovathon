import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, ShieldCheck, Mail, MapPin, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

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
  const [contactModalOpen, setContactModalOpen] = useState(false);
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
    { id: 'challenges', label: language === 'sv' ? 'Tävling' : 'Competition' },
    { id: 'workflow', label: language === 'sv' ? 'Arbetsflöde' : 'Workflow' },
    { id: 'events', label: language === 'sv' ? 'Evenemang' : 'Events' },
    { id: 'about', label: language === 'sv' ? 'Om oss' : 'About' },
    { id: 'contact', label: language === 'sv' ? 'Kontakt' : 'Contact' },
  ];

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    if (id === 'contact') {
      setContactModalOpen(true);
    } else {
      onNavigate(id);
    }
  };

  const isDarkHeader = activeTab === 'home' && !isScrolled;

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
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleLinkClick('home')}
            className="text-left group focus:outline-none flex items-center gap-2.5"
          >
            {/* Swedish Flag / STEM Mark */}
            <div className="w-5 h-5 bg-[#006AA7] flex items-center justify-center relative overflow-hidden shadow-2xs flex-shrink-0">
              <div className="absolute top-0 bottom-0 left-[35%] w-[22%] bg-[#FFCD00]" />
              <div className="absolute left-0 right-0 top-[38%] h-[24%] bg-[#FFCD00]" />
            </div>

            <span
              className={`font-headline font-black text-sm sm:text-base md:text-lg tracking-tight uppercase transition-colors duration-300 ${
                isDarkHeader
                  ? 'text-white group-hover:text-[#FFCD00]'
                  : 'text-[#0A1930] group-hover:text-[#006AA7]'
              }`}
            >
              VÄSTERÅS FUTURE INNOVATORS{' '}
              <span
                className={`font-mono-code font-bold text-xs px-1.5 py-0.5 ml-1 border transition-colors ${
                  isDarkHeader
                    ? 'text-[#FFCD00] bg-white/10 border-white/20'
                    : 'text-[#006AA7] bg-slate-100 border-slate-200'
                }`}
              >
                2026
              </span>
            </span>
          </motion.button>

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
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item.id)}
                  className={`relative px-3.5 py-1.5 text-xs font-display font-medium tracking-wide transition-all duration-200 ${
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
                </button>
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
                <span className="text-xs leading-none">🇸🇪</span>
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
                <span className="text-xs leading-none">🇬🇧</span>
                <span>EN</span>
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onOpenRegister}
              className="btn-pill-lime text-xs font-black py-2.5 px-5 transition-all duration-200 shadow-md flex items-center gap-2 group relative overflow-hidden"
            >
              <span>{language === 'sv' ? 'REGISTRERA SKOLA / LAG' : 'REGISTER SCHOOL / TEAM'}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
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
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25, delay: idx * 0.03 }}
                        onClick={() => handleLinkClick(item.id)}
                        className={`py-3 px-4 rounded-xl text-left text-sm font-display font-medium transition-all ${
                          isActive
                            ? 'text-[#006AA7] bg-slate-100 font-bold border border-slate-200'
                            : 'text-slate-700 hover:text-[#0A1930] hover:bg-slate-50'
                        }`}
                      >
                        {item.label}
                      </motion.button>
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
                    <span>{language === 'sv' ? 'REGISTRERA SKOLA / LAG' : 'REGISTER SCHOOL / TEAM'}</span>
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

      {/* ── REAL CONTACT MODAL EXPERIENCES ── */}
      <AnimatePresence>
        {contactModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setContactModalOpen(false)}
              className="fixed inset-0 bg-[#0A1930]/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-lg w-full bg-white p-6 sm:p-8 border border-slate-200 shadow-2xl z-10 space-y-6 text-[#0A1930]"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-mono-code font-bold text-[#006AA7] uppercase tracking-wider block">
                    VÄSTERÅS LEAGUE OFFICE
                  </span>
                  <h3 className="font-headline font-black text-xl sm:text-2xl uppercase tracking-tight text-[#0A1930]">
                    Contact Organizers
                  </h3>
                </div>
                <button
                  onClick={() => setContactModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-[#0A1930] hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <p className="text-slate-600 font-light leading-relaxed">
                  Have questions about bringing the 20-hour STEM project to your school or preparing a student team? Contact the organizing secretariat:
                </p>

                <div className="space-y-3 p-4 bg-[#F8FAFC] border border-slate-200 font-mono-code text-xs">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#006AA7] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">HOST &amp; LOCATION:</span>
                      <strong className="text-[#0A1930]">Indisk BarnKlubb (IBK) Västerås &amp; INIAC</strong>
                      <span className="text-slate-500 block">Västerås, Sweden</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-2 border-t border-slate-200">
                    <Mail className="w-4 h-4 text-[#006AA7] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">DIRECT INQUIRIES:</span>
                      <strong className="text-[#0A1930]">contact@robokidovation.se</strong>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-2 border-t border-slate-200">
                    <ShieldCheck className="w-4 h-4 text-[#006AA7] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">PARTNERS:</span>
                      <span className="text-slate-600">SkillSkolan (Education) · Blix (Hardware)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setContactModalOpen(false);
                    onOpenRegister();
                  }}
                  className="w-full btn-pill-lime py-3 text-xs font-black tracking-wider uppercase text-center"
                >
                  BOOK A SCHOOL MEETING / REGISTER
                </button>
                <button
                  onClick={() => setContactModalOpen(false)}
                  className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono-code text-xs font-bold uppercase transition-colors"
                >
                  CLOSE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
