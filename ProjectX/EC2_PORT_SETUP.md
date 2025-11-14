# EC2 Port 3000 Setup Guide

## Problem
Frontend on Vercel (HTTPS) cannot connect to backend on EC2 port 3000 (HTTP).

## Solution: Open Port 3000 in AWS Security Group

### Step 1: Open Port 3000 in AWS Console

1. Go to AWS Console → EC2 → Instances
2. Click on your instance (ip-172-31-5-115)
3. Scroll down to "Security" tab
4. Click on the Security Group link (e.g., sg-xxxxx)
5. Click "Edit inbound rules"
6. Click "Add rule"
7. Configure:
   - Type: Custom TCP
   - Port range: 3000
   - Source: 0.0.0.0/0 (Anywhere IPv4)
   - Description: Backend API
8. Click "Save rules"

### Step 2: Test Backend Accessibility

From your local machine, test if the backend is accessible:

```bash
# Test health endpoint
curl http://neuralcampus.com:3000/health

# Should return: {"status":"ok","timestamp":"..."}
```

### Step 3: Update Vercel Environment Variables

1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add/Update these variables for ALL environments (Production, Preview, Development):
   - `VITE_API_URL` = `http://neuralcampus.com:3000`
   - `VITE_API_BASE_URL` = `http://neuralcampus.com:3000/api`
5. Go to Deployments tab
6. Click the three dots on the latest deployment
7. Click "Redeploy"

### Step 4: Alternative - Use Ubuntu Firewall (if needed)

If you're using UFW firewall on Ubuntu:

```bash
# Check if UFW is active
sudo ufw status

# If active, allow port 3000
sudo ufw allow 3000/tcp

# Verify
sudo ufw status
```

## Important Notes

### Mixed Content Warning
Modern browsers block HTTP requests from HTTPS pages. Your Vercel site uses HTTPS, but your backend uses HTTP.

**Temporary Solution:** 
- Use HTTP for testing (not recommended for production)
- Some browsers may still block it

**Proper Solution (Recommended):**
Set up Nginx with SSL on your EC2 server. This will:
- Provide HTTPS for your backend
- Act as a reverse proxy
- Handle SSL certificates with Let's Encrypt

Would you like me to create the Nginx + SSL setup?

## Quick Test Commands

```bash
# On EC2 - Check if server is listening
sudo netstat -tlnp | grep 3000

# From local machine - Test connection
curl -v http://neuralcampus.com:3000/health

# Check PM2 status
pm2 status
pm2 logs techgrantha-api --lines 20
```

## Troubleshooting

### If curl times out:
- Port 3000 is not open in AWS Security Group
- Firewall is blocking the port

### If you get "Connection refused":
- Backend is not running
- Backend is listening on wrong interface

### If frontend still shows "Failed to fetch":
- Vercel environment variables not updated
- Need to redeploy Vercel after updating env vars
- Browser blocking mixed content (HTTPS → HTTP)
