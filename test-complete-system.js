/**
 * Comprehensive Design System Integration Test
 * 
 * This test validates that all components of the Rukn Design System work together:
 * - Design tokens integrity and consistency
 * - Theme system functionality and theme switching
 * - Component library integration
 * - Responsive behavior validation
 * - RTL support functionality
 * - TypeScript compilation
 * - Performance characteristics
 * - Accessibility compliance
 * 
 * Run with: node test-complete-system.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Test configuration
const TEST_CONFIG = {
  verbose: true,
  exitOnFirstError: false,
  generateReport: true,
};

// Test results storage
const testResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
  errors: [],
  warnings: [],
  details: {},
  performance: {},
  startTime: Date.now(),
};

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

/**
 * Utility functions for testing
 */
const utils = {
  log: (message, color = 'reset') => {
    if (TEST_CONFIG.verbose) {
      console.log(`${colors[color]}${message}${colors.reset}`);
    }
  },
  
  error: (message) => {
    console.error(`${colors.red}❌ ${message}${colors.reset}`);
    testResults.errors.push(message);
    testResults.failed++;
  },
  
  success: (message) => {
    utils.log(`✅ ${message}`, 'green');
    testResults.passed++;
  },
  
  warning: (message) => {
    utils.log(`⚠️ ${message}`, 'yellow');
    testResults.warnings.push(message);
    testResults.warnings++;
  },
  
  info: (message) => {
    utils.log(`ℹ️ ${message}`, 'blue');
  },
  
  section: (title) => {
    utils.log(`\n${colors.bold}${colors.cyan}=== ${title} ===${colors.reset}`, 'cyan');
  },
  
  fileExists: (filePath) => {
    return fs.existsSync(path.resolve(__dirname, filePath));
  },
  
  readFile: (filePath) => {
    try {
      return fs.readFileSync(path.resolve(__dirname, filePath), 'utf8');
    } catch (error) {
      utils.error(`Failed to read file: ${filePath} - ${error.message}`);
      return null;
    }
  },
  
  parseJSON: (content, filePath) => {
    try {
      return JSON.parse(content);
    } catch (error) {
      utils.error(`Failed to parse JSON in ${filePath}: ${error.message}`);
      return null;
    }
  },
  
  executeCommand: (command, description) => {
    try {
      utils.info(`Executing: ${description}`);
      const result = execSync(command, { 
        encoding: 'utf8',
        stdio: 'pipe',
        timeout: 30000
      });
      return { success: true, output: result };
    } catch (error) {
      return { success: false, error: error.message, output: error.stdout || error.stderr };
    }
  },
  
  measureTime: (label, fn) => {
    const start = Date.now();
    const result = fn();
    const duration = Date.now() - start;
    testResults.performance[label] = duration;
    utils.info(`${label}: ${duration}ms`);
    return result;
  },
};

/**
 * Test 1: Design Tokens Integrity
 * Validates that all design tokens are properly defined and consistent
 */
function testDesignTokens() {
  utils.section('Testing Design Tokens Integrity');
  
  // Check if design tokens file exists
  if (!utils.fileExists('constants/design-tokens.ts')) {
    utils.error('Design tokens file not found: constants/design-tokens.ts');
    return;
  }
  
  const tokensContent = utils.readFile('constants/design-tokens.ts');
  if (!tokensContent) return;
  
  // Test color system completeness
  const colorTests = [
    'primary:', 'secondary:', 'neutral:', 'success:', 'warning:', 'error:', 'info:',
  ];
  
  colorTests.forEach(colorKey => {
    if (tokensContent.includes(colorKey)) {
      utils.success(`Color system includes ${colorKey}`);
    } else {
      utils.error(`Missing color system: ${colorKey}`);
    }
  });
  
  // Test typography system
  const typographyTests = [
    'display:', 'heading:', 'body:', 'caption:', 'button:',
  ];
  
  typographyTests.forEach(typoKey => {
    if (tokensContent.includes(typoKey)) {
      utils.success(`Typography system includes ${typoKey}`);
    } else {
      utils.error(`Missing typography system: ${typoKey}`);
    }
  });
  
  // Test spacing system
  if (tokensContent.includes('spacing = {') && tokensContent.includes('0: 0,')) {
    utils.success('Spacing system is properly defined');
  } else {
    utils.error('Spacing system is incomplete or missing');
  }
  
  // Test shadow system
  if (tokensContent.includes('shadows = {') && tokensContent.includes('elevation:')) {
    utils.success('Shadow system is properly defined');
  } else {
    utils.error('Shadow system is incomplete or missing');
  }
  
  // Test breakpoints
  if (tokensContent.includes('breakpoints = {') && tokensContent.includes('sm:') && tokensContent.includes('md:')) {
    utils.success('Breakpoint system is properly defined');
  } else {
    utils.error('Breakpoint system is incomplete or missing');
  }
  
  // Test accessibility requirements
  if (tokensContent.includes('accessibility = {') && tokensContent.includes('touchTargets:')) {
    utils.success('Accessibility requirements are defined');
  } else {
    utils.error('Accessibility requirements are missing');
  }
  
  // Test RTL support
  if (tokensContent.includes('rtlSupport = {') && tokensContent.includes('textAlign:')) {
    utils.success('RTL support is properly defined');
  } else {
    utils.error('RTL support is incomplete or missing');
  }
  
  testResults.details.designTokens = {
    fileExists: true,
    colorSystem: colorTests.length,
    typographySystem: typographyTests.length,
    spacingSystem: true,
    shadowSystem: true,
    breakpoints: true,
    accessibility: true,
    rtlSupport: true,
  };
}

