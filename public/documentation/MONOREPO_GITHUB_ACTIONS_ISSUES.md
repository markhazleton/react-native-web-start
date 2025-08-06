# Monorepo Refactoring Issues with GitHub Actions

## Overview

During the refactoring of the React Native Web project to a monorepo structure, several critical issues emerged that caused GitHub Actions build failures. This document provides a comprehensive analysis of the problems, their root causes, and the solutions implemented.

## Project Structure Before and After

### Before Refactoring (Single Repository)

```
react-native-web-start/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   └── components/
├── package.json
├── vite.config.ts
└── tsconfig.json
```

### After Refactoring (Monorepo)

```
react-native-web-start/
├── src/
│   └── main.tsx
├── packages/
│   ├── shared/
│   │   ├── src/
│   │   │   ├── App.tsx
│   │   │   ├── index.ts
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── types/
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── mobile/
│   └── web/
├── package.json (root)
├── vite.config.ts
└── tsconfig.json
```

## Issues Encountered

### 1. Import Resolution Failures

#### Problem

The GitHub Actions build failed with the following error:

```
[vite:load-fallback] Could not load /home/runner/work/react-native-web-start/react-native-web-start/packages/shared/src/App (imported by src/main.tsx): ENOENT: no such file or directory
```

#### Root Cause

The main.tsx file was importing from the shared package using various approaches that failed in the CI environment:

1. **Initial attempt**: `import App from '@shared/App'`
2. **Second attempt**: `import { App } from '@monorepo/shared'`
3. **Third attempt**: `import App from '../packages/shared/src/App'`

The import resolution was inconsistent between local development and CI environments due to:

- Alias configuration issues in `vite.config.ts`
- TypeScript path mapping problems in `tsconfig.json`
- Differences in how Node.js resolves paths in different environments

#### Solution

1. **Updated Vite Configuration**:

   ```typescript
   resolve: {
     alias: {
       "react-native": "react-native-web",
       "@shared": path.resolve(__dirname, "packages/shared/src"),
     },
     extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
   }
   ```

2. **Updated TypeScript Configuration**:

   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["src/*"],
         "@shared/*": ["packages/shared/src/*"]
       }
     }
   }
   ```

3. **Standardized Import**:

   ```typescript
   import App from '@shared/App'
   ```

### 2. Missing Files in CI Environment

#### Problem

The verification step revealed that critical files were missing in the GitHub Actions environment:

```
📋 Step 1/5: Verify Project Structure
🔍 Verifying project structure...
   ❌ packages/shared/src/App.tsx - MISSING!
   ❌ packages/shared/src/index.ts - MISSING!
   ❌ packages/shared/src/components/navigation/Navigation.tsx - MISSING!
```

#### Root Cause

The `.gitignore` file contained an overly broad rule that was intended for NuGet packages but affected our monorepo structure:

```gitignore
# The packages folder can be ignored because of Package Restore
**/[Pp]ackages/*
```

This rule excluded ALL directories named "packages" (case-insensitive), including our monorepo's `packages/` directory.

#### Investigation Process

1. **Local vs CI Discrepancy**: The build worked locally but failed in CI
2. **Git Tracking Check**: `git ls-files packages/shared/src/` returned no results
3. **Gitignore Analysis**: Found the conflicting rule at line 270
4. **Verification**: The rule was excluding our entire shared package

#### Solution

1. **Fixed .gitignore**:

   ```gitignore
   # NuGet packages directories (case-sensitive to avoid our monorepo packages/)
   **/Packages/*
   **/packages/repositories.config
   # except build/, which is used as an MSBuild target.
   !**/Packages/build/
   !**/packages/build/
   ```

2. **Force-added excluded files**:

   ```bash
   git add -f packages/shared/src/
   git add -f packages/shared/package.json packages/shared/tsconfig.json
   ```

### 3. Module Resolution and Export Issues

#### Problem

Even after fixing the file availability, there were export/import mismatches:

```
Could not resolve "./components/screens/AboutScreen" from "packages/shared/src/index.ts"
```

#### Root Cause

The `packages/shared/src/index.ts` file was exporting components that didn't exist:

```typescript
export { default as AboutScreen } from "./components/screens/AboutScreen"; // File didn't exist
```

#### Solution

Cleaned up the exports to match actual files:

```typescript
// Removed non-existent exports
export { default as WelcomeScreen } from "./components/screens/WelcomeScreen";
export { default as DocumentationScreen } from "./components/screens/DocumentationScreen";
export { default as DocumentationBrowserScreen } from "./components/screens/DocumentationBrowserScreen";
export { default as DocumentationReaderScreen } from "./components/screens/DocumentationReaderScreen";
export { default as JokesScreen } from "./components/screens/JokesScreen";
// Removed: export { default as AboutScreen } from "./components/screens/AboutScreen";
```

### 4. Build Process Reliability Issues

#### Problem

The build process lacked early validation, making debugging difficult when files were missing or imports were broken.

#### Solution

Added a comprehensive verification step as the first build step:

```javascript
// scripts/verify-structure.js
const requiredFiles = [
  'packages/shared/src/App.tsx',
  'packages/shared/src/index.ts',
  'packages/shared/src/components/navigation/Navigation.tsx',
  'src/main.tsx',
  'vite.config.ts'
];

