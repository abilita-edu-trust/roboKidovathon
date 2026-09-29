import { supabase } from './supabase';

export interface AdminRegistration {
  id: string;
  public_id: string;
  registration_type: 'school' | 'student';
  school_name: string | null;
  team_name: string | null;
  contact_name: string;
  email: string;
  phone: string | null;
  category_id: string;
  student_count: string;
  preferred_date: string | null;
  time_range: string | null;
  grade_group: string | null;
  status: 'pending' | 'approved' | 'rejected';
  form_type: 'workshop' | 'demo' | 'hackathon';
  country_slug: string;
  custom_date: string | null;
  custom_time: string | null;
  city_name: string | null;
  country_name: string | null;
  created_at: string;
}

export async function adminListRegistrations(
  formType: string = 'all',
  status: string = 'all',
  countrySlug: string = 'all'
): Promise<AdminRegistration[]> {
  const { data, error } = await supabase.rpc('admin_list_registrations', {
    p_form_type: formType === 'all' ? null : formType,
    p_status: status === 'all' ? null : status,
    p_country_slug: countrySlug === 'all' ? null : countrySlug,
  });

  if (error) {
    console.error('adminListRegistrations error:', error);
    throw new Error(error.message || 'Failed to fetch registrations');
  }

  return (data || []) as AdminRegistration[];
}

export async function adminUpdateRegistrationStatus(
  registrationId: string,
  status: 'approved' | 'rejected' | 'pending'
) {
  const { data, error } = await supabase.rpc('admin_update_registration_status', {
    p_registration_id: registrationId,
    p_status: status,
  });

  if (error) {
    console.error('adminUpdateRegistrationStatus error:', error);
    throw new Error(error.message || 'Failed to update registration status');
  }

  return data;
}
