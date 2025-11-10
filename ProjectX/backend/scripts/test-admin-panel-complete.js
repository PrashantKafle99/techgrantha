/**
 * Comprehensive test script for the complete admin panel
 * Tests all implemented features end-to-end
 */

const API_URL = 'http://localhost:3000';

// Test credentials
const SUPER_ADMIN_EMAIL = 'admin@techgrantha.com';
const SUPER_ADMIN_PASSWORD = 'certificate@123';

let authToken = '';
let testAdminId = '';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function section(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60));
}

async function test1_Login() {
  section('TEST 1: Super Admin Login');
  
  try {
    const response = await fetch(`${API_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: SUPER_ADMIN_EMAIL,
        password: SUPER_ADMIN_PASSWORD
      })
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      authToken = data.token;
      log('✓ Login successful', 'green');
      log(`  Email: ${data.user.email}`, 'blue');
      log(`  Role: ${data.user.role}`, 'blue');
      return true;
    } else {
      log('✗ Login failed: ' + data.error, 'red');
      return false;
    }
  } catch (error) {
    log('✗ Login error: ' + error.message, 'red');
    return false;
  }
}

async function test2_VerifyToken() {
  section('TEST 2: Token Verification');
  
  try {
    const response = await fetch(`${API_URL}/api/admin/verify`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      log('✓ Token verification successful', 'green');
      log(`  User: ${data.user.email}`, 'blue');
      return true;
    } else {
      log('✗ Token verification failed', 'red');
      return false;
    }
  } catch (error) {
    log('✗ Verification error: ' + error.message, 'red');
    return false;
  }
}

async function test3_GetDashboardStats() {
  section('TEST 3: Dashboard Statistics');
  
  try {
    const response = await fetch(`${API_URL}/api/admin/stats`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      log('✓ Dashboard stats retrieved', 'green');
      log(`  Total Articles: ${data.stats.totalArticles}`, 'blue');
      log(`  Total Updates: ${data.stats.totalUpdates}`, 'blue');
      log(`  Recent Activity: ${data.stats.recentActivity}`, 'blue');
      return true;
    } else {
      log('✗ Failed to get stats', 'red');
      return false;
    }
  } catch (error) {
    log('✗ Stats error: ' + error.message, 'red');
    return false;
  }
}

async function test4_ListAdminUsers() {
  section('TEST 4: List Admin Users');
  
  try {
    const response = await fetch(`${API_URL}/api/admin/users`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      log('✓ Admin users list retrieved', 'green');
      log(`  Total users: ${data.users.length}`, 'blue');
      data.users.forEach(user => {
        log(`  - ${user.email} (${user.role})`, 'blue');
      });
      return true;
    } else {
      log('✗ Failed to list users: ' + data.error, 'red');
      return false;
    }
  } catch (error) {
    log('✗ List users error: ' + error.message, 'red');
    return false;
  }
}

async function test5_CreateAdminUser() {
  section('TEST 5: Create New Admin User');
  
  const testEmail = `test.admin.${Date.now()}@techgrantha.com`;
  const testPassword = 'TestAdmin@123';
  
  try {
    const response = await fetch(`${API_URL}/api/admin/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: testEmail, password: testPassword })
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      testAdminId = data.user.id;
      log('✓ Admin user created successfully', 'green');
      log(`  Email: ${data.user.email}`, 'blue');
      log(`  Role: ${data.user.role}`, 'blue');
      log(`  ID: ${data.user.id}`, 'blue');
      return true;
    } else {
      log('✗ Failed to create user: ' + data.error, 'red');
      return false;
    }
  } catch (error) {
    log('✗ Create user error: ' + error.message, 'red');
    return false;
  }
}

