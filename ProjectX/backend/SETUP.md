# Backend Setup Guide

## Prerequisites
- Node.js installed
- Supabase project created
- Database migrations run (including 005_add_admin_roles.sql)
- Admin user seeded in database

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

## Step 2: Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
# Supabase Configuration (Service Role)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Cloudinary Configuration (if using image upload)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# JWT Configuration
JWT_SECRET=your_very_long_random_secret_key_at_least_32_characters
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### How to Get Your Supabase Credentials:

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings → API
4. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

### Generate JWT Secret:

You can generate a secure random string using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or use an online generator: https://randomkeygen.com/

## Step 3: Update Admin Password Hash

The seeded admin user has a placeholder password hash. You need to generate a proper hash:

1. Run the password utility test to generate a hash:

```bash
node scripts/test-password-util.js
```

2. Copy the generated hash for "Admin@123"

3. Update the database:

```sql
-- In Supabase SQL Editor
UPDATE admin_users 
SET password_hash = '$2b$10$YOUR_GENERATED_HASH_HERE'
WHERE email = 'admin@techgrantha.com';
```

Or use a proper hash from the test output.

## Step 4: Start the Server

```bash
npm run dev
```

You should see:
```
🚀 Server running on port 3000
📍 Health check: http://localhost:3000/health
🔐 Admin login: http://localhost:3000/api/admin/login
```

## Step 5: Test the Login Endpoint

### Option 1: Using the test script

```bash
node scripts/test-login.js
```

### Option 2: Using curl

```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@techgrantha.com","password":"Admin@123"}'
```

### Option 3: Using Postman or Thunder Client

- Method: POST
- URL: http://localhost:3000/api/admin/login
- Headers: Content-Type: application/json
- Body (JSON):
```json
{
  "email": "admin@techgrantha.com",
  "password": "Admin@123"
}
```

## Expected Response

### Success (200):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "admin@techgrantha.com",
    "role": "super_admin",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Error (401):
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

## Verify Login Logging

Check that login attempts are being logged:

```sql
-- In Supabase SQL Editor
SELECT * FROM admin_login_logs 
ORDER BY login_time DESC 
LIMIT 10;
```

You should see entries with:
- admin_user_id
- email
- login_time
- ip_address
- user_agent
- success (true/false)

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Check that your .env file exists
- Verify SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set

### Error: "JWT_SECRET environment variable is required"
- Add JWT_SECRET to your .env file
- Make sure it's at least 32 characters long

### Error: "Invalid credentials" (but password is correct)
- Check that the password hash in the database is correct
- Generate a new hash using the password utility
- Update the database with the correct hash

### Error: "Cannot connect to database"
- Verify your Supabase URL is correct
- Check that your service role key is valid
- Ensure your Supabase project is active

### Server won't start
- Check that port 3000 is not already in use
- Try changing PORT in .env to a different port
- Check for syntax errors in your code

## Next Steps

After the login endpoint is working:
1. ✅ Task 2.2 complete
2. ➡️ Move to Task 2.3: Implement GET /api/admin/verify endpoint
3. ➡️ Continue with remaining backend tasks
