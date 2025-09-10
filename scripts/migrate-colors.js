#!/usr/bin/env node

/**
 * Automated Color Migration Script
 * 
 * This script finds and replaces hardcoded color values with design tokens
 * throughout the codebase. Supports dry-run mode and creates backups.
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
  
  // Color mappings from hardcoded to design tokens
  colorMappings: {
    // Primary brand colors
    '#F5A623': "colors.primary[500]",
    '#fbb507': "colors.primary[600]",
    '#db941d': "colors.primary[700]",
    
    // Secondary colors
    '#1E2A38': "colors.secondary[800]",
    '#1E293B': "colors.secondary[800]",
    
    // Neutral colors
    '#FFFFFF': "colors.neutral[0]",
    '#ffffff': "colors.neutral[0]",
    '#000000': "colors.neutral[1000]",
    '#000': "colors.neutral[1000]",
    'white': "colors.neutral[0]",
    'black': "colors.neutral[1000]",
    
    // Gray variations
    '#afafac': "colors.neutral[400]",
    '#999': "colors.neutral[500]",
    '#666': "colors.neutral[600]",
    '#333': "colors.neutral[700]",
    '#ccc': "colors.neutral[300]",
    
    // Common variations (case insensitive handled separately)
    '#2f95dc': "colors.info[500]",
    '#FF3B30': "colors.error[500]",
    '#4CAF50': "colors.success[500]",
    '#10B981': "colors.success[500]",
    '#1C64F2': "colors.info[600]",
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
        // Skip excluded directories
        if (CONFIG.excludeDirs.includes(file)) {
          continue;
        }
        getAllFiles(filePath, allFiles);
      } else {
        // Check if file matches our patterns
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
    const backupPath = path.join(CONFIG.backupDir, filePath + '.backup');
    const backupDir = path.dirname(backupPath);
    
    // Create backup directory if it doesn't exist
    fs.mkdirSync(backupDir, { recursive: true });
    
    // Copy original file to backup
    fs.copyFileSync(filePath, backupPath);
    return backupPath;
  } catch (error) {
    console.error(`Failed to create backup for ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Analyze file for color patterns
 */
function analyzeFileColors(filePath, content) {
  const findings = [];
  const lines = content.split('\n');
  
  Object.entries(CONFIG.colorMappings).forEach(([originalColor, tokenPath]) => {
    // Create regex patterns for different contexts
    const patterns = [
      // Direct color assignments: backgroundColor: '#F5A623'
      new RegExp(`(\\w+)\\s*:\\s*['"]${escapeRegex(originalColor)}['"]`, 'gi'),
      
      // React Native style objects: { color: '#F5A623' }
      new RegExp(`color\\s*:\\s*['"]${escapeRegex(originalColor)}['"]`, 'gi'),
      
      // Template literals and other contexts
      new RegExp(`['"]${escapeRegex(originalColor)}['"]`, 'gi'),
    ];
    
    patterns.forEach(pattern => {
      let match;
      const regex = new RegExp(pattern.source, pattern.flags);
      
      while ((match = regex.exec(content)) !== null) {
        const lineNumber = content.substring(0, match.index).split('\n').length;
        const lineContent = lines[lineNumber - 1]?.trim() || '';
        
        findings.push({
          filePath,
          lineNumber,
          lineContent,
          originalColor,
          tokenPath,
          matchText: match[0],
          startIndex: match.index,
          endIndex: match.index + match[0].length
        });
      }
    });
  });
  
  return findings;
}

/**
 * Apply color migrations to file content
 */
function migrateFileColors(content, findings) {
  let migratedContent = content;
  let offset = 0;
  
  // Sort findings by position (reverse order to maintain indices)
  const sortedFindings = findings.sort((a, b) => b.startIndex - a.startIndex);
  
  for (const finding of sortedFindings) {
    const beforeText = finding.matchText;
    
    // Replace with design token import
    let afterText = beforeText.replace(
      new RegExp(escapeRegex(finding.originalColor), 'gi'),
      finding.tokenPath
    );
    
    migratedContent = 
      migratedContent.substring(0, finding.startIndex) +
      afterText +
      migratedContent.substring(finding.endIndex);
  }
  
  // Add import statement for design tokens if we made changes
  if (findings.length > 0) {
    migratedContent = addDesignTokenImport(migratedContent);
  }
  
  return migratedContent;
}

