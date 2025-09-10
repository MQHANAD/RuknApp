#!/usr/bin/env node

/**
 * Migration Validation Script
 * 
 * This script validates that migrated code still works correctly by:
 * - Checking TypeScript compilation
 * - Verifying design token imports
 * - Validating color/spacing/typography values
 * - Checking for common migration issues
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ===== VALIDATION CONFIGURATION =====

const VALIDATION_CONFIG = {
  // File patterns to validate
  filePatterns: ['.ts', '.tsx', '.js', '.jsx'],
  
  // Directories to validate (relative to project root)
  validateDirs: ['app', 'components', 'src'],
  
  // Directories to exclude
  excludeDirs: ['node_modules', '.git', 'build', 'dist', '.expo', 'backend', 'migration-backups', 'migration-tests'],
  
  // Expected design token imports
  expectedImports: [
    'colors',
    'typography', 
    'spacing'
  ],
  
  // Design token patterns to validate
  tokenPatterns: {
    colors: /colors\.[a-zA-Z]+\[\d+\]/g,
    typography: /typography\.[a-zA-Z]+\.[a-zA-Z0-9]+/g,
    spacing: /spacing\[\d+\]/g,
    layoutSpacing: /layoutSpacing\.[a-zA-Z]+/g,
    componentSpacing: /componentSpacing\.[a-zA-Z.]+/g
  },
  
  // Common issues to check for
  commonIssues: {
    // Hardcoded values that should be migrated
    hardcodedColors: [
      /#[0-9A-Fa-f]{6}/g,
      /#[0-9A-Fa-f]{3}/g,
      /:\s*['"]white['"]/g,
      /:\s*['"]black['"]/g
    ],
    
    // Hardcoded spacing (look for common values)
    hardcodedSpacing: [
      /:\s*[0-9]{1,2}(?=\s*[,}])/g  // Numbers that might be spacing
    ],
    
    // Hardcoded font sizes
    hardcodedFontSizes: [
      /fontSize\s*:\s*[0-9]{1,2}(?=\s*[,}])/g
    ]
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
        if (VALIDATION_CONFIG.excludeDirs.includes(file)) {
          continue;
        }
        getAllFiles(filePath, allFiles);
      } else {
        const ext = path.extname(file);
        
        if (VALIDATION_CONFIG.filePatterns.includes(ext)) {
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
 * Check TypeScript compilation
 */
