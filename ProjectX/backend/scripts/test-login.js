/**
 * Test script for admin login endpoint
 * 
 * Prerequisites:
 * 1. Backend server must be running (npm run dev)
 * 2. Database must have admin user seeded
 * 3. .env file must be configured
 * 
 * Usage: node scripts/test-login.js
 */

const API_URL = 'http://localhost:3000/api/admin/login';

async function testLogin(email, password, testName) {
  console.log(`\n🧪 Test: ${testName}`);
  console.log('='.repeat(50));
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('✅ Login successful');
      console.log(`User: ${data.user.email}`);
      console.log(`Role: ${data.user.role}`);
      console.log(`Token: ${data.token.substring(0, 20)}...`);
    } else {
      console.log('❌ Login failed');
      console.log(`Error: ${data.error}`);
    }
    
    return data;
  } catch (error) {
    console.error('❌ Request failed:', error.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Testing Admin Login Endpoint');
  console.log('================================\n');
  
  // Test 1: Valid credentials
  await testLogin(
    'admin@techgrantha.com',
    'certificate@123',
    'Valid Credentials'
  );
  
  // Test 2: Invalid password
  await testLogin(
    'admin@techgrantha.com',
    'WrongPassword',
    'Invalid Password'
  );
  
  // Test 3: Invalid email
  await testLogin(
    'nonexistent@techgrantha.com',
    'certificate@123',
    'Non-existent User'
  );
  
  // Test 4: Missing email
  await testLogin(
    '',
    'certificate@123',
    'Missing Email'
  );
  
  // Test 5: Missing password
  await testLogin(
    'admin@techgrantha.com',
    '',
    'Missing Password'
  );
  
  // Test 6: Invalid email format
  await testLogin(
    'invalid-email',
    'certificate@123',
    'Invalid Email Format'
  );
  
  console.log('\n✅ All tests completed!');
  console.log('\n💡 Check your database admin_login_logs table to verify logging');
}

// Run tests
runTests().catch(error => {
  console.error('Test suite failed:', error);
  process.exit(1);
});
