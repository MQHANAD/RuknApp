# TabBar Component

A flexible bottom tab navigation component with design system integration, supporting icons, labels, and accessibility features.

## Overview

The TabBar component provides a consistent navigation experience across the application. It supports both icon-only and icon-with-label configurations, theme switching, RTL layouts, and comprehensive accessibility features.

## Features

- 🎨 **Design System Integration**: Uses centralized design tokens for consistent styling
- 🌓 **Theme Support**: Automatically adapts to light and dark themes
- 🌍 **RTL Support**: Properly handles right-to-left layouts for Arabic
- ♿ **Accessibility**: Full accessibility support with proper labels and roles
- ⚡ **Performance**: Memoized for optimal performance
- 🎯 **Customizable**: Extensive customization options for colors, styles, and behavior

## Import

```tsx
import { TabBar } from '@/components/design-system';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `TabItem[]` | **Required** | Array of tab items to display |
| `activeTab` | `string` | **Required** | Currently active tab key |
| `onTabPress` | `(tabKey: string) => void` | **Required** | Callback when tab is pressed |
| `style` | `ViewStyle` | `undefined` | Custom styles for the container |
| `tabStyle` | `ViewStyle` | `undefined` | Custom styles for individual tabs |
| `labelStyle` | `TextStyle` | `undefined` | Custom styles for tab labels |
| `activeTintColor` | `string` | `colors.primary[500]` | Color for active tab icons and labels |
| `inactiveTintColor` | `string` | Theme-based | Color for inactive tab icons and labels |
| `backgroundColor` | `string` | `undefined` | Custom background color |
| `height` | `number` | `undefined` | Custom height for the tab bar |
| `showLabels` | `boolean` | `true` | Whether to show tab labels |
| `testID` | `string` | `undefined` | Test identifier for testing |
| `accessibilityLabel` | `string` | `undefined` | Accessibility label for screen readers |

## TabItem Interface

```tsx
interface TabItem {
  key: string;                    // Unique identifier for the tab
  title: string;                  // Display title for the tab
  icon: ImageSourcePropType;      // Icon image source
  focusedIcon?: ImageSourcePropType; // Optional different icon for active state
  accessibilityLabel?: string;    // Custom accessibility label
}
```

## Usage Examples

### Basic TabBar

```tsx
import { TabBar } from '@/components/design-system';

const tabs = [
  {
    key: 'home',
    title: 'Home',
    icon: require('@/assets/icons/home.png'),
    accessibilityLabel: 'Home tab'
  },
  {
    key: 'profile',
    title: 'Profile',
    icon: require('@/assets/icons/user.png'),
    accessibilityLabel: 'Profile tab'
  },
  {
    key: 'settings',
    title: 'Settings',
    icon: require('@/assets/icons/settings.png'),
    accessibilityLabel: 'Settings tab'
  }
];

function BottomNavigation() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <TabBar
      tabs={tabs}
      activeTab={activeTab}
      onTabPress={setActiveTab}
      showLabels={true}
      testID="main-navigation"
    />
  );
}
```

### Icon-only TabBar

```tsx
<TabBar
  tabs={tabs}
  activeTab={activeTab}
  onTabPress={setActiveTab}
  showLabels={false}
  height={60}
/>
```

### Custom Styled TabBar

```tsx
<TabBar
  tabs={tabs}
  activeTab={activeTab}
  onTabPress={setActiveTab}
  activeTintColor="#FF6B35"
  inactiveTintColor="#8E8E93"
  backgroundColor="#FFFFFF"
  style={{ borderTopWidth: 1, borderTopColor: '#E5E5E5' }}
  labelStyle={{ fontSize: 10, fontWeight: '600' }}
/>
```

### With React Navigation Integration

```tsx
import { TabBar } from '@/components/design-system';

