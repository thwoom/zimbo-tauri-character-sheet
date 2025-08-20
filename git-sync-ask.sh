#!/bin/bash

# Git sync script with confirmation prompts
# This script fetches, commits, and pushes changes with user confirmation

set -e

echo "🔄 Git Sync Script"
echo "=================="

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Check current branch
current_branch=$(git branch --show-current)
echo "📍 Current branch: $current_branch"

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "📝 You have uncommitted changes:"
    git status --short
    
    read -p "❓ Do you want to commit these changes? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "💬 Enter commit message: " commit_message
        if [ -z "$commit_message" ]; then
            echo "❌ No commit message provided, aborting"
            exit 1
        fi
        git add .
        git commit -m "$commit_message"
        echo "✅ Changes committed"
    else
        echo "⚠️  Skipping commit"
    fi
else
    echo "✅ No uncommitted changes"
fi

# Fetch latest changes
echo "📥 Fetching latest changes..."
git fetch origin

# Check if we're behind remote
if git rev-list HEAD...origin/$current_branch --count | grep -q "^[1-9]"; then
    echo "📥 You're behind the remote branch"
    read -p "❓ Do you want to pull latest changes? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git pull origin $current_branch
        echo "✅ Changes pulled"
    else
        echo "⚠️  Skipping pull"
    fi
else
    echo "✅ Up to date with remote"
fi

# Check if we have commits to push
if git rev-list origin/$current_branch..HEAD --count | grep -q "^[1-9]"; then
    echo "📤 You have commits to push"
    read -p "❓ Do you want to push changes? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git push origin $current_branch
        echo "✅ Changes pushed"
    else
        echo "⚠️  Skipping push"
    fi
else
    echo "✅ No commits to push"
fi

echo "🎉 Git sync complete!"