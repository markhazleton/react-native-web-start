import React, { useState, useEffect } from 'react'
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Dimensions
} from 'react-native'
import { DocumentationFile, DocumentationContent } from '../../types/documentation'
import { DocumentationService } from '../../services/documentationService'
import MarkdownRenderer from '../common/MarkdownRenderer'
import HtmlMarkdownRenderer from '../common/HtmlMarkdownRenderer'

interface DocumentationReaderScreenProps {
  file: DocumentationFile
  onBack: () => void
}

const DocumentationReaderScreen: React.FC<DocumentationReaderScreenProps> = ({ file, onBack }) => {
  const [content, setContent] = useState<DocumentationContent | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [useHtmlRenderer, setUseHtmlRenderer] = useState<boolean>(false) // Default to basic renderer
  const { width } = Dimensions.get('window')

  useEffect(() => {
    loadDocumentationContent()
  }, [file])

  const loadDocumentationContent = async () => {
    try {
      setLoading(true)
      setError(null)
      const documentationContent = await DocumentationService.getDocumentationContent(file.name)
      setContent(documentationContent)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load documentation content'
      setError(errorMessage)
      if (Platform.OS === 'web') {
        Alert.alert('Error', errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  const renderError = () => (
    <View style={styles.errorState}>
      <Text style={styles.errorStateIcon}>⚠️</Text>
      <Text style={styles.errorStateTitle}>Failed to Load Content</Text>
      <Text style={styles.errorStateText}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={loadDocumentationContent}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  )

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#2196f3" />
      <Text style={styles.loadingText}>Loading {file.title}...</Text>
    </View>
  )

  const renderContent = () => {
    if (!content) return null

    // Try HTML renderer first, fallback to basic renderer if it fails
    try {
      if (useHtmlRenderer) {
        return (
          <HtmlMarkdownRenderer 
            content={content.content}
            style={styles.markdownContainer}
            contentWidth={width - 32}
          />
        )
      } else {
        return (
          <MarkdownRenderer 
            content={content.content}
            style={styles.markdownContainer}
          />
        )
      }
    } catch (error) {
      console.warn('Renderer failed, using fallback:', error)
      // Switch to basic renderer if HTML renderer fails
      if (useHtmlRenderer) {
        setUseHtmlRenderer(false)
        return (
          <MarkdownRenderer 
            content={content.content}
            style={styles.markdownContainer}
          />
        )
      }
      // If both fail, show error
      return (
        <View style={styles.errorState}>
          <Text style={styles.errorStateIcon}>⚠️</Text>
          <Text style={styles.errorStateTitle}>Rendering Error</Text>
          <Text style={styles.errorStateText}>Failed to render markdown content</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => {
              setUseHtmlRenderer(!useHtmlRenderer)
            }}
          >
            <Text style={styles.retryButtonText}>Try Different Renderer</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {file.title}
          </Text>
          <Text style={styles.fileName} numberOfLines={1}>
            {file.name}
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.rendererToggle} 
          onPress={() => setUseHtmlRenderer(!useHtmlRenderer)}
          activeOpacity={0.7}
        >
          <Text style={styles.rendererToggleText}>
            {useHtmlRenderer ? 'HTML' : 'Basic'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {loading && renderLoading()}
        {error && renderError()}
        {!loading && !error && renderContent()}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    overflow: 'hidden', // Prevent content overflow
    ...Platform.select({
      web: {
        // Ensure proper web containment
        position: 'relative',
        zIndex: 1,
        isolation: 'isolate',
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      },
    }),
  },
  backButton: {
    paddingVertical: 4,
    paddingRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2196f3',
    fontWeight: '500',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  fileName: {
    fontSize: 12,
    color: '#666',
  },
  content: {
    flex: 1,
    overflow: 'hidden', // Prevent content from breaking out
    ...Platform.select({
      web: {
        position: 'relative',
        zIndex: 1,
      },
    }),
  },
  markdownContainer: {
    flex: 1,
    overflow: 'hidden', // Additional containment for markdown
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#d32f2f',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  rendererToggle: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  rendererToggleText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
})

export default DocumentationReaderScreen
