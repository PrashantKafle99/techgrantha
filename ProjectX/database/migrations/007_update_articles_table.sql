-- Update articles table to support new admin panel structure
-- This migration adds new columns and renames existing ones

-- Add new columns
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS excerpt TEXT,
ADD COLUMN IF NOT EXISTS image_public_id TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Rename columns to match new structure
-- Note: If you have existing data, you may want to copy it first
ALTER TABLE public.articles 
RENAME COLUMN body TO content;

ALTER TABLE public.articles 
RENAME COLUMN banner_url TO featured_image;

-- Make some columns nullable for flexibility
ALTER TABLE public.articles 
ALTER COLUMN featured_image DROP NOT NULL;

-- Update published_at to be nullable (for draft articles)
ALTER TABLE public.articles 
ALTER COLUMN published_at DROP DEFAULT,
ALTER COLUMN published_at DROP NOT NULL;

-- Create index for created_at
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON public.articles(created_at DESC);

-- Update the type column to be nullable (optional)
ALTER TABLE public.articles 
ALTER COLUMN type DROP NOT NULL;

COMMENT ON COLUMN public.articles.content IS 'Main article content (formerly body)';
COMMENT ON COLUMN public.articles.featured_image IS 'Cloudinary image URL (formerly banner_url)';
COMMENT ON COLUMN public.articles.image_public_id IS 'Cloudinary public ID for image management';
COMMENT ON COLUMN public.articles.excerpt IS 'Short description/summary of the article';
COMMENT ON COLUMN public.articles.published_at IS 'Publication timestamp (NULL for drafts)';
