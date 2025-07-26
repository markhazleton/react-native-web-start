#!/usr/bin/env node

/**
 * Documentation Deployment Verification Script
 * Verifies that all documentation files are properly copied and accessible
 */

import fs from 'fs';
import path from 'path';

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

console.log(`${BLUE}🔍 React Native Web Starter - Documentation Deployment Verification${RESET}\n`);

// Define expected documentation files
const expectedFiles = [
  'README.md',
  'COMPLETE_SETUP_GUIDE.md',
  'SETUP_GUIDE.md',
  'PROJECT_SUMMARY.md',
  'JOKE_FUNCTIONALITY_ANALYSIS.md'
];

// Define paths to check
const paths = {
  source: './documentation',
  public: './public/documentation',
  dist: './dist/documentation'
};

function checkFiles(basePath, label) {
  console.log(`${BLUE}📁 Checking ${label}: ${basePath}${RESET}`);
  
  if (!fs.existsSync(basePath)) {
    console.log(`${RED}❌ Directory not found: ${basePath}${RESET}\n`);
    return false;
  }

  let allFilesPresent = true;
  
  expectedFiles.forEach(file => {
    const filePath = path.join(basePath, file);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const sizeKB = Math.round(stats.size / 1024);
      console.log(`${GREEN}✅ ${file} (${sizeKB} KB)${RESET}`);
    } else {
      console.log(`${RED}❌ ${file} - Missing${RESET}`);
      allFilesPresent = false;
    }
  });
  
  console.log('');
  return allFilesPresent;
}

function checkPackageScripts() {
  console.log(`${BLUE}📋 Checking Package.json Scripts${RESET}`);
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    const scripts = packageJson.scripts;
    
    const requiredScripts = [
      'copy-docs',
      'copy-docs:win',
      'copy-docs:unix',
      'prebuild',
      'predeploy',
      'deploy'
    ];
    
    requiredScripts.forEach(script => {
      if (scripts[script]) {
        console.log(`${GREEN}✅ ${script}: ${scripts[script]}${RESET}`);
      } else {
        console.log(`${RED}❌ ${script} - Missing${RESET}`);
      }
    });
    
    console.log('');
  } catch (error) {
    console.log(`${RED}❌ Error reading package.json: ${error.message}${RESET}\n`);
  }
}

function generateReport() {
  console.log(`${BLUE}📊 Documentation Deployment Report${RESET}`);
  console.log('==========================================');
  
  const sourceOk = checkFiles(paths.source, 'Source Documentation');
  const publicOk = checkFiles(paths.public, 'Public Directory (for Vite)');
  const distOk = checkFiles(paths.dist, 'Distribution Directory (deployed)');
  
  checkPackageScripts();
  
  console.log(`${BLUE}🌐 Live URLs${RESET}`);
  console.log('============');
  console.log('📱 Live App: https://markhazleton.github.io/react-native-web-start');
  console.log('📚 Documentation Index: https://markhazleton.github.io/react-native-web-start/documentation/README.md');
  console.log('🔧 Complete Setup Guide: https://markhazleton.github.io/react-native-web-start/documentation/COMPLETE_SETUP_GUIDE.md');
  console.log('📋 Project Summary: https://markhazleton.github.io/react-native-web-start/documentation/PROJECT_SUMMARY.md');
  console.log('🎭 Joke Analysis: https://markhazleton.github.io/react-native-web-start/documentation/JOKE_FUNCTIONALITY_ANALYSIS.md');
  console.log('⚙️ Setup Guide: https://markhazleton.github.io/react-native-web-start/documentation/SETUP_GUIDE.md');
  console.log('');
  
  console.log(`${BLUE}🚀 Quick Commands${RESET}`);
  console.log('================');
  console.log('📄 Copy documentation: npm run copy-docs');
  console.log('🏗️ Build project: npm run build');
  console.log('🚀 Deploy to GitHub Pages: npm run deploy');
  console.log('🔍 Preview locally: npm run preview');
  console.log('');
  
  // Overall status
  if (sourceOk && publicOk && distOk) {
    console.log(`${GREEN}🎉 SUCCESS: All documentation files are properly deployed and accessible!${RESET}`);
  } else {
    console.log(`${YELLOW}⚠️ WARNING: Some documentation files may be missing. Run 'npm run copy-docs' and 'npm run deploy' to fix.${RESET}`);
  }
}

// Run the verification
generateReport();
