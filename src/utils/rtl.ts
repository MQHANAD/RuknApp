/**
 * RTL (Right-to-Left) Utilities for Rukn App
 * 
 * This file provides utilities for RTL language support including:
 * - RTL detection using React Native I18nManager
 * - Direction-aware styling functions
 * - Text alignment and layout helpers
 * - Arabic text support utilities
 * - Icon and layout direction helpers
 * - TypeScript interfaces for RTL configurations
 */

import { I18nManager, Platform } from 'react-native';
import { TextStyle, ViewStyle, ImageStyle } from 'react-native';

// ===== TYPES & INTERFACES =====

/**
 * Text direction type
 */
export type TextDirection = 'ltr' | 'rtl';

/**
 * Layout direction type
 */
export type LayoutDirection = 'ltr' | 'rtl';

/**
 * RTL-aware text alignment options
 */
export type RTLTextAlign = 'center' | 'justify' | 'left' | 'right';

/**
 * RTL-aware flex direction options
 */
export type RTLFlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';

/**
 * RTL configuration interface
 */
export interface RTLConfig {
  isRTL: boolean;
  direction: TextDirection;
  forceRTL?: boolean;
  allowRTL?: boolean;
}

/**
 * Direction-aware spacing configuration
 */
export interface RTLSpacing {
  start?: number;
  end?: number;
  top?: number;
  bottom?: number;
}

/**
 * RTL-aware style properties
 */
export interface RTLStyle {
  paddingStart?: number;
  paddingEnd?: number;
  marginStart?: number;
  marginEnd?: number;
  borderStartWidth?: number;
  borderEndWidth?: number;
  borderStartColor?: string;
  borderEndColor?: string;
  textAlign?: RTLTextAlign;
  writingDirection?: TextDirection;
}

/**
 * Icon direction configuration
 */
export interface IconDirection {
  shouldFlip: boolean;
  transform?: { scaleX: number }[];
}

/**
 * Arabic text configuration
 */
export interface ArabicTextConfig {
  fontFamily?: string;
  fontSize?: number;
  lineHeight?: number;
  letterSpacing?: number;
  textAlign?: RTLTextAlign;
  writingDirection?: TextDirection;
}

// ===== RTL DETECTION & STATE =====

/**
 * Check if RTL is currently enabled
 */
export const isRTL = (): boolean => {
  return I18nManager.isRTL;
};

/**
 * Get current text direction
 */
export const getTextDirection = (): TextDirection => {
  return I18nManager.isRTL ? 'rtl' : 'ltr';
};

/**
 * Get current layout direction
 */
export const getLayoutDirection = (): LayoutDirection => {
  return I18nManager.isRTL ? 'rtl' : 'ltr';
};

/**
 * Force RTL mode (requires app restart)
 */
export const forceRTL = (enable: boolean): void => {
  if (I18nManager.isRTL !== enable) {
    I18nManager.forceRTL(enable);
    if (Platform.OS !== 'web') {
      // Note: This requires app restart on native platforms
      console.warn('RTL change requires app restart to take effect');
    }
  }
};

/**
 * Allow RTL to be toggled
 */
export const allowRTL = (allow: boolean): void => {
  I18nManager.allowRTL(allow);
};

/**
 * Get RTL configuration
 */
export const getRTLConfig = (): RTLConfig => {
  return {
    isRTL: I18nManager.isRTL,
    direction: getTextDirection(),
    forceRTL: I18nManager.isRTL,
    allowRTL: true, // Default to allowing RTL
  };
};

// ===== DIRECTION-AWARE STYLING =====

/**
 * Get direction-aware text alignment
 */
export const getTextAlign = (
  alignment: 'start' | 'end' | 'center' | 'justify' | 'left' | 'right',
  rtlOverride?: boolean
): RTLTextAlign => {
  const currentRTL = rtlOverride ?? isRTL();

  switch (alignment) {
    case 'start':
      return currentRTL ? 'right' : 'left';
    case 'end':
      return currentRTL ? 'left' : 'right';
    case 'left':
    case 'right':
    case 'center':
    case 'justify':
      return alignment;
    default:
      return currentRTL ? 'right' : 'left';
  }
};

