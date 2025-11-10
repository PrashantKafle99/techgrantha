# Testing the Admin Login Endpoint

## Step 1: Restart the Server

Stop the current server (Ctrl+C) and restart:

```bash
npm run dev
```

You should see:
```
🚀 Server running on port 3000
📍 Health check: http://localhost:3000/health
🔐 Admin login: http://localhost:3000/api/admin/login
```

## Step 2: Test Routes are Working

### Test 1: Health Check (GET)
Open in browser or use curl:
```
http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Test 2: Admin Test Endpoint (GET)
Open in browser or use curl:
```
http://localhost:3000/api/admin/test
```

Expected response:
```json
{
  "success": true,
  "message": "Admin routes are working!",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Step 3: Test Login Endpoint (POST)

⚠️ **Important:** The login endpoint is POST only, so you cannot test it in a browser by just visiting the URL.

### Option 1: Using the Batch File (Windows)

Double-click or run:
```bash
test-login.bat
```

### Option 2: Using PowerShell

```powershell
$body = @{
    email = "admin@techgrantha.com"
    password = "certificate@123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/admin/login" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body
```

### Option 3: Using curl (if installed)

```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@techgrantha.com\",\"password\":\"certificate@123\"}"
```

### Option 4: Using Node.js Test Script

```bash
node scripts/test-login.js
```

### Option 5: Using Postman or Thunder Client (VS Code Extension)

1. Create a new POST request
2. URL: `http://localhost:3000/api/admin/login`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "email": "admin@techgrantha.com",
  "password": "certificate@123"
}
```
5. Send

## Expected Responses

### Success Response (200):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4LTEyMzQtMTIzNC0xMjM0LTEyMzQ1Njc4OTBhYiIsImVtYWlsIjoiYWRtaW5AdGVjaGdyYW50aGEuY29tIiwicm9sZSI6InN1cGVyX2FkbWluIiwiaWF0IjoxNzA1MzE0NjAwLCJleHAiOjE3MDU0MDEwMDAsImlzcyI6InRlY2gtZ3JhbnRoYSIsImF1ZCI6ImFkbWluLXBhbmVsIn0.example_signature",
  "user": {
    "id": "12345678-1234-1234-1234-1234567890ab",
    "email": "admin@techgrantha.com",
    "role": "super_admin",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Error Response - Invalid Credentials (401):
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

### Error Response - Missing Fields (400):
```json
{
  "success": false,
  "error": "Email and password are required"
}
```

### Error Response - Invalid Email Format (400):
```json
{
  "success": false,
  "error": "Invalid email format"
}
```

## Troubleshooting

### Issue: "Cannot destructure property 'email' of 'req.body' as it is undefined"

**Cause:** Express JSON middleware not working or request not sending JSON

**Solutions:**
1. Make sure you restarted the server after installing Express 4.x
2. Verify Content-Type header is set to `application/json`
3. Check that you're sending a POST request, not GET
4. Verify the request body is valid JSON

### Issue: "Route not found" when accessing in browser

**Cause:** Trying to access POST endpoint with GET request

**Solution:** Use one of the POST methods above (curl, Postman, test script, etc.)

### Issue: "Invalid credentials" with correct password

**Cause:** Password hash not updated in database

**Solution:** Run the SQL update:
```sql
UPDATE admin_users
SET password_hash = '$2b$10$NcSMWk8px8onEBwP6KVZaOkd1OvM3aTSesCbgWHF4k.XH6VBPVI7u'
WHERE email = 'admin@techgrantha.com';
```

### Issue: Server logs show "Login error"

**Cause:** Database connection issue or missing environment variables

**Solution:**
1. Check `.env` file has correct Supabase credentials
2. Verify Supabase project is active
3. Check server logs for specific error message

## Verify Login Logging

After successful login, check the database:

```sql
SELECT * FROM admin_login_logs 
ORDER BY login_time DESC 
LIMIT 5;
```

You should see entries with:
- admin_user_id (UUID)
- email
- login_time
- ip_address (::1 or ::ffff:127.0.0.1 for localhost)
- user_agent
- success (true)

## Next Steps

Once login is working:
1. ✅ Task 2.2 complete
2. ➡️ Move to Task 2.3: Implement GET /api/admin/verify endpoint
3. ➡️ Continue with remaining backend tasks
