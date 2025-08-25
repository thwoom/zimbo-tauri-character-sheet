# 🔍 SonarCloud GitHub Actions Setup Guide

This guide explains how to properly set up SonarCloud with GitHub Actions integration.

## 🚀 Setup Steps

### **Step 1: Create SonarCloud Account**

1. Go to [sonarcloud.io](https://sonarcloud.io)
2. Sign up with your GitHub account
3. Create an organization (if you don't have one)

### **Step 2: Set Up Project**

1. In SonarCloud, click "Add Project"
2. Select your GitHub repository: `thwoom/zimbo-tauri-character-sheet`
3. Choose "GitHub Actions" as the analysis method
4. Note the project key: `thwoom_zimbo-tauri-character-sheet`

### **Step 3: Get API Token**

1. Go to your SonarCloud account settings
2. Navigate to "Security" → "Tokens"
3. Generate a new token with "Execute Analysis" permissions
4. Copy the token (you'll need it for GitHub Secrets)

### **Step 4: Add GitHub Secrets**

```bash
# Add SonarCloud token
gh secret set SONAR_TOKEN --body 'your-sonarcloud-token'

# Note: SONAR_HOST_URL is hardcoded in workflow as https://sonarcloud.io
```

### **Step 5: Configure Project**

The workflow is configured with:

- **Project Key**: `thwoom_zimbo-tauri-character-sheet`
- **Organization**: `thwoom`
- **Host URL**: `https://sonarcloud.io`
- **Sources**: `src/` directory
- **Coverage**: Excludes test files

## 🔧 Configuration Details

### **Workflow Configuration**

```yaml
- name: SonarCloud Analysis
  uses: sonarqube-quality-gate-action@master
  env:
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
    SONAR_HOST_URL: https://sonarcloud.io
  with:
    args: >
      -Dsonar.projectKey=thwoom_zimbo-tauri-character-sheet
      -Dsonar.organization=thwoom
      -Dsonar.sources=src
      -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
      -Dsonar.coverage.exclusions=**/*.test.js,**/*.test.jsx,**/*.spec.js,**/*.spec.jsx
      -Dsonar.host.url=https://sonarcloud.io
```

### **Required Secrets**

- `SONAR_TOKEN`: Your SonarCloud API token

## 🎯 What You Get

### **Code Quality Analysis**

- Code smells detection
- Maintainability metrics
- Technical debt analysis
- Code duplication detection

### **Security Analysis**

- Security vulnerabilities
- Security hotspots
- Security rating

### **Coverage Analysis**

- Test coverage metrics
- Coverage exclusions for test files
- Coverage trends

## 🚀 Testing the Setup

1. **Push the workflow changes**
2. **Create a test PR**
3. **Check GitHub Actions** for SonarCloud analysis
4. **Verify results** in SonarCloud dashboard

## 🔍 Troubleshooting

### **Common Issues**

- **Token permissions**: Ensure token has "Execute Analysis" permissions
- **Project key**: Must match exactly: `thwoom_zimbo-tauri-character-sheet`
- **Organization**: Must match your SonarCloud organization name
- **Coverage**: Ensure test coverage files are generated

### **Debug Commands**

```bash
# Check if secrets are set
gh secret list

# Test SonarCloud connection
curl -u your-token: https://sonarcloud.io/api/qualitygates/project_status?projectKey=thwoom_zimbo-tauri-character-sheet
```

## 🎉 Success Indicators

- ✅ SonarCloud analysis runs in GitHub Actions
- ✅ Quality gate results appear in PR comments
- ✅ Detailed analysis available in SonarCloud dashboard
- ✅ Coverage metrics are tracked

**Your SonarCloud integration is now properly configured!** 🚀
