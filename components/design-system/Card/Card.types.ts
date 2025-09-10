import { GestureResponderEvent, ViewStyle } from 'react-native';
import { ResponsiveValue } from '../../../src/utils/responsive';

/**
 * Card component variants
 */
export type CardVariant = 'default' | 'elevated' | 'outlined';

/**
 * Card component props interface
 */
export interface CardProps {
  /**
   * Card variant (default, elevated, outlined)
   * @default 'default'
   */
  variant?: CardVariant;
  
  /**
   * Card children content
   */
  children: React.ReactNode;
  
  /**
   * Optional press handler - makes card touchable
   */
  onPress?: (event: GestureResponderEvent) => void;
  
  /**
   * Custom container style
   */
  style?: ViewStyle;
  
  /**
   * Custom padding override
   * Can be responsive with different values for different screen sizes
   */
  padding?: number | ResponsiveValue<number>;
  
  /**
   * Accessibility label
   */
  accessibilityLabel?: string;
  
  /**
   * Accessibility hint
   */
  accessibilityHint?: string;
  
  /**
   * Test ID for testing
   */
  testID?: string;
  
  /**
   * Whether the card is disabled (when touchable)
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Enable responsive sizing based on screen size
   * @default false
   */
  responsive?: boolean;
  
  /**
   * Enable RTL support for card layout
   * @default true
   */
  rtlEnabled?: boolean;
  
  /**
   * Custom border radius for responsive behavior
   */
  borderRadius?: ResponsiveValue<number>;
  
  /**
   * Custom margin for responsive behavior
   */
  margin?: ResponsiveValue<number>;
  
  /**
   * Custom width for responsive behavior
   */
  width?: ResponsiveValue<number>;
  
  /**
   * Custom height for responsive behavior
   */
  height?: ResponsiveValue<number>;
}

/**
 * Internal card style state
 */
export interface CardStyleState {
  variant: CardVariant;
  isPressed: boolean;
  isTouchable: boolean;
  customPadding?: number;
  isRTL: boolean;
  responsive: boolean;
  customBorderRadius?: number;
  customMargin?: number;
  customWidth?: number;
  customHeight?: number;
}

/**
 * Card component styles
 */
export interface CardStyles {
  container: ViewStyle;
}