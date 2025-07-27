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
import ImprovedMarkdownRenderer from '../common/ImprovedMarkdownRenderer'
import HtmlMarkdownRenderer from '../common/HtmlMarkdownRenderer'

interface DocumentationReaderScreenProps {
  file: DocumentationFile
  onBack: () => void
}

type RendererType = 'original' | 'improved' | 'html'

const DocumentationReaderScreenEnhanced: React.FC<DocumentationReaderScreenProps> = ({ file, onBack }) => {
  const [content, setContent] = useState<DocumentationContent | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [rendererType, setRendererType] = useState<RendererType>('improved')
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

  const renderRendererSelector = () => (
    <View style={styles.rendererSelector}>
      <Text style={styles.selectorLabel}>Renderer:</Text>
      <TouchableOpacity
        style={[styles.selectorButton, rendererType === 'original' && styles.selectorButtonActive]}
        onPress={() => setRendererType('original')}
      >
        <Text style={[styles.selectorButtonText, rendererType === 'original' && styles.selectorButtonTextActive]}>
          Original
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.selectorButton, rendererType === 'improved' && styles.selectorButtonActive]}
        onPress={() => setRendererType('improved')}
      >
        <Text style={[styles.selectorButtonText, rendererType === 'improved' && styles.selectorButtonTextActive]}>
          Improved
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.selectorButton, rendererType === 'html' && styles.selectorButtonActive]}
        onPress={() => setRendererType('html')}
      >
        <Text style={[styles.selectorButtonText, rendererType === 'html' && styles.selectorButtonTextActive]}>
          HTML
        </Text>
      </TouchableOpacity>
    </View>
  )

  const renderContent = () => {
    if (!content) return null

    switch (rendererType) {
      case 'original':
        return (
          <MarkdownRenderer 
            content={content.content}
            style={styles.markdownContainer}
          />
        )
      case 'improved':
        return (
          <ImprovedMarkdownRenderer 
            content={content.content}
            style={styles.markdownContainer}
          />
        )
      case 'html':
        return (
          <HtmlMarkdownRenderer 
            content={content.content}
            style={styles.markdownContainer}
            contentWidth={width - 32}
          />
        )
      default:
        return null
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
      </View>

      {!loading && !error && renderRendererSelector()}

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
  rendererSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  selectorLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginRight: 12,
  },
  selectorButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dee2e6',
    marginRight: 8,
  },
  selectorButtonActive: {
    backgroundColor: '#2196f3',
    borderColor: '#2196f3',
  },
  selectorButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  selectorButtonTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  markdownContainer: {
    flex: 1,
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
})

export default DocumentationReaderScreenEnhanced
