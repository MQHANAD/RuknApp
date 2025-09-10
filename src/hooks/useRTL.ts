/**
 * useRTL Hook for Rukn App
 * 
 * This React hook provides RTL (Right-to-Left) support including:
 * - RTL detection and state management
 * - Direction-aware styling helpers
 * - Arabic text support utilities
 * - Icon direction helpers
 * - Integration with React Native I18nManager
 * - Performance-optimized with memoization
 */

import { useMemo, useCallback, useEffect, useState } from 'react';
import { I18nManager } from 'react-native';
import { TextStyle, ViewStyle, ImageStyle } from 'react-native';
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
} from '../utils/rtl';

// ===== HOOK INTERFACES =====

/**
 * UseRTL hook return type
 */
export interface UseRTLReturn {
  // RTL state
  isRTL: boolean;
  textDirection: TextDirection;
  layoutDirection: LayoutDirection;
  config: RTLConfig;
  
  // RTL control functions
  forceRTL: (enable: boolean) => void;
  allowRTL: (allow: boolean) => void;
  
  // Direction-aware styling helpers
  textAlign: (alignment: 'start' | 'end' | 'center' | 'justify' | 'left' | 'right') => RTLTextAlign;
  paddingStart: (value: number) => ViewStyle;
  paddingEnd: (value: number) => ViewStyle;
  marginStart: (value: number) => ViewStyle;
  marginEnd: (value: number) => ViewStyle;
  borderStartWidth: (value: number) => ViewStyle;
  borderEndWidth: (value: number) => ViewStyle;
  borderStartColor: (color: string) => ViewStyle;
  borderEndColor: (color: string) => ViewStyle;
  
  // Layout helpers
  flexDirection: (direction: 'row' | 'row-reverse' | 'column' | 'column-reverse') => 'row' | 'row-reverse' | 'column' | 'column-reverse';
  positionStart: (value: number) => ViewStyle;
  positionEnd: (value: number) => ViewStyle;
  
  // Icon utilities
  shouldFlipIcon: (iconType: 'directional' | 'neutral' | 'text') => boolean;
  getIconTransform: (iconType: 'directional' | 'neutral' | 'text') => IconDirection;
  getIconStyle: (iconType: 'directional' | 'neutral' | 'text', baseStyle?: ImageStyle) => ImageStyle;
  iconMap: typeof rtlIconMap;
  
  // Text utilities
  arabicFontConfig: ArabicTextConfig;
  getArabicTextStyle: (baseStyle?: TextStyle, customConfig?: Partial<ArabicTextConfig>) => TextStyle;
  containsArabic: (text: string) => boolean;
  containsHebrew: (text: string) => boolean;
  containsRTLText: (text: string) => boolean;
  getTextDirectionForText: (text: string) => TextDirection;
  
  // Compound utilities
  createRTLStyle: (style: {
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
  }) => ViewStyle & TextStyle;
  mergeRTLStyles: <T extends ViewStyle | TextStyle>(baseStyle: T, rtlStyle: Partial<T>) => T;
  
  // Animation utilities
  getSlideDirection: (direction: 'left' | 'right' | 'start' | 'end') => 'left' | 'right';
  
  // Accessibility
  getAccessibleRTLProps: (text?: string) => {
    accessibilityLanguage: string;
    importantForAccessibility: 'yes';
    accessible: boolean;
  };
}

/**
 * Options for useRTL hook
 */
export interface UseRTLOptions {
  /**
   * Whether to automatically detect RTL from text content
   * @default false
   */
  autoDetectFromText?: boolean;
  
  /**
   * Override RTL state (for testing or specific requirements)
   */
  rtlOverride?: boolean;
  
  /**
   * Whether to listen to I18nManager changes
   * @default true
   */
  listenToI18nChanges?: boolean;
}

// ===== CUSTOM HOOK =====

/**
 * useRTL Hook
 * 
 * Provides comprehensive RTL support with direction-aware styling helpers,
 * text utilities, and performance-optimized functions.
 */
