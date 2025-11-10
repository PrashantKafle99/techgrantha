-- Seed admin user
-- Note: In production, you should use a proper password hashing library
-- This is a placeholder. The actual password hashing will be done in the application
-- Default credentials: admin@techgrantha.com / Admin@123

-- For now, we'll insert a placeholder that needs to be updated with proper bcrypt hash
-- You can generate bcrypt hash using: https://bcrypt-generator.com/
-- Password: Admin@123
-- Bcrypt hash (10 rounds): $2a$10$rN8qJ5K5vH5K5K5K5K5K5uO5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K

-- Insert super admin (head admin) with role
-- Password: certificate@123
INSERT INTO admin_users (email, password_hash, role) 
VALUES ('admin@techgrantha.com', '$2b$10$NcSMWk8px8onEBwP6KVZaOkd1OvM3aTSesCbgWHF4k.XH6VBPVI7u', 'super_admin')
ON CONFLICT (email) DO NOTHING;

-- Add more admin users as needed
-- INSERT INTO admin_users (email, password_hash) 
-- VALUES ('another@techgrantha.com', 'bcrypt_hash_here')
-- ON CONFLICT (email) DO NOTHING;
