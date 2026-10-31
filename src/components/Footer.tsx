import React from 'react';
import { Terminal, Github, Twitter, Disc as Discord, Mail } from 'lucide-react';

interface FooterProps {
  onOpenRegister: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenRegister }) => {
  return (
    <footer className="w-full bg-[#040406] text-white border-t border-white/[0.08] pt-20 pb-12 px-6 sm:px-10">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-white/[0.06]">
          
          {/* Col 1 & 2 - Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 p-[1px]">
                <div className="w-full h-full bg-black rounded-[7px] flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
              <span className="font-display font-extrabold text-xl tracking-tight text-white uppercase">
                APEX GLOBAL 2026
              </span>
            </div>
            <p className="text-xs text-slate-400 font-light leading-relaxed max-w-sm">
              The premier international technology hackathon and non-dilutive capital accelerator. Convening 60+ nations to solve critical frontiers in AI, quantum mechanics, autonomous machines, and global finance.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a href="#" className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors" aria-label="Discord">
                <Discord className="w-4 h-4" />
              </a>
              <a href="mailto:director@apexglobal.io" className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors" aria-label="Email">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3 - Navigation */}
          <div>
            <div className="text-xs font-mono-code font-bold tracking-[0.2em] text-slate-300 uppercase mb-4">
              CHAMPIONSHIP
            </div>
            <ul className="space-y-2.5 text-xs text-slate-400 font-light">
              <li><a href="#tracks" className="hover:text-white transition-colors">Frontier Tracks</a></li>
              <li><a href="#prizes" className="hover:text-white transition-colors">Prize Pool & Grants</a></li>
              <li><a href="#timeline" className="hover:text-white transition-colors">Timeline & Milestones</a></li>
              <li><a href="#criteria" className="hover:text-white transition-colors">Evaluation Rubric</a></li>
              <li><a href="#perks" className="hover:text-white transition-colors">Developer Perks</a></li>
            </ul>
          </div>

          {/* Col 4 - Governance & Security */}
          <div>
            <div className="text-xs font-mono-code font-bold tracking-[0.2em] text-slate-300 uppercase mb-4">
              GOVERNANCE & IP
            </div>
            <ul className="space-y-2.5 text-xs text-slate-400 font-light">
              <li><a href="#" className="hover:text-white transition-colors">100% Team IP Defensibility</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Non-Dilutive Contract Terms</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Institutional Code of Conduct</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security & PGP Keys</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Jury Disclosures</a></li>
            </ul>
          </div>

          {/* Col 5 - Quick Action */}
          <div>
            <div className="text-xs font-mono-code font-bold tracking-[0.2em] text-slate-300 uppercase mb-4">
              COHORT STATUS
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.07] space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono-code text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>APPLICATIONS OPEN</span>
              </div>
              <p className="text-[13px] text-slate-400 font-light leading-relaxed">
                Vetting closes 15 March 2026 at 23:59 UTC.
              </p>
              <button
                onClick={onOpenRegister}
                className="w-full py-2 rounded-lg text-[13px] font-mono-code font-bold tracking-wider uppercase text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
              >
                APPLY AS TEAM →
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Metadata & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] font-mono-code text-slate-400">
          <div>
            © 2026 APEX GLOBAL FOUNDATION. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6">
            <span>SYNCHRONIZED WITH GLOBAL VC SYNDICATE</span>
            <span>GDPR & ISO-27001 VERIFIED</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