/**
 * Get direction-aware padding start
 */
export const getPaddingStart = (value: number, rtlOverride?: boolean): ViewStyle => {
  const currentRTL = rtlOverride ?? isRTL();
  return currentRTL ? { paddingRight: value } : { paddingLeft: value };
};

/**
 * Get direction-aware padding end
 */
export const getPaddingEnd = (value: number, rtlOverride?: boolean): ViewStyle => {
  const currentRTL = rtlOverride ?? isRTL();
  return currentRTL ? { paddingLeft: value } : { paddingRight: value };
};

/**
 * Get direction-aware margin start
 */
export const getMarginStart = (value: number, rtlOverride?: boolean): ViewStyle => {
  const currentRTL = rtlOverride ?? isRTL();
  return currentRTL ? { marginRight: value } : { marginLeft: value };
};

/**
 * Get direction-aware margin end
 */
export const getMarginEnd = (value: number, rtlOverride?: boolean): ViewStyle => {
  const currentRTL = rtlOverride ?? isRTL();
  return currentRTL ? { marginLeft: value } : { marginRight: value };
};

/**
 * Get direction-aware border start width
 */
export const getBorderStartWidth = (value: number, rtlOverride?: boolean): ViewStyle => {
  const currentRTL = rtlOverride ?? isRTL();
  return currentRTL ? { borderRightWidth: value } : { borderLeftWidth: value };
};

/**
 * Get direction-aware border end width
 */
export const getBorderEndWidth = (value: number, rtlOverride?: boolean): ViewStyle => {
  const currentRTL = rtlOverride ?? isRTL();
  return currentRTL ? { borderLeftWidth: value } : { borderRightWidth: value };
};

/**
 * Get direction-aware border start color
 */
export const getBorderStartColor = (color: string, rtlOverride?: boolean): ViewStyle => {
  const currentRTL = rtlOverride ?? isRTL();
  return currentRTL ? { borderRightColor: color } : { borderLeftColor: color };
};

/**
 * Get direction-aware border end color
 */
export const getBorderEndColor = (color: string, rtlOverride?: boolean): ViewStyle => {
  const currentRTL = rtlOverride ?? isRTL();
  return currentRTL ? { borderLeftColor: color } : { borderRightColor: color };
};

// ===== FLEX & LAYOUT UTILITIES =====

/**
 * Get direction-aware flex direction
 */
export const getFlexDirection = (
  direction: 'row' | 'row-reverse' | 'column' | 'column-reverse',
  rtlOverride?: boolean
): RTLFlexDirection => {
  const currentRTL = rtlOverride ?? isRTL();

  if (!currentRTL || direction === 'column' || direction === 'column-reverse') {
    return direction;
  }

  // Flip row directions for RTL
  switch (direction) {
    case 'row':
      return 'row-reverse';
    case 'row-reverse':
      return 'row';
    default:
      return direction;
  }
};

/**
 * Get direction-aware position values
 */
export const getPositionStart = (value: number, rtlOverride?: boolean): ViewStyle => {
  const currentRTL = rtlOverride ?? isRTL();
  return currentRTL ? { right: value } : { left: value };
};

/**
 * Get direction-aware position values
 */
export const getPositionEnd = (value: number, rtlOverride?: boolean): ViewStyle => {
  const currentRTL = rtlOverride ?? isRTL();
  return currentRTL ? { left: value } : { right: value };
};

// ===== ICON & IMAGE UTILITIES =====

/**
 * Determine if an icon should be flipped in RTL
 */
export const shouldFlipIcon = (iconType: 'directional' | 'neutral' | 'text'): boolean => {
  if (!isRTL()) return false;

  switch (iconType) {
    case 'directional':
      return true; // Arrows, chevrons, etc.
    case 'text':
      return true; // Icons with text elements
    case 'neutral':
    default:
      return false; // Symmetric icons, logos, etc.
  }
};

/**
 * Get icon transform for RTL
 */
export const getIconTransform = (
  iconType: 'directional' | 'neutral' | 'text',
  rtlOverride?: boolean
): IconDirection => {
  const currentRTL = rtlOverride ?? isRTL();
  const shouldFlip = currentRTL && shouldFlipIcon(iconType);

  return {
    shouldFlip,
    transform: shouldFlip ? [{ scaleX: -1 }] : undefined,
  };
};

