/**
 * RTLDemo Component
 * 
 * Demonstrates RTL (Right-to-Left) language support including:
 * - Arabic text rendering and font selection
 * - Direction-aware layouts and styling
 * - Icon flipping and directional elements
 * - Text direction detection and handling
 * - RTL-aware component behavior
 */

import React, { memo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  Image,
} from 'react-native';
import { useRTL, useRTLText, useRTLLayout } from '../src/hooks/useRTL';
import { useTheme } from '../src/context/ThemeContext';
import { Button, TextInput, Card } from './design-system';
import { spacing, typography, colors } from '../constants/design-tokens';

/**
 * RTLDemo Component
 * 
 * Showcases RTL design system features with interactive examples
 * including Arabic text, layout direction, and icon behavior.
 */
const RTLDemo: React.FC = () => {
  const { theme } = useTheme();
  const {
    isRTL,
    textDirection,
    layoutDirection,
    config,
    forceRTL,
    textAlign,
    paddingStart,
    paddingEnd,
    marginStart,
    marginEnd,
    flexDirection,
    shouldFlipIcon,
    getIconStyle,
    arabicFontConfig,
    getArabicTextStyle,
    containsArabic,
    containsHebrew,
    containsRTLText,
    getTextDirectionForText,
    createRTLStyle,
    getAccessibleRTLProps,
  } = useRTL();

  const [rtlEnabled, setRtlEnabled] = useState(isRTL);
  const [sampleText, setSampleText] = useState('Hello World');
  const [arabicText, setArabicText] = useState('مرحبا بالعالم');

  // Sample texts for demonstration
  const sampleTexts = {
    english: 'Hello, this is English text that flows left-to-right.',
    arabic: 'مرحباً، هذا نص عربي يتدفق من اليمين إلى اليسار.',
    hebrew: 'שלום, זה טקסט עברי הזורם מימין לשמאל.',
    mixed: 'Mixed: Hello مرحبا שלום 123',
  };

  // Toggle RTL mode
  const handleRTLToggle = (value: boolean) => {
    setRtlEnabled(value);
    forceRTL(value);
  };

  // Get text analysis for current sample text
  const textAnalysis = useRTLText(sampleText);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background.primary }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[
        styles.header,
        createRTLStyle({
          textAlign: 'center',
        })
      ]}>
        <Text style={[
          styles.title,
          { color: theme.text.primary },
          getArabicTextStyle(undefined, { textAlign: textAlign('center') })
        ]}>
          RTL & Arabic Support Demo
        </Text>
        <Text style={[
          styles.subtitle, 
          { 
            color: theme.text.secondary,
            textAlign: textAlign('center'),
          }
        ]}>
          Interactive examples of RTL behavior
        </Text>
      </View>

      {/* RTL Control */}
      <Card 
        variant="elevated" 
        style={styles.controlCard}
        rtlEnabled
      >
        <View style={[
          styles.controlRow,
          { flexDirection: flexDirection('row') }
        ]}>
          <Text style={[
            styles.controlLabel, 
            { 
              color: theme.text.primary,
              textAlign: textAlign('start'),
            }
          ]}>
            Force RTL Mode
          </Text>
          <Switch
            value={rtlEnabled}
            onValueChange={handleRTLToggle}
            trackColor={{ 
              false: theme.surface.secondary, 
              true: theme.interactive.primary 
            }}
            thumbColor={rtlEnabled ? theme.text.inverse : theme.text.secondary}
          />
        </View>
      </Card>

      {/* RTL Status Information */}
      <Card 
        variant="outlined" 
        style={styles.statusCard}
        rtlEnabled
      >
        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
          🧭 Direction Status
        </Text>
        
        <View style={styles.statusGrid}>
          <StatusItem 
            label="Current Direction" 
            value={isRTL ? 'RTL (Right-to-Left)' : 'LTR (Left-to-Right)'} 
            theme={theme}
            isRTL={isRTL}
          />
          <StatusItem 
            label="Text Direction" 
            value={textDirection.toUpperCase()} 
            theme={theme}
            isRTL={isRTL}
          />
          <StatusItem 
            label="Layout Direction" 
            value={layoutDirection.toUpperCase()} 
            theme={theme}
            isRTL={isRTL}
          />
          <StatusItem 
            label="System RTL" 
            value={config.isRTL ? 'Enabled' : 'Disabled'} 
            theme={theme}
            isRTL={isRTL}
          />
        </View>
      </Card>

      {/* Text Direction Demo */}
      <Card 
        variant="default" 
        style={styles.demoCard}
        rtlEnabled
      >
        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
          📝 Text Direction Examples
        </Text>
        
        {Object.entries(sampleTexts).map(([key, text]) => {
          const textDir = getTextDirectionForText(text);
          const hasArabic = containsArabic(text);
          const hasHebrew = containsHebrew(text);
          const hasRTLText = containsRTLText(text);
          
          return (
            <View key={key} style={styles.textExample}>
              <Text style={[
                styles.textLabel, 
                { 
                  color: theme.text.secondary,
                  textAlign: textAlign('start'),
                }
              ]}>
                {key.charAt(0).toUpperCase() + key.slice(1)} 
                ({textDir.toUpperCase()})
                {hasArabic && ' • Arabic'}
                {hasHebrew && ' • Hebrew'}
              </Text>
              <Text style={[
                styles.textSample,
                { 
                  color: theme.text.primary,
                  textAlign: textAlign(textDir === 'rtl' ? 'right' : 'left'),
                },
                hasArabic && getArabicTextStyle(undefined, { 
                  textAlign: textAlign('right'),
                  writingDirection: 'rtl' 
                }),
              ]}>
                {text}
              </Text>
            </View>
          );
        })}
      </Card>

      {/* Interactive Text Input */}
      <Card 
        variant="elevated" 
        style={styles.demoCard}
        rtlEnabled
      >
        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
          ⌨️ Interactive Text Analysis
        </Text>
        
        <TextInput
          label="Type text to analyze direction"
          value={sampleText}
          onChangeText={setSampleText}
          placeholder="Enter text in any language..."
          rtlEnabled
          autoDetectRTL
          helperText={`Direction: ${textAnalysis.textDirection} | Contains RTL: ${textAnalysis.containsRTL}`}
        />

        <View style={styles.analysisContainer}>
          <AnalysisChip 
            label="Arabic" 
            active={textAnalysis.containsArabic} 
            theme={theme} 
          />
          <AnalysisChip 
            label="Hebrew" 
            active={textAnalysis.containsHebrew} 
            theme={theme} 
          />
          <AnalysisChip 
            label="RTL Text" 
            active={textAnalysis.containsRTL} 
            theme={theme} 
          />
          <AnalysisChip 
            label={`Direction: ${textAnalysis.textDirection.toUpperCase()}`} 
            active={true} 
            theme={theme} 
          />
        </View>
      </Card>

      {/* Layout Direction Demo */}
      <Card 
        variant="default" 
        style={styles.demoCard}
        rtlEnabled
      >
        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
          🔄 Layout Direction Examples
        </Text>
        
        {/* Flex Direction Demo */}
        <View style={styles.layoutSection}>
          <Text style={[
            styles.layoutLabel, 
            { 
              color: theme.text.secondary,
              textAlign: textAlign('start'),
            }
          ]}>
            Flex Row (Auto-flip in RTL)
          </Text>
          <View style={[
            styles.flexDemo,
            { 
              flexDirection: flexDirection('row'),
              backgroundColor: theme.surface.secondary,
            }
          ]}>
            <View style={[styles.flexItem, { backgroundColor: theme.interactive.primary }]}>
              <Text style={[styles.flexItemText, { color: theme.text.inverse }]}>1</Text>
            </View>
            <View style={[styles.flexItem, { backgroundColor: theme.status.success }]}>
              <Text style={[styles.flexItemText, { color: theme.text.inverse }]}>2</Text>
            </View>
            <View style={[styles.flexItem, { backgroundColor: theme.status.warning }]}>
              <Text style={[styles.flexItemText, { color: theme.text.inverse }]}>3</Text>
            </View>
          </View>
        </View>

        {/* Padding Demo */}
        <View style={styles.layoutSection}>
          <Text style={[
            styles.layoutLabel, 
            { 
              color: theme.text.secondary,
              textAlign: textAlign('start'),
            }
          ]}>
            Direction-aware Padding
          </Text>
          <View style={[
            styles.paddingDemo,
            { backgroundColor: theme.surface.secondary },
            paddingStart(24),
            paddingEnd(8),
          ]}>
            <Text style={[
              styles.paddingText,
              { 
                color: theme.text.primary,
                textAlign: textAlign('start'),
              }
            ]}>
              Start: 24px, End: 8px
              {'\n'}(Padding adapts to text direction)
            </Text>
          </View>
        </View>
      </Card>

      {/* Component Examples */}
      <Card 
        variant="outlined" 
        style={styles.demoCard}
        rtlEnabled
      >
        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
          🎛️ RTL-Aware Components
        </Text>
        
        {/* Buttons with RTL */}
        <View style={styles.componentSection}>
          <Text style={[
            styles.componentTitle, 
            { 
              color: theme.text.secondary,
              textAlign: textAlign('start'),
            }
          ]}>
            Buttons (RTL Layout)
          </Text>
          <View style={[
            styles.buttonRow,
            { flexDirection: flexDirection('row') }
          ]}>
            <Button variant="primary" rtlEnabled>
              Primary
            </Button>
            <Button variant="secondary" rtlEnabled>
              Secondary
            </Button>
            <Button variant="ghost" rtlEnabled>
              Ghost
            </Button>
          </View>
        </View>

        {/* Arabic Text Input */}
        <View style={styles.componentSection}>
          <Text style={[
            styles.componentTitle, 
            { 
              color: theme.text.secondary,
              textAlign: textAlign('start'),
            }
          ]}>
            Arabic Text Input
          </Text>
          <TextInput
            label="Arabic Input / إدخال عربي"
            value={arabicText}
            onChangeText={setArabicText}
            placeholder="اكتب النص العربي هنا..."
            rtlEnabled
            autoDetectRTL
          />
        </View>
      </Card>

      {/* Icon Direction Demo */}
      <Card 
        variant="default" 
        style={styles.demoCard}
        rtlEnabled
      >
        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
          🔄 Icon Direction Handling
        </Text>
        
        <View style={styles.iconSection}>
          <IconDemo 
            type="directional" 
            label="Directional Icons (flip in RTL)" 
            shouldFlip={shouldFlipIcon('directional')}
            theme={theme}
            isRTL={isRTL}
          />
          <IconDemo 
            type="neutral" 
            label="Neutral Icons (no flip)" 
            shouldFlip={shouldFlipIcon('neutral')}
            theme={theme}
            isRTL={isRTL}
          />
          <IconDemo 
            type="text" 
            label="Text Icons (flip in RTL)" 
            shouldFlip={shouldFlipIcon('text')}
            theme={theme}
            isRTL={isRTL}
          />
        </View>
      </Card>

      {/* Accessibility Demo */}
      <Card 
        variant="elevated" 
        style={styles.accessibilityCard}
        rtlEnabled
      >
        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
          ♿ Accessibility Support
        </Text>
        
        <Text style={[
          styles.accessibilityText,
          { 
            color: theme.text.secondary,
            textAlign: textAlign('start'),
          }
        ]}>
          RTL components automatically include proper accessibility attributes:
          {'\n'}• Language detection (ar/en)
          {'\n'}• Screen reader direction hints
          {'\n'}• Proper text flow indicators
          {'\n'}• Cultural reading patterns
        </Text>

        <View style={[
          styles.accessibilityDemo,
          { backgroundColor: theme.surface.secondary }
        ]}>
          <Text style={[
            styles.accessibilityLabel,
            { color: theme.text.primary },
            getArabicTextStyle(),
          ]} 
          {...getAccessibleRTLProps(arabicText)}
          >
            {arabicText}
          </Text>
        </View>
      </Card>

      {/* Instructions */}
      <Card 
        variant="outlined" 
        style={styles.instructionsCard}
        rtlEnabled
      >
        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
          💡 Try This
        </Text>
        <Text style={[
          styles.instructionText, 
          { 
            color: theme.text.secondary,
            textAlign: textAlign('start'),
          }
        ]}>
          • Toggle RTL mode using the switch above{'\n'}
          • Type Arabic text: مرحبا، كيف حالك؟{'\n'}
          • Notice how layouts automatically flip{'\n'}
          • See how icons and text adapt{'\n'}
          • All changes respect cultural conventions
        </Text>
      </Card>
    </ScrollView>
  );
};

