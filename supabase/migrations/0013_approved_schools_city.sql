-- Migration 0013: expose the city on the public "Meet us @" view.
-- Same columns as 0011 with city_name appended (CREATE OR REPLACE VIEW only allows
-- adding columns at the end). Idempotent and safe to re-run.
CREATE OR REPLACE VIEW public.approved_schools AS
  SELECT DISTINCT r.school_name, r.preferred_date, r.workshop_slot, r.time_range, r.form_type, ci.name AS city_name
  FROM public.registrations r
  LEFT JOIN public.eu_skola_cities ci ON ci.id = r.city_id
  WHERE r.registration_type = 'school'
    AND r.status = 'confirmed'
    AND r.school_name IS NOT NULL
  ORDER BY r.school_name;

GRANT SELECT ON public.approved_schools TO anon, authenticated;
