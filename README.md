# RuknApp v2

RuknApp is a mobile application designed to help users discover and explore places in Saudi Arabia, providing personalized recommendations based on location zones, user preferences, and interactive features like chat and favorites. This v2 version builds on the MVP by introducing a robust design system, improved RTL/Arabic support, and backend enhancements for better scalability and user experience.

## Live Demo
- **URL:** https://rukn-app.vercel.app (deployed via Vercel for live access)
- **Demo Video:** [https://youtube.com/ruknapp-demo](https://youtube.com/shorts/gwBjm14zVEQ?feature=share) (a walkthrough video on YouTube)

## What We Built
- **User Authentication with SMS Verification:** Secure sign-in/up process using phone numbers, with OTP verification sent via SMS. Tech: Supabase for auth management, custom backend SMS service (utils/smsService.js) integrated with providers like Twilio.
- **Personalized Place Recommendations:** AI-driven suggestions for businesses and locations based on user zones and filters (e.g., business types, sorting). Tech: Node.js/Express backend API (routes/recommendations.js), zoneRecommendations utils for logic.
- **Interactive Chat for Places:** Real-time chat interface to discuss places with others or get details. Tech: chatScreen.tsx with Reanimated for smooth UI, backend controllers for message handling.
- **Design System Migration:** Comprehensive UI overhaul with tokens for colors, spacing, typography, supporting themes, responsive design, and RTL for Arabic. Tech: Custom design tokens (constants/design-tokens.ts), migration scripts (scripts/migrate-*.js), components/design-system/ for reusable Button/Card/TextInput.

## Before/After Comparison
| MVP Version | V2 Version |
|-------------|------------|
| ![MVP Screenshot](assets/images/UI.png) | ![V2 Screenshot](assets/images/CUi.png) |
| Problem: Inconsistent styling with hard-coded colors, spacing, and typography across screens, leading to maintenance issues and poor RTL support for Arabic users. No unified theme or responsive behavior. | Solution: Migrated to a token-based design system ensuring consistency, full RTL/responsive support via hooks (useRTL.ts, useResponsive.ts), and theme switching (ThemeContext.tsx). Automated scripts validated changes with tests (__tests__/design-system/). |

## Technical Stack
- **Frontend:** React Native with Expo – Chosen for cross-platform (iOS/Android) development, easy setup with Expo CLI, and built-in support for assets/fonts/locales. Enables rapid prototyping and native performance.
- **Backend:** Node.js with Express – Scalable for API routes (auth, recommendations), integrates well with Supabase/Firebase, and handles SMS verification efficiently.
- **Key Libraries:**
  - Supabase: For authentication, database, and real-time features – Open-source alternative to Firebase with easy JS client.
  - Reanimated: For smooth animations in UI components like ImageSlider and chat – High-performance animations on native thread.
  - i18next: For internationalization (ar.json/en.json) – Supports RTL and locale switching seamlessly.
  - Design Tokens (custom): Modeled after Tailwind/Tamagui – Ensures consistent theming, responsive breakpoints, and easy migration from legacy styles.

## 🎨 Design System

The RuknApp v2 features a comprehensive design system that ensures visual consistency, accessibility, and maintainability across the entire application. The design system is built on design tokens and provides reusable components with built-in theme support and RTL compatibility.

### Design System Features

- **🎯 Design Tokens**: Centralized color palette, typography scale, and spacing system
- **🌓 Theme Support**: Light and dark theme support with automatic switching
- **🌍 RTL Support**: Right-to-left language support for Arabic localization
- **📱 Responsive Design**: Adaptive layouts that work across different screen sizes
- **♿ Accessibility**: WCAG compliant components with proper accessibility labels
- **⚡ Performance**: Memoized components with optimized re-renders
- **🧪 Well Tested**: Comprehensive test coverage for all design system components

### Core Components

#### Navigation Components
- **TabBar**: Flexible bottom tab navigation with icon and label support
- **NavigationBar**: Top navigation bar for headers and navigation

#### Layout Components
- **Container**: Flexible content container with size and padding options
- **Stack**: Vertical and horizontal stacking with spacing control
- **Grid**: Responsive grid system for layout organization

#### Feedback Components
- **Modal**: Flexible modal system with overlay, bottom sheet, and fullscreen variants
- **Loading**: Loading indicators and spinners
- **Skeleton**: Skeleton screens for loading states

#### Data Display Components
- **List**: Container for list items with consistent styling
- **Avatar**: User avatar component with various sizes and styles
- **Chip**: Small interactive elements for tags, filters, and selections

### Design System Structure

```
components/design-system/
├── TabBar/           # Bottom tab navigation
├── NavigationBar/    # Top navigation bar
├── Container/        # Layout container
├── Stack/           # Stacking component
├── Grid/            # Grid layout system
├── Modal/           # Modal and overlay system
├── List/            # List container
├── Avatar/          # User avatar component
├── Chip/            # Interactive chip component
├── Loading/         # Loading indicators
├── Skeleton/        # Skeleton loading states
└── index.ts         # Centralized exports
```

### Usage Examples

#### Basic Container Usage
```tsx
import { Container } from '@/components/design-system';

function MyScreen() {
 return (
   <Container size="full" padding="medium" centered>
     <Text>My Content</Text>
   </Container>
 );
}
```

#### TabBar Implementation
```tsx
import { TabBar } from '@/components/design-system';

const tabs = [
 { key: 'home', title: 'Home', icon: require('@/assets/icons/home.png') },
 { key: 'profile', title: 'Profile', icon: require('@/assets/icons/user.png') },
];

function BottomTabs() {
 return (
   <TabBar
     tabs={tabs}
     activeTab={activeTab}
     onTabPress={setActiveTab}
     showLabels={true}
   />
 );
}
```

#### Modal Usage
```tsx
import { Modal } from '@/components/design-system';

function MyComponent() {
 const [visible, setVisible] = useState(false);

 return (
   <Modal
     visible={visible}
     onClose={() => setVisible(false)}
     title="Confirm Action"
     variant="default"
     size="medium"
   >
     <Text>Modal content goes here</Text>
   </Modal>
 );
}
```

### Design Tokens

The design system uses centralized tokens for consistency:

```typescript
import { colors, typography, spacing } from '@/constants/design-tokens';

// Colors
const primaryColor = colors.primary[500];
const backgroundColor = colors.neutral[0];

// Typography
const headingStyle = typography.heading.h1;
const bodyStyle = typography.body.medium;

// Spacing
const margin = spacing[4]; // 16px
const padding = spacing[6]; // 24px
```

### Theme Integration

All components automatically adapt to the current theme:

```tsx
import { useTheme } from '@/src/context/ThemeContext';

function ThemedComponent() {
 const { isDark, toggleTheme } = useTheme();

 return (
   <View style={{ backgroundColor: isDark ? colors.neutral[900] : colors.neutral[0] }}>
     <Button title="Toggle Theme" onPress={toggleTheme} />
   </View>
 );
}
```

### RTL Support

Components automatically handle RTL layouts:

```tsx
import { useRTL } from '@/src/hooks/useRTL';

function RTLComponent() {
 const { isRTL } = useRTL();

 return (
   <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
     <Text>Content that adapts to text direction</Text>
   </View>
 );
}
```

### Testing

The design system includes comprehensive tests:

```bash
# Run design system tests
npm test components/design-system/

# Run specific component tests
npm test TabBar.test.tsx
npm test DesignTokens.test.ts
```

### Documentation

For detailed component documentation, see:
- [`DESIGN_SYSTEM_SPECIFICATION.md`](DESIGN_SYSTEM_SPECIFICATION.md) - Complete design system specification
- [`docs/components/`](docs/components/) - Individual component documentation (auto-generated)

### Migration from Legacy Components

To migrate from old components:

1. **Replace hardcoded styles** with design tokens
2. **Update component imports** to use design system versions
3. **Add accessibility props** where missing
4. **Test RTL compatibility** for Arabic layouts
5. **Verify theme compatibility** in both light and dark modes

See [`MIGRATION_GUIDE.md`](MIGRATION_GUIDE.md) for detailed migration instructions.

## 🚀 Getting Started
1. Clone the repository
   ```
   git clone https://github.com/MQHANAD/RuknApp.git
   cd RuknApp
   npm install --legacy-peer-deps
   ```
2. Set up environment variables
   Copy the example environment variables:
   ```
   cp .env.example .env  # If an example file exists
   # Or create a new .env file with the required variables
   ```
3. Run the app
   ```
   npm start
   ```

## Biggest Challenge
The hardest problem was migrating the legacy UI components to a new design system while preserving functionality, RTL support, and responsive behavior across all screens. Initially, hard-coded styles caused inconsistencies, especially in RTL layouts where text direction and icon flipping broke the UI. I solved this by creating automated migration scripts (migrate-colors.js, migrate-spacing.js, migrate-typography.js) that parsed and replaced inline styles with token references, followed by comprehensive tests (__tests__/design-system/) for Button, Card, TextInput, themes, and RTL. Validation reports (migration-validation-report.md) confirmed 100% coverage, and hooks like useColorScheme.ts/useRTL.ts ensured dynamic adaptations. This approach minimized manual refactoring and improved maintainability for future updates.

## 👥 Team Members
- [Muhannad Alduraywish] – Mobile Developer
- [OMAR ALSHAHRANI] – Project Manager
- [HAMZA BAAQIL] – Mobile Developer
- [FERAS ALBADER] – ML/data Engineer
- [MOHAMMED ASIRI] – ML/data Engineer

Additional notes: See DEPLOYMENT.md for production setup, MIGRATION_GUIDE.md for v1 to v2 changes, and PROJECT_STRUCTURE.md for file organization.
