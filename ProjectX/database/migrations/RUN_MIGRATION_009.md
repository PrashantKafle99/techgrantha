# Run Migration 009 - Update Updates Table RLS

## What This Migration Does

This migration updates the Row-Level Security (RLS) policies for the `updates` table to allow:
- ✅ Public users to read all updates
- ✅ Your backend (service role) to create/update/delete updates
- ✅ Authenticated admins to manage all updates

## Steps to Run:

### Go to Supabase Dashboard

1. Navigate to: https://supabase.com/dashboard
2. Select your project
3. Click "SQL Editor" in the left sidebar
4. Click "New Query"

### Run the Migration

1. Open `database/migrations/009_update_updates_rls.sql`
2. Copy ALL the SQL code
3. Paste it into the SQL Editor
4. Click "Run" (or press Ctrl+Enter)

### Verify Success

You should see a success message. The policies are now active!

## Test It

After running this migration:
1. Restart your backend server
2. Go to http://localhost:5173/admin/dashboard
3. Click "Daily Tech" → "Manage updates"
4. Try creating a new update

It should work now!

## What Changed

- **Old policies removed** (they were using auth.role() which doesn't work with service role)
- **3 new policies created:**
  1. Public can read all updates
  2. Service role (your backend) has full access
  3. Authenticated users (admins) can manage all updates

## Troubleshooting

If you still get RLS errors:
1. Make sure you're using the correct Supabase service role key in your `.env`
2. Verify the migration ran successfully without errors
3. Restart your backend server after running the migration
