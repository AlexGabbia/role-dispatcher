---
name: role-dispatcher
description: >
  Analyzes user requests and dispatches specialized AI agents from 209+ IT professional roles across 14 categories.
  Triages requests into SKIP (answer directly), FAST (1 agent, no confirmation), or FULL (multi-agent with confirmation).
  Use for technical/IT tasks: building features, fixing bugs, designing systems, reviewing code, infrastructure,
  architecture, security audits, data pipelines, game development, marketing strategy, and more.
  Triggers on: build, create, develop, design, deploy, debug, fix, optimize, architect, secure,
  test, analyze, migrate, automate, review, audit, plan, manage, refactor, scale, monitor, integrate, configure, implement.
---

# Role Dispatcher v2

## Purpose

Match user requests to the most relevant IT specialist roles (209+ across 14 categories), dispatch specialized agents, coordinate their collaboration, and synthesize results.

## Step 1: Language Detection & Triage

**Language**: Detect the user's language. Set `RESPONSE_LANGUAGE` for all outputs. Internal matching always uses English keywords regardless of input language.

**Triage** — Classify the request into one of three lanes:

| Lane | Criteria | Action |
|------|----------|--------|
| **SKIP** | Simple factual question, no implementation, no code/architecture involved | Answer directly as generalist. Do NOT dispatch. |
| **FAST** | Single domain clearly identified, 1 obvious role match, low-medium complexity | Skip confirmation (Step 6). Dispatch 1 agent directly. |
| **FULL** | Multi-domain, ambiguous match, high complexity, or 2+ agents needed | Full flow with confirmation at Step 6. |

**Decision examples:**
- SKIP: "What does useEffect do?", "Explain REST vs GraphQL", "What's a mutex?"
- FAST: "Fix this TypeScript error", "Write a Python function that...", "Optimize this SQL query"
- FULL: "Build an API with auth and a React dashboard", "Design a microservices architecture", "Security audit of our platform"

**Default to FAST over FULL when in doubt. Default to FAST over SKIP when the request involves any code or file.**

**Context persistence**: For FULL tasks with medium-high complexity (3+ agents or estimated 30+ tool calls per agent), enable context persistence (PERSIST=YES). Read `references/context-persistence-protocol.md`. For FAST/SKIP tasks, PERSIST=NO.

## Step 2: Analyze Request & Match Categories

Read `references/role-index.md` to identify 1-3 matching categories using this two-pass approach:

**Pass 1 — Keyword scan**: Match the request against category keywords. Most requests match clearly here.

**Pass 1.5 — Intent pattern matching** (if Pass 1 yields 0 matches): Check the intent patterns table in `references/role-index.md` before falling back to semantic inference. Intent patterns catch common natural-language requests that don't contain technical keywords.

**Pass 2 — Semantic inference** (if Pass 1 and Pass 1.5 are ambiguous or yield 0 matches): Consider the intent behind the request, not just literal words. Example: "make my app faster" has no direct keyword, but maps to Infrastructure & Ops (performance) or QA & Testing (performance testing) depending on context.

**Edge cases:**
- **No match found**: Tell the user no specialist role fits well, then answer directly as a generalist
- **Too many matches (4+)**: Narrow down by asking the user which aspect they want to focus on first
- **Ambiguous match**: Prefer the category that covers the primary deliverable, not the secondary concern

Read ONLY the matched role files from `assets/roles/`.

## Step 3: Select Specific Roles & Agent Count

Within the matched category files, select the best role(s) by comparing the request against each role's **Description** and **Key Skills** columns.

| Complexity | Agents | Review Agent | Signal |
|------------|--------|-------------|--------|
| Single domain, clear deliverable | 1 | No | "Write a React component", "Optimize this query" |
| Two domains with integration points | 2-3 | Yes | "Build API + frontend", "Design and deploy" |
| Multi-domain, architectural scope | 3-5 | Yes | "Design a secure e-commerce platform" |
| Large-scale project, cross-layer work | 5-10+ | Yes (or Team Lead) | "Build a complete SaaS platform", "Full security audit of microservices" |

**Scale agents to actual complexity.** Match the number of agents to the number of genuinely distinct roles needed. Don't inflate for the sake of it, don't compress when more specialists would help. If a single "Full-Stack Developer" genuinely covers the request, use one agent. If a project spans frontend, backend, database, security, DevOps, and design — use six.

**Role selection heuristic**: Pick the most specialized role that covers the request. "Set up Kubernetes cluster" should match Kubernetes Administrator (specific) over Cloud Engineer (broad). Use the Key Skills column to break ties between similar roles.

## Step 4: Classify Dependencies & Select Dispatch Mode

