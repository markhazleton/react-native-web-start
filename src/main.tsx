import { AppRegistry, Platform } from 'react-native'
import { createRoot } from 'react-dom/client'
import App from '@shared/App'
import './styles/main.scss'

// Get the root element
const container = document.getElementById('root')
if (!container) {
  throw new Error('Root element not found')
}

if (Platform.OS === 'web') {
  // Use React 18's createRoot for better event handling on web
  const root = createRoot(container)
  root.render(<App />)
} else {
  // Register the app for React Native
  AppRegistry.registerComponent('App', () => App)
  
  // Use AppRegistry.runApplication for native platforms
  AppRegistry.runApplication('App', {
    rootTag: container,
  })
}
