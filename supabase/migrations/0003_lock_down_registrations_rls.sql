-- RoboKidovation Västerås: close the public PII leak on `registrations`
-- Run once against the project database. Idempotent (safe to re-run).
--
-- Found live on the project: a SELECT policy and an UPDATE policy on
-- `registrations` both granted to `anon` (unauthenticated) with no
-- restriction, meaning anyone holding the public anon key (shipped in the
-- site's JS bundle) could read every registrant's name/email/phone and
-- could self-approve any registration by editing `status` directly,
-- bypassing the admin tick-button. The admin tool authenticates via
-- Supabase Auth, so these are scoped to `authenticated` only. Public
-- registration submission (INSERT for `anon`) is untouched.

drop policy if exists "Anyone can view registrations" on registrations;
drop policy if exists "Authenticated can view registrations" on registrations;
drop policy if exists "Authenticated can update registrations" on registrations;

-- Superseded: SELECT/UPDATE/DELETE are now admin/super_admin only, owned by
-- the INIAC repo's 20260926130000_eu_skola_registrations.sql ("Admins can …"
-- policies). This file only removes the old permissive policies so re-running
-- the migration chain can never re-open registrant PII to every signed-in user.
