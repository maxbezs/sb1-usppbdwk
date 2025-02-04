import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface SaveState {
  field: string;
  status: 'saving' | 'saved' | 'error';
  message?: string;
  timestamp: number;
}

interface Contact {
  id: string;
  type: 'Phone' | 'Telegram' | 'Email' | 'Address' | 'Calendar link' | 'Other';
  customType?: string;
  value: string;
  order: number;
}

interface Product {
  id: string;
  name: string;
  price: string;
  purchase_url: string;
  image_url: string | null;
  order: number;
}

interface Profile {
  id: string;
  display_name: string | null;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  headline: string | null;
  permission_level: 'User' | 'Admin';
  has_advanced_access: boolean;
  social_links: Array<{
    id: string;
    title: string;
    url: string;
    order: number;
  }>;
  experiences: Array<{
    id: string;
    company: string;
    role: string;
    description: string;
    order: number;
  }>;
  products: Array<Product>;
  contacts: Array<Contact>;
}

interface ProfileStore {
  profile: Profile | null;
  saveStates: Record<string, SaveState>;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  loadProfile: () => Promise<void>;
  updateField: (field: string, value: any) => Promise<void>;
  checkUsername: (username: string) => Promise<boolean>;
  updateLinks: (links: any[]) => Promise<void>;
  updateExperiences: (experiences: any[]) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  uploadProductImage: (file: File) => Promise<string>;
  updateProducts: (products: Product[]) => Promise<void>;
  updateContacts: (contacts: Contact[]) => Promise<void>;
  isAdmin: () => boolean;
  updatePermissionLevel: (userId: string, level: 'User' | 'Admin') => Promise<void>;
}

