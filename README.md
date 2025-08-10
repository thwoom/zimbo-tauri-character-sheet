# Tauri + React

This template should help get you started developing with Tauri and React in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Git Sync Script

The `git-sync-ask.sh` script helps you sync your local work with GitHub. It
prints a preflight summary of the current branch, status, and diff before
asking whether to continue.

### Prompts

1. `Sync with GitHub now? (y/N)` – confirm whether to run the sync.
2. `Commit message [Quick sync]:` – provide a commit message or accept the
   default.

### Example

```bash
# Sync current branch
./git-sync-ask.sh

# Sync a specific branch with a custom commit message
./git-sync-ask.sh main "docs: update readme"
```

The script stashes uncommitted changes, rebases with the remote, commits any
staged files, and pushes to the specified branch.
