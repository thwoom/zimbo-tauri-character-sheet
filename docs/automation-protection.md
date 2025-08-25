# 🛡️ Automation Protection System

This document explains the protection system for critical automation files in the ZimboMate repository.

## 🚨 Critical Files

The following files are **ESSENTIAL** for the automation system and should **NEVER** be deleted:

### Core Workflows

- `.github/workflows/centralized-pr-automation.yml` - Main PR automation workflow
- `.github/workflows/resolve-all-prs.yml` - Conflict resolution workflow
- `.github/workflows/auto-pipeline.yml` - Full auto-pipeline for single PRs
- `.github/workflows/auto-process-all-prs.yml` - Scheduled automation for all PRs

### Configuration Files

- `sonar-project.properties` - SonarCloud configuration
- `scripts/auto-process-all-prs.ps1` - PowerShell automation script

## 🛡️ Protection Mechanisms

### 1. Pre-commit Hook

- **Location**: `.github/hooks/pre-commit`
- **Purpose**: Prevents commits that delete critical files
- **Action**: Automatically runs before every commit
- **Behavior**: Blocks commit if critical files are staged for deletion

### 2. Protection Script

- **Location**: `scripts/protect-critical-files.ps1`
- **Purpose**: Manual verification of critical files
- **Usage**: Run manually to check file integrity
- **Behavior**: Reports missing files and staged deletions

### 3. Documentation

- **Location**: `docs/automation-protection.md` (this file)
- **Purpose**: Explains why files are critical
- **Audience**: Developers and AI agents

## 🔧 How to Use

### Manual Protection Check

```powershell
# Run protection check
.\scripts\protect-critical-files.ps1
```

### Install Pre-commit Hook

```bash
# Make hook executable
chmod +x .github/hooks/pre-commit

# Install hook (if using pre-commit framework)
pre-commit install
```

### Unstage Critical File Deletion

```bash
# If you accidentally stage a critical file for deletion
git reset HEAD .github/workflows/centralized-pr-automation.yml
```

## 🚨 Emergency Recovery

If critical files are accidentally deleted:

### 1. Check Git History

```bash
# Find when file was deleted
git log --oneline --follow .github/workflows/centralized-pr-automation.yml

# Restore from last commit that had it
git checkout HEAD~1 -- .github/workflows/centralized-pr-automation.yml
```

### 2. Recreate from Backup

- Check the repository history for the file
- Copy from a previous commit
- Verify the file is correct

### 3. Run Protection Check

```powershell
.\scripts\protect-critical-files.ps1
```

## 🤖 AI Agent Guidelines

**For AI agents working on this repository:**

1. **NEVER** delete files listed in the critical files section
2. **ALWAYS** run the protection script after making changes
3. **VERIFY** that automation workflows still exist after modifications
4. **DOCUMENT** any changes to critical automation files
5. **TEST** that automation still works after changes

## 🔍 Why These Files Are Critical

### `centralized-pr-automation.yml`

- **Purpose**: Main automation workflow for PR analysis and fixes
- **Dependencies**: Referenced by automation scripts
- **Impact**: Without this, PR automation fails completely

### `resolve-all-prs.yml`

- **Purpose**: Handles conflict resolution for all PRs
- **Dependencies**: Used by other workflows
- **Impact**: Without this, conflicts cannot be resolved automatically

### `auto-pipeline.yml`

- **Purpose**: Complete automation pipeline for individual PRs
- **Dependencies**: Referenced by automation scripts
- **Impact**: Without this, full PR automation fails

### `auto-process-all-prs.yml`

- **Purpose**: Scheduled automation for all open PRs
- **Dependencies**: Orchestrates other workflows
- **Impact**: Without this, scheduled automation fails

### `sonar-project.properties`

- **Purpose**: SonarCloud configuration
- **Dependencies**: Required for SonarCloud analysis
- **Impact**: Without this, code quality analysis fails

### `auto-process-all-prs.ps1`

- **Purpose**: PowerShell automation script
- **Dependencies**: Orchestrates workflow runs
- **Impact**: Without this, manual automation fails

## 📋 Maintenance Checklist

Before making any changes to automation:

- [ ] Run protection script: `.\scripts\protect-critical-files.ps1`
- [ ] Verify all critical files exist
- [ ] Test automation workflows
- [ ] Document any changes
- [ ] Run protection script again after changes

## 🆘 Getting Help

If you encounter issues with the protection system:

1. **Check this documentation**
2. **Run the protection script** for diagnostics
3. **Review git history** for recent changes
4. **Contact the repository maintainer**

**Remember: These files are the backbone of the automation system. Protect them at all costs!** 🛡️
