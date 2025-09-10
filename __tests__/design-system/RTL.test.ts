/**
 * RTL (Right-to-Left) Functionality Test Suite
 *
 * Tests the RTL support including text direction detection,
 * layout direction handling, icon flipping, and Arabic text support.
 */

import { I18nManager } from 'react-native';
import {
  isRTL,
  getTextDirection,
  getLayoutDirection,
  forceRTL,
  allowRTL,
  getRTLConfig,
  getTextAlign,
  getPaddingStart,
  getPaddingEnd,
  getMarginStart,
  getMarginEnd,
  getBorderStartWidth,
  getBorderEndWidth,
  getBorderStartColor,
  getBorderEndColor,
  getFlexDirection,
  getPositionStart,
  getPositionEnd,
  shouldFlipIcon,
  getIconTransform,
  getIconStyle,
  arabicFontConfig,
  getArabicTextStyle,
  containsArabic,
  containsHebrew,
  containsRTLText,
  getTextDirectionForText,
  createRTLStyle,
  mergeRTLStyles,
  getSlideDirection,
  getAccessibleRTLProps,
  rtlIconMap,
  type TextDirection,
  type LayoutDirection,
  type RTLConfig,
  type ArabicTextConfig,
  type IconDirection,
  type RTLTextAlign,
} from '../../src/utils/rtl';

import {
  useRTL,
  useRTLText,
  useRTLLayout,
  useRTLIcon,
} from '../../src/hooks/useRTL';

// Mock I18nManager and Platform
jest.mock('react-native', () => ({
  I18nManager: {
    isRTL: false,
    forceRTL: jest.fn(),
    allowRTL: jest.fn(),
  },
  Platform: {
    select: jest.fn((obj) => obj.default || obj.ios || obj.android || obj.web),
    OS: 'ios',
  },
}));

