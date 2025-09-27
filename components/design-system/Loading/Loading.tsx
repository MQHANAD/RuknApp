import React, { memo, useMemo } from 'react';
import {
  View,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import {
  loadingStyles,
  colors,
} from '../../../constants/design-tokens';
import { useTheme } from '../../../src/context/ThemeContext';
import { LoadingProps, LoadingStyles } from './Loading.types';

/**
 * Get Loading styles based on props and theme
 */
const getLoadingStyles = (
  size: 'small' | 'medium' | 'large',
  isDark: boolean
): LoadingStyles => {
  let spinnerSize: number;

  switch (size) {
    case 'small':
      spinnerSize = loadingStyles.spinner.small.size;
      break;
    case 'large':
      spinnerSize = loadingStyles.spinner.large.size;
      break;
    case 'medium':
    default:
      spinnerSize = loadingStyles.spinner.medium.size;
      break;
  }

  const container: ViewStyle = {
    justifyContent: 'center',
    alignItems: 'center',
  };

  const spinner: ViewStyle = {
    width: spinnerSize,
    height: spinnerSize,
  };

  return {
    container,
    skeleton: spinner, // Using spinner style for skeleton as per LoadingStyles interface
    spinner,
  };
};

/**
 * Loading component with design system integration
 *
 * A spinner component that shows loading state with consistent styling.
 */
const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  color,
  style,
  testID,
  accessibilityLabel,
}) => {
  const { isDark } = useTheme();

  const styles = useMemo(
    () => getLoadingStyles(size, isDark),
    [size, isDark]
  );

  const spinnerColor = color || (isDark ? colors.neutral[300] : colors.primary[500]);

  return (
    <View
      style={[styles.container, style]}
      testID={testID}
      accessibilityLabel={accessibilityLabel || 'Loading'}
      accessibilityRole="progressbar"
    >
      <ActivityIndicator
        size={size === 'large' ? 'large' : 'small'}
        color={spinnerColor}
        style={styles.spinner}
      />
    </View>
  );
};

Loading.displayName = 'Loading';

export default memo(Loading);