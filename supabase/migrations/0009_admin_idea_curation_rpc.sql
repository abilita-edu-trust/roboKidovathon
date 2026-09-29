-- Migration 0009: Admin Idea Curation and Format Review RPCs
-- Allows admins to inspect submissions in different formats (voice note, blueprint/photo, video),
-- type/translate in English, accept & approve to reflect on the live website.

-- 1. Function to list all ideas for Admin Review
CREATE OR REPLACE FUNCTION public.admin_list_ideas(
  p_filter_status TEXT DEFAULT NULL,
  p_format_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  public_id TEXT,
  student_name TEXT,
  student_age INT,
  student_grade TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  school_name TEXT,
  school_id UUID,
  country_slug TEXT,
  city_slug TEXT,
  city_name TEXT,
  country_name TEXT,
  idea_title TEXT,
  idea_description TEXT,
  photo_url TEXT,
  voice_note_url TEXT,
  video_url TEXT,
  video_type TEXT,
  category TEXT,
  status TEXT,
  votes_count INT,
  created_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    i.id,
    i.public_id,
    i.student_name,
    i.student_age,
    i.student_grade,
    i.contact_email,
    i.contact_phone,
    i.school_name,
    i.school_id,
    i.country_slug,
    i.city_slug,
    i.city_name,
    i.country_name,
    i.idea_title,
    i.idea_description,
    i.photo_url,
    i.voice_note_url,
    i.video_url,
    i.video_type,
    i.category,
    i.status,
    i.votes_count,
    i.created_at,
    i.reviewed_at
  FROM public.idea_submissions i
  WHERE
    (p_filter_status IS NULL OR p_filter_status = 'all' OR i.status = p_filter_status)
    AND (
      p_format_filter IS NULL OR p_format_filter = 'all'
      OR (p_format_filter = 'voice' AND i.voice_note_url IS NOT NULL)
      OR (p_format_filter = 'video' AND i.video_url IS NOT NULL)
      OR (p_format_filter = 'photo' AND i.photo_url IS NOT NULL)
      OR (p_format_filter = 'text' AND (i.voice_note_url IS NULL AND i.video_url IS NULL AND i.photo_url IS NULL))
    )
  ORDER BY i.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_list_ideas(TEXT, TEXT) TO anon, authenticated;

-- 2. Function to Curate and Accept/Approve Idea (English Title & Description typed by Admin)
CREATE OR REPLACE FUNCTION public.admin_curate_idea(
  p_idea_id UUID,
  p_english_title TEXT,
  p_english_description TEXT,
  p_category TEXT,
  p_status TEXT DEFAULT 'approved'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_updated public.idea_submissions%ROWTYPE;
BEGIN
  UPDATE public.idea_submissions
  SET
    idea_title = COALESCE(NULLIF(TRIM(p_english_title), ''), idea_title),
    idea_description = TRIM(p_english_description),
    category = COALESCE(NULLIF(TRIM(p_category), ''), category),
    status = p_status,
    reviewed_at = now()
  WHERE id = p_idea_id
  RETURNING * INTO v_updated;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Idea not found');
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'id', v_updated.id,
    'public_id', v_updated.public_id,
    'status', v_updated.status,
    'idea_title', v_updated.idea_title,
    'category', v_updated.category
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_curate_idea(UUID, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;
