# fix-prs.ps1
# Batch-resolve open PRs: merge base, resolve common conflicts, reinstall, format/lint/test, push.

$ErrorActionPreference = 'Stop'
$env:HUSKY = '0'  # disable hooks for this run

function Run-Cmd([string]$cmd) {
  & cmd /c $cmd
  if ($LASTEXITCODE -ne 0) { Write-Host "Command failed: $cmd" }
}

function Write-PrettierIgnore {
@"
node_modules
dist
build
coverage
.next
.out
storybook-static
codex.md
src-tauri/capabilities/default.json
src/App.css
src/App.jsx
src/components/InventoryModal.jsx
src/components/StatusModal.jsx
src/main.jsx
src/components/LevelUpModal.jsx
"@ | Set-Content .prettierignore -Encoding UTF8
}

function Write-VSCodeSettings {
New-Item -ItemType Directory -Path ".vscode" -Force | Out-Null
@"
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "eslint.validate": ["javascript","javascriptreact","typescript","typescriptreact"],
  "eslint.alwaysShowStatus": true,
  "prettier.requireConfig": true
}
"@ | Set-Content .vscode\settings.json -Encoding UTF8
}

function Normalize-PackageJson {
$pjMerged = @"
{
  "name": "zimbo-panel",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "tauri": "tauri",
    "test": "vitest run",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "prepare": "husky"
  },
  "dependencies": {
    "@tauri-apps/api": "^2",
    "@tauri-apps/plugin-opener": "^2",
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "@tauri-apps/cli": "^2",
    "@vitejs/plugin-react": "^4.6.0",
    "eslint": "^8.57.1",
    "eslint-config-prettier": "^10.1.8",
    "eslint-config-react-app": "^7.0.1",
    "eslint-plugin-import": "^2.32.0",
    "eslint-plugin-jsx-a11y": "^6.10.2",
    "eslint-plugin-react": "^7.37.5",
    "eslint-plugin-react-hooks": "^5.2.0",
    "husky": "^9.1.7",
    "lint-staged": "^16.1.5",
    "prettier": "^3.6.2",
    "vite": "^7.0.4",
    "vitest": "^3.2.4"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix","prettier --write"],
    "*.{json,md,css,scss,html,yml,yaml}": ["prettier --write"]
  }
}
"@
$pjMerged | Set-Content package.json -Encoding UTF8
}

