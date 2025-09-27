# Skeleton Component

A placeholder component that shows a pulsing animation while content is loading, providing better perceived performance.

## Overview

The Skeleton component displays animated placeholder content that mimics the structure of the actual content being loaded. This creates a smoother loading experience by giving users a preview of the content layout and reducing perceived loading times.

## Features

- 🎨 **Design System Integration**: Uses centralized design tokens for consistent styling
- 🌓 **Theme Support**: Automatically adapts to light and dark themes
- 📏 **Flexible Dimensions**: Customizable width and height
- 🎨 **Multiple Variants**: Rounded, circular, and rectangular shapes
- ✨ **Smooth Animation**: Pulsing animation for loading indication
- ♿ **Accessibility**: Full accessibility support with proper roles
- ⚡ **Performance**: Optimized animation with native driver

## Import

```tsx
import { Skeleton } from '@/components/design-system';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number \| string` | `'100%'` | Width of the skeleton |
| `height` | `number` | `20` | Height of the skeleton |
| `variant` | `'rounded' \| 'circular' \| 'rectangular'` | `'rectangular'` | Shape variant of the skeleton |
| `style` | `ViewStyle` | `undefined` | Custom styles for the container |
| `testID` | `string` | `undefined` | Test identifier for testing |
| `accessibilityLabel` | `string` | `'Loading skeleton'` | Accessibility label for screen readers |

## Usage Examples

### Basic Skeleton

```tsx
import { Skeleton } from '@/components/design-system';

function BasicSkeleton() {
  return (
    <Skeleton width="100%" height={40} />
  );
}
```

### Text Skeleton

```tsx
function TextSkeleton() {
  return (
    <Stack spacing="small">
      <Skeleton width="80%" height={20} />
      <Skeleton width="60%" height={16} />
      <Skeleton width="40%" height={16} />
    </Stack>
  );
}
```

### Card Skeleton

```tsx
function CardSkeleton() {
  return (
    <Container
      size="narrow"
      padding="medium"
      style={{
        backgroundColor: '#F8F9FA',
        borderRadius: 12
      }}
    >
      <Skeleton variant="circular" width={60} height={60} />
      <Stack spacing="small" style={{ marginTop: 16 }}>
        <Skeleton width="70%" height={20} />
        <Skeleton width="50%" height={16} />
      </Stack>
      <Stack spacing="small" style={{ marginTop: 12 }}>
        <Skeleton width="100%" height={12} />
        <Skeleton width="100%" height={12} />
        <Skeleton width="75%" height={12} />
      </Stack>
    </Container>
  );
}
```

### Avatar Skeleton

```tsx
function AvatarSkeleton() {
  return (
    <Skeleton variant="circular" width={50} height={50} />
  );
}
```

### List Skeleton

```tsx
function ListSkeleton() {
  return (
    <Stack spacing="medium">
      {[1, 2, 3].map((index) => (
        <Stack key={index} direction="horizontal" spacing="medium">
          <Skeleton variant="circular" width={40} height={40} />
          <Stack spacing="small" style={{ flex: 1 }}>
            <Skeleton width="60%" height={16} />
            <Skeleton width="40%" height={12} />
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}
```

### Profile Skeleton

```tsx
function ProfileSkeleton() {
  return (
    <Container centered padding="large">
      <Skeleton variant="circular" width={100} height={100} />
      <Stack spacing="medium" style={{ marginTop: 24, width: '100%' }}>
        <Skeleton width="50%" height={24} />
        <Skeleton width="30%" height={16} />
        <Stack spacing="small" style={{ marginTop: 16 }}>
          <Skeleton width="100%" height={16} />
          <Skeleton width="100%" height={16} />
          <Skeleton width="80%" height={16} />
        </Stack>
      </Stack>
    </Container>
  );
}
```

## Variants

### Rectangular (Default)
- Straight corners with 4px border radius
- Standard skeleton shape
- Most common variant

### Rounded
- 8px border radius
- Softer appearance
- Good for buttons and cards

### Circular
- Fully circular shape (50% border radius)
- Perfect for avatars and icons
- Matches circular content

## Animation

The Skeleton component includes a smooth pulsing animation:

- **Duration**: 2-second animation cycle (1s fade in, 1s fade out)
- **Native Driver**: Uses native driver for optimal performance
- **Opacity Range**: Animates between 30% and 70% opacity
- **Loop**: Continuous animation until component unmounts

## Common Patterns

