import { TextInputProps as RNTextInputProps, TextStyle, ViewStyle } from 'react-native';
import { ResponsiveValue } from '../../../src/utils/responsive';

/**
 * TextInput component state for styling
 */
export type TextInputState = 'default' | 'focused' | 'error' | 'disabled';

/**
 * TextInput component props interface
 * Extends React Native TextInputProps with design system features
 */
export interface TextInputProps extends Omit<RNTextInputProps, 'style'> {
  /**
   * Input field label
   */
  label?: string;
  
  /**
   * Error message to display below input
   */
  error?: string;
  
  /**
   * Helper text to display below input
   */
  helperText?: string;
  
  /**
   * Whether the input is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Custom container style
   */
  containerStyle?: ViewStyle;
  
  /**
   * Custom input style
   */
  inputStyle?: TextStyle;
  
  /**
   * Custom label style
   */
  labelStyle?: TextStyle;
  
  /**
   * Custom error text style
   */
  errorStyle?: TextStyle;
  
  /**
   * Custom helper text style
   */
  helperStyle?: TextStyle;
  
  /**
   * Test ID for testing
   */
  testID?: string;
  
  /**
   * Whether to show required indicator (*)
   * @default false
   */
  required?: boolean;
  
  /**
   * Enable responsive sizing based on screen size
   * @default false
   */
  responsive?: boolean;
  
  /**
   * Enable RTL support for input layout
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
   * Custom height for responsive behavior
   */
  height?: ResponsiveValue<number>;
  
  /**
   * Auto-detect RTL from text content
   * @default false
   */
  autoDetectRTL?: boolean;
}

/**
 * Internal TextInput style state
 */
export interface TextInputStyleState {
  state: TextInputState;
  hasError: boolean;
  hasLabel: boolean;
  hasHelperText: boolean;
  isRTL: boolean;
  responsive: boolean;
  customPadding?: number;
  customFontSize?: number;
  customHeight?: number;
  textDirection?: 'ltr' | 'rtl';
}

/**
 * TextInput component styles
 */
export interface TextInputStyles {
  container: ViewStyle;
  labelContainer: ViewStyle;
  label: TextStyle;
  requiredIndicator: TextStyle;
  inputContainer: ViewStyle;
  input: TextStyle;
  helperContainer: ViewStyle;
  helperText: TextStyle;
  errorText: TextStyle;
}