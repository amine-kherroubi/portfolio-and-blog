#!/bin/bash

# Husky Setup Script
# Run this script to automatically set up Husky with lint-staged

set -e

echo "🐶 Setting up Husky with lint-staged..."
echo ""

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 2: Initialize Husky
echo "🔧 Initializing Husky..."
npx husky init

# Step 3: Create pre-commit hook
echo "📝 Creating pre-commit hook..."
cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run lint-staged to format staged files
npx lint-staged
EOF

# Step 4: Make pre-commit executable
chmod +x .husky/pre-commit

# Step 5: (Optional) Create pre-push hook
echo "📝 Creating pre-push hook..."
cat > .husky/pre-push << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Check formatting before push
npm run format:check
EOF

# Step 6: Make pre-push executable
chmod +x .husky/pre-push

# Step 7: Format existing code
echo "✨ Formatting existing code..."
npm run format

echo ""
echo "✅ Husky setup complete!"
echo ""
echo "📋 What happens now:"
echo "   • Code will be auto-formatted on commit"
echo "   • Formatting will be checked before push"
echo "   • All team members will follow the same style"
echo ""
echo "🧪 Test it:"
echo "   1. Make a change to a file"
echo "   2. git add <file>"
echo "   3. git commit -m 'test husky'"
echo "   4. Watch the magic happen! ✨"
echo ""