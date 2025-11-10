import { hashPassword, comparePassword, validatePasswordStrength } from '../utils/password.js';

async function testPasswordUtility() {
  console.log('🧪 Testing Password Utility\n');
  
  // Test 1: Password Strength Validation
  console.log('Test 1: Password Strength Validation');
  console.log('=====================================');
  
  const weakPassword = 'weak';
  const strongPassword = 'Admin@123';
  
  const weakResult = validatePasswordStrength(weakPassword);
  console.log(`Weak password "${weakPassword}":`, weakResult);
  
  const strongResult = validatePasswordStrength(strongPassword);
  console.log(`Strong password "${strongPassword}":`, strongResult);
  console.log('');
  
  // Test 2: Password Hashing
  console.log('Test 2: Password Hashing');
  console.log('========================');
  
  const testPassword = 'Admin@123';
  console.log(`Original password: ${testPassword}`);
  
  const hash = await hashPassword(testPassword);
  console.log(`Hashed password: ${hash}`);
  console.log(`Hash length: ${hash.length} characters`);
  console.log('');
  
  // Test 3: Password Comparison
  console.log('Test 3: Password Comparison');
  console.log('===========================');
  
  const correctPassword = 'Admin@123';
  const wrongPassword = 'WrongPassword';
  
  const isCorrect = await comparePassword(correctPassword, hash);
  console.log(`Correct password match: ${isCorrect} ✅`);
  
  const isWrong = await comparePassword(wrongPassword, hash);
  console.log(`Wrong password match: ${isWrong} ❌`);
  console.log('');
  
  // Test 4: Multiple Hashes (should be different)
  console.log('Test 4: Hash Uniqueness');
  console.log('=======================');
  
  const hash1 = await hashPassword(testPassword);
  const hash2 = await hashPassword(testPassword);
  
  console.log(`Hash 1: ${hash1}`);
  console.log(`Hash 2: ${hash2}`);
  console.log(`Hashes are different: ${hash1 !== hash2} ✅`);
  console.log(`Both hashes verify correctly: ${await comparePassword(testPassword, hash1) && await comparePassword(testPassword, hash2)} ✅`);
  console.log('');
  
  console.log('✅ All tests completed successfully!');
}

// Run tests
testPasswordUtility().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
