-- Migration 0014: close public access to registration and idea data.
--
-- admin_list_registrations, admin_list_ideas, admin_update_registration_status and
-- admin_curate_idea were SECURITY DEFINER with no caller check and executable by
-- anon, so anyone could list every registration and idea (names, emails, phones,
-- ages) or change their status. They now require a signed-in admin / super_admin,
-- or a city admin, who only sees and changes rows of their own cities.
--
-- Approved ideas stay public for voting, but anon can only read the columns the
-- voting pages show — not contact email, phone, age or grade.
--
-- Depends on is_city_admin / is_city_admin_slug (www-iniac-se migration
-- 20261008100100_vaxjo_city_admins_partners.sql). Idempotent.

-- ── Who may use the admin RPCs ────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.can_use_admin_rpcs(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT _user_id IS NOT NULL AND (
    public.is_admin_or_super(_user_id)
    OR EXISTS (SELECT 1 FROM public.eu_skola_city_admins a WHERE a.user_id = _user_id)
  )
$$;

-- ── admin_list_registrations ──────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.admin_list_registrations(p_form_type text DEFAULT NULL::text, p_status text DEFAULT NULL::text, p_country_slug text DEFAULT NULL::text)
 RETURNS TABLE(id uuid, public_id text, registration_type text, school_name text, team_name text, contact_name text, email text, phone text, category_id text, student_count text, preferred_date text, time_range text, grade_group text, status text, form_type text, country_slug text, custom_date date, custom_time text, city_name text, country_name text, created_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_is_admin BOOLEAN := public.is_admin_or_super(auth.uid());
BEGIN
  IF NOT public.can_use_admin_rpcs(auth.uid()) THEN
    RAISE EXCEPTION 'Not authorized' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT
    r.id, r.public_id, r.registration_type, r.school_name, r.team_name, r.contact_name, r.email, r.phone,
    r.category_id, r.student_count, r.preferred_date, r.time_range, r.grade_group, r.status,
    COALESCE(
      r.form_type,
      CASE
        WHEN r.category_id ILIKE '%hackathon%' THEN 'hackathon'
        WHEN r.category_id ILIKE '%demo%' THEN 'demo'
        ELSE 'workshop'
      END
    ) AS form_type,
    r.country_slug, r.custom_date, r.custom_time,
    ci.name AS city_name,
    co.name AS country_name,
    r.created_at
  FROM public.registrations r
  LEFT JOIN public.eu_skola_cities ci ON ci.id = r.city_id
  LEFT JOIN public.eu_skola_countries co ON co.id = ci.country_id
  WHERE
    (v_is_admin OR public.is_city_admin(auth.uid(), r.city_id))
    AND (p_form_type IS NULL OR p_form_type = 'all' OR
      COALESCE(
        r.form_type,
        CASE
          WHEN r.category_id ILIKE '%hackathon%' THEN 'hackathon'
          WHEN r.category_id ILIKE '%demo%' THEN 'demo'
          ELSE 'workshop'
        END
      ) = p_form_type
    )
    AND (p_status IS NULL OR p_status = 'all' OR r.status = p_status)
    AND (p_country_slug IS NULL OR p_country_slug = 'all' OR r.country_slug = p_country_slug)
  ORDER BY r.created_at DESC;
END;
$function$;

-- ── admin_list_ideas ──────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.admin_list_ideas(p_filter_status text DEFAULT NULL::text, p_format_filter text DEFAULT NULL::text)
 RETURNS TABLE(id uuid, public_id text, student_name text, student_age integer, student_grade text, contact_email text, contact_phone text, school_name text, school_id uuid, country_slug text, city_slug text, city_name text, country_name text, idea_title text, idea_description text, photo_url text, voice_note_url text, video_url text, video_type text, category text, status text, votes_count integer, created_at timestamp with time zone, reviewed_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_is_admin BOOLEAN := public.is_admin_or_super(auth.uid());
BEGIN
  IF NOT public.can_use_admin_rpcs(auth.uid()) THEN
    RAISE EXCEPTION 'Not authorized' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT
    i.id, i.public_id, i.student_name, i.student_age, i.student_grade, i.contact_email, i.contact_phone,
    i.school_name, i.school_id, i.country_slug, i.city_slug, i.city_name, i.country_name,
    i.idea_title, i.idea_description, i.photo_url, i.voice_note_url, i.video_url, i.video_type,
    i.category, i.status, i.votes_count, i.created_at, i.reviewed_at
  FROM public.idea_submissions i
  WHERE
    (v_is_admin OR public.is_city_admin_slug(auth.uid(), i.country_slug, i.city_slug))
    AND (p_filter_status IS NULL OR p_filter_status = 'all' OR i.status = p_filter_status)
    AND (
      p_format_filter IS NULL OR p_format_filter = 'all'
      OR (p_format_filter = 'voice' AND i.voice_note_url IS NOT NULL)
      OR (p_format_filter = 'video' AND i.video_url IS NOT NULL)
      OR (p_format_filter = 'photo' AND i.photo_url IS NOT NULL)
      OR (p_format_filter = 'text' AND (i.voice_note_url IS NULL AND i.video_url IS NULL AND i.photo_url IS NULL))
    )
  ORDER BY i.created_at DESC;
END;
$function$;

-- ── admin_update_registration_status ──────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.admin_update_registration_status(p_registration_id uuid, p_status text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_updated public.registrations%ROWTYPE;
BEGIN
  IF NOT public.can_use_admin_rpcs(auth.uid()) THEN
    RAISE EXCEPTION 'Not authorized' USING ERRCODE = '42501';
  END IF;

  UPDATE public.registrations r
  SET status = p_status
  WHERE r.id = p_registration_id
    AND (public.is_admin_or_super(auth.uid()) OR public.is_city_admin(auth.uid(), r.city_id))
  RETURNING * INTO v_updated;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Registration not found');
  END IF;

  RETURN jsonb_build_object('success', true, 'id', v_updated.id, 'public_id', v_updated.public_id, 'status', v_updated.status);
END;
$function$;

-- ── admin_curate_idea ─────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.admin_curate_idea(p_idea_id uuid, p_english_title text, p_english_description text, p_category text, p_status text DEFAULT 'approved'::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_updated public.idea_submissions%ROWTYPE;
BEGIN
  IF NOT public.can_use_admin_rpcs(auth.uid()) THEN
    RAISE EXCEPTION 'Not authorized' USING ERRCODE = '42501';
  END IF;

  UPDATE public.idea_submissions i
  SET
    idea_title = COALESCE(NULLIF(TRIM(p_english_title), ''), i.idea_title),
    idea_description = TRIM(p_english_description),
    category = COALESCE(NULLIF(TRIM(p_category), ''), i.category),
    status = p_status,
    reviewed_at = now()
  WHERE i.id = p_idea_id
    AND (public.is_admin_or_super(auth.uid()) OR public.is_city_admin_slug(auth.uid(), i.country_slug, i.city_slug))
  RETURNING * INTO v_updated;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Idea not found');
  END IF;

  RETURN jsonb_build_object(
    'success', true, 'id', v_updated.id, 'public_id', v_updated.public_id, 'status', v_updated.status,
    'idea_title', v_updated.idea_title, 'category', v_updated.category
  );
END;
$function$;

-- Signed-in callers only; the functions check the role themselves.
REVOKE ALL ON FUNCTION public.admin_list_registrations(text, text, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_list_ideas(text, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_update_registration_status(uuid, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_curate_idea(uuid, text, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_registrations(text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_ideas(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_registration_status(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_curate_idea(uuid, text, text, text, text) TO authenticated;

-- ── Public (anon) idea reads: approved rows, safe columns only ────────────────
DROP POLICY IF EXISTS "Public can read approved idea_submissions" ON public.idea_submissions;
CREATE POLICY "Public can read approved idea_submissions" ON public.idea_submissions
  FOR SELECT TO anon USING (status = 'approved');

REVOKE SELECT ON public.idea_submissions FROM anon;
GRANT SELECT (
  id, public_id, student_name, school_name, country_slug, city_slug, city_name, country_name,
  idea_title, idea_description, photo_url, voice_note_url, video_url, video_type, category,
  status, votes_count, created_at
) ON public.idea_submissions TO anon;
