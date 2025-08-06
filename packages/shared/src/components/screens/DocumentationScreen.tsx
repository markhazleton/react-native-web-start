import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { DocumentationFile } from '../../types/documentation'
import DocumentationBrowserScreen from './DocumentationBrowserScreen'
import DocumentationReaderScreen from './DocumentationReaderScreen'

const DocumentationScreen: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<DocumentationFile | null>(null)

  const handleFileSelect = (file: DocumentationFile) => {
    setSelectedFile(file)
  }

  const handleBackToBrowser = () => {
    setSelectedFile(null)
  }

  return (
    <View style={styles.container}>
      {selectedFile ? (
        <DocumentationReaderScreen 
          file={selectedFile}
          onBack={handleBackToBrowser}
        />
      ) : (
        <DocumentationBrowserScreen 
          onFileSelect={handleFileSelect}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
})

export default DocumentationScreen
