import React, { useState } from 'react';
import { X, Download, FileText, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { roboSprintArenaMat, roboSprintKitPieces } from '../assets/images';
import { supabase } from '../lib/supabase';

interface EventDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EventDeckModal: React.FC<EventDeckModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [downloaded, setDownloaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  if (!isOpen) return null;

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitError('');
    setIsSubmitting(true);

    const { error } = await supabase.from('prospectus_downloads').insert({ email });

    setIsSubmitting(false);

    if (error) {
      setSubmitError('Something went wrong. Please try again.');
      return;
    }

    setDownloaded(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto select-none">
      <div onClick={onClose} className="fixed inset-0 bg-[#0A1930]/60 backdrop-blur-md -z-10" />

      <div className="relative w-full max-w-lg bg-white border border-slate-200 shadow-2xl p-6 sm:p-10 my-8 text-[#0A1930]">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-[#0A1930] hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!downloaded ? (
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-mono-code font-bold tracking-[0.25em] text-[#006AA7] uppercase mb-2">
              <FileText className="w-3.5 h-3.5" />
              <span>OFFICIAL PROSPECTUS &amp; GUIDE</span>
            </div>
            <h2 className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#0A1930]">
              Download Event Deck.
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-light mt-2 leading-relaxed">
              Complete tournament prospectus for school principals, educators, and team mentors. Includes the Robo-Sprint &amp; Robo-Precision rulebooks, official kit inventories, and competition schedules.
            </p>

            {/* Visual Document Previews */}
            <div className="my-4 grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200">
              <div className="space-y-1">
                <div className="h-20 overflow-hidden bg-[#070709] border border-slate-200 p-1">
                  <img
                    src={roboSprintArenaMat}
                    alt="3D Arena Spec"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="block text-[9px] font-mono-code text-center text-slate-500 uppercase">
                  3D Arena Blueprints
                </span>
              </div>
              <div className="space-y-1">
                <div className="h-20 overflow-hidden bg-white border border-slate-200 p-1">
                  <img
                    src={roboSprintKitPieces}
                    alt="Kit Piece List"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="block text-[9px] font-mono-code text-center text-slate-500 uppercase">
                  Hardware Piece Lists
                </span>
              </div>
            </div>

            <form onSubmit={handleDownload} className="mt-4 space-y-4">
              <div>
                <label className="block text-[10px] font-mono-code font-bold tracking-wider text-slate-500 uppercase mb-1">
                  WORK / INSTITUTIONAL EMAIL *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="principal@skola.se"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 focus:border-[#006AA7] focus:outline-none text-xs sm:text-sm text-[#0A1930] transition-colors"
                />
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 text-[11px] font-mono-code text-slate-500 space-y-1">
                <div className="flex items-center gap-1.5 text-[#0A1930] font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#006AA7]" />
                  <span>DOCUMENT DETAILS</span>
                </div>
                <div>Format: PDF · Version: 2026.1 Official</div>
                <div>Includes: Competition Structure, Kit Lists &amp; Arena Rules</div>
              </div>

              {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 flex items-center gap-2 text-xs font-mono-code text-red-600">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-pill-lime py-4 text-xs font-headline font-black tracking-[0.14em] flex items-center justify-center gap-2 shadow-xl"
              >
                <Download className="w-4 h-4" />
                <span>{isSubmitting ? 'SENDING...' : 'ACCESS OFFICIAL PROSPECTUS'}</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-14 h-14 bg-[#006AA7]/10 border border-[#006AA7]/40 flex items-center justify-center text-[#006AA7] mb-4">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="font-headline font-black text-xl text-[#0A1930] uppercase tracking-tight">
              Event Deck Dispatched.
            </h3>
            <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed font-light">
              The official prospectus PDF link has been transmitted to <strong className="text-[#0A1930]">{email}</strong>.
            </p>
            <button
              onClick={() => {
                setDownloaded(false);
                onClose();
              }}
              className="btn-pill-white mt-6 px-6 py-2.5 text-xs"
            >
              CLOSE WINDOW
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
