import React from 'react'
import { createRoot } from 'react-dom/client'
import { AppRegistry } from 'react-native'
import App from '../packages/shared/src/App'

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
