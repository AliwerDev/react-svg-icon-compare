# Publishing Guide

## Prerequisites

1. **Node.js** installed (v18+)
2. **NPM account** - Create at https://www.npmjs.com/signup
3. **Git** installed

## Step-by-Step Publishing

### 1. Install Dependencies

```bash
cd react-svg-icon-compare
npm install
```

### 2. Build the Package

```bash
npm run build
```

This will create the `dist/` folder with compiled files.

### 3. Test Locally (Optional but Recommended)

Before publishing, test the package locally in another project:

```bash
# In the package directory
npm link

# In your test project
npm link react-svg-icon-compare
```

Then use it in your test project:

```tsx
import { IconCompare } from 'react-svg-icon-compare';
```

### 4. Login to NPM

```bash
npm login
```

Enter your NPM credentials.

### 5. Publish to NPM

```bash
npm publish
```

If the name is taken, update the `name` field in `package.json`:

```json
{
  "name": "@yourusername/react-svg-icon-compare",
  ...
}
```

Then publish as a scoped package:

```bash
npm publish --access public
```

### 6. Verify Publication

Visit: `https://www.npmjs.com/package/react-svg-icon-compare`

## Updating the Package

### Version Bump

```bash
# Patch (1.0.0 -> 1.0.1) - Bug fixes
npm version patch

# Minor (1.0.0 -> 1.1.0) - New features
npm version minor

# Major (1.0.0 -> 2.0.0) - Breaking changes
npm version major
```

### Publish Update

```bash
npm run build
npm publish
```

## Package.json Configuration

Update these fields in `package.json`:

```json
{
  "name": "react-svg-icon-compare",  // Change if needed
  "version": "1.0.0",
  "description": "A React component for comparing and detecting duplicate SVG icons visually",
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/react-svg-icon-compare"
  },
  "keywords": [
    "react",
    "svg",
    "icon",
    "compare",
    "duplicate",
    "visual-comparison",
    "icon-manager"
  ],
  "license": "MIT"
}
```

## GitHub Setup (Recommended)

### 1. Create Repository

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/react-svg-icon-compare.git
git push -u origin main
```

### 2. Add GitHub Actions for Auto-Publish (Optional)

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to NPM

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Using in Your Projects

After publishing, install in any project:

```bash
npm install react-svg-icon-compare
```

Or with specific version:

```bash
npm install react-svg-icon-compare@1.0.0
```

## Troubleshooting

### "Package name already exists"

Change the package name in `package.json` or use a scoped package:

```json
{
  "name": "@yourusername/react-svg-icon-compare"
}
```

### "You must be logged in to publish"

```bash
npm logout
npm login
```

### Build Errors

Make sure all dependencies are installed:

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### TypeScript Errors

Check `tsconfig.json` and ensure all type definitions are correct.

## Best Practices

1. **Semantic Versioning** - Follow semver (MAJOR.MINOR.PATCH)
2. **Changelog** - Keep a CHANGELOG.md file
3. **Tests** - Add tests before publishing
4. **Documentation** - Keep README.md updated
5. **License** - Include LICENSE file (MIT recommended)
6. **Git Tags** - Tag releases in git

## Example Workflow

```bash
# Make changes
git add .
git commit -m "Add new feature"

# Bump version
npm version minor

# Build
npm run build

# Publish
npm publish

# Push to GitHub
git push origin main --tags
```

## Support

For issues or questions:
- GitHub Issues: https://github.com/yourusername/react-svg-icon-compare/issues
- NPM: https://www.npmjs.com/package/react-svg-icon-compare
