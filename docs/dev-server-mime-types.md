# Dev Server MIME Types

The development server now lets Vite determine `Content-Type` headers automatically. This ensures JavaScript modules are served with the correct MIME type and prevents browser warnings.

## Migration Notes

- Remove any manual `Content-Type` overrides from `vite.config.js`.

## Tokens

- None affected.
