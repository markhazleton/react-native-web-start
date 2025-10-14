import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native'

interface TabBarProps {
  activeTab: string
  onTabPress: (tab: string) => void
}

const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabPress }) => {
  const tabs = [
    { key: 'home', title: 'Home' },
    { key: 'jokes', title: 'Jokes' },
    { key: 'docs', title: 'Docs' },
  ]

  return (
    <View style={styles.container}>
      {tabs.map((tabItem) => (
        <TouchableOpacity
          key={tabItem.key}
          style={[
            styles.tab,
            activeTab === tabItem.key && styles.activeTab,
          ]}
          onPress={() => onTabPress(tabItem.key)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === tabItem.key && styles.activeTabText,
            ]}
          >
            {tabItem.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingVertical: 4,
    paddingHorizontal: 8,
    // Modern elevated design
    ...Platform.select({
      web: {
        boxShadow: '0 4px 16px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)',
        backdropFilter: 'blur(8px)',
        // Note: React Native Web doesn't support CSS gradients in StyleSheet
        // backgroundColor: '#ffffff', // Fallback for gradient
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
      },
    }),
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
    borderRadius: 12,
    position: 'relative',
    // Smooth transition preparation
    ...Platform.select({
      web: {
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
      },
    }),
  },
  activeTab: {
    backgroundColor: '#3b82f6',
    // Modern gradient effect via backgroundImage for web
    ...Platform.select({
      web: {
        // backgroundColor: '#3b82f6', // Solid fallback
        transform: 'scale(1.02)',
      },
    }),
    // Enhanced shadow for active tab
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  tabText: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '600',
    letterSpacing: 0.5,
    // Better typography
    ...Platform.select({
      web: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      },
    }),
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '700',
    // Text shadow for better contrast
    ...Platform.select({
      web: {
        textShadow: '0 1px 2px rgba(0,0,0,0.1)',
      },
    }),
  },
})

export default TabBar
