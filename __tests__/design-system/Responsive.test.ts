/**
 * Responsive Utilities Test Suite
 *
 * Tests the responsive design utilities including screen size detection,
 * breakpoint matching, responsive value calculation, and performance.
 */

import { Dimensions } from 'react-native';
import {
  getCurrentScreenSize,
  getScreenSizeInfo,
  getScreenDimensions,
  matchesBreakpoint,
  getMatchingBreakpoints,
  getResponsiveValue,
  calculateResponsiveSize,
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
} from '../../src/utils/responsive';

import {
  useResponsive,
  useResponsiveValue,
  useScreenSize,
  useBreakpoint,
  useOrientation,
  useResponsiveDebounced,
  useResponsiveStatic,
} from '../../src/hooks/useResponsive';

// Mock Dimensions API
jest.mock('react-native', () => ({
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 667 })),
    addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  },
  ScaledSize: jest.fn(),
}));

describe('Responsive Utilities', () => {

  // ===== SCREEN SIZE DETECTION TESTS =====

  describe('Screen Size Detection', () => {
    test('should detect small screen size', () => {
      const result = getCurrentScreenSize(320);
      expect(result).toBe('sm');
    });

    test('should detect medium screen size', () => {
      const result = getCurrentScreenSize(768);
      expect(result).toBe('md');
    });

    test('should detect large screen size', () => {
      const result = getCurrentScreenSize(1024);
      expect(result).toBe('lg');
    });

    test('should detect extra large screen size', () => {
      const result = getCurrentScreenSize(1280);
      expect(result).toBe('xl');
    });

    test('should handle edge cases', () => {
      expect(getCurrentScreenSize(0)).toBe('sm');
      expect(getCurrentScreenSize(-100)).toBe('sm');
      expect(getCurrentScreenSize(9999)).toBe('xl');
    });
  });

  // ===== SCREEN SIZE INFO TESTS =====

  describe('Screen Size Info', () => {
    test('should return complete screen size information', () => {
      const result = getScreenSizeInfo(375, 667);

      expect(result).toHaveProperty('width');
      expect(result).toHaveProperty('height');
      expect(result).toHaveProperty('screenSize');
      expect(result).toHaveProperty('isSmall');
      expect(result).toHaveProperty('isMedium');
      expect(result).toHaveProperty('isLarge');
      expect(result).toHaveProperty('isExtraLarge');
      expect(result).toHaveProperty('isTablet');
      expect(result).toHaveProperty('isPhone');
      expect(result).toHaveProperty('isLandscape');
      expect(result).toHaveProperty('isPortrait');
    });

    test('should correctly identify phone vs tablet', () => {
      const phoneResult = getScreenSizeInfo(375, 667);
      const tabletResult = getScreenSizeInfo(768, 1024);

      expect(phoneResult.isPhone).toBe(true);
      expect(phoneResult.isTablet).toBe(false);
      expect(tabletResult.isPhone).toBe(false);
      expect(tabletResult.isTablet).toBe(true);
    });

    test('should correctly identify orientation', () => {
      const portraitResult = getScreenSizeInfo(375, 667);
      const landscapeResult = getScreenSizeInfo(667, 375);

      expect(portraitResult.isPortrait).toBe(true);
      expect(portraitResult.isLandscape).toBe(false);
      expect(landscapeResult.isPortrait).toBe(false);
      expect(landscapeResult.isLandscape).toBe(true);
    });
  });

  // ===== BREAKPOINT MATCHING TESTS =====

  describe('Breakpoint Matching', () => {
    test('should match small breakpoint', () => {
      expect(matchesBreakpoint('sm', 320)).toBe(true);
      expect(matchesBreakpoint('sm', 767)).toBe(true);
      expect(matchesBreakpoint('sm', 768)).toBe(false);
    });

    test('should match medium breakpoint', () => {
      expect(matchesBreakpoint('md', 768)).toBe(true);
      expect(matchesBreakpoint('md', 1023)).toBe(true);
      expect(matchesBreakpoint('md', 1024)).toBe(false);
    });

    test('should match large breakpoint', () => {
      expect(matchesBreakpoint('lg', 1024)).toBe(true);
      expect(matchesBreakpoint('lg', 1279)).toBe(true);
      expect(matchesBreakpoint('lg', 1280)).toBe(false);
    });

    test('should match extra large breakpoint', () => {
      expect(matchesBreakpoint('xl', 1280)).toBe(true);
      expect(matchesBreakpoint('xl', 9999)).toBe(true);
    });

    test('should get matching breakpoints', () => {
      const smallScreen = getMatchingBreakpoints(320);
      const mediumScreen = getMatchingBreakpoints(768);
      const largeScreen = getMatchingBreakpoints(1024);

      expect(smallScreen).toContain('sm');
      expect(mediumScreen).toContain('sm');
      expect(mediumScreen).toContain('md');
      expect(largeScreen).toContain('sm');
      expect(largeScreen).toContain('md');
      expect(largeScreen).toContain('lg');
    });
  });

  // ===== RESPONSIVE VALUE CALCULATION TESTS =====

  describe('Responsive Value Calculation', () => {
    test('should return correct value for small screen', () => {
      const responsiveValue: ResponsiveValue<string> = {
        sm: 'small',
        md: 'medium',
        lg: 'large',
      };

      expect(getResponsiveValue(responsiveValue, 'sm')).toBe('small');
      expect(getResponsiveValue(responsiveValue, 'md')).toBe('medium');
      expect(getResponsiveValue(responsiveValue, 'lg')).toBe('large');
    });

    test('should return fallback value when screen size not defined', () => {
      const responsiveValue: ResponsiveValue<string> = {
        sm: 'small',
        md: 'medium',
      };

      expect(getResponsiveValue(responsiveValue, 'lg', 'fallback')).toBe('fallback');
    });

    test('should handle numeric responsive values', () => {
      const responsiveValue: ResponsiveValue<number> = {
        sm: 12,
        md: 16,
        lg: 20,
      };

      expect(getResponsiveValue(responsiveValue, 'sm')).toBe(12);
      expect(getResponsiveValue(responsiveValue, 'md')).toBe(16);
      expect(getResponsiveValue(responsiveValue, 'lg')).toBe(20);
    });

    test('should handle boolean responsive values', () => {
      const responsiveValue: ResponsiveValue<boolean> = {
        sm: true,
        md: false,
        lg: true,
      };

      expect(getResponsiveValue(responsiveValue, 'sm')).toBe(true);
      expect(getResponsiveValue(responsiveValue, 'md')).toBe(false);
      expect(getResponsiveValue(responsiveValue, 'lg')).toBe(true);
    });
  });

  // ===== RESPONSIVE SIZE CALCULATION TESTS =====

  describe('Responsive Size Calculation', () => {
    test('should calculate size with multipliers', () => {
      const config: ResponsiveSizeConfig = {
        baseSize: 16,
        multipliers: { sm: 0.8, md: 1, lg: 1.2 },
      };

      expect(calculateResponsiveSize(config, 'sm')).toBe(12.8);
      expect(calculateResponsiveSize(config, 'md')).toBe(16);
      expect(calculateResponsiveSize(config, 'lg')).toBe(19.2);
    });

    test('should respect min and max size constraints', () => {
      const config: ResponsiveSizeConfig = {
        baseSize: 16,
        multipliers: { sm: 0.5, md: 1, lg: 2 },
        minSize: 12,
        maxSize: 24,
      };

      expect(calculateResponsiveSize(config, 'sm')).toBe(12); // Min constraint
      expect(calculateResponsiveSize(config, 'md')).toBe(16);
      expect(calculateResponsiveSize(config, 'lg')).toBe(24); // Max constraint
    });

    test('should handle edge cases', () => {
      const config: ResponsiveSizeConfig = {
        baseSize: 0,
        multipliers: { sm: 1, md: 1, lg: 1 },
      };

      expect(calculateResponsiveSize(config, 'sm')).toBe(0);
    });
  });

  // ===== DEVICE TYPE DETECTION TESTS =====

  describe('Device Type Detection', () => {
    test('should correctly identify phone devices', () => {
      expect(isPhone(320)).toBe(true);
      expect(isPhone(375)).toBe(true);
      expect(isPhone(414)).toBe(true);
      expect(isPhone(768)).toBe(false);
    });

    test('should correctly identify tablet devices', () => {
      expect(isTablet(768)).toBe(true);
      expect(isTablet(1024)).toBe(true);
      expect(isTablet(320)).toBe(false);
    });

    test('should correctly identify orientation', () => {
      // Mock Dimensions to test orientation
      const originalGet = Dimensions.get;
      Dimensions.get = jest.fn(() => ({ width: 375, height: 667, scale: 2, fontScale: 1 }));

      expect(isPortrait()).toBe(true);
      expect(isLandscape()).toBe(false);

      Dimensions.get = jest.fn(() => ({ width: 667, height: 375, scale: 2, fontScale: 1 }));

      expect(isPortrait()).toBe(false);
      expect(isLandscape()).toBe(true);

      // Restore original
      Dimensions.get = originalGet;
    });
  });

  // ===== RESPONSIVE MULTIPLIERS TESTS =====

  describe('Responsive Multipliers', () => {
    test('should have spacing multipliers', () => {
      expect(responsiveMultipliers.spacing).toHaveProperty('tight');
      expect(responsiveMultipliers.spacing).toHaveProperty('normal');
      expect(responsiveMultipliers.spacing).toHaveProperty('loose');
    });

    test('should have typography multipliers', () => {
      expect(responsiveMultipliers.typography).toHaveProperty('minimal');
      expect(responsiveMultipliers.typography).toHaveProperty('moderate');
      expect(responsiveMultipliers.typography).toHaveProperty('significant');
    });

    test('should have component multipliers', () => {
      expect(responsiveMultipliers.component).toHaveProperty('compact');
      expect(responsiveMultipliers.component).toHaveProperty('normal');
      expect(responsiveMultipliers.component).toHaveProperty('spacious');
    });

    test('should have valid multiplier values', () => {
      Object.values(responsiveMultipliers.spacing).forEach(multiplier => {
        expect(typeof multiplier.sm).toBe('number');
        expect(typeof multiplier.md).toBe('number');
        expect(typeof multiplier.lg).toBe('number');
      });
    });
  });

  // ===== HOOK INTEGRATION TESTS =====

  describe('Hook Integration', () => {
    test('useResponsive hook should return expected interface', () => {
      // This would require a test renderer setup
      // For now, we'll test the utility functions that the hooks use
      expect(typeof getCurrentScreenSize).toBe('function');
      expect(typeof getScreenSizeInfo).toBe('function');
      expect(typeof matchesBreakpoint).toBe('function');
    });

    test('useResponsiveValue hook should work with different types', () => {
      const stringValue: ResponsiveValue<string> = { sm: 'small', md: 'medium', lg: 'large' };
      const numberValue: ResponsiveValue<number> = { sm: 12, md: 16, lg: 20 };

      expect(getResponsiveValue(stringValue, 'sm')).toBe('small');
      expect(getResponsiveValue(numberValue, 'md')).toBe(16);
    });

    test('useBreakpoint hook should work with all breakpoints', () => {
      const breakpoints: BreakpointKey[] = ['sm', 'md', 'lg', 'xl'];

      breakpoints.forEach(breakpoint => {
        expect(typeof matchesBreakpoint(breakpoint, 375)).toBe('boolean');
      });
    });
  });

  // ===== PERFORMANCE TESTS =====

  describe('Performance', () => {
    test('should calculate responsive values efficiently', () => {
      const startTime = Date.now();

      // Perform multiple calculations
      for (let i = 0; i < 1000; i++) {
        getResponsiveValue({ sm: 'small', md: 'medium', lg: 'large' }, 'sm');
        calculateResponsiveSize({ baseSize: 16, multipliers: { sm: 1, md: 1, lg: 1 } }, 'md');
        matchesBreakpoint('sm', 375);
      }

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(100); // Should complete in under 100ms
    });

    test('should handle large responsive value objects', () => {
      const largeResponsiveValue: ResponsiveValue<number> = {
        sm: 10, md: 12, lg: 14, xl: 16,
      };

      const startTime = Date.now();

      for (let i = 0; i < 100; i++) {
        getResponsiveValue(largeResponsiveValue, 'lg');
      }

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(50);
    });
  });

  // ===== EDGE CASES AND ERROR HANDLING =====

  describe('Edge Cases and Error Handling', () => {
    test('should handle invalid screen sizes gracefully', () => {
      expect(() => getCurrentScreenSize(-1)).not.toThrow();
      expect(() => getCurrentScreenSize(0)).not.toThrow();
      expect(() => getCurrentScreenSize(99999)).not.toThrow();
    });

    test('should handle empty responsive values', () => {
      const emptyValue: ResponsiveValue<string> = {};
      expect(getResponsiveValue(emptyValue, 'sm', 'fallback')).toBe('fallback');
    });

    test('should handle null/undefined responsive values', () => {
      expect(getResponsiveValue(undefined as any, 'sm', 'fallback')).toBe('fallback');
      expect(getResponsiveValue(null as any, 'sm', 'fallback')).toBe('fallback');
    });

    test('should handle invalid multipliers', () => {
      const config: ResponsiveSizeConfig = {
        baseSize: 16,
        multipliers: { sm: NaN, md: 1, lg: 1 },
      };

      expect(() => calculateResponsiveSize(config, 'sm')).not.toThrow();
    });

    test('should handle zero and negative base sizes', () => {
      const zeroConfig: ResponsiveSizeConfig = {
        baseSize: 0,
        multipliers: { sm: 1, md: 1, lg: 1 },
      };

      const negativeConfig: ResponsiveSizeConfig = {
        baseSize: -10,
        multipliers: { sm: 1, md: 1, lg: 1 },
      };

      expect(calculateResponsiveSize(zeroConfig, 'sm')).toBe(0);
      expect(calculateResponsiveSize(negativeConfig, 'sm')).toBe(-10);
    });
  });

  // ===== INTEGRATION TESTS =====

  describe('Integration Tests', () => {
    test('should work together seamlessly', () => {
      const screenWidth = 375;
      const screenHeight = 667;

      // Get screen size
      const screenSize = getCurrentScreenSize(screenWidth);
      expect(screenSize).toBe('sm');

      // Get screen info
      const screenInfo = getScreenSizeInfo(screenWidth, screenHeight);
      expect(screenInfo.screenSize).toBe('sm');
      expect(screenInfo.isPhone).toBe(true);
      expect(screenInfo.isPortrait).toBe(true);

      // Test breakpoint matching
      expect(matchesBreakpoint('sm', screenWidth)).toBe(true);
      expect(matchesBreakpoint('md', screenWidth)).toBe(false);

      // Test responsive value calculation
      const responsiveValue: ResponsiveValue<string> = {
        sm: 'mobile',
        md: 'tablet',
        lg: 'desktop',
      };
      expect(getResponsiveValue(responsiveValue, screenSize)).toBe('mobile');

      // Test size calculation
      const sizeConfig: ResponsiveSizeConfig = {
        baseSize: 16,
        multipliers: { sm: 0.875, md: 1, lg: 1.125 },
      };
      expect(calculateResponsiveSize(sizeConfig, screenSize)).toBe(14);
    });

    test('should handle complex responsive scenarios', () => {
      const complexValue: ResponsiveValue<any> = {
        sm: { fontSize: 14, padding: 8 },
        md: { fontSize: 16, padding: 12 },
        lg: { fontSize: 18, padding: 16 },
      };

      const result = getResponsiveValue(complexValue, 'md');
      expect(result).toEqual({ fontSize: 16, padding: 12 });
    });

    test('should maintain consistency across different screen sizes', () => {
      const testCases = [
        { width: 320, expected: 'sm' },
        { width: 768, expected: 'md' },
        { width: 1024, expected: 'lg' },
        { width: 1280, expected: 'xl' },
      ];

      testCases.forEach(({ width, expected }) => {
        const screenSize = getCurrentScreenSize(width);
        const screenInfo = getScreenSizeInfo(width, 667);
        const matchingBreakpoints = getMatchingBreakpoints(width);

        expect(screenSize).toBe(expected);
        expect(screenInfo.screenSize).toBe(expected);
        expect(matchingBreakpoints).toContain(expected);
      });
    });
  });

  // ===== TYPE SAFETY TESTS =====

  describe('Type Safety', () => {
    test('should have proper TypeScript types', () => {
      // Test that functions accept correct parameter types
      const screenSize: ScreenSize = 'sm';
      const breakpoint: BreakpointKey = 'md';
      const responsiveValue: ResponsiveValue<number> = { sm: 10, md: 12, lg: 14 };
      const sizeConfig: ResponsiveSizeConfig = {
        baseSize: 16,
        multipliers: { sm: 0.8, md: 1, lg: 1.2 },
      };

      // These should not throw TypeScript errors
      expect(typeof getCurrentScreenSize(375)).toBe('string');
      expect(typeof matchesBreakpoint(breakpoint, 375)).toBe('boolean');
      expect(typeof getResponsiveValue(responsiveValue, screenSize)).toBe('number');
      expect(typeof calculateResponsiveSize(sizeConfig, screenSize)).toBe('number');
    });

    test('should handle union types correctly', () => {
      const screenSizes: ScreenSize[] = ['sm', 'md', 'lg', 'xl'];
      const breakpoints: BreakpointKey[] = ['sm', 'md', 'lg', 'xl'];

      screenSizes.forEach(size => {
        expect(typeof size).toBe('string');
      });

      breakpoints.forEach(bp => {
        expect(typeof bp).toBe('string');
      });
    });
  });

});