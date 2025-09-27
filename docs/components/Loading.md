# Loading Component

A spinner component that shows loading state with consistent styling and design system integration.

## Overview

The Loading component provides a standardized way to indicate loading states throughout the application. It uses the native ActivityIndicator with design system styling, theme support, and accessibility features.

## Features

- 🎨 **Design System Integration**: Uses centralized design tokens for consistent styling
- 🌓 **Theme Support**: Automatically adapts to light and dark themes
- 📏 **Multiple Sizes**: Small, medium, and large size options
- 🎨 **Customizable Colors**: Support for custom spinner colors
- ♿ **Accessibility**: Full accessibility support with proper roles
- ⚡ **Performance**: Memoized for optimal performance

## Import

```tsx
import { Loading } from '@/components/design-system';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the loading spinner |
| `color` | `string` | `undefined` | Custom color for the spinner (defaults to theme-based color) |
| `style` | `ViewStyle` | `undefined` | Custom styles for the container |
| `testID` | `string` | `undefined` | Test identifier for testing |
| `accessibilityLabel` | `string` | `'Loading'` | Accessibility label for screen readers |

## Usage Examples

### Basic Loading Spinner

```tsx
import { Loading } from '@/components/design-system';

function LoadingScreen() {
  return (
    <Container centered>
      <Loading />
    </Container>
  );
}
```

### Small Loading Spinner

```tsx
function InlineLoading() {
  return (
    <Stack direction="horizontal" spacing="small">
      <Text>Processing...</Text>
      <Loading size="small" />
    </Stack>
  );
}
```

### Large Loading Spinner

```tsx
function ProminentLoading() {
  return (
    <Container centered>
      <Loading size="large" />
      <Text style={{ marginTop: 16 }}>Loading content...</Text>
    </Container>
  );
}
```

### Custom Colored Loading

```tsx
function CustomLoading() {
  return (
    <Container centered>
      <Loading
        size="large"
        color="#FF6B35"
      />
    </Container>
  );
}
```

### Button with Loading State

```tsx
function LoadingButton({ isLoading, onPress, title }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#007AFF',
        borderRadius: 8
      }}
    >
      {isLoading && <Loading size="small" color="#FFFFFF" />}
      <Text style={{ color: '#FFFFFF', marginLeft: isLoading ? 8 : 0 }}>
        {isLoading ? 'Loading...' : title}
      </Text>
    </TouchableOpacity>
  );
}
```

### Refresh Indicator

```tsx
function RefreshIndicator({ isRefreshing }) {
  return (
    <Stack direction="horizontal" spacing="small">
      <Loading size="small" />
      <Text>{isRefreshing ? 'Refreshing...' : 'Pull to refresh'}</Text>
    </Stack>
  );
}
```

## Size Options

### Small
- 20px spinner size
- Ideal for inline loading states
- Minimal visual impact

### Medium (Default)
- 30px spinner size
- Balanced size for most use cases
- Good for page-level loading

### Large
- 40px spinner size
- Prominent loading indicator
- Best for full-screen loading states

## Common Patterns

### Page Loading Pattern
```tsx
function PageLoading({ message = 'Loading...' }) {
  return (
    <Container centered style={{ flex: 1 }}>
      <Loading size="large" />
      <Text style={{ marginTop: 16, fontSize: 16, color: '#666' }}>
        {message}
      </Text>
    </Container>
  );
}
```

### Card Loading Pattern
```tsx
function CardLoading() {
  return (
    <Container
      size="narrow"
      padding="medium"
      style={{
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        alignItems: 'center'
      }}
    >
      <Loading size="medium" />
      <Text style={{ marginTop: 12, fontSize: 14, color: '#666' }}>
        Loading card content...
      </Text>
    </Container>
  );
}
```

### Inline Loading Pattern
```tsx
function InlineLoading({ isLoading, children }) {
  if (isLoading) {
    return (
      <Stack direction="horizontal" spacing="small">
        <Loading size="small" />
        <Text>Loading...</Text>
      </Stack>
    );
  }

  return children;
}
```

### Overlay Loading Pattern
```tsx
function OverlayLoading({ isVisible, children }) {
  return (
    <View style={{ position: 'relative' }}>
      {children}
      {isVisible && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Loading size="large" />
        </View>
      )}
    </View>
  );
}
```

## Accessibility

The Loading component includes accessibility features:

- **Progress Role**: Uses `progressbar` role for screen readers
- **Screen Reader Support**: Announces loading state to users
- **Reduced Motion**: Respects user's motion preferences

### Accessibility Props

```tsx
<Loading
  size="large"
  accessibilityLabel="Loading user data"
  testID="user-data-loading"
/>
```

## Theme Integration

The component automatically adapts to the current theme:

```tsx
import { useTheme } from '@/src/context/ThemeContext';

