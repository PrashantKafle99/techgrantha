-- Update admin password to certificate@123
-- Run this in Supabase SQL Editor to update the super admin password

UPDATE admin_users
SET password_hash = '$2b$10$NcSMWk8px8onEBwP6KVZaOkd1OvM3aTSesCbgWHF4k.XH6VBPVI7u',
    updated_at = CURRENT_TIMESTAMP
WHERE email = 'admin@techgrantha.com';

-- Verify the update
SELECT email, role, created_at, updated_at
FROM admin_users
WHERE email = 'admin@techgrantha.com';

-- Expected result:
-- email: admin@techgrantha.com
-- role: super_admin
-- Login credentials:
--   Email: admin@techgrantha.com
--   Password: certificate@123
