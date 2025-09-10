/**
 * Legacy Compatibility Layer
 * 
 * This file provides backward compatibility for existing components
 * while enabling gradual migration to the design system.
 */

import { colors, typography, spacing } from '../../constants/design-tokens';
import { lightTheme, darkTheme } from '../../constants/theme';

// ===== LEGACY COLOR SYSTEM COMPATIBILITY =====

/**
 * Legacy colors object that maintains the old API
 * while internally using design tokens
 */
export const legacyColors = {
  // Primary brand colors (maps to design tokens)
  primary: colors.primary[500],        // #F5A623
  primaryDark: colors.primary[600],    // Darker variant
  primaryLight: colors.primary[400],   // Lighter variant
  
  // Secondary colors
  secondary: colors.secondary[800],    // #1E293B (standardized from #1E2A38)
  secondaryLight: colors.secondary[600],
  secondaryDark: colors.secondary[900],
  
  // Neutral colors
  white: colors.neutral[0],
  black: colors.neutral[1000],
  gray: colors.neutral[500],
  lightGray: colors.neutral[300],
  darkGray: colors.neutral[700],
  
  // Common legacy mappings
  background: colors.neutral[0],
  surface: colors.neutral[50],
  border: colors.neutral[200],
  text: colors.neutral[900],
  textSecondary: colors.neutral[600],
  placeholder: colors.neutral[500],
  
  // Status colors
  success: colors.success[500],
  warning: colors.warning[500],
  error: colors.error[500],
  info: colors.info[500],
  
  // Specific legacy values from codebase analysis
  tabActive: colors.primary[500],      // #F5A623
  tabInactive: colors.neutral[0],      // #ffffff
  tabBackground: colors.secondary[800], // #1E293B
  
  // Button colors
  buttonPrimary: colors.primary[500],
  buttonSecondary: colors.neutral[0],
  buttonDisabled: colors.neutral[300],
  
  // Input colors
  inputBackground: colors.neutral[0],
  inputBorder: colors.primary[500],    // #F5A623
  inputBorderFocus: colors.primary[600],
  inputPlaceholder: colors.neutral[500], // #999
  
  // Shadow and overlay
  shadowColor: colors.neutral[900],
  overlay: `${colors.neutral[900]}80`, // Black with 50% opacity
} as const;

/**
 * Theme-aware legacy colors (for components that need light/dark support)
 */
export const createLegacyColorsForTheme = (isDark: boolean = false) => {
  const theme = isDark ? darkTheme : lightTheme;
  
  return {
    ...legacyColors,
    
    // Theme-aware overrides
    background: theme.background.primary,
    surface: theme.surface.primary,
    text: theme.text.primary,
    textSecondary: theme.text.secondary,
    border: theme.border.primary,
    
    // Interactive elements adapt to theme
    buttonPrimary: theme.interactive.primary,
    inputBackground: theme.surface.primary,
    inputBorder: theme.border.primary,
  };
};

// ===== LEGACY FONT SYSTEM COMPATIBILITY =====

/**
 * Legacy font sizes that map to design tokens
 */
export const legacyFontSizes = {
  tiny: typography.caption.small.fontSize,      // 10
  small: typography.body.small.fontSize,        // 12
  medium: typography.body.medium.fontSize,      // 14
  large: typography.body.large.fontSize,        // 16
  xl: typography.heading.h3.fontSize,           // 18
  xxl: typography.heading.h1.fontSize,          // 22
  xxxl: typography.display.small.fontSize,      // 24
  
  // Common specific sizes from codebase
  caption: typography.body.small.fontSize,      // 12
  body: typography.body.medium.fontSize,        // 14
  title: typography.heading.h3.fontSize,        // 18
  header: typography.heading.h1.fontSize,       // 22
  display: typography.display.small.fontSize,   // 24
  
  // Button text sizes
  buttonSmall: typography.button.small.fontSize,   // 12
  buttonMedium: typography.button.medium.fontSize, // 14
  buttonLarge: typography.button.large.fontSize,   // 16
} as const;

