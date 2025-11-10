# Run Migration 008 - Setup Articles RLS Policies

## What This Migration Does

This migration sets up Row-Level Security (RLS) policies for the articles table to allow:
- ✅ Public users to read published articles
- ✅ Your backend (service role) to create/update/delete articles
- ✅ Authenticated admins to manage all articles

## Steps to Run:

### Go to Supabase Dashboard

1. Navigate to: https://supabase.com/dashboard
2. Select your project
3. Click "SQL Editor" in the left sidebar
4. Click "New Query"

### Run the Migration

1. Open `database/migrations/008_setup_articles_rls.sql`
2. Copy ALL the SQL code
3. Paste it into the SQL Editor
4. Click "Run" (or press Ctrl+Enter)

### Verify Success

You should see a success message. The policies are now active!

## Test It

After running this migration, try creating an article again from your admin panel. It should work now!

## What Changed

- **RLS is enabled** on the articles table
- **3 policies created:**
  1. Public can read published articles
  2. Service role (your backend) has full access
  3. Authenticated users (admins) can manage all articles

## Troubleshooting

If you still get RLS errors:
1. Make sure you're using the correct Supabase URL and keys in your `.env`
2. Verify your backend is using the service role key (not anon key)
3. Check that the migration ran successfully without errors
