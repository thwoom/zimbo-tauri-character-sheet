# 🤖 Add BugBot Secrets to GitHub
# This script adds Snyk and SonarCloud secrets to your GitHub repository

param(
    [Parameter(Mandatory=$true)]
    [string]$SnykToken,
    
    [Parameter(Mandatory=$true)]
    [string]$SonarToken
)

Write-Host "🔐 Adding BugBot Secrets to GitHub..." -ForegroundColor Green
Write-Host ""

# Validate tokens
if ($SnykToken.Length -lt 10) {
    Write-Host "❌ Snyk token appears to be invalid (too short)" -ForegroundColor Red
    exit 1
}

if ($SonarToken.Length -lt 10) {
    Write-Host "❌ SonarCloud token appears to be invalid (too short)" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Token validation passed" -ForegroundColor Green
Write-Host ""

# Add Snyk token
Write-Host "🔧 Adding Snyk token..." -ForegroundColor Blue
try {
    gh secret set SNYK_TOKEN --body $SnykToken
    Write-Host "✅ Snyk token added successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to add Snyk token" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

# Add SonarCloud token
Write-Host "🔧 Adding SonarCloud token..." -ForegroundColor Blue
try {
    gh secret set SONAR_TOKEN --body $SonarToken
    Write-Host "✅ SonarCloud token added successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to add SonarCloud token" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

# Add SonarCloud host URL
Write-Host "🔧 Adding SonarCloud host URL..." -ForegroundColor Blue
try {
    gh secret set SONAR_HOST_URL --body "https://sonarcloud.io"
    Write-Host "✅ SonarCloud host URL added successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to add SonarCloud host URL" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 All secrets added successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🧪 Testing the setup..." -ForegroundColor Blue

# Test the setup
try {
    Write-Host "Running test analysis on PR #457..." -ForegroundColor Yellow
    gh workflow run centralized-pr-automation.yml --field action=analyze --field pr_number=457
    Write-Host "✅ Test workflow triggered successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Test workflow failed, but secrets are set up correctly" -ForegroundColor Yellow
    Write-Host "You can manually test with:" -ForegroundColor White
    Write-Host "gh workflow run centralized-pr-automation.yml --field action=analyze --field pr_number=457" -ForegroundColor Gray
}

Write-Host ""
Write-Host "🎯 Your BugBot-level automation is now ready!" -ForegroundColor Green
Write-Host "Check the GitHub Actions tab to see the analysis results." -ForegroundColor Cyan
