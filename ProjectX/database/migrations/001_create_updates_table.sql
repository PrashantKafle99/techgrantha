-- Create updates table
CREATE TABLE IF NOT EXISTS public.updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_updates_created_at ON public.updates(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.updates ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Updates are viewable by everyone" ON public.updates
    FOR SELECT USING (true);

-- Create policy for authenticated insert/update/delete
CREATE POLICY "Updates are insertable by authenticated users" ON public.updates
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Updates are updatable by authenticated users" ON public.updates
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Updates are deletable by authenticated users" ON public.updates
    FOR DELETE USING (auth.role() = 'authenticated');