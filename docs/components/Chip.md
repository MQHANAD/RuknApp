# Chip Component

A flexible chip component for displaying tags, filters, and interactive elements with design system integration.

## Overview

The Chip component provides a compact element for displaying information, tags, filters, and interactive controls. It supports multiple variants, press interactions, close functionality, and comprehensive accessibility features, making it perfect for filtering, tagging, and selection interfaces.

## Features

- 🎨 **Design System Integration**: Uses centralized design tokens for consistent styling
- 🌓 **Theme Support**: Automatically adapts to light and dark themes
- 🎨 **Multiple Variants**: Default, primary, success, warning, error, and outline
- 🏷️ **Interactive**: Supports press and close interactions
- ♿ **Accessibility**: Full accessibility support with proper labels
- ⚡ **Performance**: Memoized for optimal performance
- 🎯 **Flexible**: Customizable styling and behavior

## Import

```tsx
import { Chip } from '@/components/design-system';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | **Required** | Text displayed in the chip |
| `variant` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'error' \| 'outline'` | `'default'` | Visual style variant |
| `onPress` | `() => void` | `undefined` | Callback when chip is pressed |
| `onClose` | `() => void` | `undefined` | Callback when close button is pressed |
| `disabled` | `boolean` | `false` | Whether the chip is disabled |
| `style` | `ViewStyle` | `undefined` | Custom styles for the container |
| `textStyle` | `TextStyle` | `undefined` | Custom styles for the text |
| `testID` | `string` | `undefined` | Test identifier for testing |
| `accessibilityLabel` | `string` | `undefined` | Custom accessibility label |

## Usage Examples

### Basic Chip

```tsx
import { Chip } from '@/components/design-system';

function BasicChip() {
  return (
    <Chip
      label="Basic Chip"
      testID="basic-chip"
    />
  );
}
```

### Interactive Chip

```tsx
function InteractiveChip() {
  const [selected, setSelected] = useState(false);

  return (
    <Chip
      label="Press me"
      variant={selected ? 'primary' : 'default'}
      onPress={() => setSelected(!selected)}
    />
  );
}
```

### Dismissible Chip

```tsx
function DismissibleChip({ label, onRemove }) {
  return (
    <Chip
      label={label}
      variant="primary"
      onClose={onRemove}
    />
  );
}
```

### Status Chips

```tsx
function StatusChips({ status }) {
  const getVariant = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  return (
    <Chip
      label={status}
      variant={getVariant(status)}
    />
  );
}
```

### Filter Chips

```tsx
function FilterChips({ filters, activeFilter, onFilterChange }) {
  return (
    <Stack direction="horizontal" spacing="small" style={{ flexWrap: 'wrap' }}>
      {filters.map((filter) => (
        <Chip
          key={filter.id}
          label={filter.name}
          variant={activeFilter === filter.id ? 'primary' : 'outline'}
          onPress={() => onFilterChange(filter.id)}
        />
      ))}
    </Stack>
  );
}
```

### Tag List

```tsx
function TagList({ tags, onTagRemove }) {
  return (
    <Stack direction="horizontal" spacing="small" style={{ flexWrap: 'wrap' }}>
      {tags.map((tag) => (
        <Chip
          key={tag.id}
          label={tag.name}
          variant="primary"
          onClose={() => onTagRemove(tag.id)}
        />
      ))}
    </Stack>
  );
}
```

## Variants

### Default Variant
- Subtle gray background
- Standard text color
- Most neutral appearance

### Primary Variant
- Brand primary color background
- White text for contrast
- Indicates primary actions or selections

### Success Variant
- Green background
- White text
- Indicates positive states or success

### Warning Variant
- Orange/amber background
- Dark text for contrast
- Indicates caution or pending states

### Error Variant
- Red background
- White text
- Indicates errors or dangerous actions

### Outline Variant
- Transparent background with border
- Colored text and border
- Subtle appearance for secondary content

## Common Patterns

### Filter Pattern
```tsx
function FilterBar({ categories, activeCategory, onCategoryChange }) {
  return (
    <Stack direction="horizontal" spacing="medium" style={{ flexWrap: 'wrap' }}>
      <Chip
        label="All"
        variant={activeCategory === 'all' ? 'primary' : 'outline'}
        onPress={() => onCategoryChange('all')}
      />
      {categories.map((category) => (
        <Chip
          key={category.id}
          label={category.name}
          variant={activeCategory === category.id ? 'primary' : 'outline'}
          onPress={() => onCategoryChange(category.id)}
        />
      ))}
    </Stack>
  );
}
```

