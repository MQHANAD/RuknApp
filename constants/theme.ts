/**
 * Theme System for Rukn App
 * 
 * This file implements light and dark themes using the design tokens.
 * Provides semantic color mappings and strongly typed theme system.
 */

import { colors, shadows, spacing, typography } from './design-tokens';

// ===== THEME INTERFACE DEFINITIONS =====

/**
 * Theme structure defining all semantic color categories
 */
export interface Theme {
  // Background colors for different surfaces
  background: {
    primary: string;      // Main app background
    secondary: string;    // Secondary background areas
    tertiary: string;     // Tertiary background areas
  };
  
  // Text colors for different content levels
  text: {
    primary: string;      // Main text content
    secondary: string;    // Secondary text content
    tertiary: string;     // Tertiary/muted text
    inverse: string;      // Text on dark backgrounds
  };
  
  // Border colors for different contexts
  border: {
    primary: string;      // Main borders
    secondary: string;    // Secondary borders
    focus: string;        // Focused element borders
  };
  
  // Surface colors for cards, modals, etc.
  surface: {
    primary: string;      // Main surface color
    secondary: string;    // Secondary surface color
    elevated: string;     // Elevated surfaces (with shadows)
    overlay: string;      // Modal/overlay backgrounds
  };
  
  // Interactive element colors
  interactive: {
    primary: string;      // Primary interactive elements
    secondary: string;    // Secondary interactive elements
    tertiary: string;     // Tertiary interactive elements
    disabled: string;     // Disabled state
  };
  
  // Status colors (using design tokens directly)
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  
  // Brand colors (primary/secondary from design tokens)
  brand: {
    primary: string;
    secondary: string;
  };
}

// ===== LIGHT THEME IMPLEMENTATION =====

/**
 * Light theme using design tokens
 * Optimized for readability and accessibility in bright environments
 */
export const lightTheme: Theme = {
  background: {
    primary: colors.neutral[0],      // Pure white
    secondary: colors.neutral[50],   // Off-white
    tertiary: colors.neutral[100],   // Light gray
  },
  
  text: {
    primary: colors.neutral[900],    // Nearly black
    secondary: colors.neutral[600],  // Dark gray
    tertiary: colors.neutral[500],   // Medium gray
    inverse: colors.neutral[0],      // White for dark backgrounds
  },
  
  border: {
    primary: colors.neutral[200],    // Light gray
    secondary: colors.neutral[300],  // Medium-light gray
    focus: colors.primary[500],      // Brand primary for focus
  },
  
  surface: {
    primary: colors.neutral[0],      // White
    secondary: colors.neutral[50],   // Off-white
    elevated: colors.neutral[0],     // White (with shadow for elevation)
    overlay: `${colors.neutral[900]}CC`, // Nearly black with opacity
  },
  
  interactive: {
    primary: colors.primary[500],    // Brand primary
    secondary: colors.secondary[600], // Secondary brand
    tertiary: colors.neutral[400],   // Neutral interactive
    disabled: colors.neutral[300],   // Disabled state
  },
  
  status: {
    success: colors.success[500],
    warning: colors.warning[500],
    error: colors.error[500],
    info: colors.info[500],
  },
  
  brand: {
    primary: colors.primary[500],
    secondary: colors.secondary[600],
  },
};

// ===== DARK THEME IMPLEMENTATION =====

/**
 * Dark theme using design tokens
 * Optimized for low-light environments and reduced eye strain
 */
export const darkTheme: Theme = {
  background: {
    primary: colors.neutral[900],    // Nearly black
    secondary: colors.neutral[800],  // Very dark gray
    tertiary: colors.neutral[700],   // Dark gray
  },
  
  text: {
    primary: colors.neutral[50],     // Off-white
    secondary: colors.neutral[300],  // Medium-light gray
    tertiary: colors.neutral[400],   // Medium-dark gray
    inverse: colors.neutral[900],    // Dark for light backgrounds
  },
  
  border: {
    primary: colors.neutral[700],    // Dark gray
    secondary: colors.neutral[600],  // Darker gray
    focus: colors.primary[400],      // Lighter brand color for focus
  },
  
  surface: {
    primary: colors.neutral[800],    // Very dark gray
    secondary: colors.neutral[700],  // Dark gray
    elevated: colors.neutral[700], // Elevated dark surface
    overlay: `${colors.neutral[1000]}E6`, // Pure black with opacity
  },
  
  interactive: {
    primary: colors.primary[400],    // Lighter brand primary for dark mode
    secondary: colors.secondary[400], // Lighter secondary
    tertiary: colors.neutral[500],   // Neutral interactive
    disabled: colors.neutral[600],   // Disabled state for dark mode
  },
  
  status: {
    success: colors.success[400],    // Lighter success for dark mode
    warning: colors.warning[400],    // Lighter warning for dark mode
    error: colors.error[400],        // Lighter error for dark mode
    info: colors.info[400],          // Lighter info for dark mode
  },
  
  brand: {
    primary: colors.primary[400],    // Lighter for dark mode
    secondary: colors.secondary[400], // Lighter for dark mode
  },
};

