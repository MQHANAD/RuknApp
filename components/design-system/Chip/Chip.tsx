import React, { memo, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {
  chipStyles,
  typography,
  spacing,
  colors,
} from '../../../constants/design-tokens';
import { useTheme } from '../../../src/context/ThemeContext';
import { ChipProps, ChipStyles } from './Chip.types';

/**
 * Get Chip styles based on props and theme
 */
const getChipStyles = (
  variant: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'outline',
  disabled: boolean,
  isDark: boolean
): ChipStyles => {
  let container: ViewStyle = {
    ...chipStyles.container,
    opacity: disabled ? 0.5 : 1,
  };

  let text: TextStyle = {
    ...chipStyles.text,
  };

  // Apply variant-specific styling
  switch (variant) {
    case 'primary':
      container = {
        ...container,
        ...chipStyles.primary,
        backgroundColor: disabled
          ? colors.neutral[300]
          : chipStyles.primary.backgroundColor,
      };
      text.color = disabled
        ? colors.neutral[500]
        : chipStyles.primary.textColor;
      break;
    case 'success':
      container = {
        ...container,
        ...chipStyles.success,
        backgroundColor: disabled
          ? colors.neutral[300]
          : chipStyles.success.backgroundColor,
      };
      text.color = disabled
        ? colors.neutral[500]
        : chipStyles.success.textColor;
      break;
    case 'warning':
      container = {
        ...container,
        ...chipStyles.warning,
        backgroundColor: disabled
          ? colors.neutral[300]
          : chipStyles.warning.backgroundColor,
      };
      text.color = disabled
        ? colors.neutral[500]
        : chipStyles.warning.textColor;
      break;
    case 'error':
      container = {
        ...container,
        ...chipStyles.error,
        backgroundColor: disabled
          ? colors.neutral[300]
          : chipStyles.error.backgroundColor,
      };
      text.color = disabled
        ? colors.neutral[500]
        : chipStyles.error.textColor;
      break;
    case 'outline':
      container = {
        ...container,
        ...chipStyles.outline,
        borderColor: disabled
          ? colors.neutral[400]
          : (isDark ? colors.neutral[600] : colors.neutral[300]),
      };
      text.color = disabled
        ? colors.neutral[500]
        : (isDark ? colors.neutral[300] : colors.neutral[700]);
      break;
    default:
      container = {
        ...container,
        backgroundColor: disabled
          ? colors.neutral[200]
          : (isDark ? colors.neutral[700] : colors.neutral[100]),
      };
      text.color = disabled
        ? colors.neutral[500]
        : (isDark ? colors.neutral[200] : colors.neutral[700]);
      break;
  }

  const closeButton: ViewStyle = {
    marginLeft: spacing[1],
    padding: spacing[0],
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  };

  return {
    container,
    text,
    closeButton,
  };
};

/**
 * Chip component with design system integration
 *
 * A flexible chip component that supports different variants and states.
 */
const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'default',
  onPress,
  onClose,
  disabled = false,
  style,
  textStyle,
  testID,
  accessibilityLabel,
}) => {
  const { isDark } = useTheme();

  const styles = useMemo(
    () => getChipStyles(variant, disabled, isDark),
    [variant, disabled, isDark]
  );

  const isPressable = !!onPress && !disabled;

  const handlePress = () => {
    if (onPress && !disabled) {
      onPress();
    }
  };

  const handleClose = () => {
    if (onClose && !disabled) {
      onClose();
    }
  };

  const content = (
    <View style={[styles.container, style]}>
      <Text style={[styles.text, textStyle]}>
        {label}
      </Text>
      {onClose && (
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
          accessibilityLabel={`Remove ${label}`}
          accessibilityRole="button"
          testID={`${testID}-close`}
        >
          <Text style={{ fontSize: 12, color: styles.text.color }}>
            ×
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (isPressable) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel || label}
        testID={testID}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View
      accessibilityLabel={accessibilityLabel || label}
      testID={testID}
    >
      {content}
    </View>
  );
};

Chip.displayName = 'Chip';

export default memo(Chip);