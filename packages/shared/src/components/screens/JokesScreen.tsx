import React, { useState, useEffect } from 'react'
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

const JokesScreen: React.FC = () => {
  const [joke, setJoke] = useState<JokeResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRandomJoke = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const jokeData = await JokeApiService.getRandomJoke()
      setJoke(jokeData)
    } catch (err) {
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
  }

  const fetchProgrammingJoke = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const jokeData = await JokeApiService.getProgrammingJoke()
      setJoke(jokeData)
    } catch (err) {
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
  }

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
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]} 
          onPress={fetchRandomJoke}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? 'Loading...' : '🎲 Random Joke'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={fetchProgrammingJoke}
          disabled={loading}
        >
          <Text style={styles.secondaryButtonText}>
            {loading ? 'Loading...' : '💻 Programming Joke'}
          </Text>
        </TouchableOpacity>
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
            <TouchableOpacity style={styles.retryButton} onPress={fetchRandomJoke}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && !error && joke && (
          <View style={styles.card}>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primaryButton: {
    backgroundColor: '#2196f3',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#2196f3',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#2196f3',
    fontSize: 16,
    fontWeight: '600',
  },
  jokeContainer: {
    minHeight: 200,
    marginBottom: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  errorText: {
    fontSize: 16,
    color: '#c62828',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#f44336',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
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
  categoryText: {
    fontSize: 12,
    color: '#2196f3',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  jokeText: {
    fontSize: 18,
    color: '#333',
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  setupText: {
    fontSize: 18,
    color: '#333',
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '500',
  },
  deliveryText: {
    fontSize: 18,
    color: '#2196f3',
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
    fontWeight: '600',
  },
  jokeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  jokeId: {
    fontSize: 12,
    color: '#999',
  },
  safeIndicator: {
    fontSize: 12,
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1565c0',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1976d2',
    lineHeight: 20,
  },
})

export default JokesScreen
