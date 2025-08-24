# AI Agent Guide

This document provides machine-readable instructions for contributing to the ZimboMate repository.

## Project Overview

- **Purpose**: Desktop companion for Dungeon World players providing character management, dice rolling, inventory, notes, and more.
- **Tech stack**: React 18 + TypeScript, Vite, Tauri 2 (Rust backend), Vitest for unit tests, WebdriverIO + Tauri driver for end-to-end tests.
- **Key directories**:
  - `src` – React front-end.
  - `src-tauri` – Rust/Tauri backend.
  - `tests` – WebdriverIO end-to-end tests.

## Setup Instructions

1. Requirements: Node.js ≥20, npm, Rust/Cargo, Tauri CLI, glib-2.0 dev headers, WebKitWebDriver.
2. Install dependencies:
   ```bash
   npm install
   pre-commit install
   ```
3. Optional environment file for development features:
   - Create `.env` and set `VITE_SHOW_PERFORMANCE_HUD=true` to display the performance HUD.

## Build & Test Commands

Run these from the repository root:

- `npm run dev` – browser-only dev server.
- `npm run tauri dev` – full app with Tauri shell.
- `npm run build` – production build (required before PR).
- `npm run preview` – serve built assets.
- `npm run lint` – ESLint.
- `npm run lint:fix` – fix lint issues.
- `npm run format:check` – verify Prettier formatting.
- `npm run format` – apply Prettier formatting.
- `npm test` – Vitest unit tests.
- `npm run test:e2e` – end-to-end tests (requires WebKitWebDriver).
- `pre-commit run --all-files` – run prettier, eslint, and vitest hooks.

## Code Style & Conventions

- Prettier rules in `.prettierrc`: single quotes, trailing commas, print width 100, semicolons, LF line endings.
- ESLint config in `eslint.config.js` uses React, JSX a11y, import ordering, and TypeScript rules.
- Maintain alphabetical import order and avoid newlines between groups.
- Use TypeScript (`.ts`/`.tsx`) for new code; keep components and hooks colocated.
- Tests reside near source files or under `tests/` for e2e.

## Contribution & PR Guidelines

- Use Conventional Commit messages.
- Branch from `main`; avoid creating additional long‑lived branches.
- Before committing, run:
  ```bash
  npm run lint
  npm test
  npm run format:check
  npm run test:e2e
  npm run build
  ```
- PR descriptions must reference related issues and include updates to docs and tests where relevant.

## Security / Constraints

- Never commit secrets or `.env` files.
- Do not modify files in `node_modules`, `dist`, `coverage`, `src-tauri/target`, or generated assets.
- Respect the fs plugin scope: application can read/write under `$APPDATA/**` only.

## Custom Tools or Scripts

- `npm run watch` – rebuild on source changes.
- `npm run sync` – interactive branch sync via `git-sync-ask.sh`.
- `npm run fix-prs` / `fix-prs.ps1` – auto-format and test pull requests.
- `update-version.mjs` – updates version numbers during release.

## Monorepo / Subproject Instructions

This repo contains both a React app and a Rust/Tauri backend:

- Frontend code lives in `src` and is bundled by Vite.
- Backend code lives in `src-tauri`; Cargo handles builds automatically through Tauri commands.
- End-to-end tests in `tests` launch the built Tauri app.
