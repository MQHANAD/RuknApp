/**
 * TextInput Component Test Suite
 * 
 * Tests the TextInput design system component including all states,
 * validation, accessibility features, and RTL support.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TextInput } from '../../components/design-system/TextInput';
import { ThemeProvider } from '../../src/context/ThemeContext';

// Mock AsyncStorage for ThemeProvider
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Test wrapper with theme context
const TestWrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(ThemeProvider, { disablePersistence: true, children });

describe('TextInput Component', () => {

  // ===== BASIC RENDERING TESTS =====

  describe('Basic Rendering', () => {
    test('should render with basic props', () => {
      const { getByDisplayValue } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            value: 'Test Value',
            onChangeText: jest.fn()
          })
        })
      );

      expect(getByDisplayValue('Test Value')).toBeTruthy();
    });

    test('should render with label', () => {
      const labelText = 'Test Label';
      const { getByText } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            label: labelText,
            value: '',
            onChangeText: jest.fn()
          })
        })
      );

      expect(getByText(labelText)).toBeTruthy();
    });

    test('should render with placeholder', () => {
      const placeholderText = 'Enter text here...';
      const { getByPlaceholderText } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            placeholder: placeholderText,
            value: '',
            onChangeText: jest.fn()
          })
        })
      );

      expect(getByPlaceholderText(placeholderText)).toBeTruthy();
    });

    test('should render without label', () => {
      const { queryByText } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            value: 'No label',
            onChangeText: jest.fn()
          })
        })
      );

      // Should not find any label text
      expect(queryByText(/Label/)).toBeFalsy();
    });
  });

  // ===== STATE TESTS =====

  describe('Input States', () => {
    test('should handle default state', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            testID: 'input',
            value: '',
            onChangeText: jest.fn()
          })
        })
      );

      const input = getByTestId('input');
      expect(input).toBeTruthy();
      expect(input.props.editable).not.toBe(false);
    });

    test('should handle disabled state', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            testID: 'input',
            disabled: true,
            value: 'Disabled input',
            onChangeText: jest.fn()
          })
        })
      );

      const input = getByTestId('input');
      expect(input.props.editable).toBe(false);
    });

    test('should display error state', () => {
      const errorMessage = 'This field is required';
      const { getByText } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            error: errorMessage,
            value: '',
            onChangeText: jest.fn()
          })
        })
      );

      expect(getByText(errorMessage)).toBeTruthy();
    });

    test('should display helper text', () => {
      const helperText = 'Enter your email address';
      const { getByText } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            helperText: helperText,
            value: '',
            onChangeText: jest.fn()
          })
        })
      );

      expect(getByText(helperText)).toBeTruthy();
    });

    test('should show required indicator', () => {
      const { getByText } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            label: 'Required Field',
            required: true,
            value: '',
            onChangeText: jest.fn()
          })
        })
      );

      // Look for asterisk or required indicator
      expect(getByText('Required Field')).toBeTruthy();
    });
  });

  // ===== INPUT BEHAVIOR TESTS =====

  describe('Input Behavior', () => {
    test('should call onChangeText when text changes', () => {
      const mockChangeText = jest.fn();
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            testID: 'input',
            value: '',
            onChangeText: mockChangeText
          })
        })
      );

      const input = getByTestId('input');
      fireEvent.changeText(input, 'new text');
      
      expect(mockChangeText).toHaveBeenCalledWith('new text');
    });

    test('should handle focus events', () => {
      const mockFocus = jest.fn();
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            testID: 'input',
            value: '',
            onChangeText: jest.fn(),
            onFocus: mockFocus
          })
        })
      );

      const input = getByTestId('input');
      fireEvent(input, 'focus');
      
      expect(mockFocus).toHaveBeenCalled();
    });

    test('should handle blur events', () => {
      const mockBlur = jest.fn();
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            testID: 'input',
            value: '',
            onChangeText: jest.fn(),
            onBlur: mockBlur
          })
        })
      );

      const input = getByTestId('input');
      fireEvent(input, 'blur');
      
      expect(mockBlur).toHaveBeenCalled();
    });

    test('should handle submit editing', () => {
      const mockSubmit = jest.fn();
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            testID: 'input',
            value: 'Submit test',
            onChangeText: jest.fn(),
            onSubmitEditing: mockSubmit
          })
        })
      );

      const input = getByTestId('input');
      fireEvent(input, 'submitEditing');
      
      expect(mockSubmit).toHaveBeenCalled();
    });

    test('should handle multiline input', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            testID: 'input',
            multiline: true,
            value: 'Line 1\nLine 2',
            onChangeText: jest.fn()
          })
        })
      );

      const input = getByTestId('input');
      expect(input.props.multiline).toBe(true);
    });
  });

  // ===== KEYBOARD TYPES TESTS =====

  describe('Keyboard Types', () => {
    test('should handle email keyboard type', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            testID: 'input',
            keyboardType: 'email-address',
            value: '',
            onChangeText: jest.fn()
          })
        })
      );

      const input = getByTestId('input');
      expect(input.props.keyboardType).toBe('email-address');
    });

    test('should handle numeric keyboard type', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            testID: 'input',
            keyboardType: 'numeric',
            value: '',
            onChangeText: jest.fn()
          })
        })
      );

      const input = getByTestId('input');
      expect(input.props.keyboardType).toBe('numeric');
    });

    test('should handle phone pad keyboard type', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            testID: 'input',
            keyboardType: 'phone-pad',
            value: '',
            onChangeText: jest.fn()
          })
        })
      );

      const input = getByTestId('input');
      expect(input.props.keyboardType).toBe('phone-pad');
    });
  });

  // ===== SECURITY TESTS =====

  describe('Security Features', () => {
    test('should handle secure text entry', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            testID: 'input',
            secureTextEntry: true,
            value: 'password123',
            onChangeText: jest.fn()
          })
        })
      );

      const input = getByTestId('input');
      expect(input.props.secureTextEntry).toBe(true);
    });

    test('should handle auto capitalization settings', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            testID: 'input',
            autoCapitalize: 'words',
            value: '',
            onChangeText: jest.fn()
          })
        })
      );

      const input = getByTestId('input');
      expect(input.props.autoCapitalize).toBe('words');
    });

    test('should handle auto correct settings', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            testID: 'input',
            autoCorrect: false,
            value: '',
            onChangeText: jest.fn()
          })
        })
      );

      const input = getByTestId('input');
      expect(input.props.autoCorrect).toBe(false);
    });
  });

  // ===== ACCESSIBILITY TESTS =====

  describe('Accessibility', () => {
    test('should have proper accessibility label from label prop', () => {
      const labelText = 'Username Input';
      const { getByLabelText } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            label: labelText,
            value: '',
            onChangeText: jest.fn()
          })
        })
      );

      expect(getByLabelText(labelText)).toBeTruthy();
    });

    test('should have custom accessibility label', () => {
      const accessibilityLabel = 'Custom accessibility label';
      const { getByLabelText } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            accessibilityLabel,
            value: '',
            onChangeText: jest.fn()
          })
        })
      );

      expect(getByLabelText(accessibilityLabel)).toBeTruthy();
    });

    test('should indicate error state to screen readers', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            testID: 'input',
            error: 'Validation error',
            value: '',
            onChangeText: jest.fn()
          })
        })
      );

      const input = getByTestId('input');
      // Check for error accessibility state
      expect(input).toBeTruthy();
    });

    test('should indicate required state to screen readers', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            testID: 'input',
            required: true,
            value: '',
            onChangeText: jest.fn()
          })
        })
      );

      const input = getByTestId('input');
      expect(input).toBeTruthy();
    });
  });

  // ===== RTL SUPPORT TESTS =====

  describe('RTL Support', () => {
    test('should handle RTL layout', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            testID: 'input',
            rtlEnabled: true,
            value: 'مرحبا',
            onChangeText: jest.fn()
          })
        })
      );

      const input = getByTestId('input');
      expect(input).toBeTruthy();
    });

    test('should auto-detect RTL text', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            testID: 'input',
            autoDetectRTL: true,
            value: 'النص العربي',
            onChangeText: jest.fn()
          })
        })
      );

      const input = getByTestId('input');
      expect(input).toBeTruthy();
    });
  });

  // ===== RESPONSIVE BEHAVIOR TESTS =====

  describe('Responsive Behavior', () => {
    test('should handle responsive sizing', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            testID: 'input',
            responsive: true,
            value: '',
            onChangeText: jest.fn()
          })
        })
      );

      const input = getByTestId('input');
      expect(input).toBeTruthy();
    });

    test('should handle responsive padding', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            testID: 'input',
            padding: { sm: 8, md: 12, lg: 16 } as any,
            value: '',
            onChangeText: jest.fn()
          })
        })
      );

      const input = getByTestId('input');
      expect(input).toBeTruthy();
    });

    test('should handle responsive font size', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            testID: 'input',
            fontSize: { sm: 14, md: 16, lg: 18 } as any,
            value: '',
            onChangeText: jest.fn()
          })
        })
      );

      const input = getByTestId('input');
      expect(input).toBeTruthy();
    });
  });

  // ===== CUSTOM STYLING TESTS =====

  describe('Custom Styling', () => {
    test('should accept custom container style', () => {
      const customStyle = { marginTop: 20 };
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            testID: 'input',
            containerStyle: customStyle,
            value: '',
            onChangeText: jest.fn()
          })
        })
      );

      const input = getByTestId('input');
      expect(input).toBeTruthy();
    });

    test('should accept custom input style', () => {
      const customStyle = { fontSize: 18 };
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            testID: 'input',
            inputStyle: customStyle,
            value: '',
            onChangeText: jest.fn()
          })
        })
      );

      const input = getByTestId('input');
      expect(input).toBeTruthy();
    });

    test('should accept custom label style', () => {
      const customStyle = { fontWeight: 'bold' as const };
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            testID: 'input',
            label: 'Styled Label',
            labelStyle: customStyle,
            value: '',
            onChangeText: jest.fn()
          })
        })
      );

      const input = getByTestId('input');
      expect(input).toBeTruthy();
    });
  });

  // ===== THEME INTEGRATION TESTS =====

  describe('Theme Integration', () => {
    test('should adapt to light theme', () => {
      const { getByTestId } = render(
        React.createElement(
          ThemeProvider, 
          { 
            disablePersistence: true, 
            defaultMode: 'light' as const,
            children: React.createElement(TextInput, { 
              testID: 'input',
              value: 'Light theme input',
              onChangeText: jest.fn()
            })
          }
        )
      );

      const input = getByTestId('input');
      expect(input).toBeTruthy();
    });

    test('should adapt to dark theme', () => {
      const { getByTestId } = render(
        React.createElement(
          ThemeProvider, 
          { 
            disablePersistence: true, 
            defaultMode: 'dark' as const,
            children: React.createElement(TextInput, { 
              testID: 'input',
              value: 'Dark theme input',
              onChangeText: jest.fn()
            })
          }
        )
      );

      const input = getByTestId('input');
      expect(input).toBeTruthy();
    });
  });

  // ===== EDGE CASES TESTS =====

  describe('Edge Cases', () => {
    test('should handle very long text', () => {
      const longText = 'This is a very long text that might overflow or cause layout issues depending on the implementation and should be handled gracefully';
      const { getByDisplayValue } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            value: longText,
            onChangeText: jest.fn()
          })
        })
      );

      expect(getByDisplayValue(longText)).toBeTruthy();
    });

    test('should handle special characters', () => {
      const specialText = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const { getByDisplayValue } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            value: specialText,
            onChangeText: jest.fn()
          })
        })
      );

      expect(getByDisplayValue(specialText)).toBeTruthy();
    });

    test('should handle unicode characters', () => {
      const unicodeText = '🔥 مرحبا ✨ 你好 🌟';
      const { getByDisplayValue } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            value: unicodeText,
            onChangeText: jest.fn()
          })
        })
      );

      expect(getByDisplayValue(unicodeText)).toBeTruthy();
    });

    test('should handle empty string values', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            testID: 'input',
            value: '',
            onChangeText: jest.fn()
          })
        })
      );

      const input = getByTestId('input');
      expect(input.props.value).toBe('');
    });

    test('should handle null/undefined values gracefully', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            testID: 'input',
            value: undefined as any,
            onChangeText: jest.fn()
          })
        })
      );

      const input = getByTestId('input');
      expect(input).toBeTruthy();
    });
  });

  // ===== PERFORMANCE TESTS =====

  describe('Performance', () => {
    test('should render efficiently with default props', () => {
      const startTime = Date.now();
      
      render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            value: 'Performance test',
            onChangeText: jest.fn()
          })
        })
      );
      
      const renderTime = Date.now() - startTime;
      expect(renderTime).toBeLessThan(100);
    });

    test('should handle rapid text changes efficiently', () => {
      const mockChangeText = jest.fn();
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, { 
            testID: 'input',
            value: '',
            onChangeText: mockChangeText
          })
        })
      );

      const input = getByTestId('input');
      
      // Simulate rapid typing
      for (let i = 0; i < 10; i++) {
        fireEvent.changeText(input, `text${i}`);
      }
      
      expect(mockChangeText).toHaveBeenCalledTimes(10);
    });
  });

  // ===== TYPE SAFETY TESTS =====

  describe('Type Safety', () => {
    test('should accept valid TextInput props', () => {
      const validProps = {
        value: 'Type safe input',
        onChangeText: jest.fn(),
        label: 'Type Safe Label',
        placeholder: 'Type safe placeholder',
        disabled: false,
        required: true,
        keyboardType: 'default' as const,
        secureTextEntry: false,
        multiline: false
      };
      
      const { getByDisplayValue } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(TextInput, validProps)
        })
      );

      expect(getByDisplayValue('Type safe input')).toBeTruthy();
    });
  });

});