# Centralized PR Automation

This document describes the centralized PR automation system that replaces the previous scattered automation workflows.

## Overview

The centralized automation system provides comprehensive PR management including:

- **Code Analysis & Quality Checks**
- **Automated Fixes**
- **Conflict Resolution**
- **PR Management**
- **Security Scanning**

## How It Works

### Automatic Triggers

- **PR Events**: Automatically analyzes every PR on open, sync, reopen, and ready_for_review
- **Comment Commands**: Responds to specific commands in PR comments
- **Manual Triggers**: Can be manually triggered via GitHub Actions UI

### Workflow Jobs

#### 1. Analyze Job

**Triggers**: Every PR event, `/automation analyze` command
**Purpose**: Comprehensive code quality analysis

**Checks Performed**:

- ESLint code quality analysis
- Unit test execution
- Security vulnerability scanning
- Dependency audit

**Outputs**:

- Detailed reports in PR comments
- Issue counts and categorization
- Pass/fail status for merge eligibility

#### 2. Auto-Fix Job

**Triggers**: `/automation fix` command
**Purpose**: Apply automated fixes to code issues

**Fixes Applied**:

- Code formatting (Prettier)
- Linting issues (ESLint --fix)
- Security vulnerabilities (npm audit fix)
- Dependency updates

#### 3. Resolve Conflicts Job

**Triggers**: `/automation resolve-conflicts` command
**Purpose**: Automatically resolve merge conflicts

**Strategy**:

- Uses existing conflict resolution logic
- Prefers PR changes for source files
- Prefers base changes for lockfiles
- Creates union merges for ignore files

#### 4. Merge Job

**Triggers**: `/automation merge` command
**Purpose**: Automatically merge PRs that pass all checks

**Requirements**:

- All analysis checks must pass
- No security vulnerabilities
- All tests passing
- Code formatting compliant

## Comment Commands

### Available Commands

| Command                         | Description                     | When to Use          |
| ------------------------------- | ------------------------------- | -------------------- |
| `/automation analyze`           | Run comprehensive code analysis | Review PR quality    |
| `/automation fix`               | Apply automated fixes           | Fix code issues      |
| `/automation resolve-conflicts` | Resolve merge conflicts         | When conflicts occur |
| `/automation merge`             | Merge PR (if checks pass)       | Ready to merge       |

### Usage Examples

```markdown
# Analyze a PR

/automation analyze

# Fix code issues

/automation fix

# Resolve conflicts

/automation resolve-conflicts

# Merge when ready

/automation merge
```

## Integration with Existing Workflows

### Replaced Workflows

- `auto-update-prs.yml` - Now handled by centralized system
- `resolve-all-prs.yml` - Integrated into conflict resolution
- `codex-preflight.yml` - Enhanced analysis in main workflow

### Preserved Workflows

- `resolve-single-pr.yml` - Kept for manual conflict resolution
- `fix-prs.ps1` - Kept for local development

## Configuration

### Environment Variables

- `GH_TOKEN`: GitHub token for API access
- `PR_NUMBER`: Target PR number for manual triggers

### Permissions Required

- `contents: write` - Modify repository content
- `pull-requests: write` - Manage PRs
- `security-events: write` - Security scanning
- `actions: write` - Trigger workflows

## Benefits

### Centralized Control

- Single point of management for all PR automation
- Consistent behavior across all PRs
- Unified reporting and feedback

### Enhanced Analysis

- Comprehensive security scanning
- Detailed quality metrics
- Actionable feedback with next steps

### Automated Fixes

- Self-healing codebase
- Reduced manual intervention
- Consistent code quality

### Better UX

- Clear command interface
- Detailed progress reporting
- Automated conflict resolution

## Troubleshooting

### Common Issues

1. **Workflow Not Triggering**
   - Check PR event types in workflow
   - Verify permissions are set correctly
   - Ensure comment commands are exact

2. **Fixes Not Applied**
   - Check if issues are auto-fixable
   - Review ESLint configuration
   - Verify npm audit permissions

3. **Merge Conflicts**
   - Use `/automation resolve-conflicts`
   - Check conflict resolution strategy
   - Review manual resolution if needed

### Debug Commands

```bash
# Check workflow status
gh run list --workflow=centralized-pr-automation.yml

# View workflow logs
gh run view <run-id> --log

# Trigger manual analysis
gh workflow run centralized-pr-automation.yml --field action=analyze
```

## Migration from Old System

### What Changed

- **Unified Workflow**: Single workflow replaces multiple
- **Comment Interface**: Commands via PR comments
- **Enhanced Analysis**: More comprehensive checks
- **Better Reporting**: Detailed feedback in PR comments

### What Stayed the Same

- **Conflict Resolution Logic**: Same strategies used
- **Fix Scripts**: Local development tools preserved
- **Quality Standards**: Same linting and testing requirements

### Migration Steps

1. **Deploy New Workflows**: Push the new workflow files
2. **Test Commands**: Try comment commands on test PRs
3. **Monitor Performance**: Watch for any issues
4. **Archive Old Workflows**: Remove old workflows once confirmed working

## Future Enhancements

### Planned Features

- **Batch Processing**: Process multiple PRs at once
- **Custom Rules**: Repository-specific analysis rules
- **Integration Hooks**: Connect with external tools
- **Advanced Reporting**: Detailed metrics and trends

### Configuration Options

- **Thresholds**: Configurable quality thresholds
- **Rules**: Customizable analysis rules
- **Notifications**: Enhanced notification system
- **Metrics**: Quality trend tracking