### Article Skeleton Pattern
```tsx
function ArticleSkeleton() {
  return (
    <Container padding="medium">
      <Skeleton width="100%" height={200} variant="rounded" />
      <Stack spacing="medium" style={{ marginTop: 16 }}>
        <Skeleton width="80%" height={24} />
        <Skeleton width="60%" height={16} />
        <Stack spacing="small">
          <Skeleton width="100%" height={14} />
          <Skeleton width="100%" height={14} />
          <Skeleton width="90%" height={14} />
          <Skeleton width="70%" height={14} />
        </Stack>
      </Stack>
    </Container>
  );
}
```

### Product Card Skeleton Pattern
```tsx
function ProductCardSkeleton() {
  return (
    <Container
      padding="medium"
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5'
      }}
    >
      <Skeleton width="100%" height={150} variant="rounded" />
      <Stack spacing="small" style={{ marginTop: 12 }}>
        <Skeleton width="80%" height={18} />
        <Skeleton width="50%" height={16} />
        <Stack direction="horizontal" spacing="small" style={{ marginTop: 8 }}>
          <Skeleton width={60} height={24} variant="rounded" />
          <Skeleton width={80} height={24} variant="rounded" />
        </Stack>
      </Stack>
    </Container>
  );
}
```

### Chat Message Skeleton Pattern
```tsx
function ChatSkeleton() {
  return (
    <Stack spacing="large">
      {[1, 2, 3].map((index) => (
        <Stack key={index} direction="horizontal" spacing="medium">
          <Skeleton variant="circular" width={32} height={32} />
          <Stack spacing="small" style={{ flex: 1 }}>
            <Skeleton width="40%" height={14} />
            <Skeleton width="80%" height={16} />
            <Skeleton width="60%" height={14} />
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}
```

### Dashboard Skeleton Pattern
```tsx
function DashboardSkeleton() {
  return (
    <Stack spacing="large">
      {/* Stats Row */}
      <Stack direction="horizontal" spacing="medium">
        {[1, 2, 3, 4].map((index) => (
          <Container key={index} style={{ flex: 1 }}>
            <Skeleton width="60%" height={20} />
            <Skeleton width="40%" height={24} style={{ marginTop: 8 }} />
          </Container>
        ))}
      </Stack>

      {/* Chart Area */}
      <Skeleton width="100%" height={200} variant="rounded" />

      {/* Recent Items */}
      <Stack spacing="medium">
        <Skeleton width="30%" height={20} />
        {[1, 2, 3].map((index) => (
          <Stack key={index} direction="horizontal" spacing="medium">
            <Skeleton variant="circular" width={40} height={40} />
            <Stack spacing="small" style={{ flex: 1 }}>
              <Skeleton width="50%" height={16} />
              <Skeleton width="30%" height={12} />
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
```

## Accessibility

The Skeleton component includes accessibility features:

- **Progress Role**: Uses `progressbar` role for screen readers
- **Screen Reader Support**: Announces loading state to users
- **Semantic Meaning**: Clearly indicates loading content

### Accessibility Props

```tsx
<Skeleton
  width="100%"
  height={40}
  accessibilityLabel="Loading content"
  testID="content-skeleton"
/>
```

## Theme Integration

The component automatically adapts to the current theme:

```tsx
import { useTheme } from '@/src/context/ThemeContext';

function ThemedSkeleton() {
  const { isDark } = useTheme();

  return (
    <Skeleton
      width="100%"
      height={40}
      style={{
        backgroundColor: isDark ? colors.neutral[700] : colors.neutral[200]
      }}
    />
  );
}
```

## Performance

- **Memoization**: Component is wrapped with `React.memo` for optimal performance
- **Animation Optimization**: Uses native driver for smooth animation
- **Style Optimization**: Styles are computed once and memoized
- **Minimal Re-renders**: Only re-renders when props change

## Testing

```tsx
import { render } from '@testing-library/react-native';
import { Skeleton } from '@/components/design-system';

test('renders Skeleton component', () => {
  const { getByTestId } = render(
    <Skeleton width="100%" height={40} testID="test-skeleton" />
  );

  expect(getByTestId('test-skeleton')).toBeTruthy();
});

test('applies different variants correctly', () => {
  const { getByTestId } = render(
    <Skeleton
      variant="circular"
      width={50}
      height={50}
      testID="circular-skeleton"
    />
  );

  const skeleton = getByTestId('circular-skeleton');
  expect(skeleton.props.style).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        borderRadius: 25 // 50/2 for circular
      })
    ])
  );
});

test('applies custom dimensions correctly', () => {
  const { getByTestId } = render(
    <Skeleton
      width={200}
      height={100}
      testID="custom-skeleton"
    />
  );

  const skeleton = getByTestId('custom-skeleton');
  expect(skeleton.props.style).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        width: 200,
        height: 100
      })
    ])
  );
});

test('applies percentage width correctly', () => {
  const { getByTestId } = render(
    <Skeleton
      width="80%"
      height={30}
      testID="percentage-skeleton"
    />
  );

  const skeleton = getByTestId('percentage-skeleton');
  expect(skeleton.props.style).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        width: '80%'
      })
    ])
  );
});
```

