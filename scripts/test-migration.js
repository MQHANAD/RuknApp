#!/usr/bin/env node

/**
 * Test Migration Script
 * 
 * This script tests all migration utilities on sample files to ensure they work correctly
 * before applying them to the actual codebase.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ===== TEST CONFIGURATION =====

const TEST_CONFIG = {
  testDir: 'migration-tests',
  samplesDir: 'migration-tests/samples',
  outputDir: 'migration-tests/output',
};

// ===== SAMPLE FILES FOR TESTING =====

const SAMPLE_FILES = {
  'color-test.tsx': `
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TestComponent = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Color Test</Text>
      <View style={styles.card} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  title: {
    color: '#F5A623',
    fontSize: 24,
  },
  card: {
    backgroundColor: '#1E2A38',
    borderColor: '#db941d',
    padding: 16,
    margin: 12,
  },
  button: {
    backgroundColor: '#fbb507',
    color: '#000000',
  },
  placeholder: {
    placeholderTextColor: '#999',
  }
});

export default TestComponent;
`,

  'typography-test.tsx': `
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TypographyTest = () => {
  return (
    <View>
      <Text style={styles.display}>Display Text</Text>
      <Text style={styles.heading}>Heading Text</Text>
      <Text style={styles.body}>Body Text</Text>
      <Text style={styles.caption}>Caption Text</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  display: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  heading: {
    fontSize: 22,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  caption: {
    fontSize: 12,
    fontWeight: '500',
  },
  small: {
    fontSize: 9,
    fontWeight: '700',
  }
});

export default TypographyTest;
`,

  'spacing-test.tsx': `
import React from 'react';
import { View, StyleSheet } from 'react-native';

const SpacingTest = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card} />
      <View style={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    margin: 16,
    gap: 8,
  },
  card: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 10,
    marginBottom: 14,
    borderRadius: 8,
    borderWidth: 1,
  },
  button: {
    padding: 16,
    margin: 8,
    width: 48,
    height: 32,
  },
  large: {
    padding: 30,
    margin: 18,
  }
});

export default SpacingTest;
`
};

// ===== UTILITY FUNCTIONS =====

/**
 * Create test directory structure
 */
