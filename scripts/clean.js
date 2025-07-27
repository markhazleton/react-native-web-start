#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.dirname(__dirname);

console.log('🧹 Starting comprehensive clean...');

// Define all generated/copied files and directories to clean
const itemsToClean = [
  // Build outputs
  'dist',
  
  // Generated files
  'src/buildInfo.json',
  'packages/shared/src/buildInfo.json',
  
  // Copied files/directories
  'public/documentation',
  'public/PromptSpark.svg',
  'public/vite.svg',
  
  // Asset copies (keep source assets in /assets)
  'assets/web/PromptSpark.svg',
  'assets/web/vite.svg',
  'assets/web/react.svg',
  
  // Node modules (optional - uncomment if you want full clean)
  // 'node_modules',
  // 'packages/mobile/node_modules',
  // 'packages/mobile/MobileApp/node_modules',
  // 'packages/shared/node_modules',
  // 'packages/web/node_modules',
  
  // Package locks (optional - uncomment for full clean)
  // 'package-lock.json',
  // 'packages/mobile/package-lock.json',
  // 'packages/mobile/MobileApp/package-lock.json',
  // 'packages/shared/package-lock.json',
  // 'packages/web/package-lock.json',
];

// Function to safely remove file or directory
function removeItem(itemPath) {
  const fullPath = path.join(rootDir, itemPath);
  
  try {
    if (fs.existsSync(fullPath)) {
      const stat = fs.lstatSync(fullPath);
      
      if (stat.isDirectory()) {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`   ✅ Removed directory: ${itemPath}`);
      } else {
        fs.unlinkSync(fullPath);
        console.log(`   ✅ Removed file: ${itemPath}`);
      }
    } else {
      console.log(`   ⚪ Not found (already clean): ${itemPath}`);
    }
  } catch (error) {
    console.error(`   ❌ Error removing ${itemPath}:`, error.message);
  }
}

// Clean all items
itemsToClean.forEach(removeItem);

// Create necessary directories that should exist
const dirsToCreate = [
  'public',
  'src',
  'packages/shared/src',
];

dirsToCreate.forEach(dir => {
  const fullPath = path.join(rootDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`   📁 Created directory: ${dir}`);
  }
});

console.log('✅ Clean completed successfully!');
console.log('');
console.log('📋 Clean Summary:');
console.log('   • Removed all build outputs (dist/)');
console.log('   • Removed all generated files (buildInfo.json)');
console.log('   • Removed all copied files (public/documentation, public/*.svg)');
console.log('   • Removed duplicate asset copies');
console.log('   • Preserved source files in /assets, /documentation, /packages/shared/src');
console.log('');
console.log('🚀 Ready for fresh build! Run: npm run build');
