import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Flame,
  Search,
  CheckCircle2,
  Copy,
  Check,
  Play,
  Pause,
  Volume2,
  Video,
  Image as ImageIcon,
  Building,
  Heart,
  X,
  ExternalLink,
  Sparkles,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import {
  IdeaSubmission,
  fetchApprovedIdeas,
  voteForIdea,
  hasVotedLocally
} from '../lib/ideasService';
import { useSite } from '../context/SiteContext';

interface IdeasVotingPageProps {
  onNavigateHome: () => void;
  onNavigateSubmit: () => void;
  onNavigateAdmin?: () => void;
}

export const IdeasVotingPage: React.FC<IdeasVotingPageProps> = ({
  onNavigateHome,
  onNavigateSubmit,
  onNavigateAdmin,
}) => {
  const site = useSite();
  const [ideas, setIdeas] = useState<IdeaSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSchool, setSelectedSchool] = useState('all');

  // Modal Pop-up State
  const [selectedIdea, setSelectedIdea] = useState<IdeaSubmission | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [voteFeedback, setVoteFeedback] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Audio player ref
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Load ideas and check deep-link URL ?idea=...
  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    setLoading(true);
    try {
      const data = await fetchApprovedIdeas(site.ideasFilter);
      setIdeas(data);

      // Deep link support: ?idea=VFI-IDEA-0001
      const params = new URLSearchParams(window.location.search);
      const deepIdeaId = params.get('idea');
      if (deepIdeaId && data.length > 0) {
        const found = data.find(
          (i) => i.public_id === deepIdeaId || i.id === deepIdeaId
        );
        if (found) {
          setSelectedIdea(found);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Distinct schools and categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    ideas.forEach((i) => {
      if (i.category) set.add(i.category);
    });
    return Array.from(set);
  }, [ideas]);

  const schools = useMemo(() => {
    const set = new Set<string>();
    ideas.forEach((i) => {
      if (i.school_name) set.add(i.school_name);
    });
    return Array.from(set);
  }, [ideas]);

  // Top 10 Ideas automatically ranked by votes
  const top10Ideas = useMemo(() => {
    return [...ideas]
      .sort((a, b) => (b.votes_count || 0) - (a.votes_count || 0))
      .slice(0, 10);
  }, [ideas]);

  // Filtered Ideas
  const filteredIdeas = useMemo(() => {
    return ideas.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (selectedSchool !== 'all' && item.school_name !== selectedSchool) return false;

      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchTitle = item.idea_title.toLowerCase().includes(query);
        const matchStudent = item.student_name.toLowerCase().includes(query);
        const matchSchool = item.school_name.toLowerCase().includes(query);
        const matchId = item.public_id.toLowerCase().includes(query);
        return matchTitle || matchStudent || matchSchool || matchId;
      }
      return true;
    });
  }, [ideas, selectedCategory, selectedSchool, searchTerm]);

  // Handle Vote Action
  const handleVote = async (idea: IdeaSubmission) => {
    setIsVoting(true);
    setVoteFeedback(null);
    try {
      const res = await voteForIdea(idea.id);
      if (res.voted) {
        setVoteFeedback('Your vote has been recorded! Thank you for supporting this young innovator.');
        // Update local state vote count
        setIdeas((prev) =>
          prev.map((i) => (i.id === idea.id ? { ...i, votes_count: res.votes_count } : i))
        );
        if (selectedIdea && selectedIdea.id === idea.id) {
          setSelectedIdea({ ...selectedIdea, votes_count: res.votes_count });
        }
      } else {
        setVoteFeedback('You have already voted for this idea.');
      }
    } catch (err: any) {
      setVoteFeedback(err.message || 'Could not record vote');
    } finally {
      setIsVoting(false);
    }
  };

  const handleCopyIdeaLink = (idea: IdeaSubmission) => {
    const url = `${window.location.origin}${site.ideasPath}?idea=${idea.public_id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-[#0A1930] pt-24 pb-24 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Navigation & Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs font-mono-code font-bold tracking-wider text-[#006AA7] uppercase hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <button
            onClick={onNavigateSubmit}
            className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-headline font-black uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all"
          >
            <span>+ Submit Your Idea</span>
          </button>
        </div>

        {/* Page Title & Mission */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono-code font-bold tracking-[0.2em] text-[#006AA7] uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#FFCD00]" />
            <span>{site.location ? `${site.hackLabel} ${site.cityName}`.toUpperCase() : 'VÄSTERÅS FUTURE INNOVATORS'} // PUBLIC VOTING ARENA</span>
          </div>
          <h1 className="font-headline font-black text-3xl sm:text-5xl uppercase tracking-tight text-[#0A1930]">
            View Ideas and Vote for the Best Idea
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
            Explore innovative prototypes, blueprints, and pitches created by Swedish students.
            Listen to their voice notes, watch their videos, and vote for the top innovations!
          </p>
        </div>

        {/* ── SECTION 1: TOP 10 IDEAS LEADERBOARD (AUTOMATIC RANKING BY VOTES) ── */}
        <div className="bg-white border-2 border-[#0A1930] p-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#FFCD00]/20 text-[#0A1930]">
                <Trophy className="w-5 h-5 text-amber-500 fill-amber-500" />
              </div>
              <div>
                <h2 className="font-headline font-black text-lg sm:text-xl uppercase tracking-tight text-[#0A1930]">
                  Top 10 Ideas Leaderboard
                </h2>
                <span className="text-[11px] font-mono-code text-slate-500">
                  Automatically ranked by live votes across schools
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 border border-red-200 text-xs font-mono-code font-bold uppercase">
              <Flame className="w-4 h-4 fill-red-500 animate-pulse" />
              <span>Trending Innovations</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {top10Ideas.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setSelectedIdea(item)}
                className="p-3.5 border border-slate-200 hover:border-[#006AA7] hover:shadow-md transition-all cursor-pointer bg-slate-50/50 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-headline font-black px-2 py-0.5 ${
                        idx === 0
                          ? 'bg-amber-400 text-[#0A1930]'
                          : idx === 1
                          ? 'bg-slate-300 text-slate-800'
                          : idx === 2
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-mono-code font-bold text-emerald-600 flex items-center gap-1">
                      <Heart className="w-3 h-3 fill-emerald-600" />
                      {item.votes_count || 0}
                    </span>
                  </div>

                  <h3 className="font-headline font-bold text-xs line-clamp-2 text-[#0A1930] group-hover:text-[#006AA7] transition-colors">
                    {item.idea_title}
                  </h3>
                  <div className="text-[11px] font-semibold text-[#006AA7] truncate mt-1">
                    {item.school_name}
                  </div>
                  <div className="text-[10px] font-mono-code text-slate-400 truncate">
                    ID: {item.public_id}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono-code text-slate-500">
                  <span>{item.public_id}</span>
                  <span className="text-[#006AA7] font-semibold group-hover:underline">
                    View & Vote →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 2: SEARCH & FILTRATION TOOLBAR ── */}
        <div className="bg-white border border-slate-200 p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={site.location ? 'Search by idea title, student name, or school...' : 'Search by idea title, student name, or school (e.g. Hydro)...'}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 focus:border-[#006AA7] text-xs sm:text-sm text-[#0A1930] focus:outline-none"
              />
            </div>

            {/* School Filter */}
            <div>
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 text-xs sm:text-sm text-[#0A1930] focus:outline-none"
              >
                <option value="all">All Schools</option>
                {schools.map((sch) => (
                  <option key={sch} value={sch}>
                    {sch}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 text-xs sm:text-sm text-[#0A1930] focus:outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Admin Formats Review Shortcut */}
          {onNavigateAdmin && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-headline">
              <span className="text-[11px] font-mono-code text-slate-400">
                Official English Curation Active
              </span>
              <button
                type="button"
                onClick={onNavigateAdmin}
                className="py-1 px-2.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-600 hover:text-[#006AA7] text-[10px] font-mono-code font-bold uppercase flex items-center gap-1 transition-colors"
              >
                <span>🛡️ Admin Formats Curation</span>
              </button>
            </div>
          )}
        </div>

        {/* ── SECTION 3: ALL APPROVED IDEAS GRID ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline font-bold text-lg uppercase tracking-tight text-[#0A1930]">
              Approved Submissions ({filteredIdeas.length})
            </h3>
            <span className="text-xs font-mono-code text-slate-500">
              Click any card to open idea details & cast your vote
            </span>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-500 font-mono-code text-sm">
              <span className="inline-block w-5 h-5 border-2 border-[#006AA7] border-t-transparent animate-spin mr-2" />
              Loading approved innovations...
            </div>
          ) : filteredIdeas.length === 0 ? (
            <div className="py-16 bg-white border border-slate-200 text-center p-8">
              <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <div className="font-headline font-bold text-base text-slate-700 uppercase">
                No ideas found matching your filter
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Try resetting your filters or submit a new idea for your school.
              </p>
              <button
                onClick={onNavigateSubmit}
                className="mt-4 py-2 px-4 bg-emerald-600 text-white text-xs font-headline font-bold uppercase tracking-wider"
              >
                Submit New Idea
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIdeas.map((idea) => {
                const voted = hasVotedLocally(idea.id);
                return (
                  <div
                    key={idea.id}
                    onClick={() => {
                      setSelectedIdea(idea);
                      setVoteFeedback(null);
                    }}
                    className="bg-white border border-slate-200 hover:border-[#006AA7] hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group overflow-hidden"
                  >
                    {/* Media Thumbnail */}
                    <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                      {idea.photo_url ? (
                        <img
                          src={idea.photo_url}
                          alt={idea.idea_title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 p-4 text-center">
                          <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                          <span className="text-[11px] font-mono-code uppercase">
                            Concept Documentation
                          </span>
                        </div>
                      )}

                      {/* Category Badge */}
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-[#0A1930]/80 backdrop-blur-sm text-white text-[10px] font-mono-code font-bold uppercase tracking-wider">
                        {idea.category || 'Innovation'}
                      </span>

                      {/* Vote Count Pill */}
                      <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm shadow border border-slate-200 text-slate-800 text-xs font-headline font-black flex items-center gap-1.5">
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            voted ? 'text-red-500 fill-red-500' : 'text-slate-400'
                          }`}
                        />
                        <span>{idea.votes_count || 0} votes</span>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        {/* ID Token */}
                        <div className="flex items-center justify-between text-[10px] font-mono-code text-slate-400 mb-1">
                          <span>{idea.public_id}</span>
                          <span className="text-emerald-700 font-bold uppercase">Approved</span>
                        </div>

                        <h4 className="font-headline font-black text-base text-[#0A1930] group-hover:text-[#006AA7] transition-colors line-clamp-2">
                          {idea.idea_title}
                        </h4>

                        <p className="text-xs text-slate-600 line-clamp-2 font-light mt-1.5 leading-relaxed">
                          {idea.idea_description || 'No description provided.'}
                        </p>
                      </div>

                      {/* Author & School Meta */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="min-w-0 pr-2">
                          <div className="text-xs font-headline font-bold text-slate-800 truncate flex items-center gap-1">
                            <Building className="w-3.5 h-3.5 text-[#006AA7] shrink-0" />
                            <span>{idea.school_name}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono-code truncate">
                            Idea ID: {idea.public_id}
                          </div>
                        </div>

                        {/* Media Icons */}
                        <div className="flex items-center gap-1 text-slate-400 shrink-0">
                          {idea.voice_note_url && (
                            <span title="Has Voice Note" className="p-1 bg-sky-50 text-[#006AA7]">
                              🎙️
                            </span>
                          )}
                          {idea.video_url && (
                            <span title="Has Video" className="p-1 bg-purple-50 text-purple-600">
                              🎥
                            </span>
                          )}
                          {idea.photo_url && (
                            <span title="Has Photo" className="p-1 bg-amber-50 text-amber-600">
                              🖼️
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── POP-UP MODAL (AS SPECIFIED BY USER: NO KID NAME, SCHOOL NAME FOLLOWED BY IDEA ID) ── */}
        <AnimatePresence>
          {selectedIdea && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedIdea(null)}
                className="fixed inset-0 bg-[#0A1930]/80 backdrop-blur-sm -z-10"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-white border-2 border-slate-300 shadow-2xl p-6 sm:p-8 my-6 text-[#0A1930] max-h-[90vh] overflow-y-auto"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedIdea(null)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-[#0A1930] hover:bg-slate-100 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Specific Pop-up Banner Header as Requested */}
                <div className="mb-5 pb-4 border-b border-slate-200">
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-mono-code font-bold tracking-widest text-emerald-700 uppercase mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    <span>VERIFIED SCHOOL INNOVATION</span>
                  </div>

                  <h3 className="font-headline font-black text-2xl uppercase tracking-tight text-[#0A1930]">
                    {selectedIdea.idea_title}
                  </h3>

                  {/* USER MANDATED: SCHOOL NAME FOLLOWED BY IDEA ID (NO KID NAME) */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#006AA7]/10 border border-[#006AA7]/30 text-[#006AA7] text-xs sm:text-sm font-headline font-black uppercase tracking-wide">
                      <Building className="w-4 h-4 shrink-0 text-[#006AA7]" />
                      <span>School: {selectedIdea.school_name}</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-300 text-slate-700 font-mono-code text-xs font-bold">
                      <span className="text-slate-400">IDEA ID:</span>
                      <span className="text-[#0A1930] font-black">{selectedIdea.public_id}</span>
                    </div>
                  </div>

                  <div className="mt-3 p-3.5 bg-sky-50/70 border border-sky-200 text-xs sm:text-sm text-[#0A1930] space-y-1">
                    <p className="font-medium">
                      This idea was submitted from{' '}
                      <strong className="font-bold text-[#006AA7]">
                        {selectedIdea.school_name}
                      </strong>
                      .
                    </p>
                    <p className="font-mono-code text-xs text-slate-600">
                      Idea ID:{' '}
                      <strong className="text-[#0A1930] font-bold bg-white px-2 py-0.5 border border-sky-300">
                        {selectedIdea.public_id}
                      </strong>
                    </p>
                  </div>
                </div>

                {/* Idea Full Description */}
                <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-light mb-6">
                  <div>
                    <h5 className="font-headline font-bold text-xs uppercase tracking-wider text-slate-900 mb-1">
                      Concept Description:
                    </h5>
                    <p className="whitespace-pre-line bg-slate-50 p-4 border border-slate-200">
                      {selectedIdea.idea_description || 'No written description available.'}
                    </p>
                  </div>

                  {/* Photo / Blueprint Display */}
                  {selectedIdea.photo_url && (
                    <div>
                      <h5 className="font-headline font-bold text-xs uppercase tracking-wider text-slate-900 mb-1 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-[#006AA7]" />
                        <span>Uploaded Picture / Blueprint:</span>
                      </h5>
                      <div className="w-full max-h-72 border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center">
                        <img
                          src={selectedIdea.photo_url}
                          alt={selectedIdea.idea_title}
                          className="max-h-72 w-full object-contain"
                        />
                      </div>
                    </div>
                  )}

                  {/* Voice Note Audio Player */}
                  {selectedIdea.voice_note_url && (
                    <div className="p-4 bg-sky-50/60 border border-sky-200 space-y-2">
                      <h5 className="font-headline font-bold text-xs uppercase tracking-wider text-[#006AA7] flex items-center gap-1.5">
                        <Volume2 className="w-4 h-4" />
                        <span>Innovator Voice Note (Recorded Audio):</span>
                      </h5>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={toggleAudio}
                          className="w-10 h-10 rounded-full bg-[#006AA7] hover:bg-[#013A63] text-white flex items-center justify-center transition-colors shadow"
                        >
                          {isPlayingAudio ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4 ml-0.5" />
                          )}
                        </button>
                        <div className="text-xs text-slate-600 font-mono-code">
                          {isPlayingAudio ? 'Playing voice note...' : 'Click to listen to the audio presentation'}
                        </div>
                        <audio
                          ref={audioRef}
                          src={selectedIdea.voice_note_url}
                          onEnded={() => setIsPlayingAudio(false)}
                          className="hidden"
                        />
                      </div>
                    </div>
                  )}

                  {/* Video Presentation */}
                  {selectedIdea.video_url && (
                    <div>
                      <h5 className="font-headline font-bold text-xs uppercase tracking-wider text-purple-900 mb-1 flex items-center gap-1.5">
                        <Video className="w-4 h-4 text-purple-600" />
                        <span>Pitch Video Presentation:</span>
                      </h5>
                      {selectedIdea.video_type === 'link' ||
                      selectedIdea.video_url.includes('youtube.com') ||
                      selectedIdea.video_url.includes('youtu.be') ? (
                        <div className="p-3 bg-purple-50 border border-purple-200 flex items-center justify-between">
                          <span className="font-mono-code text-xs truncate max-w-sm text-purple-800">
                            {selectedIdea.video_url}
                          </span>
                          <a
                            href={selectedIdea.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-1 px-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-headline font-bold uppercase flex items-center gap-1 shrink-0"
                          >
                            <span>Open Video</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ) : (
                        <video
                          src={selectedIdea.video_url}
                          controls
                          className="w-full max-h-72 border border-slate-200 bg-black"
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Vote Feedback Message */}
                {voteFeedback && (
                  <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono-code flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{voteFeedback}</span>
                  </div>
                )}

                {/* Action Row: THE ONLY BUTTON "Vote for the Idea" & Share Campaign */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-3">
                  {/* Single Main Vote Button (User requirement: "There should be only one button: 'Vote for the Idea'") */}
                  <button
                    type="button"
                    disabled={isVoting || hasVotedLocally(selectedIdea.id)}
                    onClick={() => handleVote(selectedIdea)}
                    className={`flex-1 w-full py-4 px-6 text-white font-headline font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 ${
                      hasVotedLocally(selectedIdea.id)
                        ? 'bg-slate-400 cursor-not-allowed'
                        : 'bg-[#006AA7] hover:bg-[#013A63]'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${hasVotedLocally(selectedIdea.id) ? 'fill-white' : ''}`} />
                    <span>
                      {hasVotedLocally(selectedIdea.id)
                        ? `Voted (${selectedIdea.votes_count || 0})`
                        : `Vote for the Idea (${selectedIdea.votes_count || 0})`}
                    </span>
                  </button>

                  {/* Copy URL / Campaign Button (User requirement: "They can also copy the URL and directly make a campaign for that, like 'Vote for my idea'") */}
                  <button
                    type="button"
                    onClick={() => handleCopyIdeaLink(selectedIdea)}
                    className="w-full sm:w-auto py-4 px-5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-headline font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                    title="Copy direct shareable campaign URL"
                  >
                    {copiedLink ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-500" />
                    )}
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Campaign URL (Vote For My Idea)'}</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
