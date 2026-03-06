# Context Persistence Protocol

## Purpose

Prevent context rot in long-running tasks by giving agents persistent work logs and a mechanism for context restart. When an agent approaches context saturation, it checkpoints its progress and a fresh agent continues from the saved state.

## When to Enable (PERSIST=YES)

Enable context persistence when ALL of these apply:
- Task is on the **FULL** path (not SKIP or FAST)
- Medium-high complexity: 3+ agents OR estimated 30+ tool calls per agent
- Task involves multi-phase work where losing context would cause rework

**Skip persistence** (PERSIST=NO) when:
- SKIP or FAST lane tasks
- Estimated < 20 tool calls total
- Single agent on a straightforward task

## Directory Structure

Context persistence uses a `.dispatch/` directory in the project root:

```
.dispatch/
  STATE.md              # Global dispatch state (created by dispatcher)
  {agent-id}-log.md     # Work log per agent (e.g., backend-01-log.md)
```

The dispatcher creates `.dispatch/` and adds `.dispatch/` to `.gitignore` if not already present.

## STATE.md Format (< 50 lines)

Created by the dispatcher before spawning agents. Updated by the dispatcher, Team Lead, **and by each agent when it checkpoints** (agents update their own status line).

```markdown
# Dispatch State

## Project Goal
{One-line description of the user's request}

## Agent Roster

| ID | Role | Focus Area | Status |
|----|------|------------|--------|
| backend-01 | Backend Developer | REST API + auth | IN_PROGRESS |
| frontend-01 | Frontend Developer | React dashboard | IN_PROGRESS |
| security-01 | Security Engineer | Auth architecture | COMPLETE |

## Global Decisions
- {Decision 1}: {rationale}
- {Decision 2}: {rationale}

## Status Summary
- backend-01: Completed schema design, working on endpoints (3/7)
- frontend-01: Component library set up, building auth pages
- security-01: Delivered auth spec, JWT + RBAC approach
```

**Agent duty**: When an agent checkpoints, it MUST update its own status line in STATE.md (Status Summary section and Agent Roster status column). This keeps the global state current for other agents and the dispatcher.

## Agent Work Log Format (< 120 lines)

Each agent maintains its own log at `.dispatch/{AGENT_ID}-log.md`. The log is the agent's persistent memory across context restarts.

```markdown
---
agent: Backend Developer
id: backend-01
continuation: 0
files_touched: 14
status: IN_PROGRESS
last_updated: 2026-03-06T14:30:00
---

## Completed
- [x] Designed database schema (PostgreSQL, 8 tables)
- [x] Implemented user authentication (JWT + refresh tokens)
- [x] Set up project structure and dependencies

## In Progress
- [ ] REST API endpoints (3 of 7 done: users, auth, teams)

## Key Decisions
- PostgreSQL over MongoDB (relational data model fits better)
- JWT with 15min access + 7d refresh tokens
- Express.js with Zod validation

## Next Steps
- Complete remaining 4 endpoints (projects, tasks, billing, notifications)
- Add validation middleware for all endpoints
- Write integration tests for auth flow

## Files Modified
- src/db/schema.sql
- src/auth/jwt.service.ts
- src/routes/users.ts
- src/routes/auth.ts
- src/routes/teams.ts
```

### Log Rules

- **Max 120 lines**. If the log grows beyond this, summarize older completed items into a single line (e.g., "Phase 1: schema + auth + project setup [DONE]")
- **YAML frontmatter** is mandatory: agent, id, continuation, files_touched, status, last_updated
- **`continuation`**: Set by the dispatcher. First agent gets `0`, first continuation gets `1`, etc. The agent does NOT change this value
- **`files_touched`**: The agent tracks how many distinct files it has read or modified. This is the primary checkpoint metric — increment it as you work
- **Status values**: `IN_PROGRESS`, `CHECKPOINT`, `COMPLETE`
- Update the log at every checkpoint, not continuously

## Checkpoint Triggers

Agents self-monitor and checkpoint based on these heuristics (in priority order).

**THIS IS NON-NEGOTIABLE.** Agents MUST checkpoint when any trigger is hit. Before ending your response, verify: "Have I hit any checkpoint trigger? If yes, have I written my log?"

### 1. Phase Boundary (highest priority)
After completing a logical phase of work (e.g., finishing all database work before moving to API layer). **Always checkpoint at phase boundaries** even if other metrics are low.

### 2. Files Touched (primary metric)
Track how many distinct files you have read or modified:
- **15+ files touched**: Write/update the work log (soft checkpoint)
- **25+ files touched**: If significant work remains, write the log and signal for continuation (hard checkpoint)

This is the most reliable metric because agents can track it precisely.

### 3. Tool Call Estimate (secondary metric)
As a secondary heuristic (agents cannot count precisely, so estimate conservatively):
- **~25 tool calls**: Write/update the work log (soft checkpoint)
- **~40 tool calls**: If significant work remains, write the log and signal for continuation (hard checkpoint)

