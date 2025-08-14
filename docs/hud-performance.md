# Performance HUD

A development-only performance monitor is available for tracking render
metrics of React components.

## Enabling the HUD

1. Create a `.env` file and set the flag:

```bash
VITE_SHOW_PERFORMANCE_HUD=true
```

2. Start the dev server:

```bash
npm run dev
```

The overlay will appear in the bottom-right corner showing the latest
render duration and approximate update frequency.

## Hook Usage

The HUD uses the `usePerformanceMetrics` hook, which you can also use
within components to access the same metrics:

```js
import usePerformanceMetrics from '../hooks/usePerformanceMetrics.js';

function MyComponent() {
  const metrics = usePerformanceMetrics();
  // metrics.current.renderDuration and metrics.current.updatesPerSecond
}
```

This hook measures how long the component took to render and how often
it updates. It is designed for development diagnostics and is excluded
from production builds.
