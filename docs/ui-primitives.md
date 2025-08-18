# UI Primitives

The project exposes simple building blocks that respect design tokens:

- `Panel` and `Toolbar` render glass surfaces with `backdrop-blur-glass` applied.
- `Card` accepts a `variant` prop (`solid` | `glass`) to switch surfaces while keeping tokenized spacing and radius.

These utilities rely on Tailwind classes mapped to tokens. Use them as starting points for new components.
