import React, { memo, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Modal as RNModal,
  ViewStyle,
  TextStyle,
  Dimensions,
} from 'react-native';
import {
  modalStyles,
  typography,
  spacing,
  colors,
} from '../../../constants/design-tokens';
import { useTheme } from '../../../src/context/ThemeContext';
import { useRTL } from '../../../src/hooks/useRTL';
import { ModalProps, ModalStyles } from './Modal.types';

/**
 * Get Modal styles based on props and theme
 */
const getModalStyles = (
  variant: 'default' | 'fullscreen' | 'bottomSheet',
  size: 'small' | 'medium' | 'large',
  isDark: boolean
): ModalStyles => {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const overlay: ViewStyle = {
    ...modalStyles.overlay,
  };

  let container: ViewStyle = {
    ...modalStyles.container,
    backgroundColor: isDark ? colors.neutral[800] : colors.neutral[0],
  };

  // Variant-specific styling
  switch (variant) {
    case 'fullscreen':
      container = {
        ...container,
        width: screenWidth,
        height: screenHeight,
        borderRadius: 0,
        padding: 0,
      };
      break;
    case 'bottomSheet':
      container = {
        ...container,
        width: screenWidth,
        maxHeight: screenHeight * 0.8,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      };
      overlay.justifyContent = 'flex-end';
      overlay.padding = 0;
      break;
    default:
      // Size-specific styling for default variant
      switch (size) {
        case 'small':
          container.maxWidth = 320;
          break;
        case 'large':
          container.maxWidth = 480;
          break;
        case 'medium':
        default:
          container.maxWidth = 400;
          break;
      }
      break;
  }

  const header: ViewStyle = {
    ...modalStyles.header,
  };

  const title: TextStyle = {
    ...typography.heading.h2,
    color: isDark ? colors.neutral[50] : colors.neutral[900],
  };

  const subtitle: TextStyle = {
    ...typography.body.medium,
    color: isDark ? colors.neutral[300] : colors.neutral[600],
  };

  const content: ViewStyle = {
    ...modalStyles.content,
  };

  const closeButton: ViewStyle = {
    position: 'absolute',
    top: spacing[4],
    right: spacing[4],
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: isDark ? colors.neutral[700] : colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  };

  return {
    overlay,
    container,
    header,
    title,
    subtitle,
    content,
    closeButton,
  };
};

/**
 * Modal component with design system integration
 *
 * A flexible modal component that supports different variants and sizes.
 * Includes overlay, close button, and accessibility features.
 */
const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  children,
  variant = 'default',
  size = 'medium',
  style,
  overlayStyle,
  contentStyle,
  titleStyle,
  subtitleStyle,
  closeButton = true,
  testID,
  accessibilityLabel,
}) => {
  const { isDark } = useTheme();
  const { isRTL } = useRTL();

  const styles = useMemo(
    () => getModalStyles(variant, size, isDark),
    [variant, size, isDark]
  );

  const handleBackdropPress = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleClosePress = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      testID={testID}
      accessibilityLabel={accessibilityLabel}
    >
      <TouchableOpacity
        style={[styles.overlay, overlayStyle]}
        onPress={handleBackdropPress}
        activeOpacity={1}
      >
        <TouchableOpacity
          style={[styles.container, style]}
          onPress={() => {}} // Prevent backdrop press when pressing container
          activeOpacity={1}
        >
          {/* Header */}
          {(title || subtitle) && (
            <View style={styles.header}>
              {title && (
                <Text
                  style={[styles.title, titleStyle]}
                  testID={`${testID}-title`}
                >
                  {title}
                </Text>
              )}
              {subtitle && (
                <Text
                  style={[styles.subtitle, subtitleStyle]}
                  testID={`${testID}-subtitle`}
                >
                  {subtitle}
                </Text>
              )}
            </View>
          )}

          {/* Close Button */}
          {closeButton && onClose && (
            <TouchableOpacity
              style={[
                styles.closeButton,
                isRTL && { right: 'auto', left: spacing[4] }
              ]}
              onPress={handleClosePress}
              accessibilityLabel="Close modal"
              accessibilityRole="button"
              testID={`${testID}-close-button`}
            >
              <Text style={{ fontSize: 18, color: isDark ? colors.neutral[300] : colors.neutral[600] }}>
                ×
              </Text>
            </TouchableOpacity>
          )}

          {/* Content */}
          <View style={[styles.content, contentStyle]}>
            {children}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </RNModal>
  );
};

Modal.displayName = 'Modal';

export default memo(Modal);