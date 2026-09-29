-- Migration 0010: Admin Unified Intake RPCs for Workshop, Demo, Hackathon, and Ideas
-- Allows the Admin Portal to fetch and manage all 4 intake types (Workshop, Demo, Hackathon, Ideas) with full filters and status approvals.

-- 1. List Registrations (Workshop, Demo, Hackathon)
CREATE OR REPLACE FUNCTION public.admin_list_registrations(
  p_form_type TEXT DEFAULT NULL,
  p_status TEXT DEFAULT NULL,
  p_country_slug TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  public_id TEXT,
  registration_type TEXT,
  school_name TEXT,
  team_name TEXT,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  category_id TEXT,
  student_count TEXT,
  preferred_date TEXT,
  time_range TEXT,
  grade_group TEXT,
  status TEXT,
  form_type TEXT,
  country_slug TEXT,
  custom_date DATE,
  custom_time TEXT,
  city_name TEXT,
  country_name TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id,
    r.public_id,
    r.registration_type,
    r.school_name,
    r.team_name,
    r.contact_name,
    r.email,
    r.phone,
    r.category_id,
    r.student_count,
    r.preferred_date,
    r.time_range,
    r.grade_group,
    r.status,
    COALESCE(
      r.form_type,
      CASE
        WHEN r.category_id ILIKE '%hackathon%' THEN 'hackathon'
        WHEN r.category_id ILIKE '%demo%' THEN 'demo'
        ELSE 'workshop'
      END
    ) AS form_type,
    r.country_slug,
    r.custom_date,
    r.custom_time,
    ci.name AS city_name,
    co.name AS country_name,
    r.created_at
  FROM public.registrations r
  LEFT JOIN public.eu_skola_cities ci ON ci.id = r.city_id
  LEFT JOIN public.eu_skola_countries co ON co.id = ci.country_id
  WHERE
    (p_form_type IS NULL OR p_form_type = 'all' OR
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
$$;

GRANT EXECUTE ON FUNCTION public.admin_list_registrations(TEXT, TEXT, TEXT) TO anon, authenticated;

-- 2. Update Registration Status (Approve / Reject / Pending)
CREATE OR REPLACE FUNCTION public.admin_update_registration_status(
  p_registration_id UUID,
  p_status TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_updated public.registrations%ROWTYPE;
BEGIN
  UPDATE public.registrations
  SET
    status = p_status
  WHERE id = p_registration_id
  RETURNING * INTO v_updated;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Registration not found');
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'id', v_updated.id,
    'public_id', v_updated.public_id,
    'status', v_updated.status
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_update_registration_status(UUID, TEXT) TO anon, authenticated;
