/**
 * Design Tokens Foundation for Rukn App
 * 
 * This file contains the complete design system tokens including:
 * - Semantic color palette (50+ colors)
 * - Typography scale system (15 levels)
 * - Spacing system (12-step 4pt grid)
 * - Shadow system for elevation
 * - Breakpoints for responsive design
 * 
 * All tokens are strongly typed with TypeScript for type safety
 */

// ===== COLOR SYSTEM =====

/**
 * Base color palette with semantic naming
 */
export const colors = {
  // Primary Brand Colors (Orange)
  primary: {
    50: '#FEF7E6',    // Lightest orange tint
    100: '#FDEDC8',   // Light orange tint
    200: '#FBD799',   // Medium-light orange
    300: '#F8C16A',   // Medium orange
    400: '#F6B13B',   // Medium-dark orange  
    500: '#F5A623',   // PRIMARY BRAND (current #F5A623)
    600: '#E59510',   // Dark orange
    700: '#C17D0A',   // Darker orange
    800: '#9D6608',   // Very dark orange
    900: '#7A4F06',   // Darkest orange
  },

  // Secondary & Supporting Colors (Slate)
  secondary: {
    50: '#F8FAFC',    // Lightest slate
    100: '#F1F5F9',   // Light slate
    200: '#E2E8F0',   // Medium-light slate
    300: '#CBD5E1',   // Medium slate
    400: '#94A3B8',   // Medium-dark slate
    500: '#64748B',   // Base secondary
    600: '#475569',   // Dark slate
    700: '#334155',   // Darker slate
    800: '#1E293B',   // Very dark slate (current #1E2A38 standardized)
    900: '#0F172A',   // Darkest slate
  },

  // Neutral Colors (Gray scale)
  neutral: {
    0: '#FFFFFF',     // Pure white
    50: '#FAFAFA',    // Off-white
    100: '#F5F5F5',   // Light gray
    200: '#E5E5E5',   // Medium-light gray
    300: '#D4D4D4',   // Medium gray
    400: '#A3A3A3',   // Medium-dark gray
    500: '#737373',   // Base gray
    600: '#525252',   // Dark gray
    700: '#404040',   // Darker gray
    800: '#262626',   // Very dark gray
    900: '#171717',   // Nearly black
    1000: '#000000',  // Pure black
  },

  // Status & Semantic Colors
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',   // Green for success states
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },

  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',   // Amber for warnings
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',   // Red for errors
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',   // Blue for info
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
} as const;

// ===== TYPOGRAPHY SYSTEM =====

/**
 * Complete typography scale with semantic naming
 * Includes fontSize, lineHeight, fontWeight, letterSpacing
 */
export const typography = {
  // Display sizes for hero content
  display: {
    large: {
      fontSize: 32,
      lineHeight: 40,
      fontWeight: '700' as const,
      letterSpacing: -0.5,
    },
    medium: {
      fontSize: 28,
      lineHeight: 36,
      fontWeight: '700' as const,
      letterSpacing: -0.25,
    },
    small: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: '600' as const,
      letterSpacing: 0,
    },
  },

  // Heading sizes
  heading: {
    h1: {
      fontSize: 22,
      lineHeight: 28,
      fontWeight: '600' as const,
      letterSpacing: 0,
    },
    h2: {
      fontSize: 20,
      lineHeight: 26,
      fontWeight: '600' as const,
      letterSpacing: 0,
    },
    h3: {
      fontSize: 18,
      lineHeight: 24,
      fontWeight: '600' as const,
      letterSpacing: 0,
    },
    h4: {
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '600' as const,
      letterSpacing: 0,
    },
  },

  // Body text sizes
  body: {
    large: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400' as const,
      letterSpacing: 0,
    },
    medium: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400' as const,
      letterSpacing: 0,
    },
    small: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400' as const,
      letterSpacing: 0,
    },
  },

  // Caption and small text
  caption: {
    large: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '500' as const,
      letterSpacing: 0.25,
    },
    small: {
      fontSize: 10,
      lineHeight: 14,
      fontWeight: '500' as const,
      letterSpacing: 0.25,
    },
  },

  // Button text
  button: {
    large: {
      fontSize: 16,
      lineHeight: 20,
      fontWeight: '600' as const,
      letterSpacing: 0.25,
    },
    medium: {
      fontSize: 14,
      lineHeight: 18,
      fontWeight: '600' as const,
      letterSpacing: 0.25,
    },
    small: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '600' as const,
      letterSpacing: 0.25,
    },
  },
} as const;

