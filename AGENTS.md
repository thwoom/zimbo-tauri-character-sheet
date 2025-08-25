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
- `npm run test` – Vitest unit tests.
- `npm run test:e2e` – end-to-end tests (requires WebKitWebDriver).
- `pre-commit run --all-files` – run prettier, eslint, and vitest hooks.

## Development Server Management

**Critical**: Prevent multiple server instances that consume resources and cause port conflicts.

### Starting Development Servers

**Choose ONE development mode:**

```bash
# Browser-only development (faster iteration)
npm run dev

# Full Tauri app development (complete feature testing)
npm run tauri dev
```

**Never run both simultaneously** - this creates resource conflicts and port issues.

### Stopping Development Servers

**Before starting new servers, always clean up existing ones:**

#### Windows (PowerShell)

**Method 1: Task Manager (Recommended)**

1. Open **Task Manager** (Ctrl+Shift+Esc)
2. Go to **Details** tab
3. Look for and end these processes:
   - `node.exe`
   - `npm.exe`
   - Any processes with "vite" or "tauri" in command line
4. Right-click → **End Task**

**Method 2: Command Line (pager-safe)**

```powershell
# Simple direct kill (if you know there are Node processes)
taskkill /F /IM node.exe

# Then start your desired server
npm run dev
```

**✅ Pager Issue Resolved**: Set `$env:GITHUB_PAGER=""` and `gh config set pager cat` to prevent pager blocking in automated environments.

#### macOS/Linux

```bash
# Kill processes by port (if you know the port)
kill -9 $(lsof -ti:1420)  # Default Vite port
kill -9 $(lsof -ti:3000)  # Alternative port

# Kill all Node processes (nuclear option)
pkill -f node
pkill -f npm

# Then start your desired server
npm run dev
```

### Server Port Management

- **Vite dev server**: Usually runs on `http://localhost:1420`
- **Tauri dev**: Runs Vite + Tauri wrapper
- **Preview server**: Runs on different port (usually 4173)

### Best Practices

1. **One Server Rule**: Only run one development server at a time
2. **Clean Shutdown**: Use `Ctrl+C` to properly stop servers before starting new ones
3. **Port Conflicts**: If you get "port already in use" errors, kill existing processes first
4. **Resource Monitoring**: Multiple servers consume significant CPU/memory
5. **Process Cleanup**: When switching between `dev` and `tauri dev`, always stop the previous server

### Troubleshooting Multiple Instances

**Symptoms:**

- "Port already in use" errors
- Slow system performance
- Multiple Vite processes in Task Manager/Activity Monitor
- Hot reload not working properly

**Solution:**

1. Stop all development servers (`Ctrl+C` in all terminals)
2. Run the cleanup commands above
3. Wait 5-10 seconds for processes to fully terminate
4. Start only the server you need

### AI Agent Server Management

**When managing development servers:**

1. Always check for existing processes before starting new ones
2. Provide cleanup commands when restarting servers
3. Use background processes (`is_background: true`) for long-running dev servers
4. Document which server type is being used and why

**⚠️ Critical for AI Agents:**

- **Pager Issue Resolved**: Set `$env:GITHUB_PAGER=""` and `gh config set pager cat` to prevent pager blocking
- **Avoid commands that trigger pagers** (`Get-Process | Where-Object`, `tasklist | findstr`, etc.)
- **Use direct commands** like `taskkill /F /IM node.exe` instead
- **If commands get stuck in pagers**, recommend manual Task Manager approach
- **Always provide fallback manual instructions** for users

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

## AI Agent Reporting Standards

When making significant changes, AI agents must provide comprehensive documentation following this structure:

### 🔍 Investigation Report

- **Problem Analysis**: Root cause identification with technical details
- **Current State Assessment**: What's broken/suboptimal and why
- **Impact Analysis**: How issues affect functionality, performance, or UX
- **Visual Diagrams**: Architecture/flow illustrations using Mermaid when relevant

### 🛠️ Implementation Report

- **Changes Made**: Detailed list of all modifications by file
- **Code Comparisons**: Before/after snippets for critical changes
- **File Breakdown**: Exact locations and nature of updates
- **Dependencies**: Any new packages or version changes

### ✅ Results Report

- **Visual Impact**: What the user will see/experience differently
- **Functional Improvements**: How behavior and capabilities change
- **Performance Impact**: Speed, efficiency, or resource usage improvements
- **Testing Verification**: Confirmation that changes work as intended

### 📊 Summary Dashboard

- **Task Completion**: All work items with clear status
- **Key Metrics**: Measurable improvements (load time, bundle size, etc.)
- **Next Steps**: Follow-up recommendations or technical debt notes

### When to Provide Full Reports

- ✅ **Always**: Layout/UI changes, new features, bug fixes, refactoring, architecture updates
- ⚡ **Quick Summary**: Simple fixes, config changes, documentation updates
- 🎯 **On Request**: Any work between the above categories

This standard ensures thorough documentation, provides context for future maintenance, and demonstrates the value of changes made.

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
