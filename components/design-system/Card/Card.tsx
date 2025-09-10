import React, { memo, useMemo } from 'react';
import {
  View,
  Pressable,
  ViewStyle,
  PressableStateCallbackType,
} from 'react-native';
import {
  cardStyles,
  shadows,
  colors,
  accessibility,
} from '../../../constants/design-tokens';
import { useTheme } from '../../../src/context/ThemeContext';
import { useResponsive } from '../../../src/hooks/useResponsive';
import { useRTLLayout } from '../../../src/hooks/useRTL';
import { CardProps, CardStyleState, CardStyles, CardVariant } from './Card.types';

/**
 * Get Card styles based on current state and theme
 */
const getCardStyles = (styleState: CardStyleState, theme: any, isDark: boolean): CardStyles => {
  const {
    variant,
    isPressed,
    isTouchable,
    customPadding,
    isRTL,
    responsive,
    customBorderRadius,
    customMargin,
    customWidth,
    customHeight
  } = styleState;
  
  // Base card style with theme-aware colors
  let backgroundColor: string, borderColor: string;
  let shadowStyle: ViewStyle = shadows.medium;
  
  switch (variant) {
    case 'elevated':
      backgroundColor = theme.surface.elevated;
      borderColor = 'transparent';
      shadowStyle = shadows.large;
      break;
    case 'outlined':
      backgroundColor = theme.surface.primary;
      borderColor = theme.border.primary;
      shadowStyle = shadows.none;
      break;
    default:
      backgroundColor = theme.surface.primary;
      borderColor = 'transparent';
      shadowStyle = shadows.medium;
      break;
  }
  
  // Pressed state adjustments
  if (isPressed) {
    backgroundColor = isDark ? theme.surface.secondary : theme.background.secondary;
  }

  // Apply responsive customizations
  const finalPadding = customPadding !== undefined ? customPadding : cardStyles.default.padding;
  const finalBorderRadius = customBorderRadius !== undefined ? customBorderRadius : cardStyles.default.borderRadius;

  const container: ViewStyle = {
    backgroundColor,
    borderRadius: finalBorderRadius,
    padding: finalPadding,
    ...shadowStyle,
    ...(variant === 'outlined' && {
      borderWidth: 1,
      borderColor,
    }),
    ...(isPressed && {
      transform: [{ scale: 0.98 }],
    }),
    ...(isTouchable && {
      minHeight: accessibility.touchTargets.minimum,
    }),
    // Apply responsive dimensions
    ...(customMargin !== undefined && { margin: customMargin }),
    ...(customWidth !== undefined && { width: customWidth }),
    ...(customHeight !== undefined && { height: customHeight }),
  };

  return {
    container,
  };
};

/**
 * Card component with design system integration
 * 
 * Supports 3 variants (default, elevated, outlined).
 * Can be touchable when onPress prop is provided.
 * Uses elevation/shadow system from design tokens.
 */
const Card: React.FC<CardProps> = ({
  variant = 'default',
  children,
  onPress,
  style,
  padding,
  accessibilityLabel,
  accessibilityHint,
  testID,
  disabled = false,
  responsive = false,
  rtlEnabled = true,
  borderRadius,
  margin,
  width,
  height,
}) => {
  // Get theme from context
  const { theme, isDark } = useTheme();
  
  // Get responsive utilities
  const { getResponsiveValue, responsiveComponentSize } = useResponsive();
  
  // Get RTL utilities
  const { isRTL } = useRTLLayout();
  
  const isTouchable = !!onPress && !disabled;

  // Handle press with disabled state
  const handlePress = useMemo(() => {
    if (disabled || !onPress) return undefined;
    return onPress;
  }, [disabled, onPress]);

  // Get responsive values
  const responsivePadding = useMemo(() => {
    if (typeof padding === 'number') return padding;
    if (responsive && padding) {
      return getResponsiveValue(padding);
    } else if (responsive) {
      // Auto-calculate responsive padding
      const basePadding = cardStyles.default.padding;
      return responsiveComponentSize(basePadding, 'normal');
    }
    return undefined;
  }, [responsive, padding, getResponsiveValue, responsiveComponentSize]);

  const responsiveBorderRadius = useMemo(() => {
    if (responsive && borderRadius) {
      return getResponsiveValue(borderRadius);
    }
    return undefined;
  }, [responsive, borderRadius, getResponsiveValue]);

  const responsiveMargin = useMemo(() => {
    if (responsive && margin) {
      return getResponsiveValue(margin);
    }
    return undefined;
  }, [responsive, margin, getResponsiveValue]);

  const responsiveWidth = useMemo(() => {
    if (responsive && width) {
      return getResponsiveValue(width);
    }
    return undefined;
  }, [responsive, width, getResponsiveValue]);

  const responsiveHeight = useMemo(() => {
    if (responsive && height) {
      return getResponsiveValue(height);
    }
    return undefined;
  }, [responsive, height, getResponsiveValue]);

  // Get styles function
  const getStyles = (isPressed: boolean = false) => {
    return getCardStyles({
      variant,
      isPressed,
      isTouchable,
      customPadding: responsivePadding,
      isRTL: rtlEnabled ? isRTL : false,
      responsive,
      customBorderRadius: responsiveBorderRadius,
      customMargin: responsiveMargin,
      customWidth: responsiveWidth,
      customHeight: responsiveHeight,
    }, theme, isDark);
  };

  // If touchable, render as Pressable
  if (isTouchable) {
    return (
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        testID={testID}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled }}
        style={({ pressed }: PressableStateCallbackType) => [
          getStyles(pressed).container,
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  // Otherwise, render as View
  return (
    <View
      testID={testID}
      accessible={accessibilityLabel ? true : undefined}
      accessibilityLabel={accessibilityLabel}
      style={[getStyles().container, style]}
    >
      {children}
    </View>
  );
};

Card.displayName = 'Card';

export default memo(Card);