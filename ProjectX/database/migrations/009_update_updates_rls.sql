-- Update Row-Level Security policies for updates table
-- This allows the backend service role to manage updates

-- Drop existing policies
DROP POLICY IF EXISTS "Updates are viewable by everyone" ON public.updates;
DROP POLICY IF EXISTS "Updates are insertable by authenticated users" ON public.updates;
DROP POLICY IF EXISTS "Updates are updatable by authenticated users" ON public.updates;
DROP POLICY IF EXISTS "Updates are deletable by authenticated users" ON public.updates;

-- Policy 1: Allow anyone to read updates
CREATE POLICY "Allow public read access to updates"
ON public.updates
FOR SELECT
USING (true);

-- Policy 2: Allow service role (backend) full access
CREATE POLICY "Allow service role full access to updates"
ON public.updates
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Policy 3: Allow authenticated users (admins) to manage all updates
CREATE POLICY "Allow authenticated users to manage updates"
ON public.updates
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Add helpful comments
COMMENT ON POLICY "Allow public read access to updates" ON public.updates 
IS 'Public users can read all updates';

COMMENT ON POLICY "Allow service role full access to updates" ON public.updates 
IS 'Backend service role has full access to manage updates';

COMMENT ON POLICY "Allow authenticated users to manage updates" ON public.updates 
IS 'Authenticated users (admins) can create, read, update, and delete all updates';