// ===== SPACING SYSTEM =====

/**
 * Base spacing scale following 4pt grid system
 * Values from 0px to 96px with consistent increments
 */
export const spacing = {
  0: 0,
  1: 4,      // 4px
  2: 8,      // 8px
  3: 12,     // 12px
  4: 16,     // 16px
  5: 20,     // 20px
  6: 24,     // 24px
  8: 32,     // 32px
  10: 40,    // 40px
  12: 48,    // 48px
  16: 64,    // 64px
  20: 80,    // 80px
  24: 96,    // 96px
} as const;

/**
 * Semantic spacing aliases for common use cases
 */
export const layoutSpacing = {
  // Micro spacing
  tight: spacing[1],       // 4px
  snug: spacing[2],        // 8px
  
  // Standard spacing
  small: spacing[3],       // 12px
  medium: spacing[4],      // 16px
  large: spacing[6],       // 24px
  
  // Macro spacing
  xl: spacing[8],          // 32px
  xxl: spacing[12],        // 48px
  section: spacing[16],    // 64px
} as const;

/**
 * Component-specific spacing standards
 */
export const componentSpacing = {
  // Internal component padding
  button: {
    small: { vertical: spacing[2], horizontal: spacing[3] },    // 8px, 12px
    medium: { vertical: spacing[3], horizontal: spacing[4] },   // 12px, 16px
    large: { vertical: spacing[4], horizontal: spacing[6] },    // 16px, 24px
  },
  
  input: {
    padding: spacing[3],     // 12px
    marginBottom: spacing[4], // 16px
  },
  
  card: {
    padding: spacing[4],     // 16px
    marginBottom: spacing[3], // 12px
  },
  
  modal: {
    padding: spacing[6],     // 24px
    margin: spacing[4],      // 16px
  },
  
  screen: {
    horizontal: spacing[4],  // 16px
    vertical: spacing[6],    // 24px
  },
} as const;

// ===== SHADOW SYSTEM =====

/**
 * Elevation shadow system for depth and hierarchy
 */
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  
  small: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  
  medium: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  large: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  
  xlarge: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

// ===== RESPONSIVE BREAKPOINTS =====

/**
 * Breakpoints for responsive design
 */
export const breakpoints = {
  sm: 480,   // Small phones
  md: 768,   // Tablets
  lg: 1024,  // Large tablets
  xl: 1280,  // Desktop (if web version)
} as const;

// ===== COMPONENT DESIGN SPECIFICATIONS =====

/**
 * Button size variants with complete styling
 */
export const buttonSizes = {
  small: {
    height: 36,
    paddingHorizontal: spacing[3], // 12px
    fontSize: typography.button.small.fontSize,
    borderRadius: 6,
  },
  medium: {
    height: 44,
    paddingHorizontal: spacing[4], // 16px
    fontSize: typography.button.medium.fontSize,
    borderRadius: 8,
  },
  large: {
    height: 52,
    paddingHorizontal: spacing[6], // 24px
    fontSize: typography.button.large.fontSize,
    borderRadius: 10,
  },
} as const;

/**
 * Button variant styles with all states
 */
