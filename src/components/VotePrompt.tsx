import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Building, Check, Heart, Lightbulb, Trophy, X } from 'lucide-react';
import { IdeaSubmission, fetchApprovedIdeas, hasVotedLocally, voteForIdea } from '../lib/ideasService';
import { useSite } from '../context/SiteContext';

const SESSION_KEY = 'vote_prompt_shown';
const DELAY_MS = 6000;
const TOP_N = 3;

interface VotePromptProps {
  /** Take the visitor to the vote section. */
  onGoToVote: () => void;
  onSubmitIdea: () => void;
}

/**
 * "Vote for an idea" popup: opens once per browser session, 6 s after the
 * visit starts, and any time from the floating button in the bottom-left corner.
 * Shows the current top ideas so visitors can vote without leaving the page.
 */
export const VotePrompt: React.FC<VotePromptProps> = ({ onGoToVote, onSubmitIdea }) => {
  const site = useSite();
  const [open, setOpen] = useState(false);
  const [ideas, setIdeas] = useState<IdeaSubmission[] | null>(null);
  const [voted, setVoted] = useState<Record<string, boolean>>({});
  const [voting, setVoting] = useState<string | null>(null);

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

  // Load the leaderboard the first time the popup opens.
  useEffect(() => {
    if (!open || ideas) return;
    fetchApprovedIdeas(site.ideasFilter).then((list) => {
      setIdeas(list);
      setVoted(Object.fromEntries(list.map((i) => [i.id, hasVotedLocally(i.id)])));
    });
  }, [open, ideas, site.ideasFilter]);

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

  const handleVote = async (idea: IdeaSubmission) => {
    setVoting(idea.id);
    try {
      const res = await voteForIdea(idea.id);
      if (res.voted || res.already_voted) {
        setVoted((v) => ({ ...v, [idea.id]: true }));
        setIdeas((list) =>
          list ? list.map((i) => (i.id === idea.id ? { ...i, votes_count: res.votes_count ?? i.votes_count } : i)) : list
        );
      }
    } catch (err) {
      console.error('Failed to vote:', err);
    } finally {
      setVoting(null);
    }
  };

  const top = (ideas ?? []).slice(0, TOP_N);

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
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-[#0A1930]/70"
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
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white border-2 border-[#059669] shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center text-white hover:bg-white/15 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="relative bg-[#059669] text-white p-6 pr-14 overflow-hidden">
                <Lightbulb className="absolute -right-4 -bottom-6 w-32 h-32 text-white/10" aria-hidden />
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#FFCD00] text-[#0A1930] text-[10px] font-mono-code font-black uppercase tracking-widest">
                  {site.hackLabel} · {site.cityName}
                </span>
                <h2
                  id="vote-prompt-title"
                  className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight mt-3 leading-[1.05]"
                >
                  Vote for an idea of young minds
                </h2>
                <p className="text-sm text-emerald-50 mt-2 leading-relaxed">
                  Students across {site.cityName} are imagining a brighter tomorrow. Back your favourite with one tap.
                </p>
              </div>

              {/* Leaderboard */}
              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-mono-code font-bold uppercase tracking-wider text-[#0A1930]">
                    <Trophy className="w-4 h-4 text-[#FFCD00]" />
                    Top ideas right now
                  </span>
                  {ideas && ideas.length > 0 && (
                    <span className="text-[11px] font-mono-code text-slate-500">{ideas.length} ideas in the arena</span>
                  )}
                </div>

                {ideas === null ? (
                  <div className="space-y-2" aria-busy="true">
                    {Array.from({ length: TOP_N }).map((_, i) => (
                      <div key={i} className="h-16 bg-slate-100 animate-pulse" />
                    ))}
                  </div>
                ) : top.length === 0 ? (
                  <div className="p-5 border border-dashed border-emerald-300 bg-emerald-50/50 text-center text-sm text-slate-600">
                    Ideas are being reviewed. Be among the first to submit yours!
                  </div>
                ) : (
                  <ol className="space-y-2">
                    {top.map((idea, idx) => {
                      const isVoted = voted[idea.id];
                      return (
                        <li
                          key={idea.id}
                          className="flex items-center gap-3 p-3 border border-slate-200 hover:border-[#059669] transition-colors"
                        >
                          <span
                            className={`w-8 h-8 shrink-0 flex items-center justify-center font-headline font-black text-sm ${
                              idx === 0 ? 'bg-[#FFCD00] text-[#0A1930]' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="font-headline font-bold text-sm text-[#0A1930] truncate" title={idea.idea_title}>
                              {idea.idea_title}
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate">
                              <Building className="w-3 h-3 shrink-0" />
                              <span className="truncate">{idea.school_name}</span>
                              <span className="mx-1">·</span>
                              <Heart className="w-3 h-3 text-rose-500 shrink-0" />
                              <span>{idea.votes_count}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleVote(idea)}
                            disabled={isVoted || voting === idea.id}
                            className={`shrink-0 flex items-center gap-1 px-3 py-2 text-[11px] font-syne font-black uppercase tracking-wider transition-colors ${
                              isVoted
                                ? 'bg-emerald-50 text-[#059669] border border-emerald-200'
                                : 'bg-[#059669] hover:bg-[#047857] text-white disabled:opacity-60'
                            }`}
                          >
                            {isVoted ? <Check className="w-3.5 h-3.5" /> : <Heart className="w-3.5 h-3.5" />}
                            {isVoted ? 'Voted' : 'Vote'}
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => go(onGoToVote)}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-[#0A1930] hover:bg-[#006AA7] text-white font-syne font-black text-xs uppercase tracking-wider transition-colors"
                  >
                    See all ideas
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
