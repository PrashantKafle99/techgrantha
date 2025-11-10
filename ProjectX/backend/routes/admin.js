import express from 'express';
import { supabase } from '../utils/supabase.js';
import { comparePassword, hashPassword, validatePasswordStrength } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { authenticateToken } from '../middleware/auth.js';
import { loginRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * GET /api/admin/test
 * Test endpoint to verify routes are working
 */
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Admin routes are working!',
    timestamp: new Date().toISOString()
  });
});

/**
 * POST /api/admin/login
 * Authenticate admin user and return JWT token
 * Rate limited: 5 attempts per 15 minutes
 */
router.post('/login', loginRateLimiter, async (req, res) => {
  try {
    console.log('Login attempt started');
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }
    console.log('Input validated');

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Get client IP and user agent for logging
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Unknown';

    // Query admin user from database
    console.log('Querying database for user:', email);
    const { data: adminUser, error: queryError } = await supabase
      .from('admin_users')
      .select('id, email, password_hash, role, created_at')
      .eq('email', email)
      .single();

    console.log('Database query complete. User found:', !!adminUser, 'Error:', queryError?.message);

    // If user not found or query error
    if (queryError || !adminUser) {
      // Log failed attempt
      await supabase.from('admin_login_logs').insert({
        admin_user_id: null,
        email: email,
        login_time: new Date().toISOString(),
        ip_address: ipAddress,
        user_agent: userAgent,
        success: false
      });

      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Verify password
    console.log('Comparing password...');
    const isPasswordValid = await comparePassword(password, adminUser.password_hash);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      // Log failed attempt
      await supabase.from('admin_login_logs').insert({
        admin_user_id: adminUser.id,
        email: email,
        login_time: new Date().toISOString(),
        ip_address: ipAddress,
        user_agent: userAgent,
        success: false
      });

      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate JWT token
    console.log('Generating JWT token...');
    const token = generateToken({
      id: adminUser.id,
      email: adminUser.email,
      role: adminUser.role
    });
    console.log('Token generated');

    // Log successful login
    console.log('Logging successful login to database...');
    await supabase.from('admin_login_logs').insert({
      admin_user_id: adminUser.id,
      email: email,
      login_time: new Date().toISOString(),
      ip_address: ipAddress,
      user_agent: userAgent,
      success: true
    });

    console.log('Login logged successfully');

    // Return success response
    console.log('Sending response...');
    res.json({
      success: true,
      token,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
        createdAt: adminUser.created_at
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred during login'
    });
  }
});

/**
 * GET /api/admin/verify
 * Verify JWT token and return user data
 * Requires: Authorization header with Bearer token
 */
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    // Get fresh user data from database
    const { data: adminUser, error: queryError } = await supabase
      .from('admin_users')
      .select('id, email, role, created_at')
      .eq('id', req.user.id)
      .single();

    if (queryError || !adminUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Return user data
    res.json({
      success: true,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
        createdAt: adminUser.created_at
      }
    });

  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred during verification'
    });
  }
});

/**
 * POST /api/admin/logout
 * Logout admin user
 * Requires: Authorization header with Bearer token
 */
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Log the logout event
    const logoutTime = new Date().toISOString();
    
    console.log(`Admin logout: ${req.user.email} at ${logoutTime}`);
    
    // In the future, we could:
    // 1. Add token to blacklist table
    // 2. Log logout event to database
    // 3. Invalidate refresh tokens
    
    // For now, we just acknowledge the logout
    // The client will remove the token from storage
    res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred during logout'
    });
  }
});

/**
 * GET /api/admin/stats
 * Get dashboard statistics
 * Requires: Authorization header with Bearer token
 */
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Get total articles count
    const { count: articlesCount, error: articlesError } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true });

    if (articlesError) {
      console.error('Error fetching articles count:', articlesError);
    }

    // Get total daily tech updates count
    const { count: updatesCount, error: updatesError } = await supabase
      .from('updates')
      .select('*', { count: 'exact', head: true });

    if (updatesError) {
      console.error('Error fetching updates count:', updatesError);
    }

    // Get recent login activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: recentLogins, error: loginsError } = await supabase
      .from('admin_login_logs')
      .select('id')
      .gte('login_time', sevenDaysAgo.toISOString())
      .eq('success', true);

    if (loginsError) {
      console.error('Error fetching login logs:', loginsError);
    }

    // Return statistics
    res.json({
      success: true,
      stats: {
        totalArticles: articlesCount || 0,
        totalUpdates: updatesCount || 0,
        recentActivity: recentLogins?.length || 0
      }
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while fetching statistics'
    });
  }
});

