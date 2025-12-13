#!/bin/bash

# Husky 9 Setup Script
# Run this script to set up Husky with lint-staged

set -e

echo "🐶 Setting up Husky 9 with lint-staged..."
echo ""

# Step 1: Clean up old Husky installations
if [ -d ".husky" ]; then
    echo "🧹 Cleaning up old Husky files..."
    rm -rf .husky
fi

# Step 2: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 3: Initialize Husky
echo "🔧 Initializing Husky..."
npx husky init

# Step 4: Create pre-commit hook (Husky 9 style - simple command only)
echo "📝 Creating pre-commit hook..."
echo "npx lint-staged" > .husky/pre-commit

# Step 5: Make pre-commit executable
chmod +x .husky/pre-commit

# Step 6: (Optional) Create pre-push hook
echo "📝 Creating pre-push hook..."
echo "npm run format:check" > .husky/pre-push

# Step 7: Make pre-push executable
chmod +x .husky/pre-push

# Step 8: Format existing code
echo "✨ Formatting existing code..."
npm run format

echo ""
echo "✅ Husky 9 setup complete!"
echo ""
echo "📋 What happens now:"
echo "   • Code will be auto-formatted on commit"
echo "   • Formatting will be checked before push"
echo "   • No more DEPRECATED warnings!"
echo ""
echo "🧪 Test it:"
echo "   1. Make a change to a file"
echo "   2. git add <file>"
echo "   3. git commit -m 'test husky'"
echo "   4. Watch the magic happen! ✨"
echo ""