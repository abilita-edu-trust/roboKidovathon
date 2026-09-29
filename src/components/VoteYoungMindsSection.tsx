import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Sparkles,
  Trophy,
  Heart,
  Play,
  Pause,
  Volume2,
  Building,
  Copy,
  Check,
  ArrowRight,
  Image as ImageIcon
} from 'lucide-react';
import {
  IdeaSubmission,
  fetchApprovedIdeas,
  voteForIdea,
  hasVotedLocally
} from '../lib/ideasService';

interface VoteYoungMindsSectionProps {
  onNavigateIdeas: () => void;
  onNavigateSubmit: () => void;
  onNavigateAdmin?: () => void;
}

export const VoteYoungMindsSection: React.FC<VoteYoungMindsSectionProps> = ({
  onNavigateIdeas,
  onNavigateSubmit,
  onNavigateAdmin,
}) => {
  const [ideas, setIdeas] = useState<IdeaSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSegregation, setSelectedSegregation] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [votedMap, setVotedMap] = useState<Record<string, boolean>>({});
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);

  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await fetchApprovedIdeas();
        if (!cancelled) {
          setIdeas(data);
          const initialVoted: Record<string, boolean> = {};
          data.forEach((i) => {
            if (hasVotedLocally(i.id)) {
              initialVoted[i.id] = true;
            }
          });
          setVotedMap(initialVoted);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Distinct categories / segregations
  const segregations = useMemo(() => {
    const set = new Set<string>();
    ideas.forEach((i) => {
      if (i.category) set.add(i.category);
    });
    return Array.from(set);
  }, [ideas]);

  // Filtered Ideas preview (up to 6 cards on home)
  const filteredIdeas = useMemo(() => {
    return ideas.filter((item) => {
      if (selectedSegregation !== 'all' && item.category !== selectedSegregation) return false;
      return true;
    });
  }, [ideas, selectedSegregation]);

  const handleVote = async (idea: IdeaSubmission) => {
    try {
      const res = await voteForIdea(idea.id);
      if (res.voted) {
        setVotedMap((prev) => ({ ...prev, [idea.id]: true }));
        setIdeas((prev) =>
          prev.map((i) => (i.id === idea.id ? { ...i, votes_count: res.votes_count } : i))
        );
      }
    } catch (err) {
      console.error('Failed to vote:', err);
    }
  };

  const handleCopyLink = (idea: IdeaSubmission) => {
    const url = `${window.location.origin}/?route=ideas&idea=${idea.public_id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(idea.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const toggleAudio = (ideaId: string, url: string) => {
    if (activeAudioId === ideaId) {
      const current = audioRefs.current[ideaId];
      if (current) current.pause();
      setActiveAudioId(null);
    } else {
      if (activeAudioId && audioRefs.current[activeAudioId]) {
        audioRefs.current[activeAudioId].pause();
      }
      let audio = audioRefs.current[ideaId];
      if (!audio) {
        audio = new Audio(url);
        audio.onended = () => setActiveAudioId(null);
        audioRefs.current[ideaId] = audio;
      }
      audio.play();
      setActiveAudioId(ideaId);
    }
  };

  return (
    <div className="w-full pt-8 pb-4 space-y-8 border-t border-slate-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-mono-code font-bold tracking-[0.2em] text-[#006AA7] uppercase mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FFCD00]" />
            <span>COMMUNITY VOTING ARENA // VÄSTERÅS</span>
          </div>
          <h3 className="font-headline font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#0A1930]">
            Vote for an Idea of Young Minds
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            Explore innovations submitted by students across schools. Listen to voice notes, inspect blueprints, and vote to propel the best ideas to the Västerås Finals!
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onNavigateSubmit}
            className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-headline font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span>+ Submit Idea</span>
          </button>
          <button
            type="button"
            onClick={onNavigateIdeas}
            className="py-2.5 px-4 bg-[#0A1930] hover:bg-[#006AA7] text-white font-headline font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span>All Ideas Arena</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Segregation Filters & Media Switcher */}
      <div className="bg-slate-50 p-3.5 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Category Segregation Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono-code text-slate-500 uppercase mr-1">
            Category:
          </span>
          <button
            type="button"
            onClick={() => setSelectedSegregation('all')}
            className={`py-1 px-3 uppercase text-[11px] font-bold border transition-colors ${
              selectedSegregation === 'all'
                ? 'bg-[#006AA7] text-white border-[#006AA7]'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            All Segregations
          </button>
          {segregations.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedSegregation(cat)}
              className={`py-1 px-3 uppercase text-[11px] font-bold border transition-colors ${
                selectedSegregation === cat
                  ? 'bg-[#006AA7] text-white border-[#006AA7]'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Admin Formats Curation Link (Format filters visible only to Admin) */}
        {onNavigateAdmin && (
          <button
            type="button"
            onClick={onNavigateAdmin}
            className="py-1 px-2.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-600 hover:text-[#006AA7] text-[10px] font-mono-code font-bold uppercase flex items-center gap-1 transition-colors"
          >
            <span>🛡️ Admin Formats Curation</span>
          </button>
        )}
      </div>

      {/* Ideas Showcase Grid */}
      {loading ? (
        <div className="py-12 text-center text-slate-500 font-mono-code text-xs">
          <span className="inline-block w-4 h-4 border-2 border-[#006AA7] border-t-transparent animate-spin mr-2" />
          Loading young minds' ideas...
        </div>
      ) : filteredIdeas.length === 0 ? (
        <div className="p-8 bg-slate-50 border border-slate-200 text-center">
          <p className="font-headline font-bold text-sm text-slate-700 uppercase">
            No ideas in this segregation yet
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Be the first school student to submit an idea in this category!
          </p>
          <button
            onClick={onNavigateSubmit}
            className="mt-3 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-headline font-bold text-xs uppercase"
          >
            Submit Student Idea
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredIdeas.slice(0, 6).map((idea) => {
            const hasVoted = votedMap[idea.id] || false;
            const isPlaying = activeAudioId === idea.id;

            return (
              <div
                key={idea.id}
                className="bg-white border-2 border-slate-200 hover:border-[#006AA7] shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group overflow-hidden"
              >
                {/* Media Image / Blueprint Preview */}
                <div className="relative h-40 w-full bg-slate-100 overflow-hidden">
                  {idea.photo_url ? (
                    <img
                      src={idea.photo_url}
                      alt={idea.idea_title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 p-4 text-center">
                      <ImageIcon className="w-8 h-8 mb-1.5 opacity-60 text-slate-400" />
                      <span className="text-[10px] font-mono-code uppercase text-slate-500">
                        Concept Blueprint
                      </span>
                    </div>
                  )}

                  {/* Category Badge */}
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-[#0A1930]/85 backdrop-blur-sm text-white text-[10px] font-mono-code font-bold uppercase tracking-wider">
                    {idea.category || 'Innovation'}
                  </span>

                  {/* Vote Count Pill */}
                  <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm shadow border border-slate-200 text-slate-900 text-xs font-headline font-black flex items-center gap-1.5">
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        hasVoted ? 'text-red-500 fill-red-500' : 'text-slate-400'
                      }`}
                    />
                    <span>{idea.votes_count || 0} votes</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* STRICT GDPR: SCHOOL NAME FOLLOWED BY IDEA ID (NO KID NAME) */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#006AA7]/10 text-[#006AA7] text-[11px] font-headline font-black uppercase">
                        <Building className="w-3 h-3" />
                        <span>{idea.school_name}</span>
                      </span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-mono-code font-bold border border-slate-200">
                        {idea.public_id}
                      </span>
                    </div>

                    <h4 className="font-headline font-black text-base text-[#0A1930] group-hover:text-[#006AA7] transition-colors line-clamp-2">
                      {idea.idea_title}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 font-light leading-relaxed">
                      {idea.idea_description || 'Student concept submission.'}
                    </p>
                  </div>

                  {/* Voice note inline player if available */}
                  {idea.voice_note_url && (
                    <div className="p-2 bg-sky-50 border border-sky-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-[#006AA7] font-semibold text-[11px]">
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{isPlaying ? 'Playing pitch audio...' : 'Voice Note Pitch'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleAudio(idea.id, idea.voice_note_url!)}
                        className="py-1 px-2.5 bg-[#006AA7] hover:bg-[#013A63] text-white text-[10px] font-headline font-bold uppercase flex items-center gap-1 transition-colors"
                      >
                        {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        <span>{isPlaying ? 'Pause' : 'Listen'}</span>
                      </button>
                    </div>
                  )}

                  {/* Single Action Button: Vote for this Idea & Share */}
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                    <button
                      type="button"
                      disabled={hasVoted}
                      onClick={() => handleVote(idea)}
                      className={`flex-1 py-2.5 px-3 font-headline font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all ${
                        hasVoted
                          ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                          : 'bg-[#006AA7] hover:bg-[#013A63] text-white'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${hasVoted ? 'fill-current' : ''}`} />
                      <span>{hasVoted ? 'Voted' : 'Vote for this Idea'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyLink(idea)}
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors"
                      title="Copy campaign link"
                    >
                      {copiedId === idea.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom CTA Banner */}
      <div className="bg-[#0A1930] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg border border-[#0A1930]">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono-code font-bold tracking-widest text-[#FFCD00] uppercase">
            <Trophy className="w-3.5 h-3.5 text-[#FFCD00]" />
            <span>TOP 10 LEADERBOARD & FULL ARENA</span>
          </div>
          <h4 className="font-headline font-black text-lg sm:text-xl uppercase tracking-tight">
            Want to see all {ideas.length} student innovations?
          </h4>
          <p className="text-xs text-slate-300 font-light">
            Head to the full public voting arena to view the ranked leaderboard, search by school, and support young innovators.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateIdeas}
          className="w-full sm:w-auto py-3.5 px-6 bg-[#FFCD00] hover:bg-[#E6B800] text-[#0A1930] font-headline font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shrink-0 transition-transform active:scale-95"
        >
          <span>View All Ideas & Leaderboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
