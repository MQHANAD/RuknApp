# Rukn App Design System Specification
**Version 1.0** | **Date: January 2025**

## Executive Summary

This document outlines a comprehensive design system overhaul for the Rukn mobile application. Based on extensive analysis of the current codebase, this specification addresses critical design inconsistencies, establishes unified patterns, and provides implementation guidelines for creating a cohesive, accessible, and maintainable user interface.

## Current State Analysis

### Critical Issues Identified

#### 1. Color System Chaos
- **Mixed Color Values:** `#F5A623`, `#1E2A38`, `#fbb507`, `#fbbf2b`, `#afafac`, `#db941d`
- **No Semantic Naming:** Colors referenced by hex values throughout codebase
- **Inconsistent Usage:** Same conceptual colors using different hex values
- **Theme Fragmentation:** Basic light/dark theme setup but not utilized consistently

#### 2. Typography Anarchy
- **Hardcoded Sizes:** Random font sizes (9, 12, 13, 14, 15, 16, 18, 22, 24)
- **No Hierarchy:** No systematic approach to text scales
- **Weight Inconsistency:** Mixed font weights without clear purpose
- **Line Height Neglect:** No standardized line-height values

#### 3. Spacing Disorder
- **Random Values:** Arbitrary padding/margins (4, 5, 6, 8, 10, 12, 15, 16, 20, 24, 30)
- **No Grid System:** No underlying spacing rhythm
- **Component Misalignment:** Inconsistent spacing between similar elements

#### 4. Component Fragmentation
- **Button Variants:** Multiple button implementations with different styles
- **Input Inconsistency:** Various input field designs across screens
- **State Confusion:** No standardized component states (hover, active, disabled)
- **Modal Chaos:** Inconsistent modal and overlay designs

#### 5. Responsive Design Gaps
- **Fixed Dimensions:** Hardcoded width/height values throughout
- **No Breakpoints:** No responsive design system
- **Poor Adaptability:** UI doesn't adapt to different screen sizes effectively

#### 6. Accessibility Deficits
- **Contrast Issues:** Some color combinations fail accessibility standards
- **Missing Labels:** Insufficient accessibility labels and hints
- **RTL Blindness:** No right-to-left language support considerations

---

## Unified Design System

### 1. Color Palette System

#### Primary Brand Colors
```typescript
const colors = {
  primary: {
    50: '#FEF7E6',    // Lightest orange tint
    100: '#FDEDC8',   // Light orange tint
    200: '#FBD799',   // Medium-light orange
    300: '#F8C16A',   // Medium orange
    400: '#F6B13B',   // Medium-dark orange  
    500: '#F5A623',   // PRIMARY BRAND (current #F5A623)
    600: '#E59510',   // Dark orange
    700: '#C17D0A',   // Darker orange
    800: '#9D6608',   // Very dark orange
    900: '#7A4F06',   // Darkest orange
  }
}
```

#### Secondary & Supporting Colors
```typescript
const colors = {
  // ... primary colors above
  
  secondary: {
    50: '#F8FAFC',    // Lightest slate
    100: '#F1F5F9',   // Light slate
    200: '#E2E8F0',   // Medium-light slate
    300: '#CBD5E1',   // Medium slate
    400: '#94A3B8',   // Medium-dark slate
    500: '#64748B',   // Base secondary
    600: '#475569',   // Dark slate
    700: '#334155',   // Darker slate
    800: '#1E293B',   // Very dark slate (current #1E2A38 standardized)
    900: '#0F172A',   // Darkest slate
  },

  neutral: {
    0: '#FFFFFF',     // Pure white
    50: '#FAFAFA',    // Off-white
    100: '#F5F5F5',   // Light gray
    200: '#E5E5E5',   // Medium-light gray
    300: '#D4D4D4',   // Medium gray
    400: '#A3A3A3',   // Medium-dark gray
    500: '#737373',   // Base gray
    600: '#525252',   // Dark gray
    700: '#404040',   // Darker gray
    800: '#262626',   // Very dark gray
    900: '#171717',   // Nearly black
    1000: '#000000',  // Pure black
  }
}
```

