# Design Tokens

These tokens are exposed via CSS variables and mapped into Tailwind for
utility classes. Themes may override any variable to adjust appearance
without changing component markup.

## CSS Variables

- `--fg`: foreground text color
- `--bg`: background color
- `--accent`: primary accent color
- `--muted` / `--muted-foreground`: muted surfaces and their text color
- `--card` / `--card-foreground`: card surfaces and their text color
- `--radius` / `--radius-sm`: standard and small border radius
- `--spacing-sm` / `--spacing-md` / `--spacing-lg`: spacing scale
- `--shadow`: base shadow
- `--glow-shadow`: accent glow color

## Tailwind Mapping

Tailwind reads the variables and exposes them as semantic utilities:

```js
// tailwind.config.js
colors: {
  fg: 'var(--fg)',
  bg: 'var(--bg)',
  accent: 'var(--accent)',
  muted: 'var(--muted)',
  card: 'var(--card)'
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
