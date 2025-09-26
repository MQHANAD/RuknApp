/**
 * Avatar Component Types
 * TypeScript type definitions for the Avatar component
 */

import { ViewStyle, TextStyle, ImageStyle, ImageSourcePropType } from 'react-native';

export interface AvatarProps {
  source?: ImageSourcePropType;
  name?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  variant?: 'default' | 'outline';
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
  accessibilityLabel?: string;
}

export interface AvatarStyles {
  container: ViewStyle;
  image: ImageStyle;
  text: TextStyle;
}

export type AvatarVariant = 'default' | 'outline';
export type AvatarSize = 'small' | 'medium' | 'large' | 'xlarge';