# 🛡️ Protect Critical Automation Files
# This script prevents critical automation files from being deleted

Write-Host "🛡️ Checking for critical automation files..." -ForegroundColor Green

$criticalFiles = @(
    ".github/workflows/centralized-pr-automation.yml",
    ".github/workflows/resolve-all-prs.yml", 
    ".github/workflows/auto-pipeline.yml",
    ".github/workflows/auto-process-all-prs.yml",
    "sonar-project.properties",
    "scripts/auto-process-all-prs.ps1"
)

$missingFiles = @()

foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file exists" -ForegroundColor Green
    } else {
        Write-Host "❌ $file is missing!" -ForegroundColor Red
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "🚨 CRITICAL: Missing automation files detected!" -ForegroundColor Red
    Write-Host "Missing files:" -ForegroundColor Yellow
    foreach ($file in $missingFiles) {
        Write-Host "  - $file" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "These files are essential for the automation system." -ForegroundColor Red
    Write-Host "Please restore them immediately!" -ForegroundColor Red
    exit 1
} else {
    Write-Host "🎉 All critical automation files are present!" -ForegroundColor Green
}

# Check if any critical files are staged for deletion
$stagedDeletions = git diff --cached --name-status | Where-Object { $_ -match "^D" }
$criticalDeletions = @()

foreach ($deletion in $stagedDeletions) {
    $fileName = $deletion.Split("`t")[1]
    if ($criticalFiles -contains $fileName) {
        $criticalDeletions += $fileName
    }
}

if ($criticalDeletions.Count -gt 0) {
    Write-Host "🚨 WARNING: Critical files staged for deletion!" -ForegroundColor Red
    Write-Host "The following critical files are staged for deletion:" -ForegroundColor Yellow
    foreach ($file in $criticalDeletions) {
        Write-Host "  - $file" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "To unstage these deletions:" -ForegroundColor Cyan
    Write-Host "  git reset HEAD $($criticalDeletions -join ' ')" -ForegroundColor White
    Write-Host ""
    Write-Host "These files are essential for automation and should not be deleted!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ No critical files are staged for deletion" -ForegroundColor Green
