/**
 * Migration Utilities for Design System
 * 
 * This file provides utilities to migrate existing hardcoded values
 * to design tokens for a gradual transition to the design system.
 */

import { colors, typography, spacing } from '../../constants/design-tokens';

// ===== MIGRATION CONFIGURATION INTERFACES =====

export interface ColorMigration {
  /** Original hardcoded color value */
  original: string;
  /** Target design token path */
  token: string;
  /** Actual color value from design token */
  value: string;
  /** Description of the color's purpose */
  description?: string;
}

export interface TypographyMigration {
  /** Original font size */
  originalSize: number;
  /** Target typography token path */
  token: string;
  /** Complete typography style */
  value: {
    fontSize: number;
    lineHeight: number;
    fontWeight: string;
    letterSpacing: number;
  };
  /** Description of the typography's purpose */
  description?: string;
}

export interface SpacingMigration {
  /** Original spacing value */
  original: number;
  /** Target spacing token path */
  token: string;
  /** Spacing value from design token */
  value: number;
  /** Description of the spacing's purpose */
  description?: string;
}

export interface MigrationResult {
  /** Whether migration was successful */
  success: boolean;
  /** Original value that was migrated */
  original: any;
  /** New value after migration */
  migrated: any;
  /** Token path used for migration */
  tokenPath: string;
  /** Any warnings or notes */
  warnings?: string[];
}

// ===== COLOR MIGRATION MAPPINGS =====

/**
 * Color migration mapping from hardcoded values to design tokens
 * Based on analysis of existing codebase patterns
 */
export const colorMigrationMap: Record<string, ColorMigration> = {
  // Primary brand colors
  '#F5A623': {
    original: '#F5A623',
    token: 'colors.primary[500]',
    value: colors.primary[500],
    description: 'Primary brand color'
  },
  '#fbb507': {
    original: '#fbb507',
    token: 'colors.primary[600]',
    value: colors.primary[600],
    description: 'Primary brand darker variant'
  },
  '#db941d': {
    original: '#db941d',
    token: 'colors.primary[700]',
    value: colors.primary[700],
    description: 'Primary brand dark variant'
  },
  
  // Secondary/background colors
  '#1E2A38': {
    original: '#1E2A38',
    token: 'colors.secondary[800]',
    value: colors.secondary[800],
    description: 'Dark background color'
  },
  '#1E293B': {
    original: '#1E293B',
    token: 'colors.secondary[800]',
    value: colors.secondary[800],
    description: 'Dark background color (standardized)'
  },
  
  // Neutral colors
  '#FFFFFF': {
    original: '#FFFFFF',
    token: 'colors.neutral[0]',
    value: colors.neutral[0],
    description: 'Pure white'
  },
  '#ffffff': {
    original: '#ffffff',
    token: 'colors.neutral[0]',
    value: colors.neutral[0],
    description: 'Pure white (lowercase)'
  },
  '#000000': {
    original: '#000000',
    token: 'colors.neutral[1000]',
    value: colors.neutral[1000],
    description: 'Pure black'
  },
  '#000': {
    original: '#000',
    token: 'colors.neutral[1000]',
    value: colors.neutral[1000],
    description: 'Pure black (shorthand)'
  },
  
  // Gray variations
  '#afafac': {
    original: '#afafac',
    token: 'colors.neutral[400]',
    value: colors.neutral[400],
    description: 'Medium-dark gray'
  },
  '#999': {
    original: '#999',
    token: 'colors.neutral[500]',
    value: colors.neutral[500],
    description: 'Medium gray (placeholder text)'
  },
  '#666': {
    original: '#666',
    token: 'colors.neutral[600]',
    value: colors.neutral[600],
    description: 'Dark gray (secondary text)'
  },
  '#333': {
    original: '#333',
    token: 'colors.neutral[700]',
    value: colors.neutral[700],
    description: 'Very dark gray (primary text on light)'
  },
  '#ccc': {
    original: '#ccc',
    token: 'colors.neutral[300]',
    value: colors.neutral[300],
    description: 'Light gray (borders, disabled)'
  },
  
  // Special cases and common variations
  'white': {
    original: 'white',
    token: 'colors.neutral[0]',
    value: colors.neutral[0],
    description: 'White (named color)'
  },
  'black': {
    original: 'black',
    token: 'colors.neutral[1000]',
    value: colors.neutral[1000],
    description: 'Black (named color)'
  },
  'transparent': {
    original: 'transparent',
    token: 'transparent',
    value: 'transparent',
    description: 'Transparent (no change needed)'
  }
};

