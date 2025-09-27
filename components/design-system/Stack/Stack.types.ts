/**
 * Stack Component Types
 * TypeScript type definitions for the Stack component
 */

import { ViewStyle } from 'react-native';

export interface StackProps {
  children: React.ReactNode;
  spacing?: 'none' | 'tight' | 'snug' | 'small' | 'medium' | 'large' | 'xl';
  direction?: 'vertical' | 'horizontal';
  style?: ViewStyle;
  testID?: string;
  accessibilityLabel?: string;
}

export interface StackStyles {
  container: ViewStyle;
}

export type StackVariant = 'default' | 'spaced';
export type StackDirection = 'vertical' | 'horizontal';
export type StackSpacing = 'none' | 'tight' | 'snug' | 'small' | 'medium' | 'large' | 'xl';