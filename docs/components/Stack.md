# Stack Component

A flexible layout component that provides consistent spacing between children in vertical or horizontal arrangements.

## Overview

The Stack component is a fundamental layout primitive that arranges children with consistent spacing. It supports both vertical and horizontal layouts with predefined spacing options, making it easy to create uniform layouts throughout the application.

## Features

- 🎨 **Design System Integration**: Uses centralized design tokens for consistent spacing
- 🌓 **Theme Support**: Automatically adapts to light and dark themes
- 📐 **Flexible Direction**: Supports both vertical and horizontal layouts
- 📏 **Spacing Control**: Multiple predefined spacing options
- 🎯 **Consistent Layout**: Ensures uniform spacing between elements
- ♿ **Accessibility**: Full accessibility support with proper labels
- ⚡ **Performance**: Memoized for optimal performance

## Import

```tsx
import { Stack } from '@/components/design-system';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | **Required** | Elements to be arranged in the stack |
| `spacing` | `'none' \| 'tight' \| 'snug' \| 'small' \| 'medium' \| 'large' \| 'xl'` | `'medium'` | Spacing between stack items |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout direction of the stack |
| `style` | `ViewStyle` | `undefined` | Custom styles for the container |
| `testID` | `string` | `undefined` | Test identifier for testing |
| `accessibilityLabel` | `string` | `undefined` | Accessibility label for screen readers |

## Usage Examples

### Vertical Stack (Default)

```tsx
import { Stack } from '@/components/design-system';

function VerticalList() {
  return (
    <Stack spacing="medium">
      <Text>Item 1</Text>
      <Text>Item 2</Text>
      <Text>Item 3</Text>
    </Stack>
  );
}
```

### Horizontal Stack

```tsx
<Stack direction="horizontal" spacing="small">
  <Text>Item 1</Text>
  <Text>Item 2</Text>
  <Text>Item 3</Text>
</Stack>
```

### Button Group

```tsx
<Stack direction="horizontal" spacing="small">
  <Button title="Cancel" variant="secondary" />
  <Button title="Save" variant="primary" />
</Stack>
```

### Form Fields Stack

```tsx
<Stack spacing="medium">
  <TextInput placeholder="First Name" />
  <TextInput placeholder="Last Name" />
  <TextInput placeholder="Email" />
  <Button title="Submit" />
</Stack>
```

### Icon with Text Stack

```tsx
<Stack direction="horizontal" spacing="small">
  <Image source={require('@/assets/icons/user.png')} />
  <Text>User Profile</Text>
</Stack>
```

### Card Content Stack

```tsx
<Stack spacing="large">
  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Card Title</Text>
  <Text>Card description goes here</Text>
  <Stack direction="horizontal" spacing="medium">
    <Button title="Action 1" size="small" />
    <Button title="Action 2" size="small" variant="secondary" />
  </Stack>
</Stack>
```

### Navigation Items Stack

```tsx
<Stack spacing="none">
  <TouchableOpacity style={{ padding: 16 }}>
    <Text>Home</Text>
  </TouchableOpacity>
  <TouchableOpacity style={{ padding: 16 }}>
    <Text>Profile</Text>
  </TouchableOpacity>
  <TouchableOpacity style={{ padding: 16 }}>
    <Text>Settings</Text>
  </TouchableOpacity>
</Stack>
```

### Responsive Stack

```tsx
function ResponsiveStack({ children, isMobile }) {
  return (
    <Stack
      direction={isMobile ? 'vertical' : 'horizontal'}
      spacing={isMobile ? 'medium' : 'large'}
    >
      {children}
    </Stack>
  );
}
```

## Spacing Options

### None
- 0px gap between items
- Items are directly adjacent
- Use for seamless layouts

### Tight
- 4px gap between items
- Minimal spacing for related items

### Snug
- 8px gap between items
- Comfortable spacing for compact layouts

### Small
- 12px gap between items
- Standard spacing for form elements

### Medium (Default)
- 16px gap between items
- Most common spacing for general content

### Large
- 24px gap between items
- Generous spacing for distinct sections

### XL
- 32px gap between items
- Maximum spacing for major sections

## Direction Options

### Vertical (Default)
- Items arranged in a column
- Gap applied vertically between items
- Most common for lists and forms

### Horizontal
- Items arranged in a row
- Gap applied horizontally between items
- Ideal for button groups and inline elements

## Common Patterns

### Form Layout Pattern
```tsx
function FormLayout({ fields }) {
  return (
    <Stack spacing="medium">
      {fields.map((field, index) => (
        <View key={index}>
          <Text style={{ marginBottom: 8 }}>{field.label}</Text>
          <TextInput
            placeholder={field.placeholder}
            value={field.value}
            onChangeText={field.onChange}
          />
        </View>
      ))}
      <Button title="Submit" />
    </Stack>
  );
}
```

### List Item Pattern
```tsx
function ListItem({ icon, title, subtitle, action }) {
  return (
    <Stack direction="horizontal" spacing="medium">
      <Image source={icon} style={{ width: 24, height: 24 }} />
      <Stack spacing="tight" style={{ flex: 1 }}>
        <Text style={{ fontWeight: '600' }}>{title}</Text>
        <Text style={{ color: '#666' }}>{subtitle}</Text>
      </Stack>
      {action && (
        <TouchableOpacity onPress={action.onPress}>
          <Text style={{ color: '#007AFF' }}>{action.title}</Text>
        </TouchableOpacity>
      )}
    </Stack>
  );
}
```

### Stats Grid Pattern
```tsx
function StatsGrid({ stats }) {
  return (
    <Stack direction="horizontal" spacing="large">
      {stats.map((stat, index) => (
        <Stack key={index} spacing="tight">
          <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>
            {stat.value}
          </Text>
          <Text style={{ fontSize: 12, textAlign: 'center', color: '#666' }}>
            {stat.label}
          </Text>
        </Stack>
      ))}
    </Stack>
  );
}
```

### Action Bar Pattern
```tsx
function ActionBar({ actions }) {
  return (
    <Stack direction="horizontal" spacing="medium">
      {actions.map((action, index) => (
        <Button
          key={index}
          title={action.title}
          variant={action.variant || 'primary'}
          onPress={action.onPress}
        />
      ))}
    </Stack>
  );
}
```

## Accessibility

The Stack component includes accessibility features:

- **Screen Reader Support**: Accepts accessibility labels
- **Semantic Structure**: Maintains proper content flow
- **Focus Management**: Preserves focus order within stacked elements

### Accessibility Props

```tsx
<Stack
  accessibilityLabel="Navigation menu items"
  testID="navigation-stack"
