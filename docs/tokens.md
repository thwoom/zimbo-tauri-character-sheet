# Design Tokens

These tokens are exposed via CSS variables and mapped into Tailwind for
utility classes. Themes may override any variable to adjust appearance
without changing component markup.

## CSS Variables

- `--fg`: foreground text color
- `--bg`: background color
- `--accent`: primary accent color
- `--muted`: muted foreground color
- `--card`: card background color
- `--radius` / `--radius-sm`: standard and small border radius
- `--spacing-sm` / `--spacing-md` / `--spacing-lg`: spacing scale
- `--shadow`: base shadow
- `--color-tauri-yellow` / `--color-tauri-cyan`: Tauri brand colors
- `--color-vite-blue` / `--color-vite-purple` / `--color-vite-yellow-light` / `--color-vite-yellow` / `--color-vite-orange`: Vite brand gradient colors
- `--color-react`: React brand color
- `--color-status-poison`: poison status green
- `--color-avatar-default`: default avatar gray
- `--color-black`: base black tone

## Tailwind Mapping

Tailwind reads the variables and exposes them as semantic utilities:

```js
// tailwind.config.js
colors: {
  fg: 'hsl(var(--fg) / <alpha-value>)',
  bg: 'hsl(var(--bg) / <alpha-value>)',
  accent: 'hsl(var(--accent) / <alpha-value>)',
  muted: 'hsl(var(--muted) / <alpha-value>)',
  card: 'hsl(var(--card) / <alpha-value>)'
},
spacing: {
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)'
},
borderRadius: {
  DEFAULT: 'var(--radius)',
  sm: 'var(--radius-sm)'
},
boxShadow: {
  DEFAULT: 'var(--shadow)',
  glow: '0 0 8px var(--glow-shadow)'
}
```

Use these utilities in components to stay aligned with the design system.
