-- RoboKidovation Västerås: admin-approval status + safe public read views
-- Run once against the project database. Idempotent (safe to re-run).

-- RegisterModal.tsx already writes these columns on insert; this keeps the
-- schema-as-code in sync with what's live and adds the admin-approval
-- status column (flipped to 'approved' by the admin tick-button).
alter table registrations add column if not exists status text not null default 'pending';
alter table registrations add column if not exists preferred_date text;
alter table registrations add column if not exists date_range_start text;
alter table registrations add column if not exists date_range_end text;
alter table registrations add column if not exists workshop_slot text;
alter table registrations add column if not exists time_range text;
alter table registrations add column if not exists grade_group text;
alter table registrations add column if not exists consent_agreed boolean not null default false;

-- Public "Our Collaborators" marquee: only the school name of registrations
-- an admin has approved. No contact/PII columns are ever exposed.
create or replace view approved_schools as
  select distinct school_name
  from registrations
  where registration_type = 'school'
    and status = 'approved'
    and school_name is not null
  order by school_name;

-- Public "N schools / N students registered" counters. Aggregates only
-- approved registrations and only ever returns totals, never row data.
create or replace view registration_stats as
  select
    count(distinct school_name) filter (
      where registration_type = 'school' and school_name is not null
    ) as schools_count,
    coalesce(sum(
      nullif(regexp_replace(student_count, '[^0-9]', '', 'g'), '')::int
    ), 0) as students_count
  from registrations
  where status = 'approved';

grant select on approved_schools to anon, authenticated;
grant select on registration_stats to anon, authenticated;
