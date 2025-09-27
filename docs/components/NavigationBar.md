# NavigationBar Component

A flexible top navigation bar component with design system integration, supporting titles, actions, and accessibility features.

## Overview

The NavigationBar component provides a consistent navigation header experience across the application. It supports titles, left and right actions, back button functionality, theme switching, RTL layouts, and comprehensive accessibility features.

## Features

- 🎨 **Design System Integration**: Uses centralized design tokens for consistent styling
- 🌓 **Theme Support**: Automatically adapts to light and dark themes
- 🌍 **RTL Support**: Properly handles right-to-left layouts for Arabic
- ♿ **Accessibility**: Full accessibility support with proper labels and roles
- ⚡ **Performance**: Memoized for optimal performance
- 🎯 **Customizable**: Extensive customization options for layout and behavior
- 🔙 **Back Navigation**: Built-in back button support

## Import

```tsx
import { NavigationBar } from '@/components/design-system';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `undefined` | Navigation bar title text |
| `leftAction` | `NavigationBarAction` | `undefined` | Single action button on the left side |
| `rightActions` | `NavigationBarAction[]` | `[]` | Array of action buttons on the right side |
| `style` | `ViewStyle` | `undefined` | Custom styles for the container |
| `titleStyle` | `TextStyle` | `undefined` | Custom styles for the title text |
| `backgroundColor` | `string` | `undefined` | Custom background color |
| `height` | `number` | `undefined` | Custom height for the navigation bar |
| `showBackButton` | `boolean` | `false` | Whether to show the default back button |
| `onBackPress` | `() => void` | `undefined` | Callback when back button is pressed |
| `testID` | `string` | `undefined` | Test identifier for testing |
| `accessibilityLabel` | `string` | `undefined` | Accessibility label for screen readers |

## NavigationBarAction Interface

```tsx
interface NavigationBarAction {
  key: string;                    // Unique identifier for the action
  title: string;                  // Display title (shown if no icon)
  icon?: ImageSourcePropType;     // Optional icon image source
  onPress: () => void;            // Callback when action is pressed
  accessibilityLabel?: string;    // Custom accessibility label
  disabled?: boolean;             // Whether the action is disabled
}
```

## Usage Examples

### Basic NavigationBar with Title

```tsx
import { NavigationBar } from '@/components/design-system';

function Header() {
  return (
    <NavigationBar
      title="Home Screen"
      testID="home-header"
      accessibilityLabel="Home screen navigation"
    />
  );
}
```

### NavigationBar with Back Button

```tsx
function DetailScreen({ navigation }) {
  return (
    <NavigationBar
      title="Details"
      showBackButton={true}
      onBackPress={() => navigation.goBack()}
      testID="detail-header"
    />
  );
}
```

### NavigationBar with Actions

```tsx
const rightActions = [
  {
    key: 'search',
    title: 'Search',
    icon: require('@/assets/icons/search.png'),
    onPress: () => console.log('Search pressed'),
    accessibilityLabel: 'Search button'
  },
  {
    key: 'share',
    title: 'Share',
    icon: require('@/assets/icons/share.png'),
    onPress: () => console.log('Share pressed'),
    accessibilityLabel: 'Share button'
  }
];

const leftAction = {
  key: 'menu',
  title: 'Menu',
  icon: require('@/assets/icons/menu.png'),
  onPress: () => console.log('Menu pressed'),
  accessibilityLabel: 'Menu button'
};

function ActionHeader() {
  return (
    <NavigationBar
      title="Actions Example"
      leftAction={leftAction}
      rightActions={rightActions}
      testID="action-header"
    />
  );
}
```

### NavigationBar with Custom Styling

```tsx
<NavigationBar
  title="Custom Header"
  backgroundColor="#F8F9FA"
  height={60}
  titleStyle={{
    fontSize: 18,
    fontWeight: '600',
    color: '#333333'
  }}
  style={{
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5'
  }}
/>
```

### Transparent NavigationBar

```tsx
<NavigationBar
  title="Transparent Header"
  variant="transparent"
  titleStyle={{
    color: '#FFFFFF',
    fontWeight: '600'
  }}
  style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100
  }}
/>
```

### With React Navigation Integration

```tsx
import { useNavigation } from '@react-navigation/native';

function CustomHeader({ options }) {
  const navigation = useNavigation();

  const headerRight = () => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Settings')}
      style={{ marginRight: 16 }}
    >
      <Image
        source={require('@/assets/icons/settings.png')}
        style={{ width: 24, height: 24 }}
      />
    </TouchableOpacity>
  );

  return (
    <NavigationBar
      title={options.title}
      showBackButton={true}
      onBackPress={() => navigation.goBack()}
      rightActions={[
        {
          key: 'settings',
          title: 'Settings',
          icon: require('@/assets/icons/settings.png'),
          onPress: () => navigation.navigate('Settings')
        }
      ]}
    />
  );
}
```

## Layout Structure

The NavigationBar uses a three-section layout:

```
┌─────────────────────────────────────────┐
│ ←    Title Text          Action Action  │
│ Back               [Right Actions]      │
└─────────────────────────────────────────┘
   ↑                   ↑              ↑
   Left           Center          Right
   Container      Container       Container
