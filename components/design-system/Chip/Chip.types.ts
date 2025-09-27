/**
 * Chip Component Types
 * TypeScript type definitions for the Chip component
 */

import { ViewStyle, TextStyle } from 'react-native';

export interface ChipProps {
  label: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'outline';
  onPress?: () => void;
  onClose?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
  accessibilityLabel?: string;
}

export interface ChipStyles {
  container: ViewStyle;
  text: TextStyle;
  closeButton?: ViewStyle;
}

export type ChipVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'outline';