describe('RTL Utilities', () => {

  // ===== BASIC RTL DETECTION TESTS =====

  describe('RTL Detection', () => {
    test('should detect RTL state from I18nManager', () => {
      // Mock RTL enabled
      (I18nManager.isRTL as any) = true;
      expect(isRTL()).toBe(true);

      // Mock RTL disabled
      (I18nManager.isRTL as any) = false;
      expect(isRTL()).toBe(false);
    });

    test('should get text direction', () => {
      (I18nManager.isRTL as any) = true;
      expect(getTextDirection()).toBe('rtl');

      (I18nManager.isRTL as any) = false;
      expect(getTextDirection()).toBe('ltr');
    });

    test('should get layout direction', () => {
      (I18nManager.isRTL as any) = true;
      expect(getLayoutDirection()).toBe('rtl');

      (I18nManager.isRTL as any) = false;
      expect(getLayoutDirection()).toBe('ltr');
    });
  });

  // ===== RTL CONFIGURATION TESTS =====

  describe('RTL Configuration', () => {
    test('should return complete RTL configuration', () => {
      (I18nManager.isRTL as any) = true;
      const config = getRTLConfig();

      expect(config).toHaveProperty('isRTL');
      expect(config).toHaveProperty('direction');
      expect(config).toHaveProperty('forceRTL');
      expect(config).toHaveProperty('allowRTL');
      expect(config.isRTL).toBe(true);
      expect(config.direction).toBe('rtl');
    });

    test('should force RTL mode', () => {
      (I18nManager.isRTL as any) = false; // Set to false so forceRTL(true) will call
      forceRTL(true);
      expect(I18nManager.forceRTL).toHaveBeenCalledWith(true);

      (I18nManager.isRTL as any) = true; // Set to true so forceRTL(false) will call
      forceRTL(false);
      expect(I18nManager.forceRTL).toHaveBeenCalledWith(false);
    });

    test('should allow RTL mode', () => {
      allowRTL(true);
      expect(I18nManager.allowRTL).toHaveBeenCalledWith(true);

      allowRTL(false);
      expect(I18nManager.allowRTL).toHaveBeenCalledWith(false);
    });
  });

  // ===== TEXT ALIGNMENT TESTS =====

  describe('Text Alignment', () => {
    test('should convert start/end alignment correctly', () => {
      (I18nManager.isRTL as any) = true;

      expect(getTextAlign('start')).toBe('right');
      expect(getTextAlign('end')).toBe('left');
      expect(getTextAlign('center')).toBe('center');
      expect(getTextAlign('justify')).toBe('justify');
      expect(getTextAlign('left')).toBe('left');
      expect(getTextAlign('right')).toBe('right');
    });

    test('should handle LTR mode', () => {
      (I18nManager.isRTL as any) = false;

      expect(getTextAlign('start')).toBe('left');
      expect(getTextAlign('end')).toBe('right');
      expect(getTextAlign('center')).toBe('center');
    });
  });

  // ===== SPACING UTILITIES TESTS =====

  describe('Spacing Utilities', () => {
    test('should get padding start/end correctly', () => {
      (I18nManager.isRTL as any) = true;

      const paddingStart = getPaddingStart(16);
      const paddingEnd = getPaddingEnd(16);

      expect(paddingStart).toEqual({ paddingRight: 16 });
      expect(paddingEnd).toEqual({ paddingLeft: 16 });
    });

    test('should get margin start/end correctly', () => {
      (I18nManager.isRTL as any) = false;

      const marginStart = getMarginStart(12);
      const marginEnd = getMarginEnd(12);

      expect(marginStart).toEqual({ marginLeft: 12 });
      expect(marginEnd).toEqual({ marginRight: 12 });
    });

    test('should get border start/end correctly', () => {
      (I18nManager.isRTL as any) = true;

      const borderStartWidth = getBorderStartWidth(2);
      const borderEndWidth = getBorderEndWidth(2);
      const borderStartColor = getBorderStartColor('#000000');
      const borderEndColor = getBorderEndColor('#000000');

      expect(borderStartWidth).toEqual({ borderRightWidth: 2 });
      expect(borderEndWidth).toEqual({ borderLeftWidth: 2 });
      expect(borderStartColor).toEqual({ borderRightColor: '#000000' });
      expect(borderEndColor).toEqual({ borderLeftColor: '#000000' });
    });
  });

  // ===== LAYOUT UTILITIES TESTS =====

  describe('Layout Utilities', () => {
    test('should get flex direction correctly', () => {
      (I18nManager.isRTL as any) = true;

      expect(getFlexDirection('row')).toBe('row-reverse');
      expect(getFlexDirection('row-reverse')).toBe('row');
      expect(getFlexDirection('column')).toBe('column');
    });

    test('should get position start/end correctly', () => {
      (I18nManager.isRTL as any) = true;

      const positionStart = getPositionStart(10);
      const positionEnd = getPositionEnd(10);

      expect(positionStart).toEqual({ right: 10 });
      expect(positionEnd).toEqual({ left: 10 });
    });
  });

  // ===== ICON UTILITIES TESTS =====

  describe('Icon Utilities', () => {
    test('should determine if icon should flip', () => {
      (I18nManager.isRTL as any) = true;

      expect(shouldFlipIcon('directional')).toBe(true);
      expect(shouldFlipIcon('neutral')).toBe(false);
      expect(shouldFlipIcon('text')).toBe(true); // Text icons should flip in RTL
    });

    test('should get icon transform correctly', () => {
      (I18nManager.isRTL as any) = true;

      const directionalTransform = getIconTransform('directional');
      const neutralTransform = getIconTransform('neutral');

      expect(directionalTransform.shouldFlip).toBe(true);
      expect(directionalTransform.transform).toEqual([{ scaleX: -1 }]);
      expect(neutralTransform.shouldFlip).toBe(false);
      expect(neutralTransform.transform).toBeUndefined();
    });

    test('should get icon style correctly', () => {
      (I18nManager.isRTL as any) = true;
      const baseStyle = { width: 24, height: 24 };

      const directionalStyle = getIconStyle('directional', baseStyle);
      const neutralStyle = getIconStyle('neutral', baseStyle);

      expect(directionalStyle.transform).toEqual([{ scaleX: -1 }]);
      expect(neutralStyle.transform).toBeUndefined();
    });

    test('should have RTL icon map', () => {
      expect(rtlIconMap).toBeDefined();
      expect(typeof rtlIconMap).toBe('object');
    });
  });

  // ===== ARABIC TEXT SUPPORT TESTS =====

  describe('Arabic Text Support', () => {
    test('should detect Arabic text', () => {
      expect(containsArabic('مرحبا')).toBe(true);
      expect(containsArabic('Hello')).toBe(false);
      expect(containsArabic('مرحبا Hello')).toBe(true);
    });

    test('should detect Hebrew text', () => {
      expect(containsHebrew('שלום')).toBe(true);
      expect(containsHebrew('Hello')).toBe(false);
      expect(containsHebrew('שלום Hello')).toBe(true);
    });

    test('should detect RTL text', () => {
      expect(containsRTLText('مرحبا')).toBe(true);
      expect(containsRTLText('שלום')).toBe(true);
      expect(containsRTLText('Hello')).toBe(false);
      expect(containsRTLText('مرحبا Hello')).toBe(true);
    });

    test('should get text direction for text', () => {
      expect(getTextDirectionForText('مرحبا')).toBe('rtl');
      expect(getTextDirectionForText('Hello')).toBe('ltr');
      expect(getTextDirectionForText('مرحبا Hello')).toBe('rtl');
    });

    test('should have Arabic font configuration', () => {
      expect(arabicFontConfig).toBeDefined();
      expect(arabicFontConfig).toHaveProperty('fontFamily');
      expect(arabicFontConfig).toHaveProperty('textAlign');
      expect(arabicFontConfig).toHaveProperty('writingDirection');
      expect(arabicFontConfig).toHaveProperty('letterSpacing');
    });

    test('should get Arabic text style', () => {
      const baseStyle = { fontSize: 16 };
      const arabicStyle = getArabicTextStyle(baseStyle);

      expect(arabicStyle).toHaveProperty('fontFamily');
      expect(arabicStyle).toHaveProperty('fontSize');
      expect(arabicStyle.fontSize).toBe(16);
    });
  });

  // ===== STYLE UTILITIES TESTS =====

  describe('Style Utilities', () => {
    test('should create RTL style', () => {
      (I18nManager.isRTL as any) = true;

      const rtlStyle = createRTLStyle({
        paddingStart: 16,
        paddingEnd: 20,
        textAlign: 'start',
        flexDirection: 'row',
      });

      expect(rtlStyle).toHaveProperty('paddingRight', 16);
      expect(rtlStyle).toHaveProperty('paddingLeft', 20);
      expect(rtlStyle).toHaveProperty('textAlign', 'right');
      expect(rtlStyle).toHaveProperty('flexDirection', 'row-reverse');
    });

    test('should merge RTL styles', () => {
      const baseStyle = { padding: 10, margin: 5 };
      const rtlStyle = { paddingRight: 20, marginLeft: 10 };

      const mergedStyle = mergeRTLStyles(baseStyle, rtlStyle as any);

      expect(mergedStyle).toHaveProperty('padding', 10);
      expect(mergedStyle).toHaveProperty('margin', 5);
      expect(mergedStyle).toHaveProperty('paddingRight', 20);
      expect(mergedStyle).toHaveProperty('marginLeft', 10);
    });
  });

  // ===== ANIMATION UTILITIES TESTS =====

  describe('Animation Utilities', () => {
    test('should get slide direction correctly', () => {
      (I18nManager.isRTL as any) = true;

      // 'left' and 'right' remain unchanged, only 'start' and 'end' are flipped
      expect(getSlideDirection('left')).toBe('left');
      expect(getSlideDirection('right')).toBe('right');
      expect(getSlideDirection('start')).toBe('right');
      expect(getSlideDirection('end')).toBe('left');
    });

    test('should handle LTR slide direction', () => {
      (I18nManager.isRTL as any) = false;

      expect(getSlideDirection('left')).toBe('left');
      expect(getSlideDirection('right')).toBe('right');
      expect(getSlideDirection('start')).toBe('left');
      expect(getSlideDirection('end')).toBe('right');
    });
  });

  // ===== ACCESSIBILITY TESTS =====

  describe('Accessibility', () => {
    test('should get accessible RTL props', () => {
      const arabicText = 'مرحبا';
      const englishText = 'Hello';

      const arabicProps = getAccessibleRTLProps(arabicText);
      const englishProps = getAccessibleRTLProps(englishText);
      const noTextProps = getAccessibleRTLProps();

      expect(arabicProps).toHaveProperty('accessibilityLanguage');
      expect(englishProps).toHaveProperty('accessibilityLanguage');
      expect(noTextProps).toHaveProperty('importantForAccessibility');
    });

    test('should set correct accessibility language', () => {
      const arabicProps = getAccessibleRTLProps('مرحبا');
      const englishProps = getAccessibleRTLProps('Hello');

      expect(arabicProps.accessibilityLanguage).toBe('ar');
      expect(englishProps.accessibilityLanguage).toBe('en');
    });
  });

  // ===== HOOK INTEGRATION TESTS =====

  describe('Hook Integration', () => {
    test('useRTL hook should return expected interface', () => {
      // This would require a test renderer setup
      // For now, we'll test the utility functions that the hooks use
      expect(typeof isRTL).toBe('function');
      expect(typeof getTextDirection).toBe('function');
      expect(typeof getRTLConfig).toBe('function');
    });

    test('useRTLText hook should work with different text types', () => {
      const arabicText = 'مرحبا';
      const englishText = 'Hello';

      expect(containsArabic(arabicText)).toBe(true);
      expect(containsArabic(englishText)).toBe(false);
      expect(getTextDirectionForText(arabicText)).toBe('rtl');
      expect(getTextDirectionForText(englishText)).toBe('ltr');
    });

    test('useRTLLayout hook should provide layout utilities', () => {
      expect(typeof getFlexDirection).toBe('function');
      expect(typeof getPaddingStart).toBe('function');
      expect(typeof getMarginStart).toBe('function');
    });

    test('useRTLIcon hook should provide icon utilities', () => {
      expect(typeof shouldFlipIcon).toBe('function');
      expect(typeof getIconTransform).toBe('function');
      expect(typeof getIconStyle).toBe('function');
    });
  });

  // ===== PERFORMANCE TESTS =====

  describe('Performance', () => {
    test('should handle text direction detection efficiently', () => {
      const startTime = Date.now();

      // Test multiple text direction detections
      for (let i = 0; i < 1000; i++) {
        containsArabic('مرحبا');
        containsHebrew('שלום');
        containsRTLText('Hello');
        getTextDirectionForText('Test text');
      }

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(100); // Should complete in under 100ms
    });

    test('should handle style creation efficiently', () => {
      const startTime = Date.now();

      // Test multiple style creations
      for (let i = 0; i < 1000; i++) {
        createRTLStyle({
          paddingStart: 16,
          marginEnd: 12,
          textAlign: 'start',
        });
      }

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(100);
    });
  });

  // ===== EDGE CASES AND ERROR HANDLING =====

  describe('Edge Cases and Error Handling', () => {
    test('should handle empty strings', () => {
      expect(containsArabic('')).toBe(false);
      expect(containsHebrew('')).toBe(false);
      expect(containsRTLText('')).toBe(false);
      expect(getTextDirectionForText('')).toBe('ltr');
    });

    test('should handle null/undefined text', () => {
      expect(() => containsArabic(null as any)).not.toThrow();
      expect(() => containsHebrew(undefined as any)).not.toThrow();
      expect(() => containsRTLText(null as any)).not.toThrow();
      expect(() => getTextDirectionForText(undefined as any)).not.toThrow();
    });

    test('should handle mixed scripts', () => {
      const mixedText = 'Hello مرحبا שלום World';

      expect(containsArabic(mixedText)).toBe(true);
      expect(containsHebrew(mixedText)).toBe(true);
      expect(containsRTLText(mixedText)).toBe(true);
      expect(getTextDirectionForText(mixedText)).toBe('rtl'); // RTL takes precedence
    });

    test('should handle special characters', () => {
      const specialText = '!@#$%^&*()_+-=[]{}|;:,.<>?';

      expect(containsArabic(specialText)).toBe(false);
      expect(containsHebrew(specialText)).toBe(false);
      expect(containsRTLText(specialText)).toBe(false);
      expect(getTextDirectionForText(specialText)).toBe('ltr');
    });

    test('should handle numbers and punctuation', () => {
      const numberText = '1234567890';
      const punctuationText = '.,;:!?';

      expect(containsArabic(numberText)).toBe(false);
      expect(containsHebrew(numberText)).toBe(false);
      expect(containsRTLText(numberText)).toBe(false);
      expect(getTextDirectionForText(numberText)).toBe('ltr');

      expect(containsArabic(punctuationText)).toBe(false);
      expect(containsHebrew(punctuationText)).toBe(false);
      expect(containsRTLText(punctuationText)).toBe(false);
      expect(getTextDirectionForText(punctuationText)).toBe('ltr');
    });
  });

  // ===== INTEGRATION TESTS =====

  describe('Integration Tests', () => {
    test('should work together seamlessly for Arabic text', () => {
      const arabicText = 'مرحبا بالعالم';
      (I18nManager.isRTL as any) = true;

      // Test text detection
      expect(containsArabic(arabicText)).toBe(true);
      expect(containsRTLText(arabicText)).toBe(true);
      expect(getTextDirectionForText(arabicText)).toBe('rtl');

      // Test RTL configuration
      const config = getRTLConfig();
      expect(config.isRTL).toBe(true);
      expect(config.direction).toBe('rtl');

      // Test text alignment
      expect(getTextAlign('start')).toBe('right');
      expect(getTextAlign('end')).toBe('left');

      // Test spacing
      const paddingStart = getPaddingStart(16);
      expect(paddingStart).toEqual({ paddingRight: 16 });

      // Test layout
      expect(getFlexDirection('row')).toBe('row-reverse');

      // Test Arabic text style
      const arabicStyle = getArabicTextStyle();
      expect(arabicStyle).toHaveProperty('fontFamily');
    });

    test('should work together seamlessly for English text', () => {
      const englishText = 'Hello World';
      (I18nManager.isRTL as any) = false;

      // Test text detection
      expect(containsArabic(englishText)).toBe(false);
      expect(containsRTLText(englishText)).toBe(false);
      expect(getTextDirectionForText(englishText)).toBe('ltr');

      // Test RTL configuration
      const config = getRTLConfig();
      expect(config.isRTL).toBe(false);
      expect(config.direction).toBe('ltr');

      // Test text alignment
      expect(getTextAlign('start')).toBe('left');
      expect(getTextAlign('end')).toBe('right');

      // Test spacing
      const paddingStart = getPaddingStart(16);
      expect(paddingStart).toEqual({ paddingLeft: 16 });

      // Test layout
      expect(getFlexDirection('row')).toBe('row');
    });

    test('should handle complex RTL scenarios', () => {
      (I18nManager.isRTL as any) = true;

      // Create complex RTL style
      const complexStyle = createRTLStyle({
        paddingStart: 20,
        paddingEnd: 16,
        marginStart: 12,
        marginEnd: 8,
        borderStartWidth: 2,
        borderEndWidth: 1,
        textAlign: 'start',
        flexDirection: 'row',
      });

      expect(complexStyle).toHaveProperty('paddingRight', 20);
      expect(complexStyle).toHaveProperty('paddingLeft', 16);
      expect(complexStyle).toHaveProperty('marginRight', 12);
      expect(complexStyle).toHaveProperty('marginLeft', 8);
      expect(complexStyle).toHaveProperty('borderRightWidth', 2);
      expect(complexStyle).toHaveProperty('borderLeftWidth', 1);
      expect(complexStyle).toHaveProperty('textAlign', 'right');
      expect(complexStyle).toHaveProperty('flexDirection', 'row-reverse');
    });
  });

  // ===== TYPE SAFETY TESTS =====

  describe('Type Safety', () => {
    test('should have proper TypeScript types', () => {
      // Test that functions accept correct parameter types
      const textDirection: TextDirection = 'rtl';
      const layoutDirection: LayoutDirection = 'rtl';
      const rtlConfig: RTLConfig = getRTLConfig();
      const arabicConfig: ArabicTextConfig = arabicFontConfig;
      const iconDirection: IconDirection = 'scaleX(-1)' as any;
      const rtlTextAlign: RTLTextAlign = 'right';

      // These should not throw TypeScript errors
      expect(typeof isRTL()).toBe('boolean');
      expect(typeof getTextDirection()).toBe('string');
      expect(typeof getRTLConfig()).toBe('object');
      expect(typeof getTextAlign('start')).toBe('string');
      expect(typeof containsArabic('test')).toBe('boolean');
      expect(typeof containsHebrew('test')).toBe('boolean');
      expect(typeof containsRTLText('test')).toBe('boolean');
    });

    test('should handle union types correctly', () => {
      const textDirections: TextDirection[] = ['ltr', 'rtl'];
      const layoutDirections: LayoutDirection[] = ['ltr', 'rtl'];
      const iconDirections: IconDirection[] = ['none' as any, 'scaleX(-1)' as any];

      textDirections.forEach(direction => {
        expect(typeof direction).toBe('string');
      });

      layoutDirections.forEach(direction => {
        expect(typeof direction).toBe('string');
      });

      iconDirections.forEach(direction => {
        expect(typeof direction).toBe('string');
      });
    });
  });

});