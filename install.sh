#!/bin/bash
# Install claude-role-dispatcher skill for Claude Code

SKILL_DIR="$HOME/.claude/skills/role-dispatcher"

echo "Installing role-dispatcher skill..."

# Create target directory
mkdir -p "$SKILL_DIR/references" "$SKILL_DIR/assets/roles"

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Copy skill files
cp "$SCRIPT_DIR/skill/role-dispatcher/SKILL.md" "$SKILL_DIR/"
cp "$SCRIPT_DIR/skill/role-dispatcher/references/"* "$SKILL_DIR/references/"
cp "$SCRIPT_DIR/skill/role-dispatcher/assets/roles/"* "$SKILL_DIR/assets/roles/"

echo "Installed to $SKILL_DIR"
echo "Role Dispatcher is now available in Claude Code."
