import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
}

/**
 * Custom hook for making authenticated API requests
 * Automatically handles token expiration and redirects to login
 */
export function useAuthenticatedFetch() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const authenticatedFetch = useCallback(
    async (endpoint: string, options: FetchOptions = {}) => {
      const { requiresAuth = true, headers = {}, ...restOptions } = options;

      // Prepare headers
      const fetchHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(headers as Record<string, string>),
      };

      // Add authorization header if required
      if (requiresAuth && token) {
        fetchHeaders['Authorization'] = `Bearer ${token}`;
      }

      try {
        const response = await fetch(`${API_URL}${endpoint}`, {
          ...restOptions,
          headers: fetchHeaders,
        });

        // Handle token expiration
        if (response.status === 401) {
          const data = await response.json();
          
          if (data.code === 'TOKEN_EXPIRED' || data.error === 'Invalid token') {
            // Token expired or invalid
            await logout();
            navigate('/admin/login', { 
              state: { 
                message: 'Your session has expired. Please log in again.',
                from: window.location.pathname 
              },
              replace: true 
            });
            throw new Error('Session expired');
          }
        }

        return response;
      } catch (error) {
        console.error('Fetch error:', error);
        throw error;
      }
    },
    [token, logout, navigate]
  );

  return authenticatedFetch;
}

export default useAuthenticatedFetch;