// ===== TYPOGRAPHY MIGRATION MAPPINGS =====

/**
 * Typography migration mapping from font sizes to design tokens
 */
export const typographyMigrationMap: Record<number, TypographyMigration> = {
  // Display sizes
  32: {
    originalSize: 32,
    token: 'typography.display.large',
    value: typography.display.large,
    description: 'Large display text'
  },
  28: {
    originalSize: 28,
    token: 'typography.display.medium',
    value: typography.display.medium,
    description: 'Medium display text'
  },
  24: {
    originalSize: 24,
    token: 'typography.display.small',
    value: typography.display.small,
    description: 'Small display text (page titles)'
  },
  
  // Headings
  22: {
    originalSize: 22,
    token: 'typography.heading.h1',
    value: typography.heading.h1,
    description: 'Main heading (h1)'
  },
  20: {
    originalSize: 20,
    token: 'typography.heading.h2',
    value: typography.heading.h2,
    description: 'Secondary heading (h2)'
  },
  18: {
    originalSize: 18,
    token: 'typography.heading.h3',
    value: typography.heading.h3,
    description: 'Tertiary heading (h3)'
  },
  16: {
    originalSize: 16,
    token: 'typography.body.large',
    value: typography.body.large,
    description: 'Large body text, buttons'
  },
  
  // Body text
  15: {
    originalSize: 15,
    token: 'typography.body.large',
    value: typography.body.large,
    description: 'Large body text (15px maps to 16px standard)'
  },
  14: {
    originalSize: 14,
    token: 'typography.body.medium',
    value: typography.body.medium,
    description: 'Medium body text'
  },
  13: {
    originalSize: 13,
    token: 'typography.body.medium',
    value: typography.body.medium,
    description: 'Medium body text (13px maps to 14px standard)'
  },
  12: {
    originalSize: 12,
    token: 'typography.body.small',
    value: typography.body.small,
    description: 'Small body text, captions'
  },
  10: {
    originalSize: 10,
    token: 'typography.caption.small',
    value: typography.caption.small,
    description: 'Small caption text'
  },
  9: {
    originalSize: 9,
    token: 'typography.caption.small',
    value: typography.caption.small,
    description: 'Very small text (maps to 10px minimum)'
  }
};

// ===== SPACING MIGRATION MAPPINGS =====

/**
 * Spacing migration mapping from pixel values to design tokens
 */
export const spacingMigrationMap: Record<number, SpacingMigration> = {
  // Base spacing scale
  0: {
    original: 0,
    token: 'spacing[0]',
    value: spacing[0],
    description: 'No spacing'
  },
  4: {
    original: 4,
    token: 'spacing[1]',
    value: spacing[1],
    description: 'Tight spacing'
  },
  8: {
    original: 8,
    token: 'spacing[2]',
    value: spacing[2],
    description: 'Snug spacing'
  },
  12: {
    original: 12,
    token: 'spacing[3]',
    value: spacing[3],
    description: 'Small spacing'
  },
  16: {
    original: 16,
    token: 'spacing[4]',
    value: spacing[4],
    description: 'Medium spacing'
  },
  20: {
    original: 20,
    token: 'spacing[5]',
    value: spacing[5],
    description: 'Medium-large spacing'
  },
  24: {
    original: 24,
    token: 'spacing[6]',
    value: spacing[6],
    description: 'Large spacing'
  },
  32: {
    original: 32,
    token: 'spacing[8]',
    value: spacing[8],
    description: 'Extra large spacing'
  },
  40: {
    original: 40,
    token: 'spacing[10]',
    value: spacing[10],
    description: 'XXL spacing'
  },
  48: {
    original: 48,
    token: 'spacing[12]',
    value: spacing[12],
    description: 'Section spacing'
  },
  64: {
    original: 64,
    token: 'spacing[16]',
    value: spacing[16],
    description: 'Large section spacing'
  },
  
  // Common custom values mapped to nearest standard
  6: {
    original: 6,
    token: 'spacing[2]',
    value: spacing[2],
    description: 'Maps to 8px (nearest standard)'
  },
  10: {
    original: 10,
    token: 'spacing[3]',
    value: spacing[3],
    description: 'Maps to 12px (nearest standard)'
  },
  14: {
    original: 14,
    token: 'spacing[4]',
    value: spacing[4],
    description: 'Maps to 16px (nearest standard)'
  },
  18: {
    original: 18,
    token: 'spacing[5]',
    value: spacing[5],
    description: 'Maps to 20px (nearest standard)'
  },
  30: {
    original: 30,
    token: 'spacing[8]',
    value: spacing[8],
    description: 'Maps to 32px (nearest standard)'
  }
};

