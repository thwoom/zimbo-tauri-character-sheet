Param([string]$Branch,[string]$Message)
$ErrorActionPreference = "Stop"
git rev-parse --is-inside-work-tree | Out-Null
if (-not $Branch) { $Branch = (git rev-parse --abbrev-ref HEAD) 2>$null; if (-not $Branch) { $Branch = "main" } }
try { git rev-parse --abbrev-ref --symbolic-full-name "@{u}" | Out-Null } catch { git branch --set-upstream-to "origin/$Branch" $Branch | Out-Null }
git fetch origin $Branch | Out-Null
Write-Host "=== Preflight ==="
Write-Host "Branch: $Branch"
git status --short
Write-Host ""
Write-Host "Diff vs origin/$Branch (summary):"
git --no-pager diff --stat "origin/$Branch"...HEAD
Write-Host "================="
Write-Host ""
$answer = Read-Host "Sync with GitHub now? (y/N)"
if ($answer -notin @("y","Y","yes","YES","Yes")) { Write-Host "Sync skipped."; exit 0 }
if (-not $Message) { $d="Quick sync"; $i=Read-Host "Commit message [$d]"; $Message=([string]::IsNullOrWhiteSpace($i))?$d:$i }
git stash -q --include-untracked | Out-Null
if (-not (git pull --rebase origin $Branch)) { Write-Host "Pull/rebase failed. Resolve conflicts and re-run."; exit 1 }
git stash pop -q | Out-Null
$hasWorkTree = -not (git diff --quiet)
$hasIndex    = -not (git diff --cached --quiet)
if ($hasWorkTree -or $hasIndex) {
  git add -A
  if (-not (git diff --cached --quiet)) { git commit -m "$Message" | Out-Null } else { Write-Host "Nothing staged to commit." }
} else { Write-Host "No local changes to commit." }
git push origin $Branch
Write-Host "Sync complete."
