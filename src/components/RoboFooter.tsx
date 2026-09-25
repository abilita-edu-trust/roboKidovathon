import React from 'react';

interface RoboFooterProps {
  onNavigate: (route: string) => void;
  onOpenFaq: () => void;
}

export const RoboFooter: React.FC<RoboFooterProps> = ({ onNavigate, onOpenFaq }) => {
  return (
    <footer className="w-full bg-[#040912] text-white border-t border-white/10 pt-16 pb-12 px-6 sm:px-10">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-white/10">
          
          {/* Brand & Background */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="bg-[#0052FF] text-white font-display font-extrabold text-sm px-2 py-0.5 rounded-[2px]">
                ROBO
              </div>
              <span className="font-display font-black text-lg text-white uppercase tracking-tight">
                KIDO-A-THON
              </span>
            </div>

            <p className="text-[10px] font-mono-code font-bold tracking-[0.2em] text-[#E2FF00] uppercase">
              SWEDEN LEAGUE · VÄSTERÅS 2026
            </p>

            <p className="text-xs text-slate-400 font-light leading-relaxed max-w-sm">
              Official hands-on student robotics tournament league in Sweden. Modelled on international Techfest engineering competitions and adapted for Nordic school inclusion and curricular standards.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <div className="text-[10px] font-mono-code font-bold tracking-[0.2em] text-slate-300 uppercase mb-4">
              NAVIGATION
            </div>
            <ul className="space-y-2.5 text-xs font-display font-semibold text-slate-400">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                  HOME
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('challenges')} className="hover:text-white transition-colors">
                  CHALLENGES & RULES
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('how-it-works')} className="hover:text-white transition-colors">
                  HOW IT WORKS
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('for-schools')} className="hover:text-white transition-colors">
                  FOR SCHOOLS PORTAL
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  ABOUT & PEDAGOGY
                </button>
              </li>
              <li>
                <button onClick={onOpenFaq} className="hover:text-white transition-colors">
                  FAQ & SUPPORT
                </button>
              </li>
            </ul>
          </div>

          {/* Tournament Formats */}
          <div>
            <div className="text-[10px] font-mono-code font-bold tracking-[0.2em] text-slate-300 uppercase mb-4">
              DISCIPLINES
            </div>
            <ul className="space-y-2.5 text-xs font-display font-semibold text-slate-400">
              <li>
                <button onClick={() => onNavigate('challenges')} className="hover:text-[#0052FF] transition-colors">
                  ROBO-SPRINT (JUNIOR)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('challenges')} className="hover:text-[#E2FF00] transition-colors">
                  ROBO-PRECISION (SENIOR)
                </button>
              </li>
              <li>
                <span className="text-slate-500">CITY FINALS (MÄLARDALEN INTERNATIONAL SCHOOL)</span>
              </li>
              <li>
                <span className="text-slate-500">STOCKHOLM SHOWDOWN</span>
              </li>
            </ul>
          </div>

          {/* Contact / Inquiries */}
          <div>
            <div className="text-[10px] font-mono-code font-bold tracking-[0.2em] text-slate-300 uppercase mb-4">
              COORDINATION
            </div>
            <div className="space-y-3 text-xs text-slate-400 font-light">
              <p>Municipal Coordinator Office:<br />Västerås, Sweden</p>
              <a
                href="mailto:contact@robokidoathon.se"
                className="text-[#0052FF] hover:text-[#E2FF00] font-mono-code text-xs transition-colors block"
              >
                contact@robokidoathon.se
              </a>
              <span className="inline-block text-[10px] font-mono-code text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-[2px] bg-emerald-500/10">
                ● 2026 REGISTRATION ACTIVE
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Legal / Compliance */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-code text-slate-500">
          <div>
            © 2026 VÄSTERÅS FUTURE INNOVATORS. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4">
            <span>SWEDISH CURRICULUM ALIGNED</span>
            <span>GDPR COMPLIANT</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
