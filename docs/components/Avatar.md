# Avatar Component

A flexible avatar component that displays user profile images or initials with design system integration.

## Overview

The Avatar component provides a consistent way to display user profile pictures or initials when images are not available. It supports multiple sizes, variants, and automatically generates initials from names, making it perfect for user profiles, comments, and social features.

## Features

- 🎨 **Design System Integration**: Uses centralized design tokens for consistent styling
- 🌓 **Theme Support**: Automatically adapts to light and dark themes
- 👤 **Smart Initials**: Automatically generates initials from names
- 📏 **Multiple Sizes**: Small, medium, large, and xlarge size options
- 🎯 **Variant Options**: Default and outline variants
- ♿ **Accessibility**: Full accessibility support with proper labels
- ⚡ **Performance**: Memoized for optimal performance

## Import

```tsx
import { Avatar } from '@/components/design-system';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `source` | `ImageSourcePropType` | `undefined` | Image source for the avatar |
| `name` | `string` | `undefined` | Name to generate initials from |
| `size` | `'small' \| 'medium' \| 'large' \| 'xlarge'` | `'medium'` | Avatar size |
| `variant` | `'default' \| 'outline'` | `'default'` | Visual style variant |
| `style` | `ViewStyle` | `undefined` | Custom styles for the container |
| `textStyle` | `TextStyle` | `undefined` | Custom styles for the initials text |
| `testID` | `string` | `undefined` | Test identifier for testing |
| `accessibilityLabel` | `string` | `undefined` | Custom accessibility label |

## Usage Examples

### Basic Avatar with Image

```tsx
import { Avatar } from '@/components/design-system';

function UserAvatar({ user }) {
  return (
    <Avatar
      source={{ uri: user.profileImage }}
      name={user.name}
      size="medium"
      testID="user-avatar"
    />
  );
}
```

### Avatar with Initials

```tsx
<Avatar
  name="John Doe"
  size="large"
/>
```

### Small Avatar for Comments

```tsx
function CommentAvatar({ author }) {
  return (
    <Avatar
      source={author.avatar}
      name={author.name}
      size="small"
      variant="outline"
    />
  );
}
```

### Large Avatar for Profile

```tsx
function ProfileAvatar({ user }) {
  return (
    <Avatar
      source={user.avatar}
      name={user.name}
      size="xlarge"
      style={{ marginBottom: 16 }}
    />
  );
}
```

### Avatar Group

```tsx
function AvatarGroup({ users }) {
  return (
    <Stack direction="horizontal" spacing="tight">
      {users.slice(0, 4).map((user, index) => (
        <Avatar
          key={user.id}
          source={user.avatar}
          name={user.name}
          size="medium"
          style={{ marginLeft: index > 0 ? -8 : 0 }}
        />
      ))}
      {users.length > 4 && (
        <Avatar
          name={`+${users.length - 4}`}
          size="medium"
          variant="outline"
          style={{ marginLeft: -8 }}
        />
      )}
    </Stack>
  );
}
```

### Custom Styled Avatar

```tsx
<Avatar
  name="Custom Avatar"
  size="large"
  variant="outline"
  style={{
    borderWidth: 3,
    borderColor: '#007AFF'
  }}
  textStyle={{
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF'
  }}