function validateTypeScriptCompilation() {
  console.log('🔍 Validating TypeScript compilation...\n');
  
  try {
    // Check if TypeScript is available
    execSync('npx tsc --version', { stdio: 'ignore' });
    
    // Run TypeScript compilation check
    console.log('Running TypeScript compilation check...');
    const output = execSync('npx tsc --noEmit --skipLibCheck', { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    console.log('✅ TypeScript compilation successful');
    return { success: true, errors: [] };
    
  } catch (error) {
    console.log('❌ TypeScript compilation failed');
    
    const errors = error.stdout ? error.stdout.split('\n').filter(line => line.trim()) : [];
    
    // Filter for migration-related errors
    const migrationErrors = errors.filter(error => 
      error.includes('colors') || 
      error.includes('typography') || 
      error.includes('spacing') ||
      error.includes('design-tokens')
    );
    
    console.log(`Found ${errors.length} total errors, ${migrationErrors.length} migration-related`);
    
    if (migrationErrors.length > 0) {
      console.log('\nMigration-related errors:');
      migrationErrors.slice(0, 10).forEach(error => {
        console.log(`  ${error}`);
      });
      if (migrationErrors.length > 10) {
        console.log(`  ... and ${migrationErrors.length - 10} more`);
      }
    }
    
    return { success: false, errors: migrationErrors };
  }
}

/**
 * Validate design token usage in a file
 */
function validateFileTokens(filePath, content) {
  const issues = [];
  const tokenUsage = {
    colors: 0,
    typography: 0, 
    spacing: 0,
    layoutSpacing: 0,
    componentSpacing: 0
  };
  
  // Check for design token imports
  const hasDesignTokenImport = content.includes('design-tokens');
  const importedTokens = [];
  
  if (hasDesignTokenImport) {
    VALIDATION_CONFIG.expectedImports.forEach(token => {
      if (content.includes(`import.*{[^}]*${token}[^}]*}.*design-tokens`)) {
        importedTokens.push(token);
      }
    });
  }
  
  // Count token usage
  Object.entries(VALIDATION_CONFIG.tokenPatterns).forEach(([tokenType, pattern]) => {
    const matches = content.match(pattern) || [];
    tokenUsage[tokenType] = matches.length;
  });
  
  // Check for remaining hardcoded values
  const hardcodedIssues = [];
  
  // Check hardcoded colors
  VALIDATION_CONFIG.commonIssues.hardcodedColors.forEach(pattern => {
    const matches = content.match(pattern) || [];
    matches.forEach(match => {
      // Skip if this looks like it's in a comment or is a common exception
      if (!match.includes('//') && !match.includes('/*')) {
        hardcodedIssues.push({
          type: 'color',
          value: match,
          suggestion: 'Consider migrating to design token'
        });
      }
    });
  });
  
  // Check hardcoded spacing (but be selective - only flag obvious cases)
  const spacingMatches = content.match(/:\s*(4|8|12|16|20|24|32|48)(?=\s*[,}])/g) || [];
  spacingMatches.forEach(match => {
    if (content.includes('padding') || content.includes('margin') || content.includes('gap')) {
      hardcodedIssues.push({
        type: 'spacing',
        value: match,
        suggestion: 'Consider using spacing tokens'
      });
    }
  });
  
  // Check hardcoded font sizes
  const fontSizeMatches = content.match(VALIDATION_CONFIG.commonIssues.hardcodedFontSizes[0]) || [];
  fontSizeMatches.forEach(match => {
    hardcodedIssues.push({
      type: 'typography',
      value: match,
      suggestion: 'Consider using typography tokens'
    });
  });
  
  return {
    hasDesignTokenImport,
    importedTokens,
    tokenUsage,
    hardcodedIssues: hardcodedIssues.slice(0, 5), // Limit to avoid spam
    totalTokensUsed: Object.values(tokenUsage).reduce((sum, count) => sum + count, 0)
  };
}

/**
 * Validate all files in the project
 */
function validateAllFiles() {
  console.log('📄 Validating design token usage in files...\n');
  
  // Get all files to validate
  const allFiles = [];
  VALIDATION_CONFIG.validateDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      getAllFiles(dir, allFiles);
    }
  });
  
  console.log(`Found ${allFiles.length} files to validate\n`);
  
  let totalFiles = 0;
  let filesWithTokens = 0;
  let filesWithIssues = 0;
  const allIssues = [];
  const tokenStats = {
    colors: 0,
    typography: 0,
    spacing: 0,
    layoutSpacing: 0,
    componentSpacing: 0
  };
  
  for (const filePath of allFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const validation = validateFileTokens(filePath, content);
      
      totalFiles++;
      
      if (validation.totalTokensUsed > 0) {
        filesWithTokens++;
        
        // Add to token stats
        Object.entries(validation.tokenUsage).forEach(([tokenType, count]) => {
          tokenStats[tokenType] += count;
        });
      }
      
      if (validation.hardcodedIssues.length > 0) {
        filesWithIssues++;
        allIssues.push({
          filePath,
          issues: validation.hardcodedIssues,
          hasTokenImport: validation.hasDesignTokenImport,
          importedTokens: validation.importedTokens
        });
      }
      
      // Progress indicator
      if (totalFiles % 20 === 0) {
        process.stdout.write(`Validated ${totalFiles}/${allFiles.length} files...\r`);
      }
      
    } catch (error) {
      console.error(`❌ Error validating ${filePath}:`, error.message);
    }
  }
  
  console.log(''); // New line after progress
  
  return {
    totalFiles,
    filesWithTokens,
    filesWithIssues,
    allIssues,
    tokenStats
  };
}

/**
 * Check for common migration problems
 */
