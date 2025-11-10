# Cloudinary Setup Guide

This guide will help you set up Cloudinary for image uploads in your Tech Grantha application.

## What is Cloudinary?

Cloudinary is a cloud-based image and video management service. It provides:
- Image upload and storage
- Automatic image optimization
- Image transformations (resize, crop, etc.)
- CDN delivery for fast loading
- Free tier: 25 GB storage, 25 GB bandwidth/month

## Step 1: Create a Cloudinary Account

1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Sign up for a **FREE account** using:
   - Email address
   - Or sign up with Google/GitHub
3. Verify your email address
4. Complete the onboarding questionnaire (optional)

## Step 2: Get Your Cloudinary Credentials

After signing up, you'll be taken to the **Dashboard**. Here's where to find your credentials:

### Dashboard Location
Navigate to: **Dashboard** → **Account Details** (top right)

Or directly access: [https://console.cloudinary.com/console](https://console.cloudinary.com/console)

### Required Credentials

You'll see a section called **"Account Details"** or **"Product Environment Credentials"** with:

```
Cloud Name: your-cloud-name
API Key: 123456789012345
API Secret: abcdefghijklmnopqrstuvwxyz123
```

### What Each Credential Does:

1. **CLOUDINARY_CLOUD_NAME**
   - Your unique Cloudinary account identifier
   - Example: `tech-grantha` or `dxyz123abc`
   - Used in: Upload URLs and image delivery URLs

2. **CLOUDINARY_API_KEY**
   - Public identifier for API requests
   - Example: `123456789012345`
   - Used in: Server-side uploads

3. **CLOUDINARY_API_SECRET**
   - Secret key for authentication (keep this private!)
   - Example: `abcdefghijklmnopqrstuvwxyz123`
   - Used in: Server-side uploads for security

## Step 3: Add Credentials to .env File

Open your `backend/.env` file and add these lines:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Example .env File:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# JWT Configuration
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=tech-grantha
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123

# Server Configuration
PORT=3000
```

## Step 4: Configure Upload Settings (Optional)

### Set Upload Presets

1. Go to **Settings** → **Upload** in Cloudinary Dashboard
2. Scroll to **Upload presets**
3. Click **Add upload preset**
4. Configure:
   - **Preset name**: `tech-grantha-articles` (or any name)
   - **Signing Mode**: `Signed` (recommended for security)
   - **Folder**: `tech-grantha/articles` (organizes your images)
   - **Allowed formats**: `jpg, png, webp, gif`
   - **Max file size**: `10 MB` (adjust as needed)

### Set Transformations (Optional)

You can set default transformations for uploaded images:
- **Quality**: Auto (Cloudinary optimizes automatically)
- **Format**: Auto (serves WebP to supported browsers)
- **Max dimensions**: 1920x1080 (prevents huge uploads)

## Step 5: Verify Setup

### Test Your Credentials

Create a test file `backend/scripts/test-cloudinary.js`:

```javascript
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function testCloudinary() {
  try {
    console.log('Testing Cloudinary connection...');
    console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    
    // Test by fetching account details
    const result = await cloudinary.api.ping();
    console.log('✓ Cloudinary connection successful!');
    console.log('Status:', result.status);
    
  } catch (error) {
    console.error('✗ Cloudinary connection failed:', error.message);
  }
}

testCloudinary();
```

Run the test:
```bash
node scripts/test-cloudinary.js
```

## Step 6: Install Cloudinary SDK

Install the Cloudinary Node.js SDK:

```bash
cd backend
npm install cloudinary
```

## Common Issues & Solutions

### Issue 1: "Invalid API Key"
**Solution**: Double-check your API Key in the Cloudinary dashboard. Make sure there are no extra spaces in your .env file.

### Issue 2: "Cloud name not found"
**Solution**: Verify your cloud name is correct. It's case-sensitive and should not include spaces.

### Issue 3: "Unauthorized"
**Solution**: Check your API Secret. Make sure it's copied correctly without any trailing spaces.

### Issue 4: "Upload preset not found"
**Solution**: If using upload presets, make sure the preset name matches exactly what you created in the dashboard.

## Security Best Practices

1. **Never commit .env file**
   - Add `.env` to your `.gitignore`
   - Use environment variables in production

2. **Use signed uploads**
   - Always use signed uploads for production
   - This prevents unauthorized uploads

3. **Set upload restrictions**
   - Limit file sizes (e.g., 10 MB max)
   - Restrict file types (jpg, png, webp only)
   - Set rate limits if needed

4. **Use folders**
   - Organize uploads in folders: `tech-grantha/articles`, `tech-grantha/daily-tech`
   - Makes management easier

## Cloudinary Dashboard Features

### Useful Dashboard Sections:

1. **Media Library** (`/console/media_library`)
   - View all uploaded images
   - Search, filter, and organize
   - Delete unwanted images

2. **Transformations** (`/console/transformations`)
   - Create reusable image transformations
   - Example: thumbnails, banners, etc.

3. **Usage** (`/console/usage`)
   - Monitor your storage and bandwidth
   - Track API requests
   - Check if you're approaching limits

4. **Settings** (`/console/settings`)
   - Configure upload presets
   - Set security options
   - Manage API keys

## Free Tier Limits

Cloudinary's free tier includes:
- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25,000/month
- **API Requests**: Unlimited

This is more than enough for most small to medium applications!

## Next Steps

After setup:
1. ✅ Create Cloudinary account
2. ✅ Get credentials from dashboard
3. ✅ Add to .env file
4. ✅ Install cloudinary package
5. ✅ Test connection
6. ➡️ Implement image upload in your application

## Support

- **Documentation**: [https://cloudinary.com/documentation](https://cloudinary.com/documentation)
- **Node.js SDK**: [https://cloudinary.com/documentation/node_integration](https://cloudinary.com/documentation/node_integration)
- **Support**: [https://support.cloudinary.com](https://support.cloudinary.com)

---

**Ready to implement?** Once you have your credentials in the .env file, you can start implementing image uploads in your admin panel!