/**
 * Get RTL-aware icon style
 */
export const getIconStyle = (
  iconType: 'directional' | 'neutral' | 'text',
  baseStyle?: ImageStyle,
  rtlOverride?: boolean
): ImageStyle => {
  const { transform } = getIconTransform(iconType, rtlOverride);
  
  return {
    ...baseStyle,
    ...(transform && { transform }),
  };
};

// ===== ARABIC TEXT UTILITIES =====

/**
 * Default Arabic font configuration
 */
export const arabicFontConfig: ArabicTextConfig = {
  fontFamily: Platform.select({
    ios: 'Damascus', // Native Arabic font on iOS
    android: 'Noto Sans Arabic', // Google Noto font for Android
    web: '"Noto Sans Arabic", "Arial Unicode MS", sans-serif', // Web fallback
    default: 'System',
  }),
  textAlign: 'right',
  writingDirection: 'rtl',
  letterSpacing: 0, // Arabic doesn't typically use letter spacing
};

/**
 * Get Arabic text style configuration
 */
export const getArabicTextStyle = (
  baseStyle?: TextStyle,
  customConfig?: Partial<ArabicTextConfig>
): TextStyle => {
  const config = { ...arabicFontConfig, ...customConfig };
  
  return {
    ...baseStyle,
    fontFamily: config.fontFamily,
    textAlign: getTextAlign(config.textAlign || 'start') as TextStyle['textAlign'],
    writingDirection: config.writingDirection,
    letterSpacing: config.letterSpacing,
    ...(config.fontSize && { fontSize: config.fontSize }),
    ...(config.lineHeight && { lineHeight: config.lineHeight }),
  };
};

/**
 * Check if text contains Arabic characters
 */
export const containsArabic = (text: string): boolean => {
  // Arabic Unicode range: \u0600-\u06FF, \u0750-\u077F, \uFB50-\uFDFF, \uFE70-\uFEFF
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicRegex.test(text);
};

/**
 * Check if text contains Hebrew characters
 */
export const containsHebrew = (text: string): boolean => {
  // Hebrew Unicode range: \u0590-\u05FF
  const hebrewRegex = /[\u0590-\u05FF]/;
  return hebrewRegex.test(text);
};

/**
 * Check if text contains RTL characters
 */
export const containsRTLText = (text: string): boolean => {
  return containsArabic(text) || containsHebrew(text);
};

/**
 * Get appropriate text direction for given text
 */
export const getTextDirectionForText = (text: string): TextDirection => {
  if (containsRTLText(text)) {
    return 'rtl';
  }
  return 'ltr';
};

// ===== COMPOUND STYLING UTILITIES =====

/**
 * Create comprehensive RTL-aware style object
 */
export const createRTLStyle = (
  style: {
    paddingStart?: number;
    paddingEnd?: number;
    marginStart?: number;
    marginEnd?: number;
    borderStartWidth?: number;
    borderEndWidth?: number;
    borderStartColor?: string;
    borderEndColor?: string;
    textAlign?: 'start' | 'end' | 'center' | 'justify' | 'left' | 'right';
    flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  },
  rtlOverride?: boolean
): ViewStyle & TextStyle => {
  const rtlStyle: ViewStyle & TextStyle = {};

  // Handle padding
  if (style.paddingStart !== undefined) {
    Object.assign(rtlStyle, getPaddingStart(style.paddingStart, rtlOverride));
  }
  if (style.paddingEnd !== undefined) {
    Object.assign(rtlStyle, getPaddingEnd(style.paddingEnd, rtlOverride));
  }

  // Handle margin
  if (style.marginStart !== undefined) {
    Object.assign(rtlStyle, getMarginStart(style.marginStart, rtlOverride));
  }
  if (style.marginEnd !== undefined) {
    Object.assign(rtlStyle, getMarginEnd(style.marginEnd, rtlOverride));
  }

  // Handle borders
  if (style.borderStartWidth !== undefined) {
    Object.assign(rtlStyle, getBorderStartWidth(style.borderStartWidth, rtlOverride));
  }
  if (style.borderEndWidth !== undefined) {
    Object.assign(rtlStyle, getBorderEndWidth(style.borderEndWidth, rtlOverride));
  }
  if (style.borderStartColor !== undefined) {
    Object.assign(rtlStyle, getBorderStartColor(style.borderStartColor, rtlOverride));
  }
  if (style.borderEndColor !== undefined) {
    Object.assign(rtlStyle, getBorderEndColor(style.borderEndColor, rtlOverride));
  }

  // Handle text alignment
  if (style.textAlign !== undefined) {
    rtlStyle.textAlign = getTextAlign(style.textAlign, rtlOverride) as TextStyle['textAlign'];
  }

  // Handle flex direction
  if (style.flexDirection !== undefined) {
    rtlStyle.flexDirection = getFlexDirection(style.flexDirection, rtlOverride);
  }

  return rtlStyle;
};

