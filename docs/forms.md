# Forms Styling

This project uses the [`@tailwindcss/forms`](https://github.com/tailwindlabs/tailwindcss-forms) plugin to provide a consistent baseline for form elements. The plugin resets default browser styles and maps controls to the design tokens defined in `tailwind.config.js`.

- Inputs, selects, textareas, and checkboxes inherit typography and spacing from Tailwind utilities.
- Additional component-level styling should rely on the existing design tokens for colors, radii, and motion.

See `docs/ux-upgrade-plan.md` (version 0.2.0) for the broader context of form and button primitive upgrades.
