/**
 * Test script for rate limiting
 * 
 * Prerequisites:
 * 1. Backend server must be running (npm run dev)
 * 
 * Usage: node scripts/test-rate-limit.js
 */

const API_LOGIN_URL = 'http://localhost:3000/api/admin/login';

async function attemptLogin(attemptNumber) {
  console.log(`\n🔐 Attempt ${attemptNumber}:`);
  console.log('─'.repeat(50));
  
  try {
    const response = await fetch(API_LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@techgrantha.com',
        password: 'wrong_password' // Intentionally wrong to trigger rate limit
      })
    });

    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    
    // Check rate limit headers
    const remaining = response.headers.get('ratelimit-remaining');
    const limit = response.headers.get('ratelimit-limit');
    const reset = response.headers.get('ratelimit-reset');
    
    if (remaining !== null) {
      console.log(`Rate Limit: ${remaining}/${limit} remaining`);
      if (reset) {
        const resetDate = new Date(parseInt(reset) * 1000);
        console.log(`Resets at: ${resetDate.toLocaleTimeString()}`);
      }
    }
    
    if (response.status === 429) {
      console.log('🚫 RATE LIMITED!');
      console.log(`Error: ${data.error}`);
      if (data.retryAfter) {
        console.log(`Retry after: ${data.retryAfter} seconds`);
      }
      return false;
    } else if (response.status === 401) {
      console.log('❌ Login failed (expected - wrong password)');
      return true;
    } else {
      console.log('Response:', JSON.stringify(data, null, 2));
      return true;
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Testing Rate Limiting');
  console.log('========================\n');
  console.log('This test will make 7 failed login attempts');
  console.log('Rate limit: 5 attempts per 15 minutes');
  console.log('Expected: First 5 attempts succeed, 6th and 7th are rate limited\n');
  
  const maxAttempts = 7;
  let rateLimitHit = false;
  
  for (let i = 1; i <= maxAttempts; i++) {
    const canContinue = await attemptLogin(i);
    
    if (!canContinue) {
      rateLimitHit = true;
      console.log('\n✅ Rate limiting is working correctly!');
      console.log(`Rate limit hit after ${i} attempts (expected after 5)`);
      
      // Try one more to confirm it's still blocked
      console.log('\n🔄 Trying one more time to confirm...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      await attemptLogin(i + 1);
      break;
    }
    
    // Small delay between attempts
    if (i < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  if (!rateLimitHit) {
    console.log('\n⚠️  Warning: Rate limit was not hit after 7 attempts');
    console.log('This might indicate rate limiting is not working correctly');
  }
  
  console.log('\n📝 Summary:');
  console.log('   - Rate limiting prevents brute force attacks');
  console.log('   - Limit: 5 login attempts per 15 minutes per IP');
  console.log('   - Returns 429 status when limit exceeded');
  console.log('   - Rate limit info in response headers');
  
  console.log('\n💡 Note:');
  console.log('   - Rate limit is per IP address');
  console.log('   - Wait 15 minutes for the limit to reset');
  console.log('   - Or restart the server to reset immediately');
}

// Run tests
runTests().catch(error => {
  console.error('Test suite failed:', error);
  process.exit(1);
});
