# Tech Grantha Backend API

Backend API for the Tech Grantha admin panel with authentication and content management.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials and JWT secret
   ```

3. **Update admin password in database:**
   ```bash
   # Run this SQL in Supabase SQL Editor:
   UPDATE admin_users
   SET password_hash = '$2b$10$gte6Q7IP/AGs6jh.kKBzB.aJWsXUQjTz2HZH4sFQRR5bqD6MSbclC'
   WHERE email = 'admin@techgrantha.com';
   ```

4. **Start server:**
   ```bash
   npm run dev
   ```

5. **Test login:**
   ```bash
   node scripts/test-login.js
   ```

## Default Admin Credentials

- **Email:** admin@techgrantha.com
- **Password:** Admin@123
- **Role:** super_admin

⚠️ **Change these credentials in production!**

## API Endpoints

### Authentication

#### POST /api/admin/login
Authenticate admin user and receive JWT token.

**Request:**
```json
{
  "email": "admin@techgrantha.com",
  "password": "Admin@123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@techgrantha.com",
    "role": "super_admin",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

## Project Structure

```
backend/
├── routes/
│   └── admin.js          # Admin authentication routes
├── utils/
│   ├── password.js       # Password hashing utilities
│   ├── jwt.js            # JWT token utilities
│   ├── supabase.js       # Supabase client
│   └── cloudinary.js     # Cloudinary client
├── scripts/
│   ├── test-login.js     # Test login endpoint
│   ├── test-password-util.js  # Test password utilities
│   └── generate-admin-hash.js # Generate password hash
├── server.js             # Main server file
├── package.json
└── .env                  # Environment variables (create this)
```

## Environment Variables

Required variables in `.env`:

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# JWT
JWT_SECRET=your_32_character_secret_key
JWT_EXPIRES_IN=24h

# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Utilities

### Password Utilities (`utils/password.js`)
- `hashPassword(password)` - Hash a password with bcrypt
- `comparePassword(password, hash)` - Verify password against hash
- `validatePasswordStrength(password)` - Validate password requirements

### JWT Utilities (`utils/jwt.js`)
- `generateToken(user)` - Generate JWT token for user
- `verifyToken(token)` - Verify and decode JWT token

## Testing

### Test Password Utilities
```bash
node scripts/test-password-util.js
```

### Test Login Endpoint
```bash
# Make sure server is running first
npm run dev

# In another terminal:
node scripts/test-login.js
```

### Generate New Admin Password Hash
```bash
node scripts/generate-admin-hash.js
```

## Security Features

- ✅ Bcrypt password hashing (10 salt rounds)
- ✅ JWT token authentication
- ✅ Login attempt logging
- ✅ IP address and user agent tracking
- ✅ Input validation
- ✅ CORS protection
- ✅ Role-based access control

## Troubleshooting

See [SETUP.md](./SETUP.md) for detailed setup instructions and troubleshooting guide.

## Next Steps

- [ ] Implement GET /api/admin/verify endpoint
- [ ] Implement POST /api/admin/logout endpoint
- [ ] Add rate limiting middleware
- [ ] Create admin user management endpoints
- [ ] Add content management endpoints
