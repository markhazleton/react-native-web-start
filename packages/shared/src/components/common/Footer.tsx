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
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingVertical: 12,
    paddingHorizontal: 20,
    ...Platform.select({
      web: {
        boxShadow: '0 -4px 16px rgba(0,0,0,0.04), 0 -2px 8px rgba(0,0,0,0.02)',
        backdropFilter: 'blur(8px)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 4,
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
        alignItems: 'flex-start',
        marginTop: 4,
      },
      web: {
        alignItems: 'flex-end',
      },
    }),
  },
  appText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 3,
    letterSpacing: 0.2,
  },
  versionText: {
    fontSize: 11,
    color: '#64748b',
    fontFamily: Platform.OS === 'web' ? 'ui-monospace, monospace' : 'Courier',
    fontWeight: '500',
  },
  buildText: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 3,
    fontWeight: '500',
  },
  envText: {
    fontSize: 11,
    color: '#64748b',
    fontFamily: Platform.OS === 'web' ? 'ui-monospace, monospace' : 'Courier',
    fontWeight: '500',
  },
})

export default Footer
