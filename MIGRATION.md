# Panda CSS & Arwes Migration

## Overview

This project has been successfully migrated from Tailwind CSS to Panda CSS with Arwes as the primary FX system for frames, backgrounds, and animations.

## Key Changes

### 1. Runtime Environment
- **React version**: Downgraded from 19.x to 18.3.1 for Arwes compatibility
- **React StrictMode**: Removed everywhere to prevent animation lifecycle issues
- **Client-side only**: No React Server Components or streaming hydration

### 2. Styling System
- **Removed**: Tailwind CSS and all related packages/configs
- **Added**: Panda CSS (zero-runtime, typed styling)
- **Configuration**: `panda.config.ts` with Arwes-inspired tokens
- **Output**: Generated styles in `src/styled-system/`

### 3. Arwes Integration
- **Packages**: All @arwes/* packages aligned to 1.0.0-next.25020502
- **Global wrapper**: `ArwesWrapper` component provides:
  - Root Animator with consistent timing
  - Ambient backgrounds (GridLines + Dots)
  - Performance-aware rendering
  - Motion preference support

### 4. New Components

#### PanelKranox
```jsx
import { PanelKranox } from './components/panels';

<PanelKranox 
  title="Panel Title"
  subtitle="Optional subtitle"
  density="normal" // compact | normal | comfortable
  variant="normal" // normal | loud
>
  Content here
</PanelKranox>
```

#### PanelOctagon
```jsx
import { PanelOctagon } from './components/panels';

<PanelOctagon
  title="Panel Title"
  subtitle="Optional subtitle"
  density="normal" // compact | normal | comfortable
  variant="normal" // normal | loud
>
  Content here
</PanelOctagon>
```

### 5. Accessibility Features
- **Reduced motion**: Automatically detected and honored
- **Focus states**: Visible outlines on all interactive elements
- **Layering**: Backgrounds use `pointer-events: none`
- **Performance**: Adaptive rendering based on device capabilities

### 6. Routes
- `/` - Main application
- `/fx-demo` - Visual effects demonstration
- `/dev/components` - Component development preview

## Usage Guidelines

### Adding New Styles
Use Panda CSS functions:
```jsx
import { css } from '../styled-system/css';

<div className={css({
  padding: 'md',
  backgroundColor: 'primary',
  borderRadius: 'sm'
})} />
```

### Creating New Panels
Use the existing panel components as wrappers:
```jsx
<PanelKranox title="New Feature">
  <YourComponent />
</PanelKranox>
```

### Theme Tokens
Available tokens in `panda.config.ts`:
- **Colors**: primary, secondary, accent, background, surface, text, muted
- **Spacing**: xs, sm, md, lg, xl, 2xl, 3xl
- **Radii**: none, sm, md, lg, full
- **Fonts**: body, heading, mono

### Performance Considerations
1. Arwes backgrounds automatically reduce opacity on low-DPR devices
2. Animations are disabled when `prefers-reduced-motion` is set
3. Frame SVGs use fixed stroke widths to prevent scaling issues

## Development

```bash
# Install dependencies
npm install

# Run dev server with Panda CSS watch mode
npm run dev

# Build production
npm run build

# View FX demo
# Navigate to http://localhost:5173/fx-demo
```

## Troubleshooting

### Animations not working
- Ensure React StrictMode is not enabled
- Check that Arwes packages are all on the same version
- Verify ArwesWrapper is at the root of your component tree

### Styling issues
- Run `npx panda codegen` to regenerate styles
- Check that PostCSS is configured with Panda plugin
- Import styles in the correct order (global.css → panda.css)

### Performance issues
- Backgrounds automatically adapt to device capabilities
- Use `density="compact"` for content-heavy panels
- Consider `variant="normal"` over `variant="loud"` for better performance

## Future Enhancements
1. Add more Arwes frame variants (Underline, Corners, etc.)
2. Create animated button and input components
3. Implement sound effects integration
4. Add more sophisticated animation sequences