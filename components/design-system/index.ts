/**
 * Design System Component Library
 *
 * Complete component library with Button, TextInput, and Card components.
 * All components use design tokens and follow accessibility guidelines.
 * Includes responsive design and RTL support utilities.
 */

// Button Component
export { Button } from './Button';
export type {
  ButtonProps,
  ButtonSize,
  ButtonVariant,
  ButtonState
} from './Button';

// TextInput Component
export { TextInput } from './TextInput';
export type {
  TextInputProps,
  TextInputState
} from './TextInput';

// Card Component
export { Card } from './Card';
export type {
  CardProps,
  CardVariant
} from './Card';

// Re-export design tokens for convenience
export {
  colors,
  typography,
  spacing,
  shadows,
  buttonSizes,
  buttonVariants,
  inputFieldStyles,
  cardStyles,
  accessibility,
  breakpoints,
  rtlSupport,
} from '../../constants/design-tokens';

// Re-export theme system
export {
  lightTheme,
  darkTheme,
  themes,
  getTheme,
} from '../../constants/theme';
export type {
  Theme,
  ThemeName,
  ThemeContextType,
} from '../../constants/theme';

// === RESPONSIVE DESIGN UTILITIES ===

// Responsive utilities
export {
  getScreenDimensions,
  getCurrentScreenSize,
  getScreenSizeInfo,
  matchesBreakpoint,
  isBreakpointRange,
  getMatchingBreakpoints,
  getResponsiveValue,
  getResponsiveValueStrict,
  calculateResponsiveSize,
  getResponsiveSpacing,
  getResponsiveFontSize,
  isTablet,
  isPhone,
  isLandscape,
  isPortrait,
  getPlatformResponsiveValue,
  createResponsiveStyle,
  clampResponsive,
  scaleByDensity,
  dpToPx,
  pxToDp,
  responsiveMultipliers,
} from '../../src/utils/responsive';

export type {
  ScreenSize,
  ScreenDimensions,
  ResponsiveValue,
  ScreenSizeInfo,
  ResponsiveSizeConfig,
  BreakpointKey,
} from '../../src/utils/responsive';

// Responsive hooks
export {
  useResponsive,
  useResponsiveValue,
  useScreenSize,
  useBreakpoint,
  useOrientation,
  useResponsiveDebounced,
  useResponsiveStatic,
} from '../../src/hooks/useResponsive';

export type {
  UseResponsiveReturn,
  UseResponsiveOptions,
} from '../../src/hooks/useResponsive';

// === RTL SUPPORT UTILITIES ===

// RTL utilities
export {
  isRTL,
  getTextDirection,
  getLayoutDirection,
  forceRTL,
  allowRTL,
  getRTLConfig,
  getTextAlign,
  getPaddingStart,
  getPaddingEnd,
  getMarginStart,
  getMarginEnd,
  getBorderStartWidth,
  getBorderEndWidth,
  getBorderStartColor,
  getBorderEndColor,
  getFlexDirection,
  getPositionStart,
  getPositionEnd,
  shouldFlipIcon,
  getIconTransform,
  getIconStyle,
  arabicFontConfig,
  getArabicTextStyle,
  containsArabic,
  containsHebrew,
  containsRTLText,
  getTextDirectionForText,
  createRTLStyle,
  mergeRTLStyles,
  getSlideDirection,
  getAccessibleRTLProps,
  rtlIconMap,
} from '../../src/utils/rtl';

export type {
  TextDirection,
  LayoutDirection,
  RTLTextAlign,
  RTLFlexDirection,
  RTLConfig,
  RTLSpacing,
  RTLStyle,
  IconDirection,
  ArabicTextConfig,
} from '../../src/utils/rtl';

// RTL hooks
export {
  useRTL,
  useRTLText,
  useRTLLayout,
  useRTLIcon,
} from '../../src/hooks/useRTL';

export type {
  UseRTLReturn,
  UseRTLOptions,
} from '../../src/hooks/useRTL';

// === DEMO COMPONENTS ===

// Layout Components
export { Container } from './Container';
export { Stack } from './Stack';
export { Grid } from './Grid';
export type { ContainerProps } from './Container';
export type { StackProps } from './Stack';
export type { GridProps } from './Grid';

// Navigation Components
export { TabBar } from './TabBar';
export { NavigationBar } from './NavigationBar';
export type { TabBarProps } from './TabBar';
export type { NavigationBarProps } from './NavigationBar';

// Modal Component
export { Modal } from './Modal';
export type { ModalProps } from './Modal';

// List Components
export { List, ListItem } from './List';
export type { ListProps, ListItemProps } from './List';

// Display Components
export { Avatar } from './Avatar';
export { Chip } from './Chip';
export type { AvatarProps } from './Avatar';
export type { ChipProps } from './Chip';

// Loading Components
export { Loading, Skeleton } from './Loading';
export type { LoadingProps, SkeletonProps } from './Loading';

// Demo components for testing and documentation
export { default as ResponsiveDemo } from '../ResponsiveDemo';
export { default as RTLDemo } from '../RTLDemo';
export { default as DesignSystemShowcase } from './DesignSystemShowcase';

// === UTILITIES ===

/**
 * Complete responsive and RTL-aware design system utilities
 *
 * This design system provides:
 * - Fully responsive components that adapt to screen size
 * - Complete RTL support for Arabic and Hebrew languages
 * - Performance-optimized hooks and utilities
 * - Type-safe TypeScript interfaces
 * - Accessibility-compliant implementations
 *
 * @example Responsive Usage
 * ```tsx
 * import { Button, useResponsive } from './design-system';
 *
 * const { isSmall, responsiveSpacing } = useResponsive();
 *
 * <Button
 *   size={{ sm: 'small', md: 'medium', lg: 'large' }}
 *   responsive
 *   padding={{ sm: 12, md: 16, lg: 20 }}
 * >
 *   Responsive Button
 * </Button>
 * ```
 *
 * @example RTL Usage
 * ```tsx
 * import { TextInput, useRTL } from './design-system';
 *
 * const { isRTL, textAlign } = useRTL();
 *
 * <TextInput
 *   label="Arabic Input"
 *   rtlEnabled
 *   autoDetectRTL
 *   placeholder="اكتب هنا..."
 * />
 * ```
 */