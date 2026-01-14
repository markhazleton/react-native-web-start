import { AppRegistry } from 'react-native'
import App from './App'

// Unregister any existing service workers that might be blocking API calls
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      console.log('Unregistering service worker:', registration)
      registration.unregister()
    })
  })
}

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
