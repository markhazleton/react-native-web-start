import { AppRegistry } from 'react-native'
import App from '@shared/App'
import './styles/main.scss'

// Register the app for React Native Web
AppRegistry.registerComponent('App', () => App)

// Get the root element
const container = document.getElementById('root')
if (!container) {
  throw new Error('Root element not found')
}

// Use AppRegistry.runApplication for React Native Web compatibility
// This handles the React root creation internally
AppRegistry.runApplication('App', {
  rootTag: container,
})