### Tag Management Pattern
```tsx
function TagManager({ tags, onAddTag, onRemoveTag }) {
  const [newTag, setNewTag] = useState('');

  return (
    <Stack spacing="medium">
      <Stack direction="horizontal" spacing="small">
        <TextInput
          placeholder="Add tag"
          value={newTag}
          onChangeText={setNewTag}
          style={{ flex: 1 }}
        />
        <Button
          title="Add"
          onPress={() => {
            if (newTag.trim()) {
              onAddTag(newTag.trim());
              setNewTag('');
            }
          }}
        />
      </Stack>

      <Stack direction="horizontal" spacing="small" style={{ flexWrap: 'wrap' }}>
        {tags.map((tag) => (
          <Chip
            key={tag.id}
            label={tag.name}
            variant="primary"
            onClose={() => onRemoveTag(tag.id)}
          />
        ))}
      </Stack>
    </Stack>
  );
}
```

### Contact Chips Pattern
```tsx
function ContactChips({ contacts, onContactRemove }) {
  return (
    <Stack direction="horizontal" spacing="small" style={{ flexWrap: 'wrap' }}>
      {contacts.map((contact) => (
        <Chip
          key={contact.id}
          label={contact.name}
          variant="outline"
          onClose={() => onContactRemove(contact.id)}
        />
      ))}
    </Stack>
  );
}
```

### Status Indicator Pattern
```tsx
function StatusIndicator({ status, message }) {
  const getVariant = (status) => {
    switch (status) {
      case 'online': return 'success';
      case 'away': return 'warning';
      case 'offline': return 'error';
      default: return 'default';
    }
  };

  return (
    <Stack direction="horizontal" spacing="small">
      <Chip
        label={status}
        variant={getVariant(status)}
      />
      <Text>{message}</Text>
    </Stack>
  );
}
```

## Accessibility

The Chip component includes comprehensive accessibility features:

- **Button Role**: Interactive chips use `button` role
- **Screen Reader Support**: Proper accessibility labels
- **Touch Targets**: Meets minimum touch target requirements
- **Focus Management**: Visible focus indicators
- **High Contrast**: Supports high contrast mode

### Accessibility Props

```tsx
<Chip
  label="Important"
  variant="primary"
  onPress={handlePress}
  accessibilityLabel="Mark as important"
  testID="important-chip"
/>
```

## Theme Integration

The component automatically adapts to the current theme:

```tsx
import { useTheme } from '@/src/context/ThemeContext';

function ThemedChip() {
  const { isDark } = useTheme();

  return (
    <Chip
      label="Theme Chip"
      variant="outline"
      style={{
        borderColor: isDark ? colors.neutral[600] : colors.neutral[300]
      }}
    />
  );
}
```

## Performance

- **Memoization**: Component is wrapped with `React.memo` for optimal performance
- **Style Optimization**: Styles are computed once and memoized
- **Minimal Re-renders**: Only re-renders when props change
- **Efficient Interactions**: Optimized touch handling

## Testing

```tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Chip } from '@/components/design-system';

test('renders Chip with label', () => {
  const { getByTestId, getByText } = render(
    <Chip
      label="Test Chip"
      testID="test-chip"
    />
  );

  expect(getByTestId('test-chip')).toBeTruthy();
  expect(getByText('Test Chip')).toBeTruthy();
});

test('calls onPress when pressed', () => {
  const mockOnPress = jest.fn();
  const { getByTestId } = render(
    <Chip
      label="Pressable Chip"
      onPress={mockOnPress}
      testID="pressable-chip"
    />
  );

  fireEvent.press(getByTestId('pressable-chip'));
  expect(mockOnPress).toHaveBeenCalled();
});

test('calls onClose when close button is pressed', () => {
  const mockOnClose = jest.fn();
  const { getByTestId } = render(
    <Chip
      label="Dismissible Chip"
      onClose={mockOnClose}
      testID="dismissible-chip"
    />
  );

  fireEvent.press(getByTestId('dismissible-chip-close'));
  expect(mockOnClose).toHaveBeenCalled();
});

test('applies disabled state correctly', () => {
  const { getByTestId } = render(
    <Chip
      label="Disabled Chip"
      disabled={true}
      testID="disabled-chip"
    />
  );

  const chip = getByTestId('disabled-chip');
  expect(chip.props.style).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ opacity: 0.5 })
    ])
  );
});

test('applies different variants correctly', () => {
  const { getByTestId } = render(
    <Chip
      label="Primary Chip"
      variant="primary"
      testID="primary-chip"
    />
  );

  const chip = getByTestId('primary-chip');
  expect(chip.props.style).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        backgroundColor: expect.any(String) // Primary color
      })
    ])
  );
});
```

