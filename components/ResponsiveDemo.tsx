/**
 * ResponsiveDemo Component
 * 
 * Demonstrates responsive design capabilities including:
 * - Screen size detection and breakpoint matching
 * - Responsive component sizing
 * - Adaptive layouts based on screen size
 * - Performance-optimized responsive utilities
 */

import React, { memo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useResponsive } from '../src/hooks/useResponsive';
import { useTheme } from '../src/context/ThemeContext';
import { Button, TextInput, Card } from './design-system';
import { spacing, typography, colors } from '../constants/design-tokens';

/**
 * ResponsiveDemo Component
 * 
 * Showcases responsive design system features with live examples
 * that adapt to screen size changes and orientation.
 */
const ResponsiveDemo: React.FC = () => {
  const { theme } = useTheme();
  const {
    screenSize,
    screenWidth,
    screenHeight,
    screenInfo,
    isSmall,
    isMedium,
    isLarge,
    isExtraLarge,
    isTablet,
    isPhone,
    isLandscape,
    isPortrait,
    matchesBreakpoint,
    getResponsiveValue,
    responsiveSpacing,
    responsiveFontSize,
    responsiveComponentSize,
  } = useResponsive();

  // Responsive values for demonstration
  const responsiveColumns = getResponsiveValue({
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
  }, 1) || 1;

  const responsiveCardPadding = responsiveSpacing(16, 'normal');
  const responsiveHeaderSize = responsiveFontSize(24, 'moderate');
  const responsiveButtonSize = getResponsiveValue({
    sm: 'small' as const,
    md: 'medium' as const,
    lg: 'large' as const,
  }, 'medium' as const);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background.primary }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[
          styles.title,
          { 
            color: theme.text.primary,
            fontSize: responsiveHeaderSize,
          }
        ]}>
          Responsive Design Demo
        </Text>
        <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
          Interactive examples of responsive behavior
        </Text>
      </View>

      {/* Screen Information Card */}
      <Card 
        variant="outlined" 
        style={styles.infoCard}
        padding={responsiveCardPadding}
        responsive
      >
        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
          📱 Screen Information
        </Text>
        
        <View style={styles.infoGrid}>
          <InfoItem 
            label="Screen Size" 
            value={screenSize.toUpperCase()} 
            theme={theme} 
          />
          <InfoItem 
            label="Dimensions" 
            value={`${Math.round(screenWidth)} × ${Math.round(screenHeight)}`} 
            theme={theme} 
          />
          <InfoItem 
            label="Device Type" 
            value={isTablet ? 'Tablet' : 'Phone'} 
            theme={theme} 
          />
          <InfoItem 
            label="Orientation" 
            value={isLandscape ? 'Landscape' : 'Portrait'} 
            theme={theme} 
          />
        </View>

        {/* Breakpoint Status */}
        <View style={styles.breakpointContainer}>
          <Text style={[styles.breakpointTitle, { color: theme.text.primary }]}>
            Active Breakpoints:
          </Text>
          <View style={styles.breakpointRow}>
            <BreakpointChip active={isSmall} label="SM" theme={theme} />
            <BreakpointChip active={isMedium} label="MD" theme={theme} />
            <BreakpointChip active={isLarge} label="LG" theme={theme} />
            <BreakpointChip active={isExtraLarge} label="XL" theme={theme} />
          </View>
        </View>
      </Card>

      {/* Responsive Components Demo */}
      <Card 
        variant="elevated" 
        style={styles.demoCard}
        padding={responsiveCardPadding}
        responsive
      >
        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
          🎛️ Responsive Components
        </Text>
        
        {/* Responsive Buttons */}
        <View style={styles.componentSection}>
          <Text style={[styles.componentTitle, { color: theme.text.secondary }]}>
            Buttons (Auto-sizing)
          </Text>
          <View style={styles.buttonRow}>
            <Button 
              size={responsiveButtonSize}
              variant="primary"
              responsive
            >
              Primary
            </Button>
            <Button 
              size={responsiveButtonSize}
              variant="secondary"
              responsive
            >
              Secondary
            </Button>
            <Button 
              size={responsiveButtonSize}
              variant="ghost"
              responsive
            >
              Ghost
            </Button>
          </View>
        </View>

        {/* Responsive Text Input */}
        <View style={styles.componentSection}>
          <Text style={[styles.componentTitle, { color: theme.text.secondary }]}>
            Text Input (Responsive sizing)
          </Text>
          <TextInput
            label="Responsive Input"
            placeholder="This input adapts to screen size"
            responsive
            helperText={`Current size: ${screenSize.toUpperCase()}`}
          />
        </View>

        {/* Responsive Card Grid */}
        <View style={styles.componentSection}>
          <Text style={[styles.componentTitle, { color: theme.text.secondary }]}>
            Card Grid ({responsiveColumns} columns)
          </Text>
          <View style={[
            styles.cardGrid,
            {
              gap: responsiveSpacing(8, 'tight'),
            }
          ]}>
            {Array.from({ length: 6 }, (_, index) => (
              <Card
                key={index}
                variant="default"
                style={StyleSheet.flatten([
                  styles.gridCard,
                  {
                    width: (screenWidth - (responsiveCardPadding * 2) - (responsiveSpacing(8, 'tight') * (responsiveColumns - 1))) / responsiveColumns,
                  }
                ])}
                responsive
                padding={responsiveSpacing(12, 'normal')}
              >
                <Text style={[
                  styles.gridCardText, 
                  { 
                    color: theme.text.primary,
                    fontSize: responsiveFontSize(14, 'conservative'),
                  }
                ]}>
                  Card {index + 1}
                </Text>
              </Card>
            ))}
          </View>
        </View>
      </Card>

      {/* Responsive Values Demo */}
      <Card 
        variant="default" 
        style={styles.demoCard}
        padding={responsiveCardPadding}
        responsive
      >
        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
          📊 Responsive Values
        </Text>
        
        <View style={styles.valuesContainer}>
          <ValueDemo
            label="Spacing"
            value={`${responsiveSpacing(16, 'normal')}px`}
            description="Base 16px with responsive scaling"
            theme={theme}
          />
          <ValueDemo
            label="Font Size"
            value={`${responsiveFontSize(16, 'moderate')}px`}
            description="Base 16px with moderate scaling"
            theme={theme}
          />
          <ValueDemo
            label="Component Size"
            value={`${responsiveComponentSize(48, 'normal')}px`}
            description="Base 48px with normal scaling"
            theme={theme}
          />
          <ValueDemo
            label="Columns"
            value={`${responsiveColumns}`}
            description="Adaptive grid columns"
            theme={theme}
          />
        </View>
      </Card>

      {/* Performance Info */}
      <Card 
        variant="outlined" 
        style={StyleSheet.flatten([styles.demoCard, styles.performanceCard])}
        padding={responsiveSpacing(12, 'tight')}
        responsive
      >
        <Text style={[styles.performanceTitle, { color: theme.text.primary }]}>
          ⚡ Performance Optimized
        </Text>
        <Text style={[styles.performanceText, { color: theme.text.secondary }]}>
          All responsive calculations are memoized and debounced for optimal performance.
          Screen size changes trigger minimal re-renders.
        </Text>
      </Card>

      {/* Instructions */}
      <Card 
        variant="default" 
        style={styles.instructionsCard}
        padding={responsiveCardPadding}
        responsive
      >
        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
          🔄 Try This
        </Text>
        <Text style={[styles.instructionText, { color: theme.text.secondary }]}>
          • Rotate your device to see orientation changes{'\n'}
          • Resize the window (if on web/desktop){'\n'}
          • Notice how components adapt automatically{'\n'}
          • All changes are smooth and performant
        </Text>
      </Card>
    </ScrollView>
  );
};

