# Rate Limiting Documentation

## Overview

Rate limiting is implemented to prevent brute force attacks and API abuse. The system uses IP-based rate limiting with different limits for different endpoints.

## Rate Limiters

### 1. Login Rate Limiter

**Applied to:** `POST /api/admin/login`

**Configuration:**
- **Window:** 15 minutes
- **Max Attempts:** 5 per IP address
- **Response Code:** 429 (Too Many Requests)

**Purpose:** Prevents brute force password attacks

**Response when limit exceeded:**
```json
{
  "success": false,
  "error": "Too many login attempts. Please try again in 15 minutes.",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 900
}
```

### 2. API Rate Limiter

**Applied to:** General API endpoints (can be applied globally)

**Configuration:**
- **Window:** 15 minutes
- **Max Requests:** 100 per IP address
- **Response Code:** 429 (Too Many Requests)

**Purpose:** Prevents API abuse and DoS attacks

### 3. Strict Rate Limiter

**Applied to:** Sensitive operations (password changes, admin creation, etc.)

**Configuration:**
- **Window:** 1 hour
- **Max Requests:** 3 per IP address
- **Response Code:** 429 (Too Many Requests)

**Purpose:** Extra protection for critical operations

## Rate Limit Headers

The API returns rate limit information in response headers:

```
RateLimit-Limit: 5
RateLimit-Remaining: 3
RateLimit-Reset: 1699564800
```

- **RateLimit-Limit:** Maximum number of requests allowed
- **RateLimit-Remaining:** Number of requests remaining in current window
- **RateLimit-Reset:** Unix timestamp when the rate limit resets

## Testing Rate Limiting

### Automated Test

Run the test script to verify rate limiting:

```bash
node scripts/test-rate-limit.js
```

This will:
1. Make 7 failed login attempts
2. Verify that the 6th attempt is rate limited
3. Check rate limit headers

### Manual Testing

1. **Make multiple login attempts:**

```bash
# Attempt 1
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@techgrantha.com","password":"wrong"}'

# Repeat 5 times...
```

2. **Check rate limit headers:**

```bash
curl -i -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@techgrantha.com","password":"wrong"}'
```

Look for `RateLimit-*` headers in the response.

3. **Verify 429 response after 5 attempts:**

After 5 failed attempts, you should receive:
```json
{
  "success": false,
  "error": "Too many login attempts. Please try again in 15 minutes.",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 900
}
```

## How It Works

### IP-Based Tracking

Rate limiting tracks requests by IP address:

```javascript
keyGenerator: (req) => {
  return req.ip || req.connection.remoteAddress;
}
```

### In-Memory Storage

By default, rate limit data is stored in memory. This means:
- ✅ Fast and simple
- ✅ No external dependencies
- ❌ Resets when server restarts
- ❌ Not suitable for multi-server deployments

### For Production

For production environments with multiple servers, consider using Redis:

```javascript
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL
});

export const loginRateLimiter = rateLimit({
  store: new RedisStore({
    client: client,
    prefix: 'rl:login:'
  }),
  windowMs: 15 * 60 * 1000,
  max: 5
});
```

## Bypassing Rate Limits (Development)

### Option 1: Restart Server

The easiest way to reset rate limits during development:

```bash
# Stop server (Ctrl+C)
# Start server
npm run dev
```

### Option 2: Whitelist IPs

Add IP whitelist to rate limiter:

```javascript
export const loginRateLimiter = rateLimit({
  // ... other config
  skip: (req) => {
    const whitelist = ['127.0.0.1', '::1'];
    return whitelist.includes(req.ip);
  }
});
```

### Option 3: Disable in Development

```javascript
export const loginRateLimiter = process.env.NODE_ENV === 'development'
  ? (req, res, next) => next() // No-op in development
  : rateLimit({ /* config */ });
```

## Security Considerations

### Distributed Attacks

IP-based rate limiting can be bypassed by:
- Using multiple IP addresses
- Using proxies or VPNs
- Distributed botnets

**Mitigation:**
- Implement account-based rate limiting
- Add CAPTCHA after failed attempts
- Monitor for suspicious patterns
- Use additional authentication factors

### Legitimate Users

Rate limiting might affect legitimate users:
- Shared IP addresses (offices, schools)
- Users behind NAT
- Mobile users with changing IPs

**Mitigation:**
- Set reasonable limits
- Provide clear error messages
- Allow account recovery options
- Consider user-based rate limiting for authenticated requests

## Monitoring

### Log Rate Limit Events

The rate limiter logs when limits are exceeded:

```javascript
handler: (req, res) => {
  console.log(`Rate limit exceeded for IP: ${req.ip}`);
  // Send alert, log to monitoring system, etc.
}
```

### Metrics to Track

- Number of rate limit hits per hour
- IPs that frequently hit rate limits
- Patterns of failed login attempts
- Time of day when limits are hit

### Alerting

Set up alerts for:
- Unusual spike in rate limit hits
- Same IP hitting limit repeatedly
- Distributed attack patterns

## Configuration

Rate limit settings can be configured via environment variables:

```env
# .env
RATE_LIMIT_LOGIN_WINDOW=900000  # 15 minutes in ms
RATE_LIMIT_LOGIN_MAX=5
RATE_LIMIT_API_WINDOW=900000
RATE_LIMIT_API_MAX=100
```

Then use in code:

```javascript
export const loginRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_LOGIN_WINDOW) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_LOGIN_MAX) || 5
});
```

## Troubleshooting

### Rate limit not working

1. Check that middleware is applied to route
2. Verify express-rate-limit is installed
3. Check server logs for errors
4. Test with curl to see headers

### Rate limit too strict

1. Increase max attempts
2. Increase window duration
3. Add IP whitelist for development
4. Consider user-based limits instead

### Rate limit resets unexpectedly

1. Check if server is restarting
2. Consider using Redis for persistence
3. Check memory limits

## Best Practices

1. **Set appropriate limits** - Not too strict, not too lenient
2. **Provide clear error messages** - Tell users when they can retry
3. **Log rate limit events** - Monitor for attacks
4. **Use different limits for different endpoints** - Sensitive operations need stricter limits
5. **Consider user experience** - Don't punish legitimate users
6. **Test thoroughly** - Ensure rate limiting works as expected
7. **Monitor in production** - Watch for issues and adjust as needed

## Related Security Measures

Rate limiting works best when combined with:
- Strong password policies
- Account lockout after failed attempts
- CAPTCHA challenges
- Two-factor authentication
- IP reputation checking
- Anomaly detection
