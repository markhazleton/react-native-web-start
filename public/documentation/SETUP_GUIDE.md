# React Native Web with Vite - Complete Setup Guide

This guide provides step-by-step instructions to create a React Native Web application using Vite as the build tool. This setup allows you to write React Native components that run efficiently on the web.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Initialization](#project-initialization)
3. [Installing Dependencies](#installing-dependencies)
4. [Configuration Setup](#configuration-setup)
5. [Project Structure](#project-structure)
6. [Creating Components](#creating-components)
7. [Running the Application](#running-the-application)
8. [Building for Production](#building-for-production)
9. [Troubleshooting](#troubleshooting)
10. [Next Steps](#next-steps)

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Git** (for version control)

Verify your installations:

```bash
node --version
npm --version
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

### Step 4: Install Vite and React Dependencies

```bash
# Install Vite and React
npm install react react-dom

# Install Vite as dev dependency
npm install -D vite @vitejs/plugin-react
```

### Step 5: Install React Native Web

```bash
# Install React Native Web
npm install react-native-web

# Install React Native for component compatibility
npm install react-native
```

### Step 6: Install TypeScript Dependencies (Optional but Recommended)

```bash
# Install TypeScript and types
npm install -D typescript @types/react @types/react-dom @types/react-native
```

### Step 7: Install Additional Utilities

```bash
# Install navigation (optional)
npm install @react-navigation/native @react-navigation/native-stack

# Install web-specific navigation dependencies
npm install react-router-dom react-router-native

# Install development tools
npm install -D @types/react-router-dom
```

## Configuration Setup

### Step 8: Create Vite Configuration

Create `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

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
})
```

### Step 9: Create TypeScript Configuration

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
    "typeRoots": ["./node_modules/@types", "./src/types"]
  },
  "include": ["src"],
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
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

### Step 10: Update Package.json Scripts

Add the following scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "serve": "vite preview --port 3000"
  }
}
```

### Step 11: Create Environment Configuration

Create `.env` file:

```
VITE_APP_NAME=React Native Web Vite App
VITE_APP_VERSION=1.0.0
```

## Project Structure

### Step 12: Create the Project Structure

Create the following directory structure:

```
src/
├── components/
│   ├── common/
│   ├── navigation/
│   └── screens/
├── styles/
├── utils/
├── types/
├── App.tsx
├── main.tsx
└── index.html (in root)
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
    <title>React Native Web Vite App</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      }
      #root {
        height: 100vh;
        width: 100vw;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### Step 14: Create the Main Entry Point

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
if (!container) throw new Error('Root element not found')

// Create root and render the app
const root = createRoot(container)
AppRegistry.runApplication('App', {
  rootTag: container,
})
```

### Step 15: Create the Main App Component

Create `src/App.tsx`:

```typescript
import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import WelcomeScreen from './components/screens/WelcomeScreen'
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

### Step 16: Create Navigation Component

Create `src/components/navigation/Navigation.tsx`:

```typescript
import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import WelcomeScreen from '../screens/WelcomeScreen'
import AboutScreen from '../screens/AboutScreen'
import TabBar from './TabBar'

const Navigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home')

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <WelcomeScreen />
      case 'about':
        return <AboutScreen />
      default:
        return <WelcomeScreen />
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {renderScreen()}
      </View>
      <TabBar activeTab={activeTab} onTabPress={setActiveTab} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
})

export default Navigation
```

### Step 17: Create Tab Bar Component

Create `src/components/navigation/TabBar.tsx`:

```typescript
import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'

interface TabBarProps {
  activeTab: string
  onTabPress: (tab: string) => void
}

const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabPress }) => {
  const tabs = [
    { key: 'home', title: 'Home' },
    { key: 'about', title: 'About' },
  ]

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tab,
            activeTab === tab.key && styles.activeTab,
          ]}
          onPress={() => onTabPress(tab.key)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === tab.key && styles.activeTabText,
            ]}
          >
            {tab.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#e3f2fd',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#2196f3',
    fontWeight: 'bold',
  },
})

export default TabBar
```

## Running the Application

### Step 18: Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Step 19: Verify the Setup

Open your browser and navigate to `http://localhost:3000`. You should see your React Native Web application running.

## Building for Production

### Step 20: Build the Application

```bash
npm run build
```

### Step 21: Preview the Production Build

```bash
npm run preview
```

## Troubleshooting

### Common Issues and Solutions

1. **Module Resolution Issues**
   - Ensure `react-native` is aliased to `react-native-web` in vite.config.ts
   - Check that all React Native components are supported by react-native-web

2. **TypeScript Errors**
   - Make sure `@types/react-native` is installed
   - Add `"types": ["react-native"]` to tsconfig.json

3. **Build Errors**
   - Clear node_modules and package-lock.json, then reinstall
   - Check for conflicting dependencies

4. **Performance Issues**
   - Enable optimizeDeps in vite.config.ts
   - Use code splitting for larger applications

## Next Steps

### Enhanced Features to Add

1. **State Management**

   ```bash
   npm install @reduxjs/toolkit react-redux
   ```

2. **Styling Solutions**

   ```bash
   npm install styled-components
   # or
   npm install @emotion/react @emotion/styled
   ```

3. **Testing Setup**

   ```bash
   npm install -D @testing-library/react @testing-library/jest-dom vitest
   ```

4. **Linting and Formatting**

   ```bash
   npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier
   ```

5. **PWA Features**

   ```bash
   npm install -D vite-plugin-pwa
   ```

### Deployment Options

- **Vercel**: `npm install -D vercel`
- **Netlify**: Connect your git repository
- **GitHub Pages**: Use GitHub Actions
- **Azure Static Web Apps**: Use Azure DevOps or GitHub Actions

### Mobile Development

To extend this for mobile development:

```bash
# Install React Native CLI
npm install -g @react-native-community/cli

# For iOS (macOS only)
npx pod-install ios

# For Android
# Ensure Android Studio and SDK are installed
```

## Conclusion

You now have a fully functional React Native Web application built with Vite. This setup provides:

- Fast development with Vite's HMR
- TypeScript support
- React Native component compatibility
- Responsive web design
- Production-ready build pipeline

The application is ready for further development and can be extended with additional features as needed.