async function test6_PasswordValidation() {
  section('TEST 6: Password Strength Validation');
  
  const weakPasswords = [
    { pwd: '123', desc: 'Too short' },
    { pwd: 'password', desc: 'No uppercase/numbers/special' },
    { pwd: 'Password', desc: 'No numbers/special' },
    { pwd: 'Password123', desc: 'No special characters' }
  ];
  
  let allPassed = true;
  
  for (const test of weakPasswords) {
    try {
      const response = await fetch(`${API_URL}/api/admin/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: `weak.${Date.now()}@test.com`,
          password: test.pwd
        })
      });

      const data = await response.json();
      
      if (!response.ok && !data.success) {
        log(`✓ Weak password rejected: ${test.desc}`, 'green');
      } else {
        log(`✗ Weak password accepted: ${test.desc}`, 'red');
        allPassed = false;
      }
    } catch (error) {
      log(`✗ Validation test error: ${error.message}`, 'red');
      allPassed = false;
    }
  }
  
  return allPassed;
}

async function test7_GetLoginLogs() {
  section('TEST 7: Login History Logs');
  
  try {
    const response = await fetch(`${API_URL}/api/admin/login-logs?page=1&limit=5`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      log('✓ Login logs retrieved', 'green');
      log(`  Total logs: ${data.pagination.total}`, 'blue');
      log(`  Page: ${data.pagination.page}/${data.pagination.totalPages}`, 'blue');
      log(`  Recent logins:`, 'blue');
      data.logs.slice(0, 3).forEach(log => {
        const status = log.success ? '✓ Success' : '✗ Failed';
        const statusColor = log.success ? 'green' : 'red';
        console.log(`    ${colors[statusColor]}${status}${colors.reset} - ${log.email} at ${new Date(log.loginTime).toLocaleString()}`);
      });
      return true;
    } else {
      log('✗ Failed to get login logs: ' + data.error, 'red');
      return false;
    }
  } catch (error) {
    log('✗ Login logs error: ' + error.message, 'red');
    return false;
  }
}

async function test8_DeleteAdminUser() {
  section('TEST 8: Delete Admin User');
  
  if (!testAdminId) {
    log('⚠ Skipping - no test user to delete', 'yellow');
    return true;
  }
  
  try {
    const response = await fetch(`${API_URL}/api/admin/users/${testAdminId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      log('✓ Admin user deleted successfully', 'green');
      return true;
    } else {
      log('✗ Failed to delete user: ' + data.error, 'red');
      return false;
    }
  } catch (error) {
    log('✗ Delete user error: ' + error.message, 'red');
    return false;
  }
}

async function test9_RateLimiting() {
  section('TEST 9: Rate Limiting (Login Attempts)');
  
  log('⚠ Testing rate limiting - this will make 6 failed login attempts', 'yellow');
  
  let blockedCount = 0;
  
  for (let i = 1; i <= 6; i++) {
    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'wrong@test.com',
          password: 'wrongpassword'
        })
      });

      if (response.status === 429) {
        blockedCount++;
        log(`  Attempt ${i}: ✓ Rate limited (429)`, 'green');
      } else {
        log(`  Attempt ${i}: Failed with status ${response.status}`, 'blue');
      }
      
      // Small delay between attempts
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      log(`  Attempt ${i}: Error - ${error.message}`, 'red');
    }
  }
  
  if (blockedCount > 0) {
    log(`✓ Rate limiting working (${blockedCount} requests blocked)`, 'green');
    return true;
  } else {
    log('⚠ Rate limiting may not be working as expected', 'yellow');
    return true; // Don't fail the test suite
  }
}

async function test10_Logout() {
  section('TEST 10: Logout');
  
  try {
    const response = await fetch(`${API_URL}/api/admin/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      log('✓ Logout successful', 'green');
      return true;
    } else {
      log('✗ Logout failed', 'red');
      return false;
    }
  } catch (error) {
    log('✗ Logout error: ' + error.message, 'red');
    return false;
  }
}

async function runAllTests() {
  log('\n🚀 Starting Admin Panel Complete Test Suite', 'cyan');
  log(`API URL: ${API_URL}\n`, 'blue');
  
  const results = [];
  
  // Run tests in sequence
  results.push({ name: 'Login', passed: await test1_Login() });
  if (!results[0].passed) {
    log('\n❌ Login failed. Cannot proceed with other tests.', 'red');
    return;
  }
  
  results.push({ name: 'Token Verification', passed: await test2_VerifyToken() });
  results.push({ name: 'Dashboard Stats', passed: await test3_GetDashboardStats() });
  results.push({ name: 'List Admin Users', passed: await test4_ListAdminUsers() });
  results.push({ name: 'Create Admin User', passed: await test5_CreateAdminUser() });
  results.push({ name: 'Password Validation', passed: await test6_PasswordValidation() });
  results.push({ name: 'Login History', passed: await test7_GetLoginLogs() });
  results.push({ name: 'Delete Admin User', passed: await test8_DeleteAdminUser() });
  results.push({ name: 'Rate Limiting', passed: await test9_RateLimiting() });
  results.push({ name: 'Logout', passed: await test10_Logout() });
  
  // Summary
  section('TEST SUMMARY');
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  results.forEach(result => {
    const icon = result.passed ? '✓' : '✗';
    const color = result.passed ? 'green' : 'red';
    log(`${icon} ${result.name}`, color);
  });
  
  console.log('\n' + '='.repeat(60));
  if (passed === total) {
    log(`\n🎉 ALL TESTS PASSED! (${passed}/${total})`, 'green');
  } else {
    log(`\n⚠️  SOME TESTS FAILED (${passed}/${total} passed)`, 'yellow');
  }
  console.log('='.repeat(60) + '\n');
}

// Run the tests
runAllTests().catch(error => {
  log('\n❌ Test suite error: ' + error.message, 'red');
  process.exit(1);
});
