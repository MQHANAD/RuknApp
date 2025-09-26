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
  navigationBarStyles,
  typography,
  spacing,
  colors,
} from '../../../constants/design-tokens';
import { useTheme } from '../../../src/context/ThemeContext';
import { useRTL } from '../../../src/hooks/useRTL';
import { NavigationBarProps, NavigationBarStyles, NavigationBarAction } from './NavigationBar.types';

/**
 * Get NavigationBar styles based on current state and theme
 */
const getNavigationBarStyles = (
  variant: 'default' | 'transparent',
  isDark: boolean,
  customHeight?: number
): NavigationBarStyles => {
  const isTransparent = variant === 'transparent';

  const container: ViewStyle = {
    ...navigationBarStyles.default,
    backgroundColor: isTransparent
      ? 'transparent'
      : (isDark ? colors.neutral[900] : colors.neutral[0]),
    borderBottomColor: isTransparent
      ? 'transparent'
      : (isDark ? colors.neutral[700] : colors.neutral[200]),
    height: customHeight || navigationBarStyles.default.height,
  };

  const leftContainer: ViewStyle = {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  };

  const centerContainer: ViewStyle = {
    flex: 2,
    alignItems: 'center',
  };

  const rightContainer: ViewStyle = {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  };

  const title: TextStyle = {
    ...typography.heading.h3,
    color: isDark ? colors.neutral[50] : colors.neutral[900],
    textAlign: 'center',
  };

  const action: ViewStyle = {
    padding: spacing[2],
    marginHorizontal: spacing[1],
    borderRadius: 6,
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const icon: ImageStyle = {
    width: 24,
    height: 24,
    tintColor: isDark ? colors.neutral[300] : colors.primary[500],
  };

  return {
    container,
    leftContainer,
    centerContainer,
    rightContainer,
    title,
    action,
    icon,
  };
};

/**
 * NavigationBar component with design system integration
 *
 * A flexible navigation bar component that supports title, left action, and right actions.
 * Designed to work with React Navigation or as a standalone component.
 */
const NavigationBar: React.FC<NavigationBarProps> = ({
  title,
  leftAction,
  rightActions = [],
  style,
  titleStyle,
  backgroundColor,
  height,
  showBackButton = false,
  onBackPress,
  testID,
  accessibilityLabel,
}) => {
  const { isDark } = useTheme();
  const { isRTL } = useRTL();

  const styles = useMemo(
    () => getNavigationBarStyles('default', isDark, height),
    [isDark, height]
  );

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    }
  };

  const renderAction = (action: NavigationBarAction, isRight = false) => (
    <TouchableOpacity
      key={action.key}
      style={styles.action}
      onPress={action.onPress}
      disabled={action.disabled}
      accessibilityLabel={action.accessibilityLabel}
      accessibilityRole="button"
      testID={`${testID}-action-${action.key}`}
    >
      {action.icon && (
        <Image
          source={action.icon}
          style={styles.icon}
          resizeMode="contain"
        />
      )}
      {!action.icon && (
        <Text style={[
          typography.button.medium,
          { color: isDark ? colors.neutral[300] : colors.primary[500] }
        ]}>
          {action.title}
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderBackButton = () => {
    if (!showBackButton && !onBackPress) return null;

    const backIcon = require('../../../../assets/icons/arrowLeft.png');

    return (
      <TouchableOpacity
        style={styles.action}
        onPress={handleBackPress}
        accessibilityLabel="Go back"
        accessibilityRole="button"
        testID={`${testID}-back-button`}
      >
        <Image
          source={backIcon}
          style={[
            styles.icon,
            isRTL && { transform: [{ scaleX: -1 }] } // Flip for RTL
          ]}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor },
        style,
      ]}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="toolbar"
    >
      {/* Left Container */}
      <View style={styles.leftContainer}>
        {(showBackButton || onBackPress) && renderBackButton()}
        {leftAction && !showBackButton && !onBackPress && renderAction(leftAction)}
      </View>

      {/* Center Container - Title */}
      <View style={styles.centerContainer}>
        {title && (
          <Text
            style={[styles.title, titleStyle]}
            numberOfLines={1}
            testID={`${testID}-title`}
          >
            {title}
          </Text>
        )}
      </View>

      {/* Right Container - Actions */}
      <View style={styles.rightContainer}>
        {rightActions.map((action) => renderAction(action, true))}
      </View>
    </View>
  );
};

NavigationBar.displayName = 'NavigationBar';

export default memo(NavigationBar);