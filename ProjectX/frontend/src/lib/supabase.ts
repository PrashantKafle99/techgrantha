import { createClient } from '@supabase/supabase-js';
import { isSupabaseConfigured } from './config.ts';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Create client even if not configured (for development)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export configuration status
export const isConfigured = isSupabaseConfigured();

// Database type definitions for better TypeScript support
export type Database = {
  public: {
    Tables: {
      updates: {
        Row: {
          id: string;
          title: string;
          summary: string;
          thumbnail_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          summary: string;
          thumbnail_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          summary?: string;
          thumbnail_url?: string;
          created_at?: string;
        };
      };
      articles: {
        Row: {
          id: string;
          title: string;
          body: string;
          type: 'article' | 'case-study';
          banner_url: string;
          author: string;
          published_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          body: string;
          type: 'article' | 'case-study';
          banner_url: string;
          author: string;
          published_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          body?: string;
          type?: 'article' | 'case-study';
          banner_url?: string;
          author?: string;
          published_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          role: 'user' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: 'user' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: 'user' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};