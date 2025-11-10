import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/index.ts';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage.tsx';
import ArticlesPage from './pages/ArticlesPage.tsx';
import ArticleDetailPage from './pages/ArticleDetailPage.tsx';
import DailyTechPage from './pages/DailyTechPage.tsx';
import AdminLoginPage from './pages/AdminLoginPage.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import AdminManagementPage from './pages/AdminManagementPage.tsx';
import ArticleManagementPage from './pages/ArticleManagementPage.tsx';
import UpdateManagementPage from './pages/UpdateManagementPage.tsx';
import ImageUploadTestPage from './pages/ImageUploadTestPage.tsx';
import AccessDenied from './pages/AccessDenied.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';
import { RoleProtectedRoute } from './components/RoleProtectedRoute.tsx';
import './lib/testSupabase.ts'; // Auto-run Supabase connection test

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/article" element={<ArticlesPage />} />
            <Route path="/article/:id" element={<ArticleDetailPage />} />
            <Route path="/dailytech" element={<DailyTechPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/access-denied" element={<AccessDenied />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <RoleProtectedRoute requiredRole="super_admin">
                  <AdminManagementPage />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="/admin/articles" 
              element={
                <ProtectedRoute>
                  <ArticleManagementPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/updates" 
              element={
                <ProtectedRoute>
                  <UpdateManagementPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/test-upload" 
              element={
                <ProtectedRoute>
                  <ImageUploadTestPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;