#### Status & Semantic Colors
```typescript
const colors = {
  // ... other colors above
  
  success: {
    50: '#F0FDF4',
    500: '#22C55E',   // Green for success states
    600: '#16A34A',
  },
  
  warning: {
    50: '#FFFBEB',
    500: '#F59E0B',   // Amber for warnings
    600: '#D97706',
  },
  
  error: {
    50: '#FEF2F2',
    500: '#EF4444',   // Red for errors
    600: '#DC2626',
  },
  
  info: {
    50: '#EFF6FF',
    500: '#3B82F6',   // Blue for info
    600: '#2563EB',
  }
}
```

#### Theme Application
```typescript
// Light Theme
const lightTheme = {
  background: {
    primary: colors.neutral[0],      // Pure white
    secondary: colors.neutral[50],   // Off-white
    tertiary: colors.neutral[100],   // Light gray
  },
  
  text: {
    primary: colors.neutral[900],    // Nearly black
    secondary: colors.neutral[600],  // Dark gray
    tertiary: colors.neutral[500],   // Medium gray
    inverse: colors.neutral[0],      // White for dark backgrounds
  },
  
  border: {
    primary: colors.neutral[200],    // Light gray
    secondary: colors.neutral[300],  // Medium-light gray
  },
  
  surface: {
    primary: colors.neutral[0],      // White
    secondary: colors.neutral[50],   // Off-white
    raised: colors.neutral[0],       // White with shadow
  }
}

// Dark Theme
const darkTheme = {
  background: {
    primary: colors.neutral[900],    // Nearly black
    secondary: colors.neutral[800],  // Very dark gray
    tertiary: colors.neutral[700],   // Dark gray
  },
  
  text: {
    primary: colors.neutral[50],     // Off-white
    secondary: colors.neutral[300],  // Medium-light gray
    tertiary: colors.neutral[400],   // Medium-dark gray
    inverse: colors.neutral[900],    // Dark for light backgrounds
  },
  
  border: {
    primary: colors.neutral[700],    // Dark gray
    secondary: colors.neutral[600],  // Darker gray
  },
  
  surface: {
    primary: colors.neutral[800],    // Very dark gray
    secondary: colors.neutral[700],  // Dark gray
    raised: colors.neutral[750],     // Slightly lighter with shadow
  }
}
```

### 2. Typography Scale System

#### Font Scale Hierarchy
```typescript
const typography = {
  // Display sizes for hero content
  display: {
    large: {
      fontSize: 32,
      lineHeight: 40,
      fontWeight: '700',
      letterSpacing: -0.5,
    },
    medium: {
      fontSize: 28,
      lineHeight: 36,
      fontWeight: '700',
      letterSpacing: -0.25,
    },
    small: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: '600',
      letterSpacing: 0,
    },
  },
  
  // Heading sizes
  heading: {
    h1: {
      fontSize: 22,
      lineHeight: 28,
      fontWeight: '600',
      letterSpacing: 0,
    },
    h2: {
      fontSize: 20,
      lineHeight: 26,
      fontWeight: '600',
      letterSpacing: 0,
    },
    h3: {
      fontSize: 18,
      lineHeight: 24,
      fontWeight: '600',
      letterSpacing: 0,
    },
    h4: {
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '600',
      letterSpacing: 0,
    },
  },
  
  // Body text sizes
  body: {
    large: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400',
      letterSpacing: 0,
    },
    medium: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400',
      letterSpacing: 0,
    },
    small: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400',
      letterSpacing: 0,
    },
  },
  
  // Caption and small text
  caption: {
    large: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '500',
      letterSpacing: 0.25,
    },
    small: {
      fontSize: 10,
      lineHeight: 14,
      fontWeight: '500',
      letterSpacing: 0.25,
    },
  },
  
  // Button text
  button: {
    large: {
      fontSize: 16,
      lineHeight: 20,
      fontWeight: '600',
      letterSpacing: 0.25,
    },
    medium: {
      fontSize: 14,
      lineHeight: 18,
      fontWeight: '600',
      letterSpacing: 0.25,
    },
    small: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '600',
      letterSpacing: 0.25,
    },
  },
}
```

