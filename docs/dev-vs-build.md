# Development vs. Production Serving

## Vite Dev Server

- `npm run dev` – starts Vite's development server using source modules.
- Hot module replacement (HMR) is enabled.
- Tauri-specific APIs are unavailable in this mode.

## Built Output

- `npm run build` – compiles assets into the `dist/` directory.
- `npm run preview` – serves the built `dist/` folder locally.
- The generated `index.html` loads `/assets/index.<hash>.js`.

## Tokens

No design tokens were added or changed.

## Migration Notes

If you previously served source files directly, ensure `npm run build` is run and the resulting `dist/` directory is served so the script tag resolves to the compiled asset.
