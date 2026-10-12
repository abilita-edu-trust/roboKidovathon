import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ShieldCheck, Loader2 } from 'lucide-react';

interface PartnerPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerName: string;
  url: string;
  role?: string;
}

export const PartnerPreviewModal: React.FC<PartnerPreviewModalProps> = ({
  isOpen,
  onClose,
  partnerName,
  url,
  role,
}) => {
  const [iframeLoading, setIframeLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Prevent background scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIframeLoading(true);
      setHasError(false);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, url]);

  // Keyboard accessibility: Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="partner-modal-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 select-none"
        >
          {/* Backdrop with blur & click outside to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-5xl h-[88vh] max-h-[850px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden border border-slate-300"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#0A1930] text-white border-b border-slate-800">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#006AA7] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-[#FFCD00]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3
                      id="partner-modal-title"
                      className="font-headline font-black text-sm sm:text-base uppercase tracking-tight truncate text-white"
                    >
                      {partnerName}
                    </h3>
                    <span className="hidden sm:inline-block text-[10px] font-mono-code px-2 py-0.5 bg-white/10 text-slate-300 uppercase">
                      Official Partner Preview
                    </span>
                  </div>
                  {role && (
                    <p className="text-[11px] font-mono-code text-slate-400 truncate">
                      {role}
                    </p>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#006AA7] hover:bg-[#005282] text-white text-xs font-headline font-bold uppercase tracking-wider rounded transition-colors"
                  title="Open in new browser tab"
                >
                  <span className="hidden sm:inline">Open in Tab</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close partner preview modal"
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Iframe Viewport Container */}
            <div className="relative flex-1 w-full bg-slate-100 overflow-hidden">
              {iframeLoading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50 gap-3 text-slate-600">
                  <Loader2 className="w-8 h-8 text-[#006AA7] animate-spin" />
                  <span className="text-xs font-mono-code uppercase tracking-wider">
                    Loading Partner Site Preview...
                  </span>
                </div>
              )}

              {hasError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-slate-50 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                    <ExternalLink className="w-6 h-6" />
                  </div>
                  <h4 className="font-headline font-black text-lg text-[#0A1930] uppercase">
                    Direct Navigation Available
                  </h4>
                  <p className="text-xs text-slate-600 max-w-md font-light leading-relaxed">
                    This external partner site requires direct browsing in a new tab due to security policies.
                  </p>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-[#006AA7] hover:bg-[#013A63] text-white font-headline font-black text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2"
                  >
                    <span>Proceed to {partnerName}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ) : (
                <iframe
                  src={url}
                  title={`${partnerName} Preview`}
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  onLoad={() => setIframeLoading(false)}
                  onError={() => {
                    setIframeLoading(false);
                    setHasError(true);
                  }}
                />
              )}
            </div>

            {/* Modal Bottom Bar */}
            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono-code text-slate-500">
              <span className="truncate">
                Viewing: <span className="text-[#006AA7]">{url}</span>
              </span>
              <span className="hidden sm:inline shrink-0">Press ESC to close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
