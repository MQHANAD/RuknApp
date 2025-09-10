#!/usr/bin/env node

/**
 * Automated Typography Migration Script
 * 
 * This script finds and replaces hardcoded typography values (fontSize, fontWeight, lineHeight)
 * with design system typography tokens throughout the codebase.
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
  
  // Typography mappings from hardcoded values to design tokens
  typographyMappings: {
    // Font sizes to typography tokens
    32: {
      token: 'typography.display.large',
      properties: { fontSize: 32, lineHeight: 40, fontWeight: '700' },
      description: 'Large display text'
    },
    28: {
      token: 'typography.display.medium',
      properties: { fontSize: 28, lineHeight: 36, fontWeight: '700' },
      description: 'Medium display text'
    },
    24: {
      token: 'typography.display.small',
      properties: { fontSize: 24, lineHeight: 32, fontWeight: '600' },
      description: 'Small display text (page titles)'
    },
    22: {
      token: 'typography.heading.h1',
      properties: { fontSize: 22, lineHeight: 28, fontWeight: '600' },
      description: 'Main heading (h1)'
    },
    20: {
      token: 'typography.heading.h2',
      properties: { fontSize: 20, lineHeight: 26, fontWeight: '600' },
      description: 'Secondary heading (h2)'
    },
    18: {
      token: 'typography.heading.h3',
      properties: { fontSize: 18, lineHeight: 24, fontWeight: '600' },
      description: 'Tertiary heading (h3)'
    },
    16: {
      token: 'typography.body.large',
      properties: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
      description: 'Large body text, buttons'
    },
    15: {
      token: 'typography.body.large',
      properties: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
      description: 'Large body text (15px → 16px standardized)'
    },
    14: {
      token: 'typography.body.medium',
      properties: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
      description: 'Medium body text'
    },
    13: {
      token: 'typography.body.medium',
      properties: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
      description: 'Medium body text (13px → 14px standardized)'
    },
    12: {
      token: 'typography.body.small',
      properties: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
      description: 'Small body text, captions'
    },
    10: {
      token: 'typography.caption.small',
      properties: { fontSize: 10, lineHeight: 14, fontWeight: '500' },
      description: 'Small caption text'
    },
    9: {
      token: 'typography.caption.small',
      properties: { fontSize: 10, lineHeight: 14, fontWeight: '500' },
      description: 'Very small text (9px → 10px minimum)'
    }
  },

  // Font weight mappings
  fontWeightMappings: {
    'normal': '400',
    'bold': '600',
    '300': '400',  // Light → Normal for consistency
    '400': '400',  // Normal
    '500': '500',  // Medium
    '600': '600',  // Semi-bold
    '700': '600',  // Bold → Semi-bold for mobile consistency
    '800': '600',  // Extra-bold → Semi-bold
    '900': '700',  // Black → Bold
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
    const backupPath = path.join(CONFIG.backupDir, filePath + '.typography.backup');
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
 * Analyze file for typography patterns
 */
