# Contributor Guidelines

This repository's conventions keep contributions consistent. Update this file whenever practices change so everyone stays aligned.

## Style Preferences

- Format code with Prettier using the settings in `.prettierrc`.
- Lint using ESLint with the config in `.eslintrc.cjs`.
- Follow existing patterns in the codebase for naming, imports, and structure.

## Required Commands

Run these checks before submitting changes:

- `npm run lint` – lint all source files.
- `npm test` – execute the test suite with Vitest when code changes.

## Pull Request Conventions

- Use Conventional Commit messages.
- Provide clear PR descriptions that reference related issues.
- Include updates to documentation, tests, and configuration files when they are affected.

## Areas Requiring Extra Care

- `src` – core application code; ensure accompanying tests exist or are updated.
- `src-tauri` – Tauri backend; verify platform-specific behavior.
- `docs` – project documentation; keep examples accurate.
- Configuration files (`package.json`, `vite.config.js`, `.eslintrc.cjs`, `.prettierrc`) must remain consistent.

---

Keep this file current with project practices to maintain contributor alignment.
