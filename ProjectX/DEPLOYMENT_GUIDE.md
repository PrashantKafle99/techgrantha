# Deployment Guide 🚀

Complete guide for deploying Tech Grantha to production.

## Pre-Deployment Checklist

### Security
- [ ] All `.env` files are in `.gitignore`
- [ ] No credentials in git history
- [ ] JWT_SECRET is strong and unique
- [ ] Admin passwords are changed from defaults
- [ ] CORS is configured for production domain
- [ ] Rate limiting is enabled

### Database
- [ ] All migrations are run successfully
- [ ] Database backups are configured
- [ ] Row Level Security (RLS) policies are active
- [ ] Admin user is created

### Environment Variables
- [ ] All required env vars are set
- [ ] API keys are valid and have proper permissions
- [ ] Production URLs are configured

## Deployment Options

### Option 1: Vercel (Frontend) + Railway/Render (Backend)

#### Frontend on Vercel

1. **Push to GitHub**
```bash
git push origin main
```

2. **Import to Vercel**
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Set root directory to `frontend`
- Add environment variables:
  ```
  VITE_API_URL=https://your-backend-url.com
  ```

3. **Deploy**
- Vercel will auto-deploy on every push to main

#### Backend on Railway

1. **Create Railway Project**
- Go to [railway.app](https://railway.app)
- Click "New Project" → "Deploy from GitHub repo"
- Select your repository

2. **Configure**
- Set root directory to `backend`
- Add all environment variables from `backend/.env.example`
- Set `PORT` to `$PORT` (Railway provides this)

3. **Deploy**
- Railway will auto-deploy

### Option 2: DigitalOcean App Platform

1. **Create App**
- Go to DigitalOcean App Platform
- Connect GitHub repository

2. **Configure Components**

**Frontend Component:**
- Type: Static Site
- Build Command: `cd frontend && npm install && npm run build`
- Output Directory: `frontend/dist`
- Environment Variables: `VITE_API_URL`

**Backend Component:**
- Type: Web Service
- Build Command: `cd backend && npm install`
- Run Command: `cd backend && npm start`
- Environment Variables: All from `backend/.env.example`

### Option 3: AWS (EC2 + S3 + CloudFront)

#### Backend on EC2

1. **Launch EC2 Instance**
```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone https://github.com/yourusername/tech-grantha.git
cd tech-grantha/backend

# Install dependencies
npm install

# Create .env file
nano .env
# (paste your environment variables)

# Start with PM2
pm2 start server.js --name tech-grantha-api
pm2 startup
pm2 save
```

2. **Configure Nginx**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Frontend on S3 + CloudFront

1. **Build Frontend**
```bash
cd frontend
npm install
npm run build
```

2. **Upload to S3**
```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

3. **Configure CloudFront**
- Create CloudFront distribution
- Point to S3 bucket
- Set default root object to `index.html`
- Configure error pages (404 → /index.html for SPA routing)

## Environment Variables Reference

### Backend (Production)

```env
# Server
PORT=3000
NODE_ENV=production

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# JWT
JWT_SECRET=your_super_secret_production_key_min_32_chars

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# CORS
FRONTEND_URL=https://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (Production)

```env
VITE_API_URL=https://api.yourdomain.com
```

## Post-Deployment Steps

### 1. Verify Deployment

```bash
# Test backend health
curl https://api.yourdomain.com/health

# Test frontend
curl https://yourdomain.com
```

### 2. Test Critical Flows

- [ ] User can view articles
- [ ] User can view daily updates
- [ ] Admin can login
- [ ] Admin can create articles
- [ ] Admin can upload images
- [ ] AI image generation works
- [ ] Analytics tracking works

### 3. Configure Domain

**Backend:**
- Point `api.yourdomain.com` to backend server
- Configure SSL certificate (Let's Encrypt)

**Frontend:**
- Point `yourdomain.com` to frontend hosting
- Configure SSL certificate

### 4. Setup Monitoring

**Backend Monitoring:**
- Setup error tracking (Sentry, LogRocket)
- Configure uptime monitoring (UptimeRobot, Pingdom)
- Setup log aggregation (Papertrail, Loggly)

**Frontend Monitoring:**
- Setup analytics (Google Analytics, Plausible)
- Configure error tracking (Sentry)
- Monitor Core Web Vitals

### 5. Database Backups

**Supabase:**
- Enable automatic backups in Supabase dashboard
- Setup point-in-time recovery
- Test restore procedure

### 6. Security Hardening

```bash
# Backend
- Enable HTTPS only
- Configure security headers
- Setup rate limiting
- Enable CORS for production domain only
- Rotate JWT secret regularly

# Database
- Review RLS policies
- Audit user permissions
- Enable audit logging
```

## Continuous Deployment

### GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: |
          # Railway CLI deployment
          npm install -g @railway/cli
          railway up

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          cd frontend
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## Rollback Procedure

### Quick Rollback

**Vercel:**
```bash
vercel rollback
```

**Railway:**
- Go to Railway dashboard
- Select previous deployment
- Click "Redeploy"

**Manual:**
```bash
# Checkout previous version
git checkout <previous-commit-hash>

# Redeploy
git push -f origin main
```

## Troubleshooting

### Backend Issues

**Server won't start:**
```bash
# Check logs
pm2 logs tech-grantha-api

# Check environment variables
pm2 env 0

# Restart
pm2 restart tech-grantha-api
```

**Database connection fails:**
- Verify Supabase credentials
- Check IP whitelist in Supabase
- Test connection manually

### Frontend Issues

**API calls failing:**
- Check CORS configuration
- Verify VITE_API_URL is correct
- Check browser console for errors

**Build fails:**
- Clear node_modules and reinstall
- Check for TypeScript errors
- Verify all dependencies are installed

## Performance Optimization

### Backend
- Enable gzip compression
- Setup Redis caching
- Optimize database queries
- Use CDN for static assets

### Frontend
- Enable code splitting
- Optimize images (WebP format)
- Lazy load components
- Enable service worker for PWA

## Cost Optimization

### Free Tier Options
- **Frontend**: Vercel (Free tier)
- **Backend**: Railway ($5/month) or Render (Free tier)
- **Database**: Supabase (Free tier - 500MB)
- **Images**: Cloudinary (Free tier - 25GB)
- **AI**: Gemini API (Free tier available)

### Estimated Monthly Costs
- **Minimal**: $0-5 (using free tiers)
- **Small Scale**: $20-50 (paid tiers, low traffic)
- **Medium Scale**: $100-200 (higher traffic, more resources)

## Support

For deployment issues:
1. Check logs first
2. Review environment variables
3. Test locally with production env vars
4. Open GitHub issue if needed

---

**Good luck with your deployment! 🚀**
