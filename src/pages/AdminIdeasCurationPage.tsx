import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Shield,
  Filter,
  CheckCircle2,
  XCircle,
  Play,
  Pause,
  Volume2,
  Video,
  Image as ImageIcon,
  Building,
  User,
  Mail,
  Phone,
  Search,
  RefreshCw,
  ExternalLink,
  Sparkles,
  ArrowLeft,
  Globe,
  Calendar,
  Users,
  Trophy,
  Check,
  Clock
} from 'lucide-react';
import { adminListIdeas, adminCurateIdea, IdeaSubmission } from '../lib/ideasService';
import {
  adminListRegistrations,
  adminUpdateRegistrationStatus,
  AdminRegistration
} from '../lib/adminUnifiedService';

interface AdminIdeasCurationPageProps {
  onNavigateHome: () => void;
  onNavigateVoting: () => void;
}

export type AdminProgramTab = 'all' | 'workshops' | 'demos' | 'ideas' | 'hackathons';

export const AdminIdeasCurationPage: React.FC<AdminIdeasCurationPageProps> = ({
  onNavigateHome,
  onNavigateVoting,
}) => {
  // Navigation / active panel tab
  const [activePanel, setActivePanel] = useState<AdminProgramTab>('ideas');

  // Registrations state (workshops, demos, hackathons)
  const [registrations, setRegistrations] = useState<AdminRegistration[]>([]);
  // Ideas state (multimodal submissions)
  const [ideas, setIdeas] = useState<IdeaSubmission[]>([]);

  const [loading, setLoading] = useState(true);

  // Global filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Ideas-specific format & category filters (Visible only to Admin)
  const [ideaFormatFilter, setIdeaFormatFilter] = useState<'all' | 'voice' | 'video' | 'photo' | 'text'>('all');
  const [ideaCategoryFilter, setIdeaCategoryFilter] = useState<string>('all');

  // Audio player state
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  // Image modal state
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Curating / editing state for ideas
  const [curationMap, setCurationMap] = useState<
    Record<
      string,
      {
        englishTitle: string;
        englishDescription: string;
        category: string;
        isSaving: boolean;
        savedMessage?: string;
      }
    >
  >({});

  // Action feedback for registration statuses
  const [regFeedback, setRegFeedback] = useState<Record<string, string>>({});

  // Load all data
  const loadData = async () => {
    setLoading(true);
    try {
      const [regsData, ideasData] = await Promise.all([
        adminListRegistrations('all', statusFilter, countryFilter),
        adminListIdeas(statusFilter, ideaFormatFilter),
      ]);

      setRegistrations(regsData);
      setIdeas(ideasData);

      // Pre-populate curation map for ideas
      const initialMap: typeof curationMap = {};
      ideasData.forEach((item) => {
        initialMap[item.id] = {
          englishTitle: item.idea_title || '',
          englishDescription: item.idea_description || '',
          category: item.category || 'Sustainability & Green Tech',
          isSaving: false,
        };
      });
      setCurationMap(initialMap);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, countryFilter, ideaFormatFilter]);

  // Derived counts for program panels
  const stats = useMemo(() => {
    const workshops = registrations.filter((r) => r.form_type === 'workshop');
    const demos = registrations.filter((r) => r.form_type === 'demo');
    const hackathons = registrations.filter((r) => r.form_type === 'hackathon');
    const totalStudents = registrations.reduce((acc, curr) => {
      const parsed = parseInt(curr.student_count.replace(/[^0-9]/g, ''), 10) || 0;
      return acc + parsed;
    }, 0);

    return {
      totalWorkshops: workshops.length,
      pendingWorkshops: workshops.filter((w) => w.status === 'pending').length,
      totalDemos: demos.length,
      pendingDemos: demos.filter((d) => d.status === 'pending').length,
      totalHackathons: hackathons.length,
      pendingHackathons: hackathons.filter((h) => h.status === 'pending').length,
      totalIdeas: ideas.length,
      pendingIdeas: ideas.filter((i) => i.status === 'pending').length,
      approvedIdeas: ideas.filter((i) => i.status === 'approved').length,
      totalStudents,
    };
  }, [registrations, ideas]);

  // Filter registrations by search and country
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((item) => {
      if (activePanel === 'workshops' && item.form_type !== 'workshop') return false;
      if (activePanel === 'demos' && item.form_type !== 'demo') return false;
      if (activePanel === 'hackathons' && item.form_type !== 'hackathon') return false;

      if (countryFilter !== 'all' && item.country_slug !== countryFilter) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.public_id?.toLowerCase().includes(q) ||
        item.school_name?.toLowerCase().includes(q) ||
        item.team_name?.toLowerCase().includes(q) ||
        item.contact_name?.toLowerCase().includes(q) ||
        item.email?.toLowerCase().includes(q) ||
        item.city_name?.toLowerCase().includes(q) ||
        item.phone?.toLowerCase().includes(q)
      );
    });
  }, [registrations, activePanel, countryFilter, searchQuery]);

  // Filter ideas by search, category, and country
  const filteredIdeas = useMemo(() => {
    return ideas.filter((item) => {
      if (countryFilter !== 'all' && item.country_slug !== countryFilter) return false;
      if (ideaCategoryFilter !== 'all' && item.category !== ideaCategoryFilter) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.public_id?.toLowerCase().includes(q) ||
        item.school_name?.toLowerCase().includes(q) ||
        item.student_name?.toLowerCase().includes(q) ||
        item.idea_title?.toLowerCase().includes(q) ||
        item.city_name?.toLowerCase().includes(q) ||
        item.country_name?.toLowerCase().includes(q)
      );
    });
  }, [ideas, countryFilter, ideaCategoryFilter, searchQuery]);

  // Update registration status (Approve, Reject, Pending)
  const handleUpdateRegStatus = async (
    id: string,
    newStatus: 'approved' | 'rejected' | 'pending'
  ) => {
    try {
      await adminUpdateRegistrationStatus(id, newStatus);
      setRegistrations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
      setRegFeedback((prev) => ({
        ...prev,
        [id]:
          newStatus === 'approved'
            ? '✓ Confirmed & Approved'
            : newStatus === 'rejected'
            ? 'Rejected'
            : 'Reset to Pending',
      }));
      setTimeout(() => {
        setRegFeedback((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }, 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to update registration status');
    }
  };

  // Curate idea English text & update status
  const handleCurationChange = (
    ideaId: string,
    field: 'englishTitle' | 'englishDescription' | 'category',
    value: string
  ) => {
    setCurationMap((prev) => ({
      ...prev,
      [ideaId]: {
        ...(prev[ideaId] || {
          englishTitle: '',
          englishDescription: '',
          category: 'Sustainability & Green Tech',
          isSaving: false,
        }),
        [field]: value,
      },
    }));
  };

  const handleCurateAndSaveIdea = async (
    ideaId: string,
    newStatus: 'approved' | 'rejected' | 'pending'
  ) => {
    const cur = curationMap[ideaId];
    if (!cur) return;

    setCurationMap((prev) => ({
      ...prev,
      [ideaId]: { ...prev[ideaId], isSaving: true },
    }));

    try {
      await adminCurateIdea({
        ideaId,
        englishTitle: cur.englishTitle,
        englishDescription: cur.englishDescription,
        category: cur.category,
        status: newStatus,
      });

      setIdeas((prev) =>
        prev.map((i) =>
          i.id === ideaId
            ? {
                ...i,
                idea_title: cur.englishTitle,
                idea_description: cur.englishDescription,
                category: cur.category,
                status: newStatus,
              }
            : i
        )
      );

      setCurationMap((prev) => ({
        ...prev,
        [ideaId]: {
          ...prev[ideaId],
          isSaving: false,
          savedMessage:
            newStatus === 'approved'
              ? '✓ Approved & Live on Public Site!'
              : newStatus === 'rejected'
              ? 'Rejected'
              : 'Status updated to pending',
        },
      }));

      setTimeout(() => {
        setCurationMap((prev) => ({
          ...prev,
          [ideaId]: { ...prev[ideaId], savedMessage: undefined },
        }));
      }, 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to save idea curation');
      setCurationMap((prev) => ({
        ...prev,
        [ideaId]: { ...prev[ideaId], isSaving: false },
      }));
    }
  };

  // Audio player toggle
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
    <div className="min-h-screen bg-slate-100 text-[#0A1930] pt-24 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Breadcrumb & Status */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onNavigateHome}
              className="py-1.5 px-3 bg-white border border-slate-300 hover:bg-slate-50 text-xs font-mono-code font-bold uppercase flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back Home</span>
            </button>
            <button
              type="button"
              onClick={onNavigateVoting}
              className="py-1.5 px-3 bg-[#0A1930] hover:bg-[#006AA7] text-white text-xs font-headline font-bold uppercase flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Public Voting Arena</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono-code bg-white px-3 py-1.5 border border-slate-200 shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-700 font-bold uppercase">Super Admin Portal // EU Skola</span>
          </div>
        </div>

        {/* Hero Banner with Unified Stats */}
        <div className="bg-[#0A1930] text-white p-6 sm:p-8 border-b-4 border-[#FFCD00] relative overflow-hidden shadow-md">
          <div className="relative z-10 space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono-code font-bold tracking-widest text-[#FFCD00] uppercase">
              <Shield className="w-4 h-4" />
              <span>UNIFIED 4-PROGRAM INTAKE & MODERATION COMMAND CENTER</span>
            </div>
            <h1 className="font-headline font-black text-2xl sm:text-4xl uppercase tracking-tight">
              Admin Intake Operations
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              Consolidated command center for all 4 programs: Workshop bookings, school demo sessions, multimodal idea curation (voice notes, blueprints, videos), and hackathon squads.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="p-2.5 bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] font-mono-code text-slate-400 uppercase">1. Workshops</div>
              <div className="text-xl font-headline font-black text-white mt-0.5">
                {stats.totalWorkshops}
              </div>
              <div className="text-[10px] font-mono-code text-amber-400">
                {stats.pendingWorkshops} pending
              </div>
            </div>

            <div className="p-2.5 bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] font-mono-code text-slate-400 uppercase">2. Demos</div>
              <div className="text-xl font-headline font-black text-white mt-0.5">
                {stats.totalDemos}
              </div>
              <div className="text-[10px] font-mono-code text-amber-400">
                {stats.pendingDemos} pending
              </div>
            </div>

            <div className="p-2.5 bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] font-mono-code text-slate-400 uppercase">3. Ideas</div>
              <div className="text-xl font-headline font-black text-[#FFCD00] mt-0.5">
                {stats.totalIdeas}
              </div>
              <div className="text-[10px] font-mono-code text-emerald-400">
                {stats.approvedIdeas} live on site
              </div>
            </div>

            <div className="p-2.5 bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] font-mono-code text-slate-400 uppercase">4. Hackathons</div>
              <div className="text-xl font-headline font-black text-white mt-0.5">
                {stats.totalHackathons}
              </div>
              <div className="text-[10px] font-mono-code text-amber-400">
                {stats.pendingHackathons} squads
              </div>
            </div>

            <div className="p-2.5 bg-slate-900/80 border border-slate-800 col-span-2 sm:col-span-1">
              <div className="text-[10px] font-mono-code text-slate-400 uppercase">Total Students</div>
              <div className="text-xl font-headline font-black text-emerald-400 mt-0.5">
                {stats.totalStudents}+
              </div>
              <div className="text-[10px] font-mono-code text-slate-400">Registered</div>
            </div>
          </div>
        </div>

        {/* ── SEPARATE PROGRAM PANELS SWITCHER (USER REQUIREMENT) ── */}
        <div className="bg-white p-2 border border-slate-300 shadow-sm flex flex-wrap gap-2">
          {[
            { id: 'workshops', label: '1. School Workshops', icon: '🤖', count: stats.totalWorkshops },
            { id: 'demos', label: '2. School Demos', icon: '📢', count: stats.totalDemos },
            {
              id: 'ideas',
              label: '3. Idea Formats Curation',
              icon: '💡',
              count: stats.totalIdeas,
              highlight: true,
            },
            { id: 'hackathons', label: '4. Hackathon Squads', icon: '🏆', count: stats.totalHackathons },
            {
              id: 'all',
              label: 'All Intake Feed',
              icon: '🌐',
              count: registrations.length + ideas.length,
            },
          ].map((panel) => {
            const active = activePanel === panel.id;
            return (
              <button
                key={panel.id}
                type="button"
                onClick={() => setActivePanel(panel.id as AdminProgramTab)}
                className={`py-3 px-4 sm:px-5 text-xs font-headline font-black uppercase tracking-wider flex items-center gap-2 border transition-all ${
                  active
                    ? 'bg-[#006AA7] text-white border-[#006AA7] shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span>{panel.icon}</span>
                <span>{panel.label}</span>
                <span
                  className={`text-[10px] font-mono-code px-1.5 py-0.2 rounded-xs ${
                    active ? 'bg-white text-[#006AA7]' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {panel.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── BEST UI/UX FILTER CONTROLS BAR ── */}
        <div className="bg-white p-5 border border-slate-300 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Status Filter */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-slate-500">
                Filter by Status:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'pending', label: '🟡 Pending Action' },
                  { id: 'approved', label: '🟢 Approved / Live' },
                  { id: 'rejected', label: '🔴 Rejected' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStatusFilter(s.id as any)}
                    className={`py-1.5 px-3 text-xs font-headline font-bold uppercase border transition-colors ${
                      statusFilter === s.id
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Country Filter */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-slate-500">
                Filter by Country:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'All Countries' },
                  { id: 'sweden', label: '🇸🇪 Sweden' },
                  { id: 'denmark', label: '🇩🇰 Denmark' },
                  { id: 'latvia', label: '🇱🇻 Latvia' },
                  { id: 'estonia', label: '🇪🇪 Estonia' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCountryFilter(c.id)}
                    className={`py-1.5 px-3 text-xs font-headline font-bold uppercase border transition-colors ${
                      countryFilter === c.id
                        ? 'bg-[#006AA7] text-white border-[#006AA7]'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* IDEAS EXCLUSIVE FORMAT FILTER (Visible ONLY in Admin) */}
          {(activePanel === 'ideas' || activePanel === 'all') && (
            <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-[#006AA7]" />
                  <span>Multimodal Idea Format (Admin Exclusive):</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: 'All Formats' },
                    { id: 'voice', label: '🎙️ Voice Notes' },
                    { id: 'video', label: '🎥 Videos' },
                    { id: 'photo', label: '🖼️ Blueprints / Photos' },
                    { id: 'text', label: '📝 Text Only' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setIdeaFormatFilter(f.id as any)}
                      className={`py-1 px-2.5 text-xs font-headline font-bold uppercase border transition-colors ${
                        ideaFormatFilter === f.id
                          ? 'bg-[#006AA7] text-white border-[#006AA7]'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Idea Category Filter */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-slate-500">
                  Segregation:
                </span>
                <select
                  value={ideaCategoryFilter}
                  onChange={(e) => setIdeaCategoryFilter(e.target.value)}
                  className="px-3 py-1 bg-slate-50 border border-slate-300 text-xs font-headline text-[#0A1930] focus:border-[#006AA7] focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="Sustainability & Green Tech">Sustainability & Green Tech</option>
                  <option value="Smart Schools & Health">Smart Schools & Health</option>
                  <option value="Robotics & Autonomous Logistics">
                    Robotics & Autonomous Logistics
                  </option>
                  <option value="Circular Economy & Waste">Circular Economy & Waste</option>
                  <option value="Clean Energy & Future Mobility">
                    Clean Energy & Future Mobility
                  </option>
                </select>
              </div>
            </div>
          )}

          {/* Search Input & Refresh */}
          <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[280px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Live search by school, team, student, contact person, ID, email, or city..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 focus:border-[#006AA7] focus:bg-white text-xs text-[#0A1930] focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={loadData}
              className="py-1.5 px-3 bg-white border border-slate-300 hover:bg-slate-50 text-xs font-mono-code font-bold flex items-center gap-1.5 text-slate-700"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Records</span>
            </button>
          </div>
        </div>

        {/* ── PANEL CONTENTS ── */}

        {/* PANEL 1: WORKSHOPS */}
        {activePanel === 'workshops' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-300">
              <h2 className="font-headline font-black text-xl uppercase text-[#0A1930] flex items-center gap-2">
                <span>🤖 1. School Workshop Bookings</span>
                <span className="text-xs font-mono-code text-slate-500 font-normal">
                  ({filteredRegistrations.length} requests)
                </span>
              </h2>
              <span className="text-xs font-mono-code text-slate-500">
                Customizable Date & Time Slots
              </span>
            </div>

            {loading ? (
              <div className="py-16 text-center text-slate-500 font-mono-code text-xs">
                <span className="inline-block w-4 h-4 border-2 border-[#006AA7] border-t-transparent animate-spin mr-2" />
                Loading school workshop bookings...
              </div>
            ) : filteredRegistrations.length === 0 ? (
              <div className="bg-white p-12 text-center border border-slate-300">
                <Building className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h3 className="font-headline font-black text-base uppercase text-slate-800">
                  No School Workshops Found
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Adjust your status or country filters above to view more.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRegistrations.map((reg) => (
                  <div
                    key={reg.id}
                    className={`bg-white border-2 p-5 shadow-xs transition-all ${
                      reg.status === 'approved'
                        ? 'border-emerald-400'
                        : reg.status === 'rejected'
                        ? 'border-rose-300 bg-rose-50/20'
                        : 'border-amber-300 bg-amber-50/10'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono-code font-black px-2 py-0.5 bg-[#0A1930] text-white">
                          {reg.public_id}
                        </span>
                        <span className="font-headline font-black text-base text-[#0A1930]">
                          {reg.school_name || 'Unnamed School'}
                        </span>
                        <span className="text-xs font-mono-code text-slate-500">
                          • {reg.city_name || 'Västerås'}, {reg.country_name || 'Sweden'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {regFeedback[reg.id] && (
                          <span className="text-xs font-mono-code font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200 animate-pulse">
                            {regFeedback[reg.id]}
                          </span>
                        )}
                        <span
                          className={`px-2.5 py-0.5 text-xs font-headline font-black uppercase tracking-wider ${
                            reg.status === 'approved'
                              ? 'bg-emerald-600 text-white'
                              : reg.status === 'rejected'
                              ? 'bg-rose-600 text-white'
                              : 'bg-amber-400 text-slate-900'
                          }`}
                        >
                          {reg.status === 'approved'
                            ? 'Confirmed / Approved'
                            : reg.status === 'rejected'
                            ? 'Rejected'
                            : 'Pending Admin Review'}
                        </span>
                      </div>
                    </div>

                    {/* Workshop Booking Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 text-xs">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono-code text-slate-400 uppercase font-bold block">
                          Preferred Date & Slot
                        </span>
                        <div className="font-headline font-bold text-slate-800 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#006AA7]" />
                          <span>{reg.preferred_date || reg.custom_date || 'Custom Scheduled'}</span>
                        </div>
                        <div className="font-mono-code text-slate-600 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{reg.time_range || reg.custom_time || '09:00 - 11:30'}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-mono-code text-slate-400 uppercase font-bold block">
                          Grade & Cohort Size
                        </span>
                        <div className="font-headline font-bold text-slate-800">
                          {reg.student_count} Students
                        </div>
                        <div className="text-slate-500 truncate">{reg.grade_group || 'Årskurs 4–6'}</div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-mono-code text-slate-400 uppercase font-bold block">
                          Contact Coordinator
                        </span>
                        <div className="font-headline font-bold text-slate-800 flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>{reg.contact_name}</span>
                        </div>
                        <div className="text-slate-600 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{reg.email}</span>
                        </div>
                        {reg.phone && (
                          <div className="text-slate-600 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{reg.phone}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col justify-end space-y-1.5">
                        <span className="text-[10px] font-mono-code text-slate-400 uppercase font-bold">
                          Admin Actions:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleUpdateRegStatus(reg.id, 'approved')}
                            className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-headline font-bold text-[11px] uppercase flex items-center gap-1 transition-colors"
                          >
                            <Check className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateRegStatus(reg.id, 'pending')}
                            className="py-1 px-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-headline font-bold text-[11px] uppercase transition-colors"
                          >
                            Pending
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateRegStatus(reg.id, 'rejected')}
                            className="py-1 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-headline font-bold text-[11px] uppercase transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PANEL 2: DEMOS */}
        {activePanel === 'demos' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-300">
              <h2 className="font-headline font-black text-xl uppercase text-[#0A1930] flex items-center gap-2">
                <span>📢 2. School Demo Requests</span>
                <span className="text-xs font-mono-code text-slate-500 font-normal">
                  ({filteredRegistrations.length} requests)
                </span>
              </h2>
              <span className="text-xs font-mono-code text-slate-500">
                Auditorium & Classroom Demonstrations
              </span>
            </div>

            {loading ? (
              <div className="py-16 text-center text-slate-500 font-mono-code text-xs">
                <span className="inline-block w-4 h-4 border-2 border-[#006AA7] border-t-transparent animate-spin mr-2" />
                Loading demo requests...
              </div>
            ) : filteredRegistrations.length === 0 ? (
              <div className="bg-white p-12 text-center border border-slate-300">
                <Building className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h3 className="font-headline font-black text-base uppercase text-slate-800">
                  No School Demo Requests Found
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Adjust status or country filters above to view more.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRegistrations.map((reg) => (
                  <div
                    key={reg.id}
                    className={`bg-white border-2 p-5 shadow-xs transition-all ${
                      reg.status === 'approved'
                        ? 'border-emerald-400'
                        : reg.status === 'rejected'
                        ? 'border-rose-300 bg-rose-50/20'
                        : 'border-amber-300 bg-amber-50/10'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono-code font-black px-2 py-0.5 bg-[#0A1930] text-white">
                          {reg.public_id}
                        </span>
                        <span className="font-headline font-black text-base text-[#0A1930]">
                          {reg.school_name || 'Individual School Cohort'}
                        </span>
                        <span className="text-xs font-mono-code text-slate-500">
                          • {reg.city_name || 'Västerås'}, {reg.country_name || 'Sweden'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {regFeedback[reg.id] && (
                          <span className="text-xs font-mono-code font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200 animate-pulse">
                            {regFeedback[reg.id]}
                          </span>
                        )}
                        <span
                          className={`px-2.5 py-0.5 text-xs font-headline font-black uppercase tracking-wider ${
                            reg.status === 'approved'
                              ? 'bg-emerald-600 text-white'
                              : reg.status === 'rejected'
                              ? 'bg-rose-600 text-white'
                              : 'bg-amber-400 text-slate-900'
                          }`}
                        >
                          {reg.status === 'approved' ? 'Confirmed Demo' : reg.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 text-xs">
                      <div>
                        <span className="text-[10px] font-mono-code text-slate-400 uppercase font-bold block">
                          Date & Timing
                        </span>
                        <div className="font-headline font-bold text-slate-800">
                          {reg.preferred_date || reg.custom_date || 'Date TBD'}
                        </div>
                        <div className="text-slate-500">{reg.time_range || 'Flexible Slot'}</div>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono-code text-slate-400 uppercase font-bold block">
                          Audience / Students
                        </span>
                        <div className="font-headline font-bold text-slate-800">
                          {reg.student_count} Students
                        </div>
                        <div className="text-slate-500">{reg.grade_group || 'Auditorium Session'}</div>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono-code text-slate-400 uppercase font-bold block">
                          School Contact
                        </span>
                        <div className="font-headline font-bold text-slate-800">{reg.contact_name}</div>
                        <div className="text-slate-600">{reg.email}</div>
                        {reg.phone && <div className="text-slate-600">{reg.phone}</div>}
                      </div>

                      <div className="flex flex-col justify-end space-y-1.5">
                        <span className="text-[10px] font-mono-code text-slate-400 uppercase font-bold">
                          Admin Actions:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleUpdateRegStatus(reg.id, 'approved')}
                            className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-headline font-bold text-[11px] uppercase flex items-center gap-1 transition-colors"
                          >
                            <Check className="w-3 h-3" />
                            <span>Confirm Demo</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateRegStatus(reg.id, 'pending')}
                            className="py-1 px-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-headline font-bold text-[11px] uppercase transition-colors"
                          >
                            Pending
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateRegStatus(reg.id, 'rejected')}
                            className="py-1 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-headline font-bold text-[11px] uppercase transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PANEL 3: IDEAS FORMATS CURATION (MAIN MULTIMODAL PANEL) */}
        {activePanel === 'ideas' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-300">
              <h2 className="font-headline font-black text-xl uppercase text-[#0A1930] flex items-center gap-2">
                <span>💡 3. Multimodal Idea Formats Curation</span>
                <span className="text-xs font-mono-code text-slate-500 font-normal">
                  ({filteredIdeas.length} submissions)
                </span>
              </h2>
              <span className="text-xs font-mono-code text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                Type English Title & Description to Publish Live
              </span>
            </div>

            {loading ? (
              <div className="py-16 text-center text-slate-500 font-mono-code text-xs">
                <span className="inline-block w-4 h-4 border-2 border-[#006AA7] border-t-transparent animate-spin mr-2" />
                Loading student idea submissions...
              </div>
            ) : filteredIdeas.length === 0 ? (
              <div className="bg-white p-12 text-center border border-slate-300">
                <Sparkles className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h3 className="font-headline font-black text-base uppercase text-slate-800">
                  No Idea Submissions Matching Selected Filters
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Adjust format, status, or search filters above.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredIdeas.map((idea) => {
                  const cur = curationMap[idea.id] || {
                    englishTitle: idea.idea_title || '',
                    englishDescription: idea.idea_description || '',
                    category: idea.category || 'Sustainability & Green Tech',
                    isSaving: false,
                  };

                  const hasVoice = Boolean(idea.voice_note_url);
                  const hasVideo = Boolean(idea.video_url);
                  const hasPhoto = Boolean(idea.photo_url);

                  return (
                    <div
                      key={idea.id}
                      className={`bg-white border-2 transition-all p-6 shadow-sm ${
                        idea.status === 'approved'
                          ? 'border-emerald-400'
                          : idea.status === 'rejected'
                          ? 'border-rose-300 bg-rose-50/20'
                          : 'border-amber-300 bg-amber-50/10'
                      }`}
                    >
                      {/* Top Bar: Public ID, School, Format Badges, and Status */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono-code font-black px-2 py-0.5 bg-[#0A1930] text-white">
                            {idea.public_id}
                          </span>
                          <span className="text-xs font-headline font-bold text-slate-700 flex items-center gap-1">
                            <Building className="w-3.5 h-3.5 text-[#006AA7]" />
                            <span>{idea.school_name || 'Individual Participant'}</span>
                          </span>
                          {idea.city_name && (
                            <span className="text-[11px] font-mono-code text-slate-500">
                              • {idea.city_name}, {idea.country_name || 'Sweden'}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Format Indicators */}
                          {hasVoice && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-mono-code font-bold uppercase flex items-center gap-1">
                              <Volume2 className="w-3 h-3" />
                              <span>Voice Note</span>
                            </span>
                          )}
                          {hasVideo && (
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-mono-code font-bold uppercase flex items-center gap-1">
                              <Video className="w-3 h-3" />
                              <span>Video</span>
                            </span>
                          )}
                          {hasPhoto && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-mono-code font-bold uppercase flex items-center gap-1">
                              <ImageIcon className="w-3 h-3" />
                              <span>Blueprint</span>
                            </span>
                          )}

                          {/* Status Badge */}
                          <span
                            className={`px-2.5 py-0.5 text-xs font-headline font-black uppercase tracking-wider ${
                              idea.status === 'approved'
                                ? 'bg-emerald-600 text-white'
                                : idea.status === 'rejected'
                                ? 'bg-rose-600 text-white'
                                : 'bg-amber-400 text-slate-900'
                            }`}
                          >
                            {idea.status === 'approved'
                              ? 'Live on Public Site'
                              : idea.status === 'rejected'
                              ? 'Rejected'
                              : 'Pending Admin Review'}
                          </span>
                        </div>
                      </div>

                      {/* 2-Column Layout */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
                        {/* LEFT COLUMN: Original Media & Student Metadata (Cols 1-5) */}
                        <div className="lg:col-span-5 space-y-4 bg-slate-50 p-4 border border-slate-200">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-slate-500">
                              Original Student Intake
                            </span>
                            <span className="text-[10px] font-mono-code text-slate-400">
                              {new Date(idea.created_at).toLocaleString()}
                            </span>
                          </div>

                          {/* Student info (confidential to admin) */}
                          <div className="p-2.5 bg-white border border-slate-200 space-y-1 text-xs text-slate-600">
                            <div className="flex items-center gap-2">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              <span className="font-bold text-slate-800">{idea.student_name}</span>
                              {(idea.student_age || idea.student_grade) && (
                                <span className="text-slate-400 text-[11px]">
                                  ({idea.student_grade || `Age ${idea.student_age}`})
                                </span>
                              )}
                            </div>
                            {idea.contact_email && (
                              <div className="flex items-center gap-2 text-[11px]">
                                <Mail className="w-3 h-3 text-slate-400" />
                                <span>{idea.contact_email}</span>
                              </div>
                            )}
                            {idea.contact_phone && (
                              <div className="flex items-center gap-2 text-[11px]">
                                <Phone className="w-3 h-3 text-slate-400" />
                                <span>{idea.contact_phone}</span>
                              </div>
                            )}
                          </div>

                          {/* Voice Note Preview */}
                          {idea.voice_note_url && (
                            <div className="p-3 bg-sky-50 border border-sky-200 space-y-2">
                              <div className="flex items-center justify-between text-xs font-headline font-bold text-sky-900 uppercase">
                                <span className="flex items-center gap-1.5">
                                  <Volume2 className="w-4 h-4 text-[#006AA7]" />
                                  <span>Student Voice Recording</span>
                                </span>
                                <span className="text-[10px] font-mono-code font-normal text-sky-700">
                                  Listen to original audio
                                </span>
                              </div>

                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => toggleAudio(idea.id, idea.voice_note_url!)}
                                  className="py-1.5 px-3 bg-[#006AA7] hover:bg-[#0A1930] text-white text-xs font-mono-code font-bold uppercase flex items-center gap-1.5 transition-colors shadow-xs"
                                >
                                  {activeAudioId === idea.id ? (
                                    <>
                                      <Pause className="w-3.5 h-3.5" />
                                      <span>Pause Audio</span>
                                    </>
                                  ) : (
                                    <>
                                      <Play className="w-3.5 h-3.5 fill-current" />
                                      <span>Play Voice Note</span>
                                    </>
                                  )}
                                </button>
                                <a
                                  href={idea.voice_note_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[11px] font-mono-code text-[#006AA7] hover:underline flex items-center gap-1"
                                >
                                  <span>Direct file</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </div>
                          )}

                          {/* Blueprint / Drawing Preview */}
                          {idea.photo_url && (
                            <div className="p-3 bg-emerald-50 border border-emerald-200 space-y-2">
                              <div className="flex items-center justify-between text-xs font-headline font-bold text-emerald-900 uppercase">
                                <span className="flex items-center gap-1.5">
                                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                                  <span>Blueprint / Drawing Sketch</span>
                                </span>
                                <span className="text-[10px] font-mono-code text-emerald-700 font-normal">
                                  Click to zoom
                                </span>
                              </div>
                              <div
                                onClick={() => setPreviewImage(idea.photo_url!)}
                                className="cursor-pointer group relative overflow-hidden border border-emerald-300 max-h-48 bg-black/5"
                              >
                                <img
                                  src={idea.photo_url}
                                  alt="Idea Blueprint"
                                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                                  Zoom Blueprint
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Video Demonstration */}
                          {idea.video_url && (
                            <div className="p-3 bg-purple-50 border border-purple-200 space-y-2">
                              <div className="flex items-center justify-between text-xs font-headline font-bold text-purple-900 uppercase">
                                <span className="flex items-center gap-1.5">
                                  <Video className="w-4 h-4 text-purple-600" />
                                  <span>Student Video Demo</span>
                                </span>
                              </div>
                              <div className="space-y-1">
                                <a
                                  href={idea.video_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 py-1 px-2.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-mono-code font-bold uppercase transition-colors"
                                >
                                  <span>Watch Video In New Tab</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                                <p className="text-[10px] font-mono-code text-slate-500 truncate">
                                  {idea.video_url}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Original raw text description */}
                          {idea.idea_description && (
                            <div className="p-2.5 bg-white border border-slate-200 space-y-1">
                              <span className="text-[10px] font-mono-code uppercase text-slate-400 font-bold block">
                                Student Initial Written Text:
                              </span>
                              <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                                {idea.idea_description}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* RIGHT COLUMN: Admin English Curation & Acceptance Form (Cols 6-12) */}
                        <div className="lg:col-span-7 space-y-4">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-headline font-black text-[#006AA7] uppercase tracking-wider">
                                Admin English Curation Editor
                              </span>
                              <span className="text-[10px] font-mono-code px-1.5 py-0.5 bg-slate-100 text-slate-600">
                                Reflected on Live Website
                              </span>
                            </div>
                            {cur.savedMessage && (
                              <span className="text-xs font-mono-code font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200 animate-pulse">
                                {cur.savedMessage}
                              </span>
                            )}
                          </div>

                          {/* Field 1: English Title */}
                          <div>
                            <label className="block text-xs font-headline font-bold uppercase tracking-wider text-slate-800 mb-1">
                              Official Idea Title (English) *
                            </label>
                            <input
                              type="text"
                              value={cur.englishTitle}
                              onChange={(e) =>
                                handleCurationChange(idea.id, 'englishTitle', e.target.value)
                              }
                              placeholder="e.g. Solar Canal Skimmer & Water Purity Drone"
                              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#006AA7] focus:outline-none text-xs sm:text-sm font-headline font-bold text-[#0A1930]"
                            />
                            <p className="text-[11px] font-mono-code text-slate-500 mt-1">
                              Shown publicly beside {idea.school_name} & ID {idea.public_id}.
                            </p>
                          </div>

                          {/* Field 2: English Description / Summary */}
                          <div>
                            <label className="block text-xs font-headline font-bold uppercase tracking-wider text-slate-800 mb-1">
                              Curated English Description / Explanation *
                            </label>
                            <textarea
                              rows={4}
                              value={cur.englishDescription}
                              onChange={(e) =>
                                handleCurationChange(idea.id, 'englishDescription', e.target.value)
                              }
                              placeholder="Based on the voice note / drawing / video, write a clear, inspiring description in English that will be published on the site for voting..."
                              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-[#006AA7] focus:outline-none text-xs sm:text-sm text-[#0A1930] leading-relaxed"
                            />
                            <p className="text-[11px] font-mono-code text-slate-500 mt-1">
                              Voters will read this English explanation to cast their community vote.
                            </p>
                          </div>

                          {/* Field 3: Category Segregation */}
                          <div>
                            <label className="block text-xs font-headline font-bold uppercase tracking-wider text-slate-800 mb-1">
                              Segregation / Category
                            </label>
                            <select
                              value={cur.category}
                              onChange={(e) =>
                                handleCurationChange(idea.id, 'category', e.target.value)
                              }
                              className="w-full px-3 py-2 bg-white border border-slate-300 focus:border-[#006AA7] focus:outline-none text-xs text-[#0A1930]"
                            >
                              <option value="Sustainability & Green Tech">Sustainability & Green Tech</option>
                              <option value="Smart Schools & Health">Smart Schools & Health</option>
                              <option value="Robotics & Autonomous Logistics">
                                Robotics & Autonomous Logistics
                              </option>
                              <option value="Circular Economy & Waste">Circular Economy & Waste</option>
                              <option value="Clean Energy & Future Mobility">
                                Clean Energy & Future Mobility
                              </option>
                            </select>
                          </div>

                          {/* Action Buttons: Accept & Publish / Reject */}
                          <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                disabled={cur.isSaving}
                                onClick={() => handleCurateAndSaveIdea(idea.id, 'approved')}
                                className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-headline font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>
                                  {cur.isSaving
                                    ? 'Publishing...'
                                    : idea.status === 'approved'
                                    ? 'Update Live Details'
                                    : 'Accept & Publish to Live Site'}
                                </span>
                              </button>

                              {idea.status !== 'pending' && (
                                <button
                                  type="button"
                                  disabled={cur.isSaving}
                                  onClick={() => handleCurateAndSaveIdea(idea.id, 'pending')}
                                  className="py-2.5 px-3.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-headline font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                                >
                                  Reset to Pending
                                </button>
                              )}
                            </div>

                            {idea.status !== 'rejected' && (
                              <button
                                type="button"
                                disabled={cur.isSaving}
                                onClick={() => handleCurateAndSaveIdea(idea.id, 'rejected')}
                                className="py-2.5 px-4 bg-white hover:bg-rose-50 border border-rose-300 text-rose-700 font-headline font-bold text-xs uppercase tracking-wider flex items-center gap-1 transition-colors disabled:opacity-50"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject Submission</span>
                              </button>
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
        )}

        {/* PANEL 4: HACKATHONS */}
        {activePanel === 'hackathons' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-300">
              <h2 className="font-headline font-black text-xl uppercase text-[#0A1930] flex items-center gap-2">
                <span>🏆 4. Young Innovators Hackathon Squads</span>
                <span className="text-xs font-mono-code text-slate-500 font-normal">
                  ({filteredRegistrations.length} squads)
                </span>
              </h2>
              <span className="text-xs font-mono-code text-slate-500">
                Dec 5 Challenge Cohorts & Squads
              </span>
            </div>

            {loading ? (
              <div className="py-16 text-center text-slate-500 font-mono-code text-xs">
                <span className="inline-block w-4 h-4 border-2 border-[#006AA7] border-t-transparent animate-spin mr-2" />
                Loading hackathon squads...
              </div>
            ) : filteredRegistrations.length === 0 ? (
              <div className="bg-white p-12 text-center border border-slate-300">
                <Trophy className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h3 className="font-headline font-black text-base uppercase text-slate-800">
                  No Hackathon Squads Found
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Adjust status or country filters above to view more.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRegistrations.map((reg) => (
                  <div
                    key={reg.id}
                    className={`bg-white border-2 p-5 shadow-xs transition-all ${
                      reg.status === 'approved'
                        ? 'border-emerald-400'
                        : reg.status === 'rejected'
                        ? 'border-rose-300 bg-rose-50/20'
                        : 'border-amber-300 bg-amber-50/10'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono-code font-black px-2 py-0.5 bg-[#0A1930] text-white">
                          {reg.public_id}
                        </span>
                        <span className="font-headline font-black text-base text-[#0A1930]">
                          {reg.team_name ? `Squad: ${reg.team_name}` : reg.school_name || 'Hackathon Team'}
                        </span>
                        {reg.school_name && reg.team_name && (
                          <span className="text-xs font-mono-code text-slate-500">
                            (Affiliated: {reg.school_name})
                          </span>
                        )}
                        <span className="text-xs font-mono-code text-slate-500">
                          • {reg.city_name || 'Västerås'}, {reg.country_name || 'Sweden'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {regFeedback[reg.id] && (
                          <span className="text-xs font-mono-code font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200 animate-pulse">
                            {regFeedback[reg.id]}
                          </span>
                        )}
                        <span
                          className={`px-2.5 py-0.5 text-xs font-headline font-black uppercase tracking-wider ${
                            reg.status === 'approved'
                              ? 'bg-emerald-600 text-white'
                              : reg.status === 'rejected'
                              ? 'bg-rose-600 text-white'
                              : 'bg-amber-400 text-slate-900'
                          }`}
                        >
                          {reg.status === 'approved' ? 'Squad Confirmed' : reg.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 text-xs">
                      <div>
                        <span className="text-[10px] font-mono-code text-slate-400 uppercase font-bold block">
                          Squad Size
                        </span>
                        <div className="font-headline font-bold text-slate-800 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-[#006AA7]" />
                          <span>{reg.student_count} Squad Members</span>
                        </div>
                        <div className="text-slate-500">{reg.grade_group || 'Junior Innovators'}</div>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono-code text-slate-400 uppercase font-bold block">
                          Challenge Track
                        </span>
                        <div className="font-headline font-bold text-slate-800">
                          Young Innovators Challenge
                        </div>
                        <div className="text-slate-500">Mälardalen University Finals</div>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono-code text-slate-400 uppercase font-bold block">
                          Team Lead / Contact
                        </span>
                        <div className="font-headline font-bold text-slate-800">{reg.contact_name}</div>
                        <div className="text-slate-600">{reg.email}</div>
                        {reg.phone && <div className="text-slate-600">{reg.phone}</div>}
                      </div>

                      <div className="flex flex-col justify-end space-y-1.5">
                        <span className="text-[10px] font-mono-code text-slate-400 uppercase font-bold">
                          Admin Actions:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleUpdateRegStatus(reg.id, 'approved')}
                            className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-headline font-bold text-[11px] uppercase flex items-center gap-1 transition-colors"
                          >
                            <Check className="w-3 h-3" />
                            <span>Confirm Squad</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateRegStatus(reg.id, 'pending')}
                            className="py-1 px-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-headline font-bold text-[11px] uppercase transition-colors"
                          >
                            Pending
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateRegStatus(reg.id, 'rejected')}
                            className="py-1 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-headline font-bold text-[11px] uppercase transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PANEL 5: ALL INTAKE UNIFIED FEED */}
        {activePanel === 'all' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-300">
              <h2 className="font-headline font-black text-xl uppercase text-[#0A1930] flex items-center gap-2">
                <span>🌐 Unified Intake Feed Across All 4 Programs</span>
                <span className="text-xs font-mono-code text-slate-500 font-normal">
                  ({filteredRegistrations.length + filteredIdeas.length} total entries)
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: Workshop, Demo, Hackathon Registrations */}
              <div className="space-y-3">
                <div className="bg-[#0A1930] text-white px-3 py-2 text-xs font-headline font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>Workshops, Demos & Hackathons ({filteredRegistrations.length})</span>
                  <span className="text-[10px] font-mono-code text-[#FFCD00]">Real-time Bookings</span>
                </div>
                {filteredRegistrations.slice(0, 10).map((r) => (
                  <div key={r.id} className="p-3 bg-white border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono-code font-bold text-[#006AA7]">{r.public_id}</span>
                      <span
                        className={`text-[10px] font-bold uppercase px-1.5 py-0.2 ${
                          r.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {r.form_type} • {r.status}
                      </span>
                    </div>
                    <div className="font-headline font-bold text-slate-800">{r.school_name || r.team_name}</div>
                    <div className="text-[11px] text-slate-500">
                      {r.city_name} • {r.contact_name} ({r.email})
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: Idea Submissions */}
              <div className="space-y-3">
                <div className="bg-[#006AA7] text-white px-3 py-2 text-xs font-headline font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>Multimodal Idea Submissions ({filteredIdeas.length})</span>
                  <span className="text-[10px] font-mono-code text-[#FFCD00]">Voice / Blueprint / Video</span>
                </div>
                {filteredIdeas.slice(0, 10).map((i) => (
                  <div key={i.id} className="p-3 bg-white border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono-code font-bold text-[#006AA7]">{i.public_id}</span>
                      <span
                        className={`text-[10px] font-bold uppercase px-1.5 py-0.2 ${
                          i.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {i.category} • {i.status}
                      </span>
                    </div>
                    <div className="font-headline font-bold text-slate-800">{i.idea_title}</div>
                    <div className="text-[11px] text-slate-500">
                      {i.school_name} • By: {i.student_name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Blueprint Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="max-w-4xl max-h-[90vh] bg-white p-3 border-2 border-slate-300 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
              <span className="font-headline font-bold text-xs uppercase text-slate-800">
                Blueprint / Drawing Inspection
              </span>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="text-slate-500 hover:text-slate-800 text-xs font-mono-code font-bold uppercase"
              >
                [ Close ✕ ]
              </button>
            </div>
            <img
              src={previewImage}
              alt="Blueprint Preview"
              className="max-w-full max-h-[75vh] object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};
