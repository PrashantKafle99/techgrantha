import express from 'express';
import { supabase } from '../utils/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/analytics/track
 * Track a page view (public endpoint)
 */
router.post('/track', async (req, res) => {
  try {
    const {
      pageType,
      pageId = null,
      visitorId,
      userAgent = null,
      referrer = null
    } = req.body;

    if (!pageType || !visitorId) {
      return res.status(400).json({
        success: false,
        error: 'pageType and visitorId are required'
      });
    }

    // Insert page view
    const { error } = await supabase
      .from('page_views')
      .insert({
        page_type: pageType,
        page_id: pageId,
        visitor_id: visitorId,
        user_agent: userAgent,
        referrer: referrer
      });

    if (error) {
      console.error('Error tracking page view:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to track page view'
      });
    }

    res.json({ success: true });

  } catch (error) {
    console.error('Track error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while tracking'
    });
  }
});

/**
 * GET /api/analytics/dashboard
 * Get dashboard analytics (requires authentication)
 */
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));

    // Get total stats
    const { data: totalViews, error: viewsError } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', daysAgo.toISOString());

    const { data: uniqueVisitors, error: visitorsError } = await supabase
      .from('page_views')
      .select('visitor_id')
      .gte('created_at', daysAgo.toISOString());

    // Get daily analytics
    const { data: dailyStats, error: dailyError } = await supabase
      .from('analytics_daily')
      .select('*')
      .gte('date', daysAgo.toISOString().split('T')[0])
      .order('date', { ascending: false });

    // Get top articles
    const { data: topArticles, error: articlesError } = await supabase
      .from('article_views')
      .select('article_id, view_count, unique_visitors')
      .order('view_count', { ascending: false })
      .limit(10);

    // Get page type breakdown
    const { data: pageTypeStats, error: pageTypeError } = await supabase
      .from('page_views')
      .select('page_type')
      .gte('created_at', daysAgo.toISOString());

    if (viewsError || visitorsError || dailyError || articlesError || pageTypeError) {
      throw new Error('Failed to fetch analytics data');
    }

    // Calculate unique visitors
    const uniqueVisitorIds = new Set(uniqueVisitors?.map(v => v.visitor_id) || []);

    // Calculate page type breakdown
    const pageTypeBreakdown = {};
    pageTypeStats?.forEach(stat => {
      pageTypeBreakdown[stat.page_type] = (pageTypeBreakdown[stat.page_type] || 0) + 1;
    });

    res.json({
      success: true,
      analytics: {
        totalViews: totalViews?.length || 0,
        uniqueVisitors: uniqueVisitorIds.size,
        dailyStats: dailyStats || [],
        topArticles: topArticles || [],
        pageTypeBreakdown
      }
    });

  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics'
    });
  }
});

/**
 * GET /api/analytics/realtime
 * Get real-time analytics (last 24 hours)
 */
router.get('/realtime', authenticateToken, async (req, res) => {
  try {
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);

    const { data: recentViews, error } = await supabase
      .from('page_views')
      .select('*')
      .gte('created_at', last24Hours.toISOString())
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      throw new Error('Failed to fetch real-time data');
    }

    // Calculate hourly breakdown
    const hourlyBreakdown = {};
    recentViews?.forEach(view => {
      const hour = new Date(view.created_at).getHours();
      hourlyBreakdown[hour] = (hourlyBreakdown[hour] || 0) + 1;
    });

    const uniqueVisitors = new Set(recentViews?.map(v => v.visitor_id) || []);

    res.json({
      success: true,
      realtime: {
        last24Hours: recentViews?.length || 0,
        uniqueVisitors: uniqueVisitors.size,
        hourlyBreakdown,
        recentViews: recentViews?.slice(0, 20) || []
      }
    });

  } catch (error) {
    console.error('Real-time analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch real-time analytics'
    });
  }
});

export default router;
