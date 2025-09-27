/**
 * Container Component Types
 * TypeScript type definitions for the Container component
 */

import { ViewStyle } from 'react-native';

export interface ContainerProps {
  children: React.ReactNode;
  size?: 'narrow' | 'wide' | 'full';
  padding?: 'none' | 'small' | 'medium' | 'large';
  centered?: boolean;
  style?: ViewStyle;
  testID?: string;
  accessibilityLabel?: string;
}

export interface ContainerStyles {
  container: ViewStyle;
}

export type ContainerVariant = 'default' | 'centered' | 'padded';
export type ContainerSize = 'narrow' | 'wide' | 'full';