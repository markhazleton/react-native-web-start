# Markdown Rendering in React Native Web Start

## Current Implementation

This application uses multiple markdown rendering approaches to provide robust documentation display across web and mobile platforms.

## Available Markdown Renderers

### 1. HtmlMarkdownRenderer (Currently Active)

**File:** `packages/shared/src/components/common/HtmlMarkdownRenderer.tsx`

**Status:** ✅ **Currently used in DocumentationReaderScreen**

**Features:**

- ✅ Converts markdown to HTML first, then renders
- ✅ Full HTML/CSS styling support
- ✅ Better table rendering
- ✅ More accurate GitHub Flavored Markdown
- ✅ Better cross-platform consistency
- ✅ Support for complex nested structures

**Usage:**

```tsx
import HtmlMarkdownRenderer from '../common/HtmlMarkdownRenderer'

<HtmlMarkdownRenderer 
  content={markdownContent}
  contentWidth={screenWidth - 32}
  style={customStyles}
/>
```

### 3. Enhanced Documentation Reader

- ✅ Converts markdown to HTML using `marked` library (v17.0.1)
- ✅ Renders HTML using `react-native-render-html` (v6.3.4)
- ✅ Full HTML/CSS styling support
- ✅ Better table rendering
- ✅ GitHub Flavored Markdown support
- ✅ Better cross-platform consistency
- ✅ Support for complex nested structures
- ✅ Security-focused markdown parsing

**File:** `packages/shared/src/components/common/SecureMarkdownRenderer.tsx`

**Features:**

- ✅ Custom React Native implementation using marked lexer
- ✅ Secure token-based parsing
- ✅ Basic markdown support (headers, lists, code blocks)
- ✅ Lightweight and performant
- ✅ Full control over rendering
- ✅ No HTML injection vulnerabilities

**Usage:**

```tsx
import SecureMarkdownRenderer from '../common/SecureMarkdownRenderer'

<SecureMarkdownRenderer markdown={markdownContent} />
```

### 3. MarkdownRenderer (Basic)

**File:** `packages/shared/src/components/common/MarkdownRenderer.tsx`

**Features:**

- ✅ Simple, lightweight implementation
- ✅ Basic markdown support
- ✅ Fast rendering
- ⚠️ Limited formatting capabilities

## Current Implementation

The application currently uses **HtmlMarkdownRenderer** in the DocumentationReaderScreen for optimal markdown rendering quality:

```tsx
// packages/shared/src/components/screens/DocumentationReaderScreen.tsx
import HtmlMarkdownRenderer from '../common/HtmlMarkdownRenderer'

<HtmlMarkdownRenderer 
  content={content.content}
  contentWidth={width - 32}
  style={styles.markdownContainer}
/>
```

## Dependencies

The markdownHtmlMarkdown (Current) | SecureMarkdown | Basic Markdown |
|---------|------------------------|----------------|----------------|
| Headers | ✅ Full | ✅ Basic | ✅ Basic |
| Bold/Italic | ✅ Full | ✅ Styled | ⚠️ Limited |
| Code Blocks | ✅ Enhanced | ✅ Basic | ✅ Basic |
| Inline Code | ✅ Full | ✅ Styled | ⚠️ Limited |
| Links | ✅ Clickable | ⚠️ Basic | ⚠️ Text only |
| Tables | ✅ Full | ❌ Not supported | ❌ Not supported |
| Lists | ✅ Full | ✅ Enhanced | ✅ Basic |
| Blockquotes | ✅ Full | ✅ Enhanced | ✅ Basic |
| Task Lists | ✅ Full | ❌ Not supported | ❌ Not supported |
| Performance | ✅ Good | ✅ Excellent | ✅ Excellent |
| Bundle Size | ⚠️ Larger | ✅ Medium | ✅ Small |
| Security | ✅ Secure | ✅ Very Secure | ✅ Secure |

## Recommendation

**Currently using HtmlMarkdownRenderer** - Provides the best balance of:

- Comprehensive markdown support
- Good cross-platform compatibility
- Security through use of `marked` library
- Reasonable performance

For most use cases, the current implementation provides optimal markdown rendering quality
2. **Choose the best option** based on your needs
3. **Update the import** in DocumentationReaderScreen
4. **Consider adding syntax highlighting** for code blocks
5. **Add image support** if needed for your documentation

The improved renderers will provide a much better user experience for reading documentation in your app, with proper formatting, clickable links, and support for complex markdown structures.
