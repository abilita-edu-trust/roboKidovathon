import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, ShieldCheck, Mail, MapPin } from 'lucide-react';

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
    { id: 'challenges', label: 'Competition' },
    { id: 'workflow', label: 'Workflow' },
    { id: 'events', label: 'Events' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    if (id === 'contact') {
      setContactModalOpen(true);
    } else {
      onNavigate(id);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 select-none ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 py-3 text-[#0A1930] shadow-sm'
            : 'bg-black/40 backdrop-blur-sm border-b border-white/10 py-4 text-white'
        }`}
      >
        <div className="w-full px-4 sm:px-6 flex items-center justify-between gap-4">

          {/* Brand Mark */}
          <button
            onClick={() => handleLinkClick('home')}
            className="text-left group focus:outline-none flex items-center"
          >
            <span
              className={`font-headline font-bold text-sm sm:text-base md:text-lg tracking-tight uppercase transition-colors duration-300 ${
                isScrolled
                  ? 'text-[#0A1930] group-hover:text-[#006AA7]'
                  : 'text-white group-hover:text-[#FFCD00]'
              }`}
            >
              VÄSTERÅS FUTURE INNOVATORS <span className="font-light text-xs text-slate-400">2026</span>
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <nav
            className={`hidden lg:flex items-center gap-1 p-1 transition-all duration-300 ${
              isScrolled
                ? 'bg-slate-100 border border-slate-200'
                : 'bg-black/30 border border-white/15 backdrop-blur-md'
            }`}
          >
            {navLinks.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item.id)}
                  className={`px-3.5 py-1.5 text-xs font-display font-medium tracking-wide transition-all duration-200 ${
                    isScrolled
                      ? isActive
                        ? 'bg-[#006AA7] text-white font-bold'
                        : 'text-slate-600 hover:text-[#0A1930] hover:bg-slate-200/60'
                      : isActive
                      ? 'bg-[#FFCD00] text-[#0A1930] font-bold'
                      : 'text-white/90 hover:text-white hover:bg-white/15'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action Button (Right) */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenRegister}
              className="btn-pill-lime text-xs font-black py-2.5 px-5 transition-all duration-200 shadow-md flex items-center gap-2"
            >
              <span>REGISTER SCHOOL / TEAM</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg focus:outline-none transition-colors ${
              isScrolled ? 'text-[#0A1930] hover:bg-slate-100' : 'text-white hover:bg-white/10'
            }`}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

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
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenRegister();
                    }}
                    className="w-full btn-pill-lime py-3.5 text-xs font-black flex items-center justify-center gap-2 shadow-md"
                  >
                    <span>REGISTER SCHOOL / TEAM</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] font-mono-code text-slate-500 text-center">
                    Västerås, Sweden · Autumn 2026 Season
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
              className="relative max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl z-10 space-y-6 text-[#0A1930]"
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
                  className="p-2 rounded-full text-slate-400 hover:text-[#0A1930] hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <p className="text-slate-600 font-light leading-relaxed">
                  Have questions about bringing the 20-hour STEM project to your school or preparing a student team? Contact the organizing secretariat:
                </p>

                <div className="space-y-3 p-4 bg-[#F8FAFC] rounded-2xl border border-slate-200 font-mono-code text-xs">
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
                  className="w-full sm:w-auto px-5 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono-code text-xs font-bold uppercase transition-colors"
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
