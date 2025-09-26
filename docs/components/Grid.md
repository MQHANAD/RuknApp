# Grid Component

A flexible grid layout component that arranges children in a responsive grid system with consistent spacing and column options.

## Overview

The Grid component provides a powerful layout system for arranging content in rows and columns. It supports multiple column configurations, consistent spacing, and automatic responsive behavior, making it ideal for creating card layouts, image galleries, and other grid-based interfaces.

## Features

- 🎨 **Design System Integration**: Uses centralized design tokens for consistent styling
- 🌓 **Theme Support**: Automatically adapts to light and dark themes
- 📱 **Responsive Columns**: Multiple column options (1, 2, 3, 4, 6)
- 📏 **Spacing Control**: Various spacing presets between grid items
- 🎯 **Auto Layout**: Automatically arranges children in grid pattern
- ♿ **Accessibility**: Full accessibility support with proper labels
- ⚡ **Performance**: Memoized for optimal performance

## Import

```tsx
import { Grid } from '@/components/design-system';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | **Required** | Elements to be arranged in the grid |
| `columns` | `1 \| 2 \| 3 \| 4 \| 6` | `2` | Number of columns in the grid |
| `spacing` | `'none' \| 'tight' \| 'snug' \| 'small' \| 'medium' \| 'large'` | `'medium'` | Spacing between grid items |
| `style` | `ViewStyle` | `undefined` | Custom styles for the container |
| `itemStyle` | `ViewStyle` | `undefined` | Custom styles for individual grid items |
| `testID` | `string` | `undefined` | Test identifier for testing |
| `accessibilityLabel` | `string` | `undefined` | Accessibility label for screen readers |

## Usage Examples

### Basic 2-Column Grid

```tsx
import { Grid } from '@/components/design-system';

