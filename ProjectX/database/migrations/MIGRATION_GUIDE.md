# Migration Guide: Adding Admin Roles

## Task 1: Update Database Schema for Role-Based Access

This guide will help you add the `role` column to the `admin_users` table to support super admin and regular admin roles.

### Prerequisites
- Access to your Supabase project dashboard
- The migration file: `005_add_admin_roles.sql`

### Steps to Run the Migration

#### Option 1: Via Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your Tech Grantha project

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy Migration SQL**
   - Open the file: `database/migrations/005_add_admin_roles.sql`
   - Copy the entire contents

4. **Paste and Execute**
   - Paste the SQL into the Supabase SQL Editor
   - Click "Run" or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

5. **Verify Success**
   - You should see a success message
   - Run this verification query:
   ```sql
   SELECT email, role, created_at 
   FROM admin_users 
   ORDER BY created_at;
   ```
   - You should see your admin user with role = 'super_admin'

#### Option 2: Via Supabase CLI (If installed)

```bash
# Navigate to project root
cd /path/to/tech-grantha

# Run migration
supabase db push database/migrations/005_add_admin_roles.sql
```

### What This Migration Does

1. **Adds `role` column** to `admin_users` table
   - Type: VARCHAR(50)
   - Default: 'admin'
   - Constraint: Must be either 'super_admin' or 'admin'

2. **Updates existing admin** to super_admin
   - Sets role = 'super_admin' for admin@techgrantha.com

3. **Creates index** for performance
   - Index on `role` column for faster role-based queries

4. **Adds documentation**
   - Column comment explaining role types

### Expected Result

After running the migration, your `admin_users` table will have this structure:

```
admin_users
├── id (UUID, Primary Key)
├── email (VARCHAR, Unique)
├── password_hash (VARCHAR)
├── role (VARCHAR) ← NEW!
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

### Verification Queries

Run these queries to verify the migration worked:

```sql
-- Check table structure
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'admin_users'
ORDER BY ordinal_position;

-- Check existing admin user
SELECT id, email, role, created_at
FROM admin_users;

-- Verify constraint
SELECT constraint_name, check_clause
FROM information_schema.check_constraints
WHERE constraint_name LIKE '%admin_users%';
```

### Troubleshooting

#### Error: "column already exists"
- The migration is safe to re-run (uses `IF NOT EXISTS`)
- If you see this, the column was already added

#### Error: "permission denied"
- Make sure you're logged in as the project owner
- Check that you have admin access to the database

#### Error: "relation does not exist"
- Make sure you ran migration `004_create_admin_tables.sql` first
- Check that the `admin_users` table exists

### Next Steps

After successfully running this migration:

1. ✅ Mark Task 1 as complete
2. ➡️ Move to Task 2.1: Create password hashing utility
3. ➡️ Continue with backend authentication API implementation

### Rollback (If Needed)

If you need to undo this migration:

```sql
-- Remove role column
ALTER TABLE admin_users DROP COLUMN IF EXISTS role;

-- Drop index
DROP INDEX IF EXISTS idx_admin_users_role;
```

**Note:** Only rollback if absolutely necessary, as this will remove role information from all admin users.
