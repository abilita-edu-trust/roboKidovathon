import { supabase } from './supabase';

export interface IdeaSubmission {
  id: string;
  public_id: string;
  student_name: string;
  student_age?: number | null;
  student_grade?: string | null;
  contact_email: string;
  contact_phone?: string | null;
  school_name: string;
  school_id?: string | null;
  country_slug: string;
  city_slug: string;
  city_name?: string | null;
  country_name?: string | null;
  idea_title: string;
  idea_description?: string | null;
  photo_url?: string | null;
  voice_note_url?: string | null;
  video_url?: string | null;
  video_type?: 'file' | 'link' | 'none';
  category?: string;
  status: 'pending' | 'approved' | 'rejected';
  votes_count: number;
  created_at: string;
}

export interface SubmitIdeaPayload {
  student_name: string;
  student_age?: number | string;
  student_grade?: string;
  contact_email: string;
  contact_phone?: string;
  school_name: string;
  country_slug?: string;
  city_slug?: string;
  city_name?: string;
  country_name?: string;
  idea_title: string;
  idea_description?: string;
  photo_url?: string | null;
  voice_note_url?: string | null;
  video_url?: string | null;
  video_type?: 'file' | 'link' | 'none';
  category?: string;
  problem_statement?: string;
  beneficiaries?: string;
  develop_further?: string;
  consent_agreed?: boolean;
  gdpr_agreed?: boolean;
}

/** Generates or retrieves a persistent anonymous voter token for the browser */
export function getVoterToken(): string {
  let token = localStorage.getItem('vfi_voter_token');
  if (!token) {
    token = 'voter_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now().toString(36);
    localStorage.setItem('vfi_voter_token', token);
  }
  return token;
}

/** Check if the current browser session has voted for an idea */
export function hasVotedLocally(ideaId: string): boolean {
  try {
    const votes = JSON.parse(localStorage.getItem('vfi_voted_ideas') || '[]');
    return Array.isArray(votes) && votes.includes(ideaId);
  } catch {
    return false;
  }
}

/** Mark an idea as voted in localStorage */
export function markVotedLocally(ideaId: string) {
  try {
    const votes = JSON.parse(localStorage.getItem('vfi_voted_ideas') || '[]');
    if (!votes.includes(ideaId)) {
      votes.push(ideaId);
      localStorage.setItem('vfi_voted_ideas', JSON.stringify(votes));
    }
  } catch {
    // Ignore storage issues
  }
}

/** Upload media file to Supabase storage 'idea-media' bucket */
export async function uploadIdeaMedia(file: File, folder: 'photos' | 'audio' | 'videos'): Promise<string> {
  const ext = file.name.split('.').pop() || 'dat';
  const cleanName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
  
  const { data, error } = await supabase.storage
    .from('idea-media')
    .upload(cleanName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Storage upload error:', error);
    throw new Error(error.message || 'File upload failed');
  }

  const { data: publicUrlData } = supabase.storage
    .from('idea-media')
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}

/** Submit an idea */
export async function submitIdea(payload: SubmitIdeaPayload) {
  const { data, error } = await supabase.rpc('submit_kid_idea', { payload });
  if (error) {
    console.error('Submit idea error:', error);
    throw new Error(error.message || 'Failed to submit idea');
  }
  return data as { id: string; public_id: string; school_mapped: boolean; status: string };
}

/** Fetch all approved ideas for public showcase & voting */
export async function fetchApprovedIdeas(): Promise<IdeaSubmission[]> {
  const { data, error } = await supabase
    .from('idea_submissions')
    .select('*')
    .eq('status', 'approved')
    .order('votes_count', { ascending: false });

  if (error) {
    console.error('Fetch approved ideas error:', error);
    return [];
  }
  return data || [];
}

/** Cast a vote for an idea */
export async function voteForIdea(ideaId: string) {
  const token = getVoterToken();
  const { data, error } = await supabase.rpc('vote_for_idea', {
    p_idea_id: ideaId,
    p_voter_token: token
  });

  if (error) {
    console.error('Vote for idea error:', error);
    throw new Error(error.message || 'Failed to register vote');
  }

  if (data?.voted) {
    markVotedLocally(ideaId);
  }

  return data as { success: boolean; voted: boolean; already_voted?: boolean; votes_count: number; message: string };
}

/** Fetch list of confirmed / registered schools to autocomplete / pick */
export async function fetchRegisteredSchools(): Promise<{ name: string; city: string }[]> {
  try {
    const { data } = await supabase
      .from('registrations')
      .select('school_name, city_id')
      .eq('registration_type', 'school')
      .not('school_name', 'is', null);

    if (!data) return [];
    
    // Deduplicate school names
    const unique = new Map<string, string>();
    data.forEach((r: any) => {
      if (r.school_name && !unique.has(r.school_name.toLowerCase())) {
        unique.set(r.school_name.toLowerCase(), r.school_name);
      }
    });

    return Array.from(unique.values()).map(name => ({ name, city: 'Västerås' }));
  } catch (err) {
    console.warn('Failed to fetch registered schools:', err);
    return [];
  }
}

/** Admin: List all ideas with optional status and format filters */
export async function adminListIdeas(
  statusFilter: string = 'all',
  formatFilter: string = 'all'
): Promise<IdeaSubmission[]> {
  const { data, error } = await supabase.rpc('admin_list_ideas', {
    p_filter_status: statusFilter === 'all' ? null : statusFilter,
    p_format_filter: formatFilter === 'all' ? null : formatFilter,
  });

  if (error) {
    console.error('adminListIdeas error:', error);
    throw new Error(error.message || 'Failed to fetch ideas for moderation');
  }

  return (data || []) as IdeaSubmission[];
}

/** Admin: Curate English title/description and approve/reject idea */
export async function adminCurateIdea(params: {
  ideaId: string;
  englishTitle: string;
  englishDescription: string;
  category: string;
  status: 'approved' | 'rejected' | 'pending';
}) {
  const { data, error } = await supabase.rpc('admin_curate_idea', {
    p_idea_id: params.ideaId,
    p_english_title: params.englishTitle,
    p_english_description: params.englishDescription,
    p_category: params.category,
    p_status: params.status,
  });

  if (error) {
    console.error('adminCurateIdea error:', error);
    throw new Error(error.message || 'Failed to curate idea');
  }

  return data;
}
