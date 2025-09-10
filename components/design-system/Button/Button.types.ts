import { GestureResponderEvent, TextStyle, ViewStyle } from 'react-native';
import { ButtonSize, ButtonVariant, ButtonState } from '../../../constants/design-tokens';
import { ResponsiveValue } from '../../../src/utils/responsive';

/**
 * Button component props interface
 */
export interface ButtonProps {
  /**
   * Button text content
   */
  children: string;
  
  /**
   * Button variant (primary, secondary, ghost)
   * @default 'primary'
   */
  variant?: ButtonVariant;
  
  /**
   * Button size (small, medium, large)
   * Can be responsive with different sizes for different screen sizes
   * @default 'medium'
   */
  size?: ButtonSize | ResponsiveValue<ButtonSize>;
  
  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Whether the button is in loading state
   * @default false
   */
  loading?: boolean;
  
  /**
   * Whether the button should take full width
   * Can be responsive with different values for different screen sizes
   * @default false
   */
  fullWidth?: boolean | ResponsiveValue<boolean>;
  
  /**
   * Button press handler
   */
  onPress?: (event: GestureResponderEvent) => void;
  
  /**
   * Custom container style
   */
  style?: ViewStyle;
  
  /**
   * Custom text style
   */
  textStyle?: TextStyle;
  
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
   * Enable responsive sizing based on screen size
   * @default false
   */
  responsive?: boolean;
  
  /**
   * Enable RTL support for button layout
   * @default true
   */
  rtlEnabled?: boolean;
  
  /**
   * Custom padding for responsive behavior
   */
  padding?: ResponsiveValue<number>;
  
  /**
   * Custom font size for responsive behavior
   */
  fontSize?: ResponsiveValue<number>;
  
  /**
   * Icon to display (directional, neutral, text)
   * Used for RTL icon flipping
   */
  iconType?: 'directional' | 'neutral' | 'text';
}

/**
 * Internal button state for styling
 */
export interface ButtonStyleState {
  variant: ButtonVariant;
  size: ButtonSize;
  state: ButtonState;
  fullWidth: boolean;
  isRTL: boolean;
  responsive: boolean;
  customPadding?: number;
  customFontSize?: number;
}

/**
 * Button style configuration
 */
export interface ButtonStyles {
  container: ViewStyle;
  text: TextStyle;
}