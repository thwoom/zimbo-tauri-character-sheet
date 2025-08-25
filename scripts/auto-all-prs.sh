#!/bin/bash

# 🤖 Auto Pipeline for All PRs
# This script runs the complete automation pipeline on all open PRs

echo "🚀 Starting Auto Pipeline for All Open PRs..."

# Get all open PRs
prs=$(gh pr list --state open --json number,title --jq '.[].number')

if [ -z "$prs" ]; then
    echo "✅ No open PRs found"
    exit 0
fi

echo "📋 Found $(echo "$prs" | wc -l) open PRs"

for pr in $prs; do
    echo "🔍 Processing PR #$pr..."
    
    # Step 1: Run analysis
    echo "  📊 Step 1: Running analysis..."
    gh workflow run centralized-pr-automation.yml \
        --field action=analyze \
        --field pr_number=$pr
    
    # Wait a moment for the workflow to start
    sleep 5
    
    # Step 2: Apply fixes if needed
    echo "  🔧 Step 2: Applying fixes..."
    gh workflow run centralized-pr-automation.yml \
        --field action=fix \
        --field pr_number=$pr
    
    # Wait a moment
    sleep 5
    
    # Step 3: Resolve conflicts if any
    echo "  🔀 Step 3: Checking for conflicts..."
    gh workflow run centralized-pr-automation.yml \
        --field action=resolve-conflicts \
        --field pr_number=$pr
    
    # Wait a moment
    sleep 5
    
    # Step 4: Try to merge if ready
    echo "  🚀 Step 4: Attempting merge..."
    gh workflow run centralized-pr-automation.yml \
        --field action=merge \
        --field pr_number=$pr
    
    echo "  ✅ Completed pipeline for PR #$pr"
    echo ""
done

echo "🎉 Auto Pipeline completed for all PRs!"
echo "📊 Check the GitHub Actions tab to see results"
