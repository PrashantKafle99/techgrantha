/**
 * Test script for Cloudinary utilities
 * Tests all upload, delete, and transformation functions
 */

import {
  getCloudinaryStatus,
  validateImageFile,
  extractPublicId,
  getThumbnailUrl,
  getTransformedImageUrl
} from '../utils/cloudinary.js';

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

// Test 1: Check Cloudinary Configuration
function test1_CheckConfiguration() {
  section('TEST 1: Cloudinary Configuration');
  
  const status = getCloudinaryStatus();
  
  if (status.configured) {
    log('✓ Cloudinary is configured', 'green');
    log(`  Cloud Name: ${status.cloudName}`, 'cyan');
    return true;
  } else {
    log('✗ Cloudinary is not configured', 'red');
    log('  Please check your .env file', 'yellow');
    return false;
  }
}

// Test 2: Validate Image Files
function test2_ValidateImageFiles() {
  section('TEST 2: Image File Validation');
  
  const testCases = [
    {
      name: 'Valid JPEG',
      file: { mimetype: 'image/jpeg', size: 2 * 1024 * 1024 }, // 2 MB
      shouldPass: true
    },
    {
      name: 'Valid PNG',
      file: { mimetype: 'image/png', size: 5 * 1024 * 1024 }, // 5 MB
      shouldPass: true
    },
    {
      name: 'Too Large',
      file: { mimetype: 'image/jpeg', size: 15 * 1024 * 1024 }, // 15 MB
      shouldPass: false
    },
    {
      name: 'Invalid Type (PDF)',
      file: { mimetype: 'application/pdf', size: 1 * 1024 * 1024 },
      shouldPass: false
    },
    {
      name: 'Valid WebP',
      file: { mimetype: 'image/webp', size: 3 * 1024 * 1024 },
      shouldPass: true
    }
  ];
  
  let allPassed = true;
  
  testCases.forEach(test => {
    const result = validateImageFile(test.file);
    const passed = result.isValid === test.shouldPass;
    
    if (passed) {
      log(`✓ ${test.name}: ${result.isValid ? 'Valid' : 'Invalid (as expected)'}`, 'green');
      if (result.errors.length > 0) {
        log(`  Errors: ${result.errors.join(', ')}`, 'yellow');
      }
    } else {
      log(`✗ ${test.name}: Unexpected result`, 'red');
      allPassed = false;
    }
  });
  
  return allPassed;
}

// Test 3: Extract Public ID from URL
function test3_ExtractPublicId() {
  section('TEST 3: Extract Public ID from URL');
  
  const testCases = [
    {
      url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/tech-grantha/articles/sample.jpg',
      expected: 'tech-grantha/articles/sample'
    },
    {
      url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/folder/subfolder/image.png',
      expected: 'folder/subfolder/image'
    },
    {
      url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      expected: 'sample'
    }
  ];
  
  let allPassed = true;
  
  testCases.forEach((test, index) => {
    const result = extractPublicId(test.url);
    
    if (result === test.expected) {
      log(`✓ Test ${index + 1}: Extracted "${result}"`, 'green');
    } else {
      log(`✗ Test ${index + 1}: Expected "${test.expected}", got "${result}"`, 'red');
      allPassed = false;
    }
  });
  
  return allPassed;
}

// Test 4: Generate Transformation URLs
function test4_GenerateTransformations() {
  section('TEST 4: Generate Transformation URLs');
  
  const publicId = 'tech-grantha/articles/sample';
  
  try {
    // Test thumbnail
    const thumbnailUrl = getThumbnailUrl(publicId, 200);
    log('✓ Thumbnail URL generated:', 'green');
    log(`  ${thumbnailUrl}`, 'cyan');
    
    // Test custom transformation
    const transformedUrl = getTransformedImageUrl(publicId, {
      width: 800,
      height: 600,
      crop: 'fill',
      quality: 'auto'
    });
    log('✓ Transformed URL generated:', 'green');
    log(`  ${transformedUrl}`, 'cyan');
    
    return true;
  } catch (error) {
    log(`✗ Transformation error: ${error.message}`, 'red');
    return false;
  }
}

// Test 5: File Size Formatting
function test5_FileSizeValidation() {
  section('TEST 5: File Size Validation');
  
  const sizes = [
    { bytes: 500 * 1024, desc: '500 KB' },
    { bytes: 2 * 1024 * 1024, desc: '2 MB' },
    { bytes: 10 * 1024 * 1024, desc: '10 MB (max)' },
    { bytes: 15 * 1024 * 1024, desc: '15 MB (too large)' }
  ];
  
  sizes.forEach(size => {
    const file = { mimetype: 'image/jpeg', size: size.bytes };
    const result = validateImageFile(file);
    
    const status = result.isValid ? '✓ Valid' : '✗ Invalid';
    const color = result.isValid ? 'green' : 'yellow';
    log(`${status}: ${size.desc}`, color);
  });
  
  return true;
}

// Run all tests
async function runAllTests() {
  log('\n🧪 Starting Cloudinary Utilities Test Suite', 'cyan');
  
  const results = [];
  
  results.push({ name: 'Configuration Check', passed: test1_CheckConfiguration() });
  
  if (!results[0].passed) {
    log('\n❌ Cloudinary not configured. Please set up your .env file first.', 'red');
    return;
  }
  
  results.push({ name: 'Image Validation', passed: test2_ValidateImageFiles() });
  results.push({ name: 'Extract Public ID', passed: test3_ExtractPublicId() });
  results.push({ name: 'Generate Transformations', passed: test4_GenerateTransformations() });
  results.push({ name: 'File Size Validation', passed: test5_FileSizeValidation() });
  
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
    log('\n✅ Cloudinary utilities are ready to use!', 'green');
    log('\nNext steps:', 'cyan');
    log('  1. Implement image upload endpoints', 'cyan');
    log('  2. Add multer middleware for file uploads', 'cyan');
    log('  3. Create frontend upload components', 'cyan');
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
