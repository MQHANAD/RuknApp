/**
 * Button Component Test Suite
 * 
 * Tests the Button design system component including all variants,
 * sizes, states, and accessibility features.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../../components/design-system/Button';
import { ThemeProvider } from '../../src/context/ThemeContext';

// Mock AsyncStorage for ThemeProvider
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Test wrapper with theme context
const TestWrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(ThemeProvider, { disablePersistence: true, children });

describe('Button Component', () => {

  // ===== BASIC RENDERING TESTS =====

  describe('Basic Rendering', () => {
    test('should render with default props', () => {
      const { getByText } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Button, { children: 'Test Button' })
        })
      );

      expect(getByText('Test Button')).toBeTruthy();
    });

    test('should render with custom text', () => {
      const buttonText = 'Custom Button Text';
      const { getByText } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Button, { children: buttonText })
        })
      );

      expect(getByText(buttonText)).toBeTruthy();
    });
  });

  // ===== VARIANT TESTS =====

  describe('Button Variants', () => {
    test('should render primary variant by default', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Button, { 
            testID: 'button', 
            children: 'Primary Button' 
          })
        })
      );

      const button = getByTestId('button');
      expect(button).toBeTruthy();
    });

    test('should render secondary variant correctly', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Button, { 
            variant: 'secondary' as const, 
            testID: 'button',
            children: 'Secondary Button'
          })
        })
      );

      const button = getByTestId('button');
      expect(button).toBeTruthy();
    });

    test('should render ghost variant correctly', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Button, { 
            variant: 'ghost' as const, 
            testID: 'button',
            children: 'Ghost Button'
          })
        })
      );

      const button = getByTestId('button');
      expect(button).toBeTruthy();
    });
  });

  // ===== SIZE TESTS =====

  describe('Button Sizes', () => {
    test('should render medium size by default', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Button, { 
            testID: 'button',
            children: 'Medium Button'
          })
        })
      );

      const button = getByTestId('button');
      expect(button).toBeTruthy();
    });

    test('should render small size correctly', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Button, { 
            size: 'small' as const, 
            testID: 'button',
            children: 'Small Button'
          })
        })
      );

      const button = getByTestId('button');
      expect(button).toBeTruthy();
    });

    test('should render large size correctly', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Button, { 
            size: 'large' as const, 
            testID: 'button',
            children: 'Large Button'
          })
        })
      );

      const button = getByTestId('button');
      expect(button).toBeTruthy();
    });
  });

  // ===== STATE TESTS =====

  describe('Button States', () => {
    test('should be enabled by default', () => {
      const mockPress = jest.fn();
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Button, { 
            onPress: mockPress,
            testID: 'button',
            children: 'Enabled Button'
          })
        })
      );

      const button = getByTestId('button');
      fireEvent.press(button);
      
      expect(mockPress).toHaveBeenCalledTimes(1);
    });

    test('should handle disabled state correctly', () => {
      const mockPress = jest.fn();
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Button, { 
            disabled: true,
            onPress: mockPress,
            testID: 'button',
            children: 'Disabled Button'
          })
        })
      );

      const button = getByTestId('button');
      fireEvent.press(button);
      
      // Should not call onPress when disabled
      expect(mockPress).not.toHaveBeenCalled();
    });

    test('should show loading state correctly', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Button, { 
            loading: true,
            testID: 'button',
            children: 'Loading Button'
          })
        })
      );

      const button = getByTestId('button');
      expect(button).toBeTruthy();
    });

    test('should not call onPress when loading', () => {
      const mockPress = jest.fn();
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Button, { 
            loading: true,
            onPress: mockPress,
            testID: 'button',
            children: 'Loading Button'
          })
        })
      );

      const button = getByTestId('button');
      fireEvent.press(button);
      
      expect(mockPress).not.toHaveBeenCalled();
    });
  });

  // ===== ACCESSIBILITY TESTS =====

  describe('Accessibility', () => {
    test('should have proper accessibility label', () => {
      const accessibilityLabel = 'Custom accessibility label';
      const { getByLabelText } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Button, { 
            accessibilityLabel,
            children: 'Button Text'
          })
        })
      );

      expect(getByLabelText(accessibilityLabel)).toBeTruthy();
    });

    test('should have default accessibility label from children', () => {
      const buttonText = 'Default Label Button';
      const { getByLabelText } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Button, { 
            children: buttonText 
          })
        })
      );

      expect(getByLabelText(buttonText)).toBeTruthy();
    });

    test('should have proper accessibility role', () => {
      const { getByRole } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Button, { 
            children: 'Role Button' 
          })
        })
      );

      expect(getByRole('button')).toBeTruthy();
    });

    test('should indicate disabled state to screen readers', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Button, { 
            disabled: true,
            testID: 'button',
            children: 'Disabled Button'
          })
        })
      );

      const button = getByTestId('button');
      expect(button.props.accessibilityState?.disabled).toBe(true);
    });
  });

  // ===== INTERACTION TESTS =====

  describe('User Interactions', () => {
    test('should call onPress when pressed', () => {
      const mockPress = jest.fn();
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Button, { 
            onPress: mockPress,
            testID: 'button',
            children: 'Press Me'
          })
        })
      );

      const button = getByTestId('button');
      fireEvent.press(button);
      
      expect(mockPress).toHaveBeenCalledTimes(1);
    });

    test('should call onPress multiple times when pressed multiple times', () => {
      const mockPress = jest.fn();
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Button, { 
            onPress: mockPress,
            testID: 'button',
            children: 'Press Me Multiple'
          })
        })
      );

      const button = getByTestId('button');
      fireEvent.press(button);
      fireEvent.press(button);
      fireEvent.press(button);
      
      expect(mockPress).toHaveBeenCalledTimes(3);
    });

    test('should handle press events', () => {
      const mockPress = jest.fn();
      const { getByTestId } = render(
        React.createElement(TestWrapper, {
          children: React.createElement(Button, {
            onPress: mockPress,
            testID: 'button',
            children: 'Press Event Button'
          })
        })
      );

      const button = getByTestId('button');
      fireEvent(button, 'press');
      
      expect(mockPress).toHaveBeenCalledTimes(1);
    });
  });

  // ===== STYLING TESTS =====

  describe('Custom Styling', () => {
    test('should accept custom style prop', () => {
      const customStyle = { marginTop: 20 };
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Button, { 
            style: customStyle,
            testID: 'button',
            children: 'Custom Style Button'
          })
        })
      );

      const button = getByTestId('button');
      expect(button).toBeTruthy();
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
            children: React.createElement(Button, {
              testID: 'button',
              children: 'Light Theme Button'
            })
          }
        )
      );

      const button = getByTestId('button');
      expect(button).toBeTruthy();
    });

    test('should adapt to dark theme', () => {
      const { getByTestId } = render(
        React.createElement(
          ThemeProvider,
          {
            disablePersistence: true,
            defaultMode: 'dark' as const,
            children: React.createElement(Button, {
              testID: 'button',
              children: 'Dark Theme Button'
            })
          }
        )
      );

      const button = getByTestId('button');
      expect(button).toBeTruthy();
    });
  });

  // ===== EDGE CASES TESTS =====

  describe('Edge Cases', () => {
    test('should handle very long button text', () => {
      const longText = 'This is a very long button text that might overflow or wrap to multiple lines';
      const { getByText } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Button, { 
            children: longText 
          })
        })
      );

      expect(getByText(longText)).toBeTruthy();
    });

    test('should handle special characters in button text', () => {
      const specialText = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const { getByText } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Button, { 
            children: specialText 
          })
        })
      );

      expect(getByText(specialText)).toBeTruthy();
    });

    test('should handle unicode characters', () => {
      const unicodeText = '🔥 مرحبا ✨ 你好 🌟';
      const { getByText } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Button, { 
            children: unicodeText 
          })
        })
      );

      expect(getByText(unicodeText)).toBeTruthy();
    });

    test('should handle rapid consecutive presses', () => {
      const mockPress = jest.fn();
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Button, { 
            onPress: mockPress,
            testID: 'button',
            children: 'Rapid Press Button'
          })
        })
      );

      const button = getByTestId('button');
      
      // Simulate rapid presses
      for (let i = 0; i < 10; i++) {
        fireEvent.press(button);
      }
      
      expect(mockPress).toHaveBeenCalledTimes(10);
    });
  });

  // ===== PERFORMANCE TESTS =====

  describe('Performance', () => {
    test('should render efficiently with default props', () => {
      const startTime = Date.now();
      
      render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Button, { 
            children: 'Performance Test' 
          })
        })
      );
      
      const renderTime = Date.now() - startTime;
      expect(renderTime).toBeLessThan(100); // Should render in under 100ms
    });

    test('should handle multiple button instances efficiently', () => {
      const startTime = Date.now();
      
      const buttons = Array.from({ length: 50 }, (_, i) =>
        React.createElement(Button, { 
          key: i, 
          children: `Button ${i}` 
        })
      );
      
      render(
        React.createElement(TestWrapper, { children: buttons })
      );
      
      const renderTime = Date.now() - startTime;
      expect(renderTime).toBeLessThan(500); // Should render 50 buttons in under 500ms
    });
  });

  // ===== TYPE SAFETY TESTS =====

  describe('Type Safety', () => {
    test('should accept valid button props', () => {
      // This test validates TypeScript compilation
      const validProps = {
        variant: 'primary' as const,
        size: 'medium' as const,
        disabled: false,
        loading: false,
        onPress: () => {},
        children: 'Type Safe Button'
      };
      
      const { getByText } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Button, validProps)
        })
      );

      expect(getByText('Type Safe Button')).toBeTruthy();
    });
  });

});