// ===== MIGRATION UTILITY FUNCTIONS =====

/**
 * Migrate a single color value to design token
 */
export const migrateColor = (color: string): MigrationResult => {
  const normalizedColor = color.toLowerCase().trim();
  const migration = colorMigrationMap[normalizedColor] || colorMigrationMap[color];
  
  if (!migration) {
    return {
      success: false,
      original: color,
      migrated: color,
      tokenPath: 'none',
      warnings: [`No migration mapping found for color: ${color}`]
    };
  }
  
  return {
    success: true,
    original: color,
    migrated: migration.value,
    tokenPath: migration.token,
    warnings: migration.description ? [migration.description] : undefined
  };
};

/**
 * Migrate multiple colors in a style object
 */
export const migrateColors = (styles: Record<string, any>): { 
  migratedStyles: Record<string, any>, 
  results: MigrationResult[] 
} => {
  const migratedStyles = { ...styles };
  const results: MigrationResult[] = [];
  
  // Common color properties to check
  const colorProperties = [
    'color', 'backgroundColor', 'borderColor', 'shadowColor',
    'tintColor', 'placeholderTextColor', 'textColor'
  ];
  
  for (const [key, value] of Object.entries(styles)) {
    if (colorProperties.includes(key) && typeof value === 'string') {
      const result = migrateColor(value);
      results.push(result);
      
      if (result.success) {
        migratedStyles[key] = result.migrated;
      }
    }
  }
  
  return { migratedStyles, results };
};

/**
 * Migrate a font size to design token
 */
export const migrateTypography = (fontSize: number): MigrationResult => {
  const migration = typographyMigrationMap[fontSize];
  
  if (!migration) {
    // Find closest match
    const availableSizes = Object.keys(typographyMigrationMap).map(Number).sort((a, b) => a - b);
    const closest = availableSizes.reduce((prev, curr) => 
      Math.abs(curr - fontSize) < Math.abs(prev - fontSize) ? curr : prev
    );
    
    const closestMigration = typographyMigrationMap[closest];
    
    return {
      success: true,
      original: fontSize,
      migrated: closestMigration.value,
      tokenPath: closestMigration.token,
      warnings: [
        `No exact match for fontSize ${fontSize}, using closest: ${closest}px (${closestMigration.token})`
      ]
    };
  }
  
  return {
    success: true,
    original: fontSize,
    migrated: migration.value,
    tokenPath: migration.token,
    warnings: migration.description ? [migration.description] : undefined
  };
};

/**
 * Migrate spacing value to design token
 */
