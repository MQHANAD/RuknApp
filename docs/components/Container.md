# Container Component

A flexible layout container component with design system integration, providing consistent sizing, padding, and centering options.

## Overview

The Container component provides a foundational layout element that ensures consistent spacing, sizing, and alignment across the application. It supports different sizes, padding options, and centering, making it ideal for creating uniform screen layouts.

## Features

- 🎨 **Design System Integration**: Uses centralized design tokens for consistent styling
- 🌓 **Theme Support**: Automatically adapts to light and dark themes
- 📏 **Flexible Sizing**: Multiple size options (narrow, wide, full)
- 📐 **Padding Control**: Various padding presets (none, small, medium, large)
- 🎯 **Centering**: Built-in centering support for content
- ♿ **Accessibility**: Full accessibility support with proper labels
- ⚡ **Performance**: Memoized for optimal performance

## Import

```tsx
import { Container } from '@/components/design-system';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | **Required** | Content to be rendered inside the container |
| `size` | `'narrow' \| 'wide' \| 'full'` | `'full'` | Container width sizing |
| `padding` | `'none' \| 'small' \| 'medium' \| 'large'` | `'medium'` | Container padding |
| `centered` | `boolean` | `false` | Whether to center content within the container |
| `style` | `ViewStyle` | `undefined` | Custom styles for the container |
| `testID` | `string` | `undefined` | Test identifier for testing |
| `accessibilityLabel` | `string` | `undefined` | Accessibility label for screen readers |

## Usage Examples

### Basic Container

```tsx
import { Container } from '@/components/design-system';

function MyScreen() {
  return (
    <Container>
      <Text>Basic container content</Text>
    </Container>
  );
}
```

### Full Width Container with Medium Padding

```tsx
<Container size="full" padding="medium">
  <Text>This container takes full width with medium padding</Text>
</Container>
```

### Narrow Container with Centered Content

```tsx
<Container size="narrow" centered>
  <Text>This content is centered in a narrow container</Text>
</Container>
```

### Wide Container with Large Padding

```tsx
<Container size="wide" padding="large">
  <Text>Wide container with large padding</Text>
</Container>
```

### Container without Padding

```tsx
<Container padding="none">
  <Text>No padding around this content</Text>
</Container>
```

### Custom Styled Container

```tsx
<Container
  size="full"
  padding="medium"
  style={{
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginVertical: 16
  }}
>
  <Text>Container with custom background and border radius</Text>
</Container>
```

### Screen Layout Pattern

```tsx
function ScreenLayout({ children, title }) {
  return (
    <Container size="full" padding="medium">
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        {title}
      </Text>
      {children}
    </Container>
  );
}

// Usage
<ScreenLayout title="Settings">
  <SettingsContent />
</ScreenLayout>
```

### Card-like Container

```tsx
<Container
  size="narrow"
  padding="large"
  centered
  style={{
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  }}
>
  <Text>Card-like container with shadow</Text>
</Container>
```

## Size Options

### Full Size
- Takes the full available width
- Ideal for screen-level containers
- Default size option

### Wide Size
- Takes a wide but not full width
- Good for content that shouldn't span edge-to-edge
- Useful for readable text content

### Narrow Size
- Takes a narrow width
- Perfect for forms, cards, or focused content
- Centers content for better readability

## Padding Options

### None
- No horizontal padding
- Content extends to container edges
- Use when you need full control over spacing

### Small
- 12px horizontal padding
- Tight spacing for compact layouts

### Medium (Default)
- 16px horizontal padding
- Standard spacing for most use cases

### Large
- 24px horizontal padding
- Generous spacing for important content

## Centering

When `centered={true}`, the container:
- Centers content both horizontally and vertically
- Uses flexbox properties for alignment
- Ideal for modals, empty states, or featured content

## Accessibility

The Container component includes accessibility features:

- **Screen Reader Support**: Accepts accessibility labels
- **Focus Management**: Properly handles focus within contained elements
- **Semantic Structure**: Maintains proper heading and content hierarchy

### Accessibility Props

```tsx
<Container
  accessibilityLabel="Main content area"
  testID="main-container"
