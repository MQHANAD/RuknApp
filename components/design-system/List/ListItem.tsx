import React, { memo, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import {
  listStyles,
  typography,
  spacing,
  colors,
} from '../../../constants/design-tokens';
import { useTheme } from '../../../src/context/ThemeContext';
import { useRTL } from '../../../src/hooks/useRTL';
import { ListItemProps, ListStyles } from './List.types';

/**
 * Get ListItem styles based on props and theme
 */
const getListItemStyles = (
  variant: 'default' | 'selectable',
  disabled: boolean,
  isDark: boolean
): ListStyles => {
  const container: ViewStyle = {
    ...listStyles.item,
    backgroundColor: disabled
      ? (isDark ? colors.neutral[700] : colors.neutral[100])
      : 'transparent',
    opacity: disabled ? 0.5 : 1,
  };

  const title: TextStyle = {
    ...typography.body.large,
    fontWeight: '500',
    color: disabled
      ? (isDark ? colors.neutral[400] : colors.neutral[500])
      : (isDark ? colors.neutral[50] : colors.neutral[900]),
  };

  const subtitle: TextStyle = {
    ...typography.body.medium,
    color: disabled
      ? (isDark ? colors.neutral[500] : colors.neutral[400])
      : (isDark ? colors.neutral[300] : colors.neutral[600]),
  };

  const icon: ImageStyle = {
    ...listStyles.icon,
  };

  const item: ViewStyle = {
    ...listStyles.item,
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
 * ListItem component with design system integration
 *
 * A flexible list item component that supports title, subtitle, icons, and press interactions.
 */
const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onPress,
  disabled = false,
  variant = 'default',
  style,
  titleStyle,
  subtitleStyle,
  testID,
  accessibilityLabel,
}) => {
  const { isDark } = useTheme();
  const { isRTL } = useRTL();

  const styles = useMemo(
    () => getListItemStyles(variant, disabled, isDark),
    [variant, disabled, isDark]
  );

  const isPressable = !!onPress && !disabled;

  const content = (
    <View style={[
      styles.container,
      style,
      isPressable && listStyles.pressable,
    ]}>
      {/* Left Icon */}
      {leftIcon && (
        <Image
          source={leftIcon}
          style={[
            styles.icon,
            isRTL && { marginRight: 0, marginLeft: spacing[3] }
          ]}
          resizeMode="contain"
        />
      )}

      {/* Content */}
      <View style={{ flex: 1 }}>
        <Text
          style={[styles.title, titleStyle]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[styles.subtitle, subtitleStyle]}
            numberOfLines={2}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {/* Right Icon */}
      {rightIcon && (
        <Image
          source={rightIcon}
          style={[
            styles.icon,
            !isRTL && { marginRight: 0, marginLeft: spacing[3] }
          ]}
          resizeMode="contain"
        />
      )}
    </View>
  );

  if (isPressable) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel || title}
        accessibilityRole="button"
        testID={testID}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View
      accessibilityLabel={accessibilityLabel || title}
      testID={testID}
    >
      {content}
    </View>
  );
};

ListItem.displayName = 'ListItem';

export default memo(ListItem);