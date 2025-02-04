import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create a single instance of the Supabase client with enhanced retry and auth configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window.localStorage,
    storageKey: 'supabase.auth.token',
    // Add cookie options for better session persistence
    cookieOptions: {
      name: 'sb-auth-token',
      lifetime: 60 * 60 * 24 * 7, // 1 week
      domain: window.location.hostname,
      path: '/',
      sameSite: 'lax'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'x-client-info': 'supabase-js/2.39.7'
    },
    fetch: async (url, options = {}) => {
      const MAX_RETRIES = 3;
      const INITIAL_BACKOFF = 1000; // 1 second

      let attempt = 0;
      while (attempt < MAX_RETRIES) {
        try {
          const response = await fetch(url, {
            ...options,
            // Increase timeout for slower connections
            signal: AbortSignal.timeout(10000) // 10 second timeout
          });

          // Handle auth errors specifically
          if (response.status === 401) {
            // Try to refresh the session
            const { data: { session }, error: refreshError } = await supabase.auth.getSession();
            if (!refreshError && session) {
              // Update headers with new token
              const newOptions = {
                ...options,
                headers: {
                  ...options.headers,
                  Authorization: `Bearer ${session.access_token}`
                }
              };
              // Retry the original request with the new session
              continue;
            }
            // If refresh fails, clear session and throw error
            await supabase.auth.signOut();
            throw new Error('Session expired. Please sign in again.');
          }

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
          }

          return response;
        } catch (error: any) {
          attempt++;
          
          // If it's the last attempt, throw the error
          if (attempt === MAX_RETRIES) {
            console.error('Supabase request failed after max retries:', error);
            throw error;
          }

          // Calculate exponential backoff with jitter
          const backoff = INITIAL_BACKOFF * Math.pow(2, attempt - 1) * (0.5 + Math.random() * 0.5);
          await new Promise(resolve => setTimeout(resolve, backoff));
        }
      }

      throw new Error('Unexpected error in fetch retry logic');
    }
  }
});

// Enhanced connection check with retry logic
export const checkSupabaseConnection = async () => {
  const MAX_RETRIES = 3;
  const INITIAL_BACKOFF = 1000;
  
  let attempt = 0;
  while (attempt < MAX_RETRIES) {
    try {
      // First check if we have a valid session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return false;
      }

      const { data, error } = await supabase.from('profiles').select('id').limit(1);
      if (error) throw error;
      return true;
    } catch (error) {
      attempt++;
      
      if (attempt === MAX_RETRIES) {
        console.error('Supabase connection error:', error);
        return false;
      }

      const backoff = INITIAL_BACKOFF * Math.pow(2, attempt - 1) * (0.5 + Math.random() * 0.5);
      await new Promise(resolve => setTimeout(resolve, backoff));
    }
  }

  return false;
};