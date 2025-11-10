-- Create analytics tables for tracking visitors and page views

-- Page views table
CREATE TABLE IF NOT EXISTS public.page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_type TEXT NOT NULL, -- 'home', 'article', 'daily-tech', 'article-detail'
    page_id TEXT, -- article ID if applicable
    visitor_id TEXT NOT NULL, -- Anonymous visitor identifier
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily analytics summary table
CREATE TABLE IF NOT EXISTS public.analytics_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL UNIQUE,
    total_visitors INTEGER DEFAULT 0,
    total_page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    article_views INTEGER DEFAULT 0,
    home_views INTEGER DEFAULT 0,
    daily_tech_views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Article views table (for tracking individual article popularity)
CREATE TABLE IF NOT EXISTS public.article_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL,
    view_count INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    last_viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(article_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_page_type ON public.page_views(page_type);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor_id ON public.page_views(visitor_id);
CREATE INDEX IF NOT EXISTS idx_analytics_daily_date ON public.analytics_daily(date DESC);
CREATE INDEX IF NOT EXISTS idx_article_views_article_id ON public.article_views(article_id);

-- Enable Row Level Security
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_views ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public insert to page_views" ON public.page_views;
DROP POLICY IF EXISTS "Allow service role full access to page_views" ON public.page_views;
DROP POLICY IF EXISTS "Allow authenticated read access to analytics_daily" ON public.analytics_daily;
DROP POLICY IF EXISTS "Allow service role full access to analytics_daily" ON public.analytics_daily;
DROP POLICY IF EXISTS "Allow authenticated read access to article_views" ON public.article_views;
DROP POLICY IF EXISTS "Allow service role full access to article_views" ON public.article_views;

-- RLS Policies for page_views (anyone can insert, only service role can read)
CREATE POLICY "Allow public insert to page_views"
ON public.page_views
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow service role full access to page_views"
ON public.page_views
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- RLS Policies for analytics_daily (read-only for authenticated, full for service role)
CREATE POLICY "Allow authenticated read access to analytics_daily"
ON public.analytics_daily
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow service role full access to analytics_daily"
ON public.analytics_daily
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- RLS Policies for article_views (read-only for authenticated, full for service role)
CREATE POLICY "Allow authenticated read access to article_views"
ON public.article_views
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow service role full access to article_views"
ON public.article_views
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Add helpful comments
COMMENT ON TABLE public.page_views IS 'Tracks individual page views with visitor information';
COMMENT ON TABLE public.analytics_daily IS 'Daily aggregated analytics data';
COMMENT ON TABLE public.article_views IS 'Tracks views per article for popularity metrics';
