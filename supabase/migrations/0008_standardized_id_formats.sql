-- Migration 0008: Standardized format-based ID generation for Ideas and Hackathon Squads

-- 1. Update submit_kid_idea to generate standardized EU Skola formatted IDs:
-- EU-[COUNTRY]-[CITY]-IDEA-[NUMBER] (e.g. EU-SWE-VAST-IDEA-0001)
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
  -- Look up city and country short codes
  SELECT co.code, ci.code, ci.id INTO v_country_code, v_city_code, v_city_id
  FROM public.eu_skola_cities ci
  JOIN public.eu_skola_countries co ON co.id = ci.country_id
  WHERE co.slug = v_country_slug AND ci.slug = v_city_slug
  LIMIT 1;

  IF v_country_code IS NULL THEN v_country_code := 'SWE'; END IF;
  IF v_city_code IS NULL THEN v_city_code := 'VAST'; END IF;

  -- Try to map to an existing registered school by matching school_name
  SELECT id INTO v_school_id
  FROM public.registrations
  WHERE registration_type = 'school'
    AND lower(school_name) = lower(v_school_name)
  LIMIT 1;

  -- Generate sequential readable public ID: EU-[CO]-[CI]-IDEA-XXXX
  SELECT count(*) + 1 INTO v_seq FROM public.idea_submissions;
  v_public_id := 'EU-' || v_country_code || '-' || v_city_code || '-IDEA-' || lpad(v_seq::text, 4, '0');

  INSERT INTO public.idea_submissions (
    public_id,
    student_name,
    student_age,
    student_grade,
    contact_email,
    contact_phone,
    school_name,
    school_id,
    country_slug,
    city_slug,
    city_name,
    country_name,
    idea_title,
    idea_description,
    photo_url,
    voice_note_url,
    video_url,
    video_type,
    category,
    consent_agreed,
    gdpr_agreed,
    status
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
    'pending'
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

-- 2. Update trigger to support HACK kind in eu_skola_id_counters
ALTER TABLE public.eu_skola_id_counters DROP CONSTRAINT IF EXISTS eu_skola_id_counters_kind_check;
ALTER TABLE public.eu_skola_id_counters ADD CONSTRAINT eu_skola_id_counters_kind_check CHECK (kind IN ('INDV', 'GROU', 'HACK'));

CREATE OR REPLACE FUNCTION public.registrations_eu_skola_ids()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin BOOLEAN := auth.uid() IS NOT NULL AND public.is_admin_or_super(auth.uid());
  locked   BOOLEAN := TG_OP = 'UPDATE' AND OLD.status IN ('confirmed', 'scheduled', 'completed');
  prefix   TEXT;
  v_kind   TEXT;
  next_n   INT;
BEGIN
  IF TG_OP = 'INSERT' AND NOT is_admin THEN
    NEW.status       := 'pending';
    NEW.notes        := NULL;
    NEW.school_code  := NULL;
    NEW.public_id    := NULL;
    NEW.confirmed_at := NULL;
  END IF;

  IF NEW.city_id IS NULL THEN
    SELECT ci.id INTO NEW.city_id
    FROM public.eu_skola_cities ci
    JOIN public.eu_skola_countries co ON co.id = ci.country_id
    WHERE co.slug = coalesce(NEW.country_slug, 'sweden')
    LIMIT 1;

    IF NEW.city_id IS NULL THEN
      SELECT id INTO NEW.city_id FROM public.eu_skola_cities WHERE slug = 'vasteras';
    END IF;
  END IF;

  SELECT 'EU-' || co.code || '-' || ci.code INTO prefix
  FROM public.eu_skola_cities ci
  JOIN public.eu_skola_countries co ON co.id = ci.country_id
  WHERE ci.id = NEW.city_id;

  IF prefix IS NULL THEN prefix := 'EU-SWE-VAST'; END IF;

  IF NEW.registration_type = 'school' AND (NEW.form_type IS NULL OR NEW.form_type != 'hackathon') THEN
    IF locked AND OLD.school_code IS NOT NULL
       AND (NEW.school_code IS DISTINCT FROM OLD.school_code OR NEW.city_id IS DISTINCT FROM OLD.city_id) THEN
      RAISE EXCEPTION 'School code is locked once the registration is confirmed';
    END IF;

    IF NEW.school_code IS NULL OR btrim(NEW.school_code) = '' THEN
      NEW.school_code := public.eu_skola_school_code(NEW.city_id, NEW.school_name, NEW.id);
    ELSE
      NEW.school_code := public.eu_skola_fold(NEW.school_code);
    END IF;

    NEW.public_id := prefix || '-' || NEW.school_code;
  ELSIF NEW.public_id IS NULL THEN
    -- Kind determination: HACK for hackathons, GROU for squads, INDV for individual
    IF NEW.form_type = 'hackathon' OR NEW.category_id = 'young-innovators-hackathon' THEN
      v_kind := 'HACK';
    ELSIF coalesce(btrim(NEW.team_name), '') <> '' THEN
      v_kind := 'GROU';
    ELSE
      v_kind := 'INDV';
    END IF;

    INSERT INTO public.eu_skola_id_counters AS c (city_id, kind, last_value)
    VALUES (NEW.city_id, v_kind, 1)
    ON CONFLICT (city_id, kind) DO UPDATE SET last_value = c.last_value + 1
    RETURNING c.last_value INTO next_n;

    NEW.public_id := prefix || '-' || v_kind || '-' || lpad(next_n::text, greatest(3, length(next_n::text)), '0');
  END IF;

  IF NEW.confirmation_code IS NULL THEN
    NEW.confirmation_code := NEW.public_id;
  END IF;

  IF NEW.status = 'confirmed' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'confirmed') THEN
    NEW.confirmed_at := now();
  END IF;

  RETURN NEW;
END $$;