Read `references/collaboration-protocol.md` for the full protocol.

### Dependency Classification

- **INDEPENDENT**: No data flow between agents -> run in **parallel**
- **DEPENDENT**: Output of one feeds another -> run **sequentially**, pass handoff notes
- **MIXED**: Parallel first, then sequential for dependent parts

### Dispatch Mode Selection

| Agents | Collaboration needed? | Mode | Why |
|--------|----------------------|------|-----|
| 1 | N/A | **Single subagent** | Simple, focused task |
| 2-4, independent | No | **Parallel subagents** | Fast, low overhead |
| 2-4, dependent | Minimal (handoff notes) | **Sequential subagents** | One feeds the next, dispatcher coordinates |
| 5+ OR agents need to discuss/challenge each other | Yes | **Agent Team** (TeamCreate) | Shared tasks, direct messaging, self-coordination |

**Agent Teams fallback**: If Agent Team mode is selected but the experimental flag `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` is not active, automatically degrade to sequential subagents with enhanced handoff notes. Notify the user: "Agent Teams not available — using coordinated subagents instead." See `references/collaboration-protocol.md` § Fallback Protocol for details.

**User override**: "use a team" forces Agent Team mode even for 2 agents. "use subagents" forces subagent mode even for 5+.

**Note**: Agent Teams require the experimental flag `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in `.claude/settings.json`.

## Step 5: Select Model

Read `references/model-selection-guide.md` for the full matrix. Quick reference:

| Complexity | Model |
|------------|-------|
| Q&A, small edits | `claude-haiku-4-5-20251001` |
| Features, debugging, single-domain | `claude-sonnet-4-6` |
| Architecture, security, multi-agent | `claude-opus-4-6` |

## Step 6: Propose & Confirm

**Fast-path tasks skip this step.** If triage (Step 1) classified the request as FAST, proceed directly to Step 7 with the single matched agent. No confirmation needed.

Present the dispatch plan and **wait for user confirmation** before proceeding. This step is mandatory for FULL tasks — never skip it.

```
**Proposed dispatch:**
- {Role Name}: {brief contribution description}
  Key skills: {key skills from role file}
- {Role Name}: {brief contribution description}
  Key skills: {key skills from role file}

**Model:** {model} ({complexity} complexity)
**Execution:** {INDEPENDENT | DEPENDENT | MIXED}
**Dispatch mode:** {Subagents | Agent Team} — {reason}