/>
```

## Size Options

### Small (32px)
- Perfect for comments, lists, and compact layouts
- Minimal visual impact while maintaining clarity

### Medium (40px) - Default
- Balanced size for most use cases
- Good for navigation bars and cards

### Large (56px)
- Prominent display for featured content
- Ideal for profile headers and hero sections

### XLarge (80px)
- Maximum size for special emphasis
- Best for profile pages and modal headers

## Variant Options

### Default Variant
- Solid background with initials or image
- Standard avatar appearance
- Most common variant

### Outline Variant
- Transparent background with border
- Subtle appearance for secondary content
- Good for grouped avatars

## Initials Generation

The component automatically generates initials from names:

```tsx
// Examples of initials generation
"John Doe"        → "JD"
"John"            → "J"
"Mary Jane Smith" → "MS"
"john doe"        → "JD" (case insensitive)
```

### Custom Initials Logic
```tsx
function getInitials(name) {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}
```

## Common Patterns

### User Profile Pattern
```tsx
function UserProfile({ user, size = 'xlarge' }) {
  return (
    <Stack spacing="medium">
      <Avatar
        source={user.avatar}
        name={user.name}
        size={size}
      />
      <Stack spacing="tight">
        <Text style={{ fontSize: 20, fontWeight: '600', textAlign: 'center' }}>
          {user.name}
        </Text>
        <Text style={{ textAlign: 'center', color: '#666' }}>
          {user.role}
        </Text>
      </Stack>
    </Stack>
  );
}
```

### Comment Avatar Pattern
```tsx
function CommentAvatar({ author, timestamp }) {
  return (
    <Stack direction="horizontal" spacing="medium">
      <Avatar
        source={author.avatar}
        name={author.name}
        size="small"
      />
      <Stack spacing="tight" style={{ flex: 1 }}>
        <Stack direction="horizontal" spacing="small">
          <Text style={{ fontWeight: '600' }}>{author.name}</Text>
          <Text style={{ color: '#666', fontSize: 12 }}>{timestamp}</Text>
        </Stack>
        <Text>{comment.text}</Text>
      </Stack>
    </Stack>
  );
}
```

### Team Members Pattern
```tsx
function TeamMembers({ members }) {
  return (
    <Grid columns={3} spacing="medium">
      {members.map((member) => (
        <Stack key={member.id} spacing="medium">
          <Avatar
            source={member.avatar}
            name={member.name}
            size="large"
          />
          <Stack spacing="tight">
            <Text style={{ fontWeight: '600', textAlign: 'center' }}>
              {member.name}
            </Text>
            <Text style={{ fontSize: 12, textAlign: 'center', color: '#666' }}>
              {member.role}
            </Text>
          </Stack>
        </Stack>
      ))}
    </Grid>
  );
}
```

### Notification Avatar Pattern
```tsx
function NotificationItem({ notification }) {
  return (
    <Stack direction="horizontal" spacing="medium">
      <Avatar
        source={notification.user.avatar}
        name={notification.user.name}
        size="medium"
      />
      <Stack spacing="tight" style={{ flex: 1 }}>
        <Text style={{ fontWeight: '500' }}>
          {notification.title}
        </Text>
        <Text style={{ fontSize: 12, color: '#666' }}>
          {notification.message}
        </Text>
      </Stack>
    </Stack>
  );
}
```

## Accessibility

The Avatar component includes comprehensive accessibility features:

- **Image Role**: Uses `image` role for screen readers
- **Descriptive Labels**: Generates meaningful accessibility labels
- **Alternative Text**: Provides name-based descriptions when images fail
- **Focus Management**: Properly handles focus for interactive avatars

### Accessibility Props

```tsx
<Avatar
  source={user.avatar}
  name={user.name}
  accessibilityLabel={`${user.name}'s profile picture`}
  testID="profile-avatar"
/>
```

## Theme Integration

The component automatically adapts to the current theme:

```tsx
import { useTheme } from '@/src/context/ThemeContext';

function ThemedAvatar() {
  const { isDark } = useTheme();

  return (
    <Avatar
      name="Theme User"
      variant={isDark ? 'outline' : 'default'}
      style={{
        borderColor: isDark ? colors.neutral[600] : colors.neutral[300]
      }}
    />
  );
}
```

## Performance

- **Memoization**: Component is wrapped with `React.memo` for optimal performance
- **Image Optimization**: Supports optimized image loading
- **Style Optimization**: Styles are computed once and memoized
- **Minimal Re-renders**: Only re-renders when props change

## Testing

```tsx
import { render } from '@testing-library/react-native';
import { Avatar } from '@/components/design-system';

test('renders Avatar with image', () => {
  const mockSource = { uri: 'https://example.com/avatar.jpg' };
  const { getByTestId } = render(
    <Avatar
      source={mockSource}
      name="John Doe"
      testID="test-avatar"
    />
  );

  expect(getByTestId('test-avatar')).toBeTruthy();
});

