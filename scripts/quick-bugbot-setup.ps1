# 🤖 Quick BugBot Setup - One Click Setup
# This script opens signup pages and guides you through the setup

Write-Host "🚀 Quick BugBot Setup" -ForegroundColor Green
Write-Host "This will open the signup pages for you!" -ForegroundColor Cyan
Write-Host ""

# Check if we can open browsers
try {
    Start-Process "https://snyk.io/signup"
    Write-Host "✅ Opened Snyk signup page" -ForegroundColor Green
} catch {
    Write-Host "❌ Could not open Snyk signup page" -ForegroundColor Red
    Write-Host "Please manually go to: https://snyk.io/signup" -ForegroundColor Yellow
}

Start-Sleep -Seconds 2

try {
    Start-Process "https://sonarcloud.io/sessions/new"
    Write-Host "✅ Opened SonarCloud signup page" -ForegroundColor Green
} catch {
    Write-Host "❌ Could not open SonarCloud signup page" -ForegroundColor Red
    Write-Host "Please manually go to: https://sonarcloud.io/sessions/new" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 Setup Steps:" -ForegroundColor Cyan
Write-Host "1. Sign up for FREE accounts on both sites" -ForegroundColor White
Write-Host "2. Get your API tokens from the dashboards" -ForegroundColor White
Write-Host "3. Run the setup script with your tokens:" -ForegroundColor White
Write-Host ""
Write-Host "   .\scripts\add-bugbot-secrets.ps1 -SnykToken 'your-snyk-token' -SonarToken 'your-sonar-token'" -ForegroundColor Yellow
Write-Host ""

Write-Host "🎯 Quick Commands:" -ForegroundColor Green
Write-Host "After getting your tokens, run:" -ForegroundColor White
Write-Host ""
Write-Host "# Manual method:" -ForegroundColor Yellow
Write-Host "gh secret set SNYK_TOKEN --body 'your-snyk-token'" -ForegroundColor Gray
Write-Host "gh secret set SONAR_TOKEN --body 'your-sonar-token'" -ForegroundColor Gray
Write-Host "gh secret set SONAR_HOST_URL --body 'https://sonarcloud.io'" -ForegroundColor Gray
Write-Host ""
Write-Host "# Automated method:" -ForegroundColor Yellow
Write-Host ".\scripts\add-bugbot-secrets.ps1 -SnykToken 'your-snyk-token' -SonarToken 'your-sonar-token'" -ForegroundColor Gray

Write-Host ""
Write-Host "⏱️  Estimated time: 5-10 minutes" -ForegroundColor Cyan
Write-Host "💰 Cost: $0 (completely free!)" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 Once complete, you'll have BugBot-level automation!" -ForegroundColor Green