function checkMigrationProblems() {
  console.log('🔧 Checking for common migration problems...\n');
  
  const problems = [];
  
  // Check if design-tokens file exists
  if (!fs.existsSync('constants/design-tokens.ts')) {
    problems.push({
      type: 'missing-file',
      file: 'constants/design-tokens.ts',
      description: 'Design tokens file is missing'
    });
  }
  
  // Check if migration utilities exist
  if (!fs.existsSync('src/utils/migration.ts')) {
    problems.push({
      type: 'missing-file',
      file: 'src/utils/migration.ts',
      description: 'Migration utilities file is missing'
    });
  }
  
  // Check backup directory
  if (!fs.existsSync('migration-backups')) {
    problems.push({
      type: 'missing-backups',
      description: 'No migration backups found - this could indicate migrations were not run with backups'
    });
  }
  
  // Check for import conflicts
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Check for conflicting dependencies that might cause issues
    const potentialConflicts = ['styled-components', 'emotion'];
    potentialConflicts.forEach(dep => {
      if (packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]) {
        problems.push({
          type: 'potential-conflict',
          dependency: dep,
          description: `${dep} might conflict with design system - ensure proper integration`
        });
      }
    });
  } catch (error) {
    console.log('⚠️  Could not read package.json');
  }
  
  return problems;
}

/**
 * Generate validation report
 */
function generateValidationReport(compilationResult, fileValidation, problems) {
  console.log('\n📊 Generating validation report...\n');
  
  const reportPath = 'migration-validation-report.md';
  
  let report = `# Migration Validation Report\n\n`;
  report += `Generated: ${new Date().toISOString()}\n\n`;
  
  // Compilation results
  report += `## TypeScript Compilation\n`;
  if (compilationResult.success) {
    report += `✅ **PASSED** - No compilation errors\n\n`;
  } else {
    report += `❌ **FAILED** - ${compilationResult.errors.length} migration-related errors found\n\n`;
    if (compilationResult.errors.length > 0) {
      report += `### Migration-Related Errors:\n`;
      compilationResult.errors.slice(0, 10).forEach(error => {
        report += `- ${error}\n`;
      });
      if (compilationResult.errors.length > 10) {
        report += `- ... and ${compilationResult.errors.length - 10} more errors\n`;
      }
      report += `\n`;
    }
  }
  
  // File validation results
  report += `## File Validation Summary\n`;
  report += `- **Total files validated:** ${fileValidation.totalFiles}\n`;
  report += `- **Files using design tokens:** ${fileValidation.filesWithTokens}\n`;
  report += `- **Files with potential issues:** ${fileValidation.filesWithIssues}\n`;
  report += `- **Migration coverage:** ${((fileValidation.filesWithTokens / fileValidation.totalFiles) * 100).toFixed(1)}%\n\n`;
  
  // Token usage statistics
  report += `## Design Token Usage\n`;
  Object.entries(fileValidation.tokenStats).forEach(([tokenType, count]) => {
    if (count > 0) {
      report += `- **${tokenType}:** ${count} usages\n`;
    }
  });
  report += `\n`;
  
  // Issues found
  if (fileValidation.filesWithIssues > 0) {
    report += `## Files with Potential Issues\n\n`;
    
    fileValidation.allIssues.slice(0, 20).forEach(fileIssue => {
      report += `### ${fileIssue.filePath}\n`;
      report += `- Design token import: ${fileIssue.hasTokenImport ? '✅' : '❌'}\n`;
      if (fileIssue.importedTokens.length > 0) {
        report += `- Imported tokens: ${fileIssue.importedTokens.join(', ')}\n`;
      }
      report += `- Issues found: ${fileIssue.issues.length}\n`;
      
      fileIssue.issues.forEach(issue => {
        report += `  - **${issue.type}:** ${issue.value} - ${issue.suggestion}\n`;
      });
      report += `\n`;
    });
    
    if (fileValidation.allIssues.length > 20) {
      report += `... and ${fileValidation.allIssues.length - 20} more files with issues\n\n`;
    }
  } else {
    report += `## Issues Found\n`;
    report += `✅ **No potential issues found in file validation**\n\n`;
  }
  
  // Migration problems
  if (problems.length > 0) {
    report += `## Migration Problems Detected\n`;
    problems.forEach(problem => {
      report += `- **${problem.type}:** ${problem.description}\n`;
      if (problem.file) {
        report += `  - File: ${problem.file}\n`;
      }
      if (problem.dependency) {
        report += `  - Dependency: ${problem.dependency}\n`;
      }
    });
    report += `\n`;
  } else {
    report += `## Migration Problems\n`;
    report += `✅ **No migration problems detected**\n\n`;
  }
  
  // Recommendations
  report += `## Recommendations\n\n`;
  
  if (!compilationResult.success) {
    report += `### High Priority\n`;
    report += `1. **Fix TypeScript compilation errors** - These need to be resolved before deployment\n`;
    report += `2. Check import paths for design tokens\n`;
    report += `3. Verify all design token references are correct\n\n`;
  }
  
  if (fileValidation.filesWithIssues > 0) {
    report += `### Medium Priority\n`;
    report += `1. **Review files with potential issues** - Some hardcoded values may still need migration\n`;
    report += `2. Consider running additional migration passes for missed values\n\n`;
  }
  
  report += `### General\n`;
  report += `1. **Test your application thoroughly** - Ensure all UI elements render correctly\n`;
  report += `2. **Check color accuracy** - Verify colors match the original design\n`;
  report += `3. **Validate spacing consistency** - Ensure layouts remain intact\n`;
  report += `4. **Review typography** - Check that text sizes and weights are appropriate\n\n`;
  
  // Overall status
  const overallSuccess = compilationResult.success && problems.length === 0;
  
  report += `## Overall Status\n`;
  if (overallSuccess) {
    report += `✅ **VALIDATION PASSED** - Migration appears successful with no critical issues\n\n`;
  } else {
    report += `⚠️  **VALIDATION NEEDS ATTENTION** - Some issues were found that should be addressed\n\n`;
  }
  
  fs.writeFileSync(reportPath, report);
  console.log(`📄 Validation report saved to: ${reportPath}`);
  
  return overallSuccess;
}