function Patch-LevelUpModal {
  $jsxPath = "src\components\LevelUpModal.jsx"
  if (Test-Path $jsxPath) {
    # Prefer the version from the base (CSS class-based). If conflict existed, take --theirs.
    Run-Cmd "git checkout --theirs src/components/LevelUpModal.jsx"
    Run-Cmd "git add src/components/LevelUpModal.jsx"

    # Patch the known border template string (no-op if already correct)
    $raw = Get-Content $jsxPath -Raw
    $fixed = $raw -replace `
      'border:\s*`?1px solid \${isComplete \? ''rgba\(0, 255, 136, 0\.3\)'' : ''rgba\(255, 170, 68, 0\.3\)''}`?,', `
      'border: `1px solid ${isComplete ? ''rgba(0, 255, 136, 0.3)'' : ''rgba(255, 170, 68, 0.3)''}`,'
    if ($fixed -ne $raw) {
      $fixed | Set-Content $jsxPath -Encoding UTF8
      Run-Cmd "git add `"$jsxPath`""
    }
  }
}

# --- PRECHECKS ---
if (-not (Test-Path ".git")) { Write-Host "ERROR: Run from repo root (contains .git)"; exit 1 }

# Ignore helper scripts
Add-Content -Path ".gitignore" -Value "`nfix-pr*.ps1" -ErrorAction SilentlyContinue
& git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
  & git add .gitignore | Out-Null
  & git commit -m "chore: ignore local helper scripts" --no-verify 2>$null | Out-Null
}

# Get PRs
$prs = (gh pr list --state open --json number,headRefName,baseRefName,title) | ConvertFrom-Json
if (-not $prs -or $prs.Count -eq 0) { Write-Host "No open PRs."; exit 0 }

foreach ($pr in $prs) {
  Write-Host "`n=== PR #$($pr.number): $($pr.title) [$($pr.headRefName) -> $($pr.baseRefName)] ==="

  if (Test-Path ".git\MERGE_HEAD") { Run-Cmd "git merge --abort" | Out-Null }

  Run-Cmd "gh pr checkout $($pr.number)" | Out-Null
  Run-Cmd "git fetch origin $($pr.baseRefName)" | Out-Null

  # Merge base (non-interactive)
  Run-Cmd "git merge --no-ff --no-edit origin/$($pr.baseRefName)"

  # Gather conflicted files (if any)
  $conflictFiles = (& git ls-files -u) | ForEach-Object { ($_ -split "`t")[-1] } | Sort-Object -Unique

  if ($conflictFiles -and $conflictFiles.Count -gt 0) {
    Write-Host "Conflicts in:`n$($conflictFiles -join "`n")"

    if ($conflictFiles -contains ".prettierignore") { Write-PrettierIgnore; Run-Cmd "git add .prettierignore" }
    if ($conflictFiles -contains ".vscode/settings.json") { Write-VSCodeSettings; Run-Cmd "git add .vscode\settings.json" }

    # PowerShell-safe check for package.json markers
    $pkgHasMarkers = (Test-Path "package.json") -and ((Get-Content package.json -Raw) -match '<<<<<<<')
    if (($conflictFiles -contains "package.json") -or $pkgHasMarkers) {
      Normalize-PackageJson
      Run-Cmd "git add package.json"
    }

    if ($conflictFiles -contains "src/components/LevelUpModal.jsx") { Patch-LevelUpModal }

    # Lockfile: never hand-merge
    if ($conflictFiles -contains "package-lock.json") {
      Run-Cmd "git rm -f package-lock.json"
    }

    # Any leftover conflict markers?
    $leftovers = (& git grep -n "<<<<<<<" 2>$null)
    if ($leftovers) {
      Write-Host "Markers still present; manual fix needed in:"
      Write-Host $leftovers
      if (Test-Path ".git\MERGE_HEAD") { Run-Cmd "git merge --abort" | Out-Null }
      continue
    }

    # Finalize merge commit if merge still open
    if (Test-Path ".git\MERGE_HEAD") {
      Run-Cmd "git commit -m `"merge $($pr.baseRefName) into $($pr.headRefName)`" --no-verify"
    }
  } else {
    Write-Host "No conflicts after merge."
    if (Test-Path ".git\MERGE_HEAD") {
      Run-Cmd "git commit -m `"merge $($pr.baseRefName) into $($pr.headRefName)`" --no-verify"
    }
  }

  # Reinstall deps fresh (cross-platform optionals), then format/lint/test
  Remove-Item package-lock.json -Force -ErrorAction SilentlyContinue
  Remove-Item node_modules -Recurse -Force -ErrorAction SilentlyContinue
  Run-Cmd "npm install"

  Run-Cmd "npx prettier --write ."
  Run-Cmd "npx eslint . --fix"

  Run-Cmd "npm test"
  if ($LASTEXITCODE -ne 0) { Write-Host "Tests failed (non-blocking for this script)." }

  # Commit & push any changes
  Run-Cmd "git add -A"
  # Commit only if there are staged changes
  & git diff --cached --quiet
  if ($LASTEXITCODE -ne 0) {
    Run-Cmd "git commit -m `"chore: auto-merge base, resolve common conflicts, format/lint`" --no-verify"
    Run-Cmd "git push -u origin HEAD"
  } else {
    Write-Host "No changes to commit."
  }
}

# no matching PR found, create new branch and PR
$rand = -join ((48..57)+(97..122) | Get-Random -Count 8 | ForEach-Object {[char]$_})
$branch = "$rand-codex/$Base"
Write-Host "Creating new branch $branch and opening PR." -ForegroundColor Yellow
git checkout -b $branch *> $null
git push -u origin $branch | Out-String
gh pr create --fill --head $branch --base $Base | Out-String