/**
 * Add design token import if not present
 */
function addDesignTokenImport(content) {
  // Check if colors import already exists
  if (content.includes('colors') && 
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
  
  // Determine the correct import path based on file location
  const importPath = '../../constants/design-tokens';
  const newImport = `import { colors } from '${importPath}';`;
  
  if (imports.length > 0) {
    // Add after last import
    const lastImport = imports[imports.length - 1];
    const insertIndex = lastImport.endIndex;
    
    return content.substring(0, insertIndex) + 
           '\n' + newImport + 
           content.substring(insertIndex);
  } else {
    // Add at the beginning
    return newImport + '\n\n' + content;
  }
}

/**
 * Escape special regex characters
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Format findings report
 */
function formatReport(allFindings, stats) {
  let report = '\n';
  report += '============================================\n';
  report += '          COLOR MIGRATION REPORT           \n';
  report += '============================================\n\n';
  
  report += `📊 SUMMARY:\n`;
  report += `  • Files analyzed: ${stats.filesAnalyzed}\n`;
  report += `  • Files with colors: ${stats.filesWithColors}\n`;
  report += `  • Total color instances: ${stats.totalFindings}\n`;
  report += `  • Unique colors found: ${stats.uniqueColors}\n\n`;
  
  if (allFindings.length === 0) {
    report += '✅ No hardcoded colors found that need migration!\n\n';
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
    report += `   ${findings.length} color(s) found:\n`;
    
    findings.forEach(finding => {
      report += `   Line ${finding.lineNumber}: ${finding.originalColor} → ${finding.tokenPath}\n`;
      report += `   Code: ${finding.lineContent}\n\n`;
    });
  });
  
  // Color frequency
  const colorCounts = {};
  allFindings.forEach(finding => {
    colorCounts[finding.originalColor] = (colorCounts[finding.originalColor] || 0) + 1;
  });
  
  report += `📈 COLOR FREQUENCY:\n`;
  Object.entries(colorCounts)
    .sort(([,a], [,b]) => b - a)
    .forEach(([color, count]) => {
      report += `   ${color}: ${count} occurrence(s)\n`;
    });
  
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
🎨 Color Migration Script

USAGE:
  node scripts/migrate-colors.js [options]

OPTIONS:
  --dry-run, -d     Preview changes without applying them
  --no-confirm      Apply changes without confirmation (dangerous!)
  --help, -h        Show this help message

EXAMPLES:
  node scripts/migrate-colors.js --dry-run    # Preview changes
  node scripts/migrate-colors.js             # Interactive migration
  node scripts/migrate-colors.js --no-confirm # Auto migration (use with caution)
`);
    return;
  }
  
  console.log('🎨 Starting Color Migration Analysis...\n');
  
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
  let filesWithColors = 0;
  
  for (const filePath of allFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const findings = analyzeFileColors(filePath, content);
      
      filesAnalyzed++;
      
      if (findings.length > 0) {
        filesWithColors++;
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
    filesWithColors,
    totalFindings: allFindings.length,
    uniqueColors: new Set(allFindings.map(f => f.originalColor)).size
  };
  
  const report = formatReport(allFindings, stats);
  console.log(report);
  
  // Save report to file
  const reportPath = path.join(CONFIG.backupDir, 'color-migration-report.txt');
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
      `\n⚠️  About to modify ${filesWithColors} files with ${allFindings.length} color changes. Continue?`
    );
    
    if (!confirmed) {
      console.log('❌ Migration cancelled by user.');
      return;
    }
  }
  
  // Apply migrations
  console.log('\n🚀 Applying color migrations...\n');
  
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
      const migratedContent = migrateFileColors(originalContent, findings);
      
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
    console.log('   4. Consider running the typography and spacing migrations next');
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
  analyzeFileColors,
  migrateFileColors,
  main
};