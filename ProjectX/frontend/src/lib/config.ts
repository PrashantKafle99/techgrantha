// Configuration utilities
export const isSupabaseConfigured = (): boolean => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  return !!(
    supabaseUrl && 
    supabaseKey && 
    supabaseUrl !== 'your_supabase_project_url_here' && 
    supabaseKey !== 'your_supabase_anon_key_here' &&
    supabaseUrl.startsWith('https://') &&
    supabaseKey.length > 20
  );
};

export const getSupabaseConfig = () => ({
  url: import.meta.env.VITE_SUPABASE_URL,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  configured: isSupabaseConfigured(),
});