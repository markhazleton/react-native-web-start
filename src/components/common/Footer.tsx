import React from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native'
import { BuildInfoService } from '../../services/buildInfoService'

const Footer: React.FC = () => {
  const buildInfo = BuildInfoService.getBuildInfo()

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Text style={styles.appText}>React Native Web Starter</Text>
          <Text style={styles.versionText}>
            {BuildInfoService.getVersionString()} • {BuildInfoService.getCommitString()}
          </Text>
        </View>
        <View style={styles.rightSection}>
          <Text style={styles.buildText}>Built: {buildInfo.buildDate}</Text>
          <Text style={styles.envText}>Environment: {buildInfo.environment}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingVertical: 8,
    paddingHorizontal: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 -1px 3px rgba(0,0,0,0.1)',
      },
    }),
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 1200,
    ...Platform.select({
      web: {
        marginHorizontal: 'auto',
      },
    }),
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    flex: 1,
    ...Platform.select({
      default: {
        // On mobile, stack vertically
        alignItems: 'flex-start',
        marginTop: 4,
      },
      web: {
        // On web, keep right aligned
        alignItems: 'flex-end',
      },
    }),
  },
  appText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 2,
  },
  versionText: {
    fontSize: 10,
    color: '#6c757d',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  buildText: {
    fontSize: 10,
    color: '#6c757d',
    marginBottom: 2,
  },
  envText: {
    fontSize: 10,
    color: '#6c757d',
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
})

export default Footer