function analyzeFileTypography(filePath, content) {
  const findings = [];
  const lines = content.split('\n');
  
  // Find fontSize patterns
  Object.entries(CONFIG.typographyMappings).forEach(([fontSize, mapping]) => {
    const patterns = [
      // fontSize: 24 or fontSize: 24,
      new RegExp(`fontSize\\s*:\\s*${fontSize}(?=\\s*[,}])`, 'g'),
      
      // fontSize={24} in JSX
      new RegExp(`fontSize\\s*=\\s*{\\s*${fontSize}\\s*}`, 'g'),
      
      // In template strings: fontSize: ${24}
      new RegExp(`fontSize\\s*:\\s*\\$\\{\\s*${fontSize}\\s*\\}`, 'g'),
    ];
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const lineNumber = content.substring(0, match.index).split('\n').length;
        const lineContent = lines[lineNumber - 1]?.trim() || '';
        
        findings.push({
          type: 'fontSize',
          filePath,
          lineNumber,
          lineContent,
          originalValue: fontSize,
          tokenPath: mapping.token,
          properties: mapping.properties,
          description: mapping.description,
          matchText: match[0],
          startIndex: match.index,
          endIndex: match.index + match[0].length
        });
      }
    });
  });
  
  // Find fontWeight patterns
  Object.entries(CONFIG.fontWeightMappings).forEach(([fontWeight, standardWeight]) => {
    const patterns = [
      // fontWeight: 'bold' or fontWeight: '600'
      new RegExp(`fontWeight\\s*:\\s*['"]${fontWeight}['"]`, 'g'),
      
      // fontWeight: bold (without quotes for keywords)
      fontWeight === 'normal' || fontWeight === 'bold' 
        ? new RegExp(`fontWeight\\s*:\\s*${fontWeight}(?=\\s*[,}])`, 'g')
        : null,
      
      // fontWeight={600} in JSX
      new RegExp(`fontWeight\\s*=\\s*{\\s*['"]?${fontWeight}['"]?\\s*}`, 'g'),
    ].filter(Boolean);
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const lineNumber = content.substring(0, match.index).split('\n').length;
        const lineContent = lines[lineNumber - 1]?.trim() || '';
        
        findings.push({
          type: 'fontWeight',
          filePath,
          lineNumber,
          lineContent,
          originalValue: fontWeight,
          newValue: standardWeight,
          matchText: match[0],
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          description: `Standardize fontWeight ${fontWeight} → ${standardWeight}`
        });
      }
    });
  });
  
  return findings;
}

/**
 * Apply typography migrations to file content
 */
function migrateFileTypography(content, findings) {
  let migratedContent = content;
  let hasTypographyChanges = false;
  
  // Sort findings by position (reverse order to maintain indices)
  const sortedFindings = findings.sort((a, b) => b.startIndex - a.startIndex);
  
  for (const finding of sortedFindings) {
    if (finding.type === 'fontSize') {
      // Replace fontSize with typography token
      const replacement = finding.matchText.replace(
        /fontSize\s*:\s*\d+/,
        `...${finding.tokenPath}`
      );
      
      migratedContent = 
        migratedContent.substring(0, finding.startIndex) +
        replacement +
        migratedContent.substring(finding.endIndex);
        
      hasTypographyChanges = true;
      
    } else if (finding.type === 'fontWeight') {
      // Replace fontWeight value
      const replacement = finding.matchText.replace(
        /['"]?[^'"]*['"]?(?=\s*[,}]|\s*})/,
        `'${finding.newValue}'`
      );
      
      migratedContent = 
        migratedContent.substring(0, finding.startIndex) +
        replacement +
        migratedContent.substring(finding.endIndex);
    }
  }
  
  // Add typography import if we made fontSize changes
  if (hasTypographyChanges) {
    migratedContent = addTypographyImport(migratedContent);
  }
  
  return migratedContent;
}

/**
 * Add typography import if not present
 */
