# Design System Migration Guide

This comprehensive guide will help you migrate your existing React Native components from hardcoded values to the new design system using automated tools and manual techniques.

## Table of Contents

1. [Overview](#overview)
2. [Before You Start](#before-you-start)
3. [Migration Tools](#migration-tools)
4. [Step-by-Step Migration Process](#step-by-step-migration-process)
5. [Component-Specific Migration](#component-specific-migration)
6. [Common Migration Patterns](#common-migration-patterns)
7. [Troubleshooting](#troubleshooting)
8. [Validation and Testing](#validation-and-testing)
9. [Best Practices](#best-practices)

## Overview

The design system migration involves transitioning from hardcoded values to standardized design tokens for:

- **Colors**: Hex codes → Design token colors
- **Typography**: Font sizes/weights → Typography scale
- **Spacing**: Hardcoded pixels → Spacing scale
- **Components**: Custom styles → Design system components

### Benefits of Migration

- ✅ **Consistency**: Unified visual language across the app
- ✅ **Maintainability**: Single source of truth for design values
- ✅ **Type Safety**: TypeScript support for all design tokens
- ✅ **Theme Support**: Built-in light/dark mode support
- ✅ **Scalability**: Easy to update designs across the entire app
- ✅ **Accessibility**: Better contrast and readable typography

## Before You Start

### Prerequisites

1. ✅ Design system is fully implemented (Steps 1-4 complete)
2. ✅ All design token files exist:
   - `constants/design-tokens.ts`
   - `constants/theme.ts`
   - `src/context/ThemeContext.tsx`
3. ✅ Node.js installed for running migration scripts
4. ✅ TypeScript configured properly

### Backup Your Code

**⚠️ IMPORTANT**: Always create a backup before running migrations:

```bash
# Create a manual backup
cp -r . ../rukn-app-backup

# Or use Git
git add .
git commit -m "Pre-migration backup"
git push
```

### Check Current Status

Run this command to see what needs migration:

```bash
# Test migration utilities
node scripts/test-migration.js

# Validate current state
node scripts/validate-migration.js
```

## Migration Tools

We've created several automated tools to help with migration:

### 1. Color Migration Script
```bash
# Preview color changes
node scripts/migrate-colors.js --dry-run

# Apply color migrations
node scripts/migrate-colors.js
```

### 2. Typography Migration Script
```bash
# Preview typography changes
node scripts/migrate-typography.js --dry-run

# Apply typography migrations  
node scripts/migrate-typography.js
```

### 3. Spacing Migration Script
```bash
# Preview spacing changes
node scripts/migrate-spacing.js --dry-run

# Apply spacing migrations
node scripts/migrate-spacing.js
```

### 4. Test & Validation Scripts
```bash
# Test all migration utilities
node scripts/test-migration.js

# Validate migrated code
node scripts/validate-migration.js
```

## Step-by-Step Migration Process

### Step 1: Run Test Migration

Before making any changes, test the migration process:

```bash
node scripts/test-migration.js
```

This will create sample files and test all migration utilities without affecting your actual code.

### Step 2: Backup Your Project

```bash
git add .
git commit -m "Pre-migration backup - Step 5"
```

### Step 3: Migrate Colors

Start with colors as they're the most common hardcoded values:

```bash
# Preview changes first
node scripts/migrate-colors.js --dry-run

# Review the migration report
cat migration-backups/color-migration-report.txt

# If satisfied, apply changes
node scripts/migrate-colors.js
```

**Expected Changes:**
- `#F5A623` → `colors.primary[500]`
- `#FFFFFF` → `colors.neutral[0]`
- `#1E2A38` → `colors.secondary[800]`

### Step 4: Migrate Typography

Next, migrate font sizes and weights:

```bash
# Preview changes
node scripts/migrate-typography.js --dry-run

# Apply changes
node scripts/migrate-typography.js
```

**Expected Changes:**
- `fontSize: 24` → `...typography.display.small`
- `fontSize: 18` → `...typography.heading.h3`
- `fontWeight: 'bold'` → `fontWeight: '600'`

### Step 5: Migrate Spacing

Finally, migrate spacing values:

```bash
# Preview changes
node scripts/migrate-spacing.js --dry-run

# Apply changes
node scripts/migrate-spacing.js
```

**Expected Changes:**
- `padding: 16` → `padding: spacing[4]`
- `margin: 24` → `margin: spacing[6]`
- `borderRadius: 8` → `borderRadius: spacing[2]`

### Step 6: Validate Migration

After each migration step, validate the results:

```bash
# Check TypeScript compilation
npx tsc --noEmit

# Run validation script
node scripts/validate-migration.js

# Test your app
npm start
```

## Component-Specific Migration

### Tab Layout Component

**File**: `app/(tabs)/_layout.tsx`

**Before:**
```typescript
tabBarActiveTintColor: "#F5A623",
tabBarInactiveTintColor: "#ffffff",
tabBarStyle: {
  backgroundColor: "#1E2A38",
  borderTopWidth: 1,
  borderBottomColor: "#232533",
  height: 84,
},
```

**After:**
```typescript
import { colors, spacing } from '../../constants/design-tokens';

tabBarActiveTintColor: colors.primary[500],
tabBarInactiveTintColor: colors.neutral[0],
tabBarStyle: {
  backgroundColor: colors.secondary[800],
  borderTopWidth: 1,
  borderBottomColor: colors.secondary[700],
  height: spacing[20], // 80px - close to 84
},
```

### Sign-in Screen

**File**: `app/(auth)/sign-in.tsx`

**Before:**
```typescript
const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#F5A623',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
});
```

**After:**
```typescript
import { colors, typography, spacing } from '../../constants/design-tokens';

const styles = StyleSheet.create({
  title: {
    ...typography.display.small,
    color: colors.neutral[700],
    marginBottom: spacing[8], // 32px close to 30
  },
  input: {
    backgroundColor: colors.neutral[0],
    borderColor: colors.primary[500],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3], // Slight adjustment for consistency
    ...typography.body.large,
  },
});
```

### Search Bar Component

**File**: `components/SearchBar.tsx`

**Before:**
```typescript
const styles = StyleSheet.create({
  searchWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderColor: "#db941d",
  },
  input: {
    color: "#1E2A38",
    fontSize: 14,
    paddingHorizontal: 15,
  }
});
```

**After:**
```typescript
import { colors, typography, spacing } from '../constants/design-tokens';

const styles = StyleSheet.create({
  searchWrapper: {
    backgroundColor: colors.neutral[0],
    borderRadius: spacing[2],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderColor: colors.primary[700],
  },
  input: {
    color: colors.secondary[800],
    ...typography.body.medium,
    paddingHorizontal: spacing[4],
  }
});
```

## Common Migration Patterns

### Pattern 1: Simple Color Replacement

**Before:**
```typescript
backgroundColor: '#F5A623'
```

**After:**
```typescript
import { colors } from 'constants/design-tokens';
backgroundColor: colors.primary[500]
```

### Pattern 2: Typography Migration

**Before:**
```typescript
{
  fontSize: 18,
  fontWeight: 'bold',
  lineHeight: 24,
}
```

**After:**
```typescript
import { typography } from 'constants/design-tokens';
...typography.heading.h3
```

### Pattern 3: Spacing Standardization

**Before:**
```typescript
{
  paddingHorizontal: 20,
  paddingVertical: 12,
  marginTop: 16,
}
```

**After:**
```typescript
import { spacing } from 'constants/design-tokens';
{
  paddingHorizontal: spacing[5], // 20px
  paddingVertical: spacing[3],   // 12px
  marginTop: spacing[4],         // 16px
}
```

### Pattern 4: Theme-Aware Colors

**Before:**
```typescript
import Colors from 'constants/Colors';
color: Colors.light.text
```

**After:**
```typescript
import { useTheme } from 'src/context/ThemeContext';
const { theme } = useTheme();
color: theme.text.primary
```

### Pattern 5: Legacy Compatibility

If you need to maintain backward compatibility:

```typescript
import { legacyColors } from 'src/utils/legacy-compat';
// Still works but shows deprecation warnings
backgroundColor: legacyColors.primary
```

## Troubleshooting

### Common Issues

#### 1. Import Path Errors

**Problem**: `Cannot find module 'constants/design-tokens'`

**Solution**:
```typescript
// Use relative path from your component location
import { colors } from '../../constants/design-tokens';
```

#### 2. TypeScript Errors

**Problem**: `Property 'primary' does not exist`

**Solution**: Check your import and token path:
```typescript
// Correct
import { colors } from 'constants/design-tokens';
colors.primary[500]

// Incorrect
colors.primary // Missing shade number
```

#### 3. Colors Look Different

**Problem**: Colors appear different after migration

**Solution**:
1. Check color mapping in migration report
2. Verify the correct shade is being used
3. Some colors might be standardized (see warnings in migration report)

#### 4. Spacing Too Large/Small

**Problem**: Layout looks wrong after spacing migration

**Solution**:
1. Review spacing standardization warnings
2. Some values are adjusted to fit the 4px grid
3. Manually adjust if needed:

```typescript
// If migration suggests spacing[4] (16px) but you need 14px
padding: 14, // Keep custom value
// Or use a closer standard
padding: spacing[3], // 12px
```

#### 5. Font Weights Look Different

**Problem**: Text appears bolder/lighter than before

**Solution**:
1. Check typography migration report
2. Font weights are standardized for mobile consistency
3. Manually override if needed:

```typescript
{
  ...typography.heading.h1,
  fontWeight: '700', // Override if needed
}
```

### Migration Script Issues

#### Script Permissions
```bash
chmod +x scripts/migrate-colors.js
chmod +x scripts/migrate-typography.js  
chmod +x scripts/migrate-spacing.js
```

#### Node.js Not Found
```bash
# Install Node.js or use npx
npx node scripts/migrate-colors.js
```

#### Script Crashes
```bash
# Check Node.js version (requires 14+)
node --version

# Run with more verbose output
node scripts/migrate-colors.js --dry-run
```

## Validation and Testing

### Automated Validation

After migration, run these checks:

```bash
# 1. TypeScript compilation
npx tsc --noEmit

# 2. Migration validation
node scripts/validate-migration.js

# 3. Run your app
npm start
```

### Manual Testing

Test these key areas after migration:

#### Visual Testing Checklist

- [ ] **Colors**: All colors render correctly
- [ ] **Typography**: Text is readable and properly sized
- [ ] **Spacing**: Layouts maintain proper spacing
- [ ] **Touch Targets**: Buttons are easy to tap
- [ ] **Dark Mode**: Theme switching works (if implemented)

#### Functional Testing

- [ ] **Navigation**: Tab bar and navigation work
- [ ] **Forms**: Input fields function properly
- [ ] **Interactions**: Buttons and touchable elements respond
- [ ] **Performance**: No performance degradation

### Rollback Plan

If migration causes issues:

```bash
# Restore from Git
git reset --hard HEAD~1

# Or restore from backup
rm -rf .
cp -r ../rukn-app-backup/* .

# Reinstall dependencies
npm install
```

## Best Practices

### Do's ✅

1. **Always backup before migration**
2. **Run dry-run previews first**
3. **Migrate incrementally** (colors → typography → spacing)
4. **Test after each migration step**
5. **Read migration reports carefully**
6. **Use design tokens consistently**
7. **Follow TypeScript suggestions**
8. **Test on multiple devices/themes**

### Don'ts ❌

1. **Don't skip the backup step**
2. **Don't migrate everything at once**
3. **Don't ignore TypeScript errors**
4. **Don't bypass validation scripts**
5. **Don't mix hardcoded values with tokens**
6. **Don't ignore migration warnings**
7. **Don't deploy without testing**

### Code Quality Guidelines

#### Prefer Design Tokens
```typescript
// ✅ Good
import { colors } from 'constants/design-tokens';
backgroundColor: colors.primary[500]

// ❌ Avoid
backgroundColor: '#F5A623'
```

#### Use Typography Scales
```typescript
// ✅ Good
import { typography } from 'constants/design-tokens';
...typography.heading.h2

// ❌ Avoid
fontSize: 20,
fontWeight: 'bold'
```

#### Consistent Spacing
```typescript
// ✅ Good
import { spacing } from 'constants/design-tokens';
padding: spacing[4]

// ❌ Avoid
padding: 17 // Non-standard value
```

### Performance Tips

1. **Import only what you need**:
```typescript
import { colors, spacing } from 'constants/design-tokens';
// Instead of importing everything
```

2. **Use theme context for dynamic colors**:
```typescript
const { theme } = useTheme();
// Instead of hardcoded light/dark colors
```

3. **Cache StyleSheet.create**:
```typescript
const styles = StyleSheet.create({
  // Your styles using design tokens
});
// React Native optimizes these automatically
```

## Migration Completion Checklist

- [ ] All migration scripts run successfully
- [ ] TypeScript compilation passes
- [ ] Validation script shows no critical issues
- [ ] App starts and runs without errors
- [ ] Visual testing completed
- [ ] Dark mode works (if applicable)
- [ ] Performance is acceptable
- [ ] No console warnings in development
- [ ] Code review completed
- [ ] Documentation updated

## Next Steps

After successful migration:

1. **Step 6**: Test and validate complete implementation
2. **Deploy**: Test in staging environment
3. **Monitor**: Watch for any issues in production
4. **Optimize**: Fine-tune based on user feedback
5. **Expand**: Apply design system to new components

## Additional Resources

- [Design System Specification](DESIGN_SYSTEM_SPECIFICATION.md)
- [Design Tokens Reference](constants/design-tokens.ts)
- [Theme Context Usage](src/context/ThemeContext.tsx)
- [Component Library](components/design-system/)

## Support

If you encounter issues during migration:

1. Check this guide's troubleshooting section
2. Review migration reports in `migration-backups/`
3. Run validation scripts for detailed error information
4. Check console warnings for migration hints
5. Consult the design system specification

---

**Happy Migrating!** 🚀

Remember: Migration is a gradual process. Take your time, test thoroughly, and don't hesitate to roll back if you encounter issues. The design system will make your app more maintainable and consistent in the long run.