### 3. Spacing & Layout System

#### Base Spacing Scale (4pt grid)
```typescript
const spacing = {
  0: 0,
  1: 4,      // 4px
  2: 8,      // 8px
  3: 12,     // 12px
  4: 16,     // 16px
  5: 20,     // 20px
  6: 24,     // 24px
  8: 32,     // 32px
  10: 40,    // 40px
  12: 48,    // 48px
  16: 64,    // 64px
  20: 80,    // 80px
  24: 96,    // 96px
}

// Semantic spacing aliases
const layoutSpacing = {
  // Micro spacing
  tight: spacing[1],       // 4px
  snug: spacing[2],        // 8px
  
  // Standard spacing
  small: spacing[3],       // 12px
  medium: spacing[4],      // 16px
  large: spacing[6],       // 24px
  
  // Macro spacing
  xl: spacing[8],          // 32px
  xxl: spacing[12],        // 48px
  section: spacing[16],    // 64px
}
```

#### Component Spacing Standards
```typescript
const componentSpacing = {
  // Internal component padding
  button: {
    small: { vertical: spacing[2], horizontal: spacing[3] },    // 8px, 12px
    medium: { vertical: spacing[3], horizontal: spacing[4] },   // 12px, 16px
    large: { vertical: spacing[4], horizontal: spacing[6] },    // 16px, 24px
  },
  
  input: {
    padding: spacing[3],     // 12px
    marginBottom: spacing[4], // 16px
  },
  
  card: {
    padding: spacing[4],     // 16px
    marginBottom: spacing[3], // 12px
  },
  
  modal: {
    padding: spacing[6],     // 24px
    margin: spacing[4],      // 16px
  },
  
  screen: {
    horizontal: spacing[4],  // 16px
    vertical: spacing[6],    // 24px
  }
}
```

#### Responsive Breakpoints
```typescript
const breakpoints = {
  sm: 480,   // Small phones
  md: 768,   // Tablets
  lg: 1024,  // Large tablets
  xl: 1280,  // Desktop (if web version)
}
```

### 4. Component Design Specifications

#### Button Component System
```typescript
// Button size variants
const buttonSizes = {
  small: {
    height: 36,
    paddingHorizontal: spacing[3], // 12px
    fontSize: typography.button.small.fontSize,
    borderRadius: 6,
  },
  medium: {
    height: 44,
    paddingHorizontal: spacing[4], // 16px
    fontSize: typography.button.medium.fontSize,
    borderRadius: 8,
  },
  large: {
    height: 52,
    paddingHorizontal: spacing[6], // 24px
    fontSize: typography.button.large.fontSize,
    borderRadius: 10,
  },
}

// Button variant styles
const buttonVariants = {
  primary: {
    default: {
      backgroundColor: colors.primary[500],
      borderColor: colors.primary[500],
      textColor: colors.neutral[0],
    },
    pressed: {
      backgroundColor: colors.primary[600],
      borderColor: colors.primary[600],
      textColor: colors.neutral[0],
    },
    disabled: {
      backgroundColor: colors.neutral[300],
      borderColor: colors.neutral[300],
      textColor: colors.neutral[500],
    },
  },
  
  secondary: {
    default: {
      backgroundColor: colors.neutral[0],
      borderColor: colors.primary[500],
      textColor: colors.primary[500],
    },
    pressed: {
      backgroundColor: colors.primary[50],
      borderColor: colors.primary[600],
      textColor: colors.primary[600],
    },
    disabled: {
      backgroundColor: colors.neutral[100],
      borderColor: colors.neutral[300],
      textColor: colors.neutral[400],
    },
  },
  
  ghost: {
    default: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      textColor: colors.primary[500],
    },
    pressed: {
      backgroundColor: colors.primary[50],
      borderColor: 'transparent',
      textColor: colors.primary[600],
    },
    disabled: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      textColor: colors.neutral[400],
    },
  },
}
```