function ThemedLoading() {
  const { isDark } = useTheme();

  return (
    <Loading
      size="medium"
      color={isDark ? '#FFFFFF' : '#007AFF'}
    />
  );
}
```

## Performance

- **Memoization**: Component is wrapped with `React.memo` for optimal performance
- **Style Optimization**: Styles are computed once and memoized
- **Minimal Re-renders**: Only re-renders when props change
- **Native Performance**: Uses native ActivityIndicator for optimal performance

## Testing

```tsx
import { render } from '@testing-library/react-native';
import { Loading } from '@/components/design-system';

test('renders Loading component', () => {
  const { getByTestId } = render(
    <Loading testID="test-loading" />
  );

  expect(getByTestId('test-loading')).toBeTruthy();
});

test('applies different sizes correctly', () => {
  const { getByTestId } = render(
    <Loading size="large" testID="large-loading" />
  );

  const loading = getByTestId('large-loading');
  expect(loading.props.children.props.size).toBe('large');
});

test('applies custom color correctly', () => {
  const { getByTestId } = render(
    <Loading
      color="#FF6B35"
      testID="custom-color-loading"
    />
  );

  const loading = getByTestId('custom-color-loading');
  expect(loading.props.children.props.color).toBe('#FF6B35');
});

test('uses default color when no color is provided', () => {
  const { getByTestId } = render(
    <Loading testID="default-color-loading" />
  );

  const loading = getByTestId('default-color-loading');
  expect(loading.props.children.props.color).toBeDefined();
});
```

## Migration from Legacy Loading

### Before (Legacy)
```tsx
// Manual loading implementation with hard-coded styles
<View style={{
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20
}}>
  <ActivityIndicator
    size="large"
    color="#007AFF"
  />
  <Text style={{
    marginTop: 10,
    fontSize: 16,
    color: '#666'
  }}>
    Loading...
  </Text>
</View>
```

### After (Design System)
```tsx
// Uses design tokens and consistent styling
<Container centered>
  <Loading size="large" />
  <Text style={{ marginTop: 16 }}>Loading...</Text>
</Container>
```

## Best Practices

1. **Appropriate Sizes**: Use small for inline, medium for cards, large for full-screen
2. **Clear Context**: Provide context about what's loading when possible
3. **Accessibility**: Include accessibility labels for screen readers
4. **Performance**: Don't show loading for very fast operations (< 200ms)
5. **User Feedback**: Combine with text or Skeleton components for better UX
6. **Test IDs**: Include test IDs for automated testing

## Related Components

- [`Skeleton`](Skeleton.md) - Skeleton loading placeholder component
- [`Container`](Container.md) - Layout container component
- [`Modal`](Modal.md) - Modal and overlay component

## Advanced Usage

### Conditional Loading
```tsx
function ConditionalLoading({ isLoading, hasError, children }) {
  if (isLoading) {
    return (
      <Container centered>
        <Loading size="medium" />
        <Text style={{ marginTop: 12 }}>Loading data...</Text>
      </Container>
    );
  }

  if (hasError) {
    return (
      <Container centered>
        <Text style={{ color: '#EF4444' }}>Failed to load data</Text>
      </Container>
    );
  }

  return children;
}
```

### Loading with Progress
```tsx
function LoadingWithProgress({ progress }) {
  return (
    <Container centered>
      <Loading size="large" />
      <Text style={{ marginTop: 16 }}>
        Loading... {Math.round(progress)}%
      </Text>
    </Container>
  );
}
```

### Staggered Loading Animation
```tsx
function StaggeredLoading() {
  const [visibleItems, setVisibleItems] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleItems([1, 2, 3]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Stack spacing="medium">
      {[1, 2, 3].map((item) => (
        <Stack key={item} direction="horizontal" spacing="medium">
          {visibleItems.includes(item) ? (
            <Text>Item {item}</Text>
          ) : (
            <Loading size="small" />
          )}
        </Stack>
      ))}
    </Stack>
  );
}
```

## Platform Considerations

### iOS
- Uses smooth, native iOS spinner animation
- Consistent with iOS design guidelines
- Supports large indicator size

### Android
- Uses Material Design spinner
- Consistent with Android design guidelines
- Supports all size variants

## Animation

The Loading component uses the native ActivityIndicator which provides:

- **Smooth Animation**: Hardware-accelerated spinning animation
- **Consistent Speed**: Standardized animation timing
- **Reduced Motion**: Respects user's motion preferences
- **Performance**: Optimized for 60fps animation

## Color Guidelines

### Default Colors
- **Light Theme**: Primary brand color (#007AFF)
- **Dark Theme**: Light neutral color for visibility

### Custom Colors
- Use brand colors for primary loading states
- Use neutral colors for secondary loading states
- Ensure sufficient contrast for accessibility
- Consider color blindness when choosing colors