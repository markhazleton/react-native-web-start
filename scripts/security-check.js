#!/usr/bin/env node
/**
 * Security Check Script
 * Performs comprehensive security checks on the project
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

console.log('🔍 Running Security Analysis...\n')

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

function logSuccess(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`)
}

function logError(message) {
  console.log(`${colors.red}❌ ${message}${colors.reset}`)
}

function logWarning(message) {
  console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`)
}

function logInfo(message) {
  console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`)
}

// Check for security vulnerabilities
function checkVulnerabilities() {
  console.log(`${colors.bold}1. Checking for security vulnerabilities...${colors.reset}`)
  
  try {
    execSync('npm audit --audit-level=moderate', { stdio: 'pipe' })
    logSuccess('No moderate or high severity vulnerabilities found')
    return true
  } catch (error) {
    const output = error.stdout?.toString() || error.message
    if (output.includes('vulnerabilities')) {
      logError('Security vulnerabilities detected')
      console.log(output)
      return false
    } else {
      logWarning('npm audit check completed with warnings')
      return true
    }
  }
}

// Check for outdated dependencies
function checkOutdatedDependencies() {
  console.log(`\n${colors.bold}2. Checking for outdated dependencies...${colors.reset}`)
  
  try {
    const output = execSync('npm outdated --json', { stdio: 'pipe' }).toString()
    const outdated = JSON.parse(output || '{}')
    
    if (Object.keys(outdated).length === 0) {
      logSuccess('All dependencies are up to date')
      return true
    } else {
      logWarning(`Found ${Object.keys(outdated).length} outdated dependencies`)
      Object.keys(outdated).forEach(pkg => {
        const info = outdated[pkg]
        console.log(`  - ${pkg}: ${info.current} → ${info.latest}`)
      })
      return false
    }
  } catch (error) {
    logInfo('No outdated dependencies or npm outdated not available')
    return true
  }
}

// Check for sensitive files
function checkSensitiveFiles() {
  console.log(`\n${colors.bold}3. Checking for sensitive files...${colors.reset}`)
  
  const sensitiveFiles = [
    '.env',
    '.env.local',
    '.env.production',
    'config/secrets.json',
    'private.key',
    'id_rsa',
    'id_dsa'
  ]
  
  let foundSensitive = false
  
  sensitiveFiles.forEach(fileName => {
    if (fs.existsSync(fileName)) {
      logWarning(`Found potentially sensitive file: ${fileName}`)
      foundSensitive = true
    }
  })
  
  // Check for .pem files
  try {
    const files = fs.readdirSync('.')
    files.forEach(file => {
      if (file.endsWith('.pem')) {
        logWarning(`Found potentially sensitive file: ${file}`)
        foundSensitive = true
      }
    })
  } catch (error) {
    // Ignore errors reading directory
  }
  
  if (!foundSensitive) {
    logSuccess('No sensitive files found in repository')
  }
  
  return !foundSensitive
}

// Check TypeScript configuration
function checkTypeScriptConfig() {
  console.log(`\n${colors.bold}4. Checking TypeScript configuration...${colors.reset}`)
  
  try {
    const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'))
    const compilerOptions = tsConfig.compilerOptions || {}
    
    const requiredOptions = {
      'strict': true,
      'forceConsistentCasingInFileNames': true,
      'noImplicitReturns': true
    }
    
    let allGood = true
    
    Object.entries(requiredOptions).forEach(([option, expectedValue]) => {
      if (compilerOptions[option] !== expectedValue) {
        logWarning(`TypeScript option '${option}' should be set to ${expectedValue}`)
        allGood = false
      }
    })
    
    if (allGood) {
      logSuccess('TypeScript configuration follows security best practices')
    }
    
    return allGood
  } catch (error) {
    logError('Could not read TypeScript configuration')
    return false
  }
}

// Check package.json for security configuration
function checkPackageJsonSecurity() {
  console.log(`\n${colors.bold}5. Checking package.json security configuration...${colors.reset}`)
  
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    let allGood = true
    
    // Check for security scripts
    if (!pkg.scripts?.['security:audit']) {
      logWarning('Missing security:audit script')
      allGood = false
    }
    
    // Check for overrides (security)
    if (pkg.overrides && Object.keys(pkg.overrides).length > 0) {
      logSuccess('Package overrides configured for security')
    } else {
      logInfo('No package overrides configured')
    }
    
    if (allGood) {
      logSuccess('Package.json security configuration looks good')
    }
    
    return allGood
  } catch (error) {
    logError('Could not read package.json')
    return false
  }
}

// Main execution
async function runSecurityChecks() {
  const results = [
    checkVulnerabilities(),
    checkOutdatedDependencies(),
    checkSensitiveFiles(),
    checkTypeScriptConfig(),
    checkPackageJsonSecurity()
  ]
  
  const passedChecks = results.filter(Boolean).length
  const totalChecks = results.length
  
  console.log(`\n${colors.bold}Security Check Summary:${colors.reset}`)
  console.log(`${passedChecks}/${totalChecks} checks passed`)
  
  if (passedChecks === totalChecks) {
    logSuccess('All security checks passed! 🎉')
    process.exit(0)
  } else {
    logError(`${totalChecks - passedChecks} security issues found`)
    console.log('\nRecommended actions:')
    console.log('1. Run: npm run security:fix')
    console.log('2. Update outdated dependencies: npm update')
    console.log('3. Review and address any warnings above')
    process.exit(1)
  }
}

// Run the checks
runSecurityChecks().catch(error => {
  logError(`Security check failed: ${error.message}`)
  process.exit(1)
})