export const useRTL = (options: UseRTLOptions = {}): UseRTLReturn => {
  const {
    autoDetectFromText = false,
    rtlOverride,
    listenToI18nChanges = true,
  } = options;

  // ===== STATE MANAGEMENT =====

  // Track I18nManager state changes (if supported by platform)
  const [i18nState, setI18nState] = useState(() => ({
    isRTL: I18nManager.isRTL,
    textDirection: getTextDirection(),
    layoutDirection: getLayoutDirection(),
  }));

  // Listen to I18nManager changes if supported and enabled
  useEffect(() => {
    if (!listenToI18nChanges) return;

    // Note: React Native doesn't have a direct listener for I18nManager changes
    // This is a placeholder for future implementation or platform-specific handling
    const checkI18nState = () => {
      const newState = {
        isRTL: I18nManager.isRTL,
        textDirection: getTextDirection(),
        layoutDirection: getLayoutDirection(),
      };
      
      if (
        newState.isRTL !== i18nState.isRTL ||
        newState.textDirection !== i18nState.textDirection ||
        newState.layoutDirection !== i18nState.layoutDirection
      ) {
        setI18nState(newState);
      }
    };

    // Check periodically (this is a fallback approach)
    const interval = setInterval(checkI18nState, 1000);
    
    return () => clearInterval(interval);
  }, [i18nState, listenToI18nChanges]);

  // ===== MEMOIZED VALUES =====

  // Determine effective RTL state
  const effectiveRTL = useMemo(() => {
    if (rtlOverride !== undefined) return rtlOverride;
    return i18nState.isRTL;
  }, [rtlOverride, i18nState.isRTL]);

  // RTL configuration
  const config = useMemo((): RTLConfig => {
    return {
      ...getRTLConfig(),
      isRTL: effectiveRTL,
      direction: effectiveRTL ? 'rtl' : 'ltr',
    };
  }, [effectiveRTL]);

  // ===== MEMOIZED UTILITY FUNCTIONS =====

  // Direction-aware styling helpers
  const textAlignHelper = useCallback((
    alignment: 'start' | 'end' | 'center' | 'justify' | 'left' | 'right'
  ): RTLTextAlign => {
    return getTextAlign(alignment, effectiveRTL);
  }, [effectiveRTL]);

  const paddingStartHelper = useCallback((value: number): ViewStyle => {
    return getPaddingStart(value, effectiveRTL);
  }, [effectiveRTL]);

  const paddingEndHelper = useCallback((value: number): ViewStyle => {
    return getPaddingEnd(value, effectiveRTL);
  }, [effectiveRTL]);

  const marginStartHelper = useCallback((value: number): ViewStyle => {
    return getMarginStart(value, effectiveRTL);
  }, [effectiveRTL]);

  const marginEndHelper = useCallback((value: number): ViewStyle => {
    return getMarginEnd(value, effectiveRTL);
  }, [effectiveRTL]);

  const borderStartWidthHelper = useCallback((value: number): ViewStyle => {
    return getBorderStartWidth(value, effectiveRTL);
  }, [effectiveRTL]);

  const borderEndWidthHelper = useCallback((value: number): ViewStyle => {
    return getBorderEndWidth(value, effectiveRTL);
  }, [effectiveRTL]);

  const borderStartColorHelper = useCallback((color: string): ViewStyle => {
    return getBorderStartColor(color, effectiveRTL);
  }, [effectiveRTL]);

  const borderEndColorHelper = useCallback((color: string): ViewStyle => {
    return getBorderEndColor(color, effectiveRTL);
  }, [effectiveRTL]);

  // Layout helpers
  const flexDirectionHelper = useCallback((
    direction: 'row' | 'row-reverse' | 'column' | 'column-reverse'
  ) => {
    return getFlexDirection(direction, effectiveRTL);
  }, [effectiveRTL]);

  const positionStartHelper = useCallback((value: number): ViewStyle => {
    return getPositionStart(value, effectiveRTL);
  }, [effectiveRTL]);

  const positionEndHelper = useCallback((value: number): ViewStyle => {
    return getPositionEnd(value, effectiveRTL);
  }, [effectiveRTL]);

  // Icon utilities
  const shouldFlipIconHelper = useCallback((iconType: 'directional' | 'neutral' | 'text'): boolean => {
    return effectiveRTL && shouldFlipIcon(iconType);
  }, [effectiveRTL]);

  const getIconTransformHelper = useCallback((iconType: 'directional' | 'neutral' | 'text'): IconDirection => {
    return getIconTransform(iconType, effectiveRTL);
  }, [effectiveRTL]);

  const getIconStyleHelper = useCallback((
    iconType: 'directional' | 'neutral' | 'text',
    baseStyle?: ImageStyle
  ): ImageStyle => {
    return getIconStyle(iconType, baseStyle, effectiveRTL);
  }, [effectiveRTL]);

  // Text utilities (these don't depend on effectiveRTL, so we can memoize them once)
  const getArabicTextStyleHelper = useCallback((
    baseStyle?: TextStyle,
    customConfig?: Partial<ArabicTextConfig>
  ): TextStyle => {
    return getArabicTextStyle(baseStyle, customConfig);
  }, []);

  // Compound utilities
  const createRTLStyleHelper = useCallback((style: {
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
  }): ViewStyle & TextStyle => {
    return createRTLStyle(style, effectiveRTL);
  }, [effectiveRTL]);

  const mergeRTLStylesHelper = useCallback(<T extends ViewStyle | TextStyle>(
    baseStyle: T,
    rtlStyle: Partial<T>
  ): T => {
    return mergeRTLStyles(baseStyle, rtlStyle, effectiveRTL);
  }, [effectiveRTL]);

  // Animation utilities
  const getSlideDirectionHelper = useCallback((
    direction: 'left' | 'right' | 'start' | 'end'
  ): 'left' | 'right' => {
    return getSlideDirection(direction, effectiveRTL);
  }, [effectiveRTL]);

  // Accessibility
  const getAccessibleRTLPropsHelper = useCallback((text?: string) => {
    return getAccessibleRTLProps(text);
  }, []);

  // RTL control functions
  const forceRTLHelper = useCallback((enable: boolean) => {
    forceRTL(enable);
    // Update state to reflect the change
    setI18nState({
      isRTL: enable,
      textDirection: enable ? 'rtl' : 'ltr',
      layoutDirection: enable ? 'rtl' : 'ltr',
    });
  }, []);

  const allowRTLHelper = useCallback((allow: boolean) => {
    allowRTL(allow);
  }, []);

  // ===== RETURN OBJECT =====

  return useMemo(() => ({
    // RTL state
    isRTL: effectiveRTL,
    textDirection: config.direction,
    layoutDirection: config.direction as LayoutDirection,
    config,
    
    // RTL control functions
    forceRTL: forceRTLHelper,
    allowRTL: allowRTLHelper,
    
    // Direction-aware styling helpers
    textAlign: textAlignHelper,
    paddingStart: paddingStartHelper,
    paddingEnd: paddingEndHelper,
    marginStart: marginStartHelper,
    marginEnd: marginEndHelper,
    borderStartWidth: borderStartWidthHelper,
    borderEndWidth: borderEndWidthHelper,
    borderStartColor: borderStartColorHelper,
    borderEndColor: borderEndColorHelper,
    
    // Layout helpers
    flexDirection: flexDirectionHelper,
    positionStart: positionStartHelper,
    positionEnd: positionEndHelper,
    
    // Icon utilities
    shouldFlipIcon: shouldFlipIconHelper,
    getIconTransform: getIconTransformHelper,
    getIconStyle: getIconStyleHelper,
    iconMap: rtlIconMap,
    
    // Text utilities
    arabicFontConfig,
    getArabicTextStyle: getArabicTextStyleHelper,
    containsArabic,
    containsHebrew,
    containsRTLText,
    getTextDirectionForText,
    
    // Compound utilities
    createRTLStyle: createRTLStyleHelper,
    mergeRTLStyles: mergeRTLStylesHelper,
    
    // Animation utilities
    getSlideDirection: getSlideDirectionHelper,
    
    // Accessibility
    getAccessibleRTLProps: getAccessibleRTLPropsHelper,
  }), [
    effectiveRTL,
    config,
    forceRTLHelper,
    allowRTLHelper,
    textAlignHelper,
    paddingStartHelper,
    paddingEndHelper,
    marginStartHelper,
    marginEndHelper,
    borderStartWidthHelper,
    borderEndWidthHelper,
    borderStartColorHelper,
    borderEndColorHelper,
    flexDirectionHelper,
    positionStartHelper,
    positionEndHelper,
    shouldFlipIconHelper,
    getIconTransformHelper,
    getIconStyleHelper,
    getArabicTextStyleHelper,
    createRTLStyleHelper,
    mergeRTLStylesHelper,
    getSlideDirectionHelper,
    getAccessibleRTLPropsHelper,
  ]);
};

