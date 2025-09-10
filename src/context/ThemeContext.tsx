/**
 * Theme Context for Rukn App
 * 
 * Provides comprehensive theme management with:
 * - Light/Dark/System theme modes
 * - AsyncStorage persistence
 * - Real-time theme switching
 * - System theme detection
 * - TypeScript type safety
 */

import React, { 
  createContext, 
  useContext, 
  useCallback, 
  useEffect, 
  useState, 
  ReactNode,
  useMemo,
} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  Theme, 
  lightTheme, 
  darkTheme, 
  themes,
} from '../../constants/theme';
import { spacing, typography, shadows } from '../../constants/design-tokens';

// ===== TYPES & INTERFACES =====

/**
 * Available theme mode options
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Theme context value interface
 */
export interface ThemeContextValue {
  /** Current active theme object */
  theme: Theme;
  
  /** Current theme mode setting */
  themeMode: ThemeMode;
  
  /** Whether current theme is dark */
  isDark: boolean;
  
  /** Set theme mode (with persistence) */
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  
  /** Toggle between light and dark (preserves system mode) */
  toggleTheme: () => Promise<void>;
  
  /** Design system utilities */
  colors: Theme;
  spacing: typeof spacing;
  typography: typeof typography;
  shadows: typeof shadows;
  
  /** Loading state for initial theme load */
  isLoading: boolean;
}

/**
 * Theme provider props
 */
export interface ThemeProviderProps {
  children: ReactNode;
  /** Default theme mode if none persisted */
  defaultMode?: ThemeMode;
  /** Disable AsyncStorage persistence (for testing) */
  disablePersistence?: boolean;
}

// ===== CONSTANTS =====

/** AsyncStorage key for theme persistence */
const THEME_STORAGE_KEY = '@rukn_theme_mode';

/** Default theme mode */
const DEFAULT_THEME_MODE: ThemeMode = 'system';

// ===== CONTEXT SETUP =====

/**
 * Theme context
 */
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Custom hook to use theme context
 * Provides type-safe access to theme system
 */
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error(
      'useTheme must be used within a ThemeProvider. ' +
      'Make sure your app is wrapped with <ThemeProvider>.'
    );
  }
  
  return context;
};

// ===== THEME PROVIDER COMPONENT =====