export const useProfileStore = create<ProfileStore>((set, get) => {
  // Create the store object first
  const store = {
    profile: null,
    saveStates: {},
    loading: false,
    error: null,
    initialized: false,

    isAdmin: () => get().profile?.permission_level === 'Admin',

    loadProfile: async () => {
      try {
        if (get().loading) return;
        
        set({ loading: true, error: null });

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          set({ 
            profile: null,
            initialized: true,
            loading: false 
          });
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select(`
            *,
            social_links (
              id,
              title,
              url,
              order
            ),
            experiences (
              id,
              company,
              role,
              description,
              type,
              order
            ),
            products (
              id,
              name,
              price,
              purchase_url,
              image_url,
              order
            ),
            contacts (
              id,
              type,
              custom_type,
              value,
              order
            )
          `)
          .eq('id', user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert({ 
                id: user.id,
                has_advanced_access: false,
                permission_level: 'User'
              })
              .select()
              .single();

            if (createError) throw createError;
            
            set({ 
              profile: {
                ...newProfile,
                social_links: [],
                experiences: [],
                products: [],
                contacts: []
              },
              initialized: true,
              loading: false
            });
            return;
          }
          throw error;
        }

        set({ 
          profile: {
            ...profile,
            social_links: profile.social_links || [],
            experiences: profile.experiences || [],
            products: profile.products || [],
            contacts: profile.contacts || []
          },
          initialized: true,
          loading: false
        });
      } catch (error: any) {
        const errorMessage = error.message || 'Failed to load profile';
        set({ 
          error: errorMessage,
          initialized: true,
          loading: false
        });
        console.error('Error loading profile:', error);
      }
    },

    updatePermissionLevel: async (userId: string, level: 'User' | 'Admin') => {
      try {
        if (!get().isAdmin()) {
          throw new Error('Only admins can update permission levels');
        }

        const { error } = await supabase
          .from('profiles')
          .update({ permission_level: level })
          .eq('id', userId);

        if (error) throw error;
      } catch (error: any) {
        console.error('Error updating permission level:', error);
        throw error;
      }
    },

    updateField: async (field: string, value: any) => {
      try {
        set(state => ({
          saveStates: {
            ...state.saveStates,
            [field]: { field, status: 'saving', timestamp: Date.now() }
          }
        }));

        const { error } = await supabase
          .from('profiles')
          .update({ [field]: value })
          .eq('id', get().profile?.id);

        if (error) throw error;

        set(state => ({
          profile: state.profile ? { ...state.profile, [field]: value } : null,
          saveStates: {
            ...state.saveStates,
            [field]: { field, status: 'saved', timestamp: Date.now() }
          }
        }));

        setTimeout(() => {
          set(state => ({
            saveStates: {
              ...state.saveStates,
              [field]: undefined
            }
          }));
        }, 3000);
      } catch (error: any) {
        set(state => ({
          saveStates: {
            ...state.saveStates,
            [field]: { 
              field, 
              status: 'error', 
              message: error.message,
              timestamp: Date.now()
            }
          }
        }));
      }
    },

    checkUsername: async (username: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', username)
          .single();

        if (error && error.code === 'PGRST116') {
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    },

    updateLinks: async (links) => {
      try {
        const { error } = await supabase
          .from('social_links')
          .upsert(
            links.map((link, index) => ({
              ...link,
              profile_id: get().profile?.id,
              order: index
            }))
          );

        if (error) throw error;

        set(state => ({
          profile: state.profile ? { ...state.profile, social_links: links } : null
        }));
      } catch (error: any) {
        console.error('Error updating links:', error);
        throw error;
      }
    },

    updateExperiences: async (experiences) => {
      try {
        const { error } = await supabase
          .from('experiences')
          .upsert(
            experiences.map((exp, index) => ({
              ...exp,
              profile_id: get().profile?.id,
              order: index
            }))
          );

        if (error) throw error;

        set(state => ({
          profile: state.profile ? { ...state.profile, experiences } : null
        }));
      } catch (error: any) {
        console.error('Error updating experiences:', error);
        throw error;
      }
    },

    updateProducts: async (products) => {
      try {
        const { error } = await supabase
          .from('products')
          .upsert(
            products.map((product, index) => ({
              ...product,
              profile_id: get().profile?.id,
              order: index
            }))
          );

        if (error) throw error;

        set(state => ({
          profile: state.profile ? { ...state.profile, products } : null
        }));
      } catch (error: any) {
        console.error('Error updating products:', error);
        throw error;
      }
    },

    updateContacts: async (contacts) => {
      try {
        const { error } = await supabase
          .from('contacts')
          .upsert(
            contacts.map((contact, index) => ({
              ...contact,
              profile_id: get().profile?.id,
              order: index
            }))
          );

        if (error) throw error;

        set(state => ({
          profile: state.profile ? { ...state.profile, contacts } : null
        }));
      } catch (error: any) {
        console.error('Error updating contacts:', error);
        throw error;
      }
    },

    uploadAvatar: async (file: File) => {
      try {
        const userId = get().profile?.id;
        if (!userId) throw new Error('No user ID found');

        const { data: existingFiles } = await supabase.storage
          .from('avatars')
          .list(userId);

        if (existingFiles?.length) {
          await supabase.storage
            .from('avatars')
            .remove(existingFiles.map(file => `${userId}/${file.name}`));
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        await get().updateField('avatar_url', publicUrl);

        return publicUrl;
      } catch (error: any) {
        console.error('Error uploading avatar:', error);
        throw error;
      }
    },

    uploadProductImage: async (file: File) => {
      try {
        const userId = get().profile?.id;
        if (!userId) throw new Error('No user ID found');

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);

        return publicUrl;
      } catch (error: any) {
        console.error('Error uploading product image:', error);
        throw error;
      }
    }
  };

  // Initialize auth state after store is created
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (!session) {
      set({ initialized: true });
    } else {
      store.loadProfile();
    }
  });

  // Listen for auth changes after store is created
  supabase.auth.onAuthStateChange((_event, session) => {
    if (!session) {
      set({ 
        profile: null,
        initialized: true,
        error: null 
      });
    } else {
      store.loadProfile();
    }
  });

  return store;
});