// ===== SPECIALIZED HOOKS =====

/**
 * useRTLText Hook
 * 
 * Specialized hook for text-related RTL functionality
 */
export const useRTLText = (text?: string) => {
  const { 
    isRTL, 
    textDirection, 
    getArabicTextStyle, 
    containsArabic, 
    containsHebrew, 
    containsRTLText: containsRTLTextUtil,
    getTextDirectionForText,
    textAlign,
  } = useRTL();

  const textContainsRTL = useMemo(() => {
    return text ? containsRTLTextUtil(text) : false;
  }, [text, containsRTLTextUtil]);

  const textContainsArabic = useMemo(() => {
    return text ? containsArabic(text) : false;
  }, [text, containsArabic]);

  const textContainsHebrew = useMemo(() => {
    return text ? containsHebrew(text) : false;
  }, [text, containsHebrew]);

  const textDirectionForText = useMemo(() => {
    return text ? getTextDirectionForText(text) : textDirection;
  }, [text, getTextDirectionForText, textDirection]);

  const arabicTextStyle = useMemo(() => {
    return textContainsArabic ? getArabicTextStyle() : undefined;
  }, [textContainsArabic, getArabicTextStyle]);

  const defaultTextAlign = useMemo(() => {
    return textAlign('start');
  }, [textAlign]);

  return useMemo(() => ({
    isRTL,
    textDirection: textDirectionForText,
    containsRTL: textContainsRTL,
    containsArabic: textContainsArabic,
    containsHebrew: textContainsHebrew,
    arabicTextStyle,
    textAlign: defaultTextAlign,
    getArabicTextStyle,
  }), [
    isRTL,
    textDirectionForText,
    textContainsRTL,
    textContainsArabic,
    textContainsHebrew,
    arabicTextStyle,
    defaultTextAlign,
    getArabicTextStyle,
  ]);
};