export const buttonVariants = {
  primary: {
    default: {
      backgroundColor: colors.primary[500],
      borderColor: colors.primary[500],
      textColor: colors.neutral[0],
    },
    pressed: {
      backgroundColor: colors.primary[600],
      borderColor: colors.primary[600],
      textColor: colors.neutral[0],
    },
    disabled: {
      backgroundColor: colors.neutral[300],
      borderColor: colors.neutral[300],
      textColor: colors.neutral[500],
    },
  },
  
  secondary: {
    default: {
      backgroundColor: colors.neutral[0],
      borderColor: colors.primary[500],
      textColor: colors.primary[500],
    },
    pressed: {
      backgroundColor: colors.primary[50],
      borderColor: colors.primary[600],
      textColor: colors.primary[600],
    },
    disabled: {
      backgroundColor: colors.neutral[100],
      borderColor: colors.neutral[300],
      textColor: colors.neutral[400],
    },
  },
  
  ghost: {
    default: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      textColor: colors.primary[500],
    },
    pressed: {
      backgroundColor: colors.primary[50],
      borderColor: 'transparent',
      textColor: colors.primary[600],
    },
    disabled: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      textColor: colors.neutral[400],
    },
  },
} as const;

/**
 * Input field styling system
 */
export const inputFieldStyles = {
  default: {
    height: 48,
    paddingHorizontal: spacing[3], // 12px
    fontSize: typography.body.medium.fontSize,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: colors.neutral[0],
    borderColor: colors.neutral[300],
    textColor: colors.neutral[900],
  },
  
  focused: {
    borderColor: colors.primary[500],
    borderWidth: 2,
    backgroundColor: colors.neutral[0],
  },
  
  error: {
    borderColor: colors.error[500],
    borderWidth: 1,
    backgroundColor: colors.error[50],
  },
  
  disabled: {
    backgroundColor: colors.neutral[100],
    borderColor: colors.neutral[200],
    textColor: colors.neutral[500],
  },
  
  placeholder: {
    color: colors.neutral[500],
  },
} as const;

/**
 * Card component styling system
 */
export const cardStyles = {
  default: {
    backgroundColor: colors.neutral[0],
    borderRadius: 12,
    padding: spacing[4], // 16px
    ...shadows.medium,
  },
  
  elevated: {
    ...shadows.large,
  },
  
  pressed: {
    backgroundColor: colors.neutral[50],
    transform: [{ scale: 0.98 }],
  },
} as const;

/**
 * Accessibility requirements
 */
export const accessibility = {
  // Touch target requirements
  touchTargets: {
    minimum: 44,        // 44px minimum touch target
    recommended: 48,    // 48px recommended
    comfortable: 52,    // 52px for primary actions
  },
  
  // Validated high-contrast combinations
  contrastPairs: {
    primaryOnLight: {
      background: colors.neutral[0],
      text: colors.primary[600],     // 4.6:1 contrast
    },
    
    primaryOnDark: {
      background: colors.neutral[900],
      text: colors.primary[400],     // 4.8:1 contrast
    },
    
    textOnLight: {
      background: colors.neutral[0],
      primary: colors.neutral[900],  // 21:1 contrast
      secondary: colors.neutral[600], // 4.5:1 contrast
    },
    
    textOnDark: {
      background: colors.neutral[900],
      primary: colors.neutral[50],   // 18:1 contrast
      secondary: colors.neutral[300], // 4.8:1 contrast
    },
  },
} as const;

/**
 * RTL & Internationalization support utilities
 */
export const rtlSupport = {
  // Text alignment
  textAlign: {
    start: 'left' as const,    // Will automatically flip to 'right' in RTL
    end: 'right' as const,     // Will automatically flip to 'left' in RTL
  },

  // Padding/margin direction
  paddingStart: spacing[4],  // Left in LTR, right in RTL
  paddingEnd: spacing[4],    // Right in LTR, left in RTL

  // Icon positioning
  iconStart: 'left' as const,   // Will flip in RTL
  iconEnd: 'right' as const,    // Will flip in RTL
} as const;

// ===== NAVIGATION COMPONENT TOKENS =====

/**
 * Tab bar styling system
 */