function CustomTabBar({ state, descriptors, navigation }) {
  const activeTab = state.routes[state.index].name;

  return (
    <TabBar
      tabs={state.routes.map((route) => ({
        key: route.name,
        title: descriptors[route.key].options.title || route.name,
        icon: descriptors[route.key].options.tabBarIcon,
        accessibilityLabel: descriptors[route.key].options.accessibilityLabel,
      }))}
      activeTab={activeTab}
      onTabPress={(tabKey) => {
        const index = state.routes.findIndex(route => route.name === tabKey);
        if (index !== -1) {
          navigation.navigate(state.routes[index]);
        }
      }}
    />
  );
}
```

## States

### Active State
- Tab background changes to indicate selection
- Icon and label use `activeTintColor`
- Accessibility state shows `selected: true`

### Inactive State
- Default tab styling
- Icon and label use `inactiveTintColor`
- Accessibility state shows `selected: false`

### Disabled State
- Tabs can be disabled by not including them in the `tabs` array
- No interaction feedback when pressed

## Accessibility

The TabBar component includes comprehensive accessibility features:

- **Screen Reader Support**: Proper accessibility labels and roles
- **Keyboard Navigation**: Supports keyboard navigation
- **Focus Management**: Visible focus indicators
- **ARIA Support**: Proper ARIA attributes for tablist and tabs
- **High Contrast**: Supports high contrast mode
- **Reduced Motion**: Respects user's motion preferences

### Accessibility Props

```tsx
<TabBar
  tabs={tabs}
  activeTab={activeTab}
  onTabPress={setActiveTab}
  accessibilityLabel="Main navigation"
  testID="main-navigation"
/>
```

## Theme Integration

The component automatically adapts to the current theme:

```tsx
import { useTheme } from '@/src/context/ThemeContext';

function ThemedTabBar() {
  const { isDark } = useTheme();

  return (
    <TabBar
      tabs={tabs}
      activeTab={activeTab}
      onTabPress={setActiveTab}
      // Colors automatically adapt based on theme
    />
  );
}
```

## RTL Support

The component automatically handles RTL layouts:

```tsx
import { useRTL } from '@/src/hooks/useRTL';

function RTLTabBar() {
  const { isRTL } = useRTL();

  return (
    <TabBar
      tabs={tabs}
      activeTab={activeTab}
      onTabPress={setActiveTab}
      // Layout automatically flips for RTL
    />
  );
}
```

## Performance

- **Memoization**: Component is wrapped with `React.memo` for optimal performance
- **Style Optimization**: Styles are computed once and memoized
- **Minimal Re-renders**: Only re-renders when props change

## Testing

```tsx
import { render, fireEvent } from '@testing-library/react-native';
import { TabBar } from '@/components/design-system';

const mockTabs = [
  { key: 'home', title: 'Home', icon: require('@/assets/icons/home.png') },
  { key: 'profile', title: 'Profile', icon: require('@/assets/icons/user.png') },
];

test('renders TabBar with tabs', () => {
  const mockOnTabPress = jest.fn();
  const { getByTestId } = render(
    <TabBar
      tabs={mockTabs}
      activeTab="home"
      onTabPress={mockOnTabPress}
      testID="tab-bar"
    />
  );

  expect(getByTestId('tab-bar')).toBeTruthy();
  expect(getByTestId('tab-bar-tab-0')).toBeTruthy();
  expect(getByTestId('tab-bar-tab-1')).toBeTruthy();
});

test('calls onTabPress when tab is pressed', () => {
  const mockOnTabPress = jest.fn();
  const { getByTestId } = render(
    <TabBar
      tabs={mockTabs}
      activeTab="home"
      onTabPress={mockOnTabPress}
      testID="tab-bar"
    />
  );

  fireEvent.press(getByTestId('tab-bar-tab-1'));
  expect(mockOnTabPress).toHaveBeenCalledWith('profile');
});
```

## Migration from Legacy TabBar

### Before (Legacy)
```tsx
// Hard-coded styles and colors
<View style={{
  backgroundColor: '#FFFFFF',
  borderTopWidth: 1,
  borderTopColor: '#E5E5E5',
  height: 80,
}}>
  <TouchableOpacity style={styles.tab}>
    <Image source={icon} style={{ tintColor: isActive ? '#007AFF' : '#8E8E93' }} />
    <Text style={{ color: isActive ? '#007AFF' : '#8E8E93' }}>Tab</Text>
  </TouchableOpacity>
</View>
```

### After (Design System)
```tsx
// Uses design tokens and centralized styling
<TabBar
  tabs={tabs}
  activeTab={activeTab}
  onTabPress={setActiveTab}
  // Automatically handles themes, RTL, and accessibility
/>
```

## Best Practices

1. **Consistent Tab Items**: Use the same structure for all tab items
2. **Meaningful Icons**: Choose icons that clearly represent the tab's purpose
3. **Accessibility Labels**: Always provide accessibility labels for screen readers
4. **Test IDs**: Include test IDs for automated testing
5. **Icon Sizing**: Use consistent icon sizes across all tabs
6. **Label Length**: Keep tab labels short (1-2 words maximum)

## Related Components

- [`NavigationBar`](NavigationBar.md) - Top navigation bar component
- [`Container`](Container.md) - Layout container component
- [`Stack`](Stack.md) - Stacking layout component