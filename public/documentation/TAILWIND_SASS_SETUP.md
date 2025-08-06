# Tailwind CSS and SASS Integration

This project now includes Tailwind CSS and SASS integration for enhanced styling capabilities.

## What's Included

### Dependencies Added

- `tailwindcss` - Utility-first CSS framework
- `@tailwindcss/postcss` - PostCSS plugin for Tailwind CSS
- `postcss` - CSS post-processor
- `autoprefixer` - Adds vendor prefixes automatically
- `sass` - CSS preprocessor with variables, nesting, and mixins

### Configuration Files

- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `src/styles/main.scss` - Main SCSS file with Tailwind directives
- `src/styles/variables.scss` - SCSS variables

### Build Scripts Added

- `css:build` - Build Tailwind CSS with watch mode
- `css:build-prod` - Build Tailwind CSS for production (minified)
- `sass:build` - Build SASS files with watch mode
- `sass:build-prod` - Build SASS files for production (compressed)

## Usage Examples

### Using Tailwind CSS Classes

You can use Tailwind utilities directly in your JSX:

```jsx
// In your React components
<View className="bg-blue-500 p-4 rounded-lg">
  <Text className="text-white font-bold">Hello World</Text>
</View>
```

### Using Custom SCSS Classes

Custom classes are defined in `src/styles/main.scss`:

```jsx
// Using custom button classes
<button className="button button--primary">Primary Button</button>
<button className="button button--secondary">Secondary Button</button>

// Using custom card classes
<div className="card card--elevated">
  <p>This is an elevated card</p>
</div>
```

### Using SCSS Variables

SCSS variables are defined in `src/styles/variables.scss`:

```scss
// Available variables
$primary-color: #3b82f6;
$secondary-color: #64748b;
$spacing-md: 1rem;
$border-radius-md: 0.5rem;
```

### Combining Tailwind and SCSS

You can combine Tailwind utilities with custom SCSS:

```jsx
<div className="bg-white p-6 rounded-lg shadow-md text-primary">
  Content using both Tailwind classes and custom SCSS color
</div>
```

## Build Process

The build process automatically:

1. Processes SCSS files and imports
2. Applies Tailwind CSS utilities
3. Adds vendor prefixes with Autoprefixer
4. Minifies CSS for production builds
5. Includes CSS in the final bundle

## File Structure

```
src/
  styles/
    main.scss          # Main stylesheet with Tailwind directives
    variables.scss     # SCSS variables and constants
  main.tsx            # Imports the main SCSS file
tailwind.config.js    # Tailwind configuration
postcss.config.js     # PostCSS configuration
```

## Notes

- Tailwind CSS is included via PostCSS for optimal build performance
- SASS processing handles variables, nesting, and mixins
- The build automatically purges unused CSS in production
- Both CSS-in-JS (StyleSheet) and CSS classes can be used together
- CSS files are automatically generated during the build process

## Development

Run `npm run dev` to start development with CSS hot-reloading.
The CSS will be automatically rebuilt when you make changes to SCSS files.
