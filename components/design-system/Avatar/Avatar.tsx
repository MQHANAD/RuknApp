import React, { memo, useMemo } from 'react';
import {
  View,
  Image,
  Text,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import {
  avatarStyles,
  colors,
} from '../../../constants/design-tokens';
import { useTheme } from '../../../src/context/ThemeContext';
import { AvatarProps, AvatarStyles } from './Avatar.types';

/**
 * Get Avatar styles based on props and theme
 */
const getAvatarStyles = (
  size: 'small' | 'medium' | 'large' | 'xlarge',
  variant: 'default' | 'outline',
  isDark: boolean
): AvatarStyles => {
  const sizeConfig = avatarStyles[size];

  const container: ViewStyle = {
    width: sizeConfig.size,
    height: sizeConfig.size,
    borderRadius: sizeConfig.borderRadius,
    backgroundColor: variant === 'outline'
      ? 'transparent'
      : avatarStyles.default.backgroundColor,
    borderWidth: variant === 'outline' ? 2 : 0,
    borderColor: variant === 'outline'
      ? (isDark ? colors.neutral[600] : colors.neutral[300])
      : 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const image: ImageStyle = {
    width: '100%',
    height: '100%',
    borderRadius: sizeConfig.borderRadius,
  };

  const text: TextStyle = {
    fontSize: sizeConfig.fontSize,
    fontWeight: '600',
    color: variant === 'outline'
      ? (isDark ? colors.neutral[300] : colors.neutral[600])
      : avatarStyles.default.textColor,
    textAlign: 'center',
  };

  return {
    container,
    image,
    text,
  };
};

/**
 * Get initials from name
 */
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

/**
 * Avatar component with design system integration
 *
 * A flexible avatar component that supports images and text initials.
 */
const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'medium',
  variant = 'default',
  style,
  textStyle,
  testID,
  accessibilityLabel,
}) => {
  const { isDark } = useTheme();

  const styles = useMemo(
    () => getAvatarStyles(size, variant, isDark),
    [size, variant, isDark]
  );

  const initials = name ? getInitials(name) : '';
  const label = accessibilityLabel || (name ? `${name}'s avatar` : 'Avatar');

  return (
    <View
      style={[styles.container, style]}
      testID={testID}
      accessibilityLabel={label}
      accessibilityRole="image"
    >
      {source ? (
        <Image
          source={source}
          style={styles.image}
          resizeMode="cover"
        />
      ) : name ? (
        <Text style={[styles.text, textStyle]}>
          {initials}
        </Text>
      ) : null}
    </View>
  );
};

Avatar.displayName = 'Avatar';

export default memo(Avatar);