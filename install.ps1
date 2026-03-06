# Install claude-role-dispatcher skill for Claude Code

$SkillDir = "$env:USERPROFILE\.claude\skills\role-dispatcher"

Write-Host "Installing role-dispatcher skill..."

# Create target directories
New-Item -ItemType Directory -Force -Path "$SkillDir\references" | Out-Null
New-Item -ItemType Directory -Force -Path "$SkillDir\assets\roles" | Out-Null

# Get script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Copy skill files
Copy-Item "$ScriptDir\skill\role-dispatcher\SKILL.md" -Destination "$SkillDir\" -Force
Copy-Item "$ScriptDir\skill\role-dispatcher\references\*" -Destination "$SkillDir\references\" -Force
Copy-Item "$ScriptDir\skill\role-dispatcher\assets\roles\*" -Destination "$SkillDir\assets\roles\" -Force

Write-Host "Installed to $SkillDir"
Write-Host "Role Dispatcher is now available in Claude Code."
