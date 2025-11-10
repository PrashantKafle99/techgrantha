-- Create articles table
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    type TEXT CHECK (type IN ('article', 'case-study')) NOT NULL,
    banner_url TEXT NOT NULL,
    author TEXT NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_type ON public.articles(type);

-- Enable Row Level Security (RLS)
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Articles are viewable by everyone" ON public.articles
    FOR SELECT USING (true);

-- Create policy for authenticated insert/update/delete
CREATE POLICY "Articles are insertable by authenticated users" ON public.articles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Articles are updatable by authenticated users" ON public.articles
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Articles are deletable by authenticated users" ON public.articles
    FOR DELETE USING (auth.role() = 'authenticated');