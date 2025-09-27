import React, { memo, useMemo, Children } from 'react';
import {
  View,
  ViewStyle,
} from 'react-native';
import {
  gridStyles,
  spacing,
  layoutSpacing,
} from '../../../constants/design-tokens';
import { useTheme } from '../../../src/context/ThemeContext';
import { GridProps, GridStyles } from './Grid.types';

/**
 * Get Grid styles based on props and theme
 */
const getGridStyles = (
  columns: 1 | 2 | 3 | 4 | 6,
  spacing: 'none' | 'tight' | 'snug' | 'small' | 'medium' | 'large',
  isDark: boolean
): GridStyles => {
  const container: ViewStyle = {
    ...gridStyles.container,
  };

  // Apply spacing
  switch (spacing) {
    case 'none':
      container.marginHorizontal = 0;
      break;
    case 'tight':
      container.marginHorizontal = -layoutSpacing.tight;
      break;
    case 'snug':
      container.marginHorizontal = -layoutSpacing.snug;
      break;
    case 'small':
      container.marginHorizontal = -layoutSpacing.small;
      break;
    case 'medium':
      container.marginHorizontal = -layoutSpacing.medium;
      break;
    case 'large':
      container.marginHorizontal = -layoutSpacing.large;
      break;
    default:
      container.marginHorizontal = -layoutSpacing.snug;
      break;
  }

  const item: ViewStyle = {
    ...gridStyles.item,
  };

  // Apply column width
  switch (columns) {
    case 1:
      item.width = gridStyles.columns[1].width;
      break;
    case 2:
      item.width = gridStyles.columns[2].width;
      break;
    case 3:
      item.width = gridStyles.columns[3].width;
      break;
    case 4:
      item.width = gridStyles.columns[4].width;
      break;
    case 6:
      item.width = gridStyles.columns[6].width;
      break;
    default:
      item.width = gridStyles.columns[2].width;
      break;
  }

  // Apply spacing to item
  switch (spacing) {
    case 'none':
      item.paddingHorizontal = 0;
      break;
    case 'tight':
      item.paddingHorizontal = layoutSpacing.tight;
      break;
    case 'snug':
      item.paddingHorizontal = layoutSpacing.snug;
      break;
    case 'small':
      item.paddingHorizontal = layoutSpacing.small;
      break;
    case 'medium':
      item.paddingHorizontal = layoutSpacing.medium;
      break;
    case 'large':
      item.paddingHorizontal = layoutSpacing.large;
      break;
    default:
      item.paddingHorizontal = layoutSpacing.snug;
      break;
  }

  return {
    container,
    item,
  };
};

/**
 * Grid component with design system integration
 *
 * A flexible grid component that arranges children in a grid layout.
 * Supports different column counts and spacing options.
 */
const Grid: React.FC<GridProps> = ({
  children,
  columns = 2,
  spacing = 'medium',
  style,
  itemStyle,
  testID,
  accessibilityLabel,
}) => {
  const { isDark } = useTheme();

  const styles = useMemo(
    () => getGridStyles(columns, spacing, isDark),
    [columns, spacing, isDark]
  );

  const childrenArray = Children.toArray(children);

  return (
    <View
      style={[styles.container, style]}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
    >
      {childrenArray.map((child, index) => (
        <View
          key={index}
          style={[styles.item, itemStyle]}
          testID={`${testID}-item-${index}`}
        >
          {child}
        </View>
      ))}
    </View>
  );
};

Grid.displayName = 'Grid';

export default memo(Grid);