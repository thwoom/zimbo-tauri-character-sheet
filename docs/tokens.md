# Design Tokens

These tokens are exposed via CSS variables and mapped into Tailwind for
utility classes. Themes may override any variable to adjust appearance
without changing component markup. Currently available themes are `legacy`
and `cosmic-v2`.

## CSS Variables

- `--fg`: foreground text color
- `--bg`: background color
- `--accent`: primary accent color
- `--muted` / `--muted-foreground`: muted surfaces and their text color
- `--card` / `--card-foreground`: card surfaces and their text color
- `--color-neon` / `--color-neon-dark`: neon accent pair
- `--shadow-neon`: neon glow
- `--glass-bg` / `--glass-border`: translucent panel surfaces
- `--shadow-glass`: depth for glass backdrops
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
  card: 'var(--card)',
  glass: 'var(--glass-bg)',
  neon: 'var(--color-neon)'
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
  glow: '0 0 8px var(--glow-shadow)',
  glass: 'var(--shadow-glass)',
  neon: 'var(--shadow-neon)'
}
```

Use these utilities in components to stay aligned with the design system.

## Motion Tokens

JavaScript animations use centralized timing and easing presets defined in
`src/motion/tokens.ts`:

- `durations.xs` `120ms`
- `durations.sm` `160ms`
- `durations.md` `220ms`
- `durations.lg` `320ms`
- `easings.standard` cubic-bezier(0.4, 0, 0.2, 1)
- `easings.emphasized` cubic-bezier(0.2, 0, 0, 1)
- `spring` preset for interactive elements

Always reference these tokens instead of hardcoding values.

Use Framer Motion's `AnimatePresence` with the shared `fadeScale` variants and the
`useMotionTransition`/`useMotionVariants` helpers from
`src/motion/reduced.ts` to automatically drop durations to `0ms` when users
prefer reduced motion.