function ImageGallery() {
  const images = [
    require('@/assets/images/1.jpg'),
    require('@/assets/images/2.jpg'),
    require('@/assets/images/3.jpg'),
    require('@/assets/images/4.jpg'),
  ];

  return (
    <Grid columns={2} spacing="medium">
      {images.map((image, index) => (
        <Image key={index} source={image} style={{ width: '100%', height: 120 }} />
      ))}
    </Grid>
  );
}
```

### 3-Column Product Grid

```tsx
<Grid columns={3} spacing="small">
  {products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</Grid>
```

### Single Column List

```tsx
<Grid columns={1} spacing="medium">
  {items.map((item) => (
    <ListItem key={item.id} item={item} />
  ))}
</Grid>
```

### 4-Column Stats Grid

```tsx
<Grid columns={4} spacing="small">
  <StatCard title="Users" value="1,234" />
  <StatCard title="Revenue" value="$56,789" />
  <StatCard title="Orders" value="890" />
  <StatCard title="Growth" value="+12%" />
</Grid>
```

### Custom Styled Grid Items

```tsx
<Grid
  columns={2}
  spacing="medium"
  itemStyle={{
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8
  }}
>
  {features.map((feature, index) => (
    <View key={index}>
      <Text style={{ fontSize: 16, fontWeight: '600' }}>{feature.title}</Text>
      <Text style={{ color: '#666' }}>{feature.description}</Text>
    </View>
  ))}
</Grid>
```

### Responsive Grid

```tsx
function ResponsiveGrid({ items }) {
  const { width } = useWindowDimensions();

  // Adjust columns based on screen width
  const columns = width > 768 ? 4 : width > 480 ? 3 : 2;

  return (
    <Grid columns={columns} spacing="medium">
      {items.map((item) => (
        <Card key={item.id} item={item} />
      ))}
    </Grid>
  );
}
```

## Column Options

### 1 Column
- Single column layout
- Items stack vertically
- Good for mobile lists

### 2 Columns (Default)
- Two column grid
- Balanced layout for most use cases
- Good for image galleries

### 3 Columns
- Three column grid
- Ideal for product listings
- Works well on tablets

### 4 Columns
- Four column grid
- Best for stats or small cards
- Requires wider screens

### 6 Columns
- Six column grid
- Maximum density layout
- Use for small icons or badges

## Spacing Options

### None
- No spacing between items
- Items touch each other
- Use for seamless layouts

### Tight
- 4px spacing between items
- Minimal spacing for dense layouts

### Snug
- 8px spacing between items
- Comfortable for compact grids

### Small
- 12px spacing between items
- Standard spacing for card layouts

### Medium (Default)
- 16px spacing between items
- Most common spacing for general use

### Large
- 24px spacing between items
- Generous spacing for featured content

## Common Patterns

### Product Grid Pattern
```tsx
function ProductGrid({ products }) {
  return (
    <Grid columns={2} spacing="medium">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          image={product.image}
          title={product.title}
          price={product.price}
          onPress={() => handleProductPress(product)}
        />
      ))}
    </Grid>
  );
}
```

### Feature Grid Pattern
```tsx
function FeatureGrid({ features }) {
  return (
    <Grid columns={3} spacing="large">
      {features.map((feature, index) => (
        <Stack key={index} spacing="medium">
          <Image source={feature.icon} style={{ width: 48, height: 48 }} />
          <Text style={{ fontSize: 18, fontWeight: '600', textAlign: 'center' }}>
            {feature.title}
          </Text>
          <Text style={{ textAlign: 'center', color: '#666' }}>
            {feature.description}
          </Text>
        </Stack>
      ))}
    </Grid>
  );
}
```

### Stats Dashboard Pattern
```tsx
function StatsDashboard({ stats }) {
  return (
    <Grid columns={4} spacing="small">
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
    </Grid>
  );
}
```

### Image Gallery Pattern
```tsx
function ImageGallery({ images }) {
  return (
    <Grid columns={3} spacing="tight">
      {images.map((image, index) => (
        <TouchableOpacity key={index} onPress={() => openImage(index)}>
          <Image
            source={image}
            style={{ width: '100%', aspectRatio: 1 }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      ))}
    </Grid>
  );
}
```

### Settings Grid Pattern
```tsx
function SettingsGrid({ settings }) {
  return (
    <Grid columns={1} spacing="none">
      {settings.map((setting, index) => (
        <TouchableOpacity
          key={index}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            borderBottomWidth: index < settings.length - 1 ? 1 : 0,
            borderBottomColor: '#E5E5E5'
          }}
        >
          <Image source={setting.icon} style={{ width: 24, height: 24, marginRight: 12 }} />
          <Stack spacing="tight" style={{ flex: 1 }}>
            <Text style={{ fontWeight: '500' }}>{setting.title}</Text>
            <Text style={{ fontSize: 12, color: '#666' }}>{setting.description}</Text>
          </Stack>
        </TouchableOpacity>
      ))}
    </Grid>
  );
}
```

## Accessibility

The Grid component includes accessibility features:

- **Screen Reader Support**: Accepts accessibility labels
- **Grid Role**: Uses appropriate accessibility roles
- **Focus Management**: Maintains proper focus order
- **Semantic Structure**: Preserves content hierarchy

### Accessibility Props

```tsx
<Grid
  columns={3}
  spacing="medium"
  accessibilityLabel="Product grid with 3 columns"
  testID="product-grid"
