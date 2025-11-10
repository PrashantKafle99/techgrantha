/**
 * Test script for admin management endpoints
 * Tests GET, POST, and DELETE /api/admin/users
 */

const API_URL = 'http://localhost:3000';

// Test credentials (from CREDENTIALS.md)
const SUPER_ADMIN_EMAIL = 'admin@techgrantha.com';
const SUPER_ADMIN_PASSWORD = 'certificate@123';

let authToken = '';
let createdUserId = '';

async function testLogin() {
  console.log('\n=== Testing Login ===');
  
  const response = await fetch(`${API_URL}/api/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: SUPER_ADMIN_EMAIL,
      password: SUPER_ADMIN_PASSWORD
    })
  });

  const data = await response.json();
  
  if (response.ok && data.success) {
    authToken = data.token;
    console.log('✓ Login successful');
    console.log('  User:', data.user.email);
    console.log('  Role:', data.user.role);
    return true;
  } else {
    console.log('✗ Login failed:', data.error);
    return false;
  }
}

async function testGetUsers() {
  console.log('\n=== Testing GET /api/admin/users ===');
  
  const response = await fetch(`${API_URL}/api/admin/users`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    }
  });

  const data = await response.json();
  
  if (response.ok && data.success) {
    console.log('✓ Get users successful');
    console.log(`  Found ${data.users.length} admin user(s)`);
    data.users.forEach(user => {
      console.log(`  - ${user.email} (${user.role})`);
    });
    return true;
  } else {
    console.log('✗ Get users failed:', data.error);
    return false;
  }
}

async function testCreateUser() {
  console.log('\n=== Testing POST /api/admin/users ===');
  
  const testEmail = `test.admin.${Date.now()}@techgrantha.com`;
  const testPassword = 'TestAdmin@123';
  
  const response = await fetch(`${API_URL}/api/admin/users`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword
    })
  });

  const data = await response.json();
  
  if (response.ok && data.success) {
    createdUserId = data.user.id;
    console.log('✓ Create user successful');
    console.log('  Email:', data.user.email);
    console.log('  Role:', data.user.role);
    console.log('  ID:', data.user.id);
    return true;
  } else {
    console.log('✗ Create user failed:', data.error);
    if (data.details) {
      console.log('  Details:', data.details);
    }
    return false;
  }
}

async function testCreateUserWithWeakPassword() {
  console.log('\n=== Testing POST /api/admin/users (weak password) ===');
  
  const testEmail = `weak.${Date.now()}@techgrantha.com`;
  const weakPassword = '123'; // Should fail validation
  
  const response = await fetch(`${API_URL}/api/admin/users`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: testEmail,
      password: weakPassword
    })
  });

  const data = await response.json();
  
  if (!response.ok && !data.success) {
    console.log('✓ Weak password correctly rejected');
    console.log('  Error:', data.error);
    return true;
  } else {
    console.log('✗ Weak password should have been rejected');
    return false;
  }
}

async function testDeleteUser() {
  console.log('\n=== Testing DELETE /api/admin/users/:id ===');
  
  if (!createdUserId) {
    console.log('✗ No user ID to delete (create test may have failed)');
    return false;
  }
  
  const response = await fetch(`${API_URL}/api/admin/users/${createdUserId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    }
  });

  const data = await response.json();
  
  if (response.ok && data.success) {
    console.log('✓ Delete user successful');
    console.log('  Message:', data.message);
    return true;
  } else {
    console.log('✗ Delete user failed:', data.error);
    return false;
  }
}

async function runTests() {
  console.log('Starting Admin Management API Tests...');
  console.log('API URL:', API_URL);
  
  try {
    // Test login first
    const loginSuccess = await testLogin();
    if (!loginSuccess) {
      console.log('\n❌ Login failed. Cannot proceed with other tests.');
      return;
    }

    // Test get users
    await testGetUsers();

    // Test create user
    await testCreateUser();

    // Test weak password validation
    await testCreateUserWithWeakPassword();

    // Test delete user
    await testDeleteUser();

    // Verify deletion by getting users again
    await testGetUsers();

    console.log('\n✅ All tests completed!');
    
  } catch (error) {
    console.error('\n❌ Test error:', error.message);
  }
}

// Run the tests
runTests();
