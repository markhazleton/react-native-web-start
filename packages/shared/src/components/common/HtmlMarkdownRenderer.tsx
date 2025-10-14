import React from 'react'
import { View, StyleSheet, Platform, ViewStyle } from 'react-native'
import RenderHtml from 'react-native-render-html'
import { marked } from 'marked'

interface HtmlMarkdownRendererProps {
  content: string
  style?: ViewStyle
  contentWidth: number
}

const HtmlMarkdownRenderer: React.FC<HtmlMarkdownRendererProps> = ({ 
  content, 
  style, 
  contentWidth = 350 
}) => {
  // Configure marked options for better HTML output
  marked.setOptions({
    breaks: true,
    gfm: true, // GitHub Flavored Markdown
  })

  // Convert markdown to HTML
  const htmlContent = React.useMemo(() => {
    return marked(content) as string
  }, [content])

  // Simplified CSS styles for the HTML content
  const tagsStyles = {
    body: {
      color: '#333',
      fontSize: 16,
      lineHeight: 24,
    },
    h1: {
      fontSize: 28,
      fontWeight: 'bold' as const,
      color: '#1a1a1a',
      marginTop: 24,
      marginBottom: 16,
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold' as const,
      color: '#1a1a1a',
      marginTop: 20,
      marginBottom: 12,
    },
    h3: {
      fontSize: 20,
      fontWeight: 'bold' as const,
      color: '#1a1a1a',
      marginTop: 16,
      marginBottom: 10,
    },
    p: {
      fontSize: 16,
      color: '#333',
      lineHeight: 24,
      marginBottom: 16,
    },
    li: {
      fontSize: 16,
      color: '#333',
      lineHeight: 24,
      marginBottom: 8,
    },
    code: {
      backgroundColor: '#f6f8fa',
      color: '#d73a49',
      fontSize: 14,
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 3,
    },
    pre: {
      backgroundColor: '#f6f8fa',
      borderRadius: 6,
      padding: 16,
      marginVertical: 12,
    },
    blockquote: {
      backgroundColor: '#f6f8fa',
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginVertical: 16,
      fontStyle: 'italic' as const,
      borderRadius: 3,
    },
    a: {
      color: '#0366d6',
      textDecorationLine: 'underline' as const,
    },
    strong: {
      fontWeight: 'bold' as const,
      color: '#1a1a1a',
    },
    em: {
      fontStyle: 'italic' as const,
      color: '#1a1a1a',
    },
  }

  const systemFonts = Platform.select({
    ios: ['system font'],
    android: ['Roboto'],
    web: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  }) || []

  return (
    <View style={[styles.container, style]}>
      <RenderHtml
        contentWidth={contentWidth}
        source={{ html: htmlContent }}
        tagsStyles={tagsStyles}
        systemFonts={systemFonts}
        renderersProps={{
          // Ensure links don't interfere with navigation
          a: {
            onPress: (event: unknown, href: string) => {
              if (event && typeof event === 'object' && 'preventDefault' in event) {
                (event as { preventDefault: () => void }).preventDefault()
              }
              if (Platform.OS === 'web') {
                if (typeof window !== 'undefined') {
                  window.open(href, '_blank')
                }
              }
              return false
            },
          },
        }}
        defaultTextProps={{
          selectable: true,
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    overflow: 'hidden', // Prevent content from breaking out
    ...Platform.select({
      web: {
        // Ensure proper containment on web
        position: 'relative',
        zIndex: 1,
        isolation: 'isolate',
      },
    }),
  },
})

export default HtmlMarkdownRenderer