>
  {products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</Grid>
```

## Theme Integration

The component automatically adapts to the current theme:

```tsx
import { useTheme } from '@/src/context/ThemeContext';

function ThemedGrid() {
  const { isDark } = useTheme();

  return (
    <Grid
      columns={2}
      spacing="medium"
      style={{
        backgroundColor: isDark ? colors.neutral[900] : colors.neutral[100]
      }}
    >
      <Text>Grid content</Text>
    </Grid>
  );
}
```

## Performance

- **Memoization**: Component is wrapped with `React.memo` for optimal performance
- **Children Optimization**: Uses `Children.toArray` for efficient rendering
- **Style Optimization**: Styles are computed once and memoized
- **Minimal Re-renders**: Only re-renders when props change

## Testing

```tsx
import { render } from '@testing-library/react-native';
import { Grid } from '@/components/design-system';

test('renders Grid with correct number of columns', () => {
  const { getByTestId } = render(
    <Grid columns={3} testID="test-grid">
      <Text>Item 1</Text>
      <Text>Item 2</Text>
      <Text>Item 3</Text>
    </Grid>
  );

  expect(getByTestId('test-grid')).toBeTruthy();
  expect(getByTestId('test-grid-item-0')).toBeTruthy();
  expect(getByTestId('test-grid-item-1')).toBeTruthy();
  expect(getByTestId('test-grid-item-2')).toBeTruthy();
});

test('applies custom item styles', () => {
  const customItemStyle = { backgroundColor: 'red' };
  const { getByTestId } = render(
    <Grid
      columns={2}
      itemStyle={customItemStyle}
      testID="styled-grid"
    >
      <Text>Item 1</Text>
      <Text>Item 2</Text>
    </Grid>
  );

  const firstItem = getByTestId('styled-grid-item-0');
  expect(firstItem.props.style).toEqual(
    expect.arrayContaining([expect.objectContaining(customItemStyle)])
  );
});

test('handles different column counts', () => {
  const { getByTestId } = render(
    <Grid columns={4} testID="four-column-grid">
      <Text>Item 1</Text>
      <Text>Item 2</Text>
      <Text>Item 3</Text>
      <Text>Item 4</Text>
    </Grid>
  );

  const grid = getByTestId('four-column-grid');
  expect(grid.props.style).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        // Grid should have 4-column layout styles
      })
    ])
  );
});
```

## Migration from Legacy Grid

### Before (Legacy)
```tsx
// Manual grid implementation with hard-coded calculations
<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
  {items.map((item, index) => (
    <View
      key={index}
      style={{
        width: `${100 / columns}%`,
        padding: 8
      }}
    >
      <Text>{item}</Text>
    </View>
  ))}
</View>
```

### After (Design System)
```tsx
// Uses design tokens and automatic layout
<Grid columns={columns} spacing="medium">
  {items.map((item, index) => (
    <Text key={index}>{item}</Text>
  ))}
</Grid>
```

## Best Practices

1. **Column Selection**: Choose appropriate column count based on content and screen size
2. **Consistent Spacing**: Use the same spacing values across similar grids
3. **Item Sizing**: Ensure grid items have consistent heights for better visual balance
4. **Responsive Design**: Consider different column counts for different screen sizes
5. **Accessibility**: Provide meaningful accessibility labels for screen readers
6. **Performance**: Avoid very large grids that could impact performance
7. **Test IDs**: Include test IDs for automated testing

## Related Components

- [`Container`](Container.md) - Layout container component
- [`Stack`](Stack.md) - Stacking layout component
- [`List`](List.md) - List container component

## Advanced Usage

### Dynamic Column Count
```tsx
function DynamicGrid({ items, breakpoint = 768 }) {
  const { width } = useWindowDimensions();

  const columns = width > breakpoint ? 4 : 2;

  return (
    <Grid columns={columns} spacing="medium">
      {items.map((item) => (
        <Card key={item.id} item={item} />
      ))}
    </Grid>
  );
}
```

### Mixed Content Grid
```tsx
function MixedGrid({ content }) {
  return (
    <Grid columns={2} spacing="medium">
      {content.map((item, index) => {
        if (item.type === 'featured') {
          return (
            <View key={index} style={{ backgroundColor: '#FFE5E5', padding: 16 }}>
              <Text>Featured Item</Text>
            </View>
          );
        }
        return (
          <View key={index} style={{ padding: 16 }}>
            <Text>Regular Item</Text>
          </View>
        );
      })}
    </Grid>
  );
}
```

### Masonry-like Grid
```tsx
function MasonryGrid({ items }) {
  return (
    <Grid columns={3} spacing="small">
      {items.map((item, index) => (
        <Image
          key={index}
          source={item.source}
          style={{
            width: '100%',
            height: item.height, // Variable heights for masonry effect
          }}
          resizeMode="cover"
        />
      ))}
    </Grid>
  );
}
```

## Responsive Behavior

The Grid component works well with different screen sizes:

- **Mobile (< 480px)**: 1-2 columns recommended
- **Tablet (480px - 1024px)**: 2-3 columns work well
- **Desktop (> 1024px)**: 3-4 columns provide good density

```tsx
// Responsive grid that adapts to screen size
function ResponsiveGrid({ children }) {
  const { width } = useWindowDimensions();

  let columns = 1;
  if (width >= 1024) columns = 4;
  else if (width >= 768) columns = 3;
  else if (width >= 480) columns = 2;

  return (
    <Grid columns={columns} spacing="medium">
      {children}
    </Grid>
  );
}