// ===== THEME UTILITIES =====

/**
 * Theme context type for React Context
 */
export interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (themeName: 'light' | 'dark') => void;
}

/**
 * Available theme names
 */
export type ThemeName = 'light' | 'dark';

/**
 * Theme registry for easy access
 */
export const themes: Record<ThemeName, Theme> = {
  light: lightTheme,
  dark: darkTheme,
};

/**
 * Get theme by name
 */
export const getTheme = (themeName: ThemeName): Theme => {
  return themes[themeName];
};

/**
 * Type-safe theme selector hook interface
 */
export interface UseTheme {
  theme: Theme;
  themeName: ThemeName;
  isDark: boolean;
  colors: Theme;
  spacing: typeof spacing;
  typography: typeof typography;
  shadows: typeof shadows;
}

// ===== THEME-AWARE STYLED COMPONENTS HELPERS =====

/**
 * Helper function to create theme-aware styles
 */
export const createThemedStyle = <T>(
  lightStyle: T,
  darkStyle: T
) => ({
  light: lightStyle,
  dark: darkStyle,
});

/**
 * Helper to get the appropriate style based on theme
 */
export const getThemedStyle = <T>(
  themedStyle: { light: T; dark: T },
  isDark: boolean
): T => {
  return isDark ? themedStyle.dark : themedStyle.light;
};

/**
 * Common component styles that work with themes
 */
export const themedStyles = {
  // Container styles
  container: createThemedStyle(
    {
      backgroundColor: lightTheme.background.primary,
      borderColor: lightTheme.border.primary,
    },
    {
      backgroundColor: darkTheme.background.primary,
      borderColor: darkTheme.border.primary,
    }
  ),
  
  // Card styles  
  card: createThemedStyle(
    {
      backgroundColor: lightTheme.surface.primary,
      borderColor: lightTheme.border.primary,
      ...shadows.medium,
    },
    {
      backgroundColor: darkTheme.surface.primary,
      borderColor: darkTheme.border.primary,
      ...shadows.medium,
    }
  ),
  
  // Input styles
  input: createThemedStyle(
    {
      backgroundColor: lightTheme.surface.primary,
      borderColor: lightTheme.border.primary,
      color: lightTheme.text.primary,
    },
    {
      backgroundColor: darkTheme.surface.primary,  
      borderColor: darkTheme.border.primary,
      color: darkTheme.text.primary,
    }
  ),
  
  // Text styles
  textPrimary: createThemedStyle(
    { color: lightTheme.text.primary },
    { color: darkTheme.text.primary }
  ),
  
  textSecondary: createThemedStyle(
    { color: lightTheme.text.secondary },
    { color: darkTheme.text.secondary }
  ),
  
  textTertiary: createThemedStyle(
    { color: lightTheme.text.tertiary },
    { color: darkTheme.text.tertiary }
  ),
};

// ===== BACKWARD COMPATIBILITY =====

/**
 * Legacy color system compatibility layer
 * Provides the same structure as the old Colors.ts for backward compatibility
 */
export const legacyColors = {
  light: {
    text: lightTheme.text.primary,
    background: lightTheme.background.primary,
    tint: lightTheme.brand.primary,
    tabIconDefault: lightTheme.text.tertiary,
    tabIconSelected: lightTheme.brand.primary,
  },
  dark: {
    text: darkTheme.text.primary,
    background: darkTheme.background.primary,
    tint: darkTheme.brand.primary,
    tabIconDefault: darkTheme.text.tertiary,
    tabIconSelected: darkTheme.brand.primary,
  },
};

// ===== ACCESSIBILITY HELPERS =====

/**
 * Get accessible color combinations based on theme
 */
export const getAccessibleColors = (isDark: boolean) => {
  const theme = isDark ? darkTheme : lightTheme;
  
  return {
    // High contrast text combinations
    primaryText: {
      color: theme.text.primary,
      backgroundColor: theme.background.primary,
    },
    
    secondaryText: {
      color: theme.text.secondary,
      backgroundColor: theme.background.primary,
    },
    
    // Interactive element combinations
    primaryButton: {
      color: isDark ? colors.neutral[0] : colors.neutral[0],
      backgroundColor: theme.interactive.primary,
    },
    
    secondaryButton: {
      color: theme.interactive.primary,
      backgroundColor: theme.surface.primary,
      borderColor: theme.interactive.primary,
    },
  };
};

// ===== DEFAULT EXPORTS =====

/**
 * Default export with commonly used theme utilities
 */
export default {
  lightTheme,
  darkTheme,
  themes,
  getTheme,
  createThemedStyle,
  getThemedStyle,
  themedStyles,
  legacyColors,
  getAccessibleColors,
};

// Types are exported above with their interface declarations