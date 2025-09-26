import React, { memo, useMemo } from 'react';
import {
  View,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import {
  listStyles,
  colors,
  shadows,
} from '../../../constants/design-tokens';
import { useTheme } from '../../../src/context/ThemeContext';
import { ListProps, ListStyles } from './List.types';

/**
 * Get List styles based on props and theme
 */
const getListStyles = (
  variant: 'default' | 'bordered',
  isDark: boolean
): ListStyles => {
  const container: ViewStyle = {
    ...listStyles.container,
    backgroundColor: isDark ? colors.neutral[800] : colors.neutral[0],
    ...(variant === 'bordered' && {
      borderWidth: 1,
      borderColor: isDark ? colors.neutral[700] : colors.neutral[200],
    }),
  };

  const item: ViewStyle = {
    ...listStyles.item,
  };

  const title: TextStyle = {
    ...listStyles.title,
  };

  const subtitle: TextStyle = {
    ...listStyles.subtitle,
  };

  const icon: ImageStyle = {
    ...listStyles.icon,
  };

  return {
    container,
    item,
    title,
    subtitle,
    icon,
  };
};

/**
 * List component with design system integration
 *
 * A container component for ListItem components with consistent styling.
 */
const List: React.FC<ListProps> = ({
  children,
  variant = 'default',
  style,
  itemStyle,
  testID,
  accessibilityLabel,
}) => {
  const { isDark } = useTheme();

  const styles = useMemo(
    () => getListStyles(variant, isDark),
    [variant, isDark]
  );

  return (
    <View
      style={[styles.container, style]}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="list"
    >
      {children}
    </View>
  );
};

List.displayName = 'List';

export default memo(List);