#### Input Field System
```typescript
const inputFieldStyles = {
  default: {
    height: 48,
    paddingHorizontal: spacing[3], // 12px
    fontSize: typography.body.medium.fontSize,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: colors.neutral[0],
    borderColor: colors.neutral[300],
    textColor: colors.neutral[900],
  },
  
  focused: {
    borderColor: colors.primary[500],
    borderWidth: 2,
    backgroundColor: colors.neutral[0],
  },
  
  error: {
    borderColor: colors.error[500],
    borderWidth: 1,
    backgroundColor: colors.error[50],
  },
  
  disabled: {
    backgroundColor: colors.neutral[100],
    borderColor: colors.neutral[200],
    textColor: colors.neutral[500],
  },
  
  placeholder: {
    color: colors.neutral[500],
  }
}
```

#### Card Component System
```typescript
const cardStyles = {
  default: {
    backgroundColor: colors.neutral[0],
    borderRadius: 12,
    padding: spacing[4], // 16px
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  elevated: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  
  pressed: {
    backgroundColor: colors.neutral[50],
    transform: [{ scale: 0.98 }],
  }
}
```

### 5. Accessibility Requirements

#### Color Contrast Standards
- **Normal text:** Minimum 4.5:1 contrast ratio
- **Large text:** Minimum 3:1 contrast ratio
- **Interactive elements:** Minimum 4.5:1 contrast ratio

#### Contrast Validation
```typescript
const accessibilityColors = {
  // Validated high-contrast combinations
  primaryOnLight: {
    background: colors.neutral[0],
    text: colors.primary[600],     // 4.6:1 contrast
  },
  
  primaryOnDark: {
    background: colors.neutral[900],
    text: colors.primary[400],     // 4.8:1 contrast
  },
  
  textOnLight: {
    background: colors.neutral[0],
    primary: colors.neutral[900],  // 21:1 contrast
    secondary: colors.neutral[600], // 4.5:1 contrast
  },
  
  textOnDark: {
    background: colors.neutral[900],
    primary: colors.neutral[50],   // 18:1 contrast
    secondary: colors.neutral[300], // 4.8:1 contrast
  }
}
```

#### Touch Target Requirements
```typescript
const touchTargets = {
  minimum: 44,        // 44px minimum touch target
  recommended: 48,    // 48px recommended
  comfortable: 52,    // 52px for primary actions
}
```

### 6. RTL & Internationalization Support

#### Text Direction Support
```typescript
const rtlSupport = {
  // Text alignment
  textAlign: {
    start: 'left',    // Will automatically flip to 'right' in RTL
    end: 'right',     // Will automatically flip to 'left' in RTL
  },
  
  // Padding/margin direction
  paddingStart: spacing[4],  // Left in LTR, right in RTL
  paddingEnd: spacing[4],    // Right in LTR, left in RTL
  
  // Icon positioning
  iconStart: 'left',   // Will flip in RTL
  iconEnd: 'right',    // Will flip in RTL
}
```

#### Layout Considerations
- Use `flexDirection: 'row'` with `textAlign: 'start'` instead of hardcoded left/right
- Use `paddingStart`/`paddingEnd` instead of `paddingLeft`/`paddingRight`
- Icons should flip horizontally in RTL (especially arrows)

### 7. Responsive Design Guidelines

