import React, { useState, useEffect, useCallback } from 'react'
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Platform,
  Alert
} from 'react-native'
import { JokeApiService } from '../../services/jokeApi'
import { JokeResponse } from '../../types/api'

// Web-specific button component
const WebButton: React.FC<{
  onPress: () => void
  disabled?: boolean
  style: any
  children: React.ReactNode
}> = ({ onPress, disabled = false, style, children }) => {
  const handleClick = useCallback((e: any) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      onPress()
    }
  }, [onPress, disabled])

  if (Platform.OS === 'web') {
    return (
      <div
        onClick={handleClick}
        style={{
          ...style,
          border: 'none',
          outline: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          fontFamily: 'inherit',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
        }}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e: any) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick(e)
          }
        }}
      >
        {children}
      </div>
    )
  }
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} style={style}>
      {children}
    </TouchableOpacity>
  )
}

const JokesScreen: React.FC = () => {
  const [joke, setJoke] = useState<JokeResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clickCount, setClickCount] = useState(0) // Debug counter

  const fetchRandomJoke = useCallback(async () => {
    console.warn('🔍 fetchRandomJoke called')
    setClickCount(prev => prev + 1) // Increment debug counter
    setLoading(true)
    setError(null)
    
    try {
      console.warn('🌐 Calling JokeApiService.getRandomJoke()')
      const jokeData = await JokeApiService.getRandomJoke()
      console.warn('✅ Joke data received:', jokeData)
      setJoke(jokeData)
    } catch (err) {
      console.error('❌ Error in fetchRandomJoke:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch joke'
      setError(errorMessage)
      
      // Show platform-appropriate error message
      if (Platform.OS === 'web') {
        console.error('Error fetching joke:', errorMessage)
      } else {
        Alert.alert('Error', errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchProgrammingJoke = useCallback(async () => {
    console.warn('🔍 fetchProgrammingJoke called')
    setClickCount(prev => prev + 1) // Increment debug counter
    setLoading(true)
    setError(null)
    
    try {
      console.warn('🌐 Calling JokeApiService.getProgrammingJoke()')
      const jokeData = await JokeApiService.getProgrammingJoke()
      console.warn('✅ Programming joke data received:', jokeData)
      setJoke(jokeData)
    } catch (err) {
      console.error('❌ Error in fetchProgrammingJoke:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch programming joke'
      setError(errorMessage)
      
      if (Platform.OS === 'web') {
        console.error('Error fetching programming joke:', errorMessage)
      } else {
        Alert.alert('Error', errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRandomJoke()
  }, [])

  const renderJoke = () => {
    if (!joke) return null

    if (joke.type === 'single') {
      return (
        <Text style={styles.jokeText}>{joke.joke}</Text>
      )
    } else {
      return (
        <View>
          <Text style={styles.setupText}>{joke.setup}</Text>
          <Text style={styles.deliveryText}>{joke.delivery}</Text>
        </View>
      )
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>😂 Joke Generator</Text>
        <Text style={styles.subtitle}>Powered by JokeAPI</Text>
        <Text style={styles.subtitle}>Debug: Clicks = {clickCount}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <WebButton 
          style={[styles.button, styles.primaryButton]} 
          onPress={fetchRandomJoke}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? 'Loading...' : '🎲 Random Joke'}
          </Text>
        </WebButton>

        <WebButton 
          style={[styles.button, styles.secondaryButton]} 
          onPress={fetchProgrammingJoke}
          disabled={loading}
        >
          <Text style={styles.secondaryButtonText}>
            {loading ? 'Loading...' : '💻 Programming Joke'}
          </Text>
        </WebButton>
      </View>

      <View style={styles.jokeContainer}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2196f3" />
            <Text style={styles.loadingText}>Fetching a great joke...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>❌ {error}</Text>
            <WebButton style={styles.retryButton} onPress={fetchRandomJoke}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </WebButton>
          </View>
        )}

        {!loading && !error && joke && (
          <View style={styles.card} key={joke.id || Math.random()}>
            <Text style={styles.categoryText}>Category: {joke.category}</Text>
            {renderJoke()}
            <View style={styles.jokeFooter}>
              <Text style={styles.jokeId}>Joke ID: {joke.id}</Text>
              <Text style={styles.safeIndicator}>
                {joke.safe ? '✅ Safe' : '⚠️ Not Safe'}
              </Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>ℹ️ About JokeAPI</Text>
        <Text style={styles.infoText}>
          This demo uses the JokeAPI (https://jokeapi.dev) to fetch jokes.
          It demonstrates API integration in a cross-platform React Native Web application.
        </Text>
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
    maxWidth: 800,
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
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    ...Platform.select({
      web: {
        transition: 'all 0.2s ease-in-out',
      },
    }),
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
      },
      default: {
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
      },
    }),
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      },
    }),
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  secondaryButtonText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  jokeContainer: {
    minHeight: 240,
    marginBottom: 24,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    ...Platform.select({
      web: {
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.06)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
      },
    }),
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fef2f2',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
      },
    }),
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    ...Platform.select({
      web: {
        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
      },
    }),
  },
  categoryText: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 16,
    letterSpacing: 1,
    textAlign: 'center',
  },
  jokeText: {
    fontSize: 20,
    color: '#1e293b',
    lineHeight: 32,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  setupText: {
    fontSize: 20,
    color: '#1e293b',
    lineHeight: 32,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  deliveryText: {
    fontSize: 20,
    color: '#3b82f6',
    lineHeight: 32,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
    fontWeight: '700',
  },
  jokeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 16,
  },
  jokeId: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  safeIndicator: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  infoCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.1)',
      },
    }),
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 22,
    fontWeight: '500',
  },
})

export default JokesScreen
