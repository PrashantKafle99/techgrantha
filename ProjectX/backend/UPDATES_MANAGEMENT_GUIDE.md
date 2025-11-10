# Daily Tech Updates Management Guide

## Overview

This guide explains how to manage Daily Tech Updates through the admin panel.

## Backend Setup

### 1. Run Database Migration

First, update the RLS policies for the updates table:

1. Go to Supabase Dashboard → SQL Editor
2. Open `database/migrations/009_update_updates_rls.sql`
3. Copy and run the SQL code
4. See `database/migrations/RUN_MIGRATION_009.md` for detailed instructions

### 2. Restart Backend Server

After running the migration, restart your backend:

```bash
cd backend
npm run dev
```

The backend now has these endpoints:

- `GET /api/updates` - Get all updates (public)
- `GET /api/updates/:id` - Get single update (public)
- `POST /api/updates` - Create update (requires auth)
- `PUT /api/updates/:id` - Update existing update (requires auth)
- `DELETE /api/updates/:id` - Delete update (requires auth)

## Frontend Admin Panel

### Access the Updates Management Page

1. Login to admin panel: http://localhost:5173/admin/login
2. Go to Dashboard
3. Click "Daily Tech" → "Manage updates"

Or directly: http://localhost:5173/admin/updates

### Create a New Update

1. Click "Create New Update" button
2. Fill in the form:
   - **Title** (required) - The update headline
   - **Summary** (required) - Brief description of the update
   - **Thumbnail Image** (required) - Upload an image
3. Click "Create"

### Edit an Update

1. Find the update in the list
2. Click "Edit" button
3. Modify the fields
4. Click "Update"

### Delete an Update

1. Find the update in the list
2. Click "Delete" button
3. Confirm deletion

## Database Structure

The `updates` table has these fields:

```sql
- id: UUID (auto-generated)
- title: TEXT (required)
- summary: TEXT (required)
- thumbnail_url: TEXT (required)
- created_at: TIMESTAMP (auto-generated)
```

## Image Upload

Updates use Cloudinary for image storage:
- Images are uploaded to the `tech-grantha/updates` folder
- Supported formats: JPEG, PNG, WebP, GIF
- Max size: 10MB
- Images are automatically optimized

## API Examples

### Create Update (cURL)

```bash
curl -X POST http://localhost:3000/api/updates \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New AI Breakthrough",
    "summary": "Researchers announce major advancement in AI technology",
    "thumbnail_url": "https://res.cloudinary.com/..."
  }'
```

### Get All Updates

```bash
curl http://localhost:3000/api/updates
```

### Update an Update

```bash
curl -X PUT http://localhost:3000/api/updates/UPDATE_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title"
  }'
```

### Delete an Update

```bash
curl -X DELETE http://localhost:3000/api/updates/UPDATE_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Troubleshooting

### "Failed to create update" Error

1. Check that migration 009 was run successfully
2. Verify you're using the service role key in `.env`
3. Restart the backend server
4. Check browser console for detailed errors

### Images Not Uploading

1. Verify Cloudinary credentials in `.env`
2. Check image size (must be under 10MB)
3. Ensure image format is supported
4. Check browser console for errors

### Updates Not Showing on Frontend

1. Check that updates have `created_at` timestamp
2. Verify the frontend is fetching from correct API endpoint
3. Check browser console for errors
4. Verify CORS is configured correctly

## Security

- All create/update/delete operations require authentication
- Only authenticated admins can manage updates
- Public users can only read updates
- Images are stored securely on Cloudinary
- Service role key should never be exposed to frontend

## Next Steps

- Updates are now manageable through the admin panel
- They automatically appear on the Daily Tech page
- No code changes needed to add/edit/delete updates
- All changes are reflected immediately on the frontend
