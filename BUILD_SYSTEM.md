# Build System Documentation

This document explains the restructured, duplication-free build system.

## 📁 Folder Structure (Single Source of Truth)

### **Source Code Structure**

```
/packages/shared/src/           ← SINGLE SOURCE OF TRUTH for all code
├── components/                 ← All React components
├── services/                   ← All services and APIs
├── types/                      ← All TypeScript types
├── App.tsx                     ← Main app component
├── buildInfo.json             ← Generated build metadata
└── main.tsx                   ← Web entry point

/src/                          ← Web build entry point ONLY
└── main.tsx                   ← Imports from packages/shared/src
```

### **Asset Structure**

```
/assets/                       ← SOURCE assets (organized)
├── logos/PromptSpark.svg      ← Original logo
├── mobile/icon.png            ← Mobile app icons
└── ...

/public/                       ← BUILD-READY assets (copied)
├── PromptSpark.svg            ← Copied from assets/logos/
├── icon.png                   ← Copied from assets/mobile/
└── documentation/             ← Copied from /documentation
```

## 🔄 Build Process Flow

### **Clean Process**

```bash
npm run clean
```

**What it does:**

- Removes `dist/` folder
- Removes all generated files (`buildInfo.json`)
- Removes all copied files (`public/documentation`, `public/*.svg`)
- Preserves source files in `/assets`, `/documentation`, `/packages/shared/src`

### **Build Process**

```bash
npm run build
```

**Step-by-step execution:**

1. **Clean** - Removes all generated files
2. **Generate Build Info** - Creates `packages/shared/src/buildInfo.json`
3. **Copy Assets** - Copies files from `/assets` to `/public`
4. **Copy Documentation** - Copies `/documentation` to `/public/documentation`
5. **Build Web App** - Vite builds from `/packages/shared/src` to `/dist`

### **Development Process**

```bash
npm run dev
```

**What it does:**

- Copies assets to public folder
- Generates build info
- Starts Vite dev server

## 📋 File Source Mapping

| Final Location | Source | Process |
|---|---|---|
| `dist/index.html` | `index.html` | Processed by Vite |
| `dist/assets/` | `packages/shared/src/` | Compiled by Vite |
| `dist/PromptSpark.svg` | `assets/logos/PromptSpark.svg` | Copied via script |
| `dist/icon.png` | `assets/mobile/icon.png` | Copied via script |
| `dist/documentation/` | `documentation/` | Copied via script |
| `dist/build-manifest.json` | Generated | Build process metadata |

## 🚀 Available Commands

### **Core Commands**

- `npm start` - Start web development server (with asset copying)
- `npm run start:mobile` - Start React Native Metro bundler for mobile development
- `npm run start:web` - Alias for web development server
- `npm run clean` - Complete clean (back to source-only state)
- `npm run build` - Full build (clean + build)
- `npm run rebuild` - Alias for clean + build
- `npm run dev` - Start development server
- `npm run preview` - Preview built application

### **Utility Commands**

- `npm run copy-assets` - Copy assets from /assets to /public
- `npm run copy-docs` - Copy documentation to public folder
- `npm run generate-build-info` - Generate build metadata

### **Verification Commands**

- `npm run type-check` - TypeScript type checking
- `npm run lint` - ESLint code checking
- `npm run verify-docs` - Verify documentation

## 🎯 Benefits of This Structure

### **✅ Single Source of Truth**

- All code lives in `packages/shared/src/`
- No duplication between web and mobile
- Easy to maintain and update

### **✅ Clear Asset Pipeline**

- Source assets in `/assets` (organized, version controlled)
- Build assets in `/public` (copied automatically)
- No manual asset management

### **✅ Fully Repeatable Builds**

- `npm run clean` returns to pristine state
- `npm run build` creates identical output every time
- Build manifest tracks all file sources

### **✅ Transparent Process**

- Every file's origin is documented
- Build steps are clearly defined
- Easy to debug and modify

## 🔍 Troubleshooting

### **Build Fails**

1. Run `npm run clean`
2. Check that source files exist in expected locations
3. Run `npm run build` again

### **Assets Missing**

1. Check that assets exist in `/assets` folder
2. Run `npm run copy-assets` manually
3. Check `scripts/copy-assets.js` for asset mappings

### **Code Changes Not Reflected**

1. Ensure changes are made in `packages/shared/src/`
2. NOT in `/src` (which only contains entry point)
3. Restart dev server if needed

## 📊 Build Verification

After build completion, check:

- `dist/build-manifest.json` - Shows file sources and build steps
- `dist/` folder contains all expected files
- No duplicated files in source folders
- All assets copied correctly