## Migration from Legacy Skeleton

### Before (Legacy)
```tsx
// Manual skeleton implementation with custom animation
<Animated.View
  style={{
    width: '100%',
    height: 20,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    opacity: animatedValue
  }}
/>
```

### After (Design System)
```tsx
// Uses design tokens and optimized animation
<Skeleton width="100%" height={20} />
```

## Best Practices

1. **Match Content Shape**: Use variants and dimensions that match actual content
2. **Realistic Sizing**: Create skeletons that represent actual content proportions
3. **Progressive Loading**: Use different skeletons for different content sections
4. **Animation Control**: Don't overuse animation in performance-critical areas
5. **Accessibility**: Include accessibility labels for screen readers
6. **Test IDs**: Include test IDs for automated testing

## Advanced Usage

### Dynamic Skeleton Content
```tsx
function DynamicSkeleton({ type }) {
  const renderSkeleton = () => {
    switch (type) {
      case 'article':
        return (
          <Stack spacing="medium">
            <Skeleton width="100%" height={200} variant="rounded" />
            <Skeleton width="70%" height={24} />
            <Skeleton width="100%" height={16} />
            <Skeleton width="80%" height={16} />
          </Stack>
        );
      case 'profile':
        return (
          <Stack spacing="large">
            <Skeleton variant="circular" width={80} height={80} />
            <Skeleton width="50%" height={20} />
            <Skeleton width="100%" height={60} variant="rounded" />
          </Stack>
        );
      default:
        return <Skeleton width="100%" height={40} />;
    }
  };

  return renderSkeleton();
}
```

### Skeleton with Conditional Rendering
```tsx
function ConditionalSkeleton({ isLoading, children }) {
  if (isLoading) {
    return (
      <Stack spacing="medium">
        <Skeleton width="100%" height={40} />
        <Skeleton width="80%" height={20} />
        <Skeleton width="60%" height={20} />
      </Stack>
    );
  }

  return children;
}
```

### Staggered Skeleton Animation
```tsx
function StaggeredSkeleton() {
  const [visibleSkeletons, setVisibleSkeletons] = useState([]);

  useEffect(() => {
    const timers = [1, 2, 3].map((index) =>
      setTimeout(() => {
        setVisibleSkeletons(prev => [...prev, index]);
      }, index * 200)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <Stack spacing="medium">
      {[1, 2, 3].map((index) => (
        visibleSkeletons.includes(index) ? (
          <Skeleton key={index} width="100%" height={40} />
        ) : (
          <View key={index} style={{ height: 40 }} />
        )
      ))}
    </Stack>
  );
}
```

## Related Components

- [`Loading`](Loading.md) - Loading spinner component
- [`Container`](Container.md) - Layout container component
- [`Stack`](Stack.md) - Stacking layout component

## Animation Details

### Performance Optimization
- Uses `useNativeDriver: true` for optimal performance
- Runs animation on native thread
- 60fps smooth animation
- Minimal CPU usage

### Animation Timing
- **Fade In**: 1000ms duration
- **Fade Out**: 1000ms duration
- **Loop**: Continuous until unmount
- **Easing**: Linear easing for consistent animation

### Memory Management
- Properly cleans up animation on unmount
- Uses single Animated.Value instance
- Optimized interpolation for smooth transitions

## Content Strategy

### When to Use Skeletons
- **Content Loading**: When loading dynamic content
- **Better UX**: When loading times exceed 200ms
- **Layout Preservation**: When you want to maintain layout structure
- **Progressive Loading**: For complex layouts with multiple sections

### When to Use Spinners
- **Immediate Actions**: For quick operations (< 200ms)
- **Full Screen Loading**: When entire screen is loading
- **Button States**: For form submissions and actions
- **Overlay Loading**: When loading over existing content

## Platform Considerations

### iOS
- Smooth Core Animation integration
- Consistent with iOS design patterns
- Respects iOS accessibility settings

### Android
- Material Design animation patterns
- Consistent with Android loading indicators
- Ripple animation compatibility

## Color Guidelines

### Default Colors
- **Light Theme**: Light gray (#E5E5E5 equivalent)
- **Dark Theme**: Dark gray for proper contrast

### Animation Colors
- **Opacity Range**: 30% to 70% for subtle animation
- **Background**: Matches theme background colors
- **Accessibility**: Maintains sufficient contrast during animation