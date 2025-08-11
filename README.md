# Zimbo Tauri Character Sheet

A cross-platform desktop application for managing tabletop RPG characters. Built with [Tauri](https://tauri.app/), [React](https://react.dev/), and [Vite](https://vitejs.dev/), it runs natively on Windows, macOS, and Linux.

## Features

- **Character Management** – Track stats like HP, XP, level, bonds, debilities, and status effects.
- **Dice Roller** – Roll dice with modifiers, view history, and auto-apply XP on misses.
- **Inventory System** – Equip, consume, or drop items; calculates total armor and weapon damage.
- **Session Notes** – Take persistent notes, switch between compact and full modes.
- **Undo/History** – Reverse recent actions with a built-in undo system.
- **Visual Effects** – Status-based overlays (poisoned, burning, shocked, etc.).
- **Cross-Platform Packaging** – Create native binaries via Tauri.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) and npm
- [Rust](https://www.rust-lang.org/tools/install) and Cargo
- Tauri CLI (`npm install` or `cargo install tauri-cli`)

### Install dependencies

```bash
npm install
```

### Run in development

```bash
npm run tauri dev
```

### Build web assets

```bash
npm run build
```

### Run tests

```bash
npm test
```

### Package for production

```bash
npm run tauri build
```

## Screenshots

_Add screenshots or GIFs demonstrating character stats, dice roller, and inventory panels._

## Contributing

1. Fork the repository.
2. Create a branch for your feature or fix.
3. Submit a pull request with a clear description of changes.


## License


This project is licensed under a custom Non-Commercial License; commercial use requires prior written permission. See [LICENSE](LICENSE) for details.
