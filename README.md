# React SVG Icon Compare

A powerful React component for visually comparing and detecting duplicate SVG icons in your project. Perfect for managing large icon libraries and preventing duplicate icons.

## Features

- 🔍 **Visual Comparison** - Compares SVG icons pixel-by-pixel
- 🎯 **Duplicate Detection** - Automatically highlights similar icons (90%+ similarity)
- 🔄 **Real-time Progress** - Shows comparison progress with visual feedback
- 🎨 **Customizable** - Configurable thresholds and grid layout
- ⚡ **Fast** - Efficient canvas-based comparison algorithm
- 📦 **Zero Dependencies** - Only requires React and React-DOM

## Installation

```bash
npm install react-svg-icon-compare
```

or

```bash
yarn add react-svg-icon-compare
```

## Usage

### Basic Example

```tsx
import { IconCompare } from 'react-svg-icon-compare';
import * as Icons from './your-icons-folder';

function App() {
  return (
    <IconCompare 
      icons={Icons}
    />
  );
}
```

### With Custom Configuration

```tsx
import { IconCompare } from 'react-svg-icon-compare';
import * as Icons from './your-icons-folder';

function App() {
  const handleComparisonComplete = (scores) => {
    console.log('Similarity scores:', scores);
    
    // Find duplicates
    const duplicates = Object.entries(scores)
      .filter(([_, score]) => score > 90)
      .map(([name, score]) => ({ name, score }));
    
    console.log('Potential duplicates:', duplicates);
  };

  return (
    <IconCompare 
      icons={Icons}
      duplicateThreshold={90}
      similarThreshold={70}
      gridColumns={8}
      onComparisonComplete={handleComparisonComplete}
      className="my-custom-class"
    />
  );
}
```

### Icon Format

Your icons should be React components that render SVG elements:

```tsx
// SearchIcon.tsx
export const SearchIcon = (props) => (
  <svg width="20" height="20" viewBox="0 0 20 20" {...props}>
    <path d="..." fill="currentColor" />
  </svg>
);

// Then export all icons from index.ts
export { SearchIcon } from './SearchIcon';
export { UserIcon } from './UserIcon';
// ... more icons
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icons` | `Record<string, React.ComponentType>` | **Required** | Object containing icon components |
| `className` | `string` | `''` | Custom CSS class for container |
| `onComparisonComplete` | `(scores: Record<string, number>) => void` | `undefined` | Callback when comparison finishes |
| `duplicateThreshold` | `number` | `90` | Similarity % for duplicate highlighting (red) |
| `similarThreshold` | `number` | `70` | Similarity % for similar highlighting (yellow) |
| `gridColumns` | `number` | `8` | Number of columns in icon grid |

## How It Works

1. **Paste SVG** - Paste your new SVG icon code into the textarea
2. **Automatic Comparison** - The component renders all icons and compares them pixel-by-pixel
3. **Visual Feedback** - Icons are highlighted based on similarity:
   - 🔴 **Red (90%+)** - Likely duplicate, don't create this icon!
   - 🟡 **Yellow (70-90%)** - Very similar design
   - 🔵 **Blue (50-70%)** - Somewhat similar
4. **Sorted Results** - Most similar icons appear first

## Comparison Algorithm

The component uses a sophisticated pixel-based comparison:

1. Normalizes SVG dimensions and colors
2. Renders SVGs to canvas (128x128)
3. Compares pixel data (RGBA values)
4. Ignores transparent pixels
5. Calculates similarity percentage

## Example Project Structure

```
your-project/
├── src/
│   ├── components/
│   │   └── icons/
│   │       ├── SearchIcon.tsx
│   │       ├── UserIcon.tsx
│   │       ├── ... more icons
│   │       └── index.ts
│   └── pages/
│       └── IconManager.tsx
```

**IconManager.tsx:**
```tsx
import { IconCompare } from 'react-svg-icon-compare';
import * as Icons from '../components/icons';

export default function IconManager() {
  return (
    <div>
      <h1>Icon Library Manager</h1>
      <IconCompare icons={Icons} />
    </div>
  );
}
```

## Styling

The component uses Tailwind CSS classes by default. If you're not using Tailwind, you can:

1. Install Tailwind CSS in your project
2. Or provide custom styles via the `className` prop
3. Or override the default styles

## TypeScript Support

Full TypeScript support with type definitions included.

```tsx
import type { IconCompareProps, SimilarityScore } from 'react-svg-icon-compare';
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

Requires browser support for:
- Canvas API
- DOMParser
- XMLSerializer

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

Your Name

## Repository

https://github.com/yourusername/react-svg-icon-compare