// ===== MAIN VALIDATION LOGIC =====

async function main() {
  console.log('🔍 Migration Validation Suite\n');
  console.log('This script validates that your design system migration was successful.\n');
  
  try {
    // Check TypeScript compilation
    const compilationResult = validateTypeScriptCompilation();
    
    // Validate file token usage
    const fileValidation = validateAllFiles();
    
    // Check for common problems
    const problems = checkMigrationProblems();
    
    // Generate comprehensive report
    const overallSuccess = generateValidationReport(compilationResult, fileValidation, problems);
    
    // Summary
    console.log('\n============================================');
    console.log('          VALIDATION SUMMARY               ');
    console.log('============================================');
    
    console.log(`📊 Files validated: ${fileValidation.totalFiles}`);
    console.log(`🎨 Files using design tokens: ${fileValidation.filesWithTokens}`);
    console.log(`⚠️  Files with potential issues: ${fileValidation.filesWithIssues}`);
    console.log(`🔧 Migration problems found: ${problems.length}`);
    
    if (overallSuccess) {
      console.log('\n✅ VALIDATION PASSED - Migration appears successful!');
    } else {
      console.log('\n⚠️  VALIDATION NEEDS ATTENTION - Please review the report');
    }
    
    console.log('\n💡 Next steps:');
    console.log('   1. Review the validation report for detailed findings');
    console.log('   2. Address any compilation errors or critical issues');
    console.log('   3. Test your application thoroughly');
    console.log('   4. Consider running additional migrations if needed');
    
  } catch (error) {
    console.error('\n❌ Validation failed:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Validation suite crashed:', error);
    process.exit(1);
  });
}

module.exports = {
  VALIDATION_CONFIG,
  validateTypeScriptCompilation,
  validateFileTokens,
  validateAllFiles,
  checkMigrationProblems,
  main
};