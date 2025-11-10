# Run Migration 012 - Create Analytics Tables

## What This Does

Creates tables to track visitor statistics and page views:
- `page_views` - Tracks every page visit
- `analytics_daily` - Daily aggregated statistics
- `article_views` - Tracks views per article

## Steps to Run

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Migration**
   - Open `database/migrations/012_create_analytics_tables.sql`
   - Copy ALL the SQL code
   - Paste into SQL Editor
   - Click "Run" (or press Ctrl+Enter)

4. **Verify Success**
   - You should see "Success. No rows returned"
   - Check Tables: page_views, analytics_daily, article_views should exist

## What You'll Get

### Visitor Analytics:
- ✅ Total page views
- ✅ Unique visitors count
- ✅ Article read statistics
- ✅ Page type breakdown (home, articles, daily tech)
- ✅ Real-time tracking

### Admin Dashboard Shows:
- Total Page Views (last 30 days)
- Unique Visitors
- Article Reads
- Home Page Views

### Privacy-Friendly:
- No personal data collected
- Anonymous visitor IDs
- Stored locally in browser
- GDPR compliant

## How It Works

1. **Automatic Tracking**: Every page visit is tracked automatically
2. **Anonymous IDs**: Each visitor gets a random ID (stored in localStorage)
3. **Real-time**: Data appears immediately in admin dashboard
4. **No Cookies**: Uses localStorage, not cookies

## After Migration

Restart your backend and frontend, then:
1. Visit your site pages (home, articles, daily tech)
2. Go to `/admin/dashboard`
3. See visitor statistics in the "Visitor Analytics" section!

The system will start tracking all visitors automatically. 📊
