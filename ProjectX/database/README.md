# Database Setup Guide

This directory contains the database schema and setup scripts for the Tech Insights Platform.

## Quick Setup

### Option 1: Minimal Setup (Recommended)

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `setup_minimal.sql`
4. Run the seed files for sample data:
   - Copy and paste `seeds/001_seed_updates.sql`
   - Copy and paste `seeds/002_seed_articles.sql`

### Option 2: Full Setup with User Profiles

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of each migration file in order:
   - `migrations/001_create_updates_table.sql`
   - `migrations/002_create_articles_table.sql`
   - `migrations/003_create_user_profiles_table_safe.sql` (safer version)
4. (Optional) Run the seed files for sample data:
   - `seeds/001_seed_updates.sql`
   - `seeds/002_seed_articles.sql`

### Option 2: Manual Setup via Supabase Dashboard

#### Step 1: Create Updates Table

```sql
-- Copy and paste from migrations/001_create_updates_table.sql
```

#### Step 2: Create Articles Table

```sql
-- Copy and paste from migrations/002_create_articles_table.sql
```

#### Step 3: Create User Profiles Table

```sql
-- Copy and paste from migrations/003_create_user_profiles_table.sql
```

## Database Schema

### Tables

#### `updates`

- `id` (UUID, Primary Key)
- `title` (TEXT, NOT NULL)
- `summary` (TEXT, NOT NULL)
- `thumbnail_url` (TEXT, NOT NULL)
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())

#### `articles`

- `id` (UUID, Primary Key)
- `title` (TEXT, NOT NULL)
- `body` (TEXT, NOT NULL)
- `type` (TEXT, CHECK: 'article' or 'case-study', NOT NULL)
- `banner_url` (TEXT, NOT NULL)
- `author` (TEXT, NOT NULL)
- `published_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())

#### `user_profiles`

- `id` (UUID, References auth.users(id), Primary Key)
- `role` (TEXT, DEFAULT 'user', CHECK: 'user' or 'admin')
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())
- `updated_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())

### Security

All tables have Row Level Security (RLS) enabled with the following policies:

#### Public Read Access

- All users can read `updates` and `articles`
- Users can only read their own `user_profiles`

#### Authenticated Write Access

- Only authenticated users can create, update, or delete `updates` and `articles`
- Users can only update their own `user_profiles`

### Indexes

Performance indexes are created on:

- `updates.created_at` (DESC)
- `articles.published_at` (DESC)
- `articles.type`

## Environment Variables

Make sure your `.env.local` file has the correct Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Verification

After running the setup, verify the tables exist by running:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('updates', 'articles', 'user_profiles');
```

You should see all three tables listed.

## Sample Data

The seed files provide sample data for development:

- 6 sample updates with realistic tech news
- 4 sample articles (2 articles, 2 case studies)

## Troubleshooting

### Common Issues

1. **Permission Denied**: Make sure you're using the service role key for admin operations
2. **Table Already Exists**: The scripts use `IF NOT EXISTS` so they're safe to re-run
3. **RLS Policies**: If you can't read data, check that RLS policies are correctly applied

### Reset Database

To start fresh, you can drop all tables:

```sql
DROP TABLE IF EXISTS public.user_profiles CASCADE;
DROP TABLE IF EXISTS public.articles CASCADE;
DROP TABLE IF EXISTS public.updates CASCADE;
```

Then re-run the migration scripts.
