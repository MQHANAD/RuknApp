/**
 * useResponsive Hook for Rukn App
 * 
 * This React hook provides responsive design capabilities including:
 * - Screen size detection with automatic updates
 * - Responsive value calculation
 * - Breakpoint matching
 * - Performance-optimized with memoization
 * - Integration with React Native Dimensions API
 */

import { useEffect, useState, useMemo, useCallback } from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import {
  getCurrentScreenSize,
  getScreenSizeInfo,
  getResponsiveValue,
  calculateResponsiveSize,
  matchesBreakpoint,
  getMatchingBreakpoints,
  isTablet,
  isPhone,
  isLandscape,
  isPortrait,
  type ScreenSize,
  type ScreenSizeInfo,
  type ResponsiveValue,
  type ResponsiveSizeConfig,
  type BreakpointKey,
  responsiveMultipliers,
} from '../utils/responsive';

// ===== HOOK INTERFACES =====

/**
 * UseResponsive hook return type
 */
export interface UseResponsiveReturn {
  // Screen size information
  screenSize: ScreenSize;
  screenWidth: number;
  screenHeight: number;
  screenInfo: ScreenSizeInfo;
  
  // Boolean helpers for common breakpoints
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
  isExtraLarge: boolean;
  isTablet: boolean;
  isPhone: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
  
  // Breakpoint utilities
  matchesBreakpoint: (breakpoint: BreakpointKey) => boolean;
  getMatchingBreakpoints: () => BreakpointKey[];
  
  // Value calculation utilities
  getResponsiveValue: <T>(values: ResponsiveValue<T>, fallback?: T) => T | undefined;
  calculateResponsiveSize: (config: ResponsiveSizeConfig) => number;
  
  // Convenience utilities
  responsiveSpacing: (baseSpacing: number, multiplier?: keyof typeof responsiveMultipliers.spacing) => number;
  responsiveFontSize: (baseFontSize: number, multiplier?: keyof typeof responsiveMultipliers.typography) => number;
  responsiveComponentSize: (baseSize: number, multiplier?: keyof typeof responsiveMultipliers.component) => number;
}

/**
 * Options for useResponsive hook
 */
export interface UseResponsiveOptions {
  /**
   * Debounce time in milliseconds for dimension changes
   * @default 100
   */
  debounceMs?: number;
  
  /**
   * Whether to listen for orientation changes
   * @default true
   */
  listenToOrientationChange?: boolean;
}

// ===== CUSTOM HOOK =====

/**
 * useResponsive Hook
 * 
 * Provides responsive design capabilities with automatic screen size detection
 * and performance-optimized utilities for responsive values and sizing.
 */
