# GitHub Pages Publishing Guide - Comprehensive Troubleshooting

## Overview

This document provides a detailed walkthrough of setting up GitHub Pages deployment for a React Native Web project using Vite, including all the common issues encountered and their solutions. This guide is based on real-world troubleshooting experience and should help new developers avoid common pitfalls.

## Table of Contents

1. [Initial Setup Requirements](#initial-setup-requirements)
2. [Common Issues and Solutions](#common-issues-and-solutions)
3. [GitHub Actions vs gh-pages Package](#github-actions-vs-gh-pages-package)
4. [Dependency Management Issues](#dependency-management-issues)
5. [Build Process Problems](#build-process-problems)
6. [Documentation Loading Issues](#documentation-loading-issues)
7. [Final Working Solution](#final-working-solution)
8. [Best Practices](#best-practices)
9. [Troubleshooting Checklist](#troubleshooting-checklist)

## Initial Setup Requirements

### Project Structure
```
react-native-web-start/
├── .github/workflows/deploy.yml    # GitHub Actions workflow
├── public/documentation/           # Documentation files for web access
├── documentation/                  # Source documentation files
├── scripts/generate-build-info.js  # Build information generator
├── src/                           # Source code
├── dist/                          # Build output
├── .npmrc                         # npm configuration
└── package.json                   # Project configuration
```

### Essential Dependencies
- **Vite 7.0.6**: Build tool and dev server
- **React Native Web 0.19.12**: Cross-platform components
- **Node.js 20+**: Required for Vite 7.x compatibility
- **gh-pages** (optional): For manual deployment

## Common Issues and Solutions

### Issue 1: GitHub Pages Configuration Conflict

**Problem**: Repository was set to use GitHub Actions for Pages deployment, but the project was using the `gh-pages` npm package, creating a deployment conflict.

**Symptoms**:
- Changes weren't showing up on the live site
- "Workflow details will appear here once your site has been deployed" message
- No GitHub Actions runs visible

**Root Cause**: GitHub Pages can be configured to deploy from either:
- GitHub Actions (recommended)
- A specific branch (like `gh-pages`)

Having both configurations creates conflicts.

**Solution**: Choose one deployment method and stick with it. We chose GitHub Actions for better control and CI/CD integration.

### Issue 2: Documentation Files Not Loading

**Problem**: Documentation files showed fallback content instead of actual file contents when running on GitHub Pages.

**Symptoms**:
```
*This is fallback content. The actual documentation file could not be loaded.*
```

**Root Cause**: The documentation service was using absolute paths (`/documentation/file.md`) instead of relative paths that work with GitHub Pages' base URL (`/react-native-web-start/`).

**Solution**: Update the documentation service to use Vite's `import.meta.env.BASE_URL`:

```typescript
// Before (broken on GitHub Pages)
path: "/documentation/COMPLETE_SETUP_GUIDE.md"

// After (works on GitHub Pages)
path: `${import.meta.env.BASE_URL}documentation/COMPLETE_SETUP_GUIDE.md`
```

**Required Files**:
- Add `src/vite-env.d.ts` for TypeScript support
- Update `vite.config.ts` with correct base URL for production

### Issue 3: React Dependency Version Conflicts

**Problem**: GitHub Actions failed with `ERESOLVE` dependency conflicts.

**Error Message**:
```
npm error ERESOLVE could not resolve
npm error While resolving: react-test-renderer@18.3.1
npm error Found: react@18.2.0
npm error Conflicting peer dependency: react@18.3.1
```

**Root Cause**: React Native projects often have complex dependency trees with peer dependency conflicts between React versions.

**Solutions Applied**:
1. **Update package.json dependencies**:
   ```json
   "dependencies": {
     "react": "^18.2.0",  // Use caret for flexibility
     "react-dom": "^18.2.0"
   }
   ```

2. **Add .npmrc file**:
   ```
   legacy-peer-deps=true
   ```

3. **Update GitHub Actions workflow**:
   ```yaml
   - name: Install dependencies
     run: npm install --legacy-peer-deps
   ```

### Issue 4: Cross-Platform Script Compatibility

**Problem**: Build scripts failed in GitHub Actions (Linux) because they contained Windows PowerShell commands.

**Error Message**:
```
sh: 1: Syntax error: end of file unexpected (expecting "then")
```

**Root Cause**: The `copy-docs` script tried to run Windows PowerShell commands (`Copy-Item`, `if not exist`) on a Linux runner.

**Original Problematic Script**:
```json
"copy-docs:win": "if not exist \"public\\documentation\" mkdir \"public\\documentation\" && Copy-Item -Path \"documentation\\*\" -Destination \"public\\documentation\\\" -Recurse -Force"
```

**Solution**: Use platform-specific commands directly in the GitHub Actions workflow:
```yaml
- name: Copy documentation
  run: mkdir -p public/documentation && cp -r documentation/* public/documentation/ && cp README.md public/documentation/
```

### Issue 5: Vite Build Failures with crypto.hash

**Problem**: Vite build failed with `crypto.hash is not a function` error.

**Error Message**:
```
[vite:build-html] crypto.hash is not a function
```

**Root Cause**: Vite 7.x requires Node.js 20+ due to changes in the crypto API.

**Solution**: Update GitHub Actions to use Node.js 20:
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: "20"  # Changed from "18"
    cache: "npm"
```

### Issue 6: Build Information and Versioning

**Problem**: No way to distinguish between different builds or track deployment versions.

**Solution**: Implement automated build information system:

1. **Create build info generator script** (`scripts/generate-build-info.js`):
   ```javascript
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
   ```

2. **Create build info service** for easy access
3. **Add footer component** to display version information
4. **Integrate with GitHub Actions** to use real commit hashes

## GitHub Actions vs gh-pages Package

### GitHub Actions Approach (Recommended)

**Pros**:
- Full CI/CD pipeline control
- Environment variables support
- Better error reporting and logs
- Automatic deployment on push
- Production environment settings
- Real commit hash tracking

**Cons**:
- More complex initial setup
- Requires workflow configuration

### gh-pages Package Approach

**Pros**:
- Simple one-command deployment
- Good for manual deployments
- Less configuration required

**Cons**:
- No CI/CD integration
- No environment variable support
- Manual deployment process
- Limited build customization

## Build Process Problems

### Cross-Platform Script Issues

**Problem**: Scripts written for one platform fail on another.

**Best Practice**: 
- Use platform-agnostic commands when possible
- Separate CI/CD scripts from local development scripts
- Test scripts on target deployment platform

### Environment Configuration

**Problem**: Different behavior between local development and production builds.

**Solution**:
- Use environment variables consistently
- Set `NODE_ENV=production` in GitHub Actions
- Configure Vite base URL for GitHub Pages
- Use `import.meta.env` for runtime configuration

## Documentation Loading Issues

### Path Resolution Problems

**Problem**: Static files not accessible due to incorrect paths.

**Solutions**:
1. **Copy files to public directory**: Ensure documentation files are available at build time
2. **Use correct base URLs**: Account for GitHub Pages subdirectory structure
3. **Configure Vite properly**: Set base URL in `vite.config.ts`

### CORS and Security Issues

**Problem**: Browser security prevents loading local files.

**Solution**: Serve files through the web server, not as local file system access.

## Final Working Solution

### GitHub Actions Workflow (`.github/workflows/deploy.yml`)

```yaml
name: Deploy React Native Web to Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm install --legacy-peer-deps

      - name: Generate build info
        run: npm run generate-build-info
        env:
          GITHUB_SHA: ${{ github.sha }}
          NODE_ENV: production

      - name: Copy documentation
        run: mkdir -p public/documentation && cp -r documentation/* public/documentation/ && cp README.md public/documentation/

      - name: Build project
        run: npm run build
        env:
          NODE_ENV: production

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: "./dist"

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "generate-build-info": "node scripts/generate-build-info.js",
    "prebuild": "node scripts/generate-build-info.js && npm run copy-docs",
    "build": "vite build",
    "copy-docs": "npm run copy-docs:win || npm run copy-docs:unix",
    "copy-docs:win": "if not exist \"public\\documentation\" mkdir \"public\\documentation\" && Copy-Item -Path \"documentation\\*\" -Destination \"public\\documentation\\\" -Recurse -Force && Copy-Item -Path \"README.md\" -Destination \"public\\documentation\\\" -Force",
    "copy-docs:unix": "mkdir -p public/documentation && cp -r documentation/* public/documentation/ && cp README.md public/documentation/",
    "predeploy": "npm run copy-docs && npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### Configuration Files

**`.npmrc`**:
```
legacy-peer-deps=true
```

**`vite.config.ts`**:
```typescript
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/react-native-web-start/' : '/',
  // ... other config
});
```

## Best Practices

### 1. Repository Configuration
- Set GitHub Pages to use "GitHub Actions" as the source
- Don't mix deployment methods (Actions + gh-pages package)
- Use branch protection rules for the main branch

### 2. Dependency Management
- Use exact versions for critical dependencies
- Add `.npmrc` with `legacy-peer-deps=true` for React Native projects
- Test dependency installation in clean environments

### 3. Build Process
- Separate local development scripts from CI/CD scripts
- Use environment variables for configuration
- Generate build information automatically
- Test builds locally before deploying

### 4. Documentation
- Copy documentation files to `public/` directory for web access
- Use relative URLs that work with GitHub Pages base paths
- Implement fallback content for failed loads
- Version your documentation with the application

### 5. Monitoring and Debugging
- Implement version footers for easy identification
- Use build timestamps to track deployments
- Log build information for debugging
- Set up proper error handling in GitHub Actions

## Troubleshooting Checklist

### Before Deployment
- [ ] GitHub Pages is set to use "GitHub Actions"
- [ ] All dependencies install without errors locally
- [ ] Build process completes successfully locally
- [ ] Documentation files are copied to `public/documentation/`
- [ ] Base URL is configured correctly in Vite config
- [ ] Environment variables are set properly

### GitHub Actions Failures
- [ ] Check Node.js version (use 20+ for Vite 7.x)
- [ ] Verify npm install command includes `--legacy-peer-deps`
- [ ] Ensure scripts use Unix commands for Linux runners
- [ ] Check that environment variables are set in workflow
- [ ] Verify all required files are committed to repository

### Deployment Issues
- [ ] Check GitHub Actions logs for specific errors
- [ ] Verify GitHub Pages configuration in repository settings
- [ ] Check that deployment completed successfully
- [ ] Test live URL after deployment
- [ ] Clear browser cache if changes don't appear

### Runtime Issues
- [ ] Check browser console for JavaScript errors
- [ ] Verify documentation files are accessible at their URLs
- [ ] Test application functionality on live site
- [ ] Check that footer shows correct build information
- [ ] Verify responsive design works on different devices

## Common Error Messages and Solutions

### "This is fallback content. The actual documentation file could not be loaded."
- **Cause**: Documentation service can't fetch files due to incorrect paths
- **Solution**: Use `import.meta.env.BASE_URL` for path resolution

### "crypto.hash is not a function"
- **Cause**: Vite 7.x incompatibility with Node.js < 20
- **Solution**: Upgrade to Node.js 20 in GitHub Actions

### "ERESOLVE could not resolve"
- **Cause**: Peer dependency conflicts in React ecosystem
- **Solution**: Use `--legacy-peer-deps` and update dependency versions

### "Syntax error: end of file unexpected"
- **Cause**: Windows PowerShell commands running on Linux
- **Solution**: Use Unix commands in GitHub Actions workflow

### "Workflow details will appear here once your site has been deployed"
- **Cause**: GitHub Pages set to GitHub Actions but no workflow exists
- **Solution**: Create proper GitHub Actions workflow file

## Conclusion

Setting up GitHub Pages for a React Native Web project involves navigating several complex issues related to:

1. **Platform compatibility** (Windows development vs Linux CI/CD)
2. **Dependency management** (React ecosystem peer dependencies)
3. **Build tool compatibility** (Vite version requirements)
4. **Path resolution** (GitHub Pages subdirectory structure)
5. **Deployment method selection** (GitHub Actions vs branch-based)

The key to success is:
- **Systematic troubleshooting**: Address one issue at a time
- **Environment consistency**: Match CI/CD environment locally when possible
- **Proper configuration**: Use environment variables and correct base URLs
- **Comprehensive testing**: Test both local builds and deployed versions
- **Documentation**: Keep detailed records of issues and solutions

This guide should help future developers avoid the common pitfalls and implement a robust, automated deployment pipeline for React Native Web projects on GitHub Pages.

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Documentation](https://vitejs.dev/)
- [React Native Web Documentation](https://necolas.github.io/react-native-web/)
- [npm Legacy Peer Deps](https://docs.npmjs.com/cli/v8/using-npm/config#legacy-peer-deps)

---

*Last updated: July 26, 2025*  
*Based on real-world troubleshooting experience with react-native-web-start project*
