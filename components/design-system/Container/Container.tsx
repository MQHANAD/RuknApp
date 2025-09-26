import React, { memo, useMemo } from 'react';
import {
  View,
  ViewStyle,
} from 'react-native';
import {
  containerStyles,
  spacing,
} from '../../../constants/design-tokens';
import { useTheme } from '../../../src/context/ThemeContext';
import { ContainerProps, ContainerStyles } from './Container.types';

/**
 * Get Container styles based on props and theme
 */
const getContainerStyles = (
  size: 'narrow' | 'wide' | 'full',
  padding: 'none' | 'small' | 'medium' | 'large',
  centered: boolean,
  isDark: boolean
): ContainerStyles => {
  let container: ViewStyle = {
    flex: 1,
  };

  // Size configurations
  switch (size) {
    case 'narrow':
      container = {
        ...container,
        ...containerStyles.narrow,
      };
      break;
    case 'wide':
      container = {
        ...container,
        ...containerStyles.wide,
      };
      break;
    case 'full':
    default:
      container = {
        ...container,
        width: '100%',
      };
      break;
  }

  // Padding configurations
  switch (padding) {
    case 'none':
      container.paddingHorizontal = 0;
      break;
    case 'small':
      container.paddingHorizontal = spacing[3];
      break;
    case 'medium':
      container.paddingHorizontal = spacing[4];
      break;
    case 'large':
      container.paddingHorizontal = spacing[6];
      break;
    default:
      container.paddingHorizontal = spacing[4];
      break;
  }

  // Centered configuration
  if (centered) {
    container = {
      ...container,
      ...containerStyles.centered,
    };
  }

  return {
    container,
  };
};

/**
 * Container component with design system integration
 *
 * A flexible container component that provides consistent spacing and sizing.
 * Supports different sizes, padding options, and centering.
 */
const Container: React.FC<ContainerProps> = ({
  children,
  size = 'full',
  padding = 'medium',
  centered = false,
  style,
  testID,
  accessibilityLabel,
}) => {
  const { isDark } = useTheme();

  const styles = useMemo(
    () => getContainerStyles(size, padding, centered, isDark),
    [size, padding, centered, isDark]
  );

  return (
    <View
      style={[styles.container, style]}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </View>
  );
};

Container.displayName = 'Container';

export default memo(Container);