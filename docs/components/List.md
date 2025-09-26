# List Component

A container component for ListItem components with consistent styling and variant options.

## Overview

The List component provides a container for ListItem components, ensuring consistent spacing, styling, and behavior. It supports different variants and works seamlessly with the ListItem component to create uniform list interfaces throughout the application.

## Features

- 🎨 **Design System Integration**: Uses centralized design tokens for consistent styling
- 🌓 **Theme Support**: Automatically adapts to light and dark themes
- 📱 **Variant Options**: Default and bordered variants
- 🎯 **Consistent Layout**: Uniform spacing and styling for list items
- ♿ **Accessibility**: Full accessibility support with proper roles
- ⚡ **Performance**: Memoized for optimal performance

## Import

```tsx
import { List } from '@/components/design-system';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | **Required** | ListItem components or other content |
| `variant` | `'default' \| 'bordered'` | `'default'` | Visual style variant |
| `style` | `ViewStyle` | `undefined` | Custom styles for the container |
| `itemStyle` | `ViewStyle` | `undefined` | Custom styles for individual list items |
| `testID` | `string` | `undefined` | Test identifier for testing |
| `accessibilityLabel` | `string` | `undefined` | Accessibility label for screen readers |

## Usage Examples

### Basic List

```tsx
import { List, ListItem } from '@/components/design-system';

function BasicList() {
  return (
    <List>
      <ListItem
        title="Home"
        subtitle="Go to home screen"
        leftIcon={require('@/assets/icons/home.png')}
      />
      <ListItem
        title="Profile"
        subtitle="View and edit profile"
        leftIcon={require('@/assets/icons/user.png')}
      />
      <ListItem
        title="Settings"
        subtitle="App preferences"
        leftIcon={require('@/assets/icons/settings.png')}
      />
    </List>
  );
}
```

### Bordered List

```tsx
<List variant="bordered">
  <ListItem title="Option 1" />
  <ListItem title="Option 2" />
  <ListItem title="Option 3" />
</List>
```

### Interactive List

```tsx
function InteractiveList() {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <List>
      {menuItems.map((item) => (
        <ListItem
          key={item.id}
          title={item.title}
          subtitle={item.description}
          leftIcon={item.icon}
          rightIcon={selectedItem === item.id
            ? require('@/assets/icons/check.png')
            : undefined
          }
          onPress={() => setSelectedItem(item.id)}
        />
      ))}
    </List>
  );
}
```

### Settings List

```tsx
function SettingsList() {
  return (
    <List>
      <ListItem
        title="Notifications"
        subtitle="Manage notification preferences"
        leftIcon={require('@/assets/icons/bell.png')}
        rightIcon={require('@/assets/icons/chevron-right.png')}
        onPress={() => navigation.navigate('Notifications')}
      />
      <ListItem
        title="Privacy"
        subtitle="Privacy and security settings"
        leftIcon={require('@/assets/icons/shield.png')}
        rightIcon={require('@/assets/icons/chevron-right.png')}
        onPress={() => navigation.navigate('Privacy')}
      />
      <ListItem
        title="About"
        subtitle="App information and version"
        leftIcon={require('@/assets/icons/info.png')}
        rightIcon={require('@/assets/icons/chevron-right.png')}
        onPress={() => navigation.navigate('About')}
      />
    </List>
  );
}
```

### Custom Styled List

```tsx
<List
  variant="bordered"
  style={{
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    margin: 16
  }}
  itemStyle={{
    paddingVertical: 16,
    paddingHorizontal: 20
  }}
>
  <ListItem title="Custom Item 1" />
  <ListItem title="Custom Item 2" />
</List>
```

## Variants

### Default Variant
- Clean, minimal styling
- No borders around the list
- Items are separated by dividers

### Bordered Variant
- List has a border around the entire container
- More defined visual grouping
- Good for standalone list sections

## List Structure

```
┌─────────────────────────────────────────┐
│  ┌─────────────────────────────────────┐ │
│  │ 📱 Icon    Title          → Icon    │ │ ← ListItem
│  │           Subtitle                  │ │
│  └─────────────────────────────────────┘ │
│  ┌─────────────────────────────────────┐ │
│  │ 🏠 Icon    Title          → Icon    │ │ ← ListItem
│  │           Subtitle                  │ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Related Components

- [`ListItem`](ListItem.md) - Individual list item component
- [`Container`](Container.md) - Layout container component
- [`Stack`](Stack.md) - Stacking layout component

## Common Patterns

### Menu List Pattern
```tsx
function MenuList({ items, onItemPress }) {
  return (
    <List>
      {items.map((item) => (
        <ListItem
          key={item.id}
          title={item.title}
          subtitle={item.description}
          leftIcon={item.icon}
          rightIcon={require('@/assets/icons/chevron-right.png')}
          onPress={() => onItemPress(item)}
        />
      ))}
    </List>
  );
}
```

