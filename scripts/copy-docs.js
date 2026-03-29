#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.dirname(__dirname);

console.log('📄 Copying documentation files...');

// Documentation copy mappings
const docMappings = [
  {
    source: 'documentation',
    destination: 'public/documentation',
    recursive: true,
    description: 'All documentation files'
  }
];

// Function to recursively copy directory
function copyDirectory(src, dest) {
  const srcPath = path.join(rootDir, src);
  const destPath = path.join(rootDir, dest);
  
  if (!fs.existsSync(srcPath)) {
    return false;
  }
  
  // Create destination directory
  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath, { recursive: true });
  }
  
  const items = fs.readdirSync(srcPath);
  
  for (const item of items) {
    const srcItemPath = path.join(srcPath, item);
    const destItemPath = path.join(destPath, item);
    
    const stat = fs.lstatSync(srcItemPath);
    
    if (stat.isDirectory()) {
      // Recursively copy directory
      if (!fs.existsSync(destItemPath)) {
        fs.mkdirSync(destItemPath, { recursive: true });
      }
      copyDirectory(path.relative(rootDir, srcItemPath), path.relative(rootDir, destItemPath));
    } else {
      // Copy file
      fs.copyFileSync(srcItemPath, destItemPath);
    }
  }
  
  return true;
}

// Copy documentation files
let successCount = 0;
let totalCount = docMappings.length;

for (const mapping of docMappings) {
  try {
    const success = copyDirectory(mapping.source, mapping.destination);
    
    if (success) {
      console.log(`   ✅ ${mapping.source} → ${mapping.destination} (${mapping.description})`);
      successCount++;
    } else {
      console.log(`   ⚠️  Source not found: ${mapping.source} (${mapping.description})`);
    }
    
  } catch (error) {
    console.error(`   ❌ Error copying ${mapping.source}:`, error.message);
  }
}

console.log('');
console.log(`📊 Documentation copy summary: ${successCount}/${totalCount} operations completed successfully`);

if (successCount === totalCount) {
  console.log('✅ All documentation copied successfully!');
} else {
  console.log('⚠️  Some documentation could not be copied. Check the log above for details.');
}
