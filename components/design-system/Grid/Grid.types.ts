/**
 * Grid Component Types
 * TypeScript type definitions for the Grid component
 */

import { ViewStyle } from 'react-native';

export interface GridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4 | 6;
  spacing?: 'none' | 'tight' | 'snug' | 'small' | 'medium' | 'large';
  style?: ViewStyle;
  itemStyle?: ViewStyle;
  testID?: string;
  accessibilityLabel?: string;
}

export interface GridStyles {
  container: ViewStyle;
  item: ViewStyle;
}

export type GridVariant = 'default' | 'spaced';
export type GridColumns = 1 | 2 | 3 | 4 | 6;
export type GridSpacing = 'none' | 'tight' | 'snug' | 'small' | 'medium' | 'large';