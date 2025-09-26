/**
 * Modal Component Types
 * TypeScript type definitions for the Modal component
 */

import { ViewStyle, TextStyle } from 'react-native';

export interface ModalProps {
  visible: boolean;
  onClose?: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  variant?: 'default' | 'fullscreen' | 'bottomSheet';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  overlayStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  closeButton?: boolean;
  testID?: string;
  accessibilityLabel?: string;
}

export interface ModalStyles {
  overlay: ViewStyle;
  container: ViewStyle;
  header: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  content: ViewStyle;
  closeButton: ViewStyle;
}

export type ModalVariant = 'default' | 'fullscreen' | 'bottomSheet';
export type ModalSize = 'small' | 'medium' | 'large';