test('renders Avatar with initials when no image', () => {
  const { getByTestId, getByText } = render(
    <Avatar
      name="John Doe"
      testID="test-avatar"
    />
  );

  expect(getByTestId('test-avatar')).toBeTruthy();
  expect(getByText('JD')).toBeTruthy();
});

test('applies different sizes correctly', () => {
  const { getByTestId } = render(
    <Avatar
      name="Test User"
      size="large"
      testID="large-avatar"
    />
  );

  const avatar = getByTestId('large-avatar');
  expect(avatar.props.style).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        width: 56,  // large size
        height: 56,
        borderRadius: 28
      })
    ])
  );
});

test('applies outline variant correctly', () => {
  const { getByTestId } = render(
    <Avatar
      name="Test User"
      variant="outline"
      testID="outline-avatar"
    />
  );

  const avatar = getByTestId('outline-avatar');
  expect(avatar.props.style).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        backgroundColor: 'transparent',
        borderWidth: 2
      })
    ])
  );
});
```

## Migration from Legacy Avatar

### Before (Legacy)
```tsx
// Manual avatar implementation with hard-coded styles
<View style={{
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: '#007AFF',
  alignItems: 'center',
  justifyContent: 'center'
}}>
  <Text style={{
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  }}>
    JD
  </Text>
</View>
```

### After (Design System)
```tsx
// Uses design tokens and consistent styling
<Avatar
  name="John Doe"
  size="medium"
/>
```

## Best Practices

1. **Consistent Sizing**: Use appropriate sizes for different contexts
2. **Name Priority**: Always provide names for fallback initials
3. **Image Optimization**: Use appropriately sized images for better performance
4. **Accessibility**: Provide meaningful accessibility labels
5. **Variant Selection**: Choose variants based on visual hierarchy needs
6. **Test IDs**: Include test IDs for automated testing
7. **Error Handling**: Handle image loading errors gracefully

## Advanced Usage

### Avatar with Status Indicator
```tsx
function AvatarWithStatus({ user, isOnline }) {
  return (
    <View>
      <Avatar
        source={user.avatar}
        name={user.name}
        size="medium"
      />
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: isOnline ? '#22C55E' : '#6B7280',
          borderWidth: 2,
          borderColor: '#FFFFFF'
        }}
      />
    </View>
  );
}
```

### Interactive Avatar
```tsx
function InteractiveAvatar({ user, onPress }) {
  return (
    <TouchableOpacity onPress={() => onPress(user)}>
      <Avatar
        source={user.avatar}
        name={user.name}
        size="large"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2
        }}
      />
    </TouchableOpacity>
  );
}
```

### Avatar Upload
```tsx
function AvatarUpload({ currentAvatar, onImageSelect }) {
  return (
    <TouchableOpacity onPress={onImageSelect}>
      <Avatar
        source={currentAvatar}
        name="Upload Avatar"
        size="xlarge"
        variant="outline"
        style={{
          borderStyle: 'dashed',
          borderWidth: 2
        }}
      />
      <Text style={{
        position: 'absolute',
        bottom: -20,
        textAlign: 'center',
        width: '100%',
        fontSize: 12,
        color: '#666'
      }}>
        Tap to upload
      </Text>
    </TouchableOpacity>
  );
}
```

## Related Components

- [`List`](List.md) - List container component
- [`ListItem`](ListItem.md) - Individual list item component
- [`Chip`](Chip.md) - Interactive chip component

## Image Requirements

For optimal performance and appearance:

- **Format**: Use WebP, PNG, or JPEG formats
- **Size**: Provide appropriately sized images (1.5x-2x target size)
- **Aspect Ratio**: Square images work best
- **Optimization**: Compress images for faster loading
- **Fallback**: Always provide names for fallback initials

```tsx
// Recommended image sizes for different avatar sizes
const avatarImageSizes = {
  small: 48,    // 32px * 1.5
  medium: 60,   // 40px * 1.5
  large: 84,    // 56px * 1.5
  xlarge: 120   // 80px * 1.5
};