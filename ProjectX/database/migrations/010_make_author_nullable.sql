-- Make author column nullable in articles table
-- This allows articles to be created without an author

ALTER TABLE public.articles 
ALTER COLUMN author DROP NOT NULL;

-- Add a comment explaining the change
COMMENT ON COLUMN public.articles.author 
IS 'Article author name (optional, can be NULL)';
