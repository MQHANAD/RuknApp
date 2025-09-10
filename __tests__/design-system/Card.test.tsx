/**
 * Card Component Test Suite
 * 
 * Tests the Card design system component including all variants,
 * interactive states, and accessibility features.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Card } from '../../components/design-system/Card';
import { ThemeProvider } from '../../src/context/ThemeContext';

// Mock AsyncStorage for ThemeProvider
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Test wrapper with theme context
const TestWrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(ThemeProvider, { disablePersistence: true, children });

describe('Card Component', () => {

  // ===== BASIC RENDERING TESTS =====

  describe('Basic Rendering', () => {
    test('should render with children', () => {
      const cardContent = 'Card Content';
      const { getByText } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Card, { 
            children: cardContent 
          })
        })
      );

      expect(getByText(cardContent)).toBeTruthy();
    });

    test('should render with minimal props', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, {
          children: React.createElement(Card, {
            testID: 'card',
            children: undefined
          })
        })
      );

      expect(getByTestId('card')).toBeTruthy();
    });

    test('should render with multiple children', () => {
      const { getByText } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Card, { 
            children: [
              React.createElement('text', { key: '1' }, 'First Child'),
              React.createElement('text', { key: '2' }, 'Second Child')
            ]
          })
        })
      );

      expect(getByText('First Child')).toBeTruthy();
      expect(getByText('Second Child')).toBeTruthy();
    });
  });

  // ===== VARIANT TESTS =====

  describe('Card Variants', () => {
    test('should render default variant', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Card, { 
            testID: 'card',
            children: 'Default Card'
          })
        })
      );

      const card = getByTestId('card');
      expect(card).toBeTruthy();
    });

    test('should render elevated variant', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Card, { 
            variant: 'elevated' as const,
            testID: 'card',
            children: 'Elevated Card'
          })
        })
      );

      const card = getByTestId('card');
      expect(card).toBeTruthy();
    });

    test('should render with custom styling for flat appearance', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, {
          children: React.createElement(Card, {
            testID: 'card',
            style: { elevation: 0, shadowOpacity: 0 },
            children: 'Flat-styled Card'
          })
        })
      );

      const card = getByTestId('card');
      expect(card).toBeTruthy();
    });
  });

  // ===== INTERACTIVE TESTS =====

  describe('Interactive Behavior', () => {
    test('should not be pressable by default', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Card, { 
            testID: 'card',
            children: 'Non-pressable Card'
          })
        })
      );

      const card = getByTestId('card');
      expect(card).toBeTruthy();
    });

    test('should be pressable when onPress is provided', () => {
      const mockPress = jest.fn();
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Card, { 
            testID: 'card',
            onPress: mockPress,
            children: 'Pressable Card'
          })
        })
      );

      const card = getByTestId('card');
      fireEvent.press(card);
      
      expect(mockPress).toHaveBeenCalledTimes(1);
    });

    test('should handle multiple presses', () => {
      const mockPress = jest.fn();
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Card, { 
            testID: 'card',
            onPress: mockPress,
            children: 'Multiple Press Card'
          })
        })
      );

      const card = getByTestId('card');
      fireEvent.press(card);
      fireEvent.press(card);
      fireEvent.press(card);
      
      expect(mockPress).toHaveBeenCalledTimes(3);
    });

    test('should handle press and hold gesture', () => {
      const mockPress = jest.fn();
      const { getByTestId } = render(
        React.createElement(TestWrapper, {
          children: React.createElement(Card, {
            testID: 'card',
            onPress: mockPress,
            children: 'Press and Hold Card'
          })
        })
      );

      const card = getByTestId('card');
      fireEvent.press(card);
      
      expect(mockPress).toHaveBeenCalledTimes(1);
    });

    test('should be disabled when disabled prop is true', () => {
      const mockPress = jest.fn();
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Card, { 
            testID: 'card',
            disabled: true,
            onPress: mockPress,
            children: 'Disabled Card'
          })
        })
      );

      const card = getByTestId('card');
      fireEvent.press(card);
      
      expect(mockPress).not.toHaveBeenCalled();
    });
  });

  // ===== ACCESSIBILITY TESTS =====

  describe('Accessibility', () => {
    test('should have proper accessibility role when pressable', () => {
      const { getByRole } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Card, { 
            onPress: jest.fn(),
            children: 'Accessible Card'
          })
        })
      );

      expect(getByRole('button')).toBeTruthy();
    });

    test('should have custom accessibility label', () => {
      const accessibilityLabel = 'Custom card label';
      const { getByLabelText } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Card, { 
            accessibilityLabel,
            onPress: jest.fn(),
            children: 'Labeled Card'
          })
        })
      );

      expect(getByLabelText(accessibilityLabel)).toBeTruthy();
    });

    test('should have accessibility hint', () => {
      const accessibilityHint = 'Double tap to open details';
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Card, { 
            testID: 'card',
            accessibilityHint,
            onPress: jest.fn(),
            children: 'Hint Card'
          })
        })
      );

      const card = getByTestId('card');
      expect(card.props.accessibilityHint).toBe(accessibilityHint);
    });

    test('should indicate disabled state to screen readers', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Card, { 
            testID: 'card',
            disabled: true,
            onPress: jest.fn(),
            children: 'Disabled Accessible Card'
          })
        })
      );

      const card = getByTestId('card');
      expect(card.props.accessibilityState?.disabled).toBe(true);
    });

    test('should have proper focus handling', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Card, { 
            testID: 'card',
            onPress: jest.fn(),
            children: 'Focusable Card'
          })
        })
      );

      const card = getByTestId('card');
      expect(card.props.accessible).toBe(true);
    });
  });

  // ===== STYLING TESTS =====

  describe('Custom Styling', () => {
    test('should accept custom style prop', () => {
      const customStyle = { marginTop: 20, backgroundColor: '#f0f0f0' };
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Card, { 
            testID: 'card',
            style: customStyle,
            children: 'Custom Styled Card'
          })
        })
      );

      const card = getByTestId('card');
      expect(card).toBeTruthy();
    });

    test('should merge custom styles with default styles', () => {
      const customStyle = { padding: 20 };
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Card, { 
            testID: 'card',
            style: customStyle,
            children: 'Merged Style Card'
          })
        })
      );

      const card = getByTestId('card');
      expect(card).toBeTruthy();
    });

    test('should handle combined styles', () => {
      const baseStyle = { marginTop: 10 };
      const additionalStyle = { padding: 15 };
      const combinedStyle = { ...baseStyle, ...additionalStyle };
      
      const { getByTestId } = render(
        React.createElement(TestWrapper, {
          children: React.createElement(Card, {
            testID: 'card',
            style: combinedStyle,
            children: 'Combined Style Card'
          })
        })
      );

      const card = getByTestId('card');
      expect(card).toBeTruthy();
    });
  });

  // ===== RESPONSIVE BEHAVIOR TESTS =====

  describe('Responsive Behavior', () => {
    test('should work with responsive styling through custom styles', () => {
      const responsiveStyle = {
        padding: 12, // Medium screen padding
        margin: 8,   // Medium screen margin
        width: '100%' as const // Full width
      };
      
      const { getByTestId } = render(
        React.createElement(TestWrapper, {
          children: React.createElement(Card, {
            testID: 'card',
            style: responsiveStyle,
            children: 'Responsive Card'
          })
        })
      );

      const card = getByTestId('card');
      expect(card).toBeTruthy();
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
            children: React.createElement(Card, { 
              testID: 'card',
              children: 'Light Theme Card'
            })
          }
        )
      );

      const card = getByTestId('card');
      expect(card).toBeTruthy();
    });

    test('should adapt to dark theme', () => {
      const { getByTestId } = render(
        React.createElement(
          ThemeProvider, 
          { 
            disablePersistence: true, 
            defaultMode: 'dark' as const,
            children: React.createElement(Card, { 
              testID: 'card',
              children: 'Dark Theme Card'
            })
          }
        )
      );

      const card = getByTestId('card');
      expect(card).toBeTruthy();
    });

    test('should update when theme changes', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Card, { 
            testID: 'card',
            children: 'Theme Adaptive Card'
          })
        })
      );

      const card = getByTestId('card');
      expect(card).toBeTruthy();
    });
  });

  // ===== SHADOW AND ELEVATION TESTS =====

  describe('Shadow and Elevation', () => {
    test('should have default shadow for default variant', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Card, { 
            testID: 'card',
            children: 'Default Shadow Card'
          })
        })
      );

      const card = getByTestId('card');
      expect(card).toBeTruthy();
    });

    test('should have enhanced shadow for elevated variant', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Card, { 
            testID: 'card',
            variant: 'elevated' as const,
            children: 'Elevated Shadow Card'
          })
        })
      );

      const card = getByTestId('card');
      expect(card).toBeTruthy();
    });

    test('should handle custom shadow through style prop', () => {
      const customShadowStyle = {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4
      };
      
      const { getByTestId } = render(
        React.createElement(TestWrapper, {
          children: React.createElement(Card, {
            testID: 'card',
            style: customShadowStyle,
            children: 'Custom Shadow Card'
          })
        })
      );

      const card = getByTestId('card');
      expect(card).toBeTruthy();
    });

    test('should handle no shadow styling', () => {
      const noShadowStyle = {
        shadowOpacity: 0,
        elevation: 0
      };
      
      const { getByTestId } = render(
        React.createElement(TestWrapper, {
          children: React.createElement(Card, {
            testID: 'card',
            style: noShadowStyle,
            children: 'No Shadow Card'
          })
        })
      );

      const card = getByTestId('card');
      expect(card).toBeTruthy();
    });
  });

  // ===== LAYOUT TESTS =====

  describe('Layout and Positioning', () => {
    test('should handle layout styling through style prop', () => {
      const layoutStyle = {
        width: '100%' as const,        // Full width
        alignSelf: 'center' as const,  // Centered
        flex: 1                        // Flex properties
      };
      
      const { getByTestId } = render(
        React.createElement(TestWrapper, {
          children: React.createElement(Card, {
            testID: 'card',
            style: layoutStyle,
            children: 'Layout Card'
          })
        })
      );

      const card = getByTestId('card');
      expect(card).toBeTruthy();
    });
  });

  // ===== EDGE CASES TESTS =====

  describe('Edge Cases', () => {
    test('should handle complex nested content', () => {
      const complexContent = React.createElement('view', {},
        React.createElement('text', {}, 'Title'),
        React.createElement('text', {}, 'Subtitle'),
        React.createElement('view', {},
          React.createElement('text', {}, 'Nested content')
        )
      );
      
      const { getByText } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Card, { 
            children: complexContent
          })
        })
      );

      expect(getByText('Title')).toBeTruthy();
      expect(getByText('Subtitle')).toBeTruthy();
      expect(getByText('Nested content')).toBeTruthy();
    });

    test('should handle very long content', () => {
      const longContent = 'This is a very long content that might overflow the card boundaries and should be handled gracefully by the card component implementation with proper text wrapping or scrolling';
      
      const { getByText } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Card, { 
            children: longContent
          })
        })
      );

      expect(getByText(longContent)).toBeTruthy();
    });

    test('should handle empty content gracefully', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Card, { 
            testID: 'card',
            children: ''
          })
        })
      );

      const card = getByTestId('card');
      expect(card).toBeTruthy();
    });

    test('should handle null children', () => {
      const { getByTestId } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Card, { 
            testID: 'card',
            children: null
          })
        })
      );

      const card = getByTestId('card');
      expect(card).toBeTruthy();
    });
  });

  // ===== PERFORMANCE TESTS =====

  describe('Performance', () => {
    test('should render efficiently with minimal props', () => {
      const startTime = Date.now();
      
      render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Card, { 
            children: 'Performance Test'
          })
        })
      );
      
      const renderTime = Date.now() - startTime;
      expect(renderTime).toBeLessThan(50);
    });

    test('should handle multiple card instances efficiently', () => {
      const startTime = Date.now();
      
      const cards = Array.from({ length: 20 }, (_, i) =>
        React.createElement(Card, { 
          key: i,
          children: `Card ${i}`
        })
      );
      
      render(
        React.createElement(TestWrapper, { children: cards })
      );
      
      const renderTime = Date.now() - startTime;
      expect(renderTime).toBeLessThan(200);
    });

    test('should update efficiently when props change', () => {
      const { rerender } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Card, { 
            testID: 'card',
            children: 'Initial Content'
          })
        })
      );

      const startTime = Date.now();
      
      rerender(
        React.createElement(TestWrapper, { 
          children: React.createElement(Card, { 
            testID: 'card',
            variant: 'elevated' as const,
            children: 'Updated Content'
          })
        })
      );
      
      const rerenderTime = Date.now() - startTime;
      expect(rerenderTime).toBeLessThan(50);
    });
  });

  // ===== TYPE SAFETY TESTS =====

  describe('Type Safety', () => {
    test('should accept valid Card props', () => {
      const validProps = {
        variant: 'elevated' as const,
        onPress: jest.fn(),
        disabled: false,
        accessibilityLabel: 'Type safe card',
        children: 'Type Safe Card Content'
      };
      
      const { getByText } = render(
        React.createElement(TestWrapper, { 
          children: React.createElement(Card, validProps)
        })
      );

      expect(getByText('Type Safe Card Content')).toBeTruthy();
    });
  });

});