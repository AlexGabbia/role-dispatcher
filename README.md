<div align="center">

# Role Dispatcher

### Turn your AI coding tool into a team of 209+ IT specialists.

One request. The right experts. Instant collaboration.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/@alexgabbia/role-dispatcher)](https://www.npmjs.com/package/@alexgabbia/role-dispatcher)
[![Claude Code](https://img.shields.io/badge/Claude_Code-Skill-blueviolet)](https://docs.anthropic.com/en/docs/claude-code)
[![Codex CLI](https://img.shields.io/badge/Codex_CLI-Skill-blue)](https://github.com/openai/codex)
[![OpenCode](https://img.shields.io/badge/OpenCode-Skill-orange)](https://github.com/opencode-ai/opencode)
[![Roles](https://img.shields.io/badge/IT_Roles-209+-green)](skill/role-dispatcher/references/role-index.md)

</div>

---

**Why generic AI answers when you can get specialist-grade expertise?**

Role Dispatcher is a **skill for Claude Code, Codex CLI, and OpenCode** that analyzes your requests, identifies the best IT specialist roles from 209+ professionals across 14 categories, and dispatches specialized agents that collaborate to give you expert-level answers.

Instead of a one-size-fits-all response, you get answers from the **actual professionals** who would handle that work in a real company — complete with domain-specific skills, tools, and perspectives.

### What makes it different

| | Without Role Dispatcher | With Role Dispatcher |
|---|---|---|
| **Expertise** | Generic AI response | Specialist-grade from 209+ roles |
| **Multi-domain tasks** | You manage context yourself | Auto-dispatches the right number of agents that collaborate |
| **Quality control** | Hope for the best | Confidence scoring + Review Agent validation |
| **Model selection** | One size fits all | Right model (Haiku/Sonnet/Opus) per task complexity |
| **Your control** | Take what you get | Propose & Confirm — change roles or model before dispatch |

### Compatibility

| Tool | Status | Skills Directory |
|------|--------|-----------------|
| Claude Code | Supported | `~/.claude/skills/` |
| Codex CLI | Supported | `~/.codex/skills/` |
| OpenCode | Supported | `~/.config/opencode/skills/` |

---

## Quick Start

### npx (Recommended)

```bash
npx @alexgabbia/role-dispatcher
```

Auto-detects which tools you have installed and copies the skill to the right directory.

Target a specific tool:

```bash
npx @alexgabbia/role-dispatcher --claude     # Claude Code only
npx @alexgabbia/role-dispatcher --codex      # Codex CLI only
npx @alexgabbia/role-dispatcher --opencode   # OpenCode only
npx @alexgabbia/role-dispatcher --all        # All tools
```

### Manual Installation

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
  Key skills: Node.js, Python, Java, SQL, REST, GraphQL, microservices
- Frontend Developer: React dashboard with user management
  Key skills: HTML, CSS, JavaScript, React, Vue, Angular, responsive design

Model: claude-sonnet-4-6 (medium complexity)
Execution: MIXED

Proceed? You can:
- yes to proceed as proposed
- Change roles: e.g. "use Security Engineer instead of Backend Developer"
- Change model: e.g. "use opus" or "use haiku"
- Both: e.g. "use only Frontend Developer with sonnet"
```

---

## How It Works

<div align="center">

![Workflow](images/workflow-diagram.svg)

</div>

1. **Analyze** — Detects your language, scans request against keyword index + semantic inference
2. **Match** — Identifies relevant categories from the 14 available
3. **Select** — Picks N specialist roles using Key Skills matching, determines optimal model and dispatch mode
4. **Propose & Confirm** — Shows proposed roles (with key skills), model, and dispatch mode, waits for your approval or changes
5. **Dispatch** — Launches agents via subagents (1-4) or Agent Teams (5+) with structured prompts
6. **Review** — (2+ agents) Validates completeness, detects conflicts, verifies integration
7. **Synthesize** — Merges outputs into a single coherent answer with aggregate confidence

---

## Categories

| # | Category | Roles | Examples |
|---|----------|-------|---------|
| 01 | Software Development | 13 | Full-Stack, Backend, Frontend, Mobile, API, Desktop |
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
| 14 | Game Development | 25 | Game Designer, Level Designer, Game AI, Multiplayer Engineer, 3D Artist |

Every role includes a **Key Skills** column with specific tools, technologies, and competencies for precise matching.

---

## Examples

### Simple: SQL Optimization
```
You: "How do I optimize this SQL query that takes 30 seconds?"

Dispatcher proposes:
  Agents: Database Administrator (DBA)
  Key skills: PostgreSQL, MySQL, Oracle, MongoDB, query optimization, backup, replication
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
  Execution: MIXED

You: "yes"
  -> Coordinated API design + React implementation with shared contracts
```

### Complex: System Architecture
```
You: "Design a microservices architecture for e-commerce with payments
     and real-time notifications"

Dispatcher proposes:
  Agents: Software Architect + Backend Developer + DevOps Engineer
  Review: Yes (3 agents, sequential)
  Model: Opus

You: "yes"
  -> Architecture -> Implementation plan -> Deployment strategy
```

### Large-Scale: SaaS Platform (Agent Team)
```
You: "Build a complete SaaS project management tool with auth, real-time
     collaboration, Stripe billing, and admin dashboard"

Dispatcher proposes:
  Agents: Software Architect + Backend Dev + Frontend Dev + UX/UI Designer
          + DevOps Engineer + Security Engineer + Payment Specialist
  Dispatch mode: Agent Team (7 agents, deep collaboration)
  Model: Opus

You: "yes"
  -> Creates team, Software Architect leads, teammates self-coordinate
  -> Delivers unified architecture + implementation plan
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

---

## Context Persistence (Long-Running Tasks)

For complex tasks that push agents toward context limits, the dispatcher automatically enables **context persistence** — agents save their progress to disk and get replaced by fresh agents that continue from the saved state.

### How it works

1. The dispatcher creates a `.dispatch/` directory with a global `STATE.md`
2. Each agent tracks files touched and writes periodic work logs to `.dispatch/{agent-id}-log.md`
3. When an agent hits a checkpoint trigger (15+ files touched, phase boundary, or self-detected saturation), it saves its log and signals for continuation
4. The dispatcher spawns a fresh agent with the same role that reads the log and resumes from "Next Steps"
5. This repeats until the work is complete (max 5 continuations per agent)

### When it activates

- **Automatically** for FULL-path tasks with 3+ agents or high estimated complexity
- **Never** for SKIP or FAST lane tasks
- Zero user intervention required — agents self-monitor and the dispatcher handles continuations

### What gets saved

```
.dispatch/
  STATE.md              # Project goal, agent roster, global decisions
  backend-01-log.md     # Backend Developer's progress, decisions, next steps
  frontend-01-log.md    # Frontend Developer's progress, decisions, next steps
```

The `.dispatch/` directory is automatically added to `.gitignore`.

---

## Agent Teams (Experimental)

For large-scale tasks (5+ agents) or when agents need to discuss and challenge each other, the dispatcher uses **Agent Teams** — a Claude Code experimental feature that enables real inter-agent collaboration.

### How it differs from subagents

| | Subagents | Agent Teams |
|---|---|---|
| **Communication** | Through dispatcher only | Direct messaging between teammates |
| **Coordination** | Dispatcher orchestrates | Team self-coordinates via shared task list |
| **Best for** | 1-4 focused, independent agents | 5+ agents or deep collaboration needs |
| **Overhead** | Low | Higher, but enables richer collaboration |

### Enable Agent Teams

Add to your `.claude/settings.json`:
```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

### Override dispatch mode

During the Propose & Confirm step, you can force a specific mode:
- **"use team"** — Forces Agent Team mode even for 2-4 agents
- **"use subagents"** — Forces subagent mode even for 5+ agents

---

## File Structure

```
skill/role-dispatcher/
  SKILL.md                          # Core dispatch logic
  references/
    role-index.md                   # Category index with keywords
    prompt-templates.md             # Structured agent prompt templates
    collaboration-protocol.md       # Multi-agent coordination protocol
    model-selection-guide.md        # Model selection decision matrix
    examples.md                     # 9 complete dispatching scenarios
    context-persistence-protocol.md # Agent checkpoint & continuation protocol
  assets/roles/
    01-software-development.md      # 13 roles
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
    14-game-development.md          # 25 roles
```

---

## Contributing

Contributions welcome! You can:

- **Add roles** — Submit a PR adding new roles to existing category files (include Key Skills)
- **Add categories** — Create a new role file and update `references/role-index.md`
- **Improve templates** — Enhance the agent prompt templates or collaboration protocol
- **Add examples** — Contribute real-world dispatching scenarios to `references/examples.md`

---

## Support the Project

If you find this skill useful and want to help me build more tools like this, consider making a donation!

**BTC:** `bc1qyevk4km8sewy4j0xjhul8m7slprm8vj3farjph`
[Pay with Trust Wallet](https://link.trustwallet.com/send?coin=0&address=bc1qyevk4km8sewy4j0xjhul8m7slprm8vj3farjph)

**ETH:** `0xe1581e0ED99e57DBe7793E81bE35E1c81148B326`
[Pay with Trust Wallet](https://link.trustwallet.com/send?coin=60&address=0xe1581e0ED99e57DBe7793E81bE35E1c81148B326)

**ADA:** `addr1qymnqk9nf2ud469fv8zazk595qw0ccckvmq6q7pafjrwl5fhrg4v3zyw90ymp3rtrq7d9wjp3ddu9svq3mr0mvq36paq5fn4vx`
[Pay with Trust Wallet](https://link.trustwallet.com/send?coin=1815&address=addr1qymnqk9nf2ud469fv8zazk595qw0ccckvmq6q7pafjrwl5fhrg4v3zyw90ymp3rtrq7d9wjp3ddu9svq3mr0mvq36paq5fn4vx)

**TRX:** `TAH6a2MmEYenKSBSa3fyCuBVUxUQpAH9b6`
[Pay with Trust Wallet](https://link.trustwallet.com/send?coin=195&address=TAH6a2MmEYenKSBSa3fyCuBVUxUQpAH9b6)

Every contribution helps fund development of new skills and improvements. Thank you!

---

## License

[MIT](LICENSE)
