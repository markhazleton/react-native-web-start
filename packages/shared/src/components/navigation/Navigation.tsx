import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import WelcomeScreen from '../screens/WelcomeScreen'
import JokesScreen from '../screens/JokesScreen'
import DocumentationScreen from '../screens/DocumentationScreen'
import TabBar from './TabBar'

const Navigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home')

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <WelcomeScreen />
      case 'jokes':
        return <JokesScreen />
      case 'docs':
        return <DocumentationScreen />
      default:
        return <WelcomeScreen />
    }
  }

  return (
    <View style={styles.container}>
      <TabBar activeTab={activeTab} onTabPress={setActiveTab} />
      <View style={styles.content}>
        {renderScreen()}
      </View>
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
