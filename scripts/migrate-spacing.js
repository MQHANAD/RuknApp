#!/usr/bin/env node

/**
 * Automated Spacing Migration Script
 * 
 * This script finds and replaces hardcoded spacing values (padding, margin, width, height)
 * with design system spacing tokens throughout the codebase.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ===== CONFIGURATION =====

const CONFIG = {
  // File patterns to search
  filePatterns: ['.ts', '.tsx', '.js', '.jsx'],
  
  // Directories to search (relative to project root)
  searchDirs: ['app', 'components', 'src'],
  
  // Directories to exclude
  excludeDirs: ['node_modules', '.git', 'build', 'dist', '.expo', 'backend'],
  
  // Files to exclude
  excludeFiles: ['migration.ts', 'legacy-compat.ts', 'design-tokens.ts'],
  
  // Backup directory
  backupDir: 'migration-backups',
  
  // Spacing properties to migrate
  spacingProperties: [
    'padding', 'paddingHorizontal', 'paddingVertical', 
    'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
    'margin', 'marginHorizontal', 'marginVertical',
    'marginTop', 'marginBottom', 'marginLeft', 'marginRight',
    'gap', 'rowGap', 'columnGap',
    'borderRadius', 'borderWidth',
    // Width/height only for small values (likely spacing-related)
    'width', 'height'
  ],
  
  // Spacing mappings from hardcoded values to design tokens
  spacingMappings: {
    0: {
      token: 'spacing[0]',
      value: 0,
      description: 'No spacing'
    },
    4: {
      token: 'spacing[1]',
      value: 4,
      description: 'Tight spacing (4px)'
    },
    8: {
      token: 'spacing[2]',
      value: 8,
      description: 'Snug spacing (8px)'
    },
    12: {
      token: 'spacing[3]',
      value: 12,
      description: 'Small spacing (12px)'
    },
    16: {
      token: 'spacing[4]',
      value: 16,
      description: 'Medium spacing (16px)'
    },
    20: {
      token: 'spacing[5]',
      value: 20,
      description: 'Medium-large spacing (20px)'
    },
    24: {
      token: 'spacing[6]',
      value: 24,
      description: 'Large spacing (24px)'
    },
    32: {
      token: 'spacing[8]',
      value: 32,
      description: 'Extra large spacing (32px)'
    },
    40: {
      token: 'spacing[10]',
      value: 40,
      description: 'XXL spacing (40px)'
    },
    48: {
      token: 'spacing[12]',
      value: 48,
      description: 'Section spacing (48px)'
    },
    64: {
      token: 'spacing[16]',
      value: 64,
      description: 'Large section spacing (64px)'
    },
    80: {
      token: 'spacing[20]',
      value: 80,
      description: 'Huge spacing (80px)'
    },
    96: {
      token: 'spacing[24]',
      value: 96,
      description: 'Maximum spacing (96px)'
    },
    
    // Common non-standard values mapped to nearest standard
    6: {
      token: 'spacing[2]',
      value: 8,
      description: '6px → 8px (standardized)',
      warning: 'Value standardized from 6px to 8px'
    },
    10: {
      token: 'spacing[3]',
      value: 12,
      description: '10px → 12px (standardized)',
      warning: 'Value standardized from 10px to 12px'
    },
    14: {
      token: 'spacing[4]',
      value: 16,
      description: '14px → 16px (standardized)',
      warning: 'Value standardized from 14px to 16px'
    },
    18: {
      token: 'spacing[5]',
      value: 20,
      description: '18px → 20px (standardized)',
      warning: 'Value standardized from 18px to 20px'
    },
    22: {
      token: 'spacing[6]',
      value: 24,
      description: '22px → 24px (standardized)',
      warning: 'Value standardized from 22px to 24px'
    },
    28: {
      token: 'spacing[8]',
      value: 32,
      description: '28px → 32px (standardized)',
      warning: 'Value standardized from 28px to 32px'
    },
    30: {
      token: 'spacing[8]',
      value: 32,
      description: '30px → 32px (standardized)',
      warning: 'Value standardized from 30px to 32px'
    },
    36: {
      token: 'spacing[10]',
      value: 40,
      description: '36px → 40px (standardized)',
      warning: 'Value standardized from 36px to 40px'
    }
  },
  
  // Special handling for width/height values
  dimensionLimits: {
    maxWidth: 100,  // Only migrate width/height values <= 100px (likely spacing-related)
    maxHeight: 100
  }
};

// ===== UTILITY FUNCTIONS =====

/**
 * Get all files matching patterns in directories
 */
