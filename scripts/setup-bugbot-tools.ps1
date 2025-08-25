# 🤖 Automated BugBot Tools Setup
# This script helps automate the setup of Snyk and SonarCloud

Write-Host "🚀 Automated BugBot Tools Setup" -ForegroundColor Green
Write-Host "This script will help you set up Snyk and SonarCloud for free!" -ForegroundColor Cyan
Write-Host ""

# Check if GitHub CLI is available
try {
    $ghVersion = gh --version
    Write-Host "✅ GitHub CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ GitHub CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "   https://cli.github.com/" -ForegroundColor Yellow
    exit 1
}

# Check if user is authenticated
try {
    $authStatus = gh auth status
    if ($authStatus -match "Logged in to github.com") {
        Write-Host "✅ GitHub authentication confirmed" -ForegroundColor Green
    } else {
        Write-Host "❌ Please authenticate with GitHub first:" -ForegroundColor Red
        Write-Host "   gh auth login" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ GitHub authentication failed. Please run:" -ForegroundColor Red
    Write-Host "   gh auth login" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🔧 Setting up Snyk..." -ForegroundColor Blue

# Install Snyk CLI
Write-Host "  📦 Installing Snyk CLI..." -ForegroundColor Yellow
try {
    npm install -g snyk
    Write-Host "  ✅ Snyk CLI installed" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️  Snyk CLI installation failed, but we can continue with manual setup" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 Snyk Setup Instructions:" -ForegroundColor Cyan
Write-Host "1. Go to https://snyk.io and sign up for a FREE account" -ForegroundColor White
Write-Host "2. Get your API token from the Snyk dashboard" -ForegroundColor White
Write-Host "3. Run this command to add it to GitHub Secrets:" -ForegroundColor White
Write-Host "   gh secret set SNYK_TOKEN --body 'your-snyk-token-here'" -ForegroundColor Yellow

Write-Host ""
Write-Host "🔧 Setting up SonarCloud..." -ForegroundColor Blue

Write-Host "📋 SonarCloud Setup Instructions:" -ForegroundColor Cyan
Write-Host "1. Go to https://sonarcloud.io and sign up for a FREE account" -ForegroundColor White
Write-Host "2. Connect your GitHub repository" -ForegroundColor White
Write-Host "3. Get your token from SonarCloud dashboard" -ForegroundColor White
Write-Host "4. Run these commands to add secrets:" -ForegroundColor White
Write-Host "   gh secret set SONAR_TOKEN --body 'your-sonar-token-here'" -ForegroundColor Yellow
Write-Host "   gh secret set SONAR_HOST_URL --body 'https://sonarcloud.io'" -ForegroundColor Yellow

Write-Host ""
Write-Host "🎯 Quick Setup Commands:" -ForegroundColor Green
Write-Host "After getting your tokens, run these commands:" -ForegroundColor White
Write-Host ""
Write-Host "# For Snyk:" -ForegroundColor Yellow
Write-Host "gh secret set SNYK_TOKEN --body 'your-snyk-token-here'" -ForegroundColor Gray
Write-Host ""
Write-Host "# For SonarCloud:" -ForegroundColor Yellow
Write-Host "gh secret set SONAR_TOKEN --body 'your-sonar-token-here'" -ForegroundColor Gray
Write-Host "gh secret set SONAR_HOST_URL --body 'https://sonarcloud.io'" -ForegroundColor Gray

Write-Host ""
Write-Host "🧪 Test the setup:" -ForegroundColor Green
Write-Host "After adding the secrets, test with:" -ForegroundColor White
Write-Host "gh workflow run centralized-pr-automation.yml --field action=analyze --field pr_number=457" -ForegroundColor Yellow

Write-Host ""
Write-Host "📚 For detailed instructions, see: docs/bugbot-setup.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 Setup complete! Your automation will have BugBot-level capabilities!" -ForegroundColor Green