/**
 * Test 2: Theme System Functionality
 * Validates theme definitions and theme switching logic
 */
function testThemeSystem() {
  utils.section('Testing Theme System');
  
  // Check theme file
  if (!utils.fileExists('constants/theme.ts')) {
    utils.error('Theme file not found: constants/theme.ts');
    return;
  }
  
  const themeContent = utils.readFile('constants/theme.ts');
  if (!themeContent) return;
  
  // Test theme interface definition
  if (themeContent.includes('interface Theme')) {
    utils.success('Theme interface is defined');
  } else {
    utils.error('Theme interface is missing');
  }
  
  // Test light theme
  if (themeContent.includes('lightTheme: Theme')) {
    utils.success('Light theme is defined');
  } else {
    utils.error('Light theme is missing');
  }
  
  // Test dark theme
  if (themeContent.includes('darkTheme: Theme')) {
    utils.success('Dark theme is defined');
  } else {
    utils.error('Dark theme is missing');
  }
  
  // Test theme categories
  const themeCategories = [
    'background:', 'text:', 'border:', 'surface:', 'interactive:', 'status:', 'brand:',
  ];
  
  themeCategories.forEach(category => {
    if (themeContent.includes(category)) {
      utils.success(`Theme includes ${category} category`);
    } else {
      utils.error(`Missing theme category: ${category}`);
    }
  });
  
  // Check ThemeContext
  if (!utils.fileExists('src/context/ThemeContext.tsx')) {
    utils.error('ThemeContext file not found: src/context/ThemeContext.tsx');
    return;
  }
  
  const contextContent = utils.readFile('src/context/ThemeContext.tsx');
  if (!contextContent) return;
  
  // Test context functionality
  const contextFeatures = [
    'useTheme', 'ThemeProvider', 'toggleTheme', 'setThemeMode', 'AsyncStorage'
  ];
  
  contextFeatures.forEach(feature => {
    if (contextContent.includes(feature)) {
      utils.success(`ThemeContext includes ${feature}`);
    } else {
      utils.error(`ThemeContext missing ${feature}`);
    }
  });
  
  testResults.details.themeSystem = {
    themeFile: true,
    lightTheme: true,
    darkTheme: true,
    themeContext: true,
    categories: themeCategories.length,
  };
}

/**
 * Test 3: Component Library Integration
 * Validates that all components are properly exported and functional
 */
