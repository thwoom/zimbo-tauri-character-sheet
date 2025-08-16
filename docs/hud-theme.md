# HUD Theme Tokens

The heads-up display (HUD) uses a small set of CSS custom properties to keep spacing,
radius and animation speeds consistent across components. These tokens live in
[`src/styles/theme.css`](../src/styles/theme.css) and can be overridden per theme.

| Token                   | Description                                    | Default                    | Classic                    | Moebius                      |
| ----------------------- | ---------------------------------------------- | -------------------------- | -------------------------- | ---------------------------- |
| `--hud-radius`          | Corner rounding for panels and containers      | `0.75rem`                  | `0.5rem`                   | `0.75rem`                    |
| `--hud-radius-sm`       | Corner rounding for buttons and small elements | `0.375rem`                 | `0.25rem`                  | `0.375rem`                   |
| `--hud-spacing`         | Standard padding for panels                    | `1.25rem`                  | `1rem`                     | `1.5rem`                     |
| `--hud-spacing-sm`      | Compact padding for inner elements             | `0.625rem`                 | `0.5rem`                   | `0.75rem`                    |
| `--hud-transition-fast` | Quick animations                               | `all 150ms ease-in-out`    | `all 100ms ease-in-out`    | `all 200ms ease-in-out`      |
| `--hud-transition`      | Default animations                             | `all 300ms ease-in-out`    | `all 250ms ease-in-out`    | `all 350ms ease-in-out`      |
| `--hud-transition-slow` | Emphasized animations                          | `all 500ms ease-in-out`    | `all 400ms ease-in-out`    | `all 600ms ease-in-out`      |
| `--font-heading`        | Typeface used for headings                     | `'Montserrat', sans-serif` | `'Georgia', serif`         | `'Trebuchet MS', sans-serif` |
| `--font-body`           | Typeface used for body text                    | `'Inter', sans-serif`      | `'Times New Roman', serif` | `'Verdana', sans-serif`      |
| `--space-sm`            | General small spacing                          | `0.5rem`                   | `0.5rem`                   | `0.75rem`                    |
| `--space-md`            | General medium spacing                         | `1rem`                     | `1rem`                     | `1.5rem`                     |
| `--space-lg`            | General large spacing                          | `1.5rem`                   | `1.5rem`                   | `2.25rem`                    |

Use these tokens within HUD components to guarantee visual consistency:

```css
.panel {
  border-radius: var(--hud-radius);
  padding: var(--hud-spacing);
  transition: var(--hud-transition);
}
```

Light themes such as `classic` and `moebius` override the tokens to provide
subtle differences in spacing and motion. Custom themes can do the same by
redefining these variables under their own `[data-theme]` selector.
