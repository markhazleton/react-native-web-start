# React Native Web Vite Starter

A comprehensive starter template for building cross-platform applications using React Native Web, Vite, and TypeScript. This project enables you to write code once and deploy to **Web, iOS, and Android** platforms.

## 🚀 Features

- **Cross-Platform**: Web, iOS, and Android from a single codebase
- **Fast Development**: Vite for lightning-fast web development with HMR
- **TypeScript**: Full TypeScript support for better developer experience
- **API Integration**: Example integration with external APIs (JokeAPI)
- **Platform-Specific Styling**: Optimized styling for each platform
- **Modern Tooling**: Latest React Native, Vite, and TypeScript versions
- **Production Ready**: Build pipelines for all platforms

## 🛠️ Tech Stack

- **React Native** - Mobile app framework
- **React Native Web** - Run React Native components on the web
- **Vite** - Next generation frontend tooling
- **TypeScript** - Static type checking
- **Metro** - React Native bundler for mobile
- **Fetch API** - HTTP client for API calls

## 📱 Platform Support

- ✅ **Web** (Chrome, Firefox, Safari, Edge)
- ✅ **iOS** (iPhone, iPad)
- ✅ **Android** (Phone, Tablet)
- ✅ **Responsive Design** for all screen sizes

## 🏁 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- For mobile: React Native CLI, Xcode (iOS), Android Studio (Android)

### Installation

```bash
# Clone the repository
git clone https://github.com/markhazleton/react-native-web-start.git
cd react-native-web-start

# Install dependencies
npm install --legacy-peer-deps

# Start web development server
npm run web
```

### Running on Different Platforms

```bash
# Web Development
npm run web        # Starts Vite dev server at http://localhost:3000

# Mobile Development
npm start          # Start Metro bundler
npm run android    # Run on Android (in separate terminal)
npm run ios        # Run on iOS (macOS only, in separate terminal)
```

## 📖 Documentation

For complete setup instructions, including mobile development environment setup, see:

- **[Complete Setup Guide](./documentation/COMPLETE_SETUP_GUIDE.md)** - Comprehensive step-by-step instructions
- **[Original Setup Guide](./documentation/SETUP_GUIDE.md)** - Basic web-only setup
- **[Project Summary](./documentation/PROJECT_SUMMARY.md)** - Complete project overview and achievements
- **[Joke Functionality Analysis](./documentation/JOKE_FUNCTIONALITY_ANALYSIS.md)** - Technical deep dive into API integration

## 🎯 Demo Features

The starter includes three example screens:

1. **Welcome Screen** - Platform information and feature overview
2. **Jokes Screen** - API integration example with JokeAPI
3. **About Screen** - App information and external links

## 🏗️ Project Structure

```
├── src/
│   ├── components/
│   │   ├── navigation/     # Navigation components
│   │   └── screens/        # Screen components
│   ├── services/           # API services
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Web entry point
├── index.html             # Web HTML template
├── index.js               # Mobile entry point
├── vite.config.ts         # Vite configuration
├── metro.config.js        # React Native configuration
└── tsconfig.json          # TypeScript configuration
```

## 🔧 Available Scripts

- `npm run web` - Start web development server
- `npm run dev` - Alias for web development
- `npm run build` - Build for production (web)
- `npm run preview` - Preview production build
- `npm start` - Start React Native Metro bundler
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run type-check` - Run TypeScript type checking
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## 🚀 Deployment

### Web

- **Vercel**: `npx vercel --prod`
- **Netlify**: Connect Git repository
- **GitHub Pages**: `npm run build && npx gh-pages -d dist`

### Mobile

- **iOS**: Archive and distribute through Xcode
- **Android**: Build signed APK/AAB and upload to Play Store

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React Native Web](https://necolas.github.io/react-native-web/) for enabling React Native on the web
- [Vite](https://vitejs.dev/) for the amazing development experience
- [JokeAPI](https://jokeapi.dev/) for providing the demo API
- [React Native](https://reactnative.dev/) team for the mobile framework

## 💡 Support

If you find this project helpful, please give it a ⭐ on GitHub!

For questions or issues, please [open an issue](https://github.com/markhazleton/react-native-web-start/issues).
