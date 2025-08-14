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

6. For browser-only development, start Vite without Tauri:

   ```bash
   npm run dev
   ```

   This mode lacks Tauri features like local file I/O.

## Common Pitfalls

- **Node version**: The project requires Node ≥20. Use a version manager like `nvm` if needed.
- **Rust toolchain**: Tauri builds need a working Rust environment. On Windows, ensure MSVC build tools are installed.
- **Tests**: All tests currently pass. If tests fail locally, confirm dependencies are installed and the Node version is correct.

## Environment Variables

- `TAURI_DEV_HOST` _(optional)_ – set to an IP or hostname to make the dev server reachable on the network.

## PR Maintenance Scripts

Helper scripts automate PR updates and branch syncing. They require:

- [GitHub CLI](https://cli.github.com/) (`gh`) configured with access to the repository.
- A shell capable of running PowerShell (`pwsh`) or Bash.
- [Node.js](https://nodejs.org/) to run project tooling within each branch.

### fix-prs.ps1

Runs formatting and tests for a single pull request, then pushes the changes.

```powershell
pwsh ./fix-prs.ps1 123
```

Expected: PR #123 is checked out, lint fixes and tests run, and commits are pushed back to the branch.

### fix-all-prs.ps1

Iterates through all open pull requests and applies the `fix-prs.ps1` workflow to each.

```powershell
pwsh ./fix-all-prs.ps1
```

Expected: every open PR receives the latest formatting and test updates.

### git-sync-ask

Interactively synchronize your current branch with the main branch.

```bash
git sync-ask main
```

Expected: the script prompts before pulling and rebasing, then pushes the updated branch if confirmed.

Please ensure `npm run lint` and `npm test` pass before submitting a pull request.