export const useResponsive = (options: UseResponsiveOptions = {}): UseResponsiveReturn => {
  const {
    debounceMs = 100,
    listenToOrientationChange = true,
  } = options;

  // ===== STATE MANAGEMENT =====

  const [screenData, setScreenData] = useState<ScaledSize>(() => {
    const initialDimensions = Dimensions.get('window');
    return initialDimensions;
  });

  // Debounced update handler
  const [debounceTimer, setDebounceTimer] = useState<number | null>(null);

  const updateScreenData = useCallback((newScreenData: ScaledSize) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      setScreenData(newScreenData);
      setDebounceTimer(null);
    }, debounceMs);

    setDebounceTimer(timer as unknown as number);
  }, [debounceMs, debounceTimer]);

  // ===== DIMENSION LISTENER =====

  useEffect(() => {
    if (!listenToOrientationChange) return;

    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      updateScreenData(window);
    });

    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      subscription?.remove();
    };
  }, [updateScreenData, listenToOrientationChange, debounceTimer]);

  // ===== MEMOIZED CALCULATIONS =====

  // Basic screen information
  const screenSize = useMemo(() => {
    return getCurrentScreenSize(screenData.width);
  }, [screenData.width]);

  const screenInfo = useMemo(() => {
    return getScreenSizeInfo(screenData.width, screenData.height);
  }, [screenData.width, screenData.height]);

  // Boolean helpers
  const isSmall = useMemo(() => screenSize === 'sm', [screenSize]);
  const isMedium = useMemo(() => screenSize === 'md', [screenSize]);
  const isLarge = useMemo(() => screenSize === 'lg', [screenSize]);
  const isExtraLarge = useMemo(() => screenSize === 'xl', [screenSize]);

  const isTabletSize = useMemo(() => isTablet(screenData.width), [screenData.width]);
  const isPhoneSize = useMemo(() => isPhone(screenData.width), [screenData.width]);
  const isLandscapeOrientation = useMemo(() => isLandscape(), [screenData.width, screenData.height]);
  const isPortraitOrientation = useMemo(() => isPortrait(), [screenData.width, screenData.height]);

  // ===== UTILITY FUNCTIONS =====

  // Breakpoint matching
  const matchesBreakpointMemo = useCallback((breakpoint: BreakpointKey) => {
    return matchesBreakpoint(breakpoint, screenData.width);
  }, [screenData.width]);

  const getMatchingBreakpointsMemo = useCallback(() => {
    return getMatchingBreakpoints(screenData.width);
  }, [screenData.width]);

  // Value calculation
  const getResponsiveValueMemo = useCallback(<T>(
    values: ResponsiveValue<T>, 
    fallback?: T
  ): T | undefined => {
    return getResponsiveValue(values, screenSize, fallback);
  }, [screenSize]);

  const calculateResponsiveSizeMemo = useCallback((config: ResponsiveSizeConfig): number => {
    return calculateResponsiveSize(config, screenSize);
  }, [screenSize]);

  // ===== CONVENIENCE UTILITIES =====

  // Responsive spacing with predefined multipliers
  const responsiveSpacing = useCallback((
    baseSpacing: number,
    multiplier: keyof typeof responsiveMultipliers.spacing = 'normal'
  ): number => {
    return calculateResponsiveSize({
      baseSize: baseSpacing,
      multipliers: responsiveMultipliers.spacing[multiplier],
    }, screenSize);
  }, [screenSize]);

  // Responsive font size with predefined multipliers
  const responsiveFontSize = useCallback((
    baseFontSize: number,
    multiplier: keyof typeof responsiveMultipliers.typography = 'moderate'
  ): number => {
    return calculateResponsiveSize({
      baseSize: baseFontSize,
      multipliers: responsiveMultipliers.typography[multiplier],
      minSize: 10,
      maxSize: 48,
    }, screenSize);
  }, [screenSize]);

  // Responsive component size with predefined multipliers
  const responsiveComponentSize = useCallback((
    baseSize: number,
    multiplier: keyof typeof responsiveMultipliers.component = 'normal'
  ): number => {
    return calculateResponsiveSize({
      baseSize: baseSize,
      multipliers: responsiveMultipliers.component[multiplier],
    }, screenSize);
  }, [screenSize]);

  // ===== RETURN OBJECT =====

  return useMemo(() => ({
    // Screen size information
    screenSize,
    screenWidth: screenData.width,
    screenHeight: screenData.height,
    screenInfo,
    
    // Boolean helpers
    isSmall,
    isMedium,
    isLarge,
    isExtraLarge,
    isTablet: isTabletSize,
    isPhone: isPhoneSize,
    isLandscape: isLandscapeOrientation,
    isPortrait: isPortraitOrientation,
    
    // Breakpoint utilities
    matchesBreakpoint: matchesBreakpointMemo,
    getMatchingBreakpoints: getMatchingBreakpointsMemo,
    
    // Value calculation utilities
    getResponsiveValue: getResponsiveValueMemo,
    calculateResponsiveSize: calculateResponsiveSizeMemo,
    
    // Convenience utilities
    responsiveSpacing,
    responsiveFontSize,
    responsiveComponentSize,
  }), [
    screenSize,
    screenData.width,
    screenData.height,
    screenInfo,
    isSmall,
    isMedium,
    isLarge,
    isExtraLarge,
    isTabletSize,
    isPhoneSize,
    isLandscapeOrientation,
    isPortraitOrientation,
    matchesBreakpointMemo,
    getMatchingBreakpointsMemo,
    getResponsiveValueMemo,
    calculateResponsiveSizeMemo,
    responsiveSpacing,
    responsiveFontSize,
    responsiveComponentSize,
  ]);
};

// ===== SPECIALIZED HOOKS =====

/**
 * useResponsiveValue Hook
 * 
 * Simplified hook for getting a single responsive value
 */
export const useResponsiveValue = <T>(
  values: ResponsiveValue<T>,
  fallback?: T
): T | undefined => {
  const { getResponsiveValue } = useResponsive();
  return useMemo(() => getResponsiveValue(values, fallback), [values, fallback, getResponsiveValue]);
};

/**
 * useScreenSize Hook
 * 
 * Lightweight hook that only returns screen size information
 */
export const useScreenSize = (): {
  screenSize: ScreenSize;
  width: number;
  height: number;
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
  isExtraLarge: boolean;
} => {
  const [screenData, setScreenData] = useState<ScaledSize>(() => Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData(window);
    });

    return () => subscription?.remove();
  }, []);

  const screenSize = useMemo(() => getCurrentScreenSize(screenData.width), [screenData.width]);

  return useMemo(() => ({
    screenSize,
    width: screenData.width,
    height: screenData.height,
    isSmall: screenSize === 'sm',
    isMedium: screenSize === 'md',
    isLarge: screenSize === 'lg',
    isExtraLarge: screenSize === 'xl',
  }), [screenSize, screenData.width, screenData.height]);
};

