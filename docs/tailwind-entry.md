# Tailwind Entry

The application loads Tailwind CSS layers and design tokens from `src/styles/tailwind.css`.

This file first imports `theme.css` so the tokens load before Tailwind's layers. No `:root` overrides live here; `theme.css` defines the cosmic-v2 palette.
