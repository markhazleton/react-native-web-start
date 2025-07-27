#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to get Git information
function getGitInfo() {
  try {
    const gitCommit = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    const gitBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    const gitTag = execSync('git describe --tags --exact-match 2>/dev/null || echo ""', { encoding: 'utf8' }).trim();
    
    return {
      commit: gitCommit,
      branch: gitBranch,
      tag: gitTag || null,
    };
  } catch (error) {
    console.warn('Warning: Could not retrieve Git information:', error.message);
    return {
      commit: 'unknown',
      branch: 'unknown',
      tag: null,
    };
  }
}

// Read package.json to get current version
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Get Git information
const gitInfo = getGitInfo();

// Generate comprehensive build info
const buildInfo = {
  version: packageJson.version,
  name: packageJson.name,
  description: packageJson.description,
  homepage: packageJson.homepage,
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
  buildDateShort: new Date().toLocaleDateString(),
  buildTimeShort: new Date().toLocaleTimeString(),
  commit: process.env.GITHUB_SHA || gitInfo.commit,
  commitShort: (process.env.GITHUB_SHA || gitInfo.commit).substring(0, 7),
  gitBranch: gitInfo.branch,
  gitTag: gitInfo.tag,
  environment: process.env.NODE_ENV || 'development',
  buildNumber: process.env.GITHUB_RUN_NUMBER || 'local',
  nodeVersion: process.version,
  platform: process.platform,
  arch: process.arch,
  userAgent: process.env.npm_config_user_agent || 'unknown'
};

// Write build info to src directory
const buildInfoPath = path.join(__dirname, '..', 'src', 'buildInfo.json');
fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));

console.log('✅ Build info generated successfully');
console.log(`   Version: ${buildInfo.version}`);
console.log(`   Commit: ${buildInfo.commitShort}`);
console.log(`   Branch: ${buildInfo.gitBranch}`);
console.log(`   Build Date: ${buildInfo.buildDate}`);
console.log(`   Environment: ${buildInfo.environment}`);
console.log(`   Platform: ${buildInfo.platform} (${buildInfo.arch})`);
console.log(`   Node: ${buildInfo.nodeVersion}`);

export { buildInfo };
