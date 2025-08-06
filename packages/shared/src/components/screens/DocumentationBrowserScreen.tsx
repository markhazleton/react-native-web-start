import React, { useState, useEffect } from 'react'
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native'
import { DocumentationFile } from '../../types/documentation'
import { DocumentationService } from '../../services/documentationService'

interface DocumentationBrowserScreenProps {
  onFileSelect: (file: DocumentationFile) => void
}

const DocumentationBrowserScreen: React.FC<DocumentationBrowserScreenProps> = ({ onFileSelect }) => {
  const [files, setFiles] = useState<DocumentationFile[]>([])
  const [filteredFiles, setFilteredFiles] = useState<DocumentationFile[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDocumentationFiles()
  }, [])

  useEffect(() => {
    filterFiles()
  }, [searchQuery, files])

  const loadDocumentationFiles = async () => {
    try {
      setLoading(true)
      setError(null)
      const documentationFiles = await DocumentationService.getDocumentationFiles()
      setFiles(documentationFiles)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load documentation files'
      setError(errorMessage)
      if (Platform.OS === 'web') {
        Alert.alert('Error', errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  const filterFiles = () => {
    if (!searchQuery.trim()) {
      setFilteredFiles(files)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = files.filter(file => 
        file.name.toLowerCase().includes(query) ||
        file.description.toLowerCase().includes(query)
      )
      setFilteredFiles(filtered)
    }
  }

  const handleFilePress = (file: DocumentationFile) => {
    onFileSelect(file)
  }

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'Unknown size'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
    return `${Math.round(bytes / (1024 * 1024))} MB`
  }

  const formatDate = (date?: Date): string => {
    if (!date) return 'Unknown'
    try {
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return 'Unknown'
    }
  }

  const renderFileItem = ({ item }: { item: DocumentationFile }) => (
    <TouchableOpacity
      style={styles.fileItem}
      onPress={() => handleFilePress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.fileHeader}>
        <View style={styles.fileIcon}>
          <Text style={styles.fileIconText}>📄</Text>
        </View>
        <View style={styles.fileInfo}>
          <Text style={styles.fileName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.fileDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </View>
      <View style={styles.fileDetails}>
        <Text style={styles.fileSize}>
          {formatFileSize(item.size)}
        </Text>
        <Text style={styles.fileDate}>
          {formatDate(item.lastModified)}
        </Text>
      </View>
    </TouchableOpacity>
  )

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>📚</Text>
      <Text style={styles.emptyStateTitle}>
        {searchQuery ? 'No files found' : 'No documentation available'}
      </Text>
      <Text style={styles.emptyStateText}>
        {searchQuery 
          ? `No files match "${searchQuery}". Try a different search term.`
          : 'Documentation files will appear here when available.'
        }
      </Text>
    </View>
  )

  const renderError = () => (
    <View style={styles.errorState}>
      <Text style={styles.errorStateIcon}>⚠️</Text>
      <Text style={styles.errorStateTitle}>Failed to Load Documentation</Text>
      <Text style={styles.errorStateText}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={loadDocumentationFiles}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196f3" />
        <Text style={styles.loadingText}>Loading documentation...</Text>
      </View>
    )
  }

  if (error) {
    return renderError()
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Documentation</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search documentation..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
            placeholderTextColor="#999"
          />
        </View>
      </View>
      
      <FlatList
        data={filteredFiles}
        keyExtractor={(item) => item.path}
        renderItem={renderFileItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={true}
        ListEmptyComponent={renderEmptyState}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''} available
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#ffffff',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 16px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.02)',
      },
    }),
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  searchContainer: {
    marginTop: 8,
  },
  searchInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f8fafc',
    fontWeight: '500',
    color: '#1e293b',
  },
  listContent: {
    flexGrow: 1,
    paddingTop: 8,
  },
  fileItem: {
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 6,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.04), 0 2px 6px rgba(0,0,0,0.02)',
        transition: 'all 0.2s ease-in-out',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
      },
    }),
  },
  fileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  fileIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#e0f2fe',
  },
  fileIconText: {
    fontSize: 24,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  fileDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 22,
    fontWeight: '500',
  },
  fileDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 64,
    marginTop: 8,
  },
  fileSize: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  fileDate: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  separator: {
    height: 0, // Remove separator for modern card-based design
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  errorStateIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  errorStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#dc2626',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorStateText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    maxWidth: 300,
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
      },
    }),
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 48,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#64748b',
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },
  footerText: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    fontWeight: '600',
  },
})

export default DocumentationBrowserScreen
