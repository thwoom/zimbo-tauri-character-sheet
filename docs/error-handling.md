# Error Handling

## Overview

The `ErrorBoundary` component wraps the application and surfaces runtime errors with a friendly message.

## Tokens

- `--space-md`: padding for the alert container.
- `--space-sm`: spacing beneath the title.
- `--hud-radius`: rounded corners.
- `--overlay-danger`: background for error state.
- `--color-danger`: border color accent.
- `--color-text`: text color.

## Usage

Wrap the root application in `ErrorBoundary`:

```tsx
import ErrorBoundary from './components/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
```

## Migration Notes

- Existing components require no changes; unhandled errors now render the fallback UI.
- Customize the tokens above to align with future theming work.