// Helper Components
interface StatusItemProps {
  label: string;
  value: string;
  theme: any;
  isRTL: boolean;
}

const StatusItem: React.FC<StatusItemProps> = ({ label, value, theme, isRTL }) => {
  const { textAlign } = useRTL();
  
  return (
    <View style={styles.statusItem}>
      <Text style={[
        styles.statusLabel, 
        { 
          color: theme.text.tertiary,
          textAlign: textAlign('start'),
        }
      ]}>
        {label}
      </Text>
      <Text style={[
        styles.statusValue, 
        { 
          color: theme.text.primary,
          textAlign: textAlign('start'),
        }
      ]}>
        {value}
      </Text>
    </View>
  );
};

interface AnalysisChipProps {
  label: string;
  active: boolean;
  theme: any;
}

const AnalysisChip: React.FC<AnalysisChipProps> = ({ label, active, theme }) => (
  <View style={[
    styles.analysisChip,
    {
      backgroundColor: active ? theme.interactive.primary : theme.surface.secondary,
    }
  ]}>
    <Text style={[
      styles.analysisChipText,
      {
        color: active ? theme.text.inverse : theme.text.secondary,
      }
    ]}>
      {label}
    </Text>
  </View>
);

interface IconDemoProps {
  type: 'directional' | 'neutral' | 'text';
  label: string;
  shouldFlip: boolean;
  theme: any;
  isRTL: boolean;
}

