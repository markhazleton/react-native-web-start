import 'react-native-gesture-handler/jestSetup'

// Mock react-native modules
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')

// Mock Platform
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'web',
  select: jest.fn((obj) => obj.web || obj.default),
}))

// Mock console methods
global.console = {
  ...console,
  // Suppress console.log, console.info, console.warn
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  // Keep console.error for debugging
  error: console.error,
}

// Setup test environment globals
global.__DEV__ = true

// Mock fetch for API testing
global.fetch = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
})