# Compact Mode

Token: `screen.sm` = `768px`

The `compactMode` state triggers a single-column layout for small screens. It now uses a safe initializer that falls back to `false` when `window` is unavailable, preventing server-side rendering errors.

## Usage

- `isCompactWidth` checks `window.innerWidth` against `screen.sm`.
- `compactMode` uses `isCompactWidth` as its state initializer.

## Migration Notes

- Replace direct width checks with `isCompactWidth`.
- No action required for consumers; behavior is backward compatible.
