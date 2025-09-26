# Modal Component

A flexible modal overlay component with design system integration, supporting different variants, sizes, and comprehensive accessibility features.

## Overview

The Modal component provides a robust foundation for displaying overlay content, forms, dialogs, and notifications. It supports multiple variants (default, fullscreen, bottom sheet), different sizes, and includes proper focus management, keyboard handling, and accessibility features.

## Features

- 🎨 **Design System Integration**: Uses centralized design tokens for consistent styling
- 🌓 **Theme Support**: Automatically adapts to light and dark themes
- 🌍 **RTL Support**: Properly handles right-to-left layouts for Arabic
- 📱 **Multiple Variants**: Default, fullscreen, and bottom sheet variants
- 📏 **Flexible Sizing**: Small, medium, and large size options
- ♿ **Accessibility**: Full accessibility support with focus management
- ⌨️ **Keyboard Support**: Escape key and hardware back button support
- ⚡ **Performance**: Memoized for optimal performance

## Import

```tsx
import { Modal } from '@/components/design-system';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | **Required** | Controls modal visibility |
| `onClose` | `() => void` | `undefined` | Callback when modal should be closed |
| `title` | `string` | `undefined` | Modal title text |
| `subtitle` | `string` | `undefined` | Modal subtitle text |
| `children` | `React.ReactNode` | **Required** | Content to be displayed in the modal |
| `variant` | `'default' \| 'fullscreen' \| 'bottomSheet'` | `'default'` | Modal display variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Modal size (affects default variant only) |
| `style` | `ViewStyle` | `undefined` | Custom styles for the modal container |
| `overlayStyle` | `ViewStyle` | `undefined` | Custom styles for the overlay |
| `contentStyle` | `ViewStyle` | `undefined` | Custom styles for the content area |
| `titleStyle` | `TextStyle` | `undefined` | Custom styles for the title text |
| `subtitleStyle` | `TextStyle` | `undefined` | Custom styles for the subtitle text |
| `closeButton` | `boolean` | `true` | Whether to show the close button |
| `testID` | `string` | `undefined` | Test identifier for testing |
| `accessibilityLabel` | `string` | `undefined` | Accessibility label for screen readers |

## Usage Examples

### Basic Modal

```tsx
import { Modal } from '@/components/design-system';

function BasicModal() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button title="Open Modal" onPress={() => setVisible(true)} />

      <Modal
        visible={visible}
        onClose={() => setVisible(false)}
        title="Basic Modal"
        subtitle="This is a basic modal example"
      >
        <Text>Modal content goes here</Text>
        <Button title="Close" onPress={() => setVisible(false)} />
      </Modal>
    </>
  );
}
```

### Confirmation Dialog

```tsx
function ConfirmationModal({ visible, onConfirm, onCancel, itemName }) {
  return (
    <Modal
      visible={visible}
      onClose={onCancel}
      title="Confirm Deletion"
      size="small"
    >
      <Text>Are you sure you want to delete "{itemName}"?</Text>
      <Text>This action cannot be undone.</Text>

      <Stack direction="horizontal" spacing="medium" style={{ marginTop: 24 }}>
        <Button
          title="Cancel"
          variant="secondary"
          onPress={onCancel}
          style={{ flex: 1 }}
        />
        <Button
          title="Delete"
          variant="primary"
          onPress={onConfirm}
          style={{ flex: 1 }}
        />
      </Stack>
    </Modal>
  );
}
```

### Fullscreen Modal

```tsx
<Modal
  visible={visible}
  onClose={() => setVisible(false)}
  title="Fullscreen View"
  variant="fullscreen"
>
  <ImageViewer images={images} />
</Modal>
```

### Bottom Sheet Modal

```tsx
<Modal
  visible={visible}
  onClose={() => setVisible(false)}
  title="Select Option"
  variant="bottomSheet"
  size="large"
>
  <Stack spacing="medium">
    <TouchableOpacity onPress={() => handleOption('option1')}>
      <Text>Option 1</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => handleOption('option2')}>
      <Text>Option 2</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => handleOption('option3')}>
      <Text>Option 3</Text>
    </TouchableOpacity>
  </Stack>