```

### Left Container
- Back button (when `showBackButton` or `onBackPress` is provided)
- Single left action (when `leftAction` is provided)

### Center Container
- Title text (when `title` is provided)
- Centered horizontally

### Right Container
- Array of right actions (when `rightActions` is provided)
- Right-aligned

## States

### Default State
- Standard navigation bar styling
- All interactive elements enabled

### Transparent State
- Transparent background
- No border
- Ideal for overlaying on content

### With Back Button
- Shows back arrow icon
- Automatically flips for RTL layouts
- Handles back navigation

### With Actions
- Shows action buttons with icons or text
- Supports disabled state for individual actions

## Accessibility

The NavigationBar component includes comprehensive accessibility features:

- **Screen Reader Support**: Proper accessibility labels and roles
- **Navigation Role**: Uses `navigation` role for the container
- **Button Roles**: Each action uses `button` role
- **Back Button**: Includes "Go back" accessibility label
- **Focus Management**: Visible focus indicators
- **High Contrast**: Supports high contrast mode

### Accessibility Props

```tsx
<NavigationBar
  title="Settings"
  accessibilityLabel="Settings screen navigation"
  testID="settings-navigation"
  rightActions={[
    {
      key: 'save',
      title: 'Save',
      onPress: handleSave,
      accessibilityLabel: 'Save changes button'
    }
  ]}
/>
```

## Theme Integration

The component automatically adapts to the current theme:

```tsx
import { useTheme } from '@/src/context/ThemeContext';

function ThemedNavigationBar() {
  const { isDark } = useTheme();

  return (
    <NavigationBar
      title="Themed Header"
      backgroundColor={isDark ? colors.neutral[900] : colors.neutral[0]}
      titleStyle={{
        color: isDark ? colors.neutral[50] : colors.neutral[900]
      }}
    />
  );
}
```

## RTL Support

The component automatically handles RTL layouts:

```tsx
import { useRTL } from '@/src/hooks/useRTL';

function RTLNavigationBar() {
  const { isRTL } = useRTL();

  return (
    <NavigationBar
      title="RTL Header"
      showBackButton={true}
      onBackPress={() => console.log('Back pressed')}
      // Back button automatically flips for RTL
      // Layout direction automatically adjusts
    />
  );
}
```

## Performance

- **Memoization**: Component is wrapped with `React.memo` for optimal performance
- **Style Optimization**: Styles are computed once and memoized
- **Minimal Re-renders**: Only re-renders when props change
- **Efficient Actions**: Actions are rendered efficiently with proper key props

## Testing

```tsx
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationBar } from '@/components/design-system';

const mockActions = [
  {
    key: 'search',
    title: 'Search',
    icon: require('@/assets/icons/search.png'),
    onPress: jest.fn()
  }
];

test('renders NavigationBar with title', () => {
  const { getByTestId, getByText } = render(
    <NavigationBar
      title="Test Title"
      testID="nav-bar"
    />
  );

  expect(getByTestId('nav-bar')).toBeTruthy();
  expect(getByText('Test Title')).toBeTruthy();
  expect(getByTestId('nav-bar-title')).toBeTruthy();
});

test('calls action onPress when action is pressed', () => {
  const { getByTestId } = render(
    <NavigationBar
      title="Test"
      rightActions={mockActions}
      testID="nav-bar"
    />
  );

  fireEvent.press(getByTestId('nav-bar-action-search'));
  expect(mockActions[0].onPress).toHaveBeenCalled();
});

test('calls onBackPress when back button is pressed', () => {
  const mockOnBackPress = jest.fn();
  const { getByTestId } = render(
    <NavigationBar
      title="Test"
      showBackButton={true}
      onBackPress={mockOnBackPress}
      testID="nav-bar"
    />
  );

  fireEvent.press(getByTestId('nav-bar-back-button'));
  expect(mockOnBackPress).toHaveBeenCalled();
});
```

## Migration from Legacy NavigationBar

### Before (Legacy)
```tsx
// Hard-coded styles and manual layout
<View style={{
  backgroundColor: '#FFFFFF',
  height: 60,
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 16,
  borderBottomWidth: 1,
  borderBottomColor: '#E5E5E5'
}}>
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <Image source={require('@/assets/icons/arrowLeft.png')} />
  </TouchableOpacity>

  <Text style={{
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600'
  }}>
    Title
  </Text>

  <TouchableOpacity>
    <Image source={require('@/assets/icons/search.png')} />
  </TouchableOpacity>
</View>
```

### After (Design System)
```tsx
// Uses design tokens and centralized styling
<NavigationBar
  title="Title"
  showBackButton={true}
  onBackPress={() => navigation.goBack()}
  rightActions={[
    {
      key: 'search',
      title: 'Search',
      icon: require('@/assets/icons/search.png'),
      onPress: handleSearch
    }
  ]}
  // Automatically handles themes, RTL, and accessibility
/>
```

## Best Practices

1. **Consistent Heights**: Use standard heights (44-60pt) for consistent touch targets
2. **Meaningful Actions**: Use clear, descriptive icons and labels for actions
3. **Accessibility Labels**: Always provide accessibility labels for actions
4. **Back Button**: Use `showBackButton` or `onBackPress` for navigation
5. **Action Limits**: Limit right actions to 2-3 items to avoid clutter
6. **Test IDs**: Include test IDs for automated testing
7. **RTL Considerations**: Test layouts in both LTR and RTL modes

## Related Components

- [`TabBar`](TabBar.md) - Bottom tab navigation component
- [`Container`](Container.md) - Layout container component
- [`Modal`](Modal.md) - Modal and overlay component

## Common Patterns

### Screen Header Pattern
```tsx
function ScreenHeader({ title, showBack = false, actions = [] }) {
  return (
    <NavigationBar
      title={title}
      showBackButton={showBack}
      onBackPress={() => navigation.goBack()}
      rightActions={actions}
    />
  );
}
```

### Action Button Pattern
```tsx
function HeaderAction({ icon, onPress, accessibilityLabel }) {
  return {
    key: accessibilityLabel.toLowerCase().replace(' ', '-'),
    title: accessibilityLabel,
    icon,
    onPress,
    accessibilityLabel
  };
}