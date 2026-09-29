-- Migration 0007: Update submit_eu_skola_registration to support country/city flexible matching and form_type

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

  -- Attempt to find city by country and city slug
  SELECT ci.id INTO v_city
  FROM public.eu_skola_cities ci
  JOIN public.eu_skola_countries co ON co.id = ci.country_id
  WHERE co.slug = v_country_slug
    AND ci.slug = v_city_slug;

  -- Fallback 1: match by city slug only
  IF v_city IS NULL THEN
    SELECT id INTO v_city FROM public.eu_skola_cities WHERE slug = v_city_slug LIMIT 1;
  END IF;

  -- Fallback 2: first city in the specified country
  IF v_city IS NULL THEN
    SELECT ci.id INTO v_city
    FROM public.eu_skola_cities ci
    JOIN public.eu_skola_countries co ON co.id = ci.country_id
    WHERE co.slug = v_country_slug
    LIMIT 1;
  END IF;

  -- Fallback 3: Västerås default
  IF v_city IS NULL THEN
    SELECT id INTO v_city FROM public.eu_skola_cities WHERE slug = 'vasteras' LIMIT 1;
  END IF;

  INSERT INTO public.registrations (
    registration_type, school_name, team_name, contact_name, email, phone,
    category_id, student_count, preferred_date, date_range_start, date_range_end,
    workshop_slot, time_range, grade_group, consent_agreed, city_id,
    form_type, country_slug, custom_time, custom_date
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
    nullif(payload->>'custom_date', '')::date
  )
  RETURNING public_id INTO v_id;

  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_eu_skola_registration(JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_eu_skola_registration(JSONB) TO anon, authenticated;
