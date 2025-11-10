// Test Supabase connection
import { supabase } from './supabase.ts';

export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('Supabase Key (first 20 chars):', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('updates')
      .select('count(*)')
      .single();
    
    if (error) {
      console.error('Supabase connection error:', error);
      return { success: false, error };
    }
    
    console.log('Supabase connection successful!', data);
    return { success: true, data };
  } catch (err) {
    console.error('Supabase test failed:', err);
    return { success: false, error: err };
  }
};

// Auto-run test in development
if (import.meta.env.DEV) {
  testSupabaseConnection();
}