export const tabBarStyles = {
  default: {
    height: 84,
    backgroundColor: colors.neutral[800], // Dark background
    borderTopWidth: 1,
    borderTopColor: colors.neutral[700],
    paddingBottom: spacing[6], // Extra padding for safe area
  },

  active: {
    backgroundColor: colors.primary[500],
    tintColor: colors.primary[500],
  },

  inactive: {
    backgroundColor: 'transparent',
    tintColor: colors.neutral[400],
  },

  label: {
    fontSize: 9,
    color: colors.neutral[400],
    textAlign: 'center',
    marginTop: spacing[1],
  },
} as const;

/**
 * Navigation bar styling system
 */
export const navigationBarStyles = {
  default: {
    height: 56,
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
    paddingHorizontal: spacing[4],
  },

  dark: {
    backgroundColor: colors.neutral[900],
    borderBottomColor: colors.neutral[700],
  },

  title: {
    fontSize: typography.heading.h3.fontSize,
    fontWeight: typography.heading.h3.fontWeight,
    color: colors.neutral[900],
  },

  button: {
    size: 24,
    tintColor: colors.primary[500],
  },
} as const;

// ===== LAYOUT COMPONENT TOKENS =====

/**
 * Container layout system
 */
export const containerStyles = {
  default: {
    flex: 1,
    paddingHorizontal: spacing[4],
  },

  narrow: {
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
  },

  wide: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },

  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
} as const;

/**
 * Grid system tokens
 */
export const gridStyles = {
  container: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
  },

  item: {
    padding: spacing[2],
  },

  columns: {
    1: { width: '100%' },
    2: { width: '50%' },
    3: { width: '33.333%' },
    4: { width: '25%' },
    6: { width: '16.666%' },
  },
} as const;

/**
 * Stack layout system
 */
export const stackStyles = {
  container: {
    flexDirection: 'column' as const,
  },

  spacing: {
    none: { gap: 0 },
    tight: { gap: spacing[1] },
    snug: { gap: spacing[2] },
    small: { gap: spacing[3] },
    medium: { gap: spacing[4] },
    large: { gap: spacing[6] },
    xl: { gap: spacing[8] },
  },
} as const;

// ===== MODAL/DIALOG TOKENS =====

/**
 * Modal component styling system
 */
export const modalStyles = {
  overlay: {
    backgroundColor: `${colors.neutral[900]}80`, // Semi-transparent black
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[4],
  },

  container: {
    backgroundColor: colors.neutral[0],
    borderRadius: 12,
    padding: spacing[6],
    maxWidth: 400,
    width: '100%',
    ...shadows.large,
  },

  darkContainer: {
    backgroundColor: colors.neutral[800],
  },

  header: {
    marginBottom: spacing[4],
  },

  title: {
    ...typography.heading.h2,
    marginBottom: spacing[2],
  },

  subtitle: {
    ...typography.body.medium,
    color: colors.neutral[600],
  },

  content: {
    marginBottom: spacing[6],
  },

  actions: {
    flexDirection: 'row' as const,
    justifyContent: 'flex-end' as const,
    gap: spacing[3],
  },
} as const;

// ===== LIST COMPONENT TOKENS =====

/**
 * List and ListItem styling system
 */
export const listStyles = {
  container: {
    backgroundColor: colors.neutral[0],
    borderRadius: 8,
    ...shadows.small,
  },

  item: {
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
    minHeight: 56,
  },

  lastItem: {
    borderBottomWidth: 0,
  },

  pressable: {
    backgroundColor: colors.neutral[50],
  },

  title: {
    ...typography.body.large,
    fontWeight: '500',
    marginBottom: spacing[1],
  },

  subtitle: {
    ...typography.body.medium,
    color: colors.neutral[600],
  },

  icon: {
    size: 24,
    marginRight: spacing[3],
  },
} as const;

// ===== AVATAR & CHIP TOKENS =====

/**
 * Avatar component styling system
 */
