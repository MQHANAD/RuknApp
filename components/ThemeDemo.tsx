/**
 * Theme Demo Component
 * 
 * A comprehensive demo screen that showcases all design system components
 * with theme switching functionality for testing the theme system.
 */

import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { useTheme, ThemeMode } from '../src/context/ThemeContext';
import { Button } from './design-system/Button';
import { TextInput } from './design-system/TextInput';
import { Card } from './design-system/Card';
import { spacing, typography } from '../constants/design-tokens';

/**
 * Theme Demo Component
 */
const ThemeDemo: React.FC = () => {
  const { theme, themeMode, isDark, setThemeMode, toggleTheme } = useTheme();
  const [textValue, setTextValue] = useState('');
  const [textError, setTextError] = useState('');

  // Handle theme mode changes
  const handleThemeModeChange = async (mode: ThemeMode) => {
    try {
      await setThemeMode(mode);
      Alert.alert('Theme Changed', `Switched to ${mode} mode`);
    } catch (error) {
      Alert.alert('Error', 'Failed to change theme');
    }
  };

  const handleToggleTheme = async () => {
    try {
      await toggleTheme();
      Alert.alert('Theme Toggled', `Switched to ${isDark ? 'light' : 'dark'} mode`);
    } catch (error) {
      Alert.alert('Error', 'Failed to toggle theme');
    }
  };

  const handleButtonPress = (variant: string) => {
    Alert.alert('Button Pressed', `${variant} button was pressed!`);
  };

  const handleTextInputChange = (value: string) => {
    setTextValue(value);
    if (value.length < 3 && value.length > 0) {
      setTextError('Must be at least 3 characters');
    } else {
      setTextError('');
    }
  };

  const styles = createStyles(theme, isDark);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Theme Demo</Text>
        <Text style={styles.subtitle}>
          Current: {themeMode} mode {isDark ? '🌙' : '☀️'}
        </Text>
      </View>

      {/* Theme Controls */}
      <Card variant="default" style={styles.themeCard}>
        <Text style={styles.sectionTitle}>Theme Controls</Text>
        
        <View style={styles.buttonRow}>
          <Button
            variant="primary"
            size="medium"
            onPress={() => handleThemeModeChange('light')}
            style={styles.themeButton}
          >
            Light
          </Button>
          <Button
            variant="primary"
            size="medium"
            onPress={() => handleThemeModeChange('dark')}
            style={styles.themeButton}
          >
            Dark
          </Button>
          <Button
            variant="primary"
            size="medium"
            onPress={() => handleThemeModeChange('system')}
            style={styles.themeButton}
          >
            System
          </Button>
        </View>

        <Button
          variant="secondary"
          size="large"
          onPress={handleToggleTheme}
          fullWidth
          style={styles.toggleButton}
        >
          Toggle Theme
        </Button>
      </Card>

      {/* Button Variants Demo */}
      <Card variant="default" style={styles.demoCard}>
        <Text style={styles.sectionTitle}>Button Variants</Text>
        
        <View style={styles.buttonGroup}>
          <Text style={styles.groupLabel}>Primary Buttons</Text>
          <View style={styles.buttonRow}>
            <Button
              variant="primary"
              size="small"
              onPress={() => handleButtonPress('Primary Small')}
              style={styles.demoButton}
            >
              Small
            </Button>
            <Button
              variant="primary"
              size="medium"
              onPress={() => handleButtonPress('Primary Medium')}
              style={styles.demoButton}
            >
              Medium
            </Button>
            <Button
              variant="primary"
              size="large"
              onPress={() => handleButtonPress('Primary Large')}
              style={styles.demoButton}
            >
              Large
            </Button>
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <Text style={styles.groupLabel}>Secondary Buttons</Text>
          <View style={styles.buttonRow}>
            <Button
              variant="secondary"
              size="small"
              onPress={() => handleButtonPress('Secondary Small')}
              style={styles.demoButton}
            >
              Small
            </Button>
            <Button
              variant="secondary"
              size="medium"
              onPress={() => handleButtonPress('Secondary Medium')}
              style={styles.demoButton}
            >
              Medium
            </Button>
            <Button
              variant="secondary"
              size="large"
              onPress={() => handleButtonPress('Secondary Large')}
              style={styles.demoButton}
            >
              Large
            </Button>
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <Text style={styles.groupLabel}>Ghost Buttons</Text>
          <View style={styles.buttonRow}>
            <Button
              variant="ghost"
              size="small"
              onPress={() => handleButtonPress('Ghost Small')}
              style={styles.demoButton}
            >
              Small
            </Button>
            <Button
              variant="ghost"
              size="medium"
              onPress={() => handleButtonPress('Ghost Medium')}
              style={styles.demoButton}
            >
              Medium
            </Button>
            <Button
              variant="ghost"
              size="large"
              onPress={() => handleButtonPress('Ghost Large')}
              style={styles.demoButton}
            >
              Large
            </Button>
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <Text style={styles.groupLabel}>States</Text>
          <View style={styles.buttonRow}>
            <Button
              variant="primary"
              size="medium"
              disabled
              style={styles.demoButton}
            >
              Disabled
            </Button>
            <Button
              variant="primary"
              size="medium"
              loading
              onPress={() => {}}
              style={styles.demoButton}
            >
              Loading
            </Button>
          </View>
        </View>

        <Button
          variant="primary"
          size="large"
          fullWidth
          onPress={() => handleButtonPress('Full Width')}
          style={styles.fullWidthButton}
        >
          Full Width Button
        </Button>
      </Card>

      {/* TextInput Demo */}
      <Card variant="default" style={styles.demoCard}>
        <Text style={styles.sectionTitle}>Text Input Components</Text>
        
        <TextInput
          label="Basic Input"
          placeholder="Enter some text..."
          value={textValue}
          onChangeText={handleTextInputChange}
          error={textError}
          helperText="This is helper text"
        />
        
        <TextInput
          label="Required Field"
          placeholder="This field is required"
          required
          helperText="Required fields are marked with *"
        />
        
        <TextInput
          label="With Error"
          placeholder="Input with error"
          error="This field has an error"
        />
        
        <TextInput
          label="Disabled Input"
          placeholder="This input is disabled"
          disabled
          value="Disabled value"
        />
        
        <TextInput
          placeholder="No label input"
          helperText="Input without a label"
        />
      </Card>

      {/* Card Variants Demo */}
      <Card variant="default" style={styles.demoCard}>
        <Text style={styles.sectionTitle}>Card Variants</Text>
        
        <View style={styles.cardGrid}>
          <Card variant="default" style={styles.smallCard}>
            <Text style={styles.cardText}>Default Card</Text>
            <Text style={styles.cardSubtext}>With medium shadow</Text>
          </Card>
          
          <Card variant="elevated" style={styles.smallCard}>
            <Text style={styles.cardText}>Elevated Card</Text>
            <Text style={styles.cardSubtext}>With large shadow</Text>
          </Card>
          
          <Card variant="outlined" style={styles.smallCard}>
            <Text style={styles.cardText}>Outlined Card</Text>
            <Text style={styles.cardSubtext}>With border, no shadow</Text>
          </Card>
          
          <Card 
            variant="default" 
            style={styles.smallCard}
            onPress={() => Alert.alert('Card Pressed', 'Touchable card was pressed!')}
          >
            <Text style={styles.cardText}>Touchable Card</Text>
            <Text style={styles.cardSubtext}>Tap me!</Text>
          </Card>
        </View>
      </Card>

      {/* Theme Information */}
      <Card variant="outlined" style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Theme Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Mode:</Text>
          <Text style={styles.infoValue}>{themeMode}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Is Dark:</Text>
          <Text style={styles.infoValue}>{isDark ? 'Yes' : 'No'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Primary Color:</Text>
          <View style={[styles.colorSwatch, { backgroundColor: theme.interactive.primary }]} />
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Background:</Text>
          <View style={[styles.colorSwatch, { backgroundColor: theme.background.primary }]} />
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Surface:</Text>
          <View style={[styles.colorSwatch, { backgroundColor: theme.surface.primary }]} />
        </View>
      </Card>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          🎨 Theme system working correctly! Switch themes to see real-time updates.
        </Text>
      </View>
    </ScrollView>
  );
};

