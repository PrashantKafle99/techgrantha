# Nginx + SSL Setup for EC2 Backend

This guide will set up Nginx as a reverse proxy with free SSL certificates from Let's Encrypt.

## What This Does

- Your backend will be accessible at: `https://api.neuralcampus.com` (or `https://neuralcampus.com`)
- Nginx handles SSL/HTTPS
- Nginx forwards requests to your Node.js backend on port 3000
- Automatic SSL certificate renewal

## Prerequisites

- Domain: neuralcampus.com pointing to your EC2 IP
- EC2 ports 80 and 443 open in Security Group

## Step 1: Open Ports in AWS Security Group

1. Go to AWS Console → EC2 → Security Groups
2. Select your instance's security group
3. Edit inbound rules and add:
   - Type: HTTP, Port: 80, Source: 0.0.0.0/0
   - Type: HTTPS, Port: 443, Source: 0.0.0.0/0
   - Type: Custom TCP, Port: 3000, Source: 127.0.0.1/32 (localhost only - for security)

## Step 2: Install Nginx

```bash
# Update system
sudo apt update

# Install Nginx
sudo apt install nginx -y

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

## Step 3: Install Certbot (Let's Encrypt)

```bash
# Install Certbot and Nginx plugin
sudo apt install certbot python3-certbot-nginx -y
```

## Step 4: Configure Nginx for Your Backend

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/techgrantha
```

Paste this configuration:

```nginx
server {
    listen 80;
    server_name neuralcampus.com www.neuralcampus.com;

    # Redirect all HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name neuralcampus.com www.neuralcampus.com;

    # SSL certificates (will be added by Certbot)
    # ssl_certificate /etc/letsencrypt/live/neuralcampus.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/neuralcampus.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Logs
    access_log /var/log/nginx/techgrantha-access.log;
    error_log /var/log/nginx/techgrantha-error.log;

    # Increase body size for image uploads
    client_max_body_size 10M;

    # Proxy settings
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

Save and exit (Ctrl+X, Y, Enter)

## Step 5: Enable the Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/techgrantha /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## Step 6: Get SSL Certificate

```bash
# Get SSL certificate from Let's Encrypt
sudo certbot --nginx -d neuralcampus.com -d www.neuralcampus.com

# Follow the prompts:
# - Enter your email
# - Agree to terms
# - Choose whether to redirect HTTP to HTTPS (recommended: Yes)
```

Certbot will automatically:
- Get the SSL certificate
- Update your Nginx config
- Set up auto-renewal

## Step 7: Test Auto-Renewal

```bash
# Test certificate renewal (dry run)
sudo certbot renew --dry-run
```

## Step 8: Update Backend Environment

Your backend `.env` should now use:

```bash
FRONTEND_URL=https://techgranthatest.vercel.app
NODE_ENV=production
```

Restart your backend:

```bash
pm2 restart techgrantha-api
```

## Step 9: Update Frontend Environment on Vercel

Update Vercel environment variables to:

```
VITE_API_URL=https://neuralcampus.com
VITE_API_BASE_URL=https://neuralcampus.com/api
```

Then redeploy on Vercel.

## Step 10: Test Everything

```bash
# Test SSL certificate
curl https://neuralcampus.com/health

# Should return: {"status":"ok","timestamp":"..."}

# Test from browser
# Visit: https://neuralcampus.com/health
```

## Verification Checklist

- [ ] Nginx is running: `sudo systemctl status nginx`
- [ ] Backend is running: `pm2 status`
- [ ] SSL certificate is valid: `sudo certbot certificates`
- [ ] Health endpoint works: `curl https://neuralcampus.com/health`
- [ ] HTTPS redirect works: `curl http://neuralcampus.com/health` (should redirect)
- [ ] Frontend can connect to backend

## Troubleshooting

### Nginx won't start
```bash
# Check error logs
sudo tail -f /var/log/nginx/error.log

# Check configuration
sudo nginx -t
```

### SSL certificate fails
```bash
# Make sure domain points to your EC2 IP
nslookup neuralcampus.com

# Make sure ports 80 and 443 are open
sudo ufw status
```

### Backend not responding
```bash
# Check if backend is running
pm2 logs techgrantha-api

# Check if port 3000 is listening
sudo netstat -tlnp | grep 3000
```

### CORS errors
Make sure your backend `.env` has:
```
FRONTEND_URL=https://techgranthatest.vercel.app
```

## Useful Commands

```bash
# Restart Nginx
sudo systemctl restart nginx

# Reload Nginx (no downtime)
sudo systemctl reload nginx

# Check Nginx status
sudo systemctl status nginx

# View Nginx logs
sudo tail -f /var/log/nginx/techgrantha-error.log
sudo tail -f /var/log/nginx/techgrantha-access.log

# Renew SSL certificate manually
sudo certbot renew

# Check SSL certificate info
sudo certbot certificates
```

## Security Notes

1. Port 3000 should only be accessible from localhost (127.0.0.1)
2. All traffic goes through Nginx on ports 80/443
3. SSL certificates auto-renew every 60 days
4. Keep your system updated: `sudo apt update && sudo apt upgrade`

## Next Steps After Setup

1. Update frontend environment variables on Vercel
2. Redeploy frontend
3. Test all API endpoints
4. Monitor logs for any issues

Your backend will now be accessible at:
- `https://neuralcampus.com/health`
- `https://neuralcampus.com/api/admin/login`
- `https://neuralcampus.com/api/articles`
- etc.
