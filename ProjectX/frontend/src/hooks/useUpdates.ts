import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.ts';
import type { Update } from '../types/index.ts';

interface UseUpdatesOptions {
  limit?: number;
  autoFetch?: boolean;
}

interface UseUpdatesReturn {
  updates: Update[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUpdates = (options: UseUpdatesOptions = {}): UseUpdatesReturn => {
  const { limit = 12, autoFetch = true } = options;

  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from Supabase first

      console.log('Fetching updates from Supabase...');
      const { data, error: supabaseError } = await supabase
        .from('updates')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      console.log('Supabase response:', { data, error: supabaseError });

      if (supabaseError) {
        throw supabaseError;
      }

      setUpdates(data || []);
    } catch (err) {
      console.error('Error fetching updates:', err);
      setError(err instanceof Error ? err.message : 'Failed to load updates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchUpdates();
    }
  }, [limit, autoFetch]);

  return {
    updates,
    loading,
    error,
    refetch: fetchUpdates,
  };
};