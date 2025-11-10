-- Create admin_users table for storing admin credentials
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create admin_login_logs table for tracking login activity
CREATE TABLE IF NOT EXISTS admin_login_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    login_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    success BOOLEAN DEFAULT true
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_admin_login_logs_admin_user_id ON admin_login_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_login_logs_login_time ON admin_login_logs(login_time DESC);

-- Add comment
COMMENT ON TABLE admin_users IS 'Stores admin user credentials';
COMMENT ON TABLE admin_login_logs IS 'Tracks all admin login attempts and activity';
