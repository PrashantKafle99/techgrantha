export interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'admin';
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: AdminUser;
}

export interface VerifyResponse {
  success: boolean;
  user: AdminUser;
}

export interface AuthState {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  isSuperAdmin: () => boolean;
  clearError: () => void;
}
