/**
 * Design System Showcase Component
 * 
 * Comprehensive demo showing all design system features:
 * - All components (Button, TextInput, Card) in all variants
 * - Theme switching demonstration (light/dark/system)
 * - Responsive behavior examples across screen sizes
 * - RTL layout demonstration with Arabic text
 * - Typography scale showcase
 * - Color palette display
 * - Spacing system demonstration
 * 
 * This component serves as both a testing tool and documentation
 * for the complete Rukn Design System implementation.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import {
  Button,
  TextInput,
  Card,
  typography,
  spacing,
  shadows,
  buttonSizes,
  accessibility,
} from './design-system';
import { colors } from '../constants/design-tokens';
import { useTheme, useThemedStyles, useThemeColors } from '../src/context/ThemeContext';
import { useResponsive } from '../src/hooks/useResponsive';
import { useRTL } from '../src/hooks/useRTL';

/**
 * Main Design System Showcase Component
 */
export const DesignSystemShowcase: React.FC = () => {
  const { theme, themeMode, setThemeMode, toggleTheme, isDark } = useTheme();
  const { isSmall, isMedium, isLarge, screenSize, isLandscape, isPortrait } = useResponsive();
  const { isRTL, forceRTL, textAlign } = useRTL();
  const themeColors = useThemeColors();
  
  // Component state for demo interactions
  const [inputValue, setInputValue] = useState('');
  const [rtlInputValue, setRTLInputValue] = useState('مرحبا بكم في ركن');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Create themed styles
  const styles = useThemedStyles((theme, isDark) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: theme.background.primary,
      },
      scrollContent: {
        padding: spacing[4],
        paddingBottom: spacing[8],
      },
      section: {
        marginBottom: spacing[8],
      },
      sectionTitle: {
        ...typography.heading.h2,
        color: theme.text.primary,
        marginBottom: spacing[4],
        textAlign: textAlign('start'),
      },
      subsectionTitle: {
        ...typography.heading.h3,
        color: theme.text.secondary,
        marginBottom: spacing[3],
        textAlign: textAlign('start'),
      },
      description: {
        ...typography.body.medium,
        color: theme.text.secondary,
        marginBottom: spacing[4],
        textAlign: textAlign('start'),
      },
      infoCard: {
        backgroundColor: theme.surface.secondary,
        padding: spacing[4],
        borderRadius: 8,
        marginBottom: spacing[4],
      },
      infoText: {
        ...typography.body.small,
        color: theme.text.tertiary,
        textAlign: textAlign('start'),
      },
      row: {
        flexDirection: isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: spacing[3],
      },
      colorSwatch: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: spacing[2],
        marginBottom: spacing[2],
        borderWidth: 1,
        borderColor: theme.border.primary,
      },
      colorLabel: {
        ...typography.caption.small,
        color: theme.text.secondary,
        textAlign: 'center',
        marginTop: spacing[1],
      },
      typographySample: {
        marginBottom: spacing[3],
      },
      spacingSample: {
        backgroundColor: theme.interactive.primary,
        marginBottom: spacing[2],
      },
      responsiveIndicator: {
        backgroundColor: isSmall ? themeColors.status.error : isMedium ? themeColors.status.warning : themeColors.status.success,
        padding: spacing[2],
        borderRadius: 4,
        marginBottom: spacing[3],
      },
      rtlContainer: {
        backgroundColor: theme.surface.secondary,
        padding: spacing[4],
        borderRadius: 8,
        marginBottom: spacing[4],
      },
    })
  );

  // Event handlers
  const handleButtonPress = useCallback((variant: string) => {
    Alert.alert('Button Pressed', `${variant} button was pressed!`);
  }, []);

  const handleThemeChange = useCallback(async (mode: 'light' | 'dark' | 'system') => {
    await setThemeMode(mode);
  }, [setThemeMode]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rukn Design System Showcase</Text>
          <Text style={styles.description}>
            Complete demonstration of all design system components, themes, and features.
          </Text>
          
          {/* System Information */}
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              Current Theme: {themeMode} ({isDark ? 'Dark' : 'Light'}) |
              Screen: {screenSize} ({isLandscape ? 'Landscape' : 'Portrait'}) |
              RTL: {isRTL ? 'Enabled' : 'Disabled'} |
              Platform: {Platform.OS}
            </Text>
          </View>

          {/* Responsive Indicator */}
          <View style={styles.responsiveIndicator}>
            <Text style={[styles.infoText, { color: themeColors.text.inverse }]}>
              Responsive: {isSmall ? 'Small Screen' : isMedium ? 'Medium Screen' : 'Large Screen'} 
              ({Dimensions.get('window').width}x{Dimensions.get('window').height})
            </Text>
          </View>
        </View>

        {/* Theme Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Theme System</Text>
          <Text style={styles.description}>
            Test theme switching functionality with real-time updates.
          </Text>
          
          <View style={styles.row}>
            <Button
              variant="primary"
              size={isSmall ? 'small' : 'medium'}
              onPress={() => handleThemeChange('light')}
              style={{ marginRight: spacing[2] }}
            >
              Light Theme
            </Button>
            <Button
              variant="secondary"
              size={isSmall ? 'small' : 'medium'}
              onPress={() => handleThemeChange('dark')}
              style={{ marginRight: spacing[2] }}
            >
              Dark Theme
            </Button>
            <Button
              variant="ghost"
              size={isSmall ? 'small' : 'medium'}
              onPress={() => handleThemeChange('system')}
            >
              System Theme
            </Button>
          </View>
          
          <Button
            variant="secondary"
            size="medium"
            onPress={toggleTheme}
            style={{ marginTop: spacing[2] }}
          >
            Toggle Theme
          </Button>
        </View>

        {/* Button Components */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Button Components</Text>
          <Text style={styles.description}>
            All button variants, sizes, and states with responsive adaptation.
          </Text>

          {/* Button Variants */}
          <Text style={styles.subsectionTitle}>Variants</Text>
          <View style={styles.row}>
            <Button
              variant="primary"
              size={isSmall ? 'small' : 'medium'}
              onPress={() => handleButtonPress('Primary')}
              style={{ marginRight: spacing[2] }}
            >
              Primary
            </Button>
            <Button
              variant="secondary"
              size={isSmall ? 'small' : 'medium'}
              onPress={() => handleButtonPress('Secondary')}
              style={{ marginRight: spacing[2] }}
            >
              Secondary
            </Button>
            <Button
              variant="ghost"
              size={isSmall ? 'small' : 'medium'}
              onPress={() => handleButtonPress('Ghost')}
            >
              Ghost
            </Button>
          </View>

          {/* Button Sizes */}
          <Text style={styles.subsectionTitle}>Sizes</Text>
          <View style={styles.row}>
            <Button
              variant="primary"
              size="small"
              onPress={() => handleButtonPress('Small')}
              style={{ marginRight: spacing[2] }}
            >
              Small
            </Button>
            <Button
              variant="primary"
              size="medium"
              onPress={() => handleButtonPress('Medium')}
              style={{ marginRight: spacing[2] }}
            >
              Medium
            </Button>
            <Button
              variant="primary"
              size="large"
              onPress={() => handleButtonPress('Large')}
            >
              Large
            </Button>
          </View>

          {/* Button States */}
          <Text style={styles.subsectionTitle}>States</Text>
          <View style={styles.row}>
            <Button
              variant="primary"
              size="medium"
              onPress={() => handleButtonPress('Normal')}
              style={{ marginRight: spacing[2] }}
            >
              Normal
            </Button>
            <Button
              variant="primary"
              size="medium"
              loading
              style={{ marginRight: spacing[2] }}
            >
              Loading
            </Button>
            <Button
              variant="primary"
              size="medium"
              disabled
            >
              Disabled
            </Button>
          </View>
        </View>

        {/* TextInput Components */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TextInput Components</Text>
          <Text style={styles.description}>
            Text inputs with various states, validation, and RTL support.
          </Text>

          <TextInput
            label="Standard Input"
            placeholder="Enter some text..."
            value={inputValue}
            onChangeText={setInputValue}
            containerStyle={{ marginBottom: spacing[4] }}
          />

          <TextInput
            label="Email Input"
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={{ marginBottom: spacing[4] }}
          />

          <TextInput
            label="Password Input"
            placeholder="Enter password"
            secureTextEntry
            containerStyle={{ marginBottom: spacing[4] }}
          />

          <TextInput
            label="Error State"
            placeholder="This field has an error"
            error="This is an error message"
            containerStyle={{ marginBottom: spacing[4] }}
          />

          <TextInput
            label="Disabled Input"
            placeholder="This input is disabled"
            disabled
            containerStyle={{ marginBottom: spacing[4] }}
          />
        </View>

        {/* RTL Demonstration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RTL Support</Text>
          <Text style={styles.description}>
            Right-to-Left language support with Arabic text examples.
          </Text>

          <View style={styles.rtlContainer}>
            <Button
              variant="secondary"
              size="medium"
              onPress={() => forceRTL(!isRTL)}
              style={{ marginBottom: spacing[4] }}
            >
              {isRTL ? 'Disable RTL' : 'Enable RTL'}
            </Button>

            <TextInput
              label={isRTL ? 'نص عربي' : 'Arabic Text'}
              placeholder={isRTL ? 'اكتب هنا باللغة العربية...' : 'Type in Arabic...'}
              value={rtlInputValue}
              onChangeText={setRTLInputValue}
              containerStyle={{ marginBottom: spacing[4] }}
              rtlEnabled
              autoDetectRTL
            />

            <Text style={[styles.description, { 
              textAlign: isRTL ? 'right' : 'left',
              writingDirection: isRTL ? 'rtl' : 'ltr' 
            }]}>
              {isRTL ? 
                'هذا نص تجريبي باللغة العربية لاختبار دعم الكتابة من اليمين إلى اليسار في نظام التصميم.' :
                'This is sample text to demonstrate RTL layout adaptation. Switch to RTL to see Arabic text.'
              }
            </Text>
          </View>
        </View>

        {/* Card Components */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Card Components</Text>
          <Text style={styles.description}>
            Cards with different variants and interactive states.
          </Text>

          <Card
            style={{ marginBottom: spacing[4] }}
            onPress={() => Alert.alert('Card Pressed', 'Basic card was pressed!')}
          >
            <Text style={[typography.heading.h3, { color: theme.text.primary, marginBottom: spacing[2] }]}>
              Basic Card
            </Text>
            <Text style={[typography.body.medium, { color: theme.text.secondary }]}>
              This is a basic card component with press interaction. Cards automatically adapt to the current theme.
            </Text>
          </Card>

          <Card
            variant="elevated"
            style={{ marginBottom: spacing[4] }}
          >
            <Text style={[typography.heading.h3, { color: theme.text.primary, marginBottom: spacing[2] }]}>
              Elevated Card
            </Text>
            <Text style={[typography.body.medium, { color: theme.text.secondary, marginBottom: spacing[3] }]}>
              This card has additional elevation with enhanced shadow for hierarchy.
            </Text>
            <Button
              variant="primary"
              size="small"
              onPress={() => Alert.alert('Card Action', 'Card action button pressed!')}
            >
              Card Action
            </Button>
          </Card>

          <Card
            style={{
              marginBottom: spacing[4],
              backgroundColor: isDark ? themeColors.status.info + '20' : themeColors.status.info + '10'
            }}
          >
            <Text style={[typography.heading.h4, { color: themeColors.status.info, marginBottom: spacing[2] }]}>
              Colored Card
            </Text>
            <Text style={[typography.body.medium, { color: theme.text.primary }]}>
              Cards can be customized with different background colors while maintaining accessibility.
            </Text>
          </Card>
        </View>

        {/* Typography Scale */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Typography System</Text>
          <Text style={styles.description}>
            Complete typography scale with semantic naming and responsive sizing.
          </Text>

          {/* Display Typography */}
          <Text style={styles.subsectionTitle}>Display</Text>
          <View style={styles.typographySample}>
            <Text style={[typography.display.large, { color: theme.text.primary }]}>
              Display Large (32px)
            </Text>
            <Text style={[typography.display.medium, { color: theme.text.primary }]}>
              Display Medium (28px)
            </Text>
            <Text style={[typography.display.small, { color: theme.text.primary }]}>
              Display Small (24px)
            </Text>
          </View>

          {/* Heading Typography */}
          <Text style={styles.subsectionTitle}>Headings</Text>
          <View style={styles.typographySample}>
            <Text style={[typography.heading.h1, { color: theme.text.primary }]}>
              Heading 1 (22px)
            </Text>
            <Text style={[typography.heading.h2, { color: theme.text.primary }]}>
              Heading 2 (20px)
            </Text>
            <Text style={[typography.heading.h3, { color: theme.text.primary }]}>
              Heading 3 (18px)
            </Text>
            <Text style={[typography.heading.h4, { color: theme.text.primary }]}>
              Heading 4 (16px)
            </Text>
          </View>

          {/* Body Typography */}
          <Text style={styles.subsectionTitle}>Body Text</Text>
          <View style={styles.typographySample}>
            <Text style={[typography.body.large, { color: theme.text.primary }]}>
              Body Large (16px) - Main content text
            </Text>
            <Text style={[typography.body.medium, { color: theme.text.secondary }]}>
              Body Medium (14px) - Secondary content text
            </Text>
            <Text style={[typography.body.small, { color: theme.text.tertiary }]}>
              Body Small (12px) - Supporting text
            </Text>
          </View>
        </View>

        {/* Color Palette */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Color System</Text>
          <Text style={styles.description}>
            Semantic color palette with theme adaptation and accessibility compliance.
          </Text>

          {/* Primary Colors */}
          <Text style={styles.subsectionTitle}>Primary Colors</Text>
          <View style={styles.row}>
            {Object.entries(colors.primary).slice(0, 5).map(([shade, color]) => (
              <View key={shade} style={{ alignItems: 'center', marginRight: spacing[2] }}>
                <View style={[styles.colorSwatch, { backgroundColor: color as string }]} />
                <Text style={styles.colorLabel}>{shade}</Text>
              </View>
            ))}
          </View>

          {/* Status Colors */}
          <Text style={styles.subsectionTitle}>Status Colors</Text>
          <View style={styles.row}>
            <View style={{ alignItems: 'center', marginRight: spacing[2] }}>
              <View style={[styles.colorSwatch, { backgroundColor: themeColors.status.success }]} />
              <Text style={styles.colorLabel}>Success</Text>
            </View>
            <View style={{ alignItems: 'center', marginRight: spacing[2] }}>
              <View style={[styles.colorSwatch, { backgroundColor: themeColors.status.warning }]} />
              <Text style={styles.colorLabel}>Warning</Text>
            </View>
            <View style={{ alignItems: 'center', marginRight: spacing[2] }}>
              <View style={[styles.colorSwatch, { backgroundColor: themeColors.status.error }]} />
              <Text style={styles.colorLabel}>Error</Text>
            </View>
            <View style={{ alignItems: 'center', marginRight: spacing[2] }}>
              <View style={[styles.colorSwatch, { backgroundColor: themeColors.status.info }]} />
              <Text style={styles.colorLabel}>Info</Text>
            </View>
          </View>
        </View>

        {/* Spacing System */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spacing System</Text>
          <Text style={styles.description}>
            Consistent 4pt grid-based spacing system for layout harmony.
          </Text>

          {([1, 2, 3, 4, 6, 8] as const).map((size) => (
            <View key={size} style={{ marginBottom: spacing[2] }}>
              <Text style={[typography.caption.small, { color: theme.text.secondary, marginBottom: spacing[1] }]}>
                Spacing {size} ({spacing[size]}px)
              </Text>
              <View
                style={[
                  styles.spacingSample,
                  { height: 8, width: spacing[size] }
                ]}
              />
            </View>
          ))}
        </View>

        {/* Advanced Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Advanced Features</Text>
          <Text style={styles.description}>
            Advanced design system capabilities and utilities.
          </Text>

          <Button
            variant="secondary"
            size="medium"
            onPress={() => setShowAdvanced(!showAdvanced)}
            style={{ marginBottom: spacing[4] }}
          >
            {`${showAdvanced ? 'Hide' : 'Show'} Advanced Features`}
          </Button>

          {showAdvanced && (
            <View>
              <Text style={styles.subsectionTitle}>Accessibility</Text>
              <View style={styles.infoCard}>
                <Text style={styles.infoText}>
                  • Minimum touch target: {accessibility.touchTargets.minimum}px{'\n'}
                  • Recommended touch target: {accessibility.touchTargets.recommended}px{'\n'}
                  • Color contrast ratio: 4.5:1 minimum{'\n'}
                  • Screen reader support: Enabled{'\n'}
                  • Keyboard navigation: Supported
                </Text>
              </View>

              <Text style={styles.subsectionTitle}>Performance</Text>
              <View style={styles.infoCard}>
                <Text style={styles.infoText}>
                  • Theme switching: Optimized with React.useMemo{'\n'}
                  • Component rendering: Minimized re-renders{'\n'}
                  • Bundle size: Optimized with tree-shaking{'\n'}
                  • Memory usage: Efficient context management
                </Text>
              </View>

              <Text style={styles.subsectionTitle}>TypeScript</Text>
              <View style={styles.infoCard}>
                <Text style={styles.infoText}>
                  • Full type safety: All components and tokens{'\n'}
                  • IntelliSense support: Complete autocomplete{'\n'}
                  • Compile-time validation: Prevents runtime errors{'\n'}
                  • Type inference: Automatic type detection
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <Text style={[styles.infoText, { textAlign: 'center' }]}>
              🎨 Rukn Design System v1.0{'\n'}
              Complete implementation with 50+ design tokens,{'\n'}
              responsive design, RTL support, and accessibility compliance.
            </Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

export default DesignSystemShowcase;