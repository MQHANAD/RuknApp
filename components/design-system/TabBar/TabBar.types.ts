/**
 * TabBar Component Types
 * TypeScript type definitions for the TabBar component
 */

import { ViewStyle, TextStyle, ImageSourcePropType, ImageStyle } from 'react-native';

export interface TabItem {
  key: string;
  title: string;
  icon: ImageSourcePropType;
  focusedIcon?: ImageSourcePropType;
  accessibilityLabel?: string;
}

export interface TabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (tabKey: string) => void;
  style?: ViewStyle;
  tabStyle?: ViewStyle;
  labelStyle?: TextStyle;
  activeTintColor?: string;
  inactiveTintColor?: string;
  backgroundColor?: string;
  height?: number;
  showLabels?: boolean;
  testID?: string;
  accessibilityLabel?: string;
}

export interface TabBarStyles {
  container: ViewStyle;
  tab: ViewStyle;
  tabActive: ViewStyle;
  icon: ImageStyle;
  label: TextStyle;
  indicator?: ViewStyle;
}

export type TabBarVariant = 'default' | 'minimal';
export type TabBarSize = 'small' | 'medium' | 'large';