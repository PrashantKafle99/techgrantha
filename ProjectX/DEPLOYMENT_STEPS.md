# Complete Deployment Guide - Tech Grantha

## Current Status
- ✅ Frontend deployed on Vercel
- ✅ Database on Supabase
- ⏳ Backend needs deployment

## Step-by-Step Deployment

### Step 1: Deploy Backend on Railway (Recommended)

#### 1.1 Create Railway Account
1. Go to https://railway.app
2. Click "Login" → Sign in with GitHub
3. Authorize Railway to access your repositories

#### 1.2 Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `techgrantha` repository
4. Railway will scan your repo

#### 1.3 Configure Backend Service
1. Railway detects it's a monorepo
2. Click "Add variables" or go to Settings
3. Set **Root Directory**: `backend`
4. Set **Start Command**: `npm start`
5. Set **Build Command**: `npm install`

#### 1.4 Add Environment Variables
Click "Variables" tab and add:

```env
# Server
PORT=$PORT
NODE_ENV=production

# Supabase (copy from your backend/.env)
SUPABASE_URL=https://ocqwtspqrabmanzhxoaz.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_chars

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# CORS (your Vercel frontend URL)
FRONTEND_URL=https://your-app.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Important:** Replace all `your_*` values with actual credentials from your `backend/.env` file.

#### 1.5 Deploy
1. Click "Deploy"
2. Wait for build to complete (2-3 minutes)
3. Railway will give you a URL like: `https://techgrantha-production.up.railway.app`
4. **Copy this URL** - you'll need it for Step 2

#### 1.6 Test Backend
Open your Railway URL in browser:
```
https://your-railway-url.up.railway.app/health
```

You should see: `{"status":"ok"}`

### Step 2: Update Frontend Environment Variables

#### 2.1 Go to Vercel Dashboard
1. Open https://vercel.com/dashboard
2. Select your `techgrantha` project
3. Go to "Settings" → "Environment Variables"

#### 2.2 Update/Add Variables
Add or update these variables:

```env
VITE_API_URL=https://your-railway-url.up.railway.app
VITE_API_BASE_URL=https://your-railway-url.up.railway.app/api
```

**Replace** `your-railway-url.up.railway.app` with your actual Railway URL from Step 1.5

#### 2.3 Redeploy Frontend
1. Go to "Deployments" tab
2. Click "..." on latest deployment
3. Click "Redeploy"
4. Wait for deployment to complete

### Step 3: Update Backend CORS

#### 3.1 Get Your Vercel URL
Your Vercel URL is something like: `https://techgrantha.vercel.app`

#### 3.2 Update Railway Environment Variable
1. Go back to Railway dashboard
2. Click "Variables"
3. Update `FRONTEND_URL` to your Vercel URL:
   ```
   FRONTEND_URL=https://techgrantha.vercel.app
   ```
4. Railway will auto-redeploy

### Step 4: Test Everything

#### 4.1 Test Frontend
1. Open your Vercel URL: `https://techgrantha.vercel.app`
2. Check if articles load
3. Check if daily updates load

#### 4.2 Test Admin Login
1. Go to: `https://techgrantha.vercel.app/admin/login`
2. Login with:
   - Email: `admin@techgrantha.com`
   - Password: `Admin@123`
3. Check if dashboard loads
4. Try creating an article

#### 4.3 Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for any errors
4. API calls should go to your Railway URL

### Step 5: Update README (Optional)

Update your README.md with live URLs:

```markdown
## Live Demo

- **Website**: https://techgrantha.vercel.app
- **API**: https://techgrantha-production.up.railway.app
- **Admin Panel**: https://techgrantha.vercel.app/admin/login
```

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                         USER                            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              VERCEL (Frontend)                          │
│         https://techgrantha.vercel.app                  │
│                                                          │
│  - React App (Vite)                                     │
│  - Static Site Hosting                                  │
│  - Auto-deploys from GitHub                             │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ API Calls
                     ▼
┌─────────────────────────────────────────────────────────┐
│           RAILWAY (Backend API)                         │
│    https://techgrantha-production.up.railway.app        │
│                                                          │
│  - Express.js Server                                    │
│  - REST API Endpoints                                   │
│  - Authentication & Authorization                       │
│  - Image Upload (Cloudinary)                            │
│  - AI Image Generation (Gemini)                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Database Queries
                     ▼
┌─────────────────────────────────────────────────────────┐
│            SUPABASE (Database)                          │
│      https://ocqwtspqrabmanzhxoaz.supabase.co           │
│                                                          │
│  - PostgreSQL Database                                  │
│  - Row Level Security (RLS)                             │
│  - Real-time subscriptions                              │
│  - Authentication (not used, using JWT)                 │
└─────────────────────────────────────────────────────────┘
```

## Troubleshooting

### Frontend can't connect to backend

**Symptoms:**
- Articles don't load
- "Network Error" in console
- CORS errors

**Solutions:**
1. Check `VITE_API_URL` in Vercel environment variables
2. Check `FRONTEND_URL` in Railway environment variables
3. Make sure both URLs are correct (no trailing slashes)
4. Redeploy both frontend and backend

### Backend deployment fails

**Symptoms:**
- Railway build fails
- "Module not found" errors

**Solutions:**
1. Check `package.json` exists in `backend/` folder
2. Verify Root Directory is set to `backend` in Railway
3. Check Railway logs for specific errors
4. Make sure all dependencies are in `package.json`

### Database connection fails

**Symptoms:**
- "Connection refused" errors
- "Invalid credentials" errors

**Solutions:**
1. Verify Supabase credentials in Railway environment variables
2. Check Supabase project is active
3. Verify service role key has proper permissions
4. Check Supabase logs for connection attempts

### Admin login doesn't work

**Symptoms:**
- "Invalid credentials" error
- Can't access admin panel

**Solutions:**
1. Make sure you ran database migrations
2. Check if admin user exists in Supabase
3. Verify JWT_SECRET is set in Railway
4. Try resetting admin password using backend script

## Cost Breakdown

### Free Tier (Recommended for Starting)
- **Vercel**: Free (Hobby plan)
- **Railway**: $5 credit/month (enough for small traffic)
- **Supabase**: Free (500MB database, 2GB bandwidth)
- **Cloudinary**: Free (25GB storage, 25GB bandwidth)
- **Gemini API**: Free tier available

**Total**: $0-5/month

### Paid Tier (For Production)
- **Vercel**: $20/month (Pro plan)
- **Railway**: ~$10-20/month (based on usage)
- **Supabase**: $25/month (Pro plan)
- **Cloudinary**: $0-89/month (based on usage)
- **Gemini API**: Pay as you go

**Total**: $55-150/month

## Next Steps After Deployment

1. ✅ Set up custom domain (optional)
2. ✅ Configure SSL certificates (automatic on Vercel/Railway)
3. ✅ Set up monitoring (Railway has built-in metrics)
4. ✅ Configure backups (Supabase has automatic backups)
5. ✅ Set up error tracking (Sentry, LogRocket)
6. ✅ Add analytics (Google Analytics, Plausible)

## Support

If you encounter issues:
1. Check Railway logs: Dashboard → Deployments → View Logs
2. Check Vercel logs: Dashboard → Deployments → View Function Logs
3. Check browser console for frontend errors
4. Check Supabase logs for database errors

---

**You're all set! Your app is now live! 🚀**
