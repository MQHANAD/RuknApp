import React, { memo, useState, useMemo, useRef } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {
  inputFieldStyles,
  typography,
  colors,
  spacing,
  accessibility,
} from '../../../constants/design-tokens';
import { useTheme } from '../../../src/context/ThemeContext';
import { useResponsive } from '../../../src/hooks/useResponsive';
import { useRTL, useRTLText } from '../../../src/hooks/useRTL';
import { TextInputProps, TextInputStyleState, TextInputStyles, TextInputState } from './TextInput.types';

/**
 * Get TextInput styles based on current state and theme
 */
const getTextInputStyles = (styleState: TextInputStyleState, theme: any, isDark: boolean): TextInputStyles => {
  const {
    state,
    hasError,
    hasLabel,
    hasHelperText,
    isRTL,
    responsive,
    customPadding,
    customFontSize,
    customHeight,
    textDirection
  } = styleState;
  
  const container: ViewStyle = {
    marginBottom: hasHelperText || hasError ? spacing[4] : spacing[3],
  };

  // RTL-aware label container
  const labelContainer: ViewStyle = {
    marginBottom: spacing[1],
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
  };

  const label: TextStyle = {
    ...typography.body.medium,
    fontWeight: '500',
    color: state === 'disabled' ? theme.text.tertiary : theme.text.primary,
    textAlign: isRTL ? 'right' : 'left',
  };

  // RTL-aware required indicator
  const requiredIndicator: TextStyle = {
    color: theme.status.error,
    marginLeft: isRTL ? 0 : spacing[1],
    marginRight: isRTL ? spacing[1] : 0,
  };

  const inputContainer: ViewStyle = {
    position: 'relative',
  };

  // Theme-aware input styles
  let backgroundColor: string, borderColor: string, textColor: string;
  
  switch (state) {
    case 'focused':
      backgroundColor = theme.surface.primary;
      borderColor = theme.interactive.primary;
      textColor = theme.text.primary;
      break;
    case 'error':
      backgroundColor = isDark ? theme.surface.primary : theme.surface.primary;
      borderColor = theme.status.error;
      textColor = theme.text.primary;
      break;
    case 'disabled':
      backgroundColor = isDark ? theme.surface.secondary : theme.background.secondary;
      borderColor = theme.border.secondary;
      textColor = theme.text.tertiary;
      break;
    default:
      backgroundColor = theme.surface.primary;
      borderColor = theme.border.primary;
      textColor = theme.text.primary;
  }

  // Apply responsive customizations
  const finalHeight = customHeight !== undefined
    ? customHeight
    : inputFieldStyles.default.height;
  const finalPaddingHorizontal = customPadding !== undefined
    ? customPadding
    : inputFieldStyles.default.paddingHorizontal;
  const finalFontSize = customFontSize !== undefined
    ? customFontSize
    : inputFieldStyles.default.fontSize;

  // RTL-aware input style
  const input: TextStyle = {
    height: finalHeight,
    paddingHorizontal: finalPaddingHorizontal,
    fontSize: finalFontSize,
    borderRadius: inputFieldStyles.default.borderRadius,
    borderWidth: state === 'focused' ? 2 : 1,
    backgroundColor,
    borderColor,
    color: textColor,
    minHeight: accessibility.touchTargets.minimum,
    textAlignVertical: 'center',
    textAlign: isRTL ? 'right' : 'left',
    writingDirection: textDirection || (isRTL ? 'rtl' : 'ltr'),
  };

  const helperContainer: ViewStyle = {
    marginTop: spacing[1],
  };

  const helperText: TextStyle = {
    ...typography.body.small,
    color: theme.text.secondary,
    textAlign: isRTL ? 'right' : 'left',
  };

  const errorText: TextStyle = {
    ...typography.body.small,
    color: theme.status.error,
    textAlign: isRTL ? 'right' : 'left',
  };

  return {
    container,
    labelContainer,
    label,
    requiredIndicator,
    inputContainer,
    input,
    helperContainer,
    helperText,
    errorText,
  };
};

/**
 * TextInput component with design system integration
 * 
 * Supports multiple states (default, focused, error, disabled).
 * Includes label, helper text, error message, and full accessibility support.
 */