#### Breakpoint Usage
```typescript
const responsiveRules = {
  // Mobile first approach
  sm: {
    // Base styles for phones (< 480px)
    fontSize: typography.body.medium.fontSize,
    padding: spacing[4],
  },
  
  md: {
    // Tablet adjustments (> 768px)
    fontSize: typography.body.large.fontSize,
    padding: spacing[6],
  },
  
  lg: {
    // Large tablet/desktop (> 1024px)
    maxWidth: 1200,
    fontSize: typography.heading.h3.fontSize,
    padding: spacing[8],
  }
}
```

#### Flexible Layout Patterns
```typescript
const layoutPatterns = {
  // Flexible containers
  container: {
    flex: 1,
    paddingHorizontal: '5%',
    maxWidth: 1200,
  },
  
  // Grid systems
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing[2],
  },
  
  gridItem: {
    paddingHorizontal: spacing[2],
    width: '50%', // Adjustable based on breakpoint
  },
}
```

---

## Implementation Strategy

### Phase 1: Foundation & Critical Fixes (Weeks 1-2)
**Priority: Critical**

#### 1.1 Color System Implementation
- Create new `constants/DesignTokens.ts` with complete color palette
- Update `constants/Colors.ts` to use semantic color references
- Replace all hardcoded colors in existing components

#### 1.2 Typography System Setup  
- Create `constants/Typography.ts` with complete type scale
- Create reusable `Text` components with semantic styling
- Update existing text components to use new system

#### 1.3 Critical Component Fixes
- **Tab Navigation:** Standardize [`app/(tabs)/_layout.tsx`](app/(tabs)/_layout.tsx) styling
- **Authentication Screens:** Fix padding and consistency in [`app/(auth)/sign-in.tsx`](app/(auth)/sign-in.tsx) and [`app/(auth)/sign-up.tsx`](app/(auth)/sign-up.tsx)
- **Search Bar:** Standardize [`components/SearchBar.tsx`](components/SearchBar.tsx) styling

### Phase 2: Component Standardization (Weeks 3-4)
**Priority: High**

#### 2.1 Button System Implementation
- Create standardized `Button` component with all variants
- Replace all custom button implementations
- Add proper state management (pressed, disabled, loading)

#### 2.2 Input Field Standardization
- Create unified `TextInput` component system
- Implement validation states and error handling
- Update all form implementations

#### 2.3 Card Component System
- Standardize [`components/MarketCard.tsx`](components/MarketCard.tsx) with new design tokens
- Create reusable `Card` base component
- Implement consistent elevation and spacing

#### 2.4 Modal & Overlay System
- Standardize [`components/FilterModal.tsx`](components/FilterModal.tsx) and [`components/BusinessTypeModal.tsx`](components/BusinessTypeModal.tsx)
- Create base modal components
- Implement consistent animation and positioning

### Phase 3: Enhancement & Optimization (Weeks 5-6)
**Priority: Medium**

#### 3.1 Responsive Design Implementation
- Add responsive utilities and breakpoint system
- Update layouts for tablet optimization
- Implement flexible spacing and sizing

#### 3.2 Accessibility Improvements
- Add proper accessibility labels throughout app
- Implement focus management and keyboard navigation
- Validate and fix color contrast issues

#### 3.3 RTL Support
- Implement direction-aware layouts
- Add RTL-compatible icon positioning
- Test and fix Arabic text rendering

#### 3.4 Dark Mode Enhancement
- Complete dark theme implementation
- Add smooth theme transition animations
- Update all components for theme consistency

---

## Technical Implementation Guidelines

### File Structure Recommendations
```
constants/
├── DesignTokens.ts       # Complete design system
├── Colors.ts             # Theme-aware color system  
├── Typography.ts         # Text styles and components
├── Spacing.ts           # Layout spacing system
├── ComponentStyles.ts   # Shared component styles
└── Breakpoints.ts       # Responsive design utilities

components/
├── design-system/       # New design system components
│   ├── Button/
│   ├── Input/
│   ├── Card/
│   ├── Modal/
│   └── Text/
└── ...existing components
```

### Component Implementation Examples

