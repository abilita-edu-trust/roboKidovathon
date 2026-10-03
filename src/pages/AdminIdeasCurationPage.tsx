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
  Clock,
  Download,
  Copy,
  LayoutList,
  LayoutGrid,
  Columns3,
  ChevronDown,
  ArrowUpDown,
  StickyNote,
  BarChart3,
  Eye,
  X
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
export type ViewMode = 'cards' | 'table' | 'kanban';
export type SortOption = 'newest' | 'oldest' | 'students' | 'name' | 'urgent';
export type DateRangePreset = 'all' | 'today' | 'week' | 'month';

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

  // Advanced Dashboard Features State
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [dateRange, setDateRange] = useState<DateRangePreset>('all');
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Multi-Selection state for bulk operations
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<string>('');
  const [bulkLoading, setBulkLoading] = useState(false);

  // Inspection Drawer state
  const [inspectingItem, setInspectingItem] = useState<AdminRegistration | IdeaSubmission | null>(null);

  // Admin Internal Notes state (persisted to localStorage)
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem('ssrl_admin_notes') || '{}');
    } catch {
      return {};
    }
  });
  const [currentNoteInput, setCurrentNoteInput] = useState('');

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

  // Toast notifier helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

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
      showToast('⚠️ Failed to load latest data from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, countryFilter, ideaFormatFilter]);

  // Derived counts for program panels & analytics
  const stats = useMemo(() => {
    const workshops = registrations.filter((r) => r.form_type === 'workshop');
    const demos = registrations.filter((r) => r.form_type === 'demo');
    const hackathons = registrations.filter((r) => r.form_type === 'hackathon');
    const totalStudents = registrations.reduce((acc, curr) => {
      const parsed = parseInt(curr.student_count.replace(/[^0-9]/g, ''), 10) || 0;
      return acc + parsed;
    }, 0);

    const totalAll = registrations.length + ideas.length;
    const totalApproved =
      registrations.filter((r) => r.status === 'approved').length +
      ideas.filter((i) => i.status === 'approved').length;
    const approvalRate = totalAll > 0 ? Math.round((totalApproved / totalAll) * 100) : 0;

    // By country
    const swedenCount =
      registrations.filter((r) => r.country_slug === 'sweden').length +
      ideas.filter((i) => i.country_slug === 'sweden').length;
    const denmarkCount =
      registrations.filter((r) => r.country_slug === 'denmark').length +
      ideas.filter((i) => i.country_slug === 'denmark').length;
    const latviaCount =
      registrations.filter((r) => r.country_slug === 'latvia').length +
      ideas.filter((i) => i.country_slug === 'latvia').length;
    const estoniaCount =
      registrations.filter((r) => r.country_slug === 'estonia').length +
      ideas.filter((i) => i.country_slug === 'estonia').length;

    return {
      totalWorkshops: workshops.length,
      pendingWorkshops: workshops.filter((w) => w.status === 'pending').length,
      approvedWorkshops: workshops.filter((w) => w.status === 'approved').length,
      totalDemos: demos.length,
      pendingDemos: demos.filter((d) => d.status === 'pending').length,
      approvedDemos: demos.filter((d) => d.status === 'approved').length,
      totalHackathons: hackathons.length,
      pendingHackathons: hackathons.filter((h) => h.status === 'pending').length,
      approvedHackathons: hackathons.filter((h) => h.status === 'approved').length,
      totalIdeas: ideas.length,
      pendingIdeas: ideas.filter((i) => i.status === 'pending').length,
      approvedIdeas: ideas.filter((i) => i.status === 'approved').length,
      totalStudents,
      totalAll,
      totalApproved,
      approvalRate,
      swedenCount,
      denmarkCount,
      latviaCount,
      estoniaCount,
    };
  }, [registrations, ideas]);

  // Date filter helper
  const matchesDateRange = (createdAt: string) => {
    if (dateRange === 'all') return true;
    const date = new Date(createdAt).getTime();
    const now = Date.now();
    const diffHours = (now - date) / (1000 * 60 * 60);

    if (dateRange === 'today') return diffHours <= 24;
    if (dateRange === 'week') return diffHours <= 24 * 7;
    if (dateRange === 'month') return diffHours <= 24 * 30;
    return true;
  };

  // Filter & sort registrations
  const filteredRegistrations = useMemo(() => {
    let result = registrations.filter((item) => {
      if (activePanel === 'workshops' && item.form_type !== 'workshop') return false;
      if (activePanel === 'demos' && item.form_type !== 'demo') return false;
      if (activePanel === 'hackathons' && item.form_type !== 'hackathon') return false;

      if (countryFilter !== 'all' && item.country_slug !== countryFilter) return false;
      if (!matchesDateRange(item.created_at)) return false;

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

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === 'students') {
        const cntA = parseInt(a.student_count.replace(/[^0-9]/g, ''), 10) || 0;
        const cntB = parseInt(b.student_count.replace(/[^0-9]/g, ''), 10) || 0;
        return cntB - cntA;
      }
      if (sortBy === 'name') {
        const nameA = (a.school_name || a.team_name || '').toLowerCase();
        const nameB = (b.school_name || b.team_name || '').toLowerCase();
        return nameA.localeCompare(nameB);
      }
      if (sortBy === 'urgent') {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (b.status === 'pending' && a.status !== 'pending') return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return 0;
    });

    return result;
  }, [registrations, activePanel, countryFilter, searchQuery, sortBy, dateRange]);

  // Filter & sort ideas
  const filteredIdeas = useMemo(() => {
    let result = ideas.filter((item) => {
      if (countryFilter !== 'all' && item.country_slug !== countryFilter) return false;
      if (ideaCategoryFilter !== 'all' && item.category !== ideaCategoryFilter) return false;
      if (!matchesDateRange(item.created_at)) return false;

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

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === 'students') return (b.votes_count || 0) - (a.votes_count || 0); // most votes
      if (sortBy === 'name') {
        return (a.student_name || '').localeCompare(b.student_name || '');
      }
      if (sortBy === 'urgent') {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (b.status === 'pending' && a.status !== 'pending') return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return 0;
    });

    return result;
  }, [ideas, countryFilter, ideaCategoryFilter, searchQuery, sortBy, dateRange]);

  // Items currently visible in the active panel (for Select All)
  const currentVisibleItems = useMemo(() => {
    if (activePanel === 'ideas') return filteredIdeas;
    if (activePanel === 'all') return [...filteredRegistrations, ...filteredIdeas];
    return filteredRegistrations;
  }, [activePanel, filteredIdeas, filteredRegistrations]);

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
      if (inspectingItem && inspectingItem.id === id) {
        setInspectingItem((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
      setRegFeedback((prev) => ({
        ...prev,
        [id]:
          newStatus === 'approved'
            ? '✓ Confirmed & Approved'
            : newStatus === 'rejected'
            ? 'Rejected'
            : 'Reset to Pending',
      }));
      showToast(
        newStatus === 'approved'
          ? '✓ Registration Confirmed & Approved'
          : newStatus === 'rejected'
          ? 'Registration marked as Rejected'
          : 'Reset to Pending status'
      );
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

  // AI-Assisted Auto-Draft English Curation Helper
  const handleAutoDraftAiCuration = (idea: IdeaSubmission) => {
    const rawTitle = idea.idea_title || '';
    const rawDesc = idea.idea_description || '';
    const cleanCategory = idea.category || 'Sustainability & Green Tech';

    let suggestedTitle = rawTitle;
    const lower = rawTitle.toLowerCase();
    if (lower.includes('skräp') || lower.includes('sop') || lower.includes('waste')) {
      suggestedTitle = 'Autonomous AI Waste Sorting & Circular Robotics System';
    } else if (lower.includes('sol') || lower.includes('energi') || lower.includes('solar')) {
      suggestedTitle = 'Smart Solar-Powered Clean Energy Harvester';
    } else if (lower.includes('vatten') || lower.includes('ren') || lower.includes('water')) {
      suggestedTitle = 'Autonomous Aquatic Water Purification Drone';
    } else if (lower.includes('skola') || lower.includes('elev') || lower.includes('smart')) {
      suggestedTitle = 'Adaptive IoT Climate & Health Assistant for Classrooms';
    } else if (!suggestedTitle) {
      suggestedTitle = `Next-Gen ${cleanCategory} Innovation`;
    }

    let suggestedDesc = rawDesc;
    if (!suggestedDesc || suggestedDesc.length < 15) {
      suggestedDesc = `An innovative engineering solution submitted by ${idea.student_name} from ${idea.school_name} tackling challenges in ${cleanCategory}. Integrates smart automated sensors and sustainable materials.`;
    } else {
      suggestedDesc = `Curated Summary: ${rawDesc.trim()} (Engineered by ${idea.student_name}, ${idea.school_name} to advance ${cleanCategory} in Nordic schools).`;
    }

    handleCurationChange(idea.id, 'englishTitle', suggestedTitle);
    handleCurationChange(idea.id, 'englishDescription', suggestedDesc);
    showToast('✨ AI auto-drafted publication-ready English curation!');
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

      if (inspectingItem && inspectingItem.id === ideaId) {
        setInspectingItem((prev) =>
          prev
            ? {
                ...prev,
                status: newStatus,
                idea_title: cur.englishTitle,
                idea_description: cur.englishDescription,
                category: cur.category,
              } as any
            : null
        );
      }

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

      showToast(
        newStatus === 'approved'
          ? '✓ Idea approved and live on public voting arena!'
          : newStatus === 'rejected'
          ? 'Idea rejected'
          : 'Status reset to pending'
      );

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

  // Multi-Selection Toggle
  const toggleSelectItem = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAllVisible = () => {
    if (selectedIds.size === currentVisibleItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(currentVisibleItems.map((i) => i.id)));
    }
  };

  // Bulk Status Updates
  const executeBulkAction = async () => {
    if (!bulkAction || selectedIds.size === 0) return;

    if (bulkAction === 'export') {
      const selectedItems = currentVisibleItems.filter((i) => selectedIds.has(i.id));
      exportToCsv(selectedItems, `ssrl_selected_export_${activePanel}`);
      setBulkAction('');
      return;
    }

    if (bulkAction === 'copy_emails') {
      const selectedItems = currentVisibleItems.filter((i) => selectedIds.has(i.id));
      copyEmailsToClipboard(selectedItems);
      setBulkAction('');
      return;
    }

    const targetStatus = bulkAction as 'approved' | 'rejected' | 'pending';
    const count = selectedIds.size;
    if (
      !window.confirm(
        `Are you sure you want to mark ${count} selected item(s) as "${targetStatus.toUpperCase()}"?`
      )
    ) {
      return;
    }

    setBulkLoading(true);
    try {
      const updates: Promise<any>[] = [];
      selectedIds.forEach((id) => {
        const reg = registrations.find((r) => r.id === id);
        if (reg) {
          updates.push(adminUpdateRegistrationStatus(id, targetStatus));
        } else {
          const idea = ideas.find((i) => i.id === id);
          if (idea) {
            const cur = curationMap[id] || {
              englishTitle: idea.idea_title || '',
              englishDescription: idea.idea_description || '',
              category: idea.category || 'Sustainability & Green Tech',
            };
            updates.push(
              adminCurateIdea({
                ideaId: id,
                englishTitle: cur.englishTitle,
                englishDescription: cur.englishDescription,
                category: cur.category,
                status: targetStatus,
              })
            );
          }
        }
      });

      await Promise.all(updates);

      // Local state update
      setRegistrations((prev) =>
        prev.map((r) => (selectedIds.has(r.id) ? { ...r, status: targetStatus } : r))
      );
      setIdeas((prev) =>
        prev.map((i) => (selectedIds.has(i.id) ? { ...i, status: targetStatus } : i))
      );

      setSelectedIds(new Set());
      setBulkAction('');
      showToast(`✓ Bulk Action Complete: ${count} item(s) updated to "${targetStatus}"!`);
    } catch (err: any) {
      alert(err.message || 'Failed to complete bulk update');
    } finally {
      setBulkLoading(false);
    }
  };

  // Export to CSV Spreadsheet
  const exportToCsv = (items: Array<AdminRegistration | IdeaSubmission>, filename: string) => {
    if (items.length === 0) {
      alert('No records available to export.');
      return;
    }

    const headers = [
      'Public ID',
      'Program Type / Category',
      'School / Squad Name',
      'Student / Contact Name',
      'Email Address',
      'Phone Number',
      'Cohort Size / Votes',
      'Date / Slot',
      'City',
      'Country',
      'Status',
      'Submitted At',
    ];

    const rows = items.map((item) => {
      const isIdea = 'student_name' in item;
      return [
        item.public_id,
        isIdea ? item.category || 'Idea Submission' : item.form_type,
        isIdea ? item.school_name : item.school_name || item.team_name || 'Individual',
        isIdea ? item.student_name : item.contact_name,
        isIdea ? item.contact_email : item.email,
        isIdea ? item.contact_phone || '' : item.phone || '',
        isIdea ? `${item.votes_count} votes` : item.student_count,
        isIdea ? '-' : item.preferred_date || item.custom_date || 'Standard slot',
        item.city_name || '',
        item.country_name || item.country_slug,
        item.status,
        item.created_at,
      ]
        .map((val) => `"${String(val || '').replace(/"/g, '""')}"`)
        .join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `${filename}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`✓ Exported ${items.length} records to CSV!`);
  };

  // Copy Coordinator Emails to Clipboard
  const copyEmailsToClipboard = (items: Array<AdminRegistration | IdeaSubmission>) => {
    const emails = items
      .map((i) => ('contact_email' in i ? i.contact_email : i.email))
      .filter((e): e is string => Boolean(e && e.includes('@')));

    const uniqueEmails = Array.from(new Set(emails));
    if (uniqueEmails.length === 0) {
      alert('No valid emails found in the current selection.');
      return;
    }

    navigator.clipboard.writeText(uniqueEmails.join('; '));
    showToast(`✓ Copied ${uniqueEmails.length} coordinator email(s) to clipboard!`);
  };

  // Internal Admin Notes Management
  const handleSaveNote = (itemId: string) => {
    if (!currentNoteInput.trim()) return;
    const next = { ...adminNotes, [itemId]: currentNoteInput.trim() };
    setAdminNotes(next);
    try {
      localStorage.setItem('ssrl_admin_notes', JSON.stringify(next));
    } catch (e) {
      console.error(e);
    }
    showToast('✓ Internal admin note saved!');
  };

  const handleOpenInspection = (item: AdminRegistration | IdeaSubmission) => {
    setInspectingItem(item);
    setCurrentNoteInput(adminNotes[item.id] || '');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-[#0A1930] pt-24 pb-24 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A1930] border-2 border-[#FFCD00] text-white px-5 py-3 shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#FFCD00]" />
          <span className="text-xs font-mono-code font-bold">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2 text-xs"
          >
            ✕
          </button>
        </div>
      )}

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

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAnalyticsModal(true)}
              className="py-1.5 px-3.5 bg-white border border-[#006AA7] hover:bg-sky-50 text-[#006AA7] text-xs font-headline font-bold uppercase flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>KPI & Analytics Insights</span>
            </button>

            <div className="flex items-center gap-2 text-xs font-mono-code bg-white px-3 py-1.5 border border-slate-200 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-700 font-bold uppercase">SSRL Admin Command Center</span>
            </div>
          </div>
        </div>

        {/* Hero Banner with Unified Stats */}
        <div className="bg-[#0A1930] text-white p-6 sm:p-8 border-b-4 border-[#FFCD00] relative overflow-hidden shadow-md">
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono-code font-bold tracking-widest text-[#FFCD00] uppercase">
                <Shield className="w-4 h-4" />
                <span>UNIFIED 4-PROGRAM INTAKE & MODERATION COMMAND CENTER</span>
              </div>
              <h1 className="font-headline font-black text-2xl sm:text-4xl uppercase tracking-tight">
                SSRL Admin Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                Live moderation, batch updates, multimodal English curation, and coordinator roster exports for Workshops, Demos, Hackathons & Multimodal Ideas.
              </p>
            </div>

            {/* Quick Actions in Hero */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => exportToCsv(currentVisibleItems, `ssrl_roster_${activePanel}`)}
                className="py-2 px-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-headline font-bold uppercase flex items-center gap-1.5 transition-colors"
                title="Export filtered records to CSV"
              >
                <Download className="w-3.5 h-3.5 text-[#FFCD00]" />
                <span>Export CSV</span>
              </button>
              <button
                type="button"
                onClick={() => copyEmailsToClipboard(currentVisibleItems)}
                className="py-2 px-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-headline font-bold uppercase flex items-center gap-1.5 transition-colors"
                title="Copy all coordinator emails to clipboard for mailing"
              >
                <Copy className="w-3.5 h-3.5 text-sky-400" />
                <span>Copy Emails</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar with 1-Click Filter Activation */}
          <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div
              onClick={() => setActivePanel('workshops')}
              className={`p-2.5 bg-slate-900/80 border cursor-pointer transition-all hover:border-[#FFCD00] ${
                activePanel === 'workshops' ? 'border-[#FFCD00]' : 'border-slate-800'
              }`}
            >
              <div className="text-[10px] font-mono-code text-slate-400 uppercase">1. Workshops</div>
              <div className="text-xl font-headline font-black text-white mt-0.5">
                {stats.totalWorkshops}
              </div>
              <div className="text-[10px] font-mono-code text-amber-400">
                {stats.pendingWorkshops} pending
              </div>
            </div>

            <div
              onClick={() => setActivePanel('demos')}
              className={`p-2.5 bg-slate-900/80 border cursor-pointer transition-all hover:border-[#FFCD00] ${
                activePanel === 'demos' ? 'border-[#FFCD00]' : 'border-slate-800'
              }`}
            >
              <div className="text-[10px] font-mono-code text-slate-400 uppercase">2. Demos</div>
              <div className="text-xl font-headline font-black text-white mt-0.5">
                {stats.totalDemos}
              </div>
              <div className="text-[10px] font-mono-code text-amber-400">
                {stats.pendingDemos} pending
              </div>
            </div>

            <div
              onClick={() => setActivePanel('ideas')}
              className={`p-2.5 bg-slate-900/80 border cursor-pointer transition-all hover:border-[#FFCD00] ${
                activePanel === 'ideas' ? 'border-[#FFCD00]' : 'border-slate-800'
              }`}
            >
              <div className="text-[10px] font-mono-code text-slate-400 uppercase">3. Ideas</div>
              <div className="text-xl font-headline font-black text-[#FFCD00] mt-0.5">
                {stats.totalIdeas}
              </div>
              <div className="text-[10px] font-mono-code text-emerald-400">
                {stats.approvedIdeas} live on site
              </div>
            </div>

            <div
              onClick={() => setActivePanel('hackathons')}
              className={`p-2.5 bg-slate-900/80 border cursor-pointer transition-all hover:border-[#FFCD00] ${
                activePanel === 'hackathons' ? 'border-[#FFCD00]' : 'border-slate-800'
              }`}
            >
              <div className="text-[10px] font-mono-code text-slate-400 uppercase">4. Hackathons</div>
              <div className="text-xl font-headline font-black text-white mt-0.5">
                {stats.totalHackathons}
              </div>
              <div className="text-[10px] font-mono-code text-amber-400">
                {stats.pendingHackathons} squads
              </div>
            </div>

            <div
              onClick={() => setShowAnalyticsModal(true)}
              className="p-2.5 bg-slate-900/80 border border-slate-800 col-span-2 sm:col-span-1 cursor-pointer hover:border-emerald-400 transition-all"
            >
              <div className="text-[10px] font-mono-code text-slate-400 uppercase">Total Students</div>
              <div className="text-xl font-headline font-black text-emerald-400 mt-0.5">
                {stats.totalStudents}+
              </div>
              <div className="text-[10px] font-mono-code text-slate-400">
                {stats.approvalRate}% Approval Rate
              </div>
            </div>
          </div>
        </div>

        {/* ── MASTER DROPDOWN / SCOPE SELECTOR & VIEW MODE CONTROLS ── */}
        <div className="bg-white p-4 border border-slate-300 shadow-sm flex flex-wrap items-center justify-between gap-4">
          {/* User's "Dropdown to select what" feature */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-slate-500 block">
                Select Program / Scope:
              </label>
              <div className="relative">
                <select
                  value={activePanel}
                  onChange={(e) => {
                    setActivePanel(e.target.value as AdminProgramTab);
                    setSelectedIds(new Set());
                  }}
                  className="appearance-none pr-9 pl-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-300 font-headline font-bold text-xs text-[#0A1930] focus:border-[#006AA7] focus:outline-none cursor-pointer"
                >
                  <option value="ideas">💡 3. Student Ideas Curation ({stats.totalIdeas})</option>
                  <option value="workshops">🤖 1. School Workshops ({stats.totalWorkshops})</option>
                  <option value="demos">📢 2. School Demos ({stats.totalDemos})</option>
                  <option value="hackathons">🏆 4. Hackathon Squads ({stats.totalHackathons})</option>
                  <option value="all">🌐 All Intake Feed ({stats.totalAll})</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Quick program switcher pill buttons */}
            <div className="hidden lg:flex items-center gap-1.5 pt-4">
              {[
                { id: 'workshops', label: 'Workshops', icon: '🤖', count: stats.totalWorkshops },
                { id: 'demos', label: 'Demos', icon: '📢', count: stats.totalDemos },
                { id: 'ideas', label: 'Ideas', icon: '💡', count: stats.totalIdeas },
                { id: 'hackathons', label: 'Hackathons', icon: '🏆', count: stats.totalHackathons },
                { id: 'all', label: 'All', icon: '🌐', count: stats.totalAll },
              ].map((panel) => {
                const active = activePanel === panel.id;
                return (
                  <button
                    key={panel.id}
                    type="button"
                    onClick={() => {
                      setActivePanel(panel.id as AdminProgramTab);
                      setSelectedIds(new Set());
                    }}
                    className={`py-1.5 px-3 text-xs font-headline font-bold uppercase flex items-center gap-1.5 border transition-all ${
                      active
                        ? 'bg-[#006AA7] text-white border-[#006AA7]'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>{panel.icon}</span>
                    <span>{panel.label}</span>
                    <span
                      className={`text-[10px] font-mono-code px-1 rounded-xs ${
                        active ? 'bg-white text-[#006AA7]' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {panel.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right side: View Mode switcher & Sorting */}
          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Switcher */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-slate-500 block">
                View Mode:
              </label>
              <div className="flex border border-slate-300">
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  className={`p-2 transition-colors ${
                    viewMode === 'cards' ? 'bg-[#006AA7] text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                  title="Card View with Media & Curation"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`p-2 transition-colors border-l border-r border-slate-300 ${
                    viewMode === 'table' ? 'bg-[#006AA7] text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                  title="Dense Data Table View"
                >
                  <LayoutList className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('kanban')}
                  className={`p-2 transition-colors ${
                    viewMode === 'kanban' ? 'bg-[#006AA7] text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                  title="Kanban Pipeline Moderation View"
                >
                  <Columns3 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sorting Dropdown */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-slate-500 block">
                Sort By:
              </label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none pr-8 pl-2.5 py-1.5 bg-slate-50 border border-slate-300 text-xs font-headline font-bold text-slate-800 focus:border-[#006AA7] focus:outline-none"
                >
                  <option value="newest">🕒 Newest First</option>
                  <option value="oldest">⏳ Oldest First</option>
                  <option value="urgent">⚡ Urgent (Pending First)</option>
                  <option value="students">👥 Cohort Size / Votes</option>
                  <option value="name">🏫 School / Name (A-Z)</option>
                </select>
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Date Preset Dropdown */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-slate-500 block">
                Timeframe:
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as DateRangePreset)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 text-xs font-headline font-bold text-slate-800 focus:border-[#006AA7] focus:outline-none"
              >
                <option value="all">All Time</option>
                <option value="today">Today (24h)</option>
                <option value="week">Past 7 Days</option>
                <option value="month">Past 30 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── FILTER CONTROLS BAR ── */}
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

        {/* ── STICKY BULK ACTIONS BAR (Visible when items selected) ── */}
        {selectedIds.size > 0 && (
          <div className="sticky top-20 z-40 bg-[#0A1930] border-2 border-[#FFCD00] text-white p-3 shadow-xl flex flex-wrap items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="bg-[#FFCD00] text-[#0A1930] font-mono-code font-bold text-xs px-2 py-0.5">
                {selectedIds.size} Selected
              </span>
              <button
                type="button"
                onClick={selectAllVisible}
                className="text-xs font-mono-code text-slate-300 hover:text-white underline"
              >
                {selectedIds.size === currentVisibleItems.length ? 'Deselect All' : 'Select All Visible'}
              </button>
              <button
                type="button"
                onClick={() => setSelectedIds(new Set())}
                className="text-xs font-mono-code text-slate-400 hover:text-rose-300"
              >
                Clear
              </button>
            </div>

            {/* Bulk Action Selector */}
            <div className="flex items-center gap-2">
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-xs font-headline font-bold text-white focus:outline-none focus:border-[#FFCD00]"
              >
                <option value="">-- Select Action for {selectedIds.size} items --</option>
                <option value="approved">🟢 Mark Selected as Approved / Confirmed</option>
                <option value="pending">🟡 Reset Selected to Pending</option>
                <option value="rejected">🔴 Mark Selected as Rejected</option>
                <option value="export">📥 Export Selected to CSV</option>
                <option value="copy_emails">📋 Copy Selected Emails</option>
              </select>

              <button
                type="button"
                disabled={!bulkAction || bulkLoading}
                onClick={executeBulkAction}
                className="py-1.5 px-4 bg-[#FFCD00] hover:bg-yellow-400 text-[#0A1930] text-xs font-headline font-black uppercase transition-all disabled:opacity-40"
              >
                {bulkLoading ? 'Applying...' : 'Apply'}
              </button>
            </div>
          </div>
        )}

        {/* ── PANEL CONTENTS ── */}

        {/* KANBAN PIPELINE VIEW (When viewMode === 'kanban') */}
        {viewMode === 'kanban' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-300">
              <h2 className="font-headline font-black text-xl uppercase text-[#0A1930] flex items-center gap-2">
                <Columns3 className="w-5 h-5 text-[#006AA7]" />
                <span>Kanban Moderation Pipeline</span>
              </h2>
              <span className="text-xs font-mono-code text-slate-500">
                1-Click Status Transitions
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Column 1: Pending */}
              <div className="bg-amber-50/50 border-2 border-amber-300 p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                  <div className="flex items-center gap-2 font-headline font-bold text-sm text-amber-900 uppercase">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>🟡 Pending Action</span>
                  </div>
                  <span className="text-xs font-mono-code font-bold bg-amber-200 px-2 py-0.5 text-amber-900">
                    {currentVisibleItems.filter((i) => i.status === 'pending').length}
                  </span>
                </div>

                <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                  {currentVisibleItems
                    .filter((i) => i.status === 'pending')
                    .map((item) => {
                      const isIdea = 'student_name' in item;
                      return (
                        <div
                          key={item.id}
                          className="bg-white p-3 border border-slate-200 shadow-xs space-y-2 hover:border-[#006AA7] transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono-code font-bold text-[#006AA7]">
                              {item.public_id}
                            </span>
                            <span className="text-[10px] font-mono-code uppercase bg-slate-100 text-slate-600 px-1.5">
                              {isIdea ? item.category : item.form_type}
                            </span>
                          </div>
                          <div className="font-headline font-bold text-xs text-slate-800">
                            {isIdea ? item.idea_title : item.school_name || item.team_name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {isIdea ? `By: ${item.student_name}` : `Contact: ${item.contact_name}`}
                          </div>
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => handleOpenInspection(item)}
                              className="text-[11px] font-headline font-bold text-[#006AA7] hover:underline"
                            >
                              Inspect →
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (isIdea) {
                                  handleCurateAndSaveIdea(item.id, 'approved');
                                } else {
                                  handleUpdateRegStatus(item.id, 'approved');
                                }
                              }}
                              className="py-1 px-2 bg-emerald-600 text-white text-[10px] font-headline font-bold uppercase hover:bg-emerald-700"
                            >
                              Approve
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Column 2: Approved / Confirmed */}
              <div className="bg-emerald-50/50 border-2 border-emerald-300 p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                  <div className="flex items-center gap-2 font-headline font-bold text-sm text-emerald-900 uppercase">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>🟢 Approved / Live</span>
                  </div>
                  <span className="text-xs font-mono-code font-bold bg-emerald-200 px-2 py-0.5 text-emerald-900">
                    {currentVisibleItems.filter((i) => i.status === 'approved').length}
                  </span>
                </div>

                <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                  {currentVisibleItems
                    .filter((i) => i.status === 'approved')
                    .map((item) => {
                      const isIdea = 'student_name' in item;
                      return (
                        <div
                          key={item.id}
                          className="bg-white p-3 border border-slate-200 shadow-xs space-y-2 hover:border-emerald-500 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono-code font-bold text-emerald-700">
                              {item.public_id}
                            </span>
                            <span className="text-[10px] font-mono-code uppercase bg-emerald-50 text-emerald-800 px-1.5">
                              Live
                            </span>
                          </div>
                          <div className="font-headline font-bold text-xs text-slate-800">
                            {isIdea ? item.idea_title : item.school_name || item.team_name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {isIdea ? `${item.votes_count} Votes` : `${item.student_count} Students`}
                          </div>
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => handleOpenInspection(item)}
                              className="text-[11px] font-headline font-bold text-[#006AA7] hover:underline"
                            >
                              Inspect →
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (isIdea) {
                                  handleCurateAndSaveIdea(item.id, 'pending');
                                } else {
                                  handleUpdateRegStatus(item.id, 'pending');
                                }
                              }}
                              className="text-[10px] font-headline font-bold text-slate-500 hover:text-slate-800"
                            >
                              Reset
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Column 3: Rejected */}
              <div className="bg-rose-50/50 border-2 border-rose-300 p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-rose-200">
                  <div className="flex items-center gap-2 font-headline font-bold text-sm text-rose-900 uppercase">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span>🔴 Rejected / Archived</span>
                  </div>
                  <span className="text-xs font-mono-code font-bold bg-rose-200 px-2 py-0.5 text-rose-900">
                    {currentVisibleItems.filter((i) => i.status === 'rejected').length}
                  </span>
                </div>

                <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                  {currentVisibleItems
                    .filter((i) => i.status === 'rejected')
                    .map((item) => {
                      const isIdea = 'student_name' in item;
                      return (
                        <div
                          key={item.id}
                          className="bg-white p-3 border border-slate-200 shadow-xs space-y-2 opacity-80 hover:opacity-100 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono-code font-bold text-rose-700">
                              {item.public_id}
                            </span>
                            <span className="text-[10px] font-mono-code uppercase bg-rose-100 text-rose-800 px-1.5">
                              Rejected
                            </span>
                          </div>
                          <div className="font-headline font-bold text-xs text-slate-800">
                            {isIdea ? item.idea_title : item.school_name || item.team_name}
                          </div>
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => handleOpenInspection(item)}
                              className="text-[11px] font-headline font-bold text-[#006AA7] hover:underline"
                            >
                              Inspect →
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (isIdea) {
                                  handleCurateAndSaveIdea(item.id, 'pending');
                                } else {
                                  handleUpdateRegStatus(item.id, 'pending');
                                }
                              }}
                              className="text-[10px] font-headline font-bold text-amber-600 hover:text-amber-800"
                            >
                              Restore
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DENSE DATA TABLE VIEW (When viewMode === 'table') */}
        {viewMode === 'table' && (
          <div className="bg-white border border-slate-300 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={
                    currentVisibleItems.length > 0 &&
                    selectedIds.size === currentVisibleItems.length
                  }
                  onChange={selectAllVisible}
                  className="w-4 h-4 cursor-pointer text-[#006AA7]"
                />
                <span className="font-headline font-bold text-xs uppercase text-slate-700">
                  Showing {currentVisibleItems.length} records in dense view
                </span>
              </div>
              <span className="text-[11px] font-mono-code text-slate-500">
                Click row or Inspect to open coordinator details
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-headline font-bold uppercase tracking-wider border-b border-slate-300">
                    <th className="p-3 w-10">Select</th>
                    <th className="p-3">ID</th>
                    <th className="p-3">School / Team</th>
                    <th className="p-3">Contact / Student</th>
                    <th className="p-3">Email & Phone</th>
                    <th className="p-3">Cohort Size</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {currentVisibleItems.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-slate-500 font-mono-code">
                        No records match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    currentVisibleItems.map((item) => {
                      const isIdea = 'student_name' in item;
                      const isSelected = selectedIds.has(item.id);

                      return (
                        <tr
                          key={item.id}
                          className={`hover:bg-sky-50/50 transition-colors ${
                            isSelected ? 'bg-sky-50' : ''
                          }`}
                        >
                          <td className="p-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectItem(item.id)}
                              className="w-4 h-4 cursor-pointer text-[#006AA7]"
                            />
                          </td>
                          <td className="p-3 font-mono-code font-bold text-[#006AA7]">
                            {item.public_id}
                          </td>
                          <td className="p-3 font-headline font-bold text-slate-800">
                            {isIdea
                              ? item.school_name
                              : item.school_name || item.team_name || 'Individual'}
                            <div className="text-[10px] font-mono-code text-slate-400 font-normal">
                              {isIdea ? item.category : item.form_type}
                            </div>
                          </td>
                          <td className="p-3 text-slate-700 font-medium">
                            {isIdea ? item.student_name : item.contact_name}
                          </td>
                          <td className="p-3 text-slate-600">
                            <div>{isIdea ? item.contact_email : item.email}</div>
                            <div className="text-[10px] text-slate-400">
                              {isIdea ? item.contact_phone : item.phone}
                            </div>
                          </td>
                          <td className="p-3 font-headline font-bold text-slate-800">
                            {isIdea ? `${item.votes_count} votes` : item.student_count}
                          </td>
                          <td className="p-3 text-slate-600">
                            {item.city_name || 'Västerås'}, {item.country_name || 'Sweden'}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-headline font-bold uppercase ${
                                item.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : item.status === 'rejected'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleOpenInspection(item)}
                              className="py-1 px-2.5 bg-slate-200 hover:bg-[#006AA7] hover:text-white font-headline font-bold text-[11px] uppercase transition-colors"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DETAILED CARDS VIEW (When viewMode === 'cards') */}
        {viewMode === 'cards' && (
          <>
            {/* PANEL 1: WORKSHOPS */}
            {activePanel === 'workshops' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-300">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={
                        filteredRegistrations.length > 0 &&
                        selectedIds.size === filteredRegistrations.length
                      }
                      onChange={selectAllVisible}
                      className="w-4 h-4 cursor-pointer text-[#006AA7]"
                    />
                    <h2 className="font-headline font-black text-xl uppercase text-[#0A1930] flex items-center gap-2">
                      <span>🤖 1. School Workshop Bookings</span>
                      <span className="text-xs font-mono-code text-slate-500 font-normal">
                        ({filteredRegistrations.length} requests)
                      </span>
                    </h2>
                  </div>
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
                          selectedIds.has(reg.id) ? 'ring-2 ring-[#006AA7]' : ''
                        } ${
                          reg.status === 'approved'
                            ? 'border-emerald-400'
                            : reg.status === 'rejected'
                            ? 'border-rose-300 bg-rose-50/20'
                            : 'border-amber-300 bg-amber-50/10'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedIds.has(reg.id)}
                              onChange={() => toggleSelectItem(reg.id)}
                              className="w-4 h-4 cursor-pointer text-[#006AA7] mr-1"
                            />
                            <span className="text-xs font-mono-code font-black px-2 py-0.5 bg-[#0A1930] text-white">
                              {reg.public_id}
                            </span>
                            <span className="font-headline font-black text-base text-[#0A1930]">
                              {reg.school_name || 'Unnamed School'}
                            </span>
                            <span className="text-xs font-mono-code text-slate-500">
                              • {reg.city_name || 'Västerås'}, {reg.country_name || 'Sweden'}
                            </span>
                            {adminNotes[reg.id] && (
                              <span className="text-[10px] font-mono-code bg-amber-100 text-amber-800 px-1.5 py-0.5 flex items-center gap-1">
                                <StickyNote className="w-3 h-3" /> Note Saved
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {regFeedback[reg.id] && (
                              <span className="text-xs font-mono-code font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200 animate-pulse">
                                {regFeedback[reg.id]}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleOpenInspection(reg)}
                              className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-headline font-bold text-[11px] uppercase flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" /> Inspect
                            </button>
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
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={
                        filteredRegistrations.length > 0 &&
                        selectedIds.size === filteredRegistrations.length
                      }
                      onChange={selectAllVisible}
                      className="w-4 h-4 cursor-pointer text-[#006AA7]"
                    />
                    <h2 className="font-headline font-black text-xl uppercase text-[#0A1930] flex items-center gap-2">
                      <span>📢 2. School Demo Requests</span>
                      <span className="text-xs font-mono-code text-slate-500 font-normal">
                        ({filteredRegistrations.length} requests)
                      </span>
                    </h2>
                  </div>
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
                          selectedIds.has(reg.id) ? 'ring-2 ring-[#006AA7]' : ''
                        } ${
                          reg.status === 'approved'
                            ? 'border-emerald-400'
                            : reg.status === 'rejected'
                            ? 'border-rose-300 bg-rose-50/20'
                            : 'border-amber-300 bg-amber-50/10'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedIds.has(reg.id)}
                              onChange={() => toggleSelectItem(reg.id)}
                              className="w-4 h-4 cursor-pointer text-[#006AA7] mr-1"
                            />
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
                            <button
                              type="button"
                              onClick={() => handleOpenInspection(reg)}
                              className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-headline font-bold text-[11px] uppercase flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" /> Inspect
                            </button>
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
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={
                        filteredIdeas.length > 0 &&
                        selectedIds.size === filteredIdeas.length
                      }
                      onChange={selectAllVisible}
                      className="w-4 h-4 cursor-pointer text-[#006AA7]"
                    />
                    <h2 className="font-headline font-black text-xl uppercase text-[#0A1930] flex items-center gap-2">
                      <span>💡 3. Multimodal Idea Formats Curation</span>
                      <span className="text-xs font-mono-code text-slate-500 font-normal">
                        ({filteredIdeas.length} submissions)
                      </span>
                    </h2>
                  </div>
                  <span className="text-xs font-mono-code text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                    AI Auto-Draft & English Curation
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
                            selectedIds.has(idea.id) ? 'ring-2 ring-[#006AA7]' : ''
                          } ${
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
                              <input
                                type="checkbox"
                                checked={selectedIds.has(idea.id)}
                                onChange={() => toggleSelectItem(idea.id)}
                                className="w-4 h-4 cursor-pointer text-[#006AA7] mr-1"
                              />
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
                              <span className="text-[10px] font-mono-code bg-slate-100 text-slate-700 px-1.5 py-0.5">
                                🗳️ {idea.votes_count || 0} Votes
                              </span>
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

                              <button
                                type="button"
                                onClick={() => handleOpenInspection(idea)}
                                className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-headline font-bold text-[11px] uppercase flex items-center gap-1"
                              >
                                <Eye className="w-3 h-3" /> Inspect
                              </button>

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

                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleAutoDraftAiCuration(idea)}
                                    className="py-1 px-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-[11px] font-headline font-bold uppercase flex items-center gap-1 shadow-xs transition-all"
                                  >
                                    <Sparkles className="w-3 h-3 text-[#FFCD00]" />
                                    <span>AI Auto-Draft</span>
                                  </button>
                                  {cur.savedMessage && (
                                    <span className="text-xs font-mono-code font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200 animate-pulse">
                                      {cur.savedMessage}
                                    </span>
                                  )}
                                </div>
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
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={
                        filteredRegistrations.length > 0 &&
                        selectedIds.size === filteredRegistrations.length
                      }
                      onChange={selectAllVisible}
                      className="w-4 h-4 cursor-pointer text-[#006AA7]"
                    />
                    <h2 className="font-headline font-black text-xl uppercase text-[#0A1930] flex items-center gap-2">
                      <span>🏆 4. Young Inno Hack Squads</span>
                      <span className="text-xs font-mono-code text-slate-500 font-normal">
                        ({filteredRegistrations.length} squads)
                      </span>
                    </h2>
                  </div>
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
                          selectedIds.has(reg.id) ? 'ring-2 ring-[#006AA7]' : ''
                        } ${
                          reg.status === 'approved'
                            ? 'border-emerald-400'
                            : reg.status === 'rejected'
                            ? 'border-rose-300 bg-rose-50/20'
                            : 'border-amber-300 bg-amber-50/10'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedIds.has(reg.id)}
                              onChange={() => toggleSelectItem(reg.id)}
                              className="w-4 h-4 cursor-pointer text-[#006AA7] mr-1"
                            />
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
                            <button
                              type="button"
                              onClick={() => handleOpenInspection(reg)}
                              className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-headline font-bold text-[11px] uppercase flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" /> Inspect
                            </button>
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
                            <div className="text-slate-500">5 Dec 2026 Final · venue TBC</div>
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
                      <div
                        key={r.id}
                        onClick={() => handleOpenInspection(r)}
                        className="p-3 bg-white border border-slate-200 text-xs space-y-1 cursor-pointer hover:border-[#006AA7] transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono-code font-bold text-[#006AA7]">{r.public_id}</span>
                          <span
                            className={`text-[10px] font-bold uppercase px-1.5 py-0.2 ${
                              r.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {r.form_type} • {r.status}
                          </span>
                        </div>
                        <div className="font-headline font-bold text-slate-800">
                          {r.school_name || r.team_name}
                        </div>
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
                      <div
                        key={i.id}
                        onClick={() => handleOpenInspection(i)}
                        className="p-3 bg-white border border-slate-200 text-xs space-y-1 cursor-pointer hover:border-[#006AA7] transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono-code font-bold text-[#006AA7]">{i.public_id}</span>
                          <span
                            className={`text-[10px] font-bold uppercase px-1.5 py-0.2 ${
                              i.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
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
          </>
        )}
      </div>

      {/* ── SLIDE-OVER INSPECTION & ADMIN NOTES DRAWER ── */}
      {inspectingItem && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 flex justify-end">
          <div
            className="w-full max-w-xl bg-white h-full shadow-2xl overflow-y-auto p-6 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono-code font-bold px-2 py-0.5 bg-[#0A1930] text-white">
                    {inspectingItem.public_id}
                  </span>
                  <span
                    className={`text-xs font-headline font-bold uppercase px-2 py-0.5 ${
                      inspectingItem.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : inspectingItem.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {inspectingItem.status}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectingItem(null)}
                  className="p-1 hover:bg-slate-100 text-slate-500 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Title & Entity */}
              <div>
                <h3 className="font-headline font-black text-xl text-[#0A1930]">
                  {'student_name' in inspectingItem
                    ? inspectingItem.idea_title || 'Idea Submission'
                    : inspectingItem.school_name || inspectingItem.team_name || 'Registration'}
                </h3>
                <p className="text-xs font-mono-code text-slate-500 mt-1">
                  Submitted on {new Date(inspectingItem.created_at).toLocaleString()}
                </p>
              </div>

              {/* Details Breakdown */}
              <div className="bg-slate-50 border border-slate-200 p-4 space-y-3 text-xs">
                {'student_name' in inspectingItem ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Student Name:</span>
                      <span className="font-bold">{inspectingItem.student_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">School:</span>
                      <span className="font-bold">{inspectingItem.school_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Category:</span>
                      <span className="font-bold text-[#006AA7]">{inspectingItem.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Votes Cast:</span>
                      <span className="font-bold">{inspectingItem.votes_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Email:</span>
                      <span className="font-mono-code">{inspectingItem.contact_email}</span>
                    </div>
                    {inspectingItem.contact_phone && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Phone:</span>
                        <span className="font-mono-code">{inspectingItem.contact_phone}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Program:</span>
                      <span className="font-bold uppercase text-[#006AA7]">
                        {inspectingItem.form_type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">School / Team:</span>
                      <span className="font-bold">
                        {inspectingItem.school_name || inspectingItem.team_name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Contact Coordinator:</span>
                      <span className="font-bold">{inspectingItem.contact_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Coordinator Email:</span>
                      <span className="font-mono-code">{inspectingItem.email}</span>
                    </div>
                    {inspectingItem.phone && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Phone:</span>
                        <span className="font-mono-code">{inspectingItem.phone}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-500">Cohort Size:</span>
                      <span className="font-bold">{inspectingItem.student_count} Students</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Preferred Slot:</span>
                      <span>
                        {inspectingItem.preferred_date || inspectingItem.custom_date || 'Standard'} (
                        {inspectingItem.time_range || inspectingItem.custom_time || 'Morning'})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Location:</span>
                      <span>
                        {inspectingItem.city_name || 'Västerås'},{' '}
                        {inspectingItem.country_name || 'Sweden'}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Internal Admin Private Notebook */}
              <div className="border border-amber-300 bg-amber-50/50 p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-headline font-bold text-amber-900 uppercase">
                  <StickyNote className="w-4 h-4 text-amber-600" />
                  <span>Internal Coordinator Notebook (Saved Locally)</span>
                </div>
                <textarea
                  rows={3}
                  value={currentNoteInput}
                  onChange={(e) => setCurrentNoteInput(e.target.value)}
                  placeholder="Private admin notes (e.g., called rector, confirmed auditorium key, special hardware requirements)..."
                  className="w-full p-2.5 bg-white border border-amber-300 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => handleSaveNote(inspectingItem.id)}
                  className="py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white font-headline font-bold text-[11px] uppercase transition-colors"
                >
                  Save Internal Note
                </button>
              </div>
            </div>

            {/* Drawer Actions Footer */}
            <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if ('student_name' in inspectingItem) {
                      handleCurateAndSaveIdea(inspectingItem.id, 'approved');
                    } else {
                      handleUpdateRegStatus(inspectingItem.id, 'approved');
                    }
                  }}
                  className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-headline font-bold uppercase transition-colors"
                >
                  Approve / Confirm
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if ('student_name' in inspectingItem) {
                      handleCurateAndSaveIdea(inspectingItem.id, 'pending');
                    } else {
                      handleUpdateRegStatus(inspectingItem.id, 'pending');
                    }
                  }}
                  className="py-2 px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-headline font-bold uppercase transition-colors"
                >
                  Pending
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if ('student_name' in inspectingItem) {
                      handleCurateAndSaveIdea(inspectingItem.id, 'rejected');
                    } else {
                      handleUpdateRegStatus(inspectingItem.id, 'rejected');
                    }
                  }}
                  className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 text-xs font-headline font-bold uppercase transition-colors"
                >
                  Reject
                </button>
              </div>

              <button
                type="button"
                onClick={() => setInspectingItem(null)}
                className="text-xs font-mono-code text-slate-500 hover:text-slate-800"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── KPI & ANALYTICS INSIGHTS MODAL ── */}
      {showAnalyticsModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setShowAnalyticsModal(false)}
        >
          <div
            className="max-w-2xl w-full bg-white p-6 border-2 border-slate-300 space-y-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#006AA7]" />
                <h3 className="font-headline font-black text-lg uppercase text-[#0A1930]">
                  SSRL Analytics & Program KPIs
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAnalyticsModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] font-mono-code text-slate-500 uppercase">
                  Total Registrations
                </span>
                <div className="text-2xl font-headline font-black text-[#0A1930] mt-1">
                  {stats.totalAll}
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-[10px] font-mono-code text-emerald-700 uppercase">
                  Approval Rate
                </span>
                <div className="text-2xl font-headline font-black text-emerald-700 mt-1">
                  {stats.approvalRate}%
                </div>
              </div>

              <div className="p-3 bg-sky-50 border border-sky-200 text-center">
                <span className="text-[10px] font-mono-code text-sky-700 uppercase">
                  Students Impacted
                </span>
                <div className="text-2xl font-headline font-black text-[#006AA7] mt-1">
                  {stats.totalStudents}+
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 text-center">
                <span className="text-[10px] font-mono-code text-amber-700 uppercase">
                  Action Required
                </span>
                <div className="text-2xl font-headline font-black text-amber-800 mt-1">
                  {stats.pendingWorkshops +
                    stats.pendingDemos +
                    stats.pendingIdeas +
                    stats.pendingHackathons}
                </div>
              </div>
            </div>

            {/* Country Breakdown */}
            <div className="space-y-2">
              <span className="text-xs font-headline font-bold uppercase text-slate-700">
                Geographic Distribution
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span>🇸🇪 Sweden</span>
                  <span className="font-bold">{stats.swedenCount}</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span>🇩🇰 Denmark</span>
                  <span className="font-bold">{stats.denmarkCount}</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span>🇱🇻 Latvia</span>
                  <span className="font-bold">{stats.latviaCount}</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span>🇪🇪 Estonia</span>
                  <span className="font-bold">{stats.estoniaCount}</span>
                </div>
              </div>
            </div>

            {/* Program Breakdown Progress Bars */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-headline font-bold uppercase text-slate-700">
                Intake Distribution by Program
              </span>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>1. School Workshops</span>
                    <span>{stats.totalWorkshops} bookings</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2">
                    <div
                      className="bg-[#006AA7] h-2"
                      style={{
                        width: `${stats.totalAll > 0 ? (stats.totalWorkshops / stats.totalAll) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>2. School Demos</span>
                    <span>{stats.totalDemos} sessions</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2">
                    <div
                      className="bg-sky-500 h-2"
                      style={{
                        width: `${stats.totalAll > 0 ? (stats.totalDemos / stats.totalAll) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>3. Multimodal Student Ideas</span>
                    <span>{stats.totalIdeas} submissions</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2">
                    <div
                      className="bg-[#FFCD00] h-2"
                      style={{
                        width: `${stats.totalAll > 0 ? (stats.totalIdeas / stats.totalAll) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>4. Hackathon Squads</span>
                    <span>{stats.totalHackathons} teams</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2">
                    <div
                      className="bg-indigo-600 h-2"
                      style={{
                        width: `${stats.totalAll > 0 ? (stats.totalHackathons / stats.totalAll) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAnalyticsModal(false)}
                className="py-1.5 px-4 bg-[#0A1930] hover:bg-[#006AA7] text-white text-xs font-headline font-bold uppercase transition-colors"
              >
                Close Insights
              </button>
            </div>
          </div>
        </div>
      )}

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
