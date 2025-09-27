import React, { memo, useMemo } from 'react';
import {
  View,
  ViewStyle,
} from 'react-native';
import {
  stackStyles,
  spacing,
} from '../../../constants/design-tokens';
import { useTheme } from '../../../src/context/ThemeContext';
import { StackProps, StackStyles } from './Stack.types';

/**
 * Get Stack styles based on props and theme
 */
const getStackStyles = (
  spacing: 'none' | 'tight' | 'snug' | 'small' | 'medium' | 'large' | 'xl',
  direction: 'vertical' | 'horizontal',
  isDark: boolean
): StackStyles => {
  const container: ViewStyle = {
    ...stackStyles.container,
  };

  // Apply spacing
  switch (spacing) {
    case 'none':
      container.gap = stackStyles.spacing.none.gap;
      break;
    case 'tight':
      container.gap = stackStyles.spacing.tight.gap;
      break;
    case 'snug':
      container.gap = stackStyles.spacing.snug.gap;
      break;
    case 'small':
      container.gap = stackStyles.spacing.small.gap;
      break;
    case 'medium':
      container.gap = stackStyles.spacing.medium.gap;
      break;
    case 'large':
      container.gap = stackStyles.spacing.large.gap;
      break;
    case 'xl':
      container.gap = stackStyles.spacing.xl.gap;
      break;
    default:
      container.gap = stackStyles.spacing.medium.gap;
      break;
  }

  // Apply direction
  if (direction === 'horizontal') {
    container.flexDirection = 'row';
  } else {
    container.flexDirection = 'column';
  }

  return {
    container,
  };
};

/**
 * Stack component with design system integration
 *
 * A flexible stack component that provides consistent spacing between children.
 * Supports both vertical and horizontal layouts with predefined spacing options.
 */
const Stack: React.FC<StackProps> = ({
  children,
  spacing = 'medium',
  direction = 'vertical',
  style,
  testID,
  accessibilityLabel,
}) => {
  const { isDark } = useTheme();

  const styles = useMemo(
    () => getStackStyles(spacing, direction, isDark),
    [spacing, direction, isDark]
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

Stack.displayName = 'Stack';

export default memo(Stack);