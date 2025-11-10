/**
 * Test script for admin logout endpoint
 * 
 * Prerequisites:
 * 1. Backend server must be running (npm run dev)
 * 
 * Usage: node scripts/test-logout.js
 */

const API_LOGIN_URL = 'http://localhost:3000/api/admin/login';
const API_LOGOUT_URL = 'http://localhost:3000/api/admin/logout';
const API_VERIFY_URL = 'http://localhost:3000/api/admin/verify';

async function login() {
  console.log('🔐 Step 1: Logging in...\n');
  
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
      console.log(`User: ${data.user.email}`);
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

async function verifyToken(token) {
  console.log('🔍 Step 2: Verifying token is valid...\n');
  
  try {
    const response = await fetch(API_VERIFY_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Token is valid');
      console.log(`User: ${data.user.email}`);
      console.log(`Role: ${data.user.role}\n`);
      return true;
    } else {
      console.log('❌ Token is invalid');
      console.log(`Error: ${data.error}\n`);
      return false;
    }
  } catch (error) {
    console.error('❌ Verify request failed:', error.message);
    return false;
  }
}

async function logout(token) {
  console.log('🚪 Step 3: Logging out...\n');
  
  try {
    const response = await fetch(API_LOGOUT_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('\n✅ Logout successful');
      return true;
    } else {
      console.log('\n❌ Logout failed');
      console.log(`Error: ${data.error}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Logout request failed:', error.message);
    return false;
  }
}

async function testLogoutWithoutToken() {
  console.log('\n🧪 Test: Logout without token\n');
  console.log('='.repeat(50));
  
  try {
    const response = await fetch(API_LOGOUT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.status === 401) {
      console.log('\n✅ Correctly rejected logout without token');
    } else {
      console.log('\n❌ Should have rejected logout without token');
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Testing Admin Logout Endpoint');
  console.log('=================================\n');
  
  // Test 1: Complete logout flow
  console.log('📋 Test 1: Complete Logout Flow');
  console.log('='.repeat(50) + '\n');
  
  const token = await login();
  if (!token) {
    console.error('❌ Could not get token. Exiting.');
    process.exit(1);
  }
  
  const isValid = await verifyToken(token);
  if (!isValid) {
    console.error('❌ Token is not valid. Exiting.');
    process.exit(1);
  }
  
  const loggedOut = await logout(token);
  
  if (loggedOut) {
    console.log('\n💡 Note: With JWT tokens, the token is still technically valid');
    console.log('   until it expires. The client should remove it from storage.');
    console.log('   In production, you might implement token blacklisting.');
  }
  
  // Test 2: Logout without token
  await testLogoutWithoutToken();
  
  console.log('\n✅ All tests completed!');
  console.log('\n📝 Summary:');
  console.log('   - Logout endpoint requires authentication');
  console.log('   - Client should remove token after logout');
  console.log('   - Token remains valid until expiration (JWT limitation)');
}

// Run tests
runTests().catch(error => {
  console.error('Test suite failed:', error);
  process.exit(1);
});
