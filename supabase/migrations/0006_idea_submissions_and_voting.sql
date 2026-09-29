-- Migration: Idea Submissions, Voting, and Multi-City Support
-- Idempotent and safe to run

-- 1. Ensure all eu_skola_cities have registrations_open = true so schools from Sweden, Denmark, Latvia, Estonia can register
UPDATE public.eu_skola_cities SET registrations_open = true;

-- 2. Idea Submissions Table
CREATE TABLE IF NOT EXISTS public.idea_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id TEXT NOT NULL UNIQUE,
  student_name TEXT NOT NULL,
  student_age INT,
  student_grade TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  school_name TEXT NOT NULL,
  school_id UUID REFERENCES public.registrations(id) ON DELETE SET NULL,
  country_slug TEXT NOT NULL DEFAULT 'sweden',
  city_slug TEXT NOT NULL DEFAULT 'vasteras',
  city_name TEXT,
  country_name TEXT,
  idea_title TEXT NOT NULL,
  idea_description TEXT,
  photo_url TEXT,
  voice_note_url TEXT,
  video_url TEXT,
  video_type TEXT CHECK (video_type IN ('file', 'link', 'none')),
  category TEXT DEFAULT 'Innovation',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  votes_count INT NOT NULL DEFAULT 0,
  consent_agreed BOOLEAN NOT NULL DEFAULT true,
  gdpr_agreed BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_idea_submissions_school_name ON public.idea_submissions(school_name);
CREATE INDEX IF NOT EXISTS idx_idea_submissions_school_id ON public.idea_submissions(school_id);
CREATE INDEX IF NOT EXISTS idx_idea_submissions_status ON public.idea_submissions(status);
CREATE INDEX IF NOT EXISTS idx_idea_submissions_votes ON public.idea_submissions(votes_count DESC);

-- 3. Idea Votes Table (tracks unique votes per voter_token per idea)
CREATE TABLE IF NOT EXISTS public.idea_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID NOT NULL REFERENCES public.idea_submissions(id) ON DELETE CASCADE,
  voter_token TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (idea_id, voter_token)
);

CREATE INDEX IF NOT EXISTS idx_idea_votes_idea_id ON public.idea_votes(idea_id);

-- 4. Enable RLS
ALTER TABLE public.idea_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_votes ENABLE ROW LEVEL SECURITY;

-- Policies for idea_submissions:
-- Public can submit new ideas
DROP POLICY IF EXISTS "Public can submit idea_submissions" ON public.idea_submissions;
CREATE POLICY "Public can submit idea_submissions"
  ON public.idea_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Public can view approved idea_submissions
DROP POLICY IF EXISTS "Public can read approved idea_submissions" ON public.idea_submissions;
CREATE POLICY "Public can read approved idea_submissions"
  ON public.idea_submissions FOR SELECT
  TO anon, authenticated
  USING (status = 'approved' OR auth.uid() IS NOT NULL);

-- Authenticated / Admin can manage all idea_submissions
DROP POLICY IF EXISTS "Admins can manage all idea_submissions" ON public.idea_submissions;
CREATE POLICY "Admins can manage all idea_submissions"
  ON public.idea_submissions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for idea_votes:
-- Public can cast a vote
DROP POLICY IF EXISTS "Public can insert votes" ON public.idea_votes;
CREATE POLICY "Public can insert votes"
  ON public.idea_votes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Public can read votes
DROP POLICY IF EXISTS "Public can read votes" ON public.idea_votes;
CREATE POLICY "Public can read votes"
  ON public.idea_votes FOR SELECT
  TO anon, authenticated
  USING (true);

-- 5. RPC to Vote for an Idea (Atomic Vote Cast)
CREATE OR REPLACE FUNCTION public.vote_for_idea(p_idea_id UUID, p_voter_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_inserted BOOLEAN := false;
  v_new_votes INT := 0;
BEGIN
  -- Attempt to insert vote
  BEGIN
    INSERT INTO public.idea_votes (idea_id, voter_token)
    VALUES (p_idea_id, p_voter_token);
    v_inserted := true;
  EXCEPTION WHEN unique_violation THEN
    -- Already voted
    v_inserted := false;
  END;

  IF v_inserted THEN
    -- Increment votes_count on idea_submissions
    UPDATE public.idea_submissions
    SET votes_count = votes_count + 1
    WHERE id = p_idea_id
    RETURNING votes_count INTO v_new_votes;

    RETURN jsonb_build_object('success', true, 'voted', true, 'votes_count', v_new_votes, 'message', 'Vote recorded successfully!');
  ELSE
    SELECT votes_count INTO v_new_votes FROM public.idea_submissions WHERE id = p_idea_id;
    RETURN jsonb_build_object('success', false, 'voted', false, 'already_voted', true, 'votes_count', v_new_votes, 'message', 'You have already voted for this idea.');
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.vote_for_idea(UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.vote_for_idea(UUID, TEXT) TO anon, authenticated;

-- 6. RPC to Submit an Idea
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
BEGIN
  -- Try to map to an existing registered school by matching school_name
  SELECT id INTO v_school_id
  FROM public.registrations
  WHERE registration_type = 'school'
    AND lower(school_name) = lower(v_school_name)
  LIMIT 1;

  -- Generate sequential readable public ID: VFI-IDEA-XXXX
  SELECT count(*) + 1 INTO v_seq FROM public.idea_submissions;
  v_public_id := 'VFI-IDEA-' || lpad(v_seq::text, 4, '0');

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
    coalesce(payload->>'country_slug', 'sweden'),
    coalesce(payload->>'city_slug', 'vasteras'),
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

-- 7. Ensure storage bucket for idea-media exists and has public read / anon upload
INSERT INTO storage.buckets (id, name, public)
VALUES ('idea-media', 'idea-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Bucket storage policies
DROP POLICY IF EXISTS "Public can view idea-media" ON storage.objects;
CREATE POLICY "Public can view idea-media"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'idea-media');

DROP POLICY IF EXISTS "Public can upload to idea-media" ON storage.objects;
CREATE POLICY "Public can upload to idea-media"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'idea-media');

-- 8. Add form_type and custom date/time columns to registrations if not present
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS form_type TEXT DEFAULT 'workshop';
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS country_slug TEXT DEFAULT 'sweden';
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS custom_time TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS custom_date DATE;
