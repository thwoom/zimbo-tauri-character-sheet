# 🤖 BugBot-Level Analysis Setup Guide

This guide explains how to set up the advanced analysis tools that give you BugBot-level capabilities.

## 🚀 What's New

Your PR automation now includes:

### **🔍 Advanced Analysis Tools**

- **Snyk** - Security vulnerability scanning
- **SonarQube** - Advanced code quality analysis
- **Bundle Analysis** - Performance optimization insights
- **Enhanced Reporting** - Comprehensive issue tracking

## 📋 Setup Requirements

### **1. Snyk Security Scanning**

**Free Tier Available**: Yes, up to 100 tests/month

1. **Sign up at [snyk.io](https://snyk.io)**
2. **Get your API token** from Snyk dashboard
3. **Add to GitHub Secrets**:
   - Go to your repo → Settings → Secrets and variables → Actions
   - Add secret: `SNYK_TOKEN` with your Snyk API token

### **2. SonarQube Analysis**

**Free Options**:

- **SonarCloud** (cloud-hosted, free for public repos)
- **SonarQube Community Edition** (self-hosted)

#### **Option A: SonarCloud (Recommended)**

1. **Sign up at [sonarcloud.io](https://sonarcloud.io)**
2. **Connect your GitHub repository**
3. **Get your token** from SonarCloud dashboard
4. **Add to GitHub Secrets**:
   - `SONAR_TOKEN` - Your SonarCloud token
   - `SONAR_HOST_URL` - `https://sonarcloud.io`

#### **Option B: Self-hosted SonarQube**

1. **Set up SonarQube server**
2. **Add to GitHub Secrets**:
   - `SONAR_TOKEN` - Your SonarQube token
   - `SONAR_HOST_URL` - Your SonarQube server URL

### **3. Bundle Analysis**

**No setup required** - uses webpack-bundle-analyzer automatically

## 🔧 Configuration

### **SonarQube Project Key**

The automation uses `zimbo-tauri-character-sheet` as the project key. If you change this, update the workflow file:

```yaml
-Dsonar.projectKey=your-project-key
```

### **Coverage Reports**

For better SonarQube analysis, add test coverage:

```bash
npm install --save-dev @vitest/coverage-v8
```

Then update your test script:

```json
{
  "scripts": {
    "test": "vitest run --exclude tests --coverage"
  }
}
```

## 🎯 What You Get

### **Enhanced Security**

- **Snyk**: Real-time vulnerability scanning
- **npm audit**: Dependency security checks
- **Comprehensive reports**: Detailed security insights

### **Advanced Code Quality**

- **SonarQube**: Code smells, bugs, security hotspots
- **Maintainability**: Technical debt analysis
- **Coverage**: Test coverage insights

### **Performance Insights**

- **Bundle Analysis**: JavaScript bundle optimization
- **Size tracking**: Monitor bundle growth
- **Performance recommendations**

## 🚀 Usage

Once set up, the automation runs automatically on every PR:

1. **Analysis**: All tools run automatically
2. **Reports**: Detailed results posted to PR
3. **Fixes**: Automated fixes applied when possible
4. **Merge**: Auto-merge when all checks pass

### **Manual Triggers**

```bash
# Run full analysis
gh workflow run centralized-pr-automation.yml --field action=analyze --field pr_number=457

# Run on all PRs
.\scripts\auto-all-prs.ps1
```

## 📊 Expected Results

### **Before Setup**

- Basic ESLint and npm audit
- Limited security insights
- No performance analysis

### **After Setup**

- **Snyk**: 0-50+ security vulnerabilities detected
- **SonarQube**: 0-100+ code quality issues
- **Bundle Analysis**: Performance recommendations
- **Comprehensive reporting**: All issues in one place

## 🔍 Troubleshooting

### **Snyk Issues**

- **Rate limits**: Free tier has 100 tests/month
- **Token issues**: Check SNYK_TOKEN secret
- **No vulnerabilities**: Good! Your code is secure

### **SonarQube Issues**

- **Project not found**: Check project key in workflow
- **Token issues**: Verify SONAR_TOKEN and SONAR_HOST_URL
- **Coverage missing**: Add test coverage setup

### **Bundle Analysis Issues**

- **Build failures**: Check Vite build configuration
- **Missing stats**: Ensure build generates stats.json

## 🎉 Next Steps

1. **Set up Snyk** (5 minutes)
2. **Set up SonarCloud** (10 minutes)
3. **Run the automation** on your PRs
4. **Review results** and apply recommendations

**You'll have BugBot-level analysis capabilities!** 🚀
