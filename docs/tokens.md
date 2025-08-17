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
- `--glow-shadow`: glow shadow

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
