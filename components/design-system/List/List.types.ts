/**
 * List Component Types
 * TypeScript type definitions for the List and ListItem components
 */

import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

export interface ListItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: any; // ImageSourcePropType
  rightIcon?: any; // ImageSourcePropType
  onPress?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'selectable';
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  testID?: string;
  accessibilityLabel?: string;
}

export interface ListProps {
  children: React.ReactNode;
  variant?: 'default' | 'bordered';
  style?: ViewStyle;
  itemStyle?: ViewStyle;
  testID?: string;
  accessibilityLabel?: string;
}

export interface ListStyles {
  container: ViewStyle;
  item: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  icon: ImageStyle;
}

export type ListVariant = 'default' | 'bordered';
export type ListItemVariant = 'default' | 'selectable';