export const migrateSpacing = (value: number): MigrationResult => {
  const migration = spacingMigrationMap[value];
  
  if (!migration) {
    // Find closest match
    const availableSpacing = Object.keys(spacingMigrationMap).map(Number).sort((a, b) => a - b);
    const closest = availableSpacing.reduce((prev, curr) => 
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
    
    const closestMigration = spacingMigrationMap[closest];
    
    return {
      success: true,
      original: value,
      migrated: closestMigration.value,
      tokenPath: closestMigration.token,
      warnings: [
        `No exact match for spacing ${value}px, using closest: ${closest}px (${closestMigration.token})`
      ]
    };
  }
  
  return {
    success: true,
    original: value,
    migrated: migration.value,
    tokenPath: migration.token,
    warnings: migration.description ? [migration.description] : undefined
  };
};

/**
 * Migrate multiple spacing values in a style object
 */
export const migrateSpacingStyles = (styles: Record<string, any>): {
  migratedStyles: Record<string, any>,
  results: MigrationResult[]
} => {
  const migratedStyles = { ...styles };
  const results: MigrationResult[] = [];
  
  // Common spacing properties to check
  const spacingProperties = [
    'padding', 'paddingHorizontal', 'paddingVertical', 
    'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
    'margin', 'marginHorizontal', 'marginVertical',
    'marginTop', 'marginBottom', 'marginLeft', 'marginRight',
    'width', 'height', 'borderRadius', 'borderWidth'
  ];
  
  for (const [key, value] of Object.entries(styles)) {
    if (spacingProperties.includes(key) && typeof value === 'number') {
      const result = migrateSpacing(value);
      results.push(result);
      
      if (result.success) {
        migratedStyles[key] = result.migrated;
      }
    }
  }
  
  return { migratedStyles, results };
};

/**
 * Comprehensive style migration function
 */
export const migrateStyle = (styles: Record<string, any>): {
  migratedStyles: Record<string, any>,
  colorResults: MigrationResult[],
  spacingResults: MigrationResult[]
} => {
  const { migratedStyles: colorMigrated, results: colorResults } = migrateColors(styles);
  const { migratedStyles: finalMigrated, results: spacingResults } = migrateSpacingStyles(colorMigrated);
  
  return {
    migratedStyles: finalMigrated,
    colorResults,
    spacingResults
  };
};

/**
 * Generate migration report
 */
export const generateMigrationReport = (results: MigrationResult[]): string => {
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  let report = `Migration Report\n`;
  report += `================\n`;
  report += `Successful: ${successful.length}\n`;
  report += `Failed: ${failed.length}\n`;
  report += `Total: ${results.length}\n\n`;
  
  if (successful.length > 0) {
    report += `Successful Migrations:\n`;
    report += `-----------------------\n`;
    successful.forEach(result => {
      report += `${result.original} → ${result.migrated} (${result.tokenPath})\n`;
      if (result.warnings) {
        result.warnings.forEach(warning => {
          report += `  Warning: ${warning}\n`;
        });
      }
    });
    report += `\n`;
  }
  
  if (failed.length > 0) {
    report += `Failed Migrations:\n`;
    report += `------------------\n`;
    failed.forEach(result => {
      report += `${result.original} - FAILED\n`;
      if (result.warnings) {
        result.warnings.forEach(warning => {
          report += `  Error: ${warning}\n`;
        });
      }
    });
  }
  
  return report;
};

// ===== VALIDATION HELPERS =====

/**
 * Validate that a migration result produces valid React Native styles
 */
export const validateMigration = (original: any, migrated: any): boolean => {
  try {
    // Basic validation - ensure migrated value is not null/undefined
    if (migrated === null || migrated === undefined) {
      return false;
    }
    
    // For colors, ensure it's a string
    if (typeof original === 'string' && original.startsWith('#')) {
      return typeof migrated === 'string';
    }
    
    // For numbers (spacing/typography), ensure it's a number
    if (typeof original === 'number') {
      return typeof migrated === 'number' || (
        typeof migrated === 'object' && 
        migrated.fontSize !== undefined
      );
    }
    
    return true;
  } catch {
    return false;
  }
};

/**
 * Create backup of original styles before migration
 */
export const createBackup = (styles: Record<string, any>): {
  original: Record<string, any>,
  timestamp: number,
  version: string
} => {
  return {
    original: JSON.parse(JSON.stringify(styles)), // Deep copy
    timestamp: Date.now(),
    version: '1.0.0'
  };
};

/**
 * Get all available migration options for a given type
 */
export const getAvailableMigrations = () => {
  return {
    colors: Object.keys(colorMigrationMap),
    typography: Object.keys(typographyMigrationMap).map(Number),
    spacing: Object.keys(spacingMigrationMap).map(Number)
  };
};

export default {
  migrateColor,
  migrateColors,
  migrateTypography,
  migrateSpacing,
  migrateSpacingStyles,
  migrateStyle,
  generateMigrationReport,
  validateMigration,
  createBackup,
  getAvailableMigrations,
  colorMigrationMap,
  typographyMigrationMap,
  spacingMigrationMap
};