/**
 * useRTLLayout Hook
 * 
 * Specialized hook for layout-related RTL functionality
 */
export const useRTLLayout = () => {
  const { 
    isRTL, 
    flexDirection, 
    paddingStart, 
    paddingEnd, 
    marginStart, 
    marginEnd,
    positionStart,
    positionEnd,
    createRTLStyle,
  } = useRTL();

  const rowDirection = useMemo(() => flexDirection('row'), [flexDirection]);
  const rowReverseDirection = useMemo(() => flexDirection('row-reverse'), [flexDirection]);

  return useMemo(() => ({
    isRTL,
    flexDirection,
    rowDirection,
    rowReverseDirection,
    paddingStart,
    paddingEnd,
    marginStart,
    marginEnd,
    positionStart,
    positionEnd,
    createRTLStyle,
  }), [
    isRTL,
    flexDirection,
    rowDirection,
    rowReverseDirection,
    paddingStart,
    paddingEnd,
    marginStart,
    marginEnd,
    positionStart,
    positionEnd,
    createRTLStyle,
  ]);
};

/**
 * useRTLIcon Hook
 * 
 * Specialized hook for icon-related RTL functionality
 */
export const useRTLIcon = (iconType: 'directional' | 'neutral' | 'text' = 'neutral') => {
  const { 
    isRTL, 
    shouldFlipIcon: shouldFlipIconUtil, 
    getIconTransform, 
    getIconStyle, 
    iconMap 
  } = useRTL();

  const shouldFlip = useMemo(() => {
    return shouldFlipIconUtil(iconType);
  }, [shouldFlipIconUtil, iconType]);

  const iconTransform = useMemo(() => {
    return getIconTransform(iconType);
  }, [getIconTransform, iconType]);

  const getStyle = useCallback((baseStyle?: ImageStyle) => {
    return getIconStyle(iconType, baseStyle);
  }, [getIconStyle, iconType]);

  return useMemo(() => ({
    isRTL,
    shouldFlip,
    transform: iconTransform,
    getIconStyle: getStyle,
    iconMap,
  }), [isRTL, shouldFlip, iconTransform, getStyle, iconMap]);
};

// ===== DEFAULT EXPORT =====

export default useRTL;