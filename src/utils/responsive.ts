/**
 * Responsive Utilities for Rukn App
 * 
 * This file provides utilities for responsive design including:
 * - Screen size detection using React Native Dimensions API
 * - Breakpoint detection and matching
 * - Responsive value calculation
 * - Screen dimension utilities
 * - TypeScript interfaces for responsive configurations
 */

import { Dimensions, PixelRatio, Platform } from 'react-native';
import { breakpoints } from '../../constants/design-tokens';

// ===== TYPES & INTERFACES =====

/**
 * Breakpoint keys from design tokens
 */
export type BreakpointKey = keyof typeof breakpoints;

/**
 * Screen size category
 */
export type ScreenSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Screen dimensions interface
 */
export interface ScreenDimensions {
  width: number;
  height: number;
  scale: number;
  pixelRatio: number;
}

/**
 * Responsive value configuration
 * Allows defining different values for different screen sizes
 */
export interface ResponsiveValue<T> {
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
}

/**
 * Screen size detection result
 */
export interface ScreenSizeInfo {
  screenSize: ScreenSize;
  width: number;
  height: number;
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
  isExtraLarge: boolean;
  isTablet: boolean;
  isPhone: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
}

/**
 * Responsive sizing configuration
 */
export interface ResponsiveSizeConfig {
  baseSize: number;
  multipliers?: ResponsiveValue<number>;
  minSize?: number;
  maxSize?: number;
}

// ===== SCREEN SIZE DETECTION =====

/**
 * Get current screen dimensions
 */
export const getScreenDimensions = (): ScreenDimensions => {
  const { width, height } = Dimensions.get('window');
  const scale = PixelRatio.get();
  const pixelRatio = PixelRatio.getPixelSizeForLayoutSize(1);

  return {
    width,
    height,
    scale,
    pixelRatio,
  };
};

/**
 * Get current screen size category based on width
 */
export const getCurrentScreenSize = (screenWidth?: number): ScreenSize => {
  const width = screenWidth ?? getScreenDimensions().width;

  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  return 'sm';
};

/**
 * Get detailed screen size information
 */
export const getScreenSizeInfo = (screenWidth?: number, screenHeight?: number): ScreenSizeInfo => {
  const dimensions = getScreenDimensions();
  const width = screenWidth ?? dimensions.width;
  const height = screenHeight ?? dimensions.height;
  const screenSize = getCurrentScreenSize(width);

  return {
    screenSize,
    width,
    height,
    isSmall: screenSize === 'sm',
    isMedium: screenSize === 'md',
    isLarge: screenSize === 'lg',
    isExtraLarge: screenSize === 'xl',
    isTablet: width >= breakpoints.md,
    isPhone: width < breakpoints.md,
    isLandscape: width > height,
    isPortrait: height > width,
  };
};

// ===== BREAKPOINT UTILITIES =====

/**
 * Check if current screen matches or exceeds a breakpoint
 */
export const matchesBreakpoint = (breakpoint: BreakpointKey, screenWidth?: number): boolean => {
  const width = screenWidth ?? getScreenDimensions().width;
  return width >= breakpoints[breakpoint];
};

/**
 * Check if current screen is within a specific breakpoint range
 */
export const isBreakpointRange = (
  minBreakpoint: BreakpointKey,
  maxBreakpoint?: BreakpointKey,
  screenWidth?: number
): boolean => {
  const width = screenWidth ?? getScreenDimensions().width;
  const minWidth = breakpoints[minBreakpoint];
  const maxWidth = maxBreakpoint ? breakpoints[maxBreakpoint] : Infinity;

  return width >= minWidth && width < maxWidth;
};

/**
 * Get all matching breakpoints for current screen
 */
export const getMatchingBreakpoints = (screenWidth?: number): BreakpointKey[] => {
  const width = screenWidth ?? getScreenDimensions().width;
  const matching: BreakpointKey[] = [];

  (Object.keys(breakpoints) as BreakpointKey[]).forEach(breakpoint => {
    if (width >= breakpoints[breakpoint]) {
      matching.push(breakpoint);
    }
  });

  return matching.sort((a, b) => breakpoints[a] - breakpoints[b]);
};