>
  <Text>Accessible content</Text>
</Container>
```

## Theme Integration

The component automatically adapts to the current theme:

```tsx
import { useTheme } from '@/src/context/ThemeContext';

function ThemedContainer() {
  const { isDark } = useTheme();

  return (
    <Container
      style={{
        backgroundColor: isDark ? colors.neutral[900] : colors.neutral[0]
      }}
    >
      <Text>Theme-aware container</Text>
    </Container>
  );
}
```

## Performance

- **Memoization**: Component is wrapped with `React.memo` for optimal performance
- **Style Optimization**: Styles are computed once and memoized
- **Minimal Re-renders**: Only re-renders when props change

## Testing

```tsx
import { render } from '@testing-library/react-native';
import { Container } from '@/components/design-system';

test('renders Container with children', () => {
  const { getByTestId, getByText } = render(
    <Container testID="test-container">
      <Text>Test Content</Text>
    </Container>
  );

  expect(getByTestId('test-container')).toBeTruthy();
  expect(getByText('Test Content')).toBeTruthy();
});

test('applies custom styles', () => {
  const customStyle = { backgroundColor: 'red' };
  const { getByTestId } = render(
    <Container testID="styled-container" style={customStyle}>
      <Text>Styled Container</Text>
    </Container>
  );

  const container = getByTestId('styled-container');
  expect(container.props.style).toEqual(
    expect.arrayContaining([expect.objectContaining(customStyle)])
  );
});

test('centers content when centered prop is true', () => {
  const { getByTestId } = render(
    <Container testID="centered-container" centered>
      <Text>Centered Content</Text>
    </Container>
  );

  const container = getByTestId('centered-container');
  expect(container.props.style).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        justifyContent: 'center',
        alignItems: 'center'
      })
    ])
  );
});
```

## Migration from Legacy Container

### Before (Legacy)
```tsx
// Hard-coded styles and inconsistent spacing
<View style={{
  paddingHorizontal: 16,
  width: '100%',
  alignItems: 'center'
}}>
  <Text>Content</Text>
</View>
```

### After (Design System)
```tsx
// Uses design tokens and consistent spacing
<Container size="full" padding="medium" centered>
  <Text>Content</Text>
</Container>
```

## Best Practices

1. **Consistent Sizing**: Use the same size options across similar screens
2. **Padding Standards**: Stick to the predefined padding options for consistency
3. **Centering**: Use the `centered` prop instead of custom flex styles
4. **Custom Styles**: Only add custom styles when necessary to avoid breaking design system consistency
5. **Test IDs**: Include test IDs for automated testing
6. **Accessibility**: Provide meaningful accessibility labels for screen readers

## Common Patterns

### Screen Container Pattern
```tsx
function ScreenContainer({ children, noPadding = false }) {
  return (
    <Container
      size="full"
      padding={noPadding ? 'none' : 'medium'}
      testID="screen-container"
    >
      {children}
    </Container>
  );
}
```

### Content Section Pattern
```tsx
function ContentSection({ title, children }) {
  return (
    <Container size="full" padding="medium" style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>
        {title}
      </Text>
      {children}
    </Container>
  );
}
```

### Form Container Pattern
```tsx
function FormContainer({ children }) {
  return (
    <Container size="narrow" padding="large" centered>
      {children}
    </Container>
  );
}
```

## Related Components

- [`Stack`](Stack.md) - Vertical and horizontal stacking component
- [`Grid`](Grid.md) - Grid layout system component
- [`Modal`](Modal.md) - Modal and overlay component

## Responsive Behavior

The Container component works well with responsive design:

- **Mobile**: Full width containers work best on small screens
- **Tablet**: Wide containers provide good balance
- **Desktop**: Narrow containers prevent content from becoming too wide

```tsx
// Responsive container that adapts to screen size
function ResponsiveContainer({ children }) {
  const { width } = useWindowDimensions();

  const size = width > 768 ? 'wide' : 'full';

  return (
    <Container size={size} padding="medium">
      {children}
    </Container>
  );
}