## Migration from Legacy Chip

### Before (Legacy)
```tsx
// Manual chip implementation with hard-coded styles
<TouchableOpacity
  style={{
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8
  }}
  onPress={onPress}
>
  <Text style={{
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500'
  }}>
    Label
  </Text>
</TouchableOpacity>
```

### After (Design System)
```tsx
// Uses design tokens and consistent styling
<Chip
  label="Label"
  variant="primary"
  onPress={onPress}
/>
```

## Best Practices

1. **Clear Labels**: Use concise, descriptive labels
2. **Consistent Variants**: Use the same variant for similar actions
3. **Touch Targets**: Ensure adequate spacing between chips
4. **Accessibility**: Provide meaningful accessibility labels
5. **Close Button**: Only use close button when removal is intuitive
6. **Disabled State**: Clearly indicate when chips are disabled
7. **Test IDs**: Include test IDs for automated testing

## Advanced Usage

### Dynamic Chip Collection
```tsx
function DynamicChips({ items, onItemPress, onItemRemove }) {
  return (
    <Stack direction="horizontal" spacing="small" style={{ flexWrap: 'wrap' }}>
      {items.map((item) => (
        <Chip
          key={item.id}
          label={item.name}
          variant={item.selected ? 'primary' : 'outline'}
          onPress={() => onItemPress(item)}
          onClose={item.removable ? () => onItemRemove(item.id) : undefined}
        />
      ))}
    </Stack>
  );
}
```

### Category Filter Pattern
```tsx
function CategoryFilter({ categories, selectedCategory, onSelectCategory }) {
  return (
    <Stack direction="horizontal" spacing="medium" style={{ flexWrap: 'wrap' }}>
      {categories.map((category) => (
        <Chip
          key={category.id}
          label={category.name}
          variant={selectedCategory === category.id ? 'primary' : 'outline'}
          onPress={() => onSelectCategory(category.id)}
        />
      ))}
    </Stack>
  );
}
```

### Priority Chip Pattern
```tsx
function PriorityChip({ priority, onPriorityChange }) {
  const getVariant = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Chip
      label={`Priority: ${priority}`}
      variant={getVariant(priority)}
      onPress={() => {
        // Cycle through priorities
        const priorities = ['low', 'medium', 'high'];
        const currentIndex = priorities.indexOf(priority);
        const nextPriority = priorities[(currentIndex + 1) % priorities.length];
        onPriorityChange(nextPriority);
      }}
    />
  );
}
```

### Selection Chip Group
```tsx
function SelectionChips({ options, selectedOptions, onSelectionChange }) {
  const toggleOption = (optionId) => {
    if (selectedOptions.includes(optionId)) {
      onSelectionChange(selectedOptions.filter(id => id !== optionId));
    } else {
      onSelectionChange([...selectedOptions, optionId]);
    }
  };

  return (
    <Stack direction="horizontal" spacing="small" style={{ flexWrap: 'wrap' }}>
      {options.map((option) => (
        <Chip
          key={option.id}
          label={option.name}
          variant={selectedOptions.includes(option.id) ? 'primary' : 'outline'}
          onPress={() => toggleOption(option.id)}
        />
      ))}
    </Stack>
  );
}
```

## Related Components

- [`List`](List.md) - List container component
- [`ListItem`](ListItem.md) - Individual list item component
- [`Avatar`](Avatar.md) - User avatar component

## Styling Guidelines

### Color Usage
- **Primary**: Brand actions, selected filters
- **Success**: Positive states, completed actions
- **Warning**: Pending states, caution needed
- **Error**: Dangerous actions, error states
- **Outline**: Secondary content, unselected filters
- **Default**: Neutral information, general use

### Spacing
- **Between Chips**: Use 8px minimum spacing
- **Padding**: Maintain consistent internal padding
- **Margins**: Consider container spacing for wrapped layouts

### Typography
- **Font Size**: Consistent with design system
- **Font Weight**: Medium weight for better readability
- **Line Height**: Optimized for touch targets