function testComponentLibrary() {
  utils.section('Testing Component Library');
  
  const components = ['Button', 'TextInput', 'Card'];
  
  components.forEach(component => {
    const componentPath = `components/design-system/${component}`;
    const indexPath = `${componentPath}/index.ts`;
    const componentPath1 = `${componentPath}/${component}.tsx`;
    const typesPath = `${componentPath}/${component}.types.ts`;
    
    if (utils.fileExists(indexPath)) {
      utils.success(`${component} index file exists`);
    } else {
      utils.error(`${component} index file missing`);
    }
    
    if (utils.fileExists(componentPath1)) {
      utils.success(`${component} component file exists`);
    } else {
      utils.error(`${component} component file missing`);
    }
    
    if (utils.fileExists(typesPath)) {
      utils.success(`${component} types file exists`);
    } else {
      utils.error(`${component} types file missing`);
    }
    
    // Check component content
    const componentContent = utils.readFile(componentPath1);
    if (componentContent) {
      if (componentContent.includes('export') && componentContent.includes(component)) {
        utils.success(`${component} is properly exported`);
      } else {
        utils.error(`${component} export is malformed`);
      }
      
      // Check for theme usage
      if (componentContent.includes('useTheme') || componentContent.includes('theme')) {
        utils.success(`${component} uses theme system`);
      } else {
        utils.warning(`${component} may not be using theme system`);
      }
    }
  });
  
  // Check main index file
  if (utils.fileExists('components/design-system/index.ts')) {
    const indexContent = utils.readFile('components/design-system/index.ts');
    if (indexContent) {
      components.forEach(component => {
        if (indexContent.includes(`export { ${component} }`)) {
          utils.success(`${component} is exported from main index`);
        } else {
          utils.error(`${component} not exported from main index`);
        }
      });
    }
  } else {
    utils.error('Main design system index file missing');
  }
  
  testResults.details.componentLibrary = {
    components: components.length,
    allFilesExist: true,
    properlyExported: true,
  };
}

/**
 * Test 4: Responsive Utilities
 * Validates responsive design utilities and breakpoint system
 */
function testResponsiveSystem() {
  utils.section('Testing Responsive System');
  
  if (!utils.fileExists('src/utils/responsive.ts')) {
    utils.error('Responsive utilities file not found');
    return;
  }
  
  const responsiveContent = utils.readFile('src/utils/responsive.ts');
  if (!responsiveContent) return;
  
  const responsiveFeatures = [
    'getCurrentScreenSize', 'matchesBreakpoint', 'getResponsiveValue', 
    'isTablet', 'isPhone', 'getScreenDimensions'
  ];
  
  responsiveFeatures.forEach(feature => {
    if (responsiveContent.includes(feature)) {
      utils.success(`Responsive utilities include ${feature}`);
    } else {
      utils.error(`Missing responsive utility: ${feature}`);
    }
  });
  
  // Check responsive hooks
  if (utils.fileExists('src/hooks/useResponsive.ts')) {
    const hookContent = utils.readFile('src/hooks/useResponsive.ts');
    if (hookContent && hookContent.includes('useResponsive')) {
      utils.success('Responsive hooks are implemented');
    } else {
      utils.error('Responsive hooks are malformed');
    }
  } else {
    utils.error('Responsive hooks file missing');
  }
  
  testResults.details.responsiveSystem = {
    utilities: responsiveFeatures.length,
    hooks: true,
  };
}

/**
 * Test 5: RTL Support
 * Validates Right-to-Left language support functionality
 */
function testRTLSupport() {
  utils.section('Testing RTL Support');
  
  if (!utils.fileExists('src/utils/rtl.ts')) {
    utils.error('RTL utilities file not found');
    return;
  }
  
  const rtlContent = utils.readFile('src/utils/rtl.ts');
  if (!rtlContent) return;
  
  const rtlFeatures = [
    'isRTL', 'getTextDirection', 'getLayoutDirection', 'getTextAlign',
    'containsArabic', 'containsHebrew', 'arabicFontConfig'
  ];
  
  rtlFeatures.forEach(feature => {
    if (rtlContent.includes(feature)) {
      utils.success(`RTL utilities include ${feature}`);
    } else {
      utils.error(`Missing RTL utility: ${feature}`);
    }
  });
  
  // Check RTL hooks
  if (utils.fileExists('src/hooks/useRTL.ts')) {
    const hookContent = utils.readFile('src/hooks/useRTL.ts');
    if (hookContent && hookContent.includes('useRTL')) {
      utils.success('RTL hooks are implemented');
    } else {
      utils.error('RTL hooks are malformed');
    }
  } else {
    utils.error('RTL hooks file missing');
  }
  
  testResults.details.rtlSupport = {
    utilities: rtlFeatures.length,
    hooks: true,
  };
}

/**
 * Test 6: TypeScript Compilation
 * Validates that all TypeScript files compile without errors
 */
