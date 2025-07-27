// Shared exports for the monorepo
export { default as App } from "./App";

// Components
export { default as Footer } from "./components/common/Footer";
export { default as MarkdownRenderer } from "./components/common/MarkdownRenderer";
export { default as Navigation } from "./components/navigation/Navigation";

// Screens
export { default as WelcomeScreen } from "./components/screens/WelcomeScreen";
export { default as DocumentationScreen } from "./components/screens/DocumentationScreen";
export { default as DocumentationBrowserScreen } from "./components/screens/DocumentationBrowserScreen";
export { default as DocumentationReaderScreen } from "./components/screens/DocumentationReaderScreen";
export { default as JokesScreen } from "./components/screens/JokesScreen";

// Services
export { DocumentationService } from "./services/documentationService";

// Types
export type {
  DocumentationFile,
  DocumentationContent,
} from "./types/documentation";

// Utils (create these if they don't exist)
// export { isWeb, isIOS, isAndroid, isMobile, getWebBaseUrl } from './utils/platform';

// Constants
export const APP_CONFIG = {
  name: "React Native Web Monorepo",
  version: "1.0.0",
  description: "Cross-platform application built with React Native Web",
};