// ===== RESPONSIVE VALUE CALCULATION =====

/**
 * Get responsive value based on current screen size
 * Falls back to smaller screen sizes if current size is not defined
 */
export const getResponsiveValue = <T>(
  values: ResponsiveValue<T>,
  screenSize?: ScreenSize,
  fallback?: T
): T | undefined => {
  const currentSize = screenSize ?? getCurrentScreenSize();

  // Try current screen size first
  if (values[currentSize] !== undefined) {
    return values[currentSize];
  }

  // Fallback chain: xl -> lg -> md -> sm -> fallback
  const fallbackOrder: ScreenSize[] = ['xl', 'lg', 'md', 'sm'];
  const startIndex = fallbackOrder.indexOf(currentSize);

  // Check smaller sizes first (progressive degradation)
  for (let i = startIndex; i < fallbackOrder.length; i++) {
    const size = fallbackOrder[i];
    if (values[size] !== undefined) {
      return values[size];
    }
  }

  // Then check larger sizes (progressive enhancement)
  for (let i = startIndex - 1; i >= 0; i--) {
    const size = fallbackOrder[i];
    if (values[size] !== undefined) {
      return values[size];
    }
  }

  return fallback;
};

/**
 * Get responsive value with strict mode (no fallbacks)
 */
export const getResponsiveValueStrict = <T>(
  values: ResponsiveValue<T>,
  screenSize?: ScreenSize
): T | undefined => {
  const currentSize = screenSize ?? getCurrentScreenSize();
  return values[currentSize];
};

// ===== RESPONSIVE SIZING UTILITIES =====

/**
 * Calculate responsive size based on screen dimensions
 */
export const calculateResponsiveSize = (
  config: ResponsiveSizeConfig,
  screenSize?: ScreenSize
): number => {
  const currentSize = screenSize ?? getCurrentScreenSize();
  const multiplier = getResponsiveValue(config.multipliers || {}, currentSize, 1) ?? 1;
  let size = config.baseSize * multiplier;

  // Apply min/max constraints
  if (config.minSize !== undefined) {
    size = Math.max(size, config.minSize);
  }
  if (config.maxSize !== undefined) {
    size = Math.min(size, config.maxSize);
  }

  return size;
};

/**
 * Get responsive spacing value
 */
export const getResponsiveSpacing = (
  baseSpacing: number,
  multipliers?: ResponsiveValue<number>,
  screenSize?: ScreenSize
): number => {
  return calculateResponsiveSize({
    baseSize: baseSpacing,
    multipliers,
  }, screenSize);
};

/**
 * Get responsive font size
 */
export const getResponsiveFontSize = (
  baseFontSize: number,
  multipliers?: ResponsiveValue<number>,
  screenSize?: ScreenSize,
  minSize = 10,
  maxSize = 48
): number => {
  return calculateResponsiveSize({
    baseSize: baseFontSize,
    multipliers,
    minSize,
    maxSize,
  }, screenSize);
};

// ===== DEVICE TYPE UTILITIES =====

/**
 * Check if current device is a tablet based on screen size
 */
export const isTablet = (screenWidth?: number): boolean => {
  const width = screenWidth ?? getScreenDimensions().width;
  return width >= breakpoints.md;
};

/**
 * Check if current device is a phone based on screen size
 */
export const isPhone = (screenWidth?: number): boolean => {
  return !isTablet(screenWidth);
};

/**
 * Check if current orientation is landscape
 */
export const isLandscape = (): boolean => {
  const { width, height } = getScreenDimensions();
  return width > height;
};

/**
 * Check if current orientation is portrait
 */
export const isPortrait = (): boolean => {
  return !isLandscape();
};

// ===== PLATFORM-SPECIFIC UTILITIES =====

/**
 * Get platform-specific responsive value
 */