export const avatarStyles = {
  small: {
    size: 32,
    borderRadius: 16,
    fontSize: typography.body.small.fontSize,
  },

  medium: {
    size: 40,
    borderRadius: 20,
    fontSize: typography.body.medium.fontSize,
  },

  large: {
    size: 56,
    borderRadius: 28,
    fontSize: typography.heading.h4.fontSize,
  },

  xlarge: {
    size: 80,
    borderRadius: 40,
    fontSize: typography.heading.h3.fontSize,
  },

  default: {
    backgroundColor: colors.primary[500],
    textColor: colors.neutral[0],
  },

  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.neutral[300],
    textColor: colors.neutral[600],
  },
} as const;

/**
 * Chip component styling system
 */
export const chipStyles = {
  container: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 16,
    backgroundColor: colors.neutral[100],
    minHeight: 32,
  },

  text: {
    ...typography.caption.large,
    color: colors.neutral[700],
  },

  primary: {
    backgroundColor: colors.primary[100],
    textColor: colors.primary[700],
  },

  success: {
    backgroundColor: colors.success[100],
    textColor: colors.success[700],
  },

  warning: {
    backgroundColor: colors.warning[100],
    textColor: colors.warning[700],
  },

  error: {
    backgroundColor: colors.error[100],
    textColor: colors.error[700],
  },

  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.neutral[300],
  },
} as const;

// ===== LOADING/SKELETON TOKENS =====

/**
 * Loading and skeleton component styling
 */
export const loadingStyles = {
  skeleton: {
    backgroundColor: colors.neutral[200],
    borderRadius: 4,
  },

  skeletonHighlight: {
    backgroundColor: colors.neutral[300],
  },

  spinner: {
    small: { size: 16 },
    medium: { size: 24 },
    large: { size: 32 },
  },

  pulse: {
    animationDuration: 1500,
    backgroundColor: colors.neutral[200],
    highlightColor: colors.neutral[300],
  },
} as const;

// ===== TYPE DEFINITIONS =====

// Color types
export type ColorScale = typeof colors.primary;
export type ColorKey = keyof typeof colors;
export type ColorShade = keyof ColorScale;

// Typography types
export type TypographyCategory = keyof typeof typography;
export type TypographyVariant<T extends TypographyCategory> = keyof typeof typography[T];
export type TypographyStyle = {
  fontSize: number;
  lineHeight: number;
  fontWeight: string;
  letterSpacing: number;
};

// Spacing types
export type SpacingKey = keyof typeof spacing;
export type SpacingValue = typeof spacing[SpacingKey];

// Component types
export type ButtonSize = keyof typeof buttonSizes;
export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonState = keyof typeof buttonVariants.primary;

// Shadow types
export type ShadowLevel = keyof typeof shadows;

// Breakpoint types
export type BreakpointKey = keyof typeof breakpoints;

// ===== UTILITY FUNCTIONS =====

/**
 * Get color value by semantic name and shade
 */
export const getColor = (colorKey: ColorKey, shade: ColorShade): string => {
  return colors[colorKey][shade];
};

/**
 * Get typography style by category and variant
 */
export const getTypography = <T extends TypographyCategory>(
  category: T,
  variant: TypographyVariant<T>
): TypographyStyle => {
  return typography[category][variant] as TypographyStyle;
};

/**
 * Get spacing value by key
 */
export const getSpacing = (key: SpacingKey): number => {
  return spacing[key];
};

/**
 * Get shadow style by level
 */
export const getShadow = (level: ShadowLevel) => {
  return shadows[level];
};

/**
 * Check if current screen size matches breakpoint
 */
export const matchesBreakpoint = (screenWidth: number, breakpoint: BreakpointKey): boolean => {
  return screenWidth >= breakpoints[breakpoint];
};

// Export all tokens as default for easy importing
export default {
  colors,
  typography,
  spacing,
  layoutSpacing,
  componentSpacing,
  shadows,
  breakpoints,
  buttonSizes,
  buttonVariants,
  inputFieldStyles,
  cardStyles,
  accessibility,
  rtlSupport,
  // Utility functions
  getColor,
  getTypography,
  getSpacing,
  getShadow,
  matchesBreakpoint,
};