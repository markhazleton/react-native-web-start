#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read package.json to get current version
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Generate build info
const buildInfo = {
  version: packageJson.version,
  buildTime: new Date().toISOString(),
  buildTimestamp: Date.now(),
  buildDate: new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  }),
  commit: process.env.GITHUB_SHA || 'local',
  environment: process.env.NODE_ENV || 'development'
};

// Write build info to src directory
const buildInfoPath = path.join(__dirname, '..', 'src', 'buildInfo.json');
fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));

console.log('✅ Build info generated:', buildInfo);