for (const file of requiredFiles) {
  const filePath = path.join(rootDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - MISSING!`);
    allFilesExist = false;
  }
}
```

Enhanced the Vite configuration with runtime validation:

```typescript
// Verify that the shared package exists
const sharedPath = path.resolve(__dirname, "packages/shared/src");
if (!fs.existsSync(sharedPath)) {
  throw new Error(`Shared package not found at: ${sharedPath}`);
}
```

## Lessons Learned

### 1. Gitignore Conflicts

- **Issue**: Generic .gitignore rules can conflict with monorepo structures
- **Solution**: Be specific with ignore patterns and test thoroughly
- **Prevention**: Regular audits of .gitignore rules when restructuring projects

### 2. Import Resolution Complexity

- **Issue**: Multiple ways to import can lead to inconsistent behavior
- **Solution**: Standardize on one approach and document it clearly
- **Prevention**: Use tooling to enforce consistent import patterns

### 3. Environment Parity

- **Issue**: Differences between local and CI environments can mask issues
- **Solution**: Implement verification steps and test in CI-like environments
- **Prevention**: Use containerized development environments

### 4. Build Process Visibility

- **Issue**: Opaque build failures make debugging difficult
- **Solution**: Add comprehensive logging and early validation
- **Prevention**: Implement progressive validation at each build step

## Best Practices Established

### 1. File Structure Validation

```javascript
// Always verify required files exist before building
const verificationStep = {
  name: 'Verify Project Structure',
  command: 'node scripts/verify-structure.js',
  description: 'Verify all required files exist for the build'
};
```

### 2. Path Resolution Strategy

```typescript
// Use explicit aliases with absolute paths
resolve: {
  alias: {
    "@shared": path.resolve(__dirname, "packages/shared/src"),
  },
  extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
}
```

### 3. Error Handling

```typescript
// Fail fast with clear error messages
if (!fs.existsSync(sharedPath)) {
  throw new Error(`Shared package not found at: ${sharedPath}`);
}
```

### 4. Git Tracking Verification

```bash
# Always verify files are tracked before relying on them in CI
git ls-files packages/shared/src/
```

## Timeline of Resolution

1. **Issue Discovery**: GitHub Actions failing with import resolution errors
2. **Initial Fix Attempts**: Multiple import syntax attempts (all failed in CI)
3. **Environment Analysis**: Discovered local vs CI discrepancy
4. **Git Investigation**: Found files were not tracked by git
5. **Gitignore Analysis**: Identified conflicting ignore rule
6. **Comprehensive Fix**: Updated gitignore, added files, enhanced build process
7. **Verification**: Added automated checks to prevent regression

## Impact Assessment

### Before Fix

- ❌ GitHub Actions failing consistently
- ❌ Deployment pipeline broken
- ❌ No clear error messages
- ❌ Manual debugging required

### After Fix

- ✅ GitHub Actions building successfully
- ✅ Automated deployment working
- ✅ Clear error messages and early validation
- ✅ Robust build process with verification steps

## Preventive Measures

### 1. Pre-commit Hooks

Consider adding pre-commit hooks to verify:

- All imported files exist
- No .gitignore conflicts
- Build succeeds locally

### 2. CI/CD Enhancements

- Add file existence checks as first CI step
- Implement build artifact verification
- Add notification for build failures with detailed logs

### 3. Documentation Standards

- Document import patterns and conventions
- Maintain architecture decision records (ADRs)
- Keep build process documentation updated

### 4. Testing Strategy

- Test builds in clean environments regularly
- Implement integration tests for import resolution
- Add automated checks for common issues

## Conclusion

The monorepo refactoring exposed several critical issues related to file tracking, import resolution, and build process reliability. The comprehensive solution involved fixing the root cause (.gitignore conflicts), standardizing the import strategy, and implementing robust verification processes.

The key takeaway is that monorepo structures require careful attention to:

1. **File tracking and .gitignore patterns**
2. **Consistent import/export strategies**
3. **Environment parity between local and CI**
4. **Comprehensive build validation**

The implemented solutions not only fixed the immediate issues but also established a more robust build process that will prevent similar problems in the future.