/**
 * GET /api/admin/users
 * Get list of all admin users (super_admin only)
 * Requires: Authorization header with Bearer token
 * Requires: super_admin role
 */
router.get('/users', authenticateToken, async (req, res) => {
  try {
    // Verify user is super_admin
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Super admin privileges required.'
      });
    }

    // Fetch all admin users
    const { data: adminUsers, error: queryError } = await supabase
      .from('admin_users')
      .select('id, email, role, created_at')
      .order('created_at', { ascending: false });

    if (queryError) {
      console.error('Error fetching admin users:', queryError);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch admin users'
      });
    }

    res.json({
      success: true,
      users: adminUsers
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while fetching admin users'
    });
  }
});

/**
 * POST /api/admin/users
 * Create a new admin user (super_admin only)
 * Requires: Authorization header with Bearer token
 * Requires: super_admin role
 */
router.post('/users', authenticateToken, async (req, res) => {
  try {
    // Verify user is super_admin
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Super admin privileges required.'
      });
    }

    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Password does not meet requirements',
        details: passwordValidation.errors
      });
    }

    // Check if email already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'An admin user with this email already exists'
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Insert new admin user with role='admin'
    const { data: newUser, error: insertError } = await supabase
      .from('admin_users')
      .insert({
        email: email,
        password_hash: passwordHash,
        role: 'admin'
      })
      .select('id, email, role, created_at')
      .single();

    if (insertError) {
      console.error('Error creating admin user:', insertError);
      return res.status(500).json({
        success: false,
        error: 'Failed to create admin user'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      user: newUser
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while creating admin user'
    });
  }
});

/**
 * DELETE /api/admin/users/:id
 * Delete an admin user (super_admin only)
 * Requires: Authorization header with Bearer token
 * Requires: super_admin role
 */
router.delete('/users/:id', authenticateToken, async (req, res) => {
  try {
    // Verify user is super_admin
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Super admin privileges required.'
      });
    }

    const { id } = req.params;

    // Validate ID format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID format'
      });
    }

    // Prevent deletion of own account
    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete your own account'
      });
    }

    // Check if user exists
    const { data: userToDelete, error: checkError } = await supabase
      .from('admin_users')
      .select('id, email')
      .eq('id', id)
      .single();

    if (checkError || !userToDelete) {
      return res.status(404).json({
        success: false,
        error: 'Admin user not found'
      });
    }

    // Delete the admin user
    const { error: deleteError } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting admin user:', deleteError);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete admin user'
      });
    }

    res.json({
      success: true,
      message: 'Admin user deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while deleting admin user'
    });
  }
});

/**
 * GET /api/admin/login-logs
 * Get paginated login history
 * Requires: Authorization header with Bearer token
 * Query params: page, limit, startDate, endDate, userId
 */
router.get('/login-logs', authenticateToken, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      startDate, 
      endDate, 
      userId 
    } = req.query;

    // Parse pagination params
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // Build query
    let query = supabase
      .from('admin_login_logs')
      .select('*, admin_users!admin_login_logs_admin_user_id_fkey(email)', { count: 'exact' })
      .order('login_time', { ascending: false });

    // Apply filters
    if (startDate) {
      query = query.gte('login_time', startDate);
    }

    if (endDate) {
      query = query.lte('login_time', endDate);
    }

    if (userId) {
      query = query.eq('admin_user_id', userId);
    }

    // Apply pagination
    query = query.range(offset, offset + limitNum - 1);

    const { data: logs, error: queryError, count } = await query;

    if (queryError) {
      console.error('Error fetching login logs:', queryError);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch login logs'
      });
    }

    // Format the response
    const formattedLogs = logs.map(log => ({
      id: log.id,
      email: log.email || log.admin_users?.email || 'Unknown',
      loginTime: log.login_time,
      ipAddress: log.ip_address,
      userAgent: log.user_agent,
      success: log.success
    }));

    res.json({
      success: true,
      logs: formattedLogs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count,
        totalPages: Math.ceil(count / limitNum)
      }
    });

  } catch (error) {
    console.error('Login logs error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while fetching login logs'
    });
  }
});

export default router;
