import React, { memo, useMemo } from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Pressable,
  PressableStateCallbackType,
} from 'react-native';
import {
  buttonSizes,
  buttonVariants,
  typography,
  accessibility,
} from '../../../constants/design-tokens';
import { useTheme } from '../../../src/context/ThemeContext';
import { useResponsive } from '../../../src/hooks/useResponsive';
import { useRTL } from '../../../src/hooks/useRTL';
import { ButtonProps, ButtonStyleState, ButtonStyles } from './Button.types';

/**
 * Get button styles based on current state and theme
 */
const getButtonStyles = (styleState: ButtonStyleState, theme: any, isDark: boolean): ButtonStyles => {
  const sizeConfig = buttonSizes[styleState.size];
  const typographyConfig = typography.button[styleState.size];
  
  // Get theme-aware colors based on variant and state
  let backgroundColor: string, borderColor: string, textColor: string;
  
  switch (styleState.variant) {
    case 'primary':
      switch (styleState.state) {
        case 'pressed':
          backgroundColor = isDark ? theme.interactive.primary : theme.interactive.primary;
          borderColor = backgroundColor;
          textColor = theme.text.inverse;
          break;
        case 'disabled':
          backgroundColor = theme.interactive.disabled;
          borderColor = theme.interactive.disabled;
          textColor = theme.text.tertiary;
          break;
        default:
          backgroundColor = theme.interactive.primary;
          borderColor = theme.interactive.primary;
          textColor = theme.text.inverse;
      }
      break;
      
    case 'secondary':
      switch (styleState.state) {
        case 'pressed':
          backgroundColor = isDark ? theme.surface.secondary : theme.background.secondary;
          borderColor = theme.interactive.primary;
          textColor = theme.interactive.primary;
          break;
        case 'disabled':
          backgroundColor = theme.surface.primary;
          borderColor = theme.border.secondary;
          textColor = theme.text.tertiary;
          break;
        default:
          backgroundColor = theme.surface.primary;
          borderColor = theme.interactive.primary;
          textColor = theme.interactive.primary;
      }
      break;
      
    case 'ghost':
    default:
      switch (styleState.state) {
        case 'pressed':
          backgroundColor = isDark ? theme.surface.secondary : theme.background.secondary;
          borderColor = 'transparent';
          textColor = theme.interactive.primary;
          break;
        case 'disabled':
          backgroundColor = 'transparent';
          borderColor = 'transparent';
          textColor = theme.text.tertiary;
          break;
        default:
          backgroundColor = 'transparent';
          borderColor = 'transparent';
          textColor = theme.interactive.primary;
      }
  }

  // Apply responsive customizations
  const finalHeight = sizeConfig.height;
  const finalPaddingHorizontal = styleState.customPadding !== undefined
    ? styleState.customPadding
    : sizeConfig.paddingHorizontal;
  const finalFontSize = styleState.customFontSize !== undefined
    ? styleState.customFontSize
    : typographyConfig.fontSize;

  // RTL-aware container style
  const containerStyle: ViewStyle = {
    height: finalHeight,
    paddingHorizontal: finalPaddingHorizontal,
    borderRadius: sizeConfig.borderRadius,
    backgroundColor,
    borderWidth: borderColor === 'transparent' ? 0 : 1,
    borderColor,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: styleState.isRTL ? 'row-reverse' : 'row',
    minHeight: accessibility.touchTargets.minimum,
    ...(styleState.fullWidth && { width: '100%' }),
  };

  const textStyle: TextStyle = {
    fontSize: finalFontSize,
    lineHeight: typographyConfig.lineHeight,
    fontWeight: typographyConfig.fontWeight,
    letterSpacing: typographyConfig.letterSpacing,
    color: textColor,
    textAlign: 'center',
  };

  return {
    container: containerStyle,
    text: textStyle,
  };
};

/**
 * Button component with design system integration
 * 
 * Supports 3 variants (primary, secondary, ghost) and 3 sizes (small, medium, large).
 * Includes accessibility features, loading states, and full design token integration.
 */
const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  onPress,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
  testID,
  responsive = false,
  rtlEnabled = true,
  padding,
  fontSize,
  iconType = 'neutral',
}) => {
  // Get theme from context
  const { theme, isDark } = useTheme();
  
  // Get responsive utilities
  const { getResponsiveValue, responsiveComponentSize, responsiveFontSize } = useResponsive();
  
  // Get RTL utilities
  const { isRTL, textAlign } = useRTL();
  
  // Determine current button state
  const currentState = useMemo(() => {
    if (disabled || loading) return 'disabled';
    return 'default';
  }, [disabled, loading]);

  // Get responsive values
  const responsiveSize = useMemo(() => {
    if (typeof size === 'string') return size;
    return getResponsiveValue(size, 'medium') || 'medium';
  }, [size, getResponsiveValue]);

  const responsiveFullWidth = useMemo(() => {
    if (typeof fullWidth === 'boolean') return fullWidth;
    return getResponsiveValue(fullWidth, false) || false;
  }, [fullWidth, getResponsiveValue]);

  const responsivePadding = useMemo(() => {
    if (responsive && padding) {
      return getResponsiveValue(padding);
    }
    return undefined;
  }, [responsive, padding, getResponsiveValue]);

  const responsiveFontSizeValue = useMemo(() => {
    if (responsive && fontSize) {
      return getResponsiveValue(fontSize);
    } else if (responsive) {
      // Auto-calculate responsive font size
      const baseSize = typography.button[responsiveSize].fontSize;
      return responsiveFontSize(baseSize, 'moderate');
    }
    return undefined;
  }, [responsive, fontSize, responsiveSize, getResponsiveValue, responsiveFontSize]);

  // Get styles for current state
  const styles = useMemo(() => {
    return getButtonStyles({
      variant,
      size: responsiveSize,
      state: currentState,
      fullWidth: responsiveFullWidth,
      isRTL: rtlEnabled ? isRTL : false,
      responsive,
      customPadding: responsivePadding,
      customFontSize: responsiveFontSizeValue,
    }, theme, isDark);
  }, [variant, responsiveSize, currentState, responsiveFullWidth, rtlEnabled, isRTL, responsive, responsivePadding, responsiveFontSizeValue, theme, isDark]);

  // Handle press with disabled/loading state
  const handlePress = useMemo(() => {
    if (disabled || loading || !onPress) return undefined;
    return onPress;
  }, [disabled, loading, onPress]);

  // Render loading indicator if needed
  const renderContent = () => {
    if (loading) {
      return (
        <>
          <ActivityIndicator
            size="small"
            color={styles.text.color}
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.text, textStyle]} numberOfLines={1}>
            {children}
          </Text>
        </>
      );
    }

    return (
      <Text style={[styles.text, textStyle]} numberOfLines={1}>
        {children}
      </Text>
    );
  };

  // Use Pressable for better press feedback
  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      testID={testID}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || children}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading }}
      style={({ pressed }: PressableStateCallbackType) => [
        styles.container,
        style,
        pressed && !disabled && !loading && {
          ...getButtonStyles({
            variant,
            size: responsiveSize,
            state: 'pressed',
            fullWidth: responsiveFullWidth,
            isRTL: rtlEnabled ? isRTL : false,
            responsive,
            customPadding: responsivePadding,
            customFontSize: responsiveFontSizeValue,
          }, theme, isDark).container,
          transform: [{ scale: 0.98 }],
        },
      ]}
    >
      {renderContent()}
    </Pressable>
  );
};

Button.displayName = 'Button';

export default memo(Button);