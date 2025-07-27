import React from 'react'
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native'
import { BuildInfoService } from '../../services/buildInfoService'

const WelcomeScreen: React.FC = () => {
  const buildInfo = BuildInfoService.getBuildInfo()
  
  // Get runtime information
  const getRuntimeInfo = () => {
    if (Platform.OS === 'web') {
      return {
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
        viewport: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'Unknown',
        language: typeof navigator !== 'undefined' ? navigator.language : 'Unknown',
        cookieEnabled: typeof navigator !== 'undefined' ? navigator.cookieEnabled : false,
        onLine: typeof navigator !== 'undefined' ? navigator.onLine : false,
      }
    }
    return null
  }

  const runtimeInfo = getRuntimeInfo()
  
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
        <Text style={styles.cardText}>Runtime Platform: {Platform.OS} {Platform.Version?.toString() ? `(v${Platform.Version})` : ''}</Text>
        <Text style={styles.cardText}>Build Platform: {BuildInfoService.getPlatformString()}</Text>
        <Text style={styles.cardText}>Node Version: {BuildInfoService.getNodeVersionString()}</Text>
        <Text style={styles.cardText}>Environment: {BuildInfoService.getEnvironmentString()}</Text>
        {runtimeInfo && (
          <>
            <Text style={styles.cardText}>Viewport: {runtimeInfo.viewport}</Text>
            <Text style={styles.cardText}>Language: {runtimeInfo.language}</Text>
            <Text style={styles.cardText}>Online: {runtimeInfo.onLine ? 'Yes' : 'No'}</Text>
          </>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔧 Build Information</Text>
        <Text style={styles.cardText}>App Version: {BuildInfoService.getVersionString()}</Text>
        <Text style={styles.cardText}>Build Date: {BuildInfoService.getBuildDateString()}</Text>
        <Text style={styles.cardText}>Build Time: {BuildInfoService.getBuildTimeShort()}</Text>
        <Text style={styles.cardText}>Git Commit: {BuildInfoService.getCommitString()}</Text>
        <Text style={styles.cardText}>Git Branch: {BuildInfoService.getGitBranchString()}</Text>
        <Text style={styles.cardText}>Build Number: {BuildInfoService.getBuildNumberString()}</Text>
        {buildInfo.gitTag && buildInfo.gitTag !== '""' && (
          <Text style={styles.cardText}>Git Tag: {buildInfo.gitTag}</Text>
        )}
      </View>

      {runtimeInfo && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🌐 Browser Information</Text>
          <Text style={[styles.cardText, styles.monospace]} numberOfLines={2}>
            {runtimeInfo.userAgent}
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Built with ❤️ using React Native Web + Vite
        </Text>
        <Text style={styles.versionText}>
          {BuildInfoService.getComprehensiveBuildString()}
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
  monospace: {
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier New',
    fontSize: 12,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 12,
    color: '#ccc',
    textAlign: 'center',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier New',
  },
})

export default WelcomeScreen
