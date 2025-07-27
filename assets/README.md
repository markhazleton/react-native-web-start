# Assets Folder

This folder contains all graphic assets for the React Native Web Start project.

## Folder Structure

- **`icons/`** - Application icons, favicons, and UI icons (SVG, PNG)
- **`images/`** - General images used throughout the application (PNG, JPG, SVG)
- **`logos/`** - Brand logos and company graphics
- **`mobile/`** - Mobile-specific assets (app icons, splash screens)
- **`web/`** - Web-specific assets (favicons, social media images)

## File Naming Conventions

- Use lowercase with hyphens for file names (e.g., `app-icon.png`)
- Include size dimensions for icons when relevant (e.g., `icon-32x32.png`)
- Use descriptive names that indicate the asset's purpose

## Supported Formats

- **SVG** - Preferred for icons and logos (scalable)
- **PNG** - For images requiring transparency
- **JPG/JPEG** - For photos and complex images
- **ICO** - For Windows favicons

## Usage

Import assets using relative paths from your components:

```typescript
// For React Native
import iconImage from '../assets/mobile/icon.png';

// For Web (Vite)
import promptSparkLogo from '../assets/logos/PromptSpark.svg';
```

## Mobile Assets

The mobile folder contains React Native/Expo specific assets:

- `adaptive-icon.png` - Android adaptive icon
- `favicon.png` - Web favicon
- `icon.png` - Main app icon
- `splash-icon.png` - Splash screen icon

## Migration Notes

Existing assets have been moved from:

- `packages/mobile/MobileApp/assets/` → `assets/mobile/`

Update import paths in your components accordingly.
