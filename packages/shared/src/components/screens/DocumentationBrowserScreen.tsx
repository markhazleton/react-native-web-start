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
    backgroundColor: '#fff',
  },
  header: {
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  searchContainer: {
    marginTop: 8,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  listContent: {
    flexGrow: 1,
  },
  fileItem: {
    padding: 16,
    backgroundColor: '#fff',
  },
  fileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fileIconText: {
    fontSize: 20,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  fileDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  fileDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 52,
  },
  fileSize: {
    fontSize: 12,
    color: '#999',
  },
  fileDate: {
    fontSize: 12,
    color: '#999',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
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
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
})

export default DocumentationBrowserScreen
