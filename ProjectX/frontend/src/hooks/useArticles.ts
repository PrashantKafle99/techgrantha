import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.ts';
import type { Article } from '../types/index.ts';

interface UseArticlesOptions {
  limit?: number;
  type?: 'article' | 'case-study';
  autoFetch?: boolean;
}

interface UseArticlesReturn {
  articles: Article[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useArticles = (options: UseArticlesOptions = {}): UseArticlesReturn => {
  const { limit = 12, type, autoFetch = true } = options;
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from Supabase first

      let query = supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false });

      if (type) {
        query = query.eq('type', type);
      }

      if (limit) {
        query = query.limit(limit);
      }

      console.log('Fetching articles from Supabase...');
      const { data, error: supabaseError } = await query;

      console.log('Supabase articles response:', { data, error: supabaseError });

      if (supabaseError) {
        throw supabaseError;
      }

      setArticles(data || []);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError(err instanceof Error ? err.message : 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchArticles();
    }
  }, [limit, type, autoFetch]);

  return {
    articles,
    loading,
    error,
    refetch: fetchArticles,
  };
};