/**
 * useBreakpoint Hook
 * 
 * Hook for matching specific breakpoints
 */
export const useBreakpoint = (breakpoint: BreakpointKey): boolean => {
  const { matchesBreakpoint } = useResponsive();
  return useMemo(() => matchesBreakpoint(breakpoint), [breakpoint, matchesBreakpoint]);
};

/**
 * useOrientation Hook
 * 
 * Hook for detecting orientation changes
 */
export const useOrientation = (): {
  isLandscape: boolean;
  isPortrait: boolean;
  orientation: 'landscape' | 'portrait';
} => {
  const { isLandscape, isPortrait } = useResponsive();

  return useMemo(() => ({
    isLandscape,
    isPortrait,
    orientation: isLandscape ? 'landscape' as const : 'portrait' as const,
  }), [isLandscape, isPortrait]);
};

// ===== PERFORMANCE UTILITIES =====

/**
 * useResponsiveDebounced Hook
 * 
 * Hook with configurable debouncing for performance-critical scenarios
 */
export const useResponsiveDebounced = (debounceMs: number = 200): UseResponsiveReturn => {
  return useResponsive({ debounceMs });
};

/**
 * useResponsiveStatic Hook
 * 
 * Hook that doesn't listen to dimension changes (for performance)
 */
export const useResponsiveStatic = (): Omit<UseResponsiveReturn, 'screenWidth' | 'screenHeight'> => {
  const staticDimensions = useMemo(() => Dimensions.get('window'), []);
  const screenSize = useMemo(() => getCurrentScreenSize(staticDimensions.width), [staticDimensions.width]);
  const screenInfo = useMemo(() => getScreenSizeInfo(staticDimensions.width, staticDimensions.height), [staticDimensions]);

  const isSmall = useMemo(() => screenSize === 'sm', [screenSize]);
  const isMedium = useMemo(() => screenSize === 'md', [screenSize]);
  const isLarge = useMemo(() => screenSize === 'lg', [screenSize]);
  const isExtraLarge = useMemo(() => screenSize === 'xl', [screenSize]);

  const matchesBreakpointMemo = useCallback((breakpoint: BreakpointKey) => {
    return matchesBreakpoint(breakpoint, staticDimensions.width);
  }, [staticDimensions.width]);

  const getResponsiveValueMemo = useCallback(<T>(
    values: ResponsiveValue<T>, 
    fallback?: T
  ): T | undefined => {
    return getResponsiveValue(values, screenSize, fallback);
  }, [screenSize]);

  const calculateResponsiveSizeMemo = useCallback((config: ResponsiveSizeConfig): number => {
    return calculateResponsiveSize(config, screenSize);
  }, [screenSize]);

  return useMemo(() => ({
    screenSize,
    screenInfo,
    isSmall,
    isMedium,
    isLarge,
    isExtraLarge,
    isTablet: isTablet(staticDimensions.width),
    isPhone: isPhone(staticDimensions.width),
    isLandscape: staticDimensions.width > staticDimensions.height,
    isPortrait: staticDimensions.height >= staticDimensions.width,
    matchesBreakpoint: matchesBreakpointMemo,
    getMatchingBreakpoints: () => getMatchingBreakpoints(staticDimensions.width),
    getResponsiveValue: getResponsiveValueMemo,
    calculateResponsiveSize: calculateResponsiveSizeMemo,
    responsiveSpacing: (baseSpacing: number, multiplier: keyof typeof responsiveMultipliers.spacing = 'normal') => 
      calculateResponsiveSize({ baseSize: baseSpacing, multipliers: responsiveMultipliers.spacing[multiplier] }, screenSize),
    responsiveFontSize: (baseFontSize: number, multiplier: keyof typeof responsiveMultipliers.typography = 'moderate') =>
      calculateResponsiveSize({ baseSize: baseFontSize, multipliers: responsiveMultipliers.typography[multiplier], minSize: 10, maxSize: 48 }, screenSize),
    responsiveComponentSize: (baseSize: number, multiplier: keyof typeof responsiveMultipliers.component = 'normal') =>
      calculateResponsiveSize({ baseSize: baseSize, multipliers: responsiveMultipliers.component[multiplier] }, screenSize),
  }), [screenSize, screenInfo, isSmall, isMedium, isLarge, isExtraLarge, staticDimensions, matchesBreakpointMemo, getResponsiveValueMemo, calculateResponsiveSizeMemo]);
};

// ===== DEFAULT EXPORT =====

export default useResponsive;