# Run Migration 011 - Add Image Source Field

## What This Does

Adds an `image_source` column to both `articles` and `updates` tables to store image credits/attribution.

## Steps to Run

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Migration**
   - Open `database/migrations/011_add_image_source.sql`
   - Copy the SQL code
   - Paste into SQL Editor
   - Click "Run" (or press Ctrl+Enter)

4. **Verify Success**
   - You should see "Success. No rows returned"
   - The columns are now added

## What Changed

- `articles` table: Added `image_source` column (TEXT, nullable)
- `updates` table: Added `image_source` column (TEXT, nullable)

## How to Use

### In Admin Panel:
1. Create or edit an article/update
2. Upload an image manually
3. Fill in "Image Source/Credit" field
4. Example: "Unsplash - John Doe" or "Stock photo - Adobe"

### On Frontend:
- Image credit appears below the banner image
- Format: "Image: [source]" in small italic text
- Only shows if image_source is provided

## Benefits

- ✅ Proper image attribution
- ✅ Copyright compliance
- ✅ Professional presentation
- ✅ Credit photographers/sources