const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  helperText,
  disabled = false,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  helperStyle,
  testID,
  required = false,
  value,
  onFocus,
  onBlur,
  responsive = false,
  rtlEnabled = true,
  padding,
  fontSize,
  height,
  autoDetectRTL = false,
  ...restProps
}) => {
  // Get theme from context
  const { theme, isDark } = useTheme();
  
  // Get responsive utilities
  const { getResponsiveValue, responsiveComponentSize, responsiveFontSize } = useResponsive();
  
  // Get RTL utilities
  const { getAccessibleRTLProps } = useRTL();
  const rtlTextUtils = useRTLText(autoDetectRTL ? value : undefined);
  
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<RNTextInput>(null);

  // Determine current input state
  const currentState: TextInputState = useMemo(() => {
    if (disabled) return 'disabled';
    if (error) return 'error';
    if (isFocused) return 'focused';
    return 'default';
  }, [disabled, error, isFocused]);

  // Get responsive values
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
      const baseSize = inputFieldStyles.default.fontSize;
      return responsiveFontSize(baseSize, 'moderate');
    }
    return undefined;
  }, [responsive, fontSize, getResponsiveValue, responsiveFontSize]);

  const responsiveHeight = useMemo(() => {
    if (responsive && height) {
      return getResponsiveValue(height);
    } else if (responsive) {
      // Auto-calculate responsive height
      const baseHeight = inputFieldStyles.default.height;
      return responsiveComponentSize(baseHeight, 'normal');
    }
    return undefined;
  }, [responsive, height, getResponsiveValue, responsiveComponentSize]);

  // Determine effective RTL state
  const effectiveRTL = useMemo(() => {
    if (!rtlEnabled) return false;
    if (autoDetectRTL && value) {
      return rtlTextUtils.containsRTL;
    }
    return rtlTextUtils.isRTL;
  }, [rtlEnabled, autoDetectRTL, value, rtlTextUtils.containsRTL, rtlTextUtils.isRTL]);

  // Determine text direction
  const textDirection = useMemo(() => {
    if (autoDetectRTL && value) {
      return rtlTextUtils.textDirection;
    }
    return effectiveRTL ? 'rtl' : 'ltr';
  }, [autoDetectRTL, value, rtlTextUtils.textDirection, effectiveRTL]);

  // Get styles for current state
  const styles = useMemo(() => {
    return getTextInputStyles({
      state: currentState,
      hasError: !!error,
      hasLabel: !!label,
      hasHelperText: !!helperText,
      isRTL: effectiveRTL,
      responsive,
      customPadding: responsivePadding,
      customFontSize: responsiveFontSizeValue,
      customHeight: responsiveHeight,
      textDirection,
    }, theme, isDark);
  }, [
    currentState,
    error,
    label,
    helperText,
    effectiveRTL,
    responsive,
    responsivePadding,
    responsiveFontSizeValue,
    responsiveHeight,
    textDirection,
    theme,
    isDark
  ]);

  // Handle focus events
  const handleFocus = (event: any) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: any) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  // Generate accessibility label
  const accessibilityLabel = useMemo(() => {
    let baseLabel = label || restProps.placeholder || 'Text input';
    if (required) baseLabel += ', required';
    if (error) baseLabel += ', has error';
    return baseLabel;
  }, [label, restProps.placeholder, required, error]);

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label */}
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, labelStyle]}>
            {label}
          </Text>
          {required && (
            <Text style={styles.requiredIndicator}>*</Text>
          )}
        </View>
      )}
      
      {/* Input Container */}
      <View style={styles.inputContainer}>
        <RNTextInput
          ref={inputRef}
          style={[
            styles.input,
            inputStyle,
            rtlEnabled && rtlTextUtils.containsArabic && rtlTextUtils.arabicTextStyle
          ]}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          placeholderTextColor={theme.text.tertiary}
          testID={testID}
          accessible={true}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={error || helperText}
          accessibilityState={{ disabled }}
          {...(rtlEnabled && getAccessibleRTLProps(value))}
          {...restProps}
        />
      </View>
      
      {/* Helper Text / Error Message */}
      {(helperText || error) && (
        <View style={styles.helperContainer}>
          {error ? (
            <Text 
              style={[styles.errorText, errorStyle]}
              accessible={true}
              accessibilityRole="alert"
            >
              {error}
            </Text>
          ) : (
            <Text style={[styles.helperText, helperStyle]}>
              {helperText}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

TextInput.displayName = 'TextInput';

export default memo(TextInput);