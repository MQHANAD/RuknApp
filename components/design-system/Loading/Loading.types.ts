/**
 * Loading Component Types
 * TypeScript type definitions for the Loading and Skeleton components
 */

import { ViewStyle } from 'react-native';

export interface SkeletonProps {
  width?: number | string;
  height?: number;
  variant?: 'rounded' | 'circular' | 'rectangular';
  style?: ViewStyle;
  testID?: string;
  accessibilityLabel?: string;
}

export interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  style?: ViewStyle;
  testID?: string;
  accessibilityLabel?: string;
}

export interface LoadingStyles {
  container: ViewStyle;
  skeleton: ViewStyle;
  spinner: ViewStyle;
}

export type SkeletonVariant = 'rounded' | 'circular' | 'rectangular';
export type LoadingSize = 'small' | 'medium' | 'large';