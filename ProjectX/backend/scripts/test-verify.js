/**
 * Test script for admin verify endpoint
 * 
 * Prerequisites:
 * 1. Backend server must be running (npm run dev)
 * 2. You need a valid JWT token (get one from login)
 * 
 * Usage: node scripts/test-verify.js [token]
 */

const API_LOGIN_URL = 'http://localhost:3000/api/admin/login';
const API_VERIFY_URL = 'http://localhost:3000/api/admin/verify';

async function login() {
  console.log('🔐 Logging in to get token...\n');
  
  try {
    const response = await fetch(API_LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@techgrantha.com',
        password: 'certificate@123'
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Login successful');
      console.log(`Token: ${data.token.substring(0, 30)}...\n`);
      return data.token;
    } else {
      console.error('❌ Login failed:', data.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Login request failed:', error.message);
    return null;
  }
}

async function testVerify(token, testName) {
  console.log(`🧪 Test: ${testName}`);
  console.log('='.repeat(50));
  
  try {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(API_VERIFY_URL, {
      method: 'GET',
      headers
    });

    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('✅ Verification successful');
      console.log(`User: ${data.user.email}`);
      console.log(`Role: ${data.user.role}`);
      console.log(`ID: ${data.user.id}`);
    } else {
      console.log('❌ Verification failed');
      console.log(`Error: ${data.error}`);
    }
    
    return data;
  } catch (error) {
    console.error('❌ Request failed:', error.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Testing Admin Verify Endpoint');
  console.log('=================================\n');
  
  // Get token from command line or login
  let token = process.argv[2];
  
  if (!token) {
    token = await login();
    if (!token) {
      console.error('❌ Could not get token. Exiting.');
      process.exit(1);
    }
  } else {
    console.log('📝 Using provided token\n');
  }
  
  // Test 1: Valid token
  await testVerify(token, 'Valid Token');
  console.log('\n');
  
  // Test 2: No token
  await testVerify(null, 'Missing Token');
  console.log('\n');
  
  // Test 3: Invalid token
  await testVerify('invalid.token.here', 'Invalid Token');
  console.log('\n');
  
  // Test 4: Malformed token
  await testVerify('Bearer malformed', 'Malformed Token');
  console.log('\n');
  
  console.log('✅ All tests completed!');
  console.log('\n💡 The verify endpoint is used by the frontend to check if a user is still authenticated');
}

// Run tests
runTests().catch(error => {
  console.error('Test suite failed:', error);
  process.exit(1);
});
