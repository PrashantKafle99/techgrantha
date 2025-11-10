import { hashPassword } from '../utils/password.js';

/**
 * Generate a bcrypt hash for a custom password
 */

const CUSTOM_PASSWORD = 'certificate@123';

async function generateHash() {
  console.log('🔐 Generating Custom Password Hash');
  console.log('===================================\n');
  
  console.log(`Password: ${CUSTOM_PASSWORD}`);
  console.log('Generating hash...\n');
  
  const hash = await hashPassword(CUSTOM_PASSWORD);
  
  console.log('✅ Hash generated successfully!\n');
  console.log('Copy this hash:');
  console.log('─'.repeat(60));
  console.log(hash);
  console.log('─'.repeat(60));
  
  console.log('\n📝 Run this SQL in Supabase SQL Editor:');
  console.log('─'.repeat(60));
  console.log(`UPDATE admin_users`);
  console.log(`SET password_hash = '${hash}'`);
  console.log(`WHERE email = 'admin@techgrantha.com';`);
  console.log('─'.repeat(60));
  
  console.log('\n✅ After running the SQL, you can login with:');
  console.log('   Email: admin@techgrantha.com');
  console.log('   Password: certificate@123');
}

generateHash().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
