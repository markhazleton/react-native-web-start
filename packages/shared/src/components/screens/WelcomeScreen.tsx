import React from 'react'
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Linking } from 'react-native'
import { BuildInfoService } from '../../services/buildInfoService'

const WelcomeScreen: React.FC = () => {
  const buildInfo = BuildInfoService.getBuildInfo()
  
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
        <Text style={styles.title}>Welcome to React Native Web</Text>
        <Text style={styles.subtitle}>{buildInfo.description}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📋 Project Information</Text>
        <Text style={styles.cardText}>Name: {buildInfo.name}</Text>
        <Text style={styles.cardText}>Version: {buildInfo.version}</Text>
        <Text style={styles.cardText}>Homepage: {buildInfo.homepage}</Text>
        <Text style={styles.cardText}>Build Environment: {buildInfo.environment}</Text>
        <Text style={styles.cardText}>Platform: {buildInfo.platform} ({buildInfo.arch})</Text>
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
        <Text style={styles.cardText}>• Cross-platform compatibility (Web, iOS, Android)</Text>
        <Text style={styles.cardText}>• Fast development with Vite HMR</Text>
        <Text style={styles.cardText}>• TypeScript support</Text>
        <Text style={styles.cardText}>• React Native Web components</Text>
        <Text style={styles.cardText}>• API integration example</Text>
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
        <Text style={styles.cardTitle}>💡 Platform Info</Text>
        <Text style={styles.cardText}>Runtime Platform: {Platform.OS}</Text>
        <Text style={styles.cardText}>Build Platform: {buildInfo.platform} ({buildInfo.arch})</Text>
        <Text style={styles.cardText}>Node Version: {buildInfo.nodeVersion}</Text>
        <Text style={styles.cardText}>Environment: {buildInfo.environment}</Text>
        {Platform.OS === 'web' && (
          <>
            <Text style={styles.cardText}>Viewport: {window.innerWidth}x{window.innerHeight}</Text>
            <Text style={styles.cardText}>Language: {navigator.language}</Text>
            <Text style={styles.cardText}>Online: {navigator.onLine ? 'Yes' : 'No'}</Text>
          </>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔧 Build Information</Text>
        <Text style={styles.cardText}>App Version: v{buildInfo.version}</Text>
        <Text style={styles.cardText}>Build Date: {buildInfo.buildDate}</Text>
        <Text style={styles.cardText}>Build Time: {buildInfo.buildTimeShort}</Text>
        <Text style={styles.cardText}>Git Commit: {buildInfo.commitShort}</Text>
        <Text style={styles.cardText}>Git Branch: {buildInfo.gitBranch}</Text>
        <Text style={styles.cardText}>Build Number: {buildInfo.buildNumber}</Text>
      </View>

      {Platform.OS === 'web' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🌐 Browser Information</Text>
          <Text style={styles.cardText}>{navigator.userAgent}</Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Made with ❤️ for cross-platform development
        </Text>
        <Text style={styles.versionText}>
          {buildInfo.name} v{buildInfo.version}
        </Text>
        <Text style={styles.versionText}>
          Built on {buildInfo.buildDateShort} at {buildInfo.buildTimeShort}
        </Text>
        {buildInfo.commit !== 'local' && (
          <Text style={styles.versionText}>
            Commit: {buildInfo.commitShort}
          </Text>
        )}
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
  versionText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
})

export default WelcomeScreen
