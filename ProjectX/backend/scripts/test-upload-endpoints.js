/**
 * Test script for image upload endpoints
 * Tests all upload functionality with authentication
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'http://localhost:3000';
const SUPER_ADMIN_EMAIL = 'admin@techgrantha.com';
const SUPER_ADMIN_PASSWORD = 'certificate@123';

let authToken = '';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
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

// Create a test image (1x1 pixel PNG)
function createTestImage() {
  // Base64 encoded 1x1 red pixel PNG
  const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';
  return Buffer.from(base64Image, 'base64');
}

async function test1_Login() {
  section('TEST 1: Login');
  
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

async function test2_TestEndpoint() {
  section('TEST 2: Test Upload Routes');
  
  try {
    const response = await fetch(`${API_URL}/api/upload/test`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      log('✓ Upload routes are accessible', 'green');
      log('  Available endpoints:', 'cyan');
      Object.entries(data.endpoints).forEach(([key, value]) => {
        log(`    - ${value}`, 'cyan');
      });
      return true;
    } else {
      log('✗ Failed to access upload routes', 'red');
      return false;
    }
  } catch (error) {
    log('✗ Test endpoint error: ' + error.message, 'red');
    return false;
  }
}

async function test3_UploadArticleImage() {
  section('TEST 3: Upload Article Image');
  
  try {
    const imageBuffer = createTestImage();
    
    // Create FormData using form-data package
    const FormData = (await import('form-data')).default;
    const formData = new FormData();
    formData.append('image', imageBuffer, {
      filename: 'test-article.png',
      contentType: 'image/png',
      knownLength: imageBuffer.length
    });

    const response = await fetch(`${API_URL}/api/upload/article-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        ...formData.getHeaders()
      },
      body: formData,
      duplex: 'half' // Required for Node.js fetch with streams
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      log('✓ Article image uploaded successfully', 'green');
      log(`  URL: ${data.image.url}`, 'cyan');
      log(`  Public ID: ${data.image.publicId}`, 'cyan');
      log(`  Size: ${(data.image.size / 1024).toFixed(2)} KB`, 'cyan');
      return { success: true, publicId: data.image.publicId };
    } else {
      log('✗ Failed to upload article image: ' + data.error, 'red');
      if (data.details) log(`  Details: ${data.details}`, 'yellow');
      return { success: false };
    }
  } catch (error) {
    log('✗ Upload error: ' + error.message, 'red');
    return { success: false };
  }
}

async function test4_UploadDailyTechImage() {
  section('TEST 4: Upload Daily Tech Image');
  
  try {
    const imageBuffer = createTestImage();
    
    const FormData = (await import('form-data')).default;
    const formData = new FormData();
    formData.append('image', imageBuffer, {
      filename: 'test-daily-tech.png',
      contentType: 'image/png',
      knownLength: imageBuffer.length
    });

    const response = await fetch(`${API_URL}/api/upload/daily-tech-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        ...formData.getHeaders()
      },
      body: formData,
      duplex: 'half'
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      log('✓ Daily tech image uploaded successfully', 'green');
      log(`  URL: ${data.image.url}`, 'cyan');
      log(`  Public ID: ${data.image.publicId}`, 'cyan');
      return { success: true, publicId: data.image.publicId };
    } else {
      log('✗ Failed to upload daily tech image: ' + data.error, 'red');
      if (data.details) log(`  Details: ${data.details}`, 'yellow');
      return { success: false };
    }
  } catch (error) {
    log('✗ Upload error: ' + error.message, 'red');
    return { success: false };
  }
}

async function test5_DeleteImage(publicId) {
  section('TEST 5: Delete Image');
  
  if (!publicId) {
    log('⚠ Skipping - no image to delete', 'yellow');
    return true;
  }
  
  try {
    // URL encode the public ID
    const encodedPublicId = encodeURIComponent(publicId).replace(/%2F/g, '/');
    
    const response = await fetch(`${API_URL}/api/upload/image/${encodedPublicId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      log('✓ Image deleted successfully', 'green');
      return true;
    } else {
      log('✗ Failed to delete image: ' + data.error, 'red');
      return false;
    }
  } catch (error) {
    log('✗ Delete error: ' + error.message, 'red');
    return false;
  }
}

async function test6_UploadWithoutAuth() {
  section('TEST 6: Upload Without Authentication');
  
  try {
    const imageBuffer = createTestImage();
    
    const FormData = (await import('form-data')).default;
    const formData = new FormData();
    formData.append('image', imageBuffer, {
      filename: 'test-no-auth.png',
      contentType: 'image/png'
    });

    const response = await fetch(`${API_URL}/api/upload/article-image`, {
      method: 'POST',
      headers: formData.getHeaders(),
      body: formData
    });

    const data = await response.json();
    
    if (response.status === 401 || response.status === 403) {
      log('✓ Correctly rejected unauthorized upload', 'green');
      return true;
    } else {
      log('✗ Should have rejected unauthorized upload', 'red');
      return false;
    }
  } catch (error) {
    log('✗ Test error: ' + error.message, 'red');
    return false;
  }
}

async function runAllTests() {
  log('\n🧪 Starting Upload Endpoints Test Suite', 'cyan');
  log(`API URL: ${API_URL}\n`, 'cyan');
  
  const results = [];
  let uploadedPublicId = null;
  
  // Test 1: Login
  results.push({ name: 'Login', passed: await test1_Login() });
  if (!results[0].passed) {
    log('\n❌ Login failed. Cannot proceed with other tests.', 'red');
    return;
  }
  
  // Test 2: Test endpoint
  results.push({ name: 'Test Endpoint', passed: await test2_TestEndpoint() });
  
  // Test 3: Upload article image
  const uploadResult = await test3_UploadArticleImage();
  results.push({ name: 'Upload Article Image', passed: uploadResult.success });
  if (uploadResult.success) {
    uploadedPublicId = uploadResult.publicId;
  }
  
  // Test 4: Upload daily tech image
  const dailyTechResult = await test4_UploadDailyTechImage();
  results.push({ name: 'Upload Daily Tech Image', passed: dailyTechResult.success });
  
  // Test 5: Delete image
  results.push({ name: 'Delete Image', passed: await test5_DeleteImage(uploadedPublicId) });
  
  // Test 6: Upload without auth
  results.push({ name: 'Auth Protection', passed: await test6_UploadWithoutAuth() });
  
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
    log('\n✅ Image upload system is ready!', 'green');
    log('\nNext steps:', 'cyan');
    log('  1. Build frontend upload components', 'cyan');
    log('  2. Integrate with article/daily-tech forms', 'cyan');
    log('  3. Add image preview and management UI', 'cyan');
  } else {
    log(`\n⚠️  SOME TESTS FAILED (${passed}/${total} passed)`, 'yellow');
  }
  console.log('='.repeat(60) + '\n');
}

// Run the tests
runAllTests().catch(error => {
  log('\n❌ Test suite error: ' + error.message, 'red');
  console.error(error);
  process.exit(1);
});
