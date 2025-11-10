import { hashPassword } from '../utils/password.js';

/**
 * Generate a bcrypt hash for the default admin password
 * This hash should be used to update the admin_users table
 */

const DEFAULT_PASSWORD = 'Admin@123';

async function generateHash() {
  console.log('🔐 Generating Admin Password Hash');
  console.log('==================================\n');
  
  console.log(`Password: ${DEFAULT_PASSWORD}`);
  console.log('Generating hash...\n');
  
  const hash = await hashPassword(DEFAULT_PASSWORD);
  
  console.log('✅ Hash generated successfully!\n');
  console.log('Copy this hash:');
  console.log('─'.repeat(60));
  console.log(hash);
  console.log('─'.repeat(60));
  
  console.log('\n📝 Update your database with this SQL:');
  console.log('─'.repeat(60));
  console.log(`UPDATE admin_users`);
  console.log(`SET password_hash = '${hash}'`);
  console.log(`WHERE email = 'admin@techgrantha.com';`);
  console.log('─'.repeat(60));
  
  console.log('\n💡 Or update the seed file:');
  console.log('database/seeds/004_seed_admin_user.sql');
}

generateHash().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