### 4. Self-Monitoring
Checkpoint immediately if the agent notices:
- Re-reading files it already processed earlier in the session
- Losing precision in its responses or forgetting earlier decisions
- Repeating analysis it already performed

These are symptoms of context saturation. Do not ignore them.

### Phase-First Rule
If the agent is close to finishing a phase (< 5 tool calls away), **finish the phase first** before checkpointing. A clean phase boundary makes continuation much smoother.

### Pre-Exit Verification (MANDATORY)
Before ending your response — whether completing the task or not — run this check:
1. Have I touched 15+ files? → Write log if not already done
2. Am I ending with significant work remaining? → Signal CHECKPOINT:CONTINUE
3. Have I updated my status in `.dispatch/STATE.md`? → Update it

## Checkpoint Signal

When an agent needs continuation (hard checkpoint):

**Subagent mode**: End the output with one of these accepted formats:
```
<!-- CHECKPOINT:CONTINUE -->
Checkpoint: Work log saved to `.dispatch/{AGENT_ID}-log.md`. Remaining work: {brief summary}.
```

Accepted variations (the dispatcher checks for any of these):
- `<!-- CHECKPOINT:CONTINUE -->`
- `CHECKPOINT:CONTINUE`
- `**CHECKPOINT**: Work log saved to`

The dispatcher scans the **last 10 lines** of the agent's output for any of these patterns. Exact formatting is not critical — the keyword `CHECKPOINT:CONTINUE` in any form is sufficient.

**Agent Team mode**: Send a message to the Team Lead:
```
CHECKPOINT: Work log saved to `.dispatch/{AGENT_ID}-log.md`. I need a fresh continuation to complete: {remaining work summary}.
```

## Continuation Protocol

When a checkpoint signal is received:

### Subagent Mode
1. Dispatcher reads `.dispatch/{AGENT_ID}-log.md`
2. Dispatcher spawns a **new** Agent tool call with the same role, using the **Continuation Agent Template** from `references/prompt-templates.md`
3. Dispatcher sets `continuation: N+1` in the new agent's prompt (where N is the previous value)
4. The fresh agent reads the log and resumes from "Next Steps"
5. The continuation agent follows the same checkpoint protocol — it may checkpoint again if needed
6. Repeat until the agent completes without a CHECKPOINT signal

### Agent Team Mode
1. Team Lead reads the teammate's log file
2. Team Lead spawns a **new** teammate with the same role and a reference to the log file
3. The fresh teammate reads the log, resumes work, and reports back to the Team Lead
4. Team Lead updates `.dispatch/STATE.md` to reflect the continuation

### Maximum Continuations
An agent can be continued at most **5 times** (continuation 0 through 5 = 6 total runs). If an agent reaches continuation 5 and still signals CHECKPOINT:
- **Subagent mode**: The dispatcher stops the continuation loop, presents what has been completed so far, and asks the user how to proceed
- **Agent Team mode**: The Team Lead escalates to the dispatcher with a summary of what remains incomplete

This prevents infinite continuation loops. If a task genuinely needs more than 6 runs per agent, it should be decomposed into smaller sub-tasks.

## Failure Recovery

When an agent fails or produces corrupted output without a proper checkpoint:

### No Log File Exists
If the agent ends (crash, timeout, or unexpected termination) and no `.dispatch/{AGENT_ID}-log.md` exists:
1. The dispatcher spawns a fresh agent with the same role from scratch (continuation: 0)
2. The dispatcher notes in STATE.md: "Previous instance failed without checkpoint. Restarting."

### Log File Exists but No CHECKPOINT Signal
If the agent ends without a CHECKPOINT signal but a log file exists with status `IN_PROGRESS`:
1. The dispatcher reads the log to assess progress
2. If "Next Steps" is non-empty, the dispatcher spawns a continuation agent pointing to the log
3. If "Next Steps" is empty or the log indicates near-completion, the dispatcher marks the agent as COMPLETE

### Corrupted or Incomplete Log
If the log file exists but is malformed (no YAML frontmatter, missing required sections):
1. The dispatcher extracts whatever useful information it can (file paths, decisions)
2. Spawns a fresh agent (continuation: 0) with a note: "A previous instance left partial progress. Relevant files: {extracted file list}. Verify their state before proceeding."

## Relationship with Other Protocols

| Protocol | Purpose | Scope |
|----------|---------|-------|
| **Handoff notes** (collaboration-protocol.md Section 7) | Pass info between DIFFERENT agents | Cross-agent |
| **Work logs** (this protocol) | Pass info between INSTANCES of the SAME agent | Same-agent continuity |
| **STATE.md** | Global view for dispatcher/Team Lead | Cross-agent overview |

All three coexist. Key decisions recorded in a work log also serve as context for other agents reading STATE.md.

## Cleanup

After the task completes and the dispatcher synthesizes the final result:
- Inform the user that dispatch state is saved in `.dispatch/`
- The `.dispatch/` directory is already in `.gitignore` (added automatically by the dispatcher)
- The `.dispatch/` directory can be deleted after the task is fully complete, or kept for reference