</Modal>
```

### Form Modal

```tsx
function AddItemModal({ visible, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    onSubmit({ name, description });
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Add New Item"
      size="medium"
    >
      <Stack spacing="medium">
        <TextInput
          placeholder="Item name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <Button title="Add Item" onPress={handleSubmit} />
      </Stack>
    </Modal>
  );
}
```

### Image Viewer Modal

```tsx
function ImageModal({ visible, onClose, imageUrl, title }) {
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={title}
      variant="fullscreen"
      closeButton={true}
    >
      <Image
        source={{ uri: imageUrl }}
        style={{ width: '100%', height: '100%' }}
        resizeMode="contain"
      />
    </Modal>
  );
}
```

## Variants

### Default Variant
- Centered modal with backdrop
- Supports small, medium, and large sizes
- Most common variant for dialogs and forms

### Fullscreen Variant
- Takes up the entire screen
- No border radius or padding
- Ideal for image viewers, maps, or full-screen content

### Bottom Sheet Variant
- Slides up from the bottom
- Maximum height of 80% of screen
- Perfect for action sheets and selection menus

## Size Options

### Small
- Maximum width: 320px
- Ideal for simple dialogs and confirmations
- Compact footprint

### Medium (Default)
- Maximum width: 400px
- Most common size for forms and content
- Good balance of space and usability

### Large
- Maximum width: 480px
- Best for complex forms or detailed content
- Maximum width for readability

## Modal Structure

```
┌─────────────────────────────────────────┐
│                                         │
│           [Close Button]                │
│                                         │
│  ┌─────────────────────────────────────┐ │
│  │             Title                   │ │
│  │           Subtitle                  │ │
│  └─────────────────────────────────────┘ │
│                                         │
│  ┌─────────────────────────────────────┐ │
│  │           Content Area              │ │
│  │                                     │ │
│  └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
     ↑              ↑                      ↑
  Overlay      Modal Container       Content
```

## Accessibility

The Modal component includes comprehensive accessibility features:

- **Focus Management**: Automatically traps focus within the modal
- **Keyboard Navigation**: Supports Escape key to close
- **Screen Reader Support**: Proper accessibility labels and roles
- **Backdrop Interaction**: Backdrop press closes modal (optional)
- **ARIA Support**: Proper ARIA attributes for modal dialog

### Accessibility Props

```tsx
<Modal
  visible={visible}
  onClose={onClose}
  title="Delete Item"
  accessibilityLabel="Delete confirmation dialog"
  testID="delete-modal"
>
  <Text>Are you sure you want to delete this item?</Text>
</Modal>
```

## Theme Integration

The component automatically adapts to the current theme:

```tsx
import { useTheme } from '@/src/context/ThemeContext';

function ThemedModal() {
  const { isDark } = useTheme();

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Themed Modal"
      style={{
        backgroundColor: isDark ? colors.neutral[800] : colors.neutral[0]
      }}
    >
      <Text>Theme-aware modal content</Text>
    </Modal>
  );
}
```

## RTL Support

The component automatically handles RTL layouts:

```tsx
import { useRTL } from '@/src/hooks/useRTL';

function RTLModal() {
  const { isRTL } = useRTL();

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="RTL Modal"
      // Close button automatically positions correctly for RTL
      // Text alignment automatically adjusts
    >
      <Text>Content that works in RTL layouts</Text>
    </Modal>
  );
}
```

## Keyboard and Hardware Support

### Keyboard Support
- **Escape Key**: Closes the modal (when `onClose` is provided)
- **Tab Navigation**: Focus stays within the modal
- **Enter Key**: Can trigger default actions

### Hardware Back Button
- **Android**: Automatically closes modal on back press
- **iOS**: Respects system navigation patterns

## Performance

- **Memoization**: Component is wrapped with `React.memo` for optimal performance
- **Style Optimization**: Styles are computed once and memoized
- **Minimal Re-renders**: Only re-renders when visibility or props change
- **Backdrop Press**: Optimized touch handling for backdrop dismissal

## Testing

```tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Modal } from '@/components/design-system';

test('renders Modal when visible', () => {
  const { getByTestId, getByText } = render(
    <Modal
      visible={true}
      onClose={jest.fn()}
      title="Test Modal"
      testID="test-modal"
    >
      <Text>Modal Content</Text>
    </Modal>
  );

  expect(getByTestId('test-modal')).toBeTruthy();
  expect(getByText('Test Modal')).toBeTruthy();
  expect(getByText('Modal Content')).toBeTruthy();
});

test('calls onClose when close button is pressed', () => {
  const mockOnClose = jest.fn();
  const { getByTestId } = render(
    <Modal
      visible={true}
      onClose={mockOnClose}
      title="Test Modal"
      testID="test-modal"
    >
      <Text>Modal Content</Text>
    </Modal>
  );

  fireEvent.press(getByTestId('test-modal-close-button'));
  expect(mockOnClose).toHaveBeenCalled();
});

test('calls onClose when backdrop is pressed', () => {
  const mockOnClose = jest.fn();
  const { getByTestId } = render(
    <Modal
      visible={true}
      onClose={mockOnClose}
      title="Test Modal"
      testID="test-modal"
    >
      <Text>Modal Content</Text>
    </Modal>
  );

  // Find and press the overlay (backdrop)
  const overlay = getByTestId('test-modal').parent;
  fireEvent.press(overlay);
  expect(mockOnClose).toHaveBeenCalled();
});

