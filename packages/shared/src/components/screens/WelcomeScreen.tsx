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
    backgroundColor: 'transparent',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
    maxWidth: 1200,
    ...Platform.select({
      web: {
        alignSelf: 'center',
        width: '100%',
      },
    }),
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 600,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    // Modern card design with enhanced shadows
    ...Platform.select({
      web: {
        boxShadow: '0 10px 25px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.03)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
      },
    }),
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
    letterSpacing: -0.3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 24,
    marginBottom: 8,
    fontWeight: '400',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  footerText: {
    fontSize: 18,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '600',
  },
  linkButton: {
    backgroundColor: '#f8fafc',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  linkText: {
    color: '#3b82f6',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  versionText: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 4,
  },
})

export default WelcomeScreen
