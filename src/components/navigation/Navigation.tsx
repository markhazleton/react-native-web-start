import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import WelcomeScreen from '../screens/WelcomeScreen'
import AboutScreen from '../screens/AboutScreen'
import JokesScreen from '../screens/JokesScreen'
import DocumentationScreen from '../screens/DocumentationScreen'
import TabBar from './TabBar'
import Footer from '../common/Footer'

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
      <Footer />
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