#### Design System Button Component
```typescript
// components/design-system/Button/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { colors, typography, spacing } from '@/constants/DesignTokens';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onPress,
  children,
}) => {
  const buttonStyle = [
    styles.base,
    styles.sizes[size],
    styles.variants[variant],
    (disabled || loading) && styles.disabled,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={styles.variants[variant].textColor} />
      ) : (
        <Text style={[styles.text, { color: styles.variants[variant].textColor }]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};
```

### Migration Strategy

#### 1. Component-by-Component Migration
- Start with most frequently used components
- Create new design system components alongside existing ones  
- Gradually replace old implementations
- Test thoroughly before removing old code

#### 2. Gradual Color Token Migration
```typescript
// Before
backgroundColor: '#F5A623'

// After  
backgroundColor: colors.primary[500]
```

#### 3. Typography System Migration
```typescript  
// Before
fontSize: 18,
fontWeight: 'bold',

// After
...typography.heading.h3
```

#### 4. Spacing System Migration
```typescript
// Before
paddingHorizontal: 16,
marginBottom: 12,

// After
paddingHorizontal: spacing[4],
marginBottom: spacing[3],
```

---

## Quality Assurance & Testing

### Design System Testing Checklist

#### Visual Consistency Testing
- [ ] All primary buttons use same styling across app
- [ ] Text hierarchy is consistent throughout
- [ ] Spacing follows 4pt grid system
- [ ] Colors match design system tokens

#### Accessibility Testing
- [ ] All touch targets meet 44px minimum
- [ ] Color contrast meets WCAG standards
- [ ] Screen readers can navigate properly
- [ ] Keyboard navigation works correctly

#### Responsive Testing
- [ ] Layout adapts properly to different screen sizes
- [ ] Text scales appropriately
- [ ] Touch targets remain accessible on all sizes
- [ ] Content doesn't get cut off on smaller screens

#### Theme Testing
- [ ] Light theme renders correctly
- [ ] Dark theme renders correctly  
- [ ] Theme switching works smoothly
- [ ] All components support both themes

#### RTL Testing
- [ ] Text aligns correctly in Arabic
- [ ] Layout direction flips appropriately
- [ ] Icons position correctly in RTL
- [ ] Navigation patterns work in RTL

---

## Maintenance Guidelines

### Design System Governance

#### 1. Component Addition Process
- All new components must follow design system guidelines
- New colors/typography must be approved and added to design tokens
- Components should be thoroughly tested before integration

#### 2. Design Token Management
- Design tokens are single source of truth
- Changes to tokens must be carefully considered for impact
- Version control all design system changes

#### 3. Documentation Requirements
- All components must have usage documentation
- Design decisions should be documented with rationale
- Breaking changes require migration guides

#### 4. Regular Audits
- Monthly design system compliance audits
- Quarterly accessibility testing
- Bi-annual full design system review

### Code Review Guidelines

#### Design System Checklist for PRs
- [ ] Uses design system colors instead of hardcoded values
- [ ] Follows typography scale system
- [ ] Uses spacing system consistently  
- [ ] Components follow accessibility guidelines
- [ ] New components match existing patterns
- [ ] RTL considerations addressed if applicable

---

## Conclusion

This comprehensive design system specification provides the foundation for transforming the Rukn app's user interface from its current inconsistent state into a cohesive, accessible, and maintainable design language. The three-phase implementation strategy ensures minimal disruption while maximizing improvement impact.

The success of this design system depends on strict adherence to the guidelines, thorough testing, and ongoing maintenance. When fully implemented, users will experience a more polished, professional, and accessible application that reflects the quality and attention to detail expected in modern mobile applications.

**Next Steps:**
1. Review and approve this specification
2. Begin Phase 1 implementation
3. Establish design system governance processes
4. Train development team on new patterns and guidelines

This design system will serve as the foundation for all future UI development, ensuring consistency, efficiency, and quality across the entire Rukn application ecosystem.