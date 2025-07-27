import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Platform, Linking, Alert, TouchableOpacity, Text } from 'react-native'
import Markdown from 'react-native-markdown-display'

interface ImprovedMarkdownRendererProps {
  content: string
  style?: any
}

const ImprovedMarkdownRenderer: React.FC<ImprovedMarkdownRendererProps> = ({ content, style }) => {
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  // Reset error state when content changes
  useEffect(() => {
    setHasError(false)
    setErrorMessage('')
  }, [content])

  const handleLinkPress = (url: string): boolean => {
    const openLink = async () => {
      try {
        if (Platform.OS === 'web') {
          window.open(url, '_blank')
        } else {
          const supported = await Linking.canOpenURL(url)
          if (supported) {
            await Linking.openURL(url)
          } else {
            Alert.alert('Error', 'Cannot open this URL')
          }
        }
      } catch (error) {
        console.error('Error opening link:', error)
        Alert.alert('Error', 'Failed to open link')
      }
    }
    
    openLink()
    return false // Prevent default behavior
  }

  // Fallback simple markdown renderer
  const SimpleFallbackRenderer: React.FC<{ content: string }> = ({ content }) => {
    const processMarkdownContent = (markdown: string) => {
      const lines = markdown.split('\n')
      const elements: JSX.Element[] = []

      lines.forEach((line, index) => {
        const key = `fallback-${index}`
        
        // Headers
        if (line.startsWith('# ')) {
          elements.push(
            <Text key={key} style={fallbackStyles.h1}>
              {line.substring(2)}
            </Text>
          )
        } else if (line.startsWith('## ')) {
          elements.push(
            <Text key={key} style={fallbackStyles.h2}>
              {line.substring(3)}
            </Text>
          )
        } else if (line.startsWith('### ')) {
          elements.push(
            <Text key={key} style={fallbackStyles.h3}>
              {line.substring(4)}
            </Text>
          )
        } 
        // Code blocks
        else if (line.startsWith('```')) {
          elements.push(
            <View key={key} style={fallbackStyles.codeBlock}>
              <Text style={fallbackStyles.codeText}>
                {line.substring(3) || 'Code Block'}
              </Text>
            </View>
          )
        }
        // Bullet points
        else if (line.startsWith('- ') || line.startsWith('* ')) {
          elements.push(
            <View key={key} style={fallbackStyles.listItem}>
              <Text style={fallbackStyles.bullet}>•</Text>
              <Text style={fallbackStyles.listText}>
                {line.substring(2)}
              </Text>
            </View>
          )
        }
        // Block quotes
        else if (line.startsWith('> ')) {
          elements.push(
            <View key={key} style={fallbackStyles.blockquote}>
              <Text style={fallbackStyles.blockquoteText}>
                {line.substring(2)}
              </Text>
            </View>
          )
        }
        // Empty lines
        else if (line.trim() === '') {
          elements.push(
            <View key={key} style={fallbackStyles.spacing} />
          )
        }
        // Regular paragraphs
        else if (line.trim()) {
          elements.push(
            <Text key={key} style={fallbackStyles.paragraph}>
              {line}
            </Text>
          )
        }
      })

      return elements
    }

    return (
      <View style={fallbackStyles.container}>
        {processMarkdownContent(content)}
      </View>
    )
  }

  if (hasError) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.errorHeader}>
          <Text style={styles.errorTitle}>Using Fallback Renderer</Text>
          <Text style={styles.errorSubtitle}>Complex markdown detected</Text>
        </View>
        <SimpleFallbackRenderer content={content} />
      </View>
    )
  }

  // Enhanced markdown styles with safer configuration
  const markdownStyles = StyleSheet.create({
    body: {
      color: '#333',
      fontSize: 16,
      lineHeight: 24,
      padding: 16,
    },
    
    heading1: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#1a1a1a',
      marginTop: 24,
      marginBottom: 16,
      lineHeight: 36,
      borderBottomWidth: 2,
      borderBottomColor: '#e1e4e8',
      paddingBottom: 8,
    },
    heading2: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#1a1a1a',
      marginTop: 20,
      marginBottom: 12,
      lineHeight: 32,
      borderBottomWidth: 1,
      borderBottomColor: '#eaecef',
      paddingBottom: 6,
    },
    heading3: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#1a1a1a',
      marginTop: 16,
      marginBottom: 10,
      lineHeight: 28,
    },
    heading4: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1a1a1a',
      marginTop: 16,
      marginBottom: 8,
      lineHeight: 26,
    },
    heading5: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#1a1a1a',
      marginTop: 16,
      marginBottom: 8,
      lineHeight: 24,
    },
    heading6: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#1a1a1a',
      marginTop: 16,
      marginBottom: 8,
      lineHeight: 22,
    },

    paragraph: {
      fontSize: 16,
      color: '#333',
      lineHeight: 24,
      marginBottom: 16,
    },

    code_inline: {
      backgroundColor: '#f6f8fa',
      color: '#d73a49',
      fontFamily: Platform.select({
        ios: 'Menlo-Regular',
        android: 'monospace',
        web: 'SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace',
      }),
      fontSize: 14,
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 3,
    },
    code_block: {
      backgroundColor: '#f6f8fa',
      borderRadius: 6,
      padding: 16,
      marginVertical: 12,
      borderWidth: 1,
      borderColor: '#e1e4e8',
    },
    fence: {
      backgroundColor: '#f6f8fa',
      borderRadius: 6,
      padding: 16,
      marginVertical: 12,
      borderWidth: 1,
      borderColor: '#e1e4e8',
    },

    bullet_list: {
      marginBottom: 16,
    },
    ordered_list: {
      marginBottom: 16,
    },
    list_item: {
      flexDirection: 'row',
      marginBottom: 8,
      paddingLeft: 4,
    },
    bullet_list_icon: {
      fontSize: 16,
      color: '#0366d6',
      marginRight: 8,
      marginTop: 4,
    },
    ordered_list_icon: {
      fontSize: 16,
      color: '#0366d6',
      marginRight: 8,
      marginTop: 4,
      minWidth: 20,
    },

    link: {
      color: '#0366d6',
      textDecorationLine: Platform.OS === 'web' ? 'underline' : 'none',
    },

    strong: {
      fontWeight: 'bold',
      color: '#1a1a1a',
    },
    em: {
      fontStyle: 'italic',
      color: '#1a1a1a',
    },

    blockquote: {
      backgroundColor: '#f6f8fa',
      borderLeftWidth: 4,
      borderLeftColor: '#dfe2e5',
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginVertical: 16,
      borderRadius: 3,
    },

    hr: {
      backgroundColor: '#e1e4e8',
      height: 2,
      marginVertical: 24,
      borderRadius: 1,
    },
  })

  try {
    return (
      <View style={[styles.container, style]}>
        <Markdown
          style={markdownStyles}
          onLinkPress={handleLinkPress}
          onError={(error) => {
            console.warn('Markdown rendering error:', error)
            setHasError(true)
            setErrorMessage(error?.message || 'Unknown error')
          }}
        >
          {content}
        </Markdown>
      </View>
    )
  } catch (error) {
    // If markdown rendering fails, fall back to simple renderer
    console.warn('Markdown component failed, using fallback:', error)
    return (
      <View style={[styles.container, style]}>
        <View style={styles.errorHeader}>
          <Text style={styles.errorTitle}>Using Fallback Renderer</Text>
          <Text style={styles.errorSubtitle}>Enhanced renderer failed</Text>
        </View>
        <SimpleFallbackRenderer content={content} />
      </View>
    )
  }
}

  const markdownStyles = StyleSheet.create({
    // Body styles
    body: {
      color: '#333',
      fontSize: 16,
      lineHeight: 24,
      padding: 16,
    },
    
    // Heading styles
    heading1: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#1a1a1a',
      marginTop: 24,
      marginBottom: 16,
      lineHeight: 36,
      borderBottomWidth: 2,
      borderBottomColor: '#e1e4e8',
      paddingBottom: 8,
    },
    heading2: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#1a1a1a',
      marginTop: 20,
      marginBottom: 12,
      lineHeight: 32,
      borderBottomWidth: 1,
      borderBottomColor: '#eaecef',
      paddingBottom: 6,
    },
    heading3: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#1a1a1a',
      marginTop: 16,
      marginBottom: 10,
      lineHeight: 28,
    },
    heading4: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1a1a1a',
      marginTop: 16,
      marginBottom: 8,
      lineHeight: 26,
    },
    heading5: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#1a1a1a',
      marginTop: 16,
      marginBottom: 8,
      lineHeight: 24,
    },
    heading6: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#1a1a1a',
      marginTop: 16,
      marginBottom: 8,
      lineHeight: 22,
    },

    // Paragraph styles
    paragraph: {
      fontSize: 16,
      color: '#333',
      lineHeight: 24,
      marginBottom: 16,
    },

    // Code styles
    code_inline: {
      backgroundColor: '#f6f8fa',
      color: '#d73a49',
      fontFamily: Platform.select({
        ios: 'Menlo-Regular',
        android: 'monospace',
        web: 'SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace',
      }),
      fontSize: 14,
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 3,
      borderWidth: 1,
      borderColor: '#e1e4e8',
    },
    code_block: {
      backgroundColor: '#f6f8fa',
      borderRadius: 6,
      padding: 16,
      marginVertical: 12,
      borderWidth: 1,
      borderColor: '#e1e4e8',
    },
    fence: {
      backgroundColor: '#f6f8fa',
      borderRadius: 6,
      padding: 16,
      marginVertical: 12,
      borderWidth: 1,
      borderColor: '#e1e4e8',
    },

    // List styles
    bullet_list: {
      marginBottom: 16,
    },
    ordered_list: {
      marginBottom: 16,
    },
    list_item: {
      flexDirection: 'row',
      marginBottom: 8,
      paddingLeft: 4,
    },
    bullet_list_icon: {
      fontSize: 16,
      color: '#0366d6',
      marginRight: 8,
      marginTop: 4,
    },
    ordered_list_icon: {
      fontSize: 16,
      color: '#0366d6',
      marginRight: 8,
      marginTop: 4,
      minWidth: 20,
    },
    bullet_list_content: {
      flex: 1,
    },
    ordered_list_content: {
      flex: 1,
    },

    // Link styles
    link: {
      color: '#0366d6',
      textDecorationLine: Platform.OS === 'web' ? 'underline' : 'none',
    },

    // Emphasis styles
    strong: {
      fontWeight: 'bold',
      color: '#1a1a1a',
    },
    em: {
      fontStyle: 'italic',
      color: '#1a1a1a',
    },

    // Blockquote styles
    blockquote: {
      backgroundColor: '#f6f8fa',
      borderLeftWidth: 4,
      borderLeftColor: '#dfe2e5',
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginVertical: 16,
      borderRadius: 3,
    },

    // Table styles
    table: {
      borderWidth: 1,
      borderColor: '#e1e4e8',
      borderRadius: 6,
      marginVertical: 16,
      overflow: 'hidden',
    },
    thead: {
      backgroundColor: '#f6f8fa',
    },
    tbody: {
    },
    th: {
      borderRightWidth: 1,
      borderRightColor: '#e1e4e8',
      borderBottomWidth: 1,
      borderBottomColor: '#e1e4e8',
      padding: 12,
    },
    td: {
      borderRightWidth: 1,
      borderRightColor: '#e1e4e8',
      borderBottomWidth: 1,
      borderBottomColor: '#e1e4e8',
      padding: 12,
    },
    tr: {
      borderBottomWidth: 1,
      borderBottomColor: '#e1e4e8',
    },

    // Horizontal rule
    hr: {
      backgroundColor: '#e1e4e8',
      height: 2,
      marginVertical: 24,
      borderRadius: 1,
    },

    // Task list styles
    checkbox: {
      marginRight: 8,
    },
    checkbox_checked: {
      color: '#28a745',
    },
    checkbox_unchecked: {
      color: '#6a737d',
    },
  })

  const rules = {
    // Handle links with proper navigation
    link: (node: any, children: any, parent: any, styles: any) => (
      <TouchableOpacity
        key={node.key}
        onPress={() => handleLinkPress(node.attributes.href)}
        activeOpacity={0.7}
      >
        <Markdown style={styles}>{children}</Markdown>
      </TouchableOpacity>
    ),

    // Enhanced image handling (placeholder for now since images need special handling in RN)
    image: (node: any, children: any, parent: any, styles: any) => (
      <View key={node.key} style={imageStyles.container}>
        <View style={imageStyles.placeholder}>
          <Markdown style={styles}>🖼️ {node.attributes.alt || 'Image'}</Markdown>
        </View>
      </View>
    ),
  }

  const imageStyles = StyleSheet.create({
    container: {
      marginVertical: 12,
      alignItems: 'center',
    },
    placeholder: {
      backgroundColor: '#f6f8fa',
      padding: 16,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: '#e1e4e8',
      borderStyle: 'dashed',
    },
  })

  return (
    <View style={[styles.container, style]}>
      <Markdown
        style={markdownStyles}
        rules={rules}
        onLinkPress={handleLinkPress}
      >
        {content}
      </Markdown>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})

export default ImprovedMarkdownRenderer
