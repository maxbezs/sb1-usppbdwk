import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => {
  // Initialize auth state from existing session
  supabase.auth.getSession().then(({ data: { session } }) => {
    set({ 
      user: session?.user ?? null,
      session,
      initialized: true 
    });
  });

  // Listen for auth changes
  supabase.auth.onAuthStateChange((_event, session) => {
    set({ 
      user: session?.user ?? null,
      session,
      error: null // Clear any previous errors
    });
  });

  return {
    user: null,
    session: null,
    loading: false,
    error: null,
    initialized: false,

    setUser: (user) => set({ user }),
    setSession: (session) => set({ session }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    refreshSession: async () => {
      try {
        const { data: { session }, error } = await supabase.auth.refreshSession();
        if (error) throw error;
        if (session) {
          set({ 
            user: session.user,
            session,
            error: null 
          });
        }
      } catch (error: any) {
        set({ error: error.message });
        throw error;
      }
    },

    signIn: async (email, password) => {
      try {
        set({ loading: true, error: null });
        const { data, error } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        });
        
        if (error) throw error;
        
        set({ 
          user: data.user,
          session: data.session,
          error: null 
        });
      } catch (error: any) {
        set({ error: error.message });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    signUp: async (email, password) => {
      try {
        set({ loading: true, error: null });
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              email_confirmed: true // Skip email confirmation
            }
          }
        });
        
        if (error) throw error;
        
        set({ 
          user: data.user,
          session: data.session,
          error: null 
        });
      } catch (error: any) {
        set({ error: error.message });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    signOut: async () => {
      try {
        set({ loading: true, error: null });
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        set({ 
          user: null,
          session: null,
          error: null 
        });
      } catch (error: any) {
        set({ error: error.message });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    resetPassword: async (email) => {
      try {
        set({ loading: true, error: null });
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
      } catch (error: any) {
        set({ error: error.message });
        throw error;
      } finally {
        set({ loading: false });
      }
    },
  };
});