import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { supabase, UserProfile } from '../../lib/supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { AuthResponse, SignUpData } from '../../types/app';
import { useNetwork } from './NetworkContext';
import { useOfflineQueue, QueuedAction, ActionHandler, OfflineQueueProvider } from './OfflineQueueContext';

// Define context types
type AuthContextType = {
  user: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, userData: SignUpData) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isOfflineMode: boolean;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to fetch user profile
const fetchUserProfile = async (email: string): Promise<UserProfile | null> => {
  try {
    // Try to find user in entrepreneurs table first
    const { data: entrepreneur, error: eError } = await supabase
      .from('entrepreneurs')
      .select('*')
      .eq('email', email)
      .single();

    if (!eError && entrepreneur) {
      return {
        id: entrepreneur.id,
        name: entrepreneur.name,
        email: entrepreneur.email,
        phone: entrepreneur.phone,
        city: entrepreneur.city,
        country: entrepreneur.country,
        avatar_url: entrepreneur.avatar_url,
        dob: entrepreneur.dob,
        gender: entrepreneur.gender,
        address: entrepreneur.address,
        role: 'entrepreneur',
        created_at: entrepreneur.created_at,
        updated_at: entrepreneur.updated_at
      };
    }

    // Try owners table
    const { data: owner, error: oError } = await supabase
      .from('owners')
      .select('*')
      .eq('email', email)
      .single();

    if (!oError && owner) {
      return {
        id: owner.id,
        name: owner.name,
        email: owner.email,
        phone: owner.phone,
        city: owner.city,
        country: owner.country,
        avatar_url: owner.avatar_url,
        dob: owner.dob,
        gender: owner.gender,
        address: owner.address,
        role: 'owner',
        created_at: owner.created_at,
        updated_at: owner.updated_at
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

// Auth action handlers for offline queue
const createAuthActionHandlers = (setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>): Record<string, ActionHandler> => ({
  SIGN_IN: async (action: QueuedAction) => {
    try {
      const { email, password } = action.payload;
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Offline sign-in failed:', error);
        return false;
      }

      if (data.user?.email) {
        const userProfile = await fetchUserProfile(data.user.email);
        if (userProfile) {
          setUser(userProfile);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error processing offline sign-in:', error);
      return false;
    }
  },

  SIGN_UP: async (action: QueuedAction) => {
    try {
      const { email, password, userData } = action.payload;
      
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role
          }
        }
      });

      if (authError) {
        console.error('Offline sign-up failed:', authError);
        return false;
      }

      if (authData.user) {
        // Create the profile in the appropriate table
        if (userData.role === 'entrepreneur') {
          const { error: profileError } = await supabase
            .from('entrepreneurs')
            .insert({
              name: userData.name,
              email: email,
              phone: userData.phone || '',
              city: userData.city || '',
              country: userData.country || 'Saudi Arabia',
              avatar_url: userData.avatar_url || null,
              dob: userData.dob || '',
              gender: userData.gender || '',
              address: userData.address || ''
            });

          if (profileError) {
            console.error('Error creating entrepreneur profile:', profileError);
            return false;
          }
        } else if (userData.role === 'owner') {
          const { error: profileError } = await supabase
            .from('owners')
            .insert({
              name: userData.name,
              email: email,
              phone: userData.phone || '',
              city: userData.city || '',
              country: userData.country || 'Saudi Arabia',
              avatar_url: userData.avatar_url || null,
              dob: userData.dob || '',
              gender: userData.gender || '',
              address: userData.address || ''
            });

          if (profileError) {
            console.error('Error creating owner profile:', profileError);
            return false;
          }
        }

        // Fetch and set user profile
        if (authData.user.email) {
          const userProfile = await fetchUserProfile(authData.user.email);
          if (userProfile) {
            setUser(userProfile);
          }
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error processing offline sign-up:', error);
      return false;
    }
  },

  SIGN_OUT: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Offline sign-out failed:', error);
        return false;
      }
      setUser(null);
      return true;
    } catch (error) {
      console.error('Error processing offline sign-out:', error);
      return false;
    }
  }
});

// Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { networkState } = useNetwork();
  const { addToQueue } = useOfflineQueue();

  // Derived state for authentication status
  const isAuthenticated = useMemo(() => user !== null, [user]);
  const isOfflineMode = useMemo(() => !networkState.isInternetReachable, [networkState.isInternetReachable]);

  // Load user from Supabase auth on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          return;
        }

        if (session?.user?.email) {
          const userProfile = await fetchUserProfile(session.user.email);
          if (userProfile) {
            setUser(userProfile);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
        } else if (event === 'SIGNED_IN' && session?.user?.email) {
          const userProfile = await fetchUserProfile(session.user.email);
          if (userProfile) {
            setUser(userProfile);
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Handle sign in
  const signIn = useCallback(async (email: string, password: string): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      
      // If offline, queue the action
      if (!networkState.isInternetReachable) {
        addToQueue({
          type: 'SIGN_IN',
          payload: { email, password },
          maxRetries: 3
        });
        return { success: true, offline: true, message: 'Sign-in queued for when online' };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // User profile will be set via auth state change listener
        return { success: true };
      }

      return { success: false, error: 'Sign in failed' };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [networkState.isInternetReachable, addToQueue]);

  // Handle sign up
  const signUp = useCallback(async (email: string, password: string, userData: SignUpData): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      
      // If offline, queue the action
      if (!networkState.isInternetReachable) {
        addToQueue({
          type: 'SIGN_UP',
          payload: { email, password, userData },
          maxRetries: 3
        });
        return { success: true, offline: true, message: 'Sign-up queued for when online' };
      }

      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role
          }
        }
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      if (authData.user) {
        // Now create the profile in the appropriate table
        if (userData.role === 'entrepreneur') {
          const { error: profileError } = await supabase
            .from('entrepreneurs')
            .insert({
              name: userData.name,
              email: email,
              phone: userData.phone || '',
              city: userData.city || '',
              country: userData.country || 'Saudi Arabia',
              avatar_url: userData.avatar_url || null,
              dob: userData.dob || '',
              gender: userData.gender || '',
              address: userData.address || ''
            });

          if (profileError) {
            console.error('Error creating entrepreneur profile:', profileError);
            return { success: false, error: profileError.message };
          }
        } else if (userData.role === 'owner') {
          const { error: profileError } = await supabase
            .from('owners')
            .insert({
              name: userData.name,
              email: email,
              phone: userData.phone || '',
              city: userData.city || '',
              country: userData.country || 'Saudi Arabia',
              avatar_url: userData.avatar_url || null,
              dob: userData.dob || '',
              gender: userData.gender || '',
              address: userData.address || ''
            });

          if (profileError) {
            console.error('Error creating owner profile:', profileError);
            return { success: false, error: profileError.message };
          }
        }

        return { success: true };
      }

      return { success: false, error: 'Sign up failed' };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [networkState.isInternetReachable, addToQueue]);

  // Handle sign out
  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // If offline, queue the action
      if (!networkState.isInternetReachable) {
        addToQueue({
          type: 'SIGN_OUT',
          payload: {},
          maxRetries: 3
        });
        setUser(null); // Immediately set user to null for offline experience
        return;
      }

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
      }
      
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  }, [networkState.isInternetReachable, addToQueue]);

  // Memoized context value
  const value = useMemo(() => ({
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    isAuthenticated,
    isOfflineMode
  }), [user, isLoading, signIn, signUp, signOut, isAuthenticated, isOfflineMode]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a wrapper provider that includes the offline queue with auth handlers
export const AuthProviderWithOffline: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  
  const authActionHandlers = useMemo(() => createAuthActionHandlers(setUser), [setUser]);

  return (
    <OfflineQueueProvider actionHandlers={authActionHandlers}>
      <AuthProvider>{children}</AuthProvider>
    </OfflineQueueProvider>
  );
};