// Helper Components
interface InfoItemProps {
  label: string;
  value: string;
  theme: any;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value, theme }) => (
  <View style={styles.infoItem}>
    <Text style={[styles.infoLabel, { color: theme.text.tertiary }]}>
      {label}
    </Text>
    <Text style={[styles.infoValue, { color: theme.text.primary }]}>
      {value}
    </Text>
  </View>
);

interface BreakpointChipProps {
  active: boolean;
  label: string;
  theme: any;
}

const BreakpointChip: React.FC<BreakpointChipProps> = ({ active, label, theme }) => (
  <View style={[
    styles.breakpointChip,
    {
      backgroundColor: active ? theme.interactive.primary : theme.surface.secondary,
    }
  ]}>
    <Text style={[
      styles.breakpointChipText,
      {
        color: active ? theme.text.inverse : theme.text.secondary,
      }
    ]}>
      {label}
    </Text>
  </View>
);

interface ValueDemoProps {
  label: string;
  value: string;
  description: string;
  theme: any;
}

const ValueDemo: React.FC<ValueDemoProps> = ({ label, value, description, theme }) => (
  <View style={styles.valueItem}>
    <Text style={[styles.valueLabel, { color: theme.text.primary }]}>
      {label}
    </Text>
    <Text style={[styles.valueValue, { color: theme.interactive.primary }]}>
      {value}
    </Text>
    <Text style={[styles.valueDescription, { color: theme.text.tertiary }]}>
      {description}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing[4],
    paddingBottom: spacing[8],
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  title: {
    ...typography.display.medium,
    textAlign: 'center',
    marginBottom: spacing[1],
  },
  subtitle: {
    ...typography.body.large,
    textAlign: 'center',
  },
  infoCard: {
    marginBottom: spacing[4],
  },
  demoCard: {
    marginBottom: spacing[4],
  },
  instructionsCard: {
    marginBottom: spacing[2],
  },
  performanceCard: {
    borderStyle: 'dashed',
  },
  sectionTitle: {
    ...typography.heading.h3,
    marginBottom: spacing[4],
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing[4],
  },
  infoItem: {
    width: '48%',
    marginBottom: spacing[2],
  },
  infoLabel: {
    ...typography.caption.large,
    marginBottom: spacing[1],
  },
  infoValue: {
    ...typography.body.medium,
    fontWeight: '600',
  },
  breakpointContainer: {
    marginTop: spacing[2],
  },
  breakpointTitle: {
    ...typography.body.medium,
    fontWeight: '500',
    marginBottom: spacing[2],
  },
  breakpointRow: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  breakpointChip: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 12,
  },
  breakpointChipText: {
    ...typography.caption.small,
    fontWeight: '600',
  },
  componentSection: {
    marginBottom: spacing[5],
  },
  componentTitle: {
    ...typography.body.medium,
    fontWeight: '500',
    marginBottom: spacing[3],
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing[2],
    flexWrap: 'wrap',
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCard: {
    marginBottom: spacing[2],
  },
  gridCardText: {
    ...typography.body.small,
    textAlign: 'center',
  },
  valuesContainer: {
    gap: spacing[3],
  },
  valueItem: {
    paddingBottom: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  valueLabel: {
    ...typography.body.medium,
    fontWeight: '600',
  },
  valueValue: {
    ...typography.body.large,
    fontWeight: '700',
    marginVertical: spacing[1],
  },
  valueDescription: {
    ...typography.body.small,
  },
  performanceTitle: {
    ...typography.body.medium,
    fontWeight: '600',
    marginBottom: spacing[2],
  },
  performanceText: {
    ...typography.body.small,
    lineHeight: 20,
  },
  instructionText: {
    ...typography.body.medium,
    lineHeight: 24,
  },
});

ResponsiveDemo.displayName = 'ResponsiveDemo';

export default memo(ResponsiveDemo);