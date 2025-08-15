# Zimbo Tauri Character Sheet

A cross-platform desktop application for managing tabletop RPG characters. Built with [Tauri](https://tauri.app/), [React](https://react.dev/), and [Vite](https://vitejs.dev/), it runs natively on Windows, macOS, and Linux.

## Features

- **Character Management** – Track stats like HP, XP, level, bonds, debilities, and status effects.
- **Dice Roller** – Roll dice with modifiers, view history, and auto-apply XP on misses.
- **Inventory System** – Equip, consume, or drop items; calculates total armor and weapon damage.
- **Session Notes** – Take persistent notes, switch between compact and full modes.
- **Undo/History** – Reverse recent actions with a built-in undo system.
- **Visual Effects** – Status-based overlays (poisoned, burning, shocked, etc.).
- **Theme Switching** – Select from cosmic, classic, or moebius themes.
- **Cross-Platform Packaging** – Create native binaries via Tauri.

## Settings

Open the Settings panel from the toolbar to customize your experience:

- **Theme** – Switch between cosmic, classic, or moebius. The choice is saved for future sessions.
- **Auto XP on miss** – Enable this checkbox to automatically gain XP when a roll misses. Uncheck to track XP manually.

## Performance HUD (development only)

To display render metrics in the bottom-right corner while developing:

1. Create a `.env` file with `VITE_SHOW_PERFORMANCE_HUD=true`.
2. Run `npm run dev`.

The overlay appears during development builds only and is ignored in production.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >=20 and npm
- [Rust](https://www.rust-lang.org/tools/install) and Cargo
- Tauri CLI (`npm install` or `cargo install tauri-cli`)

### Install dependencies

```bash
npm install
```

### Install git hooks

This project uses [pre-commit](https://pre-commit.com/) to run linters, formatters,
and tests on each commit. After installing dependencies, set up the hooks with:

```bash
pre-commit install
```

Run all checks manually at any time with:

```bash
pre-commit run --all-files
```

### Run in development

```bash
npm run tauri dev
```

### Browser development

Start Vite's dev server in the browser without Tauri:

```bash
npm run dev
```

Use this for UI work—features that depend on Tauri APIs (like reading or writing local files) won't function in this mode.

### Build web assets

```bash
npm run build
```

### Run tests

```bash
npm test
```

### End-to-end tests

Build a debug bundle for Playwright to target:

```bash
npx tauri build --debug
```

Ensure Playwright's browsers are installed:

```bash
npx playwright install
```

Run the end-to-end suite:

```bash
npm run test:e2e
```

### Sync with GitHub

```bash
npm run sync
```

This wraps the `git-sync-ask.sh` script to fetch, commit, and push changes with confirmation.

### Package for production

```bash
npm run tauri build
```

The command above bundles the application and produces platform-specific installers in
`src-tauri/target/release/bundle/<platform>/`.

1. Run the installer for your operating system (e.g., `.msi`, `.dmg`, `.AppImage`/`.deb`) and follow the prompts.
2. Launch the installed application and confirm the main window appears. Try creating or loading a character and rolling dice to verify basic functionality.

Logs are written to OS-specific locations such as `~/.local/share/zimbo-panel/logs` on Linux, `~/Library/Logs/zimbo-panel` on macOS, or `%APPDATA%\zimbo-panel\logs` on Windows. Running the app from a terminal will also display any runtime messages.

If you encounter issues, capture the relevant logs or console output and [open an issue](../../issues) describing the problem.

## Screenshots

_Add screenshots or GIFs demonstrating character stats, dice roller, and inventory panels._

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed setup, linting, and testing instructions.

1. Fork the repository.
2. Create a branch for your feature or fix.
3. Submit a pull request with a clear description of changes.

## Development scripts

Optional helper scripts can be kept in a local `scripts/` directory. This folder is ignored by Git and is not required for building or running the project.

## License

This project is licensed under a custom Non-Commercial License; commercial use requires prior written permission. See [LICENSE](LICENSE) for details.