/**
 * Merge RTL-aware styles with base styles
 */
export const mergeRTLStyles = <T extends ViewStyle | TextStyle>(
  baseStyle: T,
  rtlStyle: Partial<T>,
  rtlOverride?: boolean
): T => {
  const currentRTL = rtlOverride ?? isRTL();
  
  if (!currentRTL) {
    return baseStyle;
  }

  return {
    ...baseStyle,
    ...rtlStyle,
  };
};

// ===== ANIMATION UTILITIES =====

/**
 * Get RTL-aware slide animation direction
 */
export const getSlideDirection = (
  direction: 'left' | 'right' | 'start' | 'end',
  rtlOverride?: boolean
): 'left' | 'right' => {
  const currentRTL = rtlOverride ?? isRTL();

  switch (direction) {
    case 'start':
      return currentRTL ? 'right' : 'left';
    case 'end':
      return currentRTL ? 'left' : 'right';
    case 'left':
    case 'right':
    default:
      return direction as 'left' | 'right';
  }
};

// ===== ACCESSIBILITY UTILITIES =====

/**
 * Get accessible RTL configuration for screen readers
 */
export const getAccessibleRTLProps = (text?: string) => {
  const textDirection = text ? getTextDirectionForText(text) : getTextDirection();
  
  return {
    accessibilityLanguage: textDirection === 'rtl' ? 'ar' : 'en',
    importantForAccessibility: 'yes' as const,
    accessible: true,
  };
};

// ===== CONSTANTS =====

/**
 * Common RTL-aware directional icons mapping
 */
export const rtlIconMap = {
  'arrow-left': isRTL() ? 'arrow-right' : 'arrow-left',
  'arrow-right': isRTL() ? 'arrow-left' : 'arrow-right',
  'chevron-left': isRTL() ? 'chevron-right' : 'chevron-left',
  'chevron-right': isRTL() ? 'chevron-left' : 'chevron-right',
  'caret-left': isRTL() ? 'caret-right' : 'caret-left',
  'caret-right': isRTL() ? 'caret-left' : 'caret-right',
} as const;

/**
 * Default export with all RTL utilities
 */
export default {
  // RTL detection
  isRTL,
  getTextDirection,
  getLayoutDirection,
  forceRTL,
  allowRTL,
  getRTLConfig,
  
  // Direction-aware styling
  getTextAlign,
  getPaddingStart,
  getPaddingEnd,
  getMarginStart,
  getMarginEnd,
  getBorderStartWidth,
  getBorderEndWidth,
  getBorderStartColor,
  getBorderEndColor,
  
  // Layout utilities
  getFlexDirection,
  getPositionStart,
  getPositionEnd,
  
  // Icon utilities
  shouldFlipIcon,
  getIconTransform,
  getIconStyle,
  
  // Arabic text utilities
  arabicFontConfig,
  getArabicTextStyle,
  containsArabic,
  containsHebrew,
  containsRTLText,
  getTextDirectionForText,
  
  // Compound utilities
  createRTLStyle,
  mergeRTLStyles,
  
  // Animation utilities
  getSlideDirection,
  
  // Accessibility
  getAccessibleRTLProps,
  
  // Constants
  rtlIconMap,
};