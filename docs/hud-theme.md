# HUD Theme Tokens

The heads-up display (HUD) uses a small set of CSS custom properties to keep spacing,
radius and animation speeds consistent across components. These tokens live in
[`src/styles/theme.css`](../src/styles/theme.css) and can be overridden per theme.

| Token                   | Description                                    | Default (cosmic-v2 & legacy) |
| ----------------------- | ---------------------------------------------- | ---------------------------- |
| `--hud-radius`          | Corner rounding for panels and containers      | `0.75rem`                    |
| `--hud-radius-sm`       | Corner rounding for buttons and small elements | `0.375rem`                   |
| `--hud-spacing`         | Standard padding for panels                    | `1.25rem`                    |
| `--hud-spacing-sm`      | Compact padding for inner elements             | `0.625rem`                   |
| `--hud-transition-fast` | Quick animations                               | `all 150ms ease-in-out`      |
| `--hud-transition`      | Default animations                             | `all 300ms ease-in-out`      |
| `--hud-transition-slow` | Emphasized animations                          | `all 500ms ease-in-out`      |
| `--font-heading`        | Typeface used for headings                     | `'Montserrat', sans-serif`   |
| `--font-body`           | Typeface used for body text                    | `'Inter', sans-serif`        |
| `--space-sm`            | General small spacing                          | `0.5rem`                     |
| `--space-md`            | General medium spacing                         | `1rem`                       |
| `--space-lg`            | General large spacing                          | `1.5rem`                     |

Use these tokens within HUD components to guarantee visual consistency:

```css
.panel {
  border-radius: var(--hud-radius);
  padding: var(--hud-spacing);
  transition: var(--hud-transition);
}
```

Both the default `cosmic-v2` and `legacy` themes share these values. Custom themes can override
the variables under their own `[data-theme]` selector.