>
  <TouchableOpacity>
    <Text>Home</Text>
  </TouchableOpacity>
  <TouchableOpacity>
    <Text>Profile</Text>
  </TouchableOpacity>
</Stack>
```

## Theme Integration

The component automatically adapts to the current theme:

```tsx
import { useTheme } from '@/src/context/ThemeContext';

function ThemedStack() {
  const { isDark } = useTheme();

  return (
    <Stack
      spacing="medium"
      style={{
        backgroundColor: isDark ? colors.neutral[900] : colors.neutral[0]
      }}
    >
      <Text>Theme-aware content</Text>
    </Stack>
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
import { Stack } from '@/components/design-system';

test('renders Stack with children', () => {
  const { getByTestId, getByText } = render(
    <Stack testID="test-stack">
      <Text>First Item</Text>
      <Text>Second Item</Text>
    </Stack>
  );

  expect(getByTestId('test-stack')).toBeTruthy();
  expect(getByText('First Item')).toBeTruthy();
  expect(getByText('Second Item')).toBeTruthy();
});

test('applies horizontal direction', () => {
  const { getByTestId } = render(
    <Stack testID="horizontal-stack" direction="horizontal">
      <Text>Item 1</Text>
      <Text>Item 2</Text>
    </Stack>
  );

  const stack = getByTestId('horizontal-stack');
  expect(stack.props.style).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ flexDirection: 'row' })
    ])
  );
});

test('applies custom spacing', () => {
  const { getByTestId } = render(
    <Stack testID="spaced-stack" spacing="large">
      <Text>Item 1</Text>
      <Text>Item 2</Text>
    </Stack>
  );

  const stack = getByTestId('spaced-stack');
  expect(stack.props.style).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ gap: 24 }) // large spacing = 24px
    ])
  );
});
```

## Migration from Legacy Stack

### Before (Legacy)
```tsx
// Hard-coded spacing and inconsistent gaps
<View style={{ gap: 16 }}>
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</View>

// Manual flexDirection for horizontal
<View style={{ flexDirection: 'row', gap: 12 }}>
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</View>
```

### After (Design System)
```tsx
// Consistent spacing using design tokens
<Stack spacing="medium">
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</Stack>

<Stack direction="horizontal" spacing="small">
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</Stack>
```

## Best Practices

1. **Consistent Spacing**: Use the same spacing values across similar components
2. **Direction Clarity**: Be explicit about direction when it matters
3. **Semantic Meaning**: Use Stack for logical groupings of related content
4. **Performance**: Avoid deeply nested Stacks that could cause performance issues
5. **Accessibility**: Provide meaningful accessibility labels for screen readers
6. **Test IDs**: Include test IDs for automated testing

## Related Components

- [`Container`](Container.md) - Layout container component
- [`Grid`](Grid.md) - Grid layout system component
- [`List`](List.md) - List container component

## Advanced Usage

### Dynamic Spacing Based on Content
```tsx
function DynamicStack({ items, density = 'normal' }) {
  const spacing = density === 'compact' ? 'small' : 'medium';

  return (
    <Stack spacing={spacing}>
      {items.map((item, index) => (
        <Text key={index}>{item}</Text>
      ))}
    </Stack>
  );
}
```

### Conditional Layout
```tsx
function AdaptiveStack({ children, isMobile }) {
  return (
    <Stack
      direction={isMobile ? 'vertical' : 'horizontal'}
      spacing={isMobile ? 'medium' : 'large'}
    >
      {children}
    </Stack>
  );
}
```

### Nested Stacks Pattern
```tsx
function ComplexLayout() {
  return (
    <Stack spacing="large">
      <Stack spacing="medium">
        <Text>Section 1</Text>
        <Text>Item 1.1</Text>
        <Text>Item 1.2</Text>
      </Stack>

      <Stack direction="horizontal" spacing="medium">
        <Text>Section 2</Text>
        <Stack spacing="small">
          <Text>Item 2.1</Text>
          <Text>Item 2.2</Text>
        </Stack>
      </Stack>
    </Stack>
  );
}