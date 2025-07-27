#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.dirname(__dirname);

console.log('📦 Copying assets to public folder...');

// Asset mapping: source → destination (relative to root)
const assetMappings = [
  // Logo/Favicon assets
  {
    source: 'assets/logos/PromptSpark.svg',
    destination: 'public/PromptSpark.svg',
    description: 'Main logo/favicon'
  },
  
  // Mobile app icons (for web PWA manifest if needed)
  {
    source: 'assets/mobile/icon.png',
    destination: 'public/icon.png',
    description: 'App icon'
  },
  {
    source: 'assets/mobile/favicon.png',
    destination: 'public/favicon.png',
    description: 'Favicon PNG fallback'
  },
];

// Function to copy file with directory creation
function copyAsset(mapping) {
  const sourcePath = path.join(rootDir, mapping.source);
  const destPath = path.join(rootDir, mapping.destination);
  const destDir = path.dirname(destPath);
  
  try {
    // Check if source exists
    if (!fs.existsSync(sourcePath)) {
      console.log(`   ⚠️  Source not found: ${mapping.source} (${mapping.description})`);
      return false;
    }
    
    // Create destination directory if it doesn't exist
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    // Copy the file
    fs.copyFileSync(sourcePath, destPath);
    console.log(`   ✅ ${mapping.source} → ${mapping.destination} (${mapping.description})`);
    return true;
    
  } catch (error) {
    console.error(`   ❌ Error copying ${mapping.source}:`, error.message);
    return false;
  }
}

// Copy all assets
let successCount = 0;
let totalCount = assetMappings.length;

assetMappings.forEach(mapping => {
  if (copyAsset(mapping)) {
    successCount++;
  }
});

console.log('');
console.log(`📊 Asset copy summary: ${successCount}/${totalCount} files copied successfully`);

if (successCount === totalCount) {
  console.log('✅ All assets copied successfully!');
} else {
  console.log('⚠️  Some assets could not be copied. Check the log above for details.');
}

export { assetMappings };
