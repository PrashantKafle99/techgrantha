-- Add image_source column to articles and updates tables
-- This allows storing image credits/attribution

-- Add to articles table
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS image_source TEXT;

-- Add to updates table
ALTER TABLE public.updates 
ADD COLUMN IF NOT EXISTS image_source TEXT;

-- Add comments
COMMENT ON COLUMN public.articles.image_source 
IS 'Image source/credit/attribution (optional)';

COMMENT ON COLUMN public.updates.image_source 
IS 'Image source/credit/attribution (optional)';
