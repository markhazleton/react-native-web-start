import React from 'react'
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native'

const WelcomeScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to React Native Web</Text>
        <Text style={styles.subtitle}>Multi-platform development with Vite</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🚀 Features</Text>
        <Text style={styles.cardText}>• Cross-platform compatibility (Web, iOS, Android)</Text>
        <Text style={styles.cardText}>• Fast development with Vite HMR</Text>
        <Text style={styles.cardText}>• TypeScript support</Text>
        <Text style={styles.cardText}>• React Native Web components</Text>
        <Text style={styles.cardText}>• API integration example</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>💡 Platform Info</Text>
        <Text style={styles.cardText}>Current Platform: {Platform.OS}</Text>
        <Text style={styles.cardText}>Version: {Platform.Version?.toString() || 'Unknown'}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Built with ❤️ using React Native Web + Vite
        </Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 4,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
})

export default WelcomeScreen