export const getPlatformResponsiveValue = <T>(
  values: {
    ios?: ResponsiveValue<T>;
    android?: ResponsiveValue<T>;
    web?: ResponsiveValue<T>;
    default?: ResponsiveValue<T>;
  },
  screenSize?: ScreenSize,
  fallback?: T
): T | undefined => {
  const currentSize = screenSize ?? getCurrentScreenSize();
  
  // Get platform-specific values
  let platformValues: ResponsiveValue<T> | undefined;
  
  if (Platform.OS === 'ios' && values.ios) {
    platformValues = values.ios;
  } else if (Platform.OS === 'android' && values.android) {
    platformValues = values.android;
  } else if (Platform.OS === 'web' && values.web) {
    platformValues = values.web;
  } else if (values.default) {
    platformValues = values.default;
  }

  if (platformValues) {
    return getResponsiveValue(platformValues, currentSize, fallback);
  }

  return fallback;
};

// ===== RESPONSIVE HELPERS =====

/**
 * Create responsive style object with automatic screen size detection
 */
export const createResponsiveStyle = <T extends Record<string, any>>(
  styleConfig: ResponsiveValue<T>,
  screenSize?: ScreenSize
): T | undefined => {
  return getResponsiveValue(styleConfig, screenSize);
};

/**
 * Clamp value between min and max based on screen size
 */
export const clampResponsive = (
  value: number,
  minValues: ResponsiveValue<number>,
  maxValues: ResponsiveValue<number>,
  screenSize?: ScreenSize
): number => {
  const currentSize = screenSize ?? getCurrentScreenSize();
  const min = getResponsiveValue(minValues, currentSize, 0) ?? 0;
  const max = getResponsiveValue(maxValues, currentSize, Infinity) ?? Infinity;
  
  return Math.max(min, Math.min(max, value));
};

/**
 * Scale value based on screen density
 */
export const scaleByDensity = (size: number): number => {
  const scale = PixelRatio.get();
  return size * scale;
};

/**
 * Convert dp to px
 */
export const dpToPx = (dp: number): number => {
  return PixelRatio.getPixelSizeForLayoutSize(dp);
};

/**
 * Convert px to dp
 */
export const pxToDp = (px: number): number => {
  return px / PixelRatio.get();
};

// ===== RESPONSIVE CONSTANTS =====

/**
 * Predefined responsive multipliers for common use cases
 */
export const responsiveMultipliers = {
  // Typography scaling
  typography: {
    conservative: { sm: 0.9, md: 1, lg: 1.1, xl: 1.2 },
    moderate: { sm: 0.85, md: 1, lg: 1.15, xl: 1.3 },
    aggressive: { sm: 0.8, md: 1, lg: 1.2, xl: 1.4 },
  },
  
  // Spacing scaling
  spacing: {
    tight: { sm: 0.8, md: 1, lg: 1.1, xl: 1.2 },
    normal: { sm: 0.9, md: 1, lg: 1.2, xl: 1.4 },
    loose: { sm: 1, md: 1.2, lg: 1.4, xl: 1.6 },
  },
  
  // Component scaling
  component: {
    compact: { sm: 0.9, md: 1, lg: 1.05, xl: 1.1 },
    normal: { sm: 1, md: 1, lg: 1.1, xl: 1.2 },
    comfortable: { sm: 1, md: 1.1, lg: 1.2, xl: 1.3 },
  },
} as const;

/**
 * Default export with all utilities
 */
export default {
  // Screen size detection
  getScreenDimensions,
  getCurrentScreenSize,
  getScreenSizeInfo,
  
  // Breakpoint utilities
  matchesBreakpoint,
  isBreakpointRange,
  getMatchingBreakpoints,
  
  // Responsive values
  getResponsiveValue,
  getResponsiveValueStrict,
  
  // Sizing utilities
  calculateResponsiveSize,
  getResponsiveSpacing,
  getResponsiveFontSize,
  
  // Device detection
  isTablet,
  isPhone,
  isLandscape,
  isPortrait,
  
  // Platform utilities
  getPlatformResponsiveValue,
  
  // Style helpers
  createResponsiveStyle,
  clampResponsive,
  scaleByDensity,
  dpToPx,
  pxToDp,
  
  // Constants
  responsiveMultipliers,
};