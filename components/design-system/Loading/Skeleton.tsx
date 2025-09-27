import React, { memo, useMemo } from 'react';
import {
  View,
  ViewStyle,
  Animated,
} from 'react-native';
import {
  loadingStyles,
  colors,
} from '../../../constants/design-tokens';
import { useTheme } from '../../../src/context/ThemeContext';
import { SkeletonProps, LoadingStyles } from './Loading.types';

/**
 * Get Skeleton styles based on props and theme
 */
const getSkeletonStyles = (
  width: number | string | undefined,
  height: number | undefined,
  variant: 'rounded' | 'circular' | 'rectangular',
  isDark: boolean
): LoadingStyles => {
  let borderRadius = 4;

  switch (variant) {
    case 'circular':
      borderRadius = height ? height / 2 : 20;
      break;
    case 'rounded':
      borderRadius = 8;
      break;
    case 'rectangular':
    default:
      borderRadius = 4;
      break;
  }

  const container: ViewStyle = {
    width: width || '100%',
    height: height || 20,
    borderRadius,
  } as ViewStyle;

  const skeleton: ViewStyle = {
    ...loadingStyles.skeleton,
    borderRadius,
    backgroundColor: isDark ? colors.neutral[700] : colors.neutral[200],
  };

  const spinner: ViewStyle = {
    justifyContent: 'center',
    alignItems: 'center',
  };

  return {
    container,
    skeleton,
    spinner,
  };
};

/**
 * Skeleton component with design system integration
 *
 * A placeholder component that shows a pulsing animation while content is loading.
 */
const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  variant = 'rectangular',
  style,
  testID,
  accessibilityLabel,
}) => {
  const { isDark } = useTheme();

  const styles = useMemo(
    () => getSkeletonStyles(width, height, variant, isDark),
    [width, height, variant, isDark]
  );

  const animatedValue = useMemo(() => new Animated.Value(0), []);

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View
      style={[styles.container, style]}
      testID={testID}
      accessibilityLabel={accessibilityLabel || 'Loading skeleton'}
      accessibilityRole="progressbar"
    >
      <Animated.View
        style={[
          styles.skeleton,
          { opacity },
        ]}
      />
    </View>
  );
};

Skeleton.displayName = 'Skeleton';

export default memo(Skeleton);