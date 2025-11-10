# Troubleshooting "Failed to Fetch" Error

## Problem
Admin login shows "Failed to fetch" error on Vercel deployment.

## Common Causes & Solutions

### 1. Environment Variables Not Set in Vercel

**Check:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify these exist:
   ```
   VITE_API_URL = https://techgrantha-production.up.railway.app
   VITE_API_BASE_URL = https://techgrantha-production.up.railway.app/api
   ```

**Fix:**
- Add missing variables
- Make sure there's NO trailing slash (/)
- Click "Save"
- Go to Deployments → Redeploy

### 2. CORS Not Configured in Backend

**Check:**
1. Go to Railway Dashboard → Your Backend → Variables
2. Verify `FRONTEND_URL` is set to your Vercel URL:
   ```
   FRONTEND_URL=https://techgrantha.vercel.app
   ```

**Fix:**
- Update `FRONTEND_URL` to match your exact Vercel URL
- Railway will auto-redeploy
- Wait 1-2 minutes

### 3. Backend Not Running

**Check:**
1. Open: `https://techgrantha-production.up.railway.app/health`
2. Should see: `{"status":"ok"}`

**Fix if not working:**
- Go to Railway Dashboard → Deployments
- Check logs for errors
- Common issues:
  - Missing environment variables
  - Port not set correctly (should be `PORT=$PORT`)
  - Build failed

### 4. Environment Variables Not Loaded After Deploy

**Symptom:** You added variables but still getting errors

**Fix:**
1. Vercel doesn't automatically reload env vars
2. You MUST redeploy after adding/changing variables
3. Go to Deployments → Click "..." → Redeploy

## Step-by-Step Debug Process

### Step 1: Test Backend Directly

Open these URLs in your browser:

1. **Health Check:**
   ```
   https://techgrantha-production.up.railway.app/health
   ```
   Expected: `{"status":"ok"}`

2. **Login Endpoint:**
   ```
   https://techgrantha-production.up.railway.app/api/admin/login
   ```
   Expected: `{"success":false,"error":"Email and password are required"}`

3. **Articles Endpoint:**
   ```
   https://techgrantha-production.up.railway.app/api/articles
   ```
   Expected: JSON array of articles

**If any of these fail:** Your backend has issues. Check Railway logs.

### Step 2: Check Browser Console

1. Open your Vercel site
2. Press F12 (DevTools)
3. Go to Console tab
4. Try to login
5. Look for errors

**Common errors:**

#### CORS Error:
```
Access to fetch at 'https://...' from origin 'https://...' 
has been blocked by CORS policy
```
**Fix:** Update `FRONTEND_URL` in Railway

#### Network Error:
```
Failed to fetch
net::ERR_NAME_NOT_RESOLVED
```
**Fix:** Check `VITE_API_URL` in Vercel

#### 404 Error:
```
GET https://techgrantha-production.up.railway.app/api/admin/login 404
```
**Fix:** Check backend routes are deployed correctly

### Step 3: Check Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Try to login
4. Look for the login request
5. Click on it to see details

**Check:**
- Request URL: Should be `https://techgrantha-production.up.railway.app/api/admin/login`
- Status Code: Should be 200 or 400 (not 404 or CORS error)
- Response: Should have JSON data

### Step 4: Verify Exact URLs

**Common mistakes:**

❌ Wrong:
```
VITE_API_URL=https://techgrantha-production.up.railway.app/
FRONTEND_URL=https://techgrantha.vercel.app/
```

✅ Correct:
```
VITE_API_URL=https://techgrantha-production.up.railway.app
FRONTEND_URL=https://techgrantha.vercel.app
```

**No trailing slashes!**

## Quick Checklist

- [ ] Backend health check works: `/health` returns `{"status":"ok"}`
- [ ] `VITE_API_URL` is set in Vercel (no trailing slash)
- [ ] `FRONTEND_URL` is set in Railway (no trailing slash)
- [ ] Vercel was redeployed after adding env vars
- [ ] Railway backend is running (check Deployments tab)
- [ ] Browser console shows no CORS errors
- [ ] Network tab shows requests going to correct URL

## Still Not Working?

### Check Railway Logs

1. Go to Railway Dashboard
2. Click your backend service
3. Go to Deployments tab
4. Click latest deployment
5. Click "View Logs"
6. Look for errors

### Check Vercel Logs

1. Go to Vercel Dashboard
2. Click your project
3. Go to Deployments tab
4. Click latest deployment
5. Click "View Function Logs"
6. Look for errors

### Test Locally

If everything fails, test locally to isolate the issue:

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
# Update .env.local to point to localhost
VITE_API_URL=http://localhost:3000
npm run dev
```

If it works locally but not on Vercel/Railway, it's a deployment configuration issue.

## Common Solutions Summary

| Error | Solution |
|-------|----------|
| "Failed to fetch" | Check VITE_API_URL in Vercel |
| CORS error | Update FRONTEND_URL in Railway |
| 404 on routes | Add vercel.json for SPA routing |
| Backend not responding | Check Railway deployment logs |
| Env vars not working | Redeploy after changing variables |

---

**Need more help?** Share the exact error from browser console!