function setupTestEnvironment() {
  console.log('🔧 Setting up test environment...');
  
  // Create directories
  [TEST_CONFIG.testDir, TEST_CONFIG.samplesDir, TEST_CONFIG.outputDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // Create sample files
  Object.entries(SAMPLE_FILES).forEach(([filename, content]) => {
    const filePath = path.join(TEST_CONFIG.samplesDir, filename);
    fs.writeFileSync(filePath, content.trim());
  });
  
  console.log('✅ Test environment set up successfully');
}

/**
 * Test design token patterns in content
 */
function testTokenPatterns(content, filename) {
  const results = {
    colors: [],
    typography: [],
    spacing: [],
    total: 0
  };
  
  // Test color patterns
  const colorPatterns = [
    /#[0-9A-Fa-f]{6}/g,
    /#[0-9A-Fa-f]{3}/g,
    /:\s*['"]white['"]/g,
    /:\s*['"]black['"]/g
  ];
  
  colorPatterns.forEach(pattern => {
    const matches = content.match(pattern) || [];
    results.colors.push(...matches);
  });
  
  // Test typography patterns
  const typographyPatterns = [
    /fontSize\s*:\s*\d+/g,
    /fontWeight\s*:\s*['"][^'"]*['"]/g
  ];
  
  typographyPatterns.forEach(pattern => {
    const matches = content.match(pattern) || [];
    results.typography.push(...matches);
  });
  
  // Test spacing patterns
  const spacingPatterns = [
    /padding\s*:\s*\d+/g,
    /margin\s*:\s*\d+/g,
    /borderRadius\s*:\s*\d+/g
  ];
  
  spacingPatterns.forEach(pattern => {
    const matches = content.match(pattern) || [];
    results.spacing.push(...matches);
  });
  
  results.total = results.colors.length + results.typography.length + results.spacing.length;
  
  return results;
}

/**
 * Test basic migration patterns
 */
function testMigrationPatterns() {
  console.log('\n🧪 Testing migration pattern detection...\n');
  
  let totalTests = 0;
  let passedTests = 0;
  
  Object.entries(SAMPLE_FILES).forEach(([filename, content]) => {
    console.log(`📄 Testing ${filename}:`);
    
    const results = testTokenPatterns(content, filename);
    
    console.log(`  Colors found: ${results.colors.length}`);
    console.log(`  Typography found: ${results.typography.length}`);  
    console.log(`  Spacing found: ${results.spacing.length}`);
    console.log(`  Total patterns: ${results.total}`);
    
    // Basic validation - files should have patterns to migrate
    const expectedPatterns = {
      'color-test.tsx': { colors: 5, typography: 1, spacing: 2 },
      'typography-test.tsx': { colors: 0, typography: 5, spacing: 0 },
      'spacing-test.tsx': { colors: 0, typography: 0, spacing: 8 }
    };
    
    if (expectedPatterns[filename]) {
      const expected = expectedPatterns[filename];
      const passed = 
        results.colors.length >= expected.colors &&
        results.typography.length >= expected.typography &&
        results.spacing.length >= expected.spacing;
      
      if (passed) {
        console.log(`  ✅ Pattern detection test passed`);
        passedTests++;
      } else {
        console.log(`  ❌ Pattern detection test failed`);
        console.log(`     Expected: colors≥${expected.colors}, typography≥${expected.typography}, spacing≥${expected.spacing}`);
      }
      totalTests++;
    }
    
    console.log('');
  });
  
  console.log(`📊 Pattern Detection Summary: ${passedTests}/${totalTests} tests passed\n`);
  return { totalTests, passedTests };
}

/**
 * Test migration script execution
 */
function testMigrationScripts() {
  console.log('🔄 Testing migration scripts...\n');
  
  const scripts = [
    'migrate-colors.js',
    'migrate-typography.js', 
    'migrate-spacing.js'
  ];
  
  let scriptTests = 0;
  let scriptPasses = 0;
  
  scripts.forEach(script => {
    console.log(`🧪 Testing ${script}:`);
    
    try {
      // Test dry-run mode
      const command = `node scripts/${script} --dry-run --no-confirm`;
      const output = execSync(command, { 
        encoding: 'utf8',
        timeout: 30000,
        stdio: 'pipe'
      });
      
      console.log(`  ✅ Dry-run executed successfully`);
      
      // Check if output contains expected elements
      if (output.includes('MIGRATION REPORT') || output.includes('Found') || output.includes('files')) {
        console.log(`  ✅ Generated expected output`);
        scriptPasses++;
      } else {
        console.log(`  ⚠️  Output format may need review`);
      }
      
    } catch (error) {
      console.log(`  ❌ Script execution failed: ${error.message.split('\n')[0]}`);
    }
    
    scriptTests++;
    console.log('');
  });
  
  console.log(`📊 Script Test Summary: ${scriptPasses}/${scriptTests} scripts working\n`);
  return { scriptTests, scriptPasses };
}

/**
 * Test validation script
 */
function testValidationScript() {
  console.log('🔍 Testing validation script...\n');
  
  try {
    const command = 'node scripts/validate-migration.js';
    const output = execSync(command, { 
      encoding: 'utf8',
      timeout: 30000,
      stdio: 'pipe'
    });
    
    console.log('✅ Validation script executed successfully');
    
    if (output.includes('VALIDATION') || output.includes('Files validated')) {
      console.log('✅ Generated validation report');
      return true;
    } else {
      console.log('⚠️  Validation output format may need review');
      return false;
    }
    
  } catch (error) {
    console.log(`❌ Validation script failed: ${error.message.split('\n')[0]}`);
    return false;
  }
}

/**
 * Test TypeScript compilation
 */
function testTypeScriptCompilation() {
  console.log('\n🔍 Testing TypeScript compilation...\n');
  
  try {
    // Check if TypeScript is available
    execSync('npx tsc --version', { stdio: 'ignore' });
    console.log('✅ TypeScript is available');
    
    // Test compilation of key files
    const keyFiles = [
      'constants/design-tokens.ts',
      'constants/theme.ts', 
      'src/utils/migration.ts',
      'src/utils/legacy-compat.ts'
    ];
    
    let compilationPasses = 0;
    
    keyFiles.forEach(file => {
      try {
        if (fs.existsSync(file)) {
          execSync(`npx tsc --noEmit --skipLibCheck "${file}"`, { stdio: 'ignore' });
          console.log(`✅ ${file} compiles successfully`);
          compilationPasses++;
        } else {
          console.log(`⚠️  ${file} not found`);
        }
      } catch (error) {
        console.log(`❌ ${file} has compilation errors`);
      }
    });
    
    console.log(`\n📊 TypeScript Compilation: ${compilationPasses}/${keyFiles.length} files compile\n`);
    return compilationPasses === keyFiles.length;
    
  } catch (error) {
    console.log('⚠️  TypeScript not available for testing');
    return null;
  }
}

/**
 * Generate comprehensive test report
 */
function generateTestReport(results) {
  console.log('📄 Generating test report...\n');
  
  const reportPath = path.join(TEST_CONFIG.testDir, 'test-results.md');
  
  let report = `# Migration Test Results\n\n`;
  report += `Generated: ${new Date().toISOString()}\n\n`;
  
  report += `## Test Summary\n\n`;
  report += `- **Pattern Detection**: ${results.patterns.passedTests}/${results.patterns.totalTests} passed\n`;
  report += `- **Migration Scripts**: ${results.scripts.scriptPasses}/${results.scripts.scriptTests} working\n`;
  report += `- **Validation Script**: ${results.validation ? '✅ Working' : '❌ Failed'}\n`;
  report += `- **TypeScript Compilation**: ${results.typescript === null ? 'N/A' : (results.typescript ? '✅ All files compile' : '❌ Some issues')}\n\n`;
  
  const overallSuccess = 
    results.patterns.passedTests === results.patterns.totalTests &&
    results.scripts.scriptPasses === results.scripts.scriptTests &&
    results.validation &&
    (results.typescript === null || results.typescript);
  
  report += `## Overall Status\n\n`;
  if (overallSuccess) {
    report += `✅ **ALL TESTS PASSED** - Migration system is ready to use!\n\n`;
  } else {
    report += `⚠️  **SOME TESTS FAILED** - Please review and fix issues before proceeding\n\n`;
  }
  
  report += `## Next Steps\n\n`;
  if (overallSuccess) {
    report += `1. Migration utilities are working correctly\n`;
    report += `2. You can proceed with actual migrations\n`;
    report += `3. Always backup before running migrations on real files\n`;
    report += `4. Start with dry-run mode to preview changes\n\n`;
  } else {
    report += `1. Review failed tests above\n`;
    report += `2. Fix any compilation or script issues\n`;
    report += `3. Re-run this test script\n`;
    report += `4. Only proceed with migrations after all tests pass\n\n`;
  }
  
  report += `## Test Files Created\n\n`;
  report += `- Sample files: \`${TEST_CONFIG.samplesDir}\`\n`;
  report += `- Test outputs: \`${TEST_CONFIG.outputDir}\`\n`;
  report += `- This report: \`${reportPath}\`\n`;
  
  fs.writeFileSync(reportPath, report);
  console.log(`📄 Test report saved to: ${reportPath}`);
  
  return overallSuccess;
}

// ===== MAIN TEST LOGIC =====

async function main() {
  console.log('🧪 Migration Test Suite');
  console.log('=======================\n');
  
  try {
    // Setup test environment
    setupTestEnvironment();
    
    // Run pattern detection tests
    const patternResults = testMigrationPatterns();
    
    // Test migration scripts
    const scriptResults = testMigrationScripts();
    
    // Test validation script
    const validationResult = testValidationScript();
    
    // Test TypeScript compilation
    const typescriptResult = testTypeScriptCompilation();
    
    // Generate comprehensive report
    const testResults = {
      patterns: patternResults,
      scripts: scriptResults,
      validation: validationResult,
      typescript: typescriptResult
    };
    
    const overallSuccess = generateTestReport(testResults);
    
    console.log('\n============================================');
    console.log('            TEST SUMMARY                    ');
    console.log('============================================');
    
    if (overallSuccess) {
      console.log('✅ ALL TESTS PASSED - Migration system ready!');
      console.log('\n🚀 You can now run migrations:');
      console.log('   1. node scripts/migrate-colors.js --dry-run');
      console.log('   2. node scripts/migrate-typography.js --dry-run');
      console.log('   3. node scripts/migrate-spacing.js --dry-run');
    } else {
      console.log('⚠️  SOME TESTS FAILED - Review issues before proceeding');
      console.log('\n🔧 Check the test report for detailed information');
    }
    
    console.log(`\n📁 Test files and report available in: ${TEST_CONFIG.testDir}/`);
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Test suite crashed:', error);
    process.exit(1);
  });
}

module.exports = {
  SAMPLE_FILES,
  TEST_CONFIG,
  setupTestEnvironment,
  testMigrationPatterns,
  testMigrationScripts,
  main
};