test('does not render when not visible', () => {
  const { queryByTestId } = render(
    <Modal
      visible={false}
      onClose={jest.fn()}
      title="Test Modal"
      testID="test-modal"
    >
      <Text>Modal Content</Text>
    </Modal>
  );

  expect(queryByTestId('test-modal')).toBeNull();
});
```

## Migration from Legacy Modal

### Before (Legacy)
```tsx
// Manual modal implementation with hard-coded styles
<Modal visible={visible} animationType="fade" transparent>
  <TouchableOpacity
    style={{
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center'
    }}
    onPress={() => setVisible(false)}
    activeOpacity={1}
  >
    <TouchableOpacity
      style={{
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        margin: 20,
        maxWidth: 400
      }}
      onPress={() => {}} // Prevent backdrop press
      activeOpacity={1}
    >
      <Text style={{ fontSize: 18, fontWeight: '600' }}>Title</Text>
      <Text>Content</Text>
    </TouchableOpacity>
  </TouchableOpacity>
</Modal>
```

### After (Design System)
```tsx
// Uses design tokens and centralized styling
<Modal
  visible={visible}
  onClose={() => setVisible(false)}
  title="Title"
  size="medium"
>
  <Text>Content</Text>
</Modal>
```

## Best Practices

1. **Clear Purpose**: Each modal should have a single, clear purpose
2. **Descriptive Titles**: Use clear, descriptive titles and subtitles
3. **Action Buttons**: Provide clear primary and secondary actions
4. **Close Options**: Always provide multiple ways to close (button, backdrop, escape)
5. **Content Length**: Keep modal content concise and scannable
6. **Accessibility**: Provide meaningful accessibility labels
7. **Test IDs**: Include test IDs for automated testing
8. **Focus Management**: Ensure focus is properly managed within the modal

## Common Patterns

### Alert Dialog Pattern
```tsx
function AlertModal({ visible, title, message, onConfirm }) {
  return (
    <Modal
      visible={visible}
      onClose={onConfirm}
      title={title}
      size="small"
    >
      <Text style={{ textAlign: 'center', marginBottom: 24 }}>{message}</Text>
      <Button title="OK" onPress={onConfirm} />
    </Modal>
  );
}
```

### Form Modal Pattern
```tsx
function FormModal({ visible, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Edit Item"
      size="medium"
    >
      <FormFields data={formData} onChange={setFormData} />
      <ModalActions onCancel={onClose} onSubmit={handleSubmit} />
    </Modal>
  );
}
```

### Action Sheet Pattern
```tsx
function ActionSheetModal({ visible, onClose, actions }) {
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      variant="bottomSheet"
      size="large"
      title="Choose Action"
    >
      <Stack spacing="none">
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={{
              padding: 16,
              borderBottomWidth: index < actions.length - 1 ? 1 : 0,
              borderBottomColor: '#E5E5E5'
            }}
            onPress={() => {
              action.onPress();
              onClose();
            }}
          >
            <Text>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </Stack>
    </Modal>
  );
}
```

### Loading Modal Pattern
```tsx
function LoadingModal({ visible, message = 'Loading...' }) {
  return (
    <Modal
      visible={visible}
      title={message}
      size="small"
      closeButton={false}
    >
      <Loading size="large" />
    </Modal>
  );
}
```

## Related Components

- [`Container`](Container.md) - Layout container component
- [`Stack`](Stack.md) - Stacking layout component
- [`Loading`](Loading.md) - Loading indicator component

## Advanced Usage

### Nested Modals
```tsx
function NestedModal({ visible, onClose }) {
  const [secondModalVisible, setSecondModalVisible] = useState(false);

  return (
    <>
      <Modal
        visible={visible}
        onClose={onClose}
        title="First Modal"
      >
        <Text>First modal content</Text>
        <Button
          title="Open Second Modal"
          onPress={() => setSecondModalVisible(true)}
        />
      </Modal>

      <Modal
        visible={secondModalVisible}
        onClose={() => setSecondModalVisible(false)}
        title="Second Modal"
        size="small"
      >
        <Text>Second modal content</Text>
      </Modal>
    </>
  );
}
```

### Dynamic Content Modal
```tsx
function DynamicModal({ visible, onClose, contentType }) {
  const renderContent = () => {
    switch (contentType) {
      case 'form':
        return <UserForm />;
      case 'gallery':
        return <ImageGallery />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <Text>Default content</Text>;
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={`${contentType} Modal`}
      size={contentType === 'gallery' ? 'large' : 'medium'}
    >
      {renderContent()}
    </Modal>
  );
}
```

### Wizard Modal Pattern
```tsx
function WizardModal({ visible, onClose, steps, currentStep }) {
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={steps[currentStep].title}
      subtitle={`${currentStep + 1} of ${steps.length}`}
      size="medium"
    >
      <steps[currentStep].component />

      <Stack direction="horizontal" spacing="medium" style={{ marginTop: 24 }}>
        <Button
          title="Previous"
          variant="secondary"
          onPress={handlePrevious}
          disabled={currentStep === 0}
        />
        <Button
          title={currentStep === steps.length - 1 ? 'Finish' : 'Next'}
          variant="primary"
          onPress={handleNext}
        />
      </Stack>
    </Modal>
  );
}