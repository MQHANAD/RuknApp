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
  tabBarStyles,
  typography,
  spacing,
  colors,
} from '../../../constants/design-tokens';
import { useTheme } from '../../../src/context/ThemeContext';
import { useRTL } from '../../../src/hooks/useRTL';
import { TabBarProps, TabBarStyles, TabItem } from './TabBar.types';

/**
 * Get TabBar styles based on current state and theme
 */
const getTabBarStyles = (
  variant: 'default' | 'minimal',
  isDark: boolean,
  customHeight?: number
): TabBarStyles => {
  const container: ViewStyle = {
    ...tabBarStyles.default,
    backgroundColor: isDark ? colors.neutral[800] : colors.neutral[0],
    borderTopColor: isDark ? colors.neutral[700] : colors.neutral[200],
    height: customHeight || tabBarStyles.default.height,
  };

  const tab: ViewStyle = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[1],
    minHeight: 56,
    maxWidth: '25%', // Ensure equal distribution for 4 tabs
  };

  const tabActive: ViewStyle = {
    ...tab,
  };

  const icon: ImageStyle = {
    width: 24,
    height: 24,
    marginBottom: spacing[1],
  };

  const label: TextStyle = {
    ...typography.caption.small,
    color: isDark ? colors.neutral[400] : colors.neutral[600],
    textAlign: 'center',
    fontSize: 9,
    flexShrink: 1,
  };

  return {
    container,
    tab,
    tabActive,
    icon,
    label,
  };
};

/**
 * TabBar component with design system integration
 *
 * A flexible tab bar component that supports icons, labels, and accessibility features.
 * Designed to work with React Navigation or as a standalone component.
 */
const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTab,
  onTabPress,
  style,
  tabStyle,
  labelStyle,
  activeTintColor,
  inactiveTintColor,
  backgroundColor,
  height,
  showLabels = true,
  testID,
  accessibilityLabel,
}) => {
  const { isDark } = useTheme();
  const { isRTL } = useRTL();

  const styles = useMemo(
    () => getTabBarStyles('default', isDark, height),
    [isDark, height]
  );

  const handleTabPress = (tabKey: string) => {
    onTabPress(tabKey);
  };

  const renderTab = (tab: TabItem, index: number) => {
    const isActive = activeTab === tab.key;
    const tintColor = isActive
      ? (activeTintColor || colors.primary[500])
      : (inactiveTintColor || (isDark ? colors.neutral[400] : colors.neutral[600]));

    return (
      <TouchableOpacity
        key={tab.key}
        style={[
          styles.tab,
          tabStyle,
          isActive && styles.tabActive,
        ]}
        onPress={() => handleTabPress(tab.key)}
        accessibilityLabel={tab.accessibilityLabel || tab.title}
        accessibilityRole="tab"
        accessibilityState={{ selected: isActive }}
        testID={`${testID}-tab-${index}`}
      >
        <Image
          source={tab.icon}
          style={[
            styles.icon,
            { tintColor },
          ]}
          resizeMode="contain"
        />
        {showLabels && (
          <Text
            style={[
              styles.label,
              labelStyle,
              { color: tintColor },
            ]}
            numberOfLines={1}
          >
            {tab.title}
          </Text>
        )}
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
      accessibilityRole="tablist"
    >
      {tabs.map((tab, index) => renderTab(tab, index))}
    </View>
  );
};

TabBar.displayName = 'TabBar';

export default memo(TabBar);