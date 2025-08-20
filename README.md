# Zimbo Panel

A cross-platform desktop application for managing tabletop RPG characters. Built with [Tauri](https://tauri.app/), [React](https://react.dev/), and [Vite](https://vitejs.dev/), it runs natively on Windows, macOS, and Linux.

## Features

- **Character Management** – Track stats like HP, XP, level, bonds, debilities, and status effects.
- **Character Switcher** – Manage multiple characters with easy switching between them.
- **Dice Roller** – Roll dice with modifiers, view history, and auto-apply XP on misses.
- **Floating Dice Button** – Quick access to dice rolling from anywhere in the app.
- **Inventory System** – Equip, consume, or drop items; calculates total armor and weapon damage.
- **Session Notes** – Take persistent notes, switch between compact and full modes.
- **End Session Management** – Properly end sessions with character state management.
- **Level Up System** – Comprehensive character progression with stat and move selection.
- **Status Effects** – Visual status overlays (poisoned, burning, shocked, etc.) with status tray.
- **Command Palette** – Keyboard shortcuts and quick commands for power users.
- **Version History** – Track and manage character versions over time.
- **Printable Character Sheet** – Generate printable versions of character data.
- **Undo/History** – Reverse recent actions with a built-in undo system.
- **Import/Export** – Save or load characters with the `ExportModal`.
- **Theme Switching** – Select from cosmic, classic, or moebius themes, each with distinct fonts, spacing, and motion.
- **Cross-Platform Packaging** – Create native binaries via Tauri.

## Inventory Item Schema

Inventory items are objects with the following fields:

- `id` – unique identifier.
- `name` – display name.
- `type` – one of `weapon`, `armor`, `consumable`, `magic`, `material`, or `gear`.
- `damage` – damage dice string for weapons (e.g. `d8`).
- `armor` – armor bonus for protective gear.
- `quantity` – stack count for consumables and materials.
- `description` – optional text shown in the UI.
- `equipped` – whether the item is currently equipped.
- `tags` – optional array of descriptive strings.

## Saving and Loading a Character

1. Click **Export/Import** in the toolbar.
2. Choose **Export** to save the current character, for example `my-hero.json`.
3. To load it later, reopen **Export/Import**, select **Import**, and pick the saved file.

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
- glib-2.0 development headers and a WebKitWebDriver binary – for example:

  ```bash
  sudo apt install libglib2.0-dev webkit2gtk-driver
  ```

  These packages must be installed before running `npm run test:e2e` or `npm run build`.

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

Ensure `glib-2.0` and `webkit2gtk-driver` are installed (see [Prerequisites](#prerequisites)):

```bash
npm run build
```

### Preview production build

Serve the compiled assets locally to verify the build output:

```bash
npm run preview
```

### Run tests

```bash
npm test
```

### End-to-end tests

Run the end-to-end suite, which builds a debug bundle and drives the app using WebdriverIO and the Tauri driver:

```bash
npm run test:e2e
```

### Code quality

Lint and format your code:

```bash
npm run lint          # Check for linting issues
npm run lint:fix      # Fix auto-fixable linting issues
npm run format:check  # Check Prettier formatting
npm run format        # Format code with Prettier
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

_Add screenshots or GIFs demonstrating character stats, dice roller, inventory panels, and the various modals._

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed setup, linting, and testing instructions.

1. Fork the repository.
2. Create a branch for your feature or fix.
3. Submit a pull request with a clear description of changes.

## Development scripts

Optional helper scripts can be kept in a local `scripts/` directory. This folder is ignored by Git and is not required for building or running the project.

## License

This project is licensed under a custom Non-Commercial License; commercial use requires prior written permission. See [LICENSE](LICENSE) for details.
