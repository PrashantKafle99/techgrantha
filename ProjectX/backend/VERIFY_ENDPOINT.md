# Verify Endpoint Documentation

## Overview

The `/api/admin/verify` endpoint is used to verify JWT tokens and retrieve current user information. This is typically used by the frontend to check if a user is still authenticated and to get their current role and details.

## Endpoint Details

**URL:** `GET /api/admin/verify`

**Authentication:** Required (Bearer token)

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## Request Example

```bash
curl -X GET http://localhost:3000/api/admin/verify \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Response Examples

### Success (200)

```json
{
  "success": true,
  "user": {
    "id": "67e4262a-a847-48aa-8015-690fe6a5d40f",
    "email": "admin@techgrantha.com",
    "role": "super_admin",
    "createdAt": "2025-11-04T15:26:49.171206+00:00"
  }
}
```

### Error - Missing Token (401)

```json
{
  "success": false,
  "error": "Access token required"
}
```

### Error - Invalid Token (401)

```json
{
  "success": false,
  "error": "Invalid token",
  "code": "INVALID_TOKEN"
}
```

### Error - Expired Token (401)

```json
{
  "success": false,
  "error": "Token has expired",
  "code": "TOKEN_EXPIRED"
}
```

### Error - User Not Found (404)

```json
{
  "success": false,
  "error": "User not found"
}
```

## Testing

### Option 1: Using Node.js Test Script

```bash
node scripts/test-verify.js
```

This will:
1. Login to get a token
2. Test the verify endpoint with valid token
3. Test with missing token
4. Test with invalid token

### Option 2: Using PowerShell

```powershell
.\test-verify.ps1
```

### Option 3: Manual Testing with curl

First, get a token:
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@techgrantha.com","password":"certificate@123"}'
```

Copy the token from the response, then verify:
```bash
curl -X GET http://localhost:3000/api/admin/verify \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Option 4: Using Postman/Thunder Client

1. **Get Token:**
   - Method: POST
   - URL: http://localhost:3000/api/admin/login
   - Body: `{"email":"admin@techgrantha.com","password":"certificate@123"}`
   - Copy the token from response

2. **Verify Token:**
   - Method: GET
   - URL: http://localhost:3000/api/admin/verify
   - Headers: `Authorization: Bearer YOUR_TOKEN_HERE`

## Use Cases

### Frontend Authentication Check

The frontend can use this endpoint to:
1. Check if the stored token is still valid
2. Get current user information
3. Verify user role for conditional rendering
4. Refresh user data after updates

Example frontend usage:
```javascript
async function checkAuth() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return null;
  }
  
  try {
    const response = await fetch('/api/admin/verify', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.user;
    } else {
      // Token invalid or expired
      localStorage.removeItem('token');
      return null;
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    return null;
  }
}
```

### Protected Route Middleware

```javascript
async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.redirect('/admin/login');
  }
  
  // Verify token with backend
  const response = await fetch('/api/admin/verify', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (response.ok) {
    const data = await response.json();
    req.user = data.user;
    next();
  } else {
    res.redirect('/admin/login');
  }
}
```

## Security Notes

- Token is verified using JWT signature
- User data is fetched fresh from database
- Expired tokens are rejected with specific error code
- Invalid tokens are rejected with generic error message
- No sensitive information is exposed in error messages

## Related Endpoints

- `POST /api/admin/login` - Get initial token
- `POST /api/admin/logout` - Invalidate token (to be implemented)
- `POST /api/admin/refresh` - Refresh token (to be implemented)

## Middleware Used

- `authenticateToken` - Verifies JWT token and attaches user to request

## Database Queries

The endpoint queries the `admin_users` table to get fresh user data:
```sql
SELECT id, email, role, created_at
FROM admin_users
WHERE id = ?
```

This ensures that if a user's role or status changes in the database, the verify endpoint will return the updated information.
