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
    backgroundColor: '#f8fafc',
  },
})

export default App
