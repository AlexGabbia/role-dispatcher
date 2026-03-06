# Claude Role Dispatcher

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/@alexgabbia/role-dispatcher)](https://www.npmjs.com/package/@alexgabbia/role-dispatcher)
[![Claude Code](https://img.shields.io/badge/Claude_Code-Skill-blueviolet)](https://docs.anthropic.com/en/docs/claude-code)
[![Codex CLI](https://img.shields.io/badge/Codex_CLI-Skill-blue)](https://github.com/openai/codex)
[![OpenCode](https://img.shields.io/badge/OpenCode-Skill-orange)](https://github.com/opencode-ai/opencode)
[![Roles](https://img.shields.io/badge/IT_Roles-185+-green)](skill/role-dispatcher/references/role-index.md)

> Turn your AI coding tool into a team of 185+ IT specialists. One request, the right experts, instant collaboration.

![Hero Banner](images/hero-banner.png)

## What is this?

A **skill for Claude Code, Codex CLI, and OpenCode** that analyzes your requests, identifies the most relevant IT specialist roles, and dispatches specialized agents that collaborate to give you expert-level answers.

Instead of getting a generic response, you get answers from the perspective of the actual professionals who would handle that work in a real company.

### Compatibility

| Tool | Status | Skills Directory |
|------|--------|-----------------|
| Claude Code | Supported | `~/.claude/skills/` |
| Codex CLI | Supported | `~/.codex/skills/` |
| OpenCode | Supported | `~/.config/opencode/skills/` |

## Features

- **185+ IT roles** across 13 professional categories, from Frontend Developer to CISO
- **Language-agnostic matching** - write in any language, Claude understands and matches internally
- **Smart dispatching** - 1 to 3 specialist agents per request, based on complexity
- **Propose & Confirm** - review and override roles and model before agents are dispatched
- **Collaboration protocol** - agents coordinate through handoff notes and dependency checks
- **Review Agent** - automatically validates multi-agent outputs for conflicts and completeness
- **Confidence scoring** - every agent rates their confidence (HIGH/MEDIUM/LOW), with automatic escalation on LOW
- **Model selection** - suggests the right Claude model (Haiku/Sonnet/Opus) based on task complexity, with user override
- **Real examples** - includes 4 complete dispatching scenarios as reference

## Quick Start

### npx (Recommended)

```bash
npx @alexgabbia/role-dispatcher
```

This auto-detects which tools you have installed and copies the skill to the right directory.

You can also target a specific tool:

```bash
npx @alexgabbia/role-dispatcher --claude     # Claude Code only
npx @alexgabbia/role-dispatcher --codex      # Codex CLI only
npx @alexgabbia/role-dispatcher --opencode   # OpenCode only
npx @alexgabbia/role-dispatcher --all        # All tools
```

### Manual Installation

Copy the skill folder to your tool's skills directory:

```bash
# Claude Code
mkdir -p ~/.claude/skills/role-dispatcher
cp -r skill/role-dispatcher/* ~/.claude/skills/role-dispatcher/

# Codex CLI
mkdir -p ~/.codex/skills/role-dispatcher
cp -r skill/role-dispatcher/* ~/.codex/skills/role-dispatcher/

# OpenCode
mkdir -p ~/.config/opencode/skills/role-dispatcher
cp -r skill/role-dispatcher/* ~/.config/opencode/skills/role-dispatcher/
```

### Script Installation

```bash
# macOS / Linux
chmod +x install.sh && ./install.sh

# Windows (PowerShell)
.\install.ps1
```

### Verify

Open Claude Code and make a technical request. You should see the dispatcher propose agents and wait for your confirmation:

```
Proposed dispatch:
- Backend Developer: REST API design and implementation
- Frontend Developer: React dashboard with user management

Model: claude-sonnet-4-6 (medium complexity)

Proceed? You can:
- Enter/yes to proceed as proposed
- Change roles: e.g. "use Security Engineer instead of Backend Developer"
- Change model: e.g. "use opus" or "use haiku"
- Both: e.g. "use only Frontend Developer with sonnet"
```

## How It Works

![Workflow](images/workflow-diagram.svg)

1. **Analyze** - Detects your language, matches your request against the English keyword index
2. **Match** - Identifies relevant categories from the 13 available
3. **Select** - Picks 1-3 specialist roles and determines the optimal model
4. **Propose & Confirm** - Shows you the proposed roles and model, waits for your approval or changes
5. **Dispatch** - Launches agents with structured prompts including expertise profiles and behavioral guidelines
6. **Review** - (2+ agents) Validates completeness, detects conflicts, verifies integration
7. **Synthesize** - Merges outputs into a single coherent answer with aggregate confidence

## Categories

| # | Category | Roles | Examples |
|---|----------|-------|---------|
| 01 | Software Development | 14 | Full-Stack, Backend, Frontend, Mobile, API, Game Dev |
| 02 | Design & UX | 11 | Product Designer, UX/UI Designer, UX Researcher |
| 03 | Data & AI | 14 | Data Scientist, ML Engineer, NLP Engineer, MLOps |
| 04 | Cybersecurity | 15 | CISO, Security Architect, Penetration Tester, SOC |
| 05 | Infrastructure & Ops | 15 | Cloud Engineer, DevOps, SRE, DBA, Kubernetes |
| 06 | Management | 17 | CTO, Product Manager, Scrum Master, Agile Coach |
| 07 | QA & Testing | 10 | QA Engineer, SDET, Performance Tester |
| 08 | Marketing & Content | 25 | SEO, Growth Hacker, Content Strategy, Social Media |
| 09 | E-commerce | 10 | Marketplace Manager, Pricing Analyst, Catalog |
| 10 | Sales & CS | 10 | RevOps, Customer Success, Sales Engineer, CRM |
| 11 | IT Support | 13 | IT Service Manager, Help Desk, IT Auditor |
| 12 | Consulting & Training | 13 | Enterprise Architect, Solution Architect, Tech Writer |
| 13 | Specialized | 18 | DPO, DevRel, AI Ethics, Accessibility, GIS |

## Examples

### Simple: SQL Optimization
```
You: "How do I optimize this SQL query that takes 30 seconds?"

Dispatcher proposes:
  Agents: Database Administrator (DBA)
  Model: Sonnet

You: "yes"
  -> Expert-level query optimization with execution plan analysis
```

### Medium: Full-Stack Feature
```
You: "Build a REST API with auth and a React dashboard for user management"

Dispatcher proposes:
  Agents: Backend Developer + Frontend Developer
  Review: Yes (2 agents)
  Model: Sonnet

You: "yes"
  -> Coordinated API design + React implementation with shared contracts
```

### Complex: System Architecture
```
You: "Design a microservices architecture for e-commerce with payments and real-time notifications"

Dispatcher proposes:
  Agents: Software Architect + Backend Developer + DevOps Engineer
  Review: Yes (3 agents, sequential)
  Model: Opus

You: "yes"
  -> Architecture -> Implementation plan -> Deployment strategy (sequential pipeline)
```

### User Override
```
You: "Set up a CI/CD pipeline for our Node.js monorepo"

Dispatcher proposes:
  Agents: DevOps Engineer + SRE
  Model: Sonnet

You: "use only DevOps Engineer with haiku"
  -> Single agent dispatched on Haiku for faster, focused response
```

## File Structure

```
skill/role-dispatcher/
  SKILL.md                          # Core dispatch logic (~100 lines)
  references/
    role-index.md                   # Category index with English keywords
    prompt-templates.md             # Structured agent prompt templates
    collaboration-protocol.md       # Multi-agent coordination protocol
    model-selection-guide.md        # Model selection decision matrix + override protocol
    examples.md                     # 4 complete dispatching scenarios
  assets/roles/
    01-software-development.md      # 14 roles
    02-design-ux.md                 # 11 roles
    03-data-ai.md                   # 14 roles
    04-cybersecurity.md             # 15 roles
    05-infrastructure-operations.md # 15 roles
    06-management-organization.md   # 17 roles
    07-quality-testing.md           # 10 roles
    08-marketing-digital-content.md # 25 roles
    09-ecommerce-marketplace.md     # 10 roles
    10-sales-customer-success.md    # 10 roles
    11-it-support-administration.md # 13 roles
    12-consulting-training.md       # 13 roles
    13-specialized-roles.md         # 18 roles
```

## Contributing

Contributions welcome! You can:

- **Add roles** - Submit a PR adding new roles to existing category files
- **Add categories** - Create a new role file and update `references/role-index.md`
- **Improve templates** - Enhance the agent prompt templates or collaboration protocol
- **Add examples** - Contribute real-world dispatching scenarios to `references/examples.md`

## License

[MIT](LICENSE)