Proceed? You can:
- **yes** to proceed as proposed
- **Change roles**: e.g. "use Security Engineer instead of Backend Developer"
- **Change model**: e.g. "use opus" or "use haiku"
- **use team** / **use subagents**: override the dispatch mode
- **Combine**: e.g. "use only Frontend Developer with sonnet"
```

If the user modifies roles, model, or dispatch mode, adjust and proceed. If they confirm, proceed with the original proposal.

## Step 7: Dispatch Agents

Read `references/prompt-templates.md` for the full template.

### Path A: Subagent Dispatch (default for 1-4 agents)

For each role, create an agent using the `Agent` tool with `subagent_type: "general-purpose"`.

Each agent prompt MUST include:
1. **Role identity**: Name, description, and key skills from the role file
2. **Expertise framing**: "You approach this as a {Role Name} with deep expertise in {Key Skills}"
3. **The concrete task** from the user's request
4. **Language directive**: Respond in `{RESPONSE_LANGUAGE}`
5. **Confidence requirement**: Rate HIGH / MEDIUM / LOW with brief justification
6. **Collaboration context** (if multi-agent): Focus area, what other agents cover, handoff notes format

**Parallel dispatch**: Launch all INDEPENDENT agents in a single message with multiple Agent tool calls. For DEPENDENT agents, wait for each to complete before dispatching the next with handoff notes.

**Context persistence** (if PERSIST=YES): Create the `.dispatch/` directory and add `.dispatch/` to `.gitignore` if not already present. Then create `.dispatch/STATE.md` with the project goal, agent roster, and dispatch mode. Add context persistence instructions to each agent's prompt (see `references/prompt-templates.md` - Context Persistence Section). Agents will self-checkpoint and signal if they need continuation.

### Path B: Agent Team Dispatch (for 5+ agents or when deep collaboration is needed)

Use the `TeamCreate` tool to create a team, then spawn teammates via the `Agent` tool with `team_name`.

1. **Create the team**: `TeamCreate` with a descriptive team name and the overall goal
2. **Spawn teammates**: For each role, use `Agent` tool with `team_name` set to the created team. Use the **Teammate Template** from `references/prompt-templates.md`
3. **Team Lead**: The first agent spawned acts as Team Lead. Use the **Team Lead Template**. The Team Lead:
   - Creates shared tasks via the task list for the team to work on
   - Coordinates work assignment among teammates
   - Acts as the Review Agent (synthesizes final output)
   - Sends direct messages to teammates when needed
4. **Self-coordination**: Teammates claim tasks, communicate via messaging, and deliver their parts. The dispatcher does NOT need to manually orchestrate — the team self-coordinates
5. **Completion**: The Team Lead synthesizes all contributions and delivers the final result

**Context persistence** (if PERSIST=YES): Create the `.dispatch/` directory and add `.dispatch/` to `.gitignore` if not already present. Then create `.dispatch/STATE.md` before spawning the team. Instruct the Team Lead to enforce checkpointing: teammates must write their progress to `.dispatch/{AGENT_ID}-log.md` periodically. If a teammate signals CHECKPOINT via message, the Team Lead spawns a fresh replacement pointing to the log file (max 5 continuations per teammate).

## Step 7.5: Checkpoint & Continuation (if PERSIST=YES)

When a subagent's output contains a checkpoint signal (scan the **last 10 lines** for any of: `<!-- CHECKPOINT:CONTINUE -->`, `CHECKPOINT:CONTINUE`, or `**CHECKPOINT**:`):

1. Read the agent's work log at `.dispatch/{AGENT_ID}-log.md`
2. Check the `continuation` value in the log's frontmatter
3. If continuation < 5: Spawn a **new** Agent tool call with the same role (use Continuation Agent Template from `references/prompt-templates.md`), setting `continuation: N+1`
4. If continuation = 5: **Stop**. Present what has been completed so far and ask the user how to proceed with remaining work
5. The fresh agent reads the log and resumes from "Next Steps"
6. Repeat until the agent completes without CHECKPOINT or hits the continuation limit

**Fallback detection**: If a subagent ends without a CHECKPOINT signal but a `.dispatch/{AGENT_ID}-log.md` exists with status `IN_PROGRESS` and non-empty "Next Steps", treat it as an implicit checkpoint and spawn a continuation.

Agent Team mode: The Team Lead manages continuations internally — spawning fresh teammates when they signal CHECKPOINT.

See `references/context-persistence-protocol.md` for the full protocol.

## Step 8: Review & Synthesize

**Single agent**: Present the result directly. If confidence is LOW, flag it to the user.

**Multi-agent (Subagent mode)**: Apply the Review Agent protocol from `references/collaboration-protocol.md`:
1. Check completeness against the original request
2. Detect conflicts between agent outputs
3. Verify integration (pieces fit together)
4. Compute aggregate confidence = minimum of individual confidences
5. Decision: APPROVE / NEEDS_REVISION / ESCALATE

**Multi-agent (Agent Team mode)**: The Team Lead acts as Review Agent:
1. Collects all teammate contributions via the shared task list
2. Applies the same review protocol (completeness, conflicts, integration, confidence)
3. Synthesizes the final response
4. The dispatcher presents the Team Lead's synthesis to the user

If **ESCALATE**: Present conflicting perspectives with pros/cons. Let the user decide.
If **APPROVE**: Synthesize into a single coherent response in `{RESPONSE_LANGUAGE}`.

**Cleanup** (if PERSIST=YES): The `.dispatch/` directory is automatically added to `.gitignore` at creation time. After synthesis, inform the user that dispatch state is saved in `.dispatch/` and can be deleted if no longer needed.

## Rules

- Respond in the user's detected language
- Scale agent count to match task complexity — no artificial limit
- All file paths are relative to this skill directory (use `assets/roles/` and `references/`)
- For detailed examples, read `references/examples.md`
- **Subagent mode**: Use `Agent` tool with `subagent_type: "general-purpose"` for each agent
- **Agent Team mode**: Use `TeamCreate` then `Agent` with `team_name` — requires experimental flag `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`
- Agents run in parallel when INDEPENDENT, sequentially when DEPENDENT
- LOW confidence from any agent triggers automatic ESCALATE
- Always wait for user confirmation in Step 6 before dispatching agents (FULL tasks only; FAST tasks skip confirmation)
- Prefer the most specialized role over a generalist one when both could apply
- User can override dispatch mode with "use team" or "use subagents"
- The value of role dispatch is **structured prompt framing**: forcing specialist perspective, focused scope, and domain-specific vocabulary. It does not grant capabilities the model lacks — it activates relevant knowledge more effectively
- FAST-path tasks skip Step 6 (confirmation). SKIP tasks bypass dispatch entirely
- Context persistence is enabled only for FULL tasks with medium-high complexity (PERSIST=YES)
- Agents self-monitor and checkpoint; the dispatcher handles continuation spawning
