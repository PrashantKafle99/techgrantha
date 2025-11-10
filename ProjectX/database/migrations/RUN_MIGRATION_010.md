# Run Migration 010 - Make Author Nullable

## What This Does

Makes the `author` column in the `articles` table nullable, allowing articles to be created without specifying an author.

## Steps to Run

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Migration**
   - Open `database/migrations/010_make_author_nullable.sql`
   - Copy the SQL code
   - Paste into SQL Editor
   - Click "Run" (or press Ctrl+Enter)

4. **Verify Success**
   - You should see "Success. No rows returned"
   - The author column is now nullable

## Test It

After running the migration:
1. Go to your admin panel
2. Create a new article
3. Leave the author field empty
4. Save the article
5. It should work without errors!

## What Changed

- `author` column: `NOT NULL` → `NULL` (nullable)
- Articles can now be created without an author
- Existing articles with authors remain unchanged