function addTypographyImport(content) {
  // Check if typography import already exists
  if (content.includes('typography') && 
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
  
  // Check if we need to add typography to existing design-tokens import
  const existingDesignTokenImport = imports.find(imp => imp.text.includes('design-tokens'));
  
  if (existingDesignTokenImport) {
    // Add typography to existing import
    let updatedImport = existingDesignTokenImport.text;
    
    if (updatedImport.includes('colors') && !updatedImport.includes('typography')) {
      updatedImport = updatedImport.replace('colors', 'colors, typography');
    } else if (!updatedImport.includes('typography')) {
      updatedImport = updatedImport.replace(
        /import\s*{\s*/,
        'import { typography, '
      );
    }
    
    return content.replace(existingDesignTokenImport.text, updatedImport);
  } else {
    // Add new import
    const newImport = `import { typography } from '${importPath}';`;
    
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
  report += '       TYPOGRAPHY MIGRATION REPORT         \n';
  report += '============================================\n\n';
  
  report += `📊 SUMMARY:\n`;
  report += `  • Files analyzed: ${stats.filesAnalyzed}\n`;
  report += `  • Files with typography: ${stats.filesWithTypography}\n`;
  report += `  • Total typography instances: ${stats.totalFindings}\n`;
  report += `  • FontSize changes: ${stats.fontSizeChanges}\n`;
  report += `  • FontWeight changes: ${stats.fontWeightChanges}\n\n`;
  
  if (allFindings.length === 0) {
    report += '✅ No hardcoded typography found that needs migration!\n\n';
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
    report += `   ${findings.length} typography change(s):\n`;
    
    findings.forEach(finding => {
      if (finding.type === 'fontSize') {
        report += `   Line ${finding.lineNumber}: fontSize ${finding.originalValue} → ${finding.tokenPath}\n`;
      } else {
        report += `   Line ${finding.lineNumber}: fontWeight ${finding.originalValue} → ${finding.newValue}\n`;
      }
      report += `   Code: ${finding.lineContent}\n`;
      if (finding.description) {
        report += `   Note: ${finding.description}\n`;
      }
      report += `\n`;
    });
  });
  
  // Typography frequency
  const fontSizeCounts = {};
  const fontWeightCounts = {};
  
  allFindings.forEach(finding => {
    if (finding.type === 'fontSize') {
      fontSizeCounts[finding.originalValue] = (fontSizeCounts[finding.originalValue] || 0) + 1;
    } else {
      fontWeightCounts[finding.originalValue] = (fontWeightCounts[finding.originalValue] || 0) + 1;
    }
  });
  
  if (Object.keys(fontSizeCounts).length > 0) {
    report += `📏 FONT SIZE FREQUENCY:\n`;
    Object.entries(fontSizeCounts)
      .sort(([a], [b]) => Number(b) - Number(a))
      .forEach(([size, count]) => {
        report += `   ${size}px: ${count} occurrence(s)\n`;
      });
    report += `\n`;
  }
  
  if (Object.keys(fontWeightCounts).length > 0) {
    report += `⚖️  FONT WEIGHT FREQUENCY:\n`;
    Object.entries(fontWeightCounts)
      .sort(([,a], [,b]) => b - a)
      .forEach(([weight, count]) => {
        report += `   ${weight}: ${count} occurrence(s)\n`;
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
📝 Typography Migration Script

USAGE:
  node scripts/migrate-typography.js [options]

OPTIONS:
  --dry-run, -d     Preview changes without applying them
  --no-confirm      Apply changes without confirmation (dangerous!)
  --help, -h        Show this help message

EXAMPLES:
  node scripts/migrate-typography.js --dry-run    # Preview changes
  node scripts/migrate-typography.js             # Interactive migration
  node scripts/migrate-typography.js --no-confirm # Auto migration

This script migrates:
  • fontSize values to typography design tokens
  • fontWeight values to standardized weights
  • Adds appropriate imports for typography tokens
`);
    return;
  }
  
  console.log('📝 Starting Typography Migration Analysis...\n');
  
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
  let filesWithTypography = 0;
  
  for (const filePath of allFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const findings = analyzeFileTypography(filePath, content);
      
      filesAnalyzed++;
      
      if (findings.length > 0) {
        filesWithTypography++;
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
  const stats = {
    filesAnalyzed,
    filesWithTypography,
    totalFindings: allFindings.length,
    fontSizeChanges: allFindings.filter(f => f.type === 'fontSize').length,
    fontWeightChanges: allFindings.filter(f => f.type === 'fontWeight').length
  };
  
  const report = formatReport(allFindings, stats);
  console.log(report);
  
  // Save report to file
  const reportPath = path.join(CONFIG.backupDir, 'typography-migration-report.txt');
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
      `\n⚠️  About to modify ${filesWithTypography} files with ${allFindings.length} typography changes. Continue?`
    );
    
    if (!confirmed) {
      console.log('❌ Migration cancelled by user.');
      return;
    }
  }
  
  // Apply migrations
  console.log('\n🚀 Applying typography migrations...\n');
  
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
      const migratedContent = migrateFileTypography(originalContent, findings);
      
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
    console.log('   4. Consider running the spacing migration next');
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
  analyzeFileTypography,
  migrateFileTypography,
  main
};