import React from 'react'
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity, Platform } from 'react-native'

const AboutScreen: React.FC = () => {
  const openLink = async (url: string) => {
    if (Platform.OS === 'web') {
      window.open(url, '_blank')
    } else {
      const supported = await Linking.canOpenURL(url)
      if (supported) {
        await Linking.openURL(url)
      }
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>About This App</Text>
        <Text style={styles.subtitle}>React Native Web + Vite Starter</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🛠️ Technology Stack</Text>
        <Text style={styles.cardText}>• React Native Web - Cross-platform components</Text>
        <Text style={styles.cardText}>• Vite - Fast build tool and dev server</Text>
        <Text style={styles.cardText}>• TypeScript - Type safety and better DX</Text>
        <Text style={styles.cardText}>• JokeAPI - External API integration</Text>
        <Text style={styles.cardText}>• Platform-specific optimizations</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📱 Platform Support</Text>
        <Text style={styles.cardText}>✅ Web (Progressive Web App ready)</Text>
        <Text style={styles.cardText}>✅ iOS (via React Native CLI)</Text>
        <Text style={styles.cardText}>✅ Android (via React Native CLI)</Text>
        <Text style={styles.cardText}>✅ Responsive design for all screen sizes</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🚀 Features</Text>
        <Text style={styles.cardText}>• Hot Module Replacement (HMR)</Text>
        <Text style={styles.cardText}>• TypeScript type checking</Text>
        <Text style={styles.cardText}>• Cross-platform navigation</Text>
        <Text style={styles.cardText}>• HTTP API integration</Text>
        <Text style={styles.cardText}>• Platform-specific styling</Text>
        <Text style={styles.cardText}>• Error handling and loading states</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📚 Resources</Text>
        
        <TouchableOpacity 
          style={styles.linkButton}
          onPress={() => openLink('https://necolas.github.io/react-native-web/')}
        >
          <Text style={styles.linkText}>React Native Web Documentation</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.linkButton}
          onPress={() => openLink('https://vitejs.dev/')}
        >
          <Text style={styles.linkText}>Vite Documentation</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.linkButton}
          onPress={() => openLink('https://reactnative.dev/')}
        >
          <Text style={styles.linkText}>React Native Documentation</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.linkButton}
          onPress={() => openLink('https://jokeapi.dev/')}
        >
          <Text style={styles.linkText}>JokeAPI Documentation</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>💡 Development Info</Text>
        <Text style={styles.cardText}>Platform OS: {Platform.OS}</Text>
        <Text style={styles.cardText}>Platform Version: {Platform.Version?.toString() || 'Unknown'}</Text>
        <Text style={styles.cardText}>Environment: {process.env.NODE_ENV || 'development'}</Text>
        <Text style={styles.cardText}>User Agent: {Platform.OS === 'web' ? 'Web Browser' : 'Mobile App'}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Made with ❤️ for cross-platform development
        </Text>
        <Text style={styles.versionText}>Version 1.0.0</Text>
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
  linkButton: {
    backgroundColor: '#e3f2fd',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#bbdefb',
  },
  linkText: {
    color: '#1976d2',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: Platform.OS === 'web' ? 'underline' : 'none',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
})

export default AboutScreen
