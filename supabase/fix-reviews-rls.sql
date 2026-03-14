-- Fix #4: Prevent users from self-approving reviews via RLS UPDATE policy.
--
-- The previous UPDATE policy had USING (auth.uid() = user_id) but no WITH CHECK,
-- allowing any authenticated user to update their review's status to 'approved'.
--
-- Run this in the Supabase dashboard: SQL Editor > New query

-- Drop the existing permissive update policy
DROP POLICY IF EXISTS "Users can update own reviews" ON public.reviews;

-- Re-create it with a WITH CHECK that:
--   1. Prevents changing user_id to another user's ID
--   2. Prevents promoting status out of 'pending' (only admins via service role can change status)
CREATE POLICY "Users can update own reviews" ON public.reviews
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'pending'
  );