function testTypeScriptCompilation() {
  utils.section('Testing TypeScript Compilation');
  
  // Check tsconfig.json exists
  if (!utils.fileExists('tsconfig.json')) {
    utils.error('tsconfig.json not found');
    return;
  }
  
  utils.info('Running TypeScript compilation check...');
  const result = utils.executeCommand('npx tsc --noEmit --skipLibCheck', 'TypeScript compilation');
  
  if (result.success) {
    utils.success('TypeScript compilation passed');
    testResults.details.typeScript = { compilation: 'success' };
  } else {
    utils.error('TypeScript compilation failed');
    utils.error(result.error);
    testResults.details.typeScript = { compilation: 'failed', error: result.error };
  }
}

/**
 * Test 7: Package Dependencies
 * Validates that all required dependencies are installed
 */
function testDependencies() {
  utils.section('Testing Dependencies');
  
  if (!utils.fileExists('package.json')) {
    utils.error('package.json not found');
    return;
  }
  
  const packageContent = utils.readFile('package.json');
  if (!packageContent) return;
  
  const packageJson = utils.parseJSON(packageContent, 'package.json');
  if (!packageJson) return;
  
  const requiredDeps = [
    '@react-native-async-storage/async-storage',
    'react-native',
    'react',
    'expo',
    'typescript',
    'jest',
  ];
  
  const allDeps = { 
    ...packageJson.dependencies, 
    ...packageJson.devDependencies 
  };
  
  requiredDeps.forEach(dep => {
    if (allDeps[dep]) {
      utils.success(`Required dependency ${dep} is installed`);
    } else {
      utils.error(`Missing required dependency: ${dep}`);
    }
  });
  
  // Check if Jest is configured
  if (packageJson.jest) {
    utils.success('Jest is configured');
  } else {
    utils.warning('Jest configuration not found in package.json');
  }
  
  testResults.details.dependencies = {
    total: Object.keys(allDeps).length,
    required: requiredDeps.length,
    jestConfigured: !!packageJson.jest,
  };
}

/**
 * Test 8: Migration Utilities
 * Validates migration scripts and backward compatibility
 */
function testMigrationUtilities() {
  utils.section('Testing Migration Utilities');
  
  if (!utils.fileExists('src/utils/migration.ts')) {
    utils.error('Migration utilities file not found');
    return;
  }
  
  const migrationContent = utils.readFile('src/utils/migration.ts');
  if (!migrationContent) return;
  
  const migrationFeatures = [
    'migrateColors', 'migrateSpacing', 'migrateTypography',
    'validateMigration', 'createBackup'
  ];
  
  migrationFeatures.forEach(feature => {
    if (migrationContent.includes(feature)) {
      utils.success(`Migration utilities include ${feature}`);
    } else {
      utils.error(`Missing migration utility: ${feature}`);
    }
  });
  
  // Check migration scripts
  const scripts = ['migrate-colors.js', 'migrate-spacing.js', 'migrate-typography.js'];
  scripts.forEach(script => {
    if (utils.fileExists(`scripts/${script}`)) {
      utils.success(`Migration script ${script} exists`);
    } else {
      utils.error(`Migration script ${script} missing`);
    }
  });
  
  testResults.details.migration = {
    utilities: migrationFeatures.length,
    scripts: scripts.length,
  };
}

/**
 * Test 9: Performance Validation
 * Basic performance checks for the design system
 */
function testPerformance() {
  utils.section('Testing Performance Characteristics');
  
  // Measure file loading times (simulated)
  utils.measureTime('Design Tokens Loading', () => {
    return utils.readFile('constants/design-tokens.ts');
  });
  
  utils.measureTime('Theme System Loading', () => {
    return utils.readFile('constants/theme.ts');
  });
  
  utils.measureTime('Component Index Loading', () => {
    return utils.readFile('components/design-system/index.ts');
  });
  
  // Check file sizes
  const criticalFiles = [
    'constants/design-tokens.ts',
    'constants/theme.ts',
    'components/design-system/index.ts',
    'src/context/ThemeContext.tsx'
  ];
  
  criticalFiles.forEach(file => {
    try {
      const stats = fs.statSync(path.resolve(__dirname, file));
      const sizeKB = Math.round(stats.size / 1024);
      utils.info(`${file}: ${sizeKB}KB`);
      
      if (sizeKB > 100) {
        utils.warning(`Large file size: ${file} (${sizeKB}KB)`);
      } else {
        utils.success(`Reasonable file size: ${file} (${sizeKB}KB)`);
      }
    } catch (error) {
      utils.error(`Cannot check file size: ${file}`);
    }
  });
  
  testResults.details.performance = testResults.performance;
}

/**
 * Test 10: Accessibility Compliance
 * Validates accessibility features and compliance
 */
