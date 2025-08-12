# Contributing

Thank you for your interest in contributing to Zimbo Tauri Character Sheet.

## Prerequisites

- [Node.js](https://nodejs.org/) ≥20 and npm
- [Rust](https://www.rust-lang.org/tools/install) and Cargo
- [Tauri CLI](https://tauri.app/) (`npm install` or `cargo install tauri-cli`)

## Setup

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. _(Optional)_ If you're running the dev server in a container or on a remote host, expose it by setting:

   ```bash
   export TAURI_DEV_HOST=0.0.0.0
   ```

3. Run the linter:

   ```bash
   npm run lint
   ```

4. Run the test suite:

   ```bash
   npm test
   ```

5. Start the application in development mode:

   ```bash
   npm run tauri dev
   ```

## Common Pitfalls

- **Node version**: The project requires Node ≥20. Use a version manager like `nvm` if needed.
- **Rust toolchain**: Tauri builds need a working Rust environment. On Windows, ensure MSVC build tools are installed.
- **Tests**: All tests currently pass. If tests fail locally, confirm dependencies are installed and the Node version is correct.

## Environment Variables

- `TAURI_DEV_HOST` _(optional)_ – set to an IP or hostname to make the dev server reachable on the network.

Please ensure `npm run lint` and `npm test` pass before submitting a pull request.
