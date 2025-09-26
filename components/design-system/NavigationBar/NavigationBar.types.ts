/**
 * NavigationBar Component Types
 * TypeScript type definitions for the NavigationBar component
 */

import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

export interface NavigationBarAction {
  key: string;
  title: string;
  icon?: any; // ImageSourcePropType
  onPress: () => void;
  accessibilityLabel?: string;
  disabled?: boolean;
}

export interface NavigationBarProps {
  title?: string;
  leftAction?: NavigationBarAction;
  rightActions?: NavigationBarAction[];
  style?: ViewStyle;
  titleStyle?: TextStyle;
  backgroundColor?: string;
  height?: number;
  showBackButton?: boolean;
  onBackPress?: () => void;
  testID?: string;
  accessibilityLabel?: string;
}

export interface NavigationBarStyles {
  container: ViewStyle;
  leftContainer: ViewStyle;
  centerContainer: ViewStyle;
  rightContainer: ViewStyle;
  title: TextStyle;
  action: ViewStyle;
  icon: ImageStyle;
}

export type NavigationBarVariant = 'default' | 'transparent';
export type NavigationBarSize = 'small' | 'medium' | 'large';