/**
 * Legacy font weights that map to design tokens
 */
export const legacyFontWeights = {
  normal: typography.body.medium.fontWeight,    // '400'
  medium: typography.caption.large.fontWeight, // '500'
  semiBold: typography.heading.h1.fontWeight,  // '600'
  bold: typography.display.small.fontWeight,   // '600'
  extraBold: typography.display.large.fontWeight, // '700'
} as const;

// ===== LEGACY SPACING SYSTEM COMPATIBILITY =====

/**
 * Legacy spacing values that map to design tokens
 */
export const legacySpacing = {
  xs: spacing[1],    // 4
  sm: spacing[2],    // 8
  md: spacing[4],    // 16
  lg: spacing[6],    // 24
  xl: spacing[8],    // 32
  xxl: spacing[12],  // 48
  
  // Common legacy names
  tiny: spacing[1],     // 4
  small: spacing[2],    // 8
  medium: spacing[4],   // 16
  large: spacing[6],    // 24
  huge: spacing[8],     // 32
  
  // Component-specific legacy spacing
  padding: spacing[4],      // 16 (default component padding)
  margin: spacing[3],       // 12 (default component margin)
  gap: spacing[2],          // 8 (default gap between elements)
  
  // Screen-level spacing
  screenPadding: spacing[6],    // 24
  screenMargin: spacing[4],     // 16
  sectionGap: spacing[8],       // 32
  
  // Button spacing
  buttonPadding: spacing[3],    // 12
  buttonMargin: spacing[2],     // 8
  
  // Input spacing
  inputPadding: spacing[3],     // 12
  inputMargin: spacing[2],      // 8
} as const;

// ===== WRAPPER FUNCTIONS FOR GRADUAL MIGRATION =====

/**
 * Legacy style creator that provides old API while using new design system
 */
