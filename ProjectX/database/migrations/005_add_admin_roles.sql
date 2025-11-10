-- Add role column to admin_users table for role-based access control
-- This migration adds support for super_admin and regular admin roles

-- Add role column with default value 'admin'
ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'admin' 
CHECK (role IN ('super_admin', 'admin'));

-- Update the existing admin user to super_admin role
UPDATE admin_users 
SET role = 'super_admin' 
WHERE email = 'admin@techgrantha.com';

-- Create index for role-based queries
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- Add comment
COMMENT ON COLUMN admin_users.role IS 'Admin role: super_admin can manage other admins, admin has content management only';
