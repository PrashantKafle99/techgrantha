-- Setup Row-Level Security policies for articles table
-- This allows the backend service role to manage articles

-- First, ensure RLS is enabled
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read access to published articles" ON public.articles;
DROP POLICY IF EXISTS "Allow service role full access to articles" ON public.articles;
DROP POLICY IF EXISTS "Allow authenticated users to manage articles" ON public.articles;

-- Policy 1: Allow anyone to read published articles
CREATE POLICY "Allow public read access to published articles"
ON public.articles
FOR SELECT
USING (published_at IS NOT NULL);

-- Policy 2: Allow service role (backend) full access
-- This is the key policy that allows your backend to insert/update/delete
CREATE POLICY "Allow service role full access to articles"
ON public.articles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Policy 3: Allow authenticated users (admins) to manage all articles
-- This allows authenticated users to create, read, update, and delete articles
CREATE POLICY "Allow authenticated users to manage articles"
ON public.articles
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Add helpful comments
COMMENT ON POLICY "Allow public read access to published articles" ON public.articles 
IS 'Public users can only read articles that have been published';

COMMENT ON POLICY "Allow service role full access to articles" ON public.articles 
IS 'Backend service role has full access to manage articles';

COMMENT ON POLICY "Allow authenticated users to manage articles" ON public.articles 
IS 'Authenticated users (admins) can create, read, update, and delete all articles';
