import React from 'react'
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native'

interface MarkdownRendererProps {
  content: string
  style?: any
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, style }) => {
  const processMarkdownContent = (markdown: string) => {
    // Split content into lines for processing
    const lines = markdown.split('\n')
    const elements: React.ReactElement[] = []
    let currentIndex = 0

    lines.forEach((line, index) => {
      const key = `${currentIndex}-${index}`
      
      // Headers
      if (line.startsWith('# ')) {
        elements.push(
          <Text key={key} style={styles.h1}>
            {line.substring(2)}
          </Text>
        )
      } else if (line.startsWith('## ')) {
        elements.push(
          <Text key={key} style={styles.h2}>
            {line.substring(3)}
          </Text>
        )
      } else if (line.startsWith('### ')) {
        elements.push(
          <Text key={key} style={styles.h3}>
            {line.substring(4)}
          </Text>
        )
      } else if (line.startsWith('#### ')) {
        elements.push(
          <Text key={key} style={styles.h4}>
            {line.substring(5)}
          </Text>
        )
      }
      // Code blocks
      else if (line.startsWith('```')) {
        elements.push(
          <View key={key} style={styles.codeBlock}>
            <Text style={styles.codeText}>
              {line.substring(3) || 'Code Block'}
            </Text>
          </View>
        )
      }
      // Bullet points
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(
          <View key={key} style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.listText}>
              {line.substring(2)}
            </Text>
          </View>
        )
      }
      // Numbered lists
      else if (/^\d+\.\s/.test(line)) {
        const match = line.match(/^(\d+)\.\s(.*)/)
        if (match) {
          elements.push(
            <View key={key} style={styles.listItem}>
              <Text style={styles.number}>{match[1]}.</Text>
              <Text style={styles.listText}>
                {match[2]}
              </Text>
            </View>
          )
        }
      }
      // Block quotes
      else if (line.startsWith('> ')) {
        elements.push(
          <View key={key} style={styles.blockquote}>
            <Text style={styles.blockquoteText}>
              {line.substring(2)}
            </Text>
          </View>
        )
      }
      // Empty lines
      else if (line.trim() === '') {
        elements.push(
          <View key={key} style={styles.spacing} />
        )
      }
      // Regular paragraphs
      else if (line.trim()) {
        // Process inline markdown (basic support)
        const processedContent = processInlineMarkdown(line)
        elements.push(
          <Text key={key} style={styles.paragraph}>
            {processedContent}
          </Text>
        )
      }
    })

    return elements
  }

  const processInlineMarkdown = (text: string): React.ReactNode => {
    // Simple inline markdown processing
    const elements: React.ReactNode[] = []
    let remaining = text
    let key = 0
    
    // Process bold, italic, code, and links in order
    const patterns = [
      { regex: /\*\*(.*?)\*\*/g, style: styles.bold, name: 'bold' },
      { regex: /\*(.*?)\*/g, style: styles.italic, name: 'italic' },
      { regex: /`(.*?)`/g, style: styles.inlineCode, name: 'code' },
    ]
    
    // Simple approach: replace markdown with styled text
    let result = text
    
    // Bold text
    result = result.replace(/\*\*(.*?)\*\*/g, (match, content) => {
      return content // For now, just return the content
    })
    
    // Italic text  
    result = result.replace(/\*(.*?)\*/g, (match, content) => {
      return content
    })
    
    // Inline code
    result = result.replace(/`(.*?)`/g, (match, content) => {
      return content
    })
    
    // Links [text](url)
    result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, (match, linkText) => {
      return linkText
    })
    
    return result
  }

  return (
    <ScrollView style={[styles.container, style]} showsVerticalScrollIndicator={true}>
      <View style={styles.content}>
        {processMarkdownContent(content)}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  h1: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 16,
    lineHeight: 36,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 14,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 12,
    lineHeight: 28,
  },
  h4: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
    lineHeight: 26,
  },
  bold: {
    fontWeight: 'bold',
    color: '#333',
  },
  italic: {
    fontStyle: 'italic',
    color: '#555',
  },
  inlineCode: {
    fontFamily: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      web: 'Monaco, Consolas, "Courier New", monospace',
    }),
    fontSize: 14,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
    color: '#333',
  },
  link: {
    color: '#2196f3',
    textDecorationLine: 'underline',
  },
  paragraph: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginVertical: 8,
  },
  listItem: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 16,
    color: '#2196f3',
    marginRight: 8,
    marginTop: 2,
  },
  number: {
    fontSize: 16,
    color: '#2196f3',
    marginRight: 8,
    marginTop: 2,
    minWidth: 24,
  },
  listText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    flex: 1,
  },
  codeBlock: {
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    padding: 12,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  codeText: {
    fontFamily: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      web: 'Monaco, Consolas, "Courier New", monospace',
    }),
    fontSize: 14,
    color: '#333',
  },
  blockquote: {
    backgroundColor: '#f8f9fa',
    borderLeftWidth: 4,
    borderLeftColor: '#dee2e6',
    padding: 12,
    marginVertical: 8,
  },
  blockquoteText: {
    fontSize: 16,
    color: '#6c757d',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  spacing: {
    height: 8,
  },
})

export default MarkdownRenderer