/**
 * Theme Provider component
 * 
 * Manages theme state, persistence, and system theme detection.
 * Should wrap the entire app to provide theme context.
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultMode = DEFAULT_THEME_MODE,
  disablePersistence = false,
}) => {
  // ===== STATE =====
  
  const [themeMode, setThemeModeState] = useState<ThemeMode>(defaultMode);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get system color scheme
  const systemColorScheme = useColorScheme();
  
  // ===== COMPUTED VALUES =====
  
  /**
   * Get the effective theme name based on mode and system preference
   */
  const effectiveThemeName = useMemo(() => {
    switch (themeMode) {
      case 'system':
        return systemColorScheme === 'dark' ? 'dark' : 'light';
      case 'dark':
        return 'dark';
      case 'light':
      default:
        return 'light';
    }
  }, [themeMode, systemColorScheme]);
  
  /**
   * Current active theme object
   */
  const theme = useMemo(() => {
    return themes[effectiveThemeName as keyof typeof themes] || lightTheme;
  }, [effectiveThemeName]);
  
  /**
   * Whether current theme is dark
   */
  const isDark = useMemo(() => {
    return effectiveThemeName === 'dark';
  }, [effectiveThemeName]);
  
  // ===== PERSISTENCE UTILITIES =====
  
  /**
   * Save theme mode to AsyncStorage
   */
  const saveThemeMode = useCallback(async (mode: ThemeMode): Promise<void> => {
    if (disablePersistence) return;
    
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.warn('ThemeProvider: Failed to save theme mode to storage:', error);
    }
  }, [disablePersistence]);
  
  /**
   * Load theme mode from AsyncStorage
   */
  const loadThemeMode = useCallback(async (): Promise<ThemeMode> => {
    if (disablePersistence) return defaultMode;
    
    try {
      const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      
      // Validate saved mode
      if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
        return savedMode as ThemeMode;
      }
      
      return defaultMode;
    } catch (error) {
      console.warn('ThemeProvider: Failed to load theme mode from storage:', error);
      return defaultMode;
    }
  }, [defaultMode, disablePersistence]);
  
  // ===== THEME MODE MANAGEMENT =====
  
  /**
   * Set theme mode with persistence
   */
  const setThemeMode = useCallback(async (mode: ThemeMode): Promise<void> => {
    try {
      setThemeModeState(mode);
      await saveThemeMode(mode);
    } catch (error) {
      console.error('ThemeProvider: Failed to set theme mode:', error);
      // Revert to previous state on error
      const savedMode = await loadThemeMode();
      setThemeModeState(savedMode);
    }
  }, [saveThemeMode, loadThemeMode]);
  
  /**
   * Toggle between light and dark themes
   * If in system mode, switches to opposite of current system theme
   */
  const toggleTheme = useCallback(async (): Promise<void> => {
    const newMode: ThemeMode = isDark ? 'light' : 'dark';
    await setThemeMode(newMode);
  }, [isDark, setThemeMode]);
  
  // ===== INITIALIZATION =====
  
  /**
   * Initialize theme from storage on mount
   */
  useEffect(() => {
    const initializeTheme = async () => {
      try {
        const savedMode = await loadThemeMode();
        setThemeModeState(savedMode);
      } catch (error) {
        console.error('ThemeProvider: Failed to initialize theme:', error);
        setThemeModeState(defaultMode);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeTheme();
  }, [loadThemeMode, defaultMode]);
  
  // ===== CONTEXT VALUE =====
  
  /**
   * Memoized context value to prevent unnecessary re-renders
   */
  const contextValue = useMemo<ThemeContextValue>(() => ({
    theme,
    themeMode,
    isDark,
    setThemeMode,
    toggleTheme,
    colors: theme, // Alias for backward compatibility
    spacing,
    typography,
    shadows,
    isLoading,
  }), [
    theme,
    themeMode,
    isDark,
    setThemeMode,
    toggleTheme,
    isLoading,
  ]);
  
  // ===== RENDER =====
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// ===== UTILITY HOOKS =====

/**
 * Hook to get theme-aware styles
 * Useful for creating dynamic styles based on current theme
 */
export const useThemedStyles = <T extends Record<string, any>>(
  styleFactory: (theme: Theme, isDark: boolean) => T
): T => {
  const { theme, isDark } = useTheme();
  
  return useMemo(() => {
    return styleFactory(theme, isDark);
  }, [theme, isDark, styleFactory]);
};

/**
 * Hook to get theme colors with semantic naming
 * Provides easy access to theme colors for custom components
 */
export const useThemeColors = () => {
  const { theme } = useTheme();
  
  return useMemo(() => ({
    // Background colors
    background: theme.background,
    surface: theme.surface,
    
    // Text colors
    text: theme.text,
    
    // Interactive colors
    interactive: theme.interactive,
    
    // Border colors
    border: theme.border,
    
    // Status colors
    status: theme.status,
    
    // Brand colors
    brand: theme.brand,
  }), [theme]);
};

/**
 * Hook for conditional values based on theme
 * Useful for theme-dependent logic
 */
export const useThemeValue = <T,>(lightValue: T, darkValue: T): T => {
  const { isDark } = useTheme();
  return isDark ? darkValue : lightValue;
};

// ===== DEFAULT EXPORT =====

export default ThemeProvider;

// ===== ADDITIONAL UTILITIES =====

/**
 * HOC to inject theme props into components
 * Alternative to useTheme hook for class components
 */
export const withTheme = <P extends object,>(
  Component: React.ComponentType<P & { theme: ThemeContextValue }>
): React.ComponentType<P> => {
  const WithThemeComponent: React.FC<P> = (props) => {
    const theme = useTheme();
    return <Component {...props} theme={theme} />;
  };
  
  WithThemeComponent.displayName = `withTheme(${Component.displayName || Component.name})`;
  
  return WithThemeComponent;
};

/**
 * Theme context for direct access (advanced usage)
 * Most components should use useTheme hook instead
 */
export { ThemeContext };