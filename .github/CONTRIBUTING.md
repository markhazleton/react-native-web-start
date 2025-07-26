# 🤝 Contributing to React Native Web Starter

Thank you for your interest in contributing to the React Native Web Starter! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation Standards](#documentation-standards)
- [Submitting Changes](#submitting-changes)
- [Community and Support](#community-and-support)

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- **Be respectful** and inclusive to all community members
- **Be collaborative** and constructive in discussions
- **Be patient** with newcomers and those learning
- **Focus on what's best** for the community and project
- **Show empathy** towards other community members

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Git** for version control
- **Code Editor** (VS Code recommended)
- **Mobile Development** (optional):
  - **iOS**: Xcode 14+ (macOS only)
  - **Android**: Android Studio with SDK

### Local Setup

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/react-native-web-start.git
cd react-native-web-start

# Install dependencies
npm install --legacy-peer-deps

# Start development
npm run dev
```

### Project Structure

```
react-native-web-start/
├── src/                    # Source code
├── documentation/          # Project documentation
├── .github/               # GitHub templates and workflows
├── public/                # Static assets
├── package.json           # Dependencies and scripts
└── README.md             # Project overview
```

## 🔄 How to Contribute

### 🐛 Reporting Bugs

1. **Search existing issues** to avoid duplicates
2. **Use the bug report template** for detailed reports
3. **Include reproduction steps** and environment details
4. **Add relevant labels** to categorize the issue

### ✨ Suggesting Features

1. **Check the roadmap** in project discussions
2. **Use the feature request template** for structured proposals
3. **Discuss in GitHub Discussions** for community input
4. **Consider impact** on all platforms (web, iOS, Android)

### 📚 Improving Documentation

1. **Identify documentation gaps** or errors
2. **Use the documentation template** for requests
3. **Consider your audience** (beginners vs. experienced developers)
4. **Include examples** and visual aids where helpful

### 💻 Contributing Code

1. **Create an issue** first to discuss major changes
2. **Fork the repository** and create a feature branch
3. **Follow coding standards** and best practices
4. **Add tests** for new functionality
5. **Update documentation** as needed
6. **Submit a pull request** using our PR template

## 🔧 Development Workflow

### Branch Naming

Use descriptive branch names with prefixes:

```bash
feature/add-navigation-system
bugfix/fix-ios-styling-issue
docs/update-setup-guide
refactor/improve-api-service
```

### Commit Messages

Follow conventional commit format:

```bash
feat: add navigation system for cross-platform use
fix: resolve iOS styling issue with button component
docs: update setup guide with mobile development steps
refactor: improve API service error handling
```

### Development Process

1. **Create a branch** from `main`
2. **Make your changes** following coding standards
3. **Test thoroughly** on relevant platforms
4. **Update documentation** if needed
5. **Submit a pull request** with detailed description

## 📏 Coding Standards

### TypeScript

- **Use strict mode** configuration
- **Define explicit types** for all functions and variables
- **Use interfaces** for object structures
- **Export types** from dedicated type files

```typescript
// Good
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

const getUserProfile = async (userId: string): Promise<UserProfile> => {
  // Implementation
};

// Avoid
const getUserProfile = (userId) => {
  // Implementation
};
```

### React Native Components

- **Use functional components** with hooks
- **Implement proper prop types** with TypeScript interfaces
- **Follow React Native best practices** for cross-platform compatibility
- **Use StyleSheet.create** for styling

```typescript
// Good
interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

const CustomButton: React.FC<ButtonProps> = ({ title, onPress, disabled = false }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} disabled={disabled}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

### Platform-Specific Code

- **Use Platform.select()** for platform-specific values
- **Create platform-specific files** when needed (`.ios.tsx`, `.android.tsx`, `.web.tsx`)
- **Test on all target platforms** when making changes

```typescript
// Good
const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        paddingTop: 44, // Status bar height
      },
      android: {
        paddingTop: 24,
      },
      web: {
        paddingTop: 0,
      },
    }),
  },
});
```

### Code Formatting

- **Use Prettier** for consistent formatting
- **Follow ESLint rules** defined in the project
- **Use meaningful variable names** and avoid abbreviations
- **Add comments** for complex logic

## 🧪 Testing Guidelines

### Unit Tests

- **Write tests** for all new functions and components
- **Use Jest** and React Native Testing Library
- **Test both happy path and error cases**
- **Maintain high test coverage** (target: 80%+)

```typescript
// Example test
import { render, fireEvent } from '@testing-library/react-native';
import CustomButton from '../CustomButton';

describe('CustomButton', () => {
  it('renders with correct title', () => {
    const { getByText } = render(
      <CustomButton title="Test Button" onPress={() => {}} />
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <CustomButton title="Test Button" onPress={onPressMock} />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Tests

- **Test component interactions** and API integrations
- **Test cross-platform compatibility** where applicable
- **Use realistic test data** and scenarios

### Manual Testing

- **Test on web browsers** (Chrome, Firefox, Safari)
- **Test on mobile devices** when changes affect mobile
- **Verify responsive design** across different screen sizes
- **Test with different data scenarios** (empty states, loading states, errors)

## 📚 Documentation Standards

### Writing Style

- **Use clear, concise language** appropriate for the target audience
- **Include practical examples** and code snippets
- **Structure content** with proper headings and sections
- **Use active voice** and second person ("you") when giving instructions

### Markdown Formatting

- **Use consistent heading levels** (# ## ### ####)
- **Include code blocks** with proper language syntax highlighting
- **Add tables** for structured information
- **Use emojis** sparingly for visual appeal and categorization

### Screenshots and Visuals

- **Include screenshots** for UI-related documentation
- **Use high-quality images** that are easy to read
- **Show before/after comparisons** when relevant
- **Add alt text** for accessibility

## 📤 Submitting Changes

### Pull Request Process

1. **Ensure your fork is up to date** with the main repository
2. **Create a focused pull request** addressing one issue or feature
3. **Use the PR template** and fill out all relevant sections
4. **Link related issues** in the PR description
5. **Request review** from maintainers

### PR Requirements

- **All tests pass** locally and in CI
- **Code follows** established style guidelines
- **Documentation is updated** for new features or changes
- **No breaking changes** unless discussed and approved
- **Commit history is clean** (squash commits if needed)

### Review Process

- **Maintainers will review** within 48-72 hours
- **Address feedback** promptly and professionally
- **Be open to suggestions** and iterate on solutions
- **Participate in discussions** constructively

## 🌟 Community and Support

### Getting Help

- **GitHub Discussions** for questions and ideas
- **Issues** for bugs and feature requests
- **Pull Request reviews** for code feedback
- **Documentation** for comprehensive guides

### Recognition

- **Contributors** are acknowledged in release notes
- **Significant contributions** may earn maintainer status
- **Community involvement** is valued and appreciated

## 🎯 Project Goals

Our mission is to provide:

- **Production-ready** React Native Web starter
- **Excellent developer experience** with modern tooling
- **Comprehensive documentation** for all skill levels
- **Active community** support and collaboration
- **Cross-platform excellence** for web, iOS, and Android

## 📞 Contact

- **Project Maintainer**: [Mark Hazleton](https://github.com/markhazleton)
- **Issues**: [GitHub Issues](https://github.com/markhazleton/react-native-web-start/issues)
- **Discussions**: [GitHub Discussions](https://github.com/markhazleton/react-native-web-start/discussions)

---

**Thank you for contributing to React Native Web Starter! Your involvement helps make this project better for everyone.** 🙏