function getAllFiles(dir, allFiles = []) {
  try {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        if (CONFIG.excludeDirs.includes(file)) {
          continue;
        }
        getAllFiles(filePath, allFiles);
      } else {
        const ext = path.extname(file);
        const filename = path.basename(file);
        
        if (CONFIG.filePatterns.includes(ext) && 
            !CONFIG.excludeFiles.some(excludeFile => filename.includes(excludeFile))) {
          allFiles.push(filePath);
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
  
  return allFiles;
}

/**
 * Create backup of original file
 */
function createBackup(filePath) {
  try {
    const backupPath = path.join(CONFIG.backupDir, filePath + '.spacing.backup');
    const backupDir = path.dirname(backupPath);
    
    fs.mkdirSync(backupDir, { recursive: true });
    fs.copyFileSync(filePath, backupPath);
    return backupPath;
  } catch (error) {
    console.error(`Failed to create backup for ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Check if a property should be migrated based on special rules
 */
function shouldMigrateProperty(property, value) {
  // Special handling for width/height - only migrate smaller values
  if (property === 'width' || property === 'height') {
    const limit = property === 'width' ? CONFIG.dimensionLimits.maxWidth : CONFIG.dimensionLimits.maxHeight;
    return value <= limit;
  }
  
  // All other spacing properties can be migrated
  return true;
}

/**
 * Analyze file for spacing patterns
 */
function analyzeFileSpacing(filePath, content) {
  const findings = [];
  const lines = content.split('\n');
  
  CONFIG.spacingProperties.forEach(property => {
    Object.entries(CONFIG.spacingMappings).forEach(([spacing, mapping]) => {
      const spacingValue = parseInt(spacing);
      
      // Skip if this property shouldn't be migrated for this value
      if (!shouldMigrateProperty(property, spacingValue)) {
        return;
      }
      
      const patterns = [
        // property: 24 or property: 24,
        new RegExp(`${property}\\s*:\\s*${spacingValue}(?=\\s*[,}])`, 'g'),
        
        // property={24} in JSX
        new RegExp(`${property}\\s*=\\s*{\\s*${spacingValue}\\s*}`, 'g'),
        
        // In template strings: property: ${24}
        new RegExp(`${property}\\s*:\\s*\\$\\{\\s*${spacingValue}\\s*\\}`, 'g'),
      ];
      
      patterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          const lineNumber = content.substring(0, match.index).split('\n').length;
          const lineContent = lines[lineNumber - 1]?.trim() || '';
          
          // Skip if this looks like it's already using design tokens
          if (lineContent.includes('spacing[') || lineContent.includes('spacing.')) {
            continue;
          }
          
          findings.push({
            type: 'spacing',
            filePath,
            lineNumber,
            lineContent,
            property,
            originalValue: spacingValue,
            tokenPath: mapping.token,
            newValue: mapping.value,
            description: mapping.description,
            warning: mapping.warning,
            matchText: match[0],
            startIndex: match.index,
            endIndex: match.index + match[0].length
          });
        }
      });
    });
  });
  
  return findings;
}

/**
 * Apply spacing migrations to file content
 */
function migrateFileSpacing(content, findings) {
  let migratedContent = content;
  let hasSpacingChanges = false;
  
  // Sort findings by position (reverse order to maintain indices)
  const sortedFindings = findings.sort((a, b) => b.startIndex - a.startIndex);
  
  for (const finding of sortedFindings) {
    // Replace the spacing value with design token
    const replacement = finding.matchText.replace(
      new RegExp(`${finding.property}\\s*:\\s*\\d+`),
      `${finding.property}: ${finding.tokenPath}`
    ).replace(
      new RegExp(`${finding.property}\\s*=\\s*{\\s*\\d+\\s*}`),
      `${finding.property}={${finding.tokenPath}}`
    );
    
    migratedContent = 
      migratedContent.substring(0, finding.startIndex) +
      replacement +
      migratedContent.substring(finding.endIndex);
      
    hasSpacingChanges = true;
  }
  
  // Add spacing import if we made changes
  if (hasSpacingChanges) {
    migratedContent = addSpacingImport(migratedContent);
  }
  
  return migratedContent;
}

/**
 * Add spacing import if not present
 */
function addSpacingImport(content) {
  // Check if spacing import already exists
  if (content.includes('spacing') && 
      (content.includes('design-tokens') || content.includes('../../constants/design-tokens'))) {
    return content;
  }
  
  // Find existing imports
  const importRegex = /^import\s+.*?from\s+['"][^'"]+['"];?\s*$/gm;
  const imports = [];
  let match;
  
  while ((match = importRegex.exec(content)) !== null) {
    imports.push({
      text: match[0],
      index: match.index,
      endIndex: match.index + match[0].length
    });
  }
  
  const importPath = '../../constants/design-tokens';
  
  // Check if we need to add spacing to existing design-tokens import
  const existingDesignTokenImport = imports.find(imp => imp.text.includes('design-tokens'));
  
  if (existingDesignTokenImport) {
    // Add spacing to existing import
    let updatedImport = existingDesignTokenImport.text;
    
    if (!updatedImport.includes('spacing')) {
      // Find the closing brace and add spacing before it
      if (updatedImport.includes('{') && updatedImport.includes('}')) {
        updatedImport = updatedImport.replace(/}\s*from/, ', spacing } from');
      } else {
        // If import doesn't use destructuring, add it
        updatedImport = updatedImport.replace(
          /import\s+[^{]*from/,
          'import { spacing } from'
        );
      }
    }
    
    return content.replace(existingDesignTokenImport.text, updatedImport);
  } else {
    // Add new import
    const newImport = `import { spacing } from '${importPath}';`;
    
    if (imports.length > 0) {
      const lastImport = imports[imports.length - 1];
      return content.substring(0, lastImport.endIndex) + 
             '\n' + newImport + 
             content.substring(lastImport.endIndex);
    } else {
      return newImport + '\n\n' + content;
    }
  }
}

/**
 * Format findings report
 */
function formatReport(allFindings, stats) {
  let report = '\n';
  report += '============================================\n';
  report += '        SPACING MIGRATION REPORT           \n';
  report += '============================================\n\n';
  
  report += `📊 SUMMARY:\n`;
  report += `  • Files analyzed: ${stats.filesAnalyzed}\n`;
  report += `  • Files with spacing: ${stats.filesWithSpacing}\n`;
  report += `  • Total spacing instances: ${stats.totalFindings}\n`;
  report += `  • Properties affected: ${stats.affectedProperties}\n`;
  report += `  • Standardizations: ${stats.standardizations}\n\n`;
  
  if (allFindings.length === 0) {
    report += '✅ No hardcoded spacing found that needs migration!\n\n';
    return report;
  }
  
  // Group findings by file
  const fileGroups = {};
  allFindings.forEach(finding => {
    if (!fileGroups[finding.filePath]) {
      fileGroups[finding.filePath] = [];
    }
    fileGroups[finding.filePath].push(finding);
  });
  
  report += `🔍 DETAILED FINDINGS:\n\n`;
  
  Object.entries(fileGroups).forEach(([filePath, findings]) => {
    report += `📁 ${filePath}\n`;
    report += `   ${findings.length} spacing change(s):\n`;
    
    findings.forEach(finding => {
      report += `   Line ${finding.lineNumber}: ${finding.property} ${finding.originalValue} → ${finding.tokenPath}`;
      if (finding.warning) {
        report += ` ⚠️`;
      }
      report += `\n`;
      report += `   Code: ${finding.lineContent}\n`;
      if (finding.warning) {
        report += `   Warning: ${finding.warning}\n`;
      }
      report += `\n`;
    });
  });
  
  // Property frequency
  const propertyCounts = {};
  const spacingCounts = {};
  
  allFindings.forEach(finding => {
    propertyCounts[finding.property] = (propertyCounts[finding.property] || 0) + 1;
    spacingCounts[finding.originalValue] = (spacingCounts[finding.originalValue] || 0) + 1;
  });
  
  if (Object.keys(propertyCounts).length > 0) {
    report += `📏 PROPERTY FREQUENCY:\n`;
    Object.entries(propertyCounts)
      .sort(([,a], [,b]) => b - a)
      .forEach(([property, count]) => {
        report += `   ${property}: ${count} occurrence(s)\n`;
      });
    report += `\n`;
  }
  
  if (Object.keys(spacingCounts).length > 0) {
    report += `📐 SPACING VALUE FREQUENCY:\n`;
    Object.entries(spacingCounts)
      .sort(([a], [b]) => Number(a) - Number(b))
      .forEach(([spacing, count]) => {
        const mapping = CONFIG.spacingMappings[spacing];
        const warning = mapping?.warning ? ' ⚠️' : '';
        report += `   ${spacing}px: ${count} occurrence(s) → ${mapping?.token || 'unknown'}${warning}\n`;
      });
  }
  
  return report;
}

/**
 * Ask user for confirmation
 */
async function askConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise(resolve => {
    rl.question(question + ' (y/n): ', answer => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

// ===== MAIN MIGRATION LOGIC =====

async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run') || args.includes('-d');
  const isInteractive = !args.includes('--no-confirm');
  const showHelp = args.includes('--help') || args.includes('-h');
  
  if (showHelp) {
    console.log(`
📐 Spacing Migration Script

USAGE:
  node scripts/migrate-spacing.js [options]

OPTIONS:
  --dry-run, -d     Preview changes without applying them
  --no-confirm      Apply changes without confirmation (dangerous!)
  --help, -h        Show this help message

EXAMPLES:
  node scripts/migrate-spacing.js --dry-run    # Preview changes
  node scripts/migrate-spacing.js             # Interactive migration
  node scripts/migrate-spacing.js --no-confirm # Auto migration

This script migrates:
  • padding, margin values to spacing design tokens
  • width, height values (≤100px) to spacing tokens
  • borderRadius, gap values to spacing tokens
  • Standardizes non-standard values to design system scale
  • Adds appropriate imports for spacing tokens
`);
    return;
  }
  
  console.log('📐 Starting Spacing Migration Analysis...\n');
  
  // Get all files to process
  const allFiles = [];
  CONFIG.searchDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      getAllFiles(dir, allFiles);
    }
  });
  
  console.log(`📁 Found ${allFiles.length} files to analyze\n`);
  
  // Analyze all files
  const allFindings = [];
  let filesAnalyzed = 0;
  let filesWithSpacing = 0;
  
  for (const filePath of allFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const findings = analyzeFileSpacing(filePath, content);
      
      filesAnalyzed++;
      
      if (findings.length > 0) {
        filesWithSpacing++;
        allFindings.push(...findings);
      }
      
      // Progress indicator
      if (filesAnalyzed % 10 === 0) {
        process.stdout.write(`Analyzed ${filesAnalyzed}/${allFiles.length} files...\r`);
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  }
  
  console.log(''); // New line after progress
  
  // Generate report
  const affectedProperties = new Set(allFindings.map(f => f.property));
  const standardizations = allFindings.filter(f => f.warning).length;
  
  const stats = {
    filesAnalyzed,
    filesWithSpacing,
    totalFindings: allFindings.length,
    affectedProperties: affectedProperties.size,
    standardizations
  };
  
  const report = formatReport(allFindings, stats);
  console.log(report);
  
  // Save report to file
  const reportPath = path.join(CONFIG.backupDir, 'spacing-migration-report.txt');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, report);
  console.log(`📄 Report saved to: ${reportPath}\n`);
  
  if (allFindings.length === 0) {
    console.log('🎉 No migration needed!');
    return;
  }
  
  if (isDryRun) {
    console.log('🔍 Dry run complete. Use without --dry-run to apply changes.');
    return;
  }
  
  // Ask for confirmation
  if (isInteractive) {
    const confirmed = await askConfirmation(
      `\n⚠️  About to modify ${filesWithSpacing} files with ${allFindings.length} spacing changes. Continue?`
    );
    
    if (!confirmed) {
      console.log('❌ Migration cancelled by user.');
      return;
    }
  }
  
  // Apply migrations
  console.log('\n🚀 Applying spacing migrations...\n');
  
  const fileGroups = {};
  allFindings.forEach(finding => {
    if (!fileGroups[finding.filePath]) {
      fileGroups[finding.filePath] = [];
    }
    fileGroups[finding.filePath].push(finding);
  });
  
  let migratedFiles = 0;
  let failedFiles = 0;
  
  for (const [filePath, findings] of Object.entries(fileGroups)) {
    try {
      // Create backup
      const backupPath = createBackup(filePath);
      if (!backupPath) {
        console.error(`❌ Failed to backup ${filePath}, skipping migration`);
        failedFiles++;
        continue;
      }
      
      // Read original content
      const originalContent = fs.readFileSync(filePath, 'utf8');
      
      // Apply migrations
      const migratedContent = migrateFileSpacing(originalContent, findings);
      
      // Write migrated content
      fs.writeFileSync(filePath, migratedContent, 'utf8');
      
      console.log(`✅ Migrated ${filePath} (${findings.length} changes)`);
      migratedFiles++;
      
    } catch (error) {
      console.error(`❌ Failed to migrate ${filePath}:`, error.message);
      failedFiles++;
    }
  }
  
  console.log('\n============================================');
  console.log('          MIGRATION COMPLETE!              ');
  console.log('============================================');
  console.log(`✅ Successfully migrated: ${migratedFiles} files`);
  console.log(`❌ Failed migrations: ${failedFiles} files`);
  console.log(`📁 Backups stored in: ${CONFIG.backupDir}/`);
  console.log(`📄 Full report: ${reportPath}`);
  
  if (migratedFiles > 0) {
    console.log('\n💡 Next steps:');
    console.log('   1. Review the changes in your files');
    console.log('   2. Test your application thoroughly');
    console.log('   3. Run TypeScript compilation to check for errors');
    console.log('   4. Consider running validation scripts to ensure everything works');
  }
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  });
}

module.exports = {
  CONFIG,
  getAllFiles,
  analyzeFileSpacing,
  migrateFileSpacing,
  main
};