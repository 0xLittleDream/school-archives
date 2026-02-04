-- Fix overly permissive INSERT policies
-- Drop and recreate with better restrictions

-- Fix photo_reactions INSERT policy
DROP POLICY IF EXISTS "Anyone can add reactions" ON public.photo_reactions;
CREATE POLICY "Authenticated users can add reactions"
  ON public.photo_reactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Fix photo_comments INSERT policy  
DROP POLICY IF EXISTS "Anyone can add comments" ON public.photo_comments;
CREATE POLICY "Authenticated users can add comments"
  ON public.photo_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);