const IconDemo: React.FC<IconDemoProps> = ({ type, label, shouldFlip, theme, isRTL }) => {
  const { getIconStyle, textAlign } = useRTL();
  
  return (
    <View style={styles.iconDemoItem}>
      <View style={[
        styles.iconContainer,
        { backgroundColor: theme.surface.secondary }
      ]}>
        {/* Simulated icon with arrow */}
        <Text style={[
          styles.iconArrow,
          { color: theme.text.primary },
          getIconStyle(type),
        ]}>
          →
        </Text>
      </View>
      <Text style={[
        styles.iconLabel,
        { 
          color: theme.text.secondary,
          textAlign: textAlign('center'),
        }
      ]}>
        {label}
      </Text>
      <Text style={[
        styles.iconStatus,
        { 
          color: shouldFlip ? theme.status.success : theme.text.tertiary,
          textAlign: textAlign('center'),
        }
      ]}>
        {shouldFlip ? '✓ Flipped' : '○ Normal'}
      </Text>
    </View>
  );
};

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
    marginBottom: spacing[1],
  },
  subtitle: {
    ...typography.body.large,
  },
  controlCard: {
    marginBottom: spacing[4],
  },
  controlRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlLabel: {
    ...typography.body.medium,
    fontWeight: '500',
  },
  statusCard: {
    marginBottom: spacing[4],
  },
  demoCard: {
    marginBottom: spacing[4],
  },
  instructionsCard: {
    marginBottom: spacing[2],
  },
  accessibilityCard: {
    marginBottom: spacing[4],
  },
  sectionTitle: {
    ...typography.heading.h3,
    marginBottom: spacing[4],
  },
  statusGrid: {
    gap: spacing[3],
  },
  statusItem: {
    paddingBottom: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  statusLabel: {
    ...typography.caption.large,
    marginBottom: spacing[1],
  },
  statusValue: {
    ...typography.body.medium,
    fontWeight: '600',
  },
  textExample: {
    marginBottom: spacing[4],
  },
  textLabel: {
    ...typography.caption.large,
    marginBottom: spacing[1],
  },
  textSample: {
    ...typography.body.large,
    padding: spacing[3],
    backgroundColor: colors.neutral[50],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  analysisContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginTop: spacing[3],
  },
  analysisChip: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 12,
  },
  analysisChipText: {
    ...typography.caption.small,
    fontWeight: '600',
  },
  layoutSection: {
    marginBottom: spacing[4],
  },
  layoutLabel: {
    ...typography.body.medium,
    fontWeight: '500',
    marginBottom: spacing[2],
  },
  flexDemo: {
    padding: spacing[2],
    borderRadius: 8,
    gap: spacing[2],
  },
  flexItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexItemText: {
    ...typography.body.medium,
    fontWeight: '600',
  },
  paddingDemo: {
    borderRadius: 8,
    minHeight: 60,
    justifyContent: 'center',
  },
  paddingText: {
    ...typography.body.medium,
  },
  componentSection: {
    marginBottom: spacing[4],
  },
  componentTitle: {
    ...typography.body.medium,
    fontWeight: '500',
    marginBottom: spacing[3],
  },
  buttonRow: {
    gap: spacing[2],
    flexWrap: 'wrap',
  },
  iconSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  iconDemoItem: {
    alignItems: 'center',
    flex: 1,
    minWidth: 100,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  iconArrow: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  iconLabel: {
    ...typography.caption.large,
    marginBottom: spacing[1],
  },
  iconStatus: {
    ...typography.caption.small,
    fontWeight: '600',
  },
  accessibilityText: {
    ...typography.body.medium,
    lineHeight: 22,
    marginBottom: spacing[3],
  },
  accessibilityDemo: {
    padding: spacing[3],
    borderRadius: 8,
    alignItems: 'center',
  },
  accessibilityLabel: {
    ...typography.body.large,
    fontWeight: '500',
  },
  instructionText: {
    ...typography.body.medium,
    lineHeight: 24,
  },
});

RTLDemo.displayName = 'RTLDemo';

export default memo(RTLDemo);