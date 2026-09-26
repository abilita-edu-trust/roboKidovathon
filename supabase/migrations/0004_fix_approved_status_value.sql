-- RoboKidovation Västerås: fix status value used by public views
-- Run once against the project database. Idempotent (safe to re-run).
--
-- The admin dashboard (SSRL) actually writes status = 'confirmed' when an
-- admin approves a registration, not 'approved'. The views from migration
-- 0002 filtered on 'approved', so they never matched anything live.

create or replace view approved_schools as
  select distinct school_name
  from registrations
  where registration_type = 'school'
    and status = 'confirmed'
    and school_name is not null
  order by school_name;

create or replace view registration_stats as
  select
    count(distinct school_name) filter (
      where registration_type = 'school' and school_name is not null
    ) as schools_count,
    coalesce(sum(
      nullif(regexp_replace(student_count, '[^0-9]', '', 'g'), '')::int
    ), 0) as students_count
  from registrations
  where status = 'confirmed';
