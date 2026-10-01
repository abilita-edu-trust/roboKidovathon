import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Heart, Lightbulb, X } from 'lucide-react';

const SESSION_KEY = 'vote_prompt_shown';
const DELAY_MS = 6000;

interface VotePromptProps {
  /** Take the visitor to the vote section. */
  onGoToVote: () => void;
  onSubmitIdea: () => void;
}

/**
 * "Vote for an idea" popup: opens once per browser session, 6 s after the
 * visit starts, and any time from the floating button in the bottom-left corner.
 */
export const VotePrompt: React.FC<VotePromptProps> = ({ onGoToVote, onSubmitIdea }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let alreadyShown = false;
    try {
      alreadyShown = sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      /* storage blocked: just show it */
    }
    if (alreadyShown) return;

    const timer = window.setTimeout(() => {
      setOpen(true);
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        /* ignore */
      }
    }, DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  return (
    <>
      {/* Floating button, bottom-left */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-5 z-[60] flex items-center gap-2 px-4 py-3 bg-[#059669] hover:bg-[#047857] text-white font-syne font-black text-xs uppercase tracking-wider shadow-xl transition-colors"
        aria-label="Vote for an idea"
      >
        <Heart className="w-4 h-4 fill-white" />
        <span>Vote for an idea</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-[#0A1930]/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="vote-prompt-title"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-white border-2 border-[#059669] shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="bg-[#059669] text-white p-6 pr-12">
                <span className="text-[11px] font-mono-code font-bold uppercase tracking-[0.2em] text-emerald-100">
                  Young Inno Hack · Västerås
                </span>
                <h2 id="vote-prompt-title" className="font-headline font-black text-2xl uppercase tracking-tight mt-1">
                  Vote for an idea of young minds
                </h2>
              </div>

              <div className="p-6 space-y-5">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Students across Västerås have shared ideas for a brighter tomorrow. Pick your favourite and give it
                  your vote. It takes just a few seconds.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => go(onGoToVote)}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-[#059669] hover:bg-[#047857] text-white font-syne font-black text-xs uppercase tracking-wider transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                    Vote now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(onSubmitIdea)}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-emerald-50 text-[#059669] border border-[#059669]/40 font-syne font-black text-xs uppercase tracking-wider transition-colors"
                  >
                    <Lightbulb className="w-4 h-4" />
                    Submit an idea
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
