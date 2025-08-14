# Color Tokens

This project uses semantic color tokens defined in `src/styles/theme.css`.
When adding or updating colors:

- **Aim for WCAG AA contrast.** Text and interactive elements should meet at least a 4.5:1 contrast ratio against their backgrounds.
- **Check with tools** such as [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) or browser devtools.
- **Use semantic variables** like `--color-success`, `--color-warning`, `--color-danger`, and `--color-info` instead of raw color values.
- Provide light/dark variants as needed to ensure readability across themes.
