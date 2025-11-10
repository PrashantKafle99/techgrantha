-- Database Verification Script
-- Run this to verify your database setup is correct

-- Check if tables exist
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('updates', 'articles', 'user_profiles')
ORDER BY table_name;

-- Check table structures
\d public.updates
\d public.articles
\d public.user_profiles

-- Check indexes
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('updates', 'articles', 'user_profiles')
ORDER BY tablename, indexname;

-- Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check sample data counts
SELECT 'updates' as table_name, COUNT(*) as record_count FROM public.updates
UNION ALL
SELECT 'articles' as table_name, COUNT(*) as record_count FROM public.articles
UNION ALL
SELECT 'user_profiles' as table_name, COUNT(*) as record_count FROM public.user_profiles;

-- Test basic queries
SELECT 
    'Latest Update' as test,
    title,
    created_at
FROM public.updates 
ORDER BY created_at DESC 
LIMIT 1;

SELECT 
    'Latest Article' as test,
    title,
    type,
    author,
    published_at
FROM public.articles 
ORDER BY published_at DESC 
LIMIT 1;