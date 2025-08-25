# 🤖 Complete Auto Pipeline for All PRs
# This script runs the full automation pipeline on all open PRs in the correct order

Write-Host "🚀 Starting Complete Auto Pipeline for All Open PRs..." -ForegroundColor Green

# Step 1: Get all open PRs
Write-Host "📋 Step 1: Fetching open PRs..." -ForegroundColor Cyan
$prs = gh pr list --state open --json number,title --jq '.[].number' | Out-String
if ([string]::IsNullOrWhiteSpace($prs)) {
    Write-Host "✅ No open PRs found" -ForegroundColor Green
    exit 0
}
$prArray = $prs.Trim().Split("`n")
Write-Host "📋 Found $($prArray.Count) open PRs" -ForegroundColor Cyan

# Step 2: Run analysis on all PRs
Write-Host "📊 Step 2: Running analysis on all PRs..." -ForegroundColor Blue
foreach ($pr in $prArray) {
    if ([string]::IsNullOrWhiteSpace($pr)) { continue }
    Write-Host "  📊 Analyzing PR #$pr..." -ForegroundColor Yellow
    gh workflow run centralized-pr-automation.yml --field action=analyze --field pr_number=$pr
    Start-Sleep -Seconds 3
}

# Step 3: Run auto-fixes on all PRs
Write-Host "🔧 Step 3: Applying auto-fixes to all PRs..." -ForegroundColor Blue
foreach ($pr in $prArray) {
    if ([string]::IsNullOrWhiteSpace($pr)) { continue }
    Write-Host "  🔧 Fixing PR #$pr..." -ForegroundColor Yellow
    gh workflow run centralized-pr-automation.yml --field action=fix --field pr_number=$pr
    Start-Sleep -Seconds 3
}

# Step 4: Resolve conflicts and merge all PRs
Write-Host "🔀 Step 4: Resolving conflicts and merging all PRs..." -ForegroundColor Blue
Write-Host "  🔀 Running conflict resolution with dry_run=false..." -ForegroundColor Yellow
gh workflow run "Resolve ALL PRs (policy merge)" --field dry_run=false

# Step 5: Wait for conflict resolution to complete
Write-Host "⏳ Step 5: Waiting for conflict resolution to complete..." -ForegroundColor Blue
Start-Sleep -Seconds 30

# Step 6: Run auto-merge pipeline on all PRs
Write-Host "🚀 Step 6: Running auto-merge pipeline on all PRs..." -ForegroundColor Blue
foreach ($pr in $prArray) {
    if ([string]::IsNullOrWhiteSpace($pr)) { continue }
    Write-Host "  🚀 Auto-merging PR #$pr..." -ForegroundColor Yellow
    gh workflow run "🤖 Auto Pipeline" --field pr_number=$pr --field auto_merge=true
    Start-Sleep -Seconds 3
}

Write-Host "🎉 Complete Auto Pipeline finished!" -ForegroundColor Green
Write-Host "📊 Check the GitHub Actions tab to see results" -ForegroundColor Cyan
Write-Host "🔍 Monitor PRs for auto-merging..." -ForegroundColor Cyan
