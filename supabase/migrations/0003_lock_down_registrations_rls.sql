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
create policy "Authenticated can view registrations"
  on registrations for select
  to authenticated
  using (true);

drop policy if exists "Authenticated can update registrations" on registrations;
create policy "Authenticated can update registrations"
  on registrations for update
  to authenticated
  using (true)
  with check (true);
