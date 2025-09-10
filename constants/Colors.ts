/**
 * Legacy Colors Support with Design System Integration
 * 
 * This file maintains backward compatibility while encouraging migration
 * to the new design system. It re-exports design tokens using the old API.
 * 
 * @deprecated Use design tokens from constants/design-tokens.ts instead
 */

import { colors } from './design-tokens';
import { lightTheme, darkTheme } from './theme';

// ===== BACKWARD COMPATIBILITY LAYER =====

/**
 * @deprecated Use colors from design-tokens.ts instead
 * Migration: colors.primary[500] instead of Colors.light.tint
 */
const tintColorLight = colors.info[500]; // Updated from hardcoded #2f95dc
const tintColorDark = colors.neutral[0];

// Show deprecation warning in development
if (__DEV__) {
  console.warn(
    '🔄 DESIGN SYSTEM MIGRATION:\n' +
    'constants/Colors.ts is deprecated.\n' +
    'Migrate to:\n' +
    '  import { colors } from "constants/design-tokens"\n' +
    '  import { lightTheme, darkTheme } from "constants/theme"\n' +
    'This provides better type safety and consistency.'
  );
}

/**
 * Legacy color system that maps to design tokens
 * 
 * @deprecated Use design tokens directly for better type safety and consistency
 */
const legacyColors = {
  light: {
    text: lightTheme.text.primary,           // colors.neutral[900]
    background: lightTheme.background.primary, // colors.neutral[0]
    tint: lightTheme.brand.primary,          // colors.primary[500] 
    tabIconDefault: lightTheme.text.tertiary, // colors.neutral[500]
    tabIconSelected: lightTheme.brand.primary, // colors.primary[500]
    
    // Additional commonly used colors from the old system
    primary: colors.primary[500],            // #F5A623 - main brand color
    secondary: colors.secondary[800],        // #1E293B - dark backgrounds  
    success: colors.success[500],
    warning: colors.warning[500],
    error: colors.error[500],
    info: colors.info[500],
    
    // Neutral variations
    white: colors.neutral[0],
    black: colors.neutral[1000],
    gray: colors.neutral[500],
    lightGray: colors.neutral[300],
    darkGray: colors.neutral[700],
    
    // Surface colors
    surface: lightTheme.surface.primary,
    border: lightTheme.border.primary,
    
    // Interactive states
    disabled: colors.neutral[300],
    placeholder: colors.neutral[500],
  },
  dark: {
    text: darkTheme.text.primary,            // colors.neutral[50]
    background: darkTheme.background.primary, // colors.neutral[900]
    tint: darkTheme.brand.primary,           // colors.primary[400] (adjusted for dark)
    tabIconDefault: darkTheme.text.tertiary, // colors.neutral[400]
    tabIconSelected: darkTheme.brand.primary, // colors.primary[400]
    
    // Additional commonly used colors adapted for dark theme
    primary: colors.primary[400],            // Lighter for dark backgrounds
    secondary: colors.secondary[600],        // Adjusted for dark
    success: colors.success[400],
    warning: colors.warning[400], 
    error: colors.error[400],
    info: colors.info[400],
    
    // Neutral variations for dark theme
    white: colors.neutral[0],
    black: colors.neutral[1000],
    gray: colors.neutral[400],
    lightGray: colors.neutral[600],
    darkGray: colors.neutral[200],
    
    // Surface colors for dark theme
    surface: darkTheme.surface.primary,
    border: darkTheme.border.primary,
    
    // Interactive states for dark theme
    disabled: colors.neutral[600],
    placeholder: colors.neutral[400],
  },
};

// ===== MIGRATION HELPERS =====

/**
 * Get color with migration hints
 * @deprecated Use design tokens directly
 */
export const getColor = (colorName: keyof typeof legacyColors.light, isDark: boolean = false) => {
  if (__DEV__) {
    // Provide specific migration guidance
    const migrationHints: Record<string, string> = {
      text: 'theme.text.primary',
      background: 'theme.background.primary', 
      tint: 'colors.primary[500]',
      primary: 'colors.primary[500]',
      secondary: 'colors.secondary[800]',
      white: 'colors.neutral[0]',
      black: 'colors.neutral[1000]',
      surface: 'theme.surface.primary',
      border: 'theme.border.primary',
    };
    
    const hint = migrationHints[colorName];
    if (hint) {
      console.info(`💡 Migration hint: Colors.${isDark ? 'dark' : 'light'}.${colorName} → ${hint}`);
    }
  }
  
  const theme = isDark ? legacyColors.dark : legacyColors.light;
  return theme[colorName];
};

/**
 * Legacy color palette with direct access
 * @deprecated Use design tokens instead
 */
export const LegacyColorPalette = {
  // Brand colors
  PRIMARY: colors.primary[500],      // #F5A623
  PRIMARY_DARK: colors.primary[600], // Darker variant
  PRIMARY_LIGHT: colors.primary[400], // Lighter variant
  
  SECONDARY: colors.secondary[800],   // #1E293B
  SECONDARY_LIGHT: colors.secondary[600],
  SECONDARY_DARK: colors.secondary[900],
  
  // Status colors
  SUCCESS: colors.success[500],
  WARNING: colors.warning[500], 
  ERROR: colors.error[500],
  INFO: colors.info[500],
  
  // Neutral colors
  WHITE: colors.neutral[0],
  BLACK: colors.neutral[1000],
  GRAY_LIGHT: colors.neutral[300],
  GRAY: colors.neutral[500],
  GRAY_DARK: colors.neutral[700],
  
  // Common UI colors
  BACKGROUND_LIGHT: colors.neutral[0],
  BACKGROUND_DARK: colors.neutral[900],
  TEXT_PRIMARY: colors.neutral[900],
  TEXT_SECONDARY: colors.neutral[600],
  BORDER: colors.neutral[200],
  PLACEHOLDER: colors.neutral[500],
};

// ===== COMPATIBILITY EXPORTS =====

/**
 * Main export maintaining the old API structure
 * @deprecated Import design tokens directly for better type safety
 */
export default legacyColors;

/**
 * Named exports for convenience
 * @deprecated Use design tokens directly
 */
export const Colors = legacyColors;
export const ColorPalette = LegacyColorPalette;

// Re-export design tokens for easy access
export { colors as DesignTokenColors } from './design-tokens';
export { lightTheme, darkTheme } from './theme';

// ===== MIGRATION GUIDANCE =====

/**
 * Migration examples for common patterns:
 * 
 * OLD:
 *   import Colors from 'constants/Colors';
 *   backgroundColor: Colors.light.primary
 * 
 * NEW:
 *   import { colors } from 'constants/design-tokens';
 *   backgroundColor: colors.primary[500]
 * 
 * OLD:
 *   import Colors from 'constants/Colors';
 *   color: Colors.light.text
 * 
 * NEW:
 *   import { useTheme } from 'src/context/ThemeContext';
 *   const { theme } = useTheme();
 *   color: theme.text.primary
 * 
 * BENEFITS OF MIGRATION:
 * - Better TypeScript support
 * - Consistent color scales
 * - Automatic dark mode support
 * - Better maintainability
 * - Access to full design system
 */
