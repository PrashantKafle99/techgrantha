# Run Migration 007 - Update Articles Table

## Steps to Run This Migration:

### Option 1: Using Supabase Dashboard (Recommended)

1. **Go to your Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Paste the Migration**
   - Open `database/migrations/007_update_articles_table.sql`
   - Copy ALL the SQL code
   - Paste it into the SQL Editor

4. **Run the Migration**
   - Click "Run" button (or press Ctrl+Enter)
   - Wait for success message

5. **Verify the Changes**
   - Go to "Table Editor" → "articles"
   - Check that new columns exist:
     - `content` (renamed from `body`)
     - `featured_image` (renamed from `banner_url`)
     - `excerpt` (new)
     - `image_public_id` (new)
     - `created_at` (new)
     - `updated_at` (new)

### Option 2: Using Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db push
```

## What This Migration Does:

1. **Adds New Columns:**
   - `excerpt` - Short article description
   - `image_public_id` - Cloudinary public ID for image management
   - `created_at` - Article creation timestamp
   - `updated_at` - Last update timestamp

2. **Renames Columns:**
   - `body` → `content`
   - `banner_url` → `featured_image`

3. **Makes Columns Nullable:**
   - `featured_image` - Articles can exist without images
   - `published_at` - NULL means draft article
   - `type` - Optional article type

4. **Adds Indexes:**
   - Index on `created_at` for better query performance

## After Running Migration:

Your articles table will be compatible with the new admin panel!

You can now:
- ✅ Create articles with featured images
- ✅ Save drafts (unpublished articles)
- ✅ Add excerpts for article previews
- ✅ Track image public IDs for Cloudinary management
- ✅ Track creation and update times

## Troubleshooting:

### If you get "column already exists" errors:
- Some columns may already exist
- This is fine, the migration uses `IF NOT EXISTS` where possible

### If you have existing data:
- The migration preserves existing data
- `body` content will be moved to `content`
- `banner_url` will be moved to `featured_image`

### If migration fails:
- Check that you're connected to the correct database
- Ensure you have admin permissions
- Try running each ALTER TABLE statement one at a time

## Need Help?

If you encounter issues, you can:
1. Check Supabase logs in the dashboard
2. Run `SELECT * FROM articles LIMIT 1;` to see current structure
3. Contact support or check Supabase documentation
