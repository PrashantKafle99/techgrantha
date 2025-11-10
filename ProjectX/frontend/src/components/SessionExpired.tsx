import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface SessionExpiredProps {
  message?: string;
  redirectDelay?: number;
}

/**
 * SessionExpired component
 * Shows when user's session has expired
 * Automatically redirects to login after delay
 */
export function SessionExpired({ 
  message = 'Your session has expired. Please log in again.',
  redirectDelay = 3000 
}: SessionExpiredProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/admin/login', { replace: true });
    }, redirectDelay);

    return () => clearTimeout(timer);
  }, [navigate, redirectDelay]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-yellow-100">
            <svg
              className="h-12 w-12 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Session Expired</h1>
        
        <p className="text-gray-600 mb-8">{message}</p>

        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span>Redirecting to login...</span>
        </div>

        <button
          onClick={() => navigate('/admin/login', { replace: true })}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Login Now
        </button>
      </div>
    </div>
  );
}

export default SessionExpired;
