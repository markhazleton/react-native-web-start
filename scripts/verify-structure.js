#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.dirname(__dirname);

console.log('🔍 Verifying project structure...');

// Files that must exist for the build to work
const requiredFiles = [
  'packages/shared/src/App.tsx',
  'packages/shared/src/index.ts',
  'packages/shared/src/components/navigation/Navigation.tsx',
  'src/main.tsx',
  'vite.config.ts'
];

let allFilesExist = true;

for (const file of requiredFiles) {
  const filePath = path.join(rootDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - MISSING!`);
    allFilesExist = false;
  }
}

if (allFilesExist) {
  console.log('✅ All required files present');
  process.exit(0);
} else {
  console.log('❌ Some required files are missing');
  process.exit(1);
}
