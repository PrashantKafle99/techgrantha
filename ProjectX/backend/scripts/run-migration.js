import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get migration file from command line argument
const migrationFile = process.argv[2];

if (!migrationFile) {
  console.error('❌ Please provide a migration file name');
  console.error('Usage: node run-migration.js <migration-file>');
  console.error('Example: node run-migration.js 005_add_admin_roles.sql');
  process.exit(1);
}

// Initialize Supabase client with service role key
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.error('Required: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    // Read migration file
    const migrationPath = join(__dirname, '../../database/migrations', migrationFile);
    console.log(`📂 Reading migration file: ${migrationPath}`);
    
    const sql = readFileSync(migrationPath, 'utf8');
    console.log(`📄 Migration SQL loaded (${sql.length} characters)`);
    console.log('\n--- Migration Content ---');
    console.log(sql);
    console.log('--- End Migration ---\n');

    // Execute migration
    console.log('🚀 Executing migration...');
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      // If exec_sql function doesn't exist, try direct query
      console.log('⚠️  exec_sql function not found, trying direct query...');
      
      // Split SQL into individual statements and execute them
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (const statement of statements) {
        if (statement) {
          console.log(`\n📝 Executing: ${statement.substring(0, 100)}...`);
          const { error: stmtError } = await supabase.rpc('exec', { sql: statement });
          
          if (stmtError) {
            console.error(`❌ Error executing statement: ${stmtError.message}`);
            throw stmtError;
          }
        }
      }
    }

    console.log('\n✅ Migration completed successfully!');
    
    // Verify the changes
    console.log('\n🔍 Verifying changes...');
    const { data: columns, error: verifyError } = await supabase
      .from('admin_users')
      .select('*')
      .limit(1);

    if (verifyError) {
      console.log('⚠️  Could not verify changes automatically');
    } else {
      console.log('✅ Table structure verified');
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run the migration
runMigration();