export const createLegacyStyle = () => ({
  // Color helpers (old API)
  colors: legacyColors,
  
  // Spacing helpers (old API)
  spacing: legacySpacing,
  
  // Typography helpers (old API)
  fonts: {
    sizes: legacyFontSizes,
    weights: legacyFontWeights,
  },
  
  // Common style patterns from the codebase
  commonStyles: {
    container: {
      flex: 1,
      backgroundColor: legacyColors.background,
      paddingHorizontal: legacySpacing.screenPadding,
    },
    
    card: {
      backgroundColor: legacyColors.surface,
      borderRadius: spacing[2], // 8
      padding: legacySpacing.padding,
      marginBottom: legacySpacing.margin,
      shadowColor: legacyColors.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    
    button: {
      backgroundColor: legacyColors.buttonPrimary,
      paddingVertical: legacySpacing.buttonPadding,
      paddingHorizontal: legacySpacing.large,
      borderRadius: spacing[2], // 8
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    buttonText: {
      color: legacyColors.white,
      fontSize: legacyFontSizes.buttonLarge,
      fontWeight: legacyFontWeights.semiBold,
    },
    
    input: {
      backgroundColor: legacyColors.inputBackground,
      borderWidth: 1,
      borderColor: legacyColors.inputBorder,
      borderRadius: spacing[2], // 8
      paddingHorizontal: legacySpacing.inputPadding,
      paddingVertical: legacySpacing.inputPadding,
      fontSize: legacyFontSizes.large,
      color: legacyColors.text,
    },
    
    text: {
      primary: {
        color: legacyColors.text,
        fontSize: legacyFontSizes.medium,
        fontWeight: legacyFontWeights.normal,
      },
      secondary: {
        color: legacyColors.textSecondary,
        fontSize: legacyFontSizes.small,
        fontWeight: legacyFontWeights.normal,
      },
      title: {
        color: legacyColors.text,
        fontSize: legacyFontSizes.title,
        fontWeight: legacyFontWeights.semiBold,
      },
      header: {
        color: legacyColors.text,
        fontSize: legacyFontSizes.header,
        fontWeight: legacyFontWeights.bold,
      },
    },
    
    // Tab bar styles (from existing codebase)
    tabBar: {
      backgroundColor: legacyColors.tabBackground,
      borderTopWidth: 1,
      borderTopColor: legacyColors.border,
      height: 84,
    },
    
    tabIcon: {
      width: 24,
      height: 24,
    },
    
    tabText: {
      fontSize: 9,
      textAlign: 'center',
      width: 90,
    },
  },
});

// ===== DEPRECATION WARNINGS =====

/**
 * Show deprecation warning for legacy usage
 */
export const showDeprecationWarning = (
  component: string, 
  oldAPI: string, 
  newAPI: string,
  migrate: boolean = false
) => {
  if (__DEV__ && migrate) {
    console.warn(
      `🔄 DESIGN SYSTEM MIGRATION: ${component}\n` +
      `Old: ${oldAPI}\n` +
      `New: ${newAPI}\n` +
      `Consider migrating to the new design system API for better maintainability.`
    );
  }
};

/**
 * Legacy component wrapper that provides migration hints
 */
export const withLegacyCompat = <T extends Record<string, any>>(
  componentName: string,
  props: T,
  migrationHints?: string[]
): T => {
  if (__DEV__ && migrationHints?.length) {
    console.info(
      `💡 ${componentName} Migration Available:\n` +
      migrationHints.map(hint => `  • ${hint}`).join('\n')
    );
  }
  
  return props;
};

// ===== BRIDGE BETWEEN OLD AND NEW SYSTEMS =====

/**
 * Convert legacy style props to design system equivalent
 */
export const bridgeStyleProps = (legacyProps: Record<string, any>) => {
  const bridged: Record<string, any> = { ...legacyProps };
  
  // Color bridging
  if (legacyProps.primaryColor) {
    bridged.color = colors.primary[500];
    delete bridged.primaryColor;
    showDeprecationWarning(
      'StyleProps',
      'primaryColor',
      'colors.primary[500]',
      true
    );
  }
  
  if (legacyProps.secondaryColor) {
    bridged.color = colors.secondary[600];
    delete bridged.secondaryColor;
    showDeprecationWarning(
      'StyleProps',
      'secondaryColor', 
      'colors.secondary[600]',
      true
    );
  }
  
  // Spacing bridging
  if (legacyProps.padding && typeof legacyProps.padding === 'string') {
    const paddingMap: Record<string, number> = {
      small: spacing[2],
      medium: spacing[4], 
      large: spacing[6],
    };
    
    if (paddingMap[legacyProps.padding]) {
      bridged.padding = paddingMap[legacyProps.padding];
      showDeprecationWarning(
        'StyleProps',
        `padding="${legacyProps.padding}"`,
        `padding={${paddingMap[legacyProps.padding]}}`,
        true
      );
    }
  }
  
  return bridged;
};

/**
 * Theme-aware legacy color getter
 */
export const getLegacyColor = (
  colorName: keyof typeof legacyColors,
  isDark: boolean = false
): string => {
  if (isDark) {
    const darkColors = createLegacyColorsForTheme(true);
    return darkColors[colorName] || legacyColors[colorName];
  }
  
  return legacyColors[colorName];
};

/**
 * Convert old Constants/Colors.ts usage to new system
 */
export const migrateColorsImport = {
  light: {
    text: legacyColors.text,
    background: legacyColors.background,
    tint: legacyColors.primary,
    tabIconDefault: legacyColors.lightGray,
    tabIconSelected: legacyColors.primary,
  },
  dark: {
    text: colors.neutral[50],
    background: colors.neutral[900], 
    tint: colors.primary[400],
    tabIconDefault: colors.neutral[400],
    tabIconSelected: colors.primary[400],
  },
};

// ===== DEFAULT EXPORT =====

const legacyCompat = {
  colors: legacyColors,
  spacing: legacySpacing,
  fonts: {
    sizes: legacyFontSizes,
    weights: legacyFontWeights,
  },
  createLegacyStyle,
  createLegacyColorsForTheme,
  showDeprecationWarning,
  withLegacyCompat,
  bridgeStyleProps,
  getLegacyColor,
  migrateColorsImport,
};

export default legacyCompat;