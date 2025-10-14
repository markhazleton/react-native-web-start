// React Native Web Jest Setup with React Testing Library
import '@testing-library/jest-dom'

// Mock documentation service to avoid import.meta issues
jest.mock('./packages/shared/src/services/documentationService', () => ({
  DocumentationService: {
    getDocumentationFiles: jest.fn(() => Promise.resolve([])),
    getDocumentationContent: jest.fn(() => Promise.resolve('# Mock Documentation')),
    searchDocumentationFiles: jest.fn(() => []),
  },
}))

// Mock Platform for React Native Web
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native-web'),
  Platform: {
    OS: 'web',
    select: jest.fn((obj) => obj.web || obj.default),
  },
}))

// Mock console methods to suppress warnings during tests
const originalConsole = global.console
global.console = {
  ...originalConsole,
  // Suppress console.log, console.info, console.warn during tests
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  // Keep console.error for debugging
  error: originalConsole.error,
}

// Setup test environment globals
global.__DEV__ = true

// Mock fetch for API testing
global.fetch = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
})