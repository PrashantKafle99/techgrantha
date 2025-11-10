import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: 'super_admin' | 'admin';
}

/**
 * RoleProtectedRoute component
 * Extends ProtectedRoute to check user role
 * Shows access denied if user doesn't have required role
 */
export function RoleProtectedRoute({ children, requiredRole }: RoleProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  return (
    <ProtectedRoute>
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      ) : user?.role === requiredRole ? (
        <>{children}</>
      ) : (
        <Navigate to="/admin/access-denied" replace />
      )}
    </ProtectedRoute>
  );
}

export default RoleProtectedRoute;