### Selection List Pattern
```tsx
function SelectionList({ options, selectedOption, onSelect }) {
  return (
    <List>
      {options.map((option) => (
        <ListItem
          key={option.id}
          title={option.title}
          subtitle={option.description}
          leftIcon={option.icon}
          rightIcon={selectedOption === option.id
            ? require('@/assets/icons/radio-selected.png')
            : require('@/assets/icons/radio-unselected.png')
          }
          onPress={() => onSelect(option)}
        />
      ))}
    </List>
  );
}
```

### Contact List Pattern
```tsx
function ContactList({ contacts }) {
  return (
    <List>
      {contacts.map((contact) => (
        <ListItem
          key={contact.id}
          title={contact.name}
          subtitle={contact.phone}
          leftIcon={require('@/assets/icons/user.png')}
          onPress={() => openContact(contact)}
        />
      ))}
    </List>
  );
}
```

## Accessibility

The List component includes accessibility features:

- **List Role**: Uses `list` role for screen readers
- **Item Navigation**: Proper navigation between list items
- **Screen Reader Support**: Accepts accessibility labels

### Accessibility Props

```tsx
<List
  accessibilityLabel="Settings menu"
  testID="settings-list"
>
  <ListItem title="Notifications" />
  <ListItem title="Privacy" />
</List>
```

## Theme Integration

The component automatically adapts to the current theme:

```tsx
import { useTheme } from '@/src/context/ThemeContext';

function ThemedList() {
  const { isDark } = useTheme();

  return (
    <List
      style={{
        backgroundColor: isDark ? colors.neutral[900] : colors.neutral[0]
      }}
    >
      <ListItem title="Theme-aware item" />
    </List>
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
import { List, ListItem } from '@/components/design-system';

test('renders List with ListItems', () => {
  const { getByTestId } = render(
    <List testID="test-list">
      <ListItem title="Item 1" testID="item-1" />
      <ListItem title="Item 2" testID="item-2" />
    </List>
  );

  expect(getByTestId('test-list')).toBeTruthy();
  expect(getByTestId('item-1')).toBeTruthy();
  expect(getByTestId('item-2')).toBeTruthy();
});

test('applies bordered variant', () => {
  const { getByTestId } = render(
    <List variant="bordered" testID="bordered-list">
      <ListItem title="Item" />
    </List>
  );

  const list = getByTestId('bordered-list');
  expect(list.props.style).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        borderWidth: 1,
        borderColor: expect.any(String)
      })
    ])
  );
});
```

## Migration from Legacy List

### Before (Legacy)
```tsx
// Manual list implementation with inconsistent styling
<View style={{
  backgroundColor: '#FFFFFF',
  borderWidth: 1,
  borderColor: '#E5E5E5',
  borderRadius: 8
}}>
  <TouchableOpacity style={{
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5'
  }}>
    <Text>Title</Text>
  </TouchableOpacity>
</View>
```

### After (Design System)
```tsx
// Uses design tokens and consistent styling
<List variant="bordered">
  <ListItem title="Title" />
</List>
```

## Best Practices

1. **Consistent Item Types**: Use similar ListItem structures within the same list
2. **Clear Actions**: Make interactive items clearly indicate they can be pressed
3. **Icon Consistency**: Use consistent icon styles and sizes
4. **Subtitle Usage**: Only use subtitles when they add meaningful information
5. **Accessibility**: Provide meaningful accessibility labels
6. **Test IDs**: Include test IDs for automated testing
7. **Variant Selection**: Choose the appropriate variant for your use case

## Advanced Usage

### Dynamic List Content
```tsx
function DynamicList({ data, renderItem }) {
  return (
    <List variant="bordered">
      {data.map((item, index) => (
        <React.Fragment key={item.id}>
          {renderItem(item)}
        </React.Fragment>
      ))}
    </List>
  );
}
```

### Sectioned List
```tsx
function SectionedList({ sections }) {
  return (
    <Stack spacing="medium">
      {sections.map((section, index) => (
        <Stack key={section.title} spacing="small">
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#666' }}>
            {section.title}
          </Text>
          <List variant="bordered">
            {section.items.map((item) => (
              <ListItem
                key={item.id}
                title={item.title}
                subtitle={item.subtitle}
                onPress={() => handleItemPress(item)}
              />
            ))}
          </List>
        </Stack>
      ))}
    </Stack>
  );
}
```

### Searchable List
```tsx
function SearchableList({ items, searchQuery }) {
  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <List>
      {filteredItems.map((item) => (
        <ListItem
          key={item.id}
          title={item.title}
          subtitle={item.description}
          leftIcon={item.icon}
          onPress={() => handleItemPress(item)}
        />
      ))}
    </List>
  );
}