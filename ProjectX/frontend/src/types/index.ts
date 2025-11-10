// Core data models
export interface Update {
  id: string;
  title: string;
  summary: string;
  thumbnail_url: string;
  image_source?: string | null;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  type: 'article' | 'case-study';
  featured_image: string;
  image_public_id?: string;
  image_source?: string | null;
  author: string | null;
  published_at: string;
  created_at?: string;
  updated_at?: string;
  // Legacy fields for backward compatibility
  body?: string;
  banner_url?: string;
}

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

// API response wrapper
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Form data interfaces
export interface CreateUpdateData {
  title: string;
  summary: string;
  thumbnail_url: string;
}

export interface CreateArticleData {
  title: string;
  content: string;
  excerpt: string;
  type?: 'article' | 'case-study';
  featured_image?: string;
  image_public_id?: string;
  author: string;
  published?: boolean;
}

// Component props interfaces
export interface UpdateCardProps {
  update: Update;
}

export interface ArticleCardProps {
  article: Article;
}

export interface ImageUploaderProps {
  onUpload: (url: string) => void;
  onError: (error: string) => void;
  accept?: string;
  maxSize?: number;
}

// Auth context interface
export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}