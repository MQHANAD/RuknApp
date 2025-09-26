import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabaseApi, UserProfile } from '@lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

// Enhanced error types for better user feedback
export type AuthError = {
  code: string;
  message: string;
  field?: string;
};

// Define context types
type AuthContextType = {
  user: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: AuthError }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ success: boolean; error?: AuthError }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  lastError: AuthError | null;
  clearError: () => void;
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

// Storage keys
const AUTH_KEY = 'ruknapp_auth';

// Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastError, setLastError] = useState<AuthError | null>(null);

  // Load user from storage on app start
  useEffect(() => {
    const loadUser = async () => {
      console.log('AuthContext: Starting loadUser');
      try {
        const storedSession = await AsyncStorage.getItem(AUTH_KEY);

        if (storedSession) {
          const sessionData = JSON.parse(storedSession);

          // If we have stored credentials, restore the session
          if (sessionData && sessionData.user) {
            setUser(sessionData.user);
            setIsAuthenticated(true);
            console.log('AuthContext: Restored user session from storage');

            // Update the in-memory session in supabaseApi
            if (sessionData.token) {
              // This will ensure supabaseApi has the session as well
              try {
                supabaseApi.setSession({
                  access_token: sessionData.token,
                  user: sessionData.user
                });
                console.log('AuthContext: Set session in supabaseApi');
              } catch (error) {
                console.error('AuthContext: Error setting session in supabaseApi:', error);
              }
            }
          }
        }
      } catch (error) {
        console.error('AuthContext: Error loading authentication state:', error);
      } finally {
        setIsLoading(false);
        console.log('AuthContext: loadUser completed');
      }
    };

    loadUser().catch((error) => {
      console.error('AuthContext: Unhandled promise rejection in loadUser useEffect:', error);
    });
  }, []);

  // Enhanced error handler
  const handleAuthError = (error: any): AuthError => {
    if (error.code === 'PGRST116') {
      return { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' };
    } else if (error.message?.includes('Network')) {
      return { code: 'NETWORK_ERROR', message: 'Network error. Please check your connection' };
    } else if (error.message?.includes('timeout')) {
      return { code: 'TIMEOUT', message: 'Request timed out. Please try again' };
    } else if (error.message?.includes('Email not confirmed')) {
      return { code: 'EMAIL_NOT_CONFIRMED', message: 'Please confirm your email address' };
    } else {
      return { code: 'UNKNOWN_ERROR', message: error.message || 'An unexpected error occurred' };
    }
  };

  // Clear error state
  const clearError = () => {
    setLastError(null);
  };

  // Handle sign in with enhanced error handling
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setLastError(null);
      
      // Client-side validation
      if (!email?.trim()) {
        const error: AuthError = { code: 'VALIDATION_ERROR', message: 'Email is required', field: 'email' };
        setLastError(error);
        return { success: false, error };
      }
      
      if (!email.includes('@')) {
        const error: AuthError = { code: 'VALIDATION_ERROR', message: 'Please enter a valid email address', field: 'email' };
        setLastError(error);
        return { success: false, error };
      }
      
      if (!password || password.length < 6) {
        const error: AuthError = { code: 'VALIDATION_ERROR', message: 'Password must be at least 6 characters', field: 'password' };
        setLastError(error);
        return { success: false, error };
      }
      
      const result = await supabaseApi.signIn(email, password);
      
      if (result.success && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
        
        // Store auth data in AsyncStorage
        const session = supabaseApi.getCurrentSession();
        const sessionData = {
          user: result.user,
          token: session?.access_token,
          timestamp: new Date().toISOString()
        };
        await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(sessionData));
        
        return { success: true };
      } else {
        const authError = handleAuthError(result.error || new Error('Sign in failed'));
        setLastError(authError);
        return { success: false, error: authError };
      }
    } catch (error: any) {
      const authError = handleAuthError(error);
      setLastError(authError);
      return { success: false, error: authError };
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sign up with enhanced validation and error handling
  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setIsLoading(true);
      setLastError(null);
      
      // Enhanced client-side validation
      if (!email?.trim()) {
        const error: AuthError = { code: 'VALIDATION_ERROR', message: 'Email is required', field: 'email' };
        setLastError(error);
        return { success: false, error };
      }
      
      if (!email.includes('@') || !email.includes('.')) {
        const error: AuthError = { code: 'VALIDATION_ERROR', message: 'Please enter a valid email address', field: 'email' };
        setLastError(error);
        return { success: false, error };
      }
      
      if (!password || password.length < 8) {
        const error: AuthError = { code: 'VALIDATION_ERROR', message: 'Password must be at least 8 characters long', field: 'password' };
        setLastError(error);
        return { success: false, error };
      }
      
      // Password strength validation
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        const error: AuthError = { 
          code: 'WEAK_PASSWORD', 
          message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number', 
          field: 'password' 
        };
        setLastError(error);
        return { success: false, error };
      }
      
      if (!userData?.fullName?.trim()) {
        const error: AuthError = { code: 'VALIDATION_ERROR', message: 'Full name is required', field: 'fullName' };
        setLastError(error);
        return { success: false, error };
      }
      
      const result = await supabaseApi.signUp(email, password, userData);
      
      if (result.success && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
        
        // Store auth data in AsyncStorage
        const session = supabaseApi.getCurrentSession();
        const sessionData = {
          user: result.user,
          token: session?.access_token,
          timestamp: new Date().toISOString()
        };
        await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(sessionData));
        
        return { success: true };
      } else {
        const authError = handleAuthError(result.error || new Error('Sign up failed'));
        setLastError(authError);
        return { success: false, error: authError };
      }
    } catch (error: any) {
      const authError = handleAuthError(error);
      setLastError(authError);
      return { success: false, error: authError };
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sign out
  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabaseApi.signOut();
      
      // Clear from AsyncStorage
      await AsyncStorage.removeItem(AUTH_KEY);
      
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    isAuthenticated,
    lastError,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