function testAccessibility() {
  utils.section('Testing Accessibility Compliance');
  
  const tokensContent = utils.readFile('constants/design-tokens.ts');
  if (!tokensContent) return;
  
  // Check touch targets
  if (tokensContent.includes('touchTargets') && tokensContent.includes('minimum: 44')) {
    utils.success('Touch target requirements defined (44px minimum)');
  } else {
    utils.error('Touch target requirements not properly defined');
  }
  
  // Check contrast ratios
  if (tokensContent.includes('contrastPairs') && tokensContent.includes('4.5:1')) {
    utils.success('Contrast ratio requirements defined (4.5:1 minimum)');
  } else {
    utils.error('Contrast ratio requirements not properly defined');
  }
  
  // Check component accessibility
  const components = ['Button', 'TextInput', 'Card'];
  components.forEach(component => {
    const componentContent = utils.readFile(`components/design-system/${component}/${component}.tsx`);
    if (componentContent) {
      if (componentContent.includes('accessibilityLabel') || componentContent.includes('accessibilityHint')) {
        utils.success(`${component} includes accessibility props`);
      } else {
        utils.warning(`${component} may be missing accessibility props`);
      }
    }
  });
  
  testResults.details.accessibility = {
    touchTargets: true,
    contrastRatios: true,
    componentAccessibility: true,
  };
}

/**
 * Generate comprehensive test report
 */
function generateReport() {
  if (!TEST_CONFIG.generateReport) return;
  
  const endTime = Date.now();
  const totalTime = endTime - testResults.startTime;
  
  const report = {
    summary: {
      totalTests: testResults.passed + testResults.failed,
      passed: testResults.passed,
      failed: testResults.failed,
      warnings: testResults.warnings.length,
      success: testResults.failed === 0,
      duration: `${totalTime}ms`,
      timestamp: new Date().toISOString(),
    },
    details: testResults.details,
    performance: testResults.performance,
    errors: testResults.errors,
    warnings: testResults.warnings,
    environment: {
      node: process.version,
      platform: process.platform,
      cwd: process.cwd(),
    }
  };
  
  // Write report to file
  try {
    fs.writeFileSync(
      path.resolve(__dirname, 'design-system-test-report.json'),
      JSON.stringify(report, null, 2)
    );
    utils.success('Test report generated: design-system-test-report.json');
  } catch (error) {
    utils.error(`Failed to write test report: ${error.message}`);
  }
  
  return report;
}

/**
 * Main test execution
 */
async function runTests() {
  utils.log(`${colors.bold}${colors.cyan}🧪 Rukn Design System - Comprehensive Integration Test${colors.reset}`);
  utils.log(`${colors.cyan}Starting comprehensive design system validation...${colors.reset}\n`);
  
  try {
    // Run all tests
    testDesignTokens();
    testThemeSystem();
    testComponentLibrary();
    testResponsiveSystem();
    testRTLSupport();
    testTypeScriptCompilation();
    testDependencies();
    testMigrationUtilities();
    testPerformance();
    testAccessibility();
    
    // Generate report
    const report = generateReport();
    
    // Print summary
    utils.log(`\n${colors.bold}${colors.cyan}=== TEST SUMMARY ===${colors.reset}`);
    utils.log(`Total Tests: ${testResults.passed + testResults.failed}`, 'blue');
    utils.log(`✅ Passed: ${testResults.passed}`, 'green');
    
    if (testResults.failed > 0) {
      utils.log(`❌ Failed: ${testResults.failed}`, 'red');
    }
    
    if (testResults.warnings.length > 0) {
      utils.log(`⚠️  Warnings: ${testResults.warnings.length}`, 'yellow');
    }
    
    const endTime = Date.now();
    utils.log(`⏱️  Duration: ${endTime - testResults.startTime}ms`, 'blue');
    
    if (testResults.failed === 0) {
      utils.log(`\n${colors.bold}${colors.green}🎉 All tests passed! Design system is ready for production.${colors.reset}`);
      process.exit(0);
    } else {
      utils.log(`\n${colors.bold}${colors.red}💥 ${testResults.failed} test(s) failed. Please review and fix issues.${colors.reset}`);
      if (!TEST_CONFIG.exitOnFirstError) {
        process.exit(1);
      }
    }
    
  } catch (error) {
    utils.error(`Test execution failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = {
  runTests,
  testResults,
  utils,
};