/**
 * Create theme-aware styles
 */
const createStyles = (theme: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background.primary,
  },
  contentContainer: {
    padding: spacing[4],
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  title: {
    ...typography.display.medium,
    color: theme.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body.large,
    color: theme.text.secondary,
    textAlign: 'center',
    marginTop: spacing[2],
  },
  themeCard: {
    marginBottom: spacing[4],
  },
  demoCard: {
    marginBottom: spacing[4],
  },
  infoCard: {
    marginBottom: spacing[4],
  },
  sectionTitle: {
    ...typography.heading.h3,
    color: theme.text.primary,
    marginBottom: spacing[4],
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing[3],
  },
  themeButton: {
    flex: 1,
    marginHorizontal: spacing[1],
  },
  toggleButton: {
    marginTop: spacing[2],
  },
  buttonGroup: {
    marginBottom: spacing[4],
  },
  groupLabel: {
    ...typography.body.medium,
    fontWeight: '600',
    color: theme.text.primary,
    marginBottom: spacing[2],
  },
  demoButton: {
    flex: 1,
    marginHorizontal: spacing[1],
    marginVertical: spacing[1],
  },
  fullWidthButton: {
    marginTop: spacing[2],
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  smallCard: {
    width: '48%',
    marginBottom: spacing[3],
    padding: spacing[3],
  },
  cardText: {
    ...typography.body.medium,
    fontWeight: '600',
    color: theme.text.primary,
    marginBottom: spacing[1],
  },
  cardSubtext: {
    ...typography.body.small,
    color: theme.text.secondary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[2],
  },
  infoLabel: {
    ...typography.body.medium,
    color: theme.text.secondary,
  },
  infoValue: {
    ...typography.body.medium,
    fontWeight: '600',
    color: theme.text.primary,
  },
  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.border.primary,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing[4],
    marginBottom: spacing[8],
  },
  footerText: {
    ...typography.body.medium,
    color: theme.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default ThemeDemo;