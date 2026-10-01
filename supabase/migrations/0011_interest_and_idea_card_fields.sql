-- Migration 0011: fields from the printed Interest Card and Idea Card, plus the
-- programme type (demo / workshop / hackathon) on the public "Meet us @" view.
-- Idempotent and safe to re-run.

-- 1. Student interest-card answers (age, "I would like to", experience,
--    interests, parent/guardian name & phone) stored as one JSON object.
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS intake_details JSONB;

-- 2. Idea-card questions.
ALTER TABLE public.idea_submissions ADD COLUMN IF NOT EXISTS problem_statement TEXT;
ALTER TABLE public.idea_submissions ADD COLUMN IF NOT EXISTS beneficiaries TEXT;
ALTER TABLE public.idea_submissions ADD COLUMN IF NOT EXISTS develop_further TEXT;

-- 3. Registration RPC: same as 0007, plus intake_details.
CREATE OR REPLACE FUNCTION public.submit_eu_skola_registration(payload JSONB)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_city UUID;
  v_type TEXT := coalesce(payload->>'registration_type', 'school');
  v_id   TEXT;
  v_country_slug TEXT := coalesce(payload->>'country_slug', 'sweden');
  v_city_slug TEXT := coalesce(payload->>'city_slug', 'vasteras');
  v_form_type TEXT := coalesce(payload->>'form_type', 'workshop');
BEGIN
  IF v_type NOT IN ('school', 'student') THEN
    v_type := 'school';
  END IF;

  SELECT ci.id INTO v_city
  FROM public.eu_skola_cities ci
  JOIN public.eu_skola_countries co ON co.id = ci.country_id
  WHERE co.slug = v_country_slug
    AND ci.slug = v_city_slug;

  IF v_city IS NULL THEN
    SELECT id INTO v_city FROM public.eu_skola_cities WHERE slug = v_city_slug LIMIT 1;
  END IF;

  IF v_city IS NULL THEN
    SELECT ci.id INTO v_city
    FROM public.eu_skola_cities ci
    JOIN public.eu_skola_countries co ON co.id = ci.country_id
    WHERE co.slug = v_country_slug
    LIMIT 1;
  END IF;

  IF v_city IS NULL THEN
    SELECT id INTO v_city FROM public.eu_skola_cities WHERE slug = 'vasteras' LIMIT 1;
  END IF;

  INSERT INTO public.registrations (
    registration_type, school_name, team_name, contact_name, email, phone,
    category_id, student_count, preferred_date, date_range_start, date_range_end,
    workshop_slot, time_range, grade_group, consent_agreed, city_id,
    form_type, country_slug, custom_time, custom_date, intake_details
  ) VALUES (
    v_type,
    nullif(btrim(payload->>'school_name'), ''),
    nullif(btrim(payload->>'team_name'), ''),
    payload->>'contact_name',
    payload->>'email',
    payload->>'phone',
    coalesce(payload->>'category_id', 'vasteras-school-workshop'),
    coalesce(payload->>'student_count', '25'),
    nullif(payload->>'preferred_date', ''),
    nullif(payload->>'date_range_start', '')::date,
    nullif(payload->>'date_range_end', '')::date,
    nullif(payload->>'workshop_slot', ''),
    nullif(payload->>'time_range', ''),
    nullif(payload->>'grade_group', ''),
    coalesce((payload->>'consent_agreed')::boolean, false),
    v_city,
    v_form_type,
    v_country_slug,
    nullif(payload->>'custom_time', ''),
    nullif(payload->>'custom_date', '')::date,
    CASE WHEN jsonb_typeof(payload->'intake_details') = 'object' THEN payload->'intake_details' END
  )
  RETURNING public_id INTO v_id;

  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_eu_skola_registration(JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_eu_skola_registration(JSONB) TO anon, authenticated;

-- 4. Idea RPC: same as before, plus the idea-card questions.
CREATE OR REPLACE FUNCTION public.submit_kid_idea(payload JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_school_id UUID;
  v_public_id TEXT;
  v_seq INT;
  v_school_name TEXT := btrim(payload->>'school_name');
  v_inserted_id UUID;
  v_country_slug TEXT := coalesce(payload->>'country_slug', 'sweden');
  v_city_slug TEXT := coalesce(payload->>'city_slug', 'vasteras');
  v_country_code TEXT := 'SWE';
  v_city_code TEXT := 'VAST';
  v_city_id UUID;
BEGIN
  SELECT co.code, ci.code, ci.id INTO v_country_code, v_city_code, v_city_id
  FROM public.eu_skola_cities ci
  JOIN public.eu_skola_countries co ON co.id = ci.country_id
  WHERE co.slug = v_country_slug AND ci.slug = v_city_slug
  LIMIT 1;

  IF v_country_code IS NULL THEN v_country_code := 'SWE'; END IF;
  IF v_city_code IS NULL THEN v_city_code := 'VAST'; END IF;

  SELECT id INTO v_school_id
  FROM public.registrations
  WHERE registration_type = 'school'
    AND lower(school_name) = lower(v_school_name)
  LIMIT 1;

  SELECT count(*) + 1 INTO v_seq FROM public.idea_submissions;
  v_public_id := 'EU-' || v_country_code || '-' || v_city_code || '-IDEA-' || lpad(v_seq::text, 4, '0');

  INSERT INTO public.idea_submissions (
    public_id, student_name, student_age, student_grade, contact_email, contact_phone,
    school_name, school_id, country_slug, city_slug, city_name, country_name,
    idea_title, idea_description, photo_url, voice_note_url, video_url, video_type,
    category, consent_agreed, gdpr_agreed, status,
    problem_statement, beneficiaries, develop_further
  ) VALUES (
    v_public_id,
    payload->>'student_name',
    nullif(payload->>'student_age', '')::int,
    payload->>'student_grade',
    payload->>'contact_email',
    payload->>'contact_phone',
    v_school_name,
    v_school_id,
    v_country_slug,
    v_city_slug,
    payload->>'city_name',
    payload->>'country_name',
    payload->>'idea_title',
    payload->>'idea_description',
    payload->>'photo_url',
    payload->>'voice_note_url',
    payload->>'video_url',
    coalesce(payload->>'video_type', 'none'),
    coalesce(payload->>'category', 'Innovation'),
    coalesce((payload->>'consent_agreed')::boolean, true),
    coalesce((payload->>'gdpr_agreed')::boolean, true),
    'pending',
    nullif(btrim(payload->>'problem_statement'), ''),
    nullif(btrim(payload->>'beneficiaries'), ''),
    nullif(btrim(payload->>'develop_further'), '')
  )
  RETURNING id INTO v_inserted_id;

  RETURN jsonb_build_object(
    'id', v_inserted_id,
    'public_id', v_public_id,
    'school_mapped', (v_school_id IS NOT NULL),
    'status', 'pending'
  );
END;
$$;

REVOKE ALL ON FUNCTION public.submit_kid_idea(JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_kid_idea(JSONB) TO anon, authenticated;

-- 5. "Meet us @" chips show the programme booked (demo / workshop / hackathon).
CREATE OR REPLACE VIEW public.approved_schools AS
  SELECT DISTINCT school_name, preferred_date, workshop_slot, time_range, form_type
  FROM public.registrations
  WHERE registration_type = 'school'
    AND status = 'confirmed'
    AND school_name IS NOT NULL
  ORDER BY school_name;

GRANT SELECT ON public.approved_schools TO anon, authenticated;
