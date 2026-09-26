-- RoboKidovation Västerås: show each confirmed school's booked date + slot
-- Run once against the project database. Idempotent (safe to re-run).
--
-- "Our Collaborators" now shows when each confirmed school is coming. Only the
-- school name and its booked date/slot are exposed — still no contact/PII.

drop view if exists approved_schools;
create view approved_schools as
  select distinct school_name, preferred_date, workshop_slot, time_range
  from registrations
  where registration_type = 'school'
    and status = 'confirmed'
    and school_name is not null
  order by school_name;

grant select on approved_schools to anon, authenticated;
