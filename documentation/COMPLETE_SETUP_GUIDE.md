# React Native Web with Vite - Complete Cross-Platform Setup Guide

This comprehensive guide provides step-by-step instructions to create a React Native Web application using Vite as the build tool for web development and React Native CLI for mobile development. This setup allows you to write React Native components that run efficiently on **Web, iOS, and Android platforms** using a single codebase with TypeScript and API integration.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Initialization](#project-initialization)
3. [Installing Dependencies](#installing-dependencies)
4. [Configuration Setup](#configuration-setup)
5. [Project Structure](#project-structure)
6. [Creating Components](#creating-components)
7. [API Integration](#api-integration)
8. [Running the Application](#running-the-application)
9. [Mobile Platform Setup](#mobile-platform-setup)
10. [Building for Production](#building-for-production)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)
13. [Best Practices](#best-practices)
14. [Next Steps](#next-steps)

## Prerequisites

### Required for All Platforms

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Git** (for version control)

### Required for Mobile Development

- **React Native CLI**: `npm install -g @react-native-community/cli`
- **Watchman** (for macOS users): `brew install watchman`

### For iOS Development (macOS only)

- **Xcode** (latest version from App Store)
- **iOS Simulator** (included with Xcode)
- **CocoaPods**: `sudo gem install cocoapods`

### For Android Development

- **Android Studio** with Android SDK
- **Java Development Kit (JDK)** version 17
- **Android Virtual Device (AVD)** configured

Verify your installations:

```bash
node --version
npm --version
npx react-native doctor  # After installing React Native CLI
```

## Project Initialization

### Step 1: Create the Project Directory

```bash
mkdir react-native-web-vite-app
cd react-native-web-vite-app
```

### Step 2: Initialize npm Project

```bash
npm init -y
```

### Step 3: Initialize Git Repository

```bash
git init
```

## Installing Dependencies

### Step 4: Install Core Dependencies

```bash
# Install React with exact versions for compatibility
npm install react@18.2.0 react-dom@18.2.0

# Install React Native and React Native Web
npm install react-native@^0.74.0 react-native-web@^0.19.12
```

### Step 5: Install Development Dependencies

```bash
# Install Vite and React plugin
npm install -D vite @vitejs/plugin-react

# Install TypeScript and types
npm install -D typescript @types/react @types/react-dom @types/react-test-renderer

# Install React Native development tools
npm install -D @babel/core @babel/preset-env @babel/runtime
npm install -D @react-native/babel-preset @react-native/eslint-config
npm install -D @react-native/metro-config @react-native/typescript-config

# Install testing and development tools
npm install -D @types/jest babel-jest jest metro-react-native-babel-preset
npm install -D eslint prettier react-test-renderer
```

### Step 6: Install Dependencies with Compatibility Fix

```bash
# Install all dependencies with legacy peer deps to resolve version conflicts
npm install --legacy-peer-deps
```

## Configuration Setup

### Step 7: Create Vite Configuration

Create `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
  },
  optimizeDeps: {
    include: ['react-native-web'],
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
```

### Step 8: Create TypeScript Configuration

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["react-native"],
    "typeRoots": ["./node_modules/@types", "./src/types"],
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src", "vite.config.ts"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": false
  },
  "include": ["vite.config.ts"]
}
```

### Step 9: Create React Native Configuration Files

Create `app.json`:

```json
{
  "name": "ReactNativeWebViteStart",
  "displayName": "React Native Web Vite Start"
}
```

Create `babel.config.js`:

```javascript
module.exports = {
  presets: ['@react-native/babel-preset'],
};
```

Create `metro.config.js`:

```javascript
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    alias: {
      'react-native-web': 'react-native',
    },
    platforms: ['native', 'android', 'ios'],
  },
};

module.exports = mergeConfig(defaultConfig, config);
```

Create `index.js` (mobile entry point):

```javascript
/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
```

### Step 10: Update Package.json Scripts

Update your `package.json` scripts section:

```json
{
  "scripts": {
    "web": "vite",
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "serve": "vite preview --port 3000",
    "type-check": "tsc --noEmit",
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start",
    "test": "jest",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx"
  }
}
```

### Step 11: Create Environment Configuration

Create `.env` file:

```
VITE_APP_NAME=React Native Web Vite App
VITE_APP_VERSION=1.0.0
VITE_API_BASE_URL=https://v2.jokeapi.dev
```

## Project Structure

### Step 12: Create the Project Structure

Create the following directory structure:

```
├── src/
│   ├── components/
│   │   ├── navigation/
│   │   │   ├── Navigation.tsx
│   │   │   └── TabBar.tsx
│   │   └── screens/
│   │       ├── WelcomeScreen.tsx
│   │       ├── JokesScreen.tsx
│   │       └── AboutScreen.tsx
│   ├── services/
│   │   └── jokeApi.ts
│   ├── types/
│   │   └── api.ts
│   ├── App.tsx
│   └── main.tsx
├── index.html (web entry)
├── index.js (mobile entry)
├── app.json
├── babel.config.js
├── metro.config.js
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
└── package.json
```

## Creating Components

### Step 13: Create the Main HTML File

Create `index.html` in the root directory:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/PromptSpark.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Native Web Vite Starter</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
        background-color: #f5f5f5;
      }
      #root {
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
      }
      * {
        box-sizing: border-box;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### Step 14: Create the Web Entry Point

Create `src/main.tsx`:

```typescript
import React from 'react'
import { createRoot } from 'react-dom/client'
import { AppRegistry } from 'react-native'
import App from './App'

// Register the app for React Native Web
AppRegistry.registerComponent('App', () => App)

// Get the root element
const container = document.getElementById('root')
if (!container) {
  throw new Error('Root element not found')
}

// Create root and render the app
const root = createRoot(container)

// Start the app
AppRegistry.runApplication('App', {
  rootTag: container,
})
```

### Step 15: Create the Main App Component

Create `src/App.tsx`:

```typescript
import React from 'react'
import { View, StyleSheet } from 'react-native'
import Navigation from './components/navigation/Navigation'

const App: React.FC = () => {
  return (
    <View style={styles.container}>
      <Navigation />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
})

export default App
```

### Step 16: Create Type Definitions

Create `src/types/api.ts`:

```typescript
export interface JokeResponse {
  error: boolean
  category: string
  type: 'single' | 'twopart'
  joke?: string
  setup?: string
  delivery?: string
  flags: {
    nsfw: boolean
    religious: boolean
    political: boolean
    racist: boolean
    sexist: boolean
    explicit: boolean
  }
  id: number
  safe: boolean
  lang: string
}

export interface ApiError {
  error: boolean
  internalError: boolean
  code: number
  message: string
  causedBy: string[]
  additionalInfo: string
  timestamp: number
}
```

## API Integration

### Step 17: Create API Service

Create `src/services/jokeApi.ts`:

```typescript
import { JokeResponse } from '../types/api'

const BASE_URL = 'https://v2.jokeapi.dev/joke'

export class JokeApiService {
  private static async fetchWithErrorHandling(url: string): Promise<any> {
    try {
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Check if the API returned an error
      if (data.error) {
        throw new Error(data.message || 'API returned an error')
      }
      
      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  static async getRandomJoke(): Promise<JokeResponse> {
    const url = `${BASE_URL}/Any?safe-mode`
    return this.fetchWithErrorHandling(url)
  }

  static async getJokeByCategory(category: string): Promise<JokeResponse> {
    const validCategories = ['Programming', 'Miscellaneous', 'Dark', 'Pun', 'Spooky', 'Christmas']
    const safeCategory = validCategories.includes(category) ? category : 'Any'
    const url = `${BASE_URL}/${safeCategory}?safe-mode`
    return this.fetchWithErrorHandling(url)
  }

  static async getProgrammingJoke(): Promise<JokeResponse> {
    return this.getJokeByCategory('Programming')
  }

  static async getSafeJoke(): Promise<JokeResponse> {
    const url = `${BASE_URL}/Any?safe-mode&blacklistFlags=nsfw,religious,political,racist,sexist,explicit`
    return this.fetchWithErrorHandling(url)
  }
}

export default JokeApiService
```

### Step 18: Create Screen Components

The application includes three main screens with cross-platform compatibility:

1. **WelcomeScreen** - Introduction and platform info
2. **JokesScreen** - API integration example with JokeAPI
3. **AboutScreen** - App information and resources

Each screen uses platform-specific styling and components for optimal user experience across web, iOS, and Android.

## Running the Application

### Step 19: Start Web Development

```bash
# Start the web development server
npm run web
# or
npm run dev
```

The web application will be available at `http://localhost:3000`

### Step 20: Start Mobile Development

```bash
# Start Metro bundler (React Native packager)
npm start
```

In a separate terminal:

```bash
# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios
```

## Mobile Platform Setup

### Step 21: iOS Setup (macOS only)

1. **Install iOS dependencies:**

   ```bash
   cd ios && pod install && cd ..
   ```

2. **Configure iOS project in Xcode:**
   - Open `ios/ReactNativeWebViteStart.xcworkspace`
   - Configure signing and deployment targets
   - Run on simulator or device

### Step 22: Android Setup

1. **Configure Android SDK paths:**

   ```bash
   # Add to your shell profile (.bashrc, .zshrc, etc.)
   export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
   export ANDROID_HOME=%LOCALAPPDATA%\\Android\\Sdk  # Windows
   ```

2. **Create Android Virtual Device (AVD):**
   - Open Android Studio
   - Create a new AVD in AVD Manager
   - Choose a device and API level

3. **Run on Android:**

   ```bash
   npm run android
   ```

## Building for Production

### Step 23: Build Web Application

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Step 24: Build Mobile Applications

**For Android:**

```bash
cd android
./gradlew assembleRelease  # Linux/macOS
gradlew assembleRelease    # Windows
```

**For iOS:**

1. Open `ios/ReactNativeWebViteStart.xcworkspace` in Xcode
2. Select "Generic iOS Device" or your target device
3. Product → Archive
4. Follow the distribution process

## Deployment

### Web Deployment Options

1. **Vercel:**

   ```bash
   npm install -D vercel
   npx vercel --prod
   ```

2. **Netlify:**
   - Connect your Git repository
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **GitHub Pages:**

   ```bash
   npm install -D gh-pages
   npm run build
   npx gh-pages -d dist
   ```

### Mobile Deployment

1. **iOS App Store:**
   - Use Xcode's Archive and Upload process
   - Configure App Store Connect

2. **Google Play Store:**
   - Generate signed APK/AAB
   - Upload through Google Play Console

## Troubleshooting

### Common Issues and Solutions

1. **Module Resolution Issues:**
   - Ensure `react-native` is aliased to `react-native-web` in vite.config.ts
   - Check that all React Native components are supported by react-native-web

2. **TypeScript Errors:**
   - Remove `@types/react-native` if installed (React Native provides its own types)
   - Ensure correct TypeScript configuration

3. **Dependency Conflicts:**
   - Use `--legacy-peer-deps` flag when installing
   - Keep React versions consistent between dependencies

4. **Metro Bundler Issues:**

   ```bash
   npx react-native start --reset-cache
   ```

5. **iOS Build Issues:**

   ```bash
   cd ios && pod install && cd ..
   npx react-native run-ios --clean
   ```

6. **Android Build Issues:**

   ```bash
   cd android && ./gradlew clean && cd ..
   npx react-native run-android --clean
   ```

## Best Practices

### Cross-Platform Development

1. **Use Platform-Specific Code When Needed:**

   ```typescript
   import { Platform } from 'react-native'
   
   const styles = StyleSheet.create({
     container: {
       ...Platform.select({
         web: {
           boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
         },
         default: {
           shadowColor: '#000',
           shadowOffset: { width: 0, height: 2 },
           shadowOpacity: 0.1,
           shadowRadius: 4,
           elevation: 3,
         },
       }),
     },
   })
   ```

2. **Handle Navigation Differences:**
   - Web: Browser navigation
   - Mobile: Stack/tab navigation

3. **Optimize for Different Screen Sizes:**
   - Use responsive design principles
   - Test on various devices and screen sizes

4. **Handle Platform-Specific APIs:**

   ```typescript
   if (Platform.OS === 'web') {
     window.open(url, '_blank')
   } else {
     Linking.openURL(url)
   }
   ```

### Performance Optimization

1. **Enable code splitting for web builds**
2. **Use lazy loading for screens**
3. **Optimize images for different platforms**
4. **Implement proper error boundaries**

## Next Steps

### Enhanced Features to Add

1. **State Management:**

   ```bash
   npm install @reduxjs/toolkit react-redux
   ```

2. **Navigation Libraries:**

   ```bash
   npm install @react-navigation/native @react-navigation/native-stack
   npm install @react-navigation/bottom-tabs
   ```

3. **UI Component Libraries:**

   ```bash
   npm install react-native-elements
   # or
   npm install native-base
   ```

4. **Testing Setup:**

   ```bash
   npm install -D @testing-library/react-native
   npm install -D detox  # E2E testing
   ```

5. **Styling Solutions:**

   ```bash
   npm install styled-components
   # or
   npm install @emotion/react @emotion/native
   ```

6. **PWA Features (Web):**

   ```bash
   npm install -D vite-plugin-pwa
   ```

### Advanced Features

- Push notifications (mobile)
- Offline support
- Biometric authentication
- Camera and media access
- Location services
- Deep linking

## Conclusion

You now have a fully functional React Native Web application that works across web, iOS, and Android platforms. This setup provides:

- **Cross-platform compatibility** with a single codebase
- **Fast development** with Vite's HMR for web
- **TypeScript support** for better development experience
- **API integration** example with error handling
- **Platform-specific optimizations** for best user experience
- **Production-ready build pipeline** for all platforms

The application demonstrates modern development practices and provides a solid foundation for building complex cross-platform applications.
