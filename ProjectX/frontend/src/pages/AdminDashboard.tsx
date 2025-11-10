import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface DashboardStats {
  articles: {
    total: number;
    today: number;
    last7Days: number;
  };
  updates: {
    total: number;
    today: number;
    last7Days: number;
  };
}

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  pageTypeBreakdown: {
    home?: number;
    article?: number;
    'daily-tech'?: number;
    'article-detail'?: number;
  };
  topArticles: Array<{
    article_id: string;
    view_count: number;
    unique_visitors: number;
  }>;
}

interface LoginLog {
  id: string;
  email: string;
  loginTime: string;
  success: boolean;
}

export function AdminDashboard() {
  const { user, logout, isSuperAdmin, token } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    articles: { total: 0, today: 0, last7Days: 0 },
    updates: { total: 0, today: 0, last7Days: 0 }
  });
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViews: 0,
    uniqueVisitors: 0,
    pageTypeBreakdown: {},
    topArticles: []
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  const [recentLogins, setRecentLogins] = useState<LoginLog[]>([]);
  const [isLoadingLogins, setIsLoadingLogins] = useState(true);

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch articles
        const articlesResponse = await fetch(`${API_URL}/api/articles?published=false`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const articlesData = await articlesResponse.json();
        const allArticles = articlesData.articles || [];

        // Fetch updates
        const updatesResponse = await fetch(`${API_URL}/api/updates`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const updatesData = await updatesResponse.json();
        const allUpdates = updatesData.updates || [];

        // Calculate date ranges
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Calculate article stats
        const articlesToday = allArticles.filter((article: any) => 
          new Date(article.created_at) >= todayStart
        ).length;
        
        const articlesLast7Days = allArticles.filter((article: any) => 
          new Date(article.created_at) >= sevenDaysAgo
        ).length;

        // Calculate update stats
        const updatesToday = allUpdates.filter((update: any) => 
          new Date(update.created_at) >= todayStart
        ).length;
        
        const updatesLast7Days = allUpdates.filter((update: any) => 
          new Date(update.created_at) >= sevenDaysAgo
        ).length;

        setStats({
          articles: {
            total: allArticles.length,
            today: articlesToday,
            last7Days: articlesLast7Days
          },
          updates: {
            total: allUpdates.length,
            today: updatesToday,
            last7Days: updatesLast7Days
          }
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token]);

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`${API_URL}/api/analytics/dashboard?days=30`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // If analytics tables don't exist yet, just skip
          console.log('Analytics not available yet - run migration 012');
          setIsLoadingAnalytics(false);
          return;
        }

        const data = await response.json();
        if (data.success && data.analytics) {
          setAnalytics(data.analytics);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
        // Don't break the page if analytics fail
      } finally {
        setIsLoadingAnalytics(false);
      }
    };

    if (token) {
      fetchAnalytics();
    }
  }, [token]);

  // Fetch recent login history (super admin only)
  useEffect(() => {
    const fetchRecentLogins = async () => {
      // Only fetch if user is super admin
      if (!isSuperAdmin()) {
        setIsLoadingLogins(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/admin/login-logs?page=1&limit=5`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch login logs');
        }

        const data = await response.json();
        if (data.success && data.logs) {
          setRecentLogins(data.logs);
        }
      } catch (error) {
        console.error('Error fetching login logs:', error);
      } finally {
        setIsLoadingLogins(false);
      }
    };

    if (token) {
      fetchRecentLogins();
    }
  }, [token, isSuperAdmin]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 py-4 sm:h-16 sm:py-0">
            <div>
              <h1 className="font-serif text-xl sm:text-2xl text-gray-900">Tech Grantha</h1>
              <p className="text-xs sm:text-sm text-gray-500">Admin Dashboard</p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="text-left sm:text-right flex-1 sm:flex-none">
                <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="shrink-0">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-serif text-gray-900 mb-2">
            Welcome back!
          </h2>
          <p className="text-gray-600">
            Manage your content and settings from here.
          </p>
        </div>

        {/* Content Stats Grid */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Overview</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
          {/* Articles Stats */}
          <Card>
            <CardHeader>
              <CardDescription>Articles</CardDescription>
              <CardTitle className="text-3xl">
                {isLoadingStats ? (
                  <span className="text-gray-400">...</span>
                ) : (
                  stats.articles.total
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Today:</span>
                  <span className="text-sm font-semibold text-green-600">
                    {isLoadingStats ? '...' : `+${stats.articles.today}`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last 7 days:</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {isLoadingStats ? '...' : `+${stats.articles.last7Days}`}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm text-gray-600">Total:</span>
                  <span className="text-sm font-bold text-gray-900">
                    {isLoadingStats ? '...' : stats.articles.total}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Updates Stats */}
          <Card>
            <CardHeader>
              <CardDescription>Daily Tech Updates</CardDescription>
              <CardTitle className="text-3xl">
                {isLoadingStats ? (
                  <span className="text-gray-400">...</span>
                ) : (
                  stats.updates.total
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Today:</span>
                  <span className="text-sm font-semibold text-green-600">
                    {isLoadingStats ? '...' : `+${stats.updates.today}`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last 7 days:</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {isLoadingStats ? '...' : `+${stats.updates.last7Days}`}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm text-gray-600">Total:</span>
                  <span className="text-sm font-bold text-gray-900">
                    {isLoadingStats ? '...' : stats.updates.total}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Visitor Analytics Section */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Visitor Analytics (Last 30 Days)</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardDescription>Total Page Views</CardDescription>
              <CardTitle className="text-3xl">
                {isLoadingAnalytics ? (
                  <span className="text-gray-400">...</span>
                ) : (
                  analytics.totalViews.toLocaleString()
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">All pages visited</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Unique Visitors</CardDescription>
              <CardTitle className="text-3xl">
                {isLoadingAnalytics ? (
                  <span className="text-gray-400">...</span>
                ) : (
                  analytics.uniqueVisitors.toLocaleString()
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Individual visitors</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Article Reads</CardDescription>
              <CardTitle className="text-3xl">
                {isLoadingAnalytics ? (
                  <span className="text-gray-400">...</span>
                ) : (
                  ((analytics.pageTypeBreakdown['article-detail'] || 0) + (analytics.pageTypeBreakdown['article'] || 0)).toLocaleString()
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Articles viewed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Home Page Views</CardDescription>
              <CardTitle className="text-3xl">
                {isLoadingAnalytics ? (
                  <span className="text-gray-400">...</span>
                ) : (
                  (analytics.pageTypeBreakdown['home'] || 0).toLocaleString()
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Homepage visits</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col items-start"
                onClick={() => navigate('/admin/articles')}
              >
                <span className="font-medium">Articles</span>
                <span className="text-xs text-gray-500">Manage articles</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col items-start"
                onClick={() => navigate('/admin/updates')}
              >
                <span className="font-medium">Daily Tech</span>
                <span className="text-xs text-gray-500">Manage updates</span>
              </Button>
              
              {isSuperAdmin() && (
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex flex-col items-start"
                  onClick={() => navigate('/admin/users')}
                >
                  <span className="font-medium">Admin Users</span>
                  <span className="text-xs text-gray-500">Manage admins</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Login Activity - Super Admin Only */}
        {isSuperAdmin() && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Login Activity</CardTitle>
                  <CardDescription>Latest login attempts</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingLogins ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  <p className="mt-2 text-gray-600">Loading login history...</p>
                </div>
              ) : recentLogins.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No recent login activity</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentLogins.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${log.success ? 'bg-green-500' : 'bg-red-500'}`} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{log.email}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(log.loginTime).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        log.success 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {log.success ? 'Success' : 'Failed'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
