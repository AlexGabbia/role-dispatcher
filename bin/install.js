#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// --- Colors (works on all terminals) ---
const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const cyan = (s) => `\x1b[36m${s}\x1b[0m`;

// --- Tool definitions ---
const home = os.homedir();

const TOOLS = {
  claude: {
    name: 'Claude Code',
    skillsDir: path.join(home, '.claude', 'skills'),
    detectDir: path.join(home, '.claude'),
  },
  codex: {
    name: 'Codex CLI',
    skillsDir: path.join(home, '.codex', 'skills'),
    detectDir: path.join(home, '.codex'),
  },
  opencode: {
    name: 'OpenCode',
    skillsDir: path.join(home, '.config', 'opencode', 'skills'),
    detectDir: path.join(home, '.config', 'opencode'),
  },
};

// --- Helpers ---
function copyDirRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function installForTool(toolKey) {
  const tool = TOOLS[toolKey];
  const destDir = path.join(tool.skillsDir, 'role-dispatcher');

  try {
    copyDirRecursive(skillSource, destDir);
    console.log(green(`  [OK] ${tool.name}`) + ` -> ${destDir}`);
    return true;
  } catch (err) {
    console.log(red(`  [FAIL] ${tool.name}`) + ` -> ${err.message}`);
    return false;
  }
}

// --- Locate skill source (works from npx and local) ---
const skillSource = path.join(__dirname, '..', 'skill', 'role-dispatcher');

if (!fs.existsSync(skillSource)) {
  console.error(red('Error: skill/role-dispatcher/ not found.'));
  console.error('Expected at: ' + skillSource);
  process.exit(1);
}

// --- Parse CLI args ---
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
${bold('Role Dispatcher Installer')}

${cyan('Usage:')}
  npx @alexgabbia/role-dispatcher             Auto-detect and install
  npx @alexgabbia/role-dispatcher --claude     Install for Claude Code only
  npx @alexgabbia/role-dispatcher --codex      Install for Codex CLI only
  npx @alexgabbia/role-dispatcher --opencode   Install for OpenCode only
  npx @alexgabbia/role-dispatcher --all        Install for all tools

${cyan('Supported tools:')}
  Claude Code    ~/.claude/skills/
  Codex CLI      ~/.codex/skills/
  OpenCode       ~/.config/opencode/skills/
`);
  process.exit(0);
}

const flagClaude = args.includes('--claude');
const flagCodex = args.includes('--codex');
const flagOpencode = args.includes('--opencode');
const flagAll = args.includes('--all');

let targets = [];

if (flagAll) {
  targets = Object.keys(TOOLS);
} else if (flagClaude || flagCodex || flagOpencode) {
  if (flagClaude) targets.push('claude');
  if (flagCodex) targets.push('codex');
  if (flagOpencode) targets.push('opencode');
} else {
  // Auto-detect: check which tool directories exist
  for (const [key, tool] of Object.entries(TOOLS)) {
    if (fs.existsSync(tool.detectDir)) {
      targets.push(key);
    }
  }
}

// --- Header ---
console.log();
console.log(bold('Role Dispatcher') + ' - 185+ IT specialist roles');
console.log();

// --- No targets found ---
if (targets.length === 0) {
  console.log(yellow('No supported tools detected on this system.'));
  console.log();
  console.log('None of these directories were found:');
  for (const tool of Object.values(TOOLS)) {
    console.log(`  ${tool.name}: ${tool.detectDir}`);
  }
  console.log();
  console.log('Use a flag to force installation:');
  console.log(cyan('  npx @alexgabbia/role-dispatcher --claude'));
  console.log(cyan('  npx @alexgabbia/role-dispatcher --codex'));
  console.log(cyan('  npx @alexgabbia/role-dispatcher --opencode'));
  console.log(cyan('  npx @alexgabbia/role-dispatcher --all'));
  console.log();
  process.exit(1);
}

// --- Install ---
const mode = flagAll ? 'all' : (flagClaude || flagCodex || flagOpencode) ? 'manual' : 'auto-detect';
console.log(`Installing (${mode}):`)
console.log();

let ok = 0;
let fail = 0;

for (const target of targets) {
  if (installForTool(target)) {
    ok++;
  } else {
    fail++;
  }
}

console.log();
if (ok > 0) {
  console.log(green(bold(`Done! Installed for ${ok} tool${ok > 1 ? 's' : ''}.`)));
  console.log('Restart your AI coding tool to activate the skill.');
}
if (fail > 0) {
  console.log(red(`${fail} installation${fail > 1 ? 's' : ''} failed.`));
}
console.log();
