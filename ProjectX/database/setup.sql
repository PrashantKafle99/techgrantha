-- Tech Insights Platform Database Setup
-- Run this script in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Run migrations
\i migrations/001_create_updates_table.sql
\i migrations/002_create_articles_table.sql
\i migrations/003_create_user_profiles_table.sql

-- Run seeds (optional - for development data)
\i seeds/001_seed_updates.sql
\i seeds/002_seed_articles.sql