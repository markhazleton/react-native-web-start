import { AppRegistry } from 'react-native'
import App from './App'

// Register the app for React Native Web
AppRegistry.registerComponent('App', () => App)

// Get the root element
const container = document.getElementById('root')
if (!container) {
  throw new Error('Root element not found')
}

// Start the app
AppRegistry.runApplication('App', {
  rootTag: container,
})
