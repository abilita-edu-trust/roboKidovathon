-- Migration 0012: VFI volunteer registrations.
-- Public visitors submit through submit_vfi_volunteer (no direct table access).
-- Only admins / super admins (is_admin_or_super) can read or change rows, so
-- volunteer contact details — including guardians of under-18s — stay private.
-- Idempotent and safe to re-run.

CREATE SEQUENCE IF NOT EXISTS public.volunteer_public_id_seq;

CREATE TABLE IF NOT EXISTS public.volunteer_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  age_group TEXT NOT NULL CHECK (age_group IN ('under-18', '18-plus')),
  guardian_name TEXT,
  guardian_phone TEXT,
  country_slug TEXT NOT NULL DEFAULT 'sweden',
  city_slug TEXT NOT NULL DEFAULT 'vasteras',
  city_name TEXT,
  country_name TEXT,
  city_id UUID REFERENCES public.eu_skola_cities(id),
  events TEXT[] NOT NULL,
  roles TEXT[] NOT NULL,
  availability TEXT NOT NULL CHECK (availability IN ('full-day', 'morning', 'afternoon')),
  languages TEXT NOT NULL,
  experience TEXT NOT NULL,
  tshirt_size TEXT NOT NULL,
  consent_agreed BOOLEAN NOT NULL,
  gdpr_agreed BOOLEAN NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT volunteer_guardian_required CHECK (
    age_group = '18-plus' OR (nullif(btrim(guardian_name), '') IS NOT NULL AND nullif(btrim(guardian_phone), '') IS NOT NULL)
  ),
  CONSTRAINT volunteer_consent_required CHECK (consent_agreed AND gdpr_agreed),
  CONSTRAINT volunteer_choices_required CHECK (cardinality(events) > 0 AND cardinality(roles) > 0)
);

CREATE INDEX IF NOT EXISTS volunteer_registrations_city_idx ON public.volunteer_registrations (country_slug, city_slug);
CREATE INDEX IF NOT EXISTS volunteer_registrations_created_idx ON public.volunteer_registrations (created_at DESC);

ALTER TABLE public.volunteer_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage volunteer_registrations" ON public.volunteer_registrations;
CREATE POLICY "Admins manage volunteer_registrations"
  ON public.volunteer_registrations FOR ALL
  TO authenticated
  USING (public.is_admin_or_super(auth.uid()))
  WITH CHECK (public.is_admin_or_super(auth.uid()));

-- Public submit: EU-[COUNTRY]-[CITY]-VOL-XXXX
CREATE OR REPLACE FUNCTION public.submit_vfi_volunteer(payload JSONB)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_country_slug TEXT := coalesce(nullif(payload->>'country_slug', ''), 'sweden');
  v_city_slug TEXT := coalesce(nullif(payload->>'city_slug', ''), 'vasteras');
  v_country_code TEXT;
  v_city_code TEXT;
  v_city_id UUID;
  v_public_id TEXT;
BEGIN
  SELECT co.code, ci.code, ci.id INTO v_country_code, v_city_code, v_city_id
  FROM public.eu_skola_cities ci
  JOIN public.eu_skola_countries co ON co.id = ci.country_id
  WHERE co.slug = v_country_slug AND ci.slug = v_city_slug
  LIMIT 1;

  v_public_id := 'EU-' || coalesce(v_country_code, 'SWE') || '-' || coalesce(v_city_code, 'VAST')
    || '-VOL-' || lpad(nextval('public.volunteer_public_id_seq')::text, 4, '0');

  INSERT INTO public.volunteer_registrations (
    public_id, full_name, email, phone, age_group, guardian_name, guardian_phone,
    country_slug, city_slug, city_name, country_name, city_id,
    events, roles, availability, languages, experience, tshirt_size,
    consent_agreed, gdpr_agreed
  ) VALUES (
    v_public_id,
    btrim(payload->>'full_name'),
    btrim(payload->>'email'),
    btrim(payload->>'phone'),
    payload->>'age_group',
    nullif(btrim(payload->>'guardian_name'), ''),
    nullif(btrim(payload->>'guardian_phone'), ''),
    v_country_slug,
    v_city_slug,
    payload->>'city_name',
    payload->>'country_name',
    v_city_id,
    ARRAY(SELECT jsonb_array_elements_text(coalesce(payload->'events', '[]'::jsonb))),
    ARRAY(SELECT jsonb_array_elements_text(coalesce(payload->'roles', '[]'::jsonb))),
    payload->>'availability',
    btrim(payload->>'languages'),
    btrim(payload->>'experience'),
    payload->>'tshirt_size',
    coalesce((payload->>'consent_agreed')::boolean, false),
    coalesce((payload->>'gdpr_agreed')::boolean, false)
  );

  RETURN v_public_id;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_vfi_volunteer(JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_vfi_volunteer(JSONB) TO anon, authenticated;
