---
name: role-dispatcher
description: Analyzes user requests and dispatches specialized IT agents from 185+ professional roles. Supports multi-agent collaboration with review protocol, confidence-based model selection, and user override for roles and model.
trigger_keywords: build, create, develop, design, deploy, debug, fix, optimize, architect, secure, test, analyze, migrate, automate, review, audit, plan, manage
---

# Role Dispatcher v2

## Purpose

Match user requests to the most relevant IT specialist roles (from 185+ across 13 categories), dispatch specialized agents, coordinate their collaboration, and synthesize results.

## Step 1: Detect Language & Skip Check

**Language**: Detect the user's language from their message. Set `RESPONSE_LANGUAGE` for all agents. The language is used only for responses — internal matching always uses English keywords.

**Skip check**: If the request is a simple question, casual chat, or non-IT topic, respond directly. Do NOT activate the dispatch system.

## Step 2: Analyze & Match Categories

Read `references/role-index.md` (relative to this skill's directory) and match the request against English keywords. Claude intrinsically understands requests in any language — no translated keywords are needed.

Identify 1-3 relevant categories. Then read ONLY the matching files from `assets/roles/`.

## Step 3: Select Roles & Agent Count

| Complexity | Agents | Review Agent | Example |
|------------|--------|-------------|---------|
| Focused, single domain | 1 | No | "Write a React component" |
| Two areas, some overlap | 2 | Yes | "Build API + frontend" |
| Multi-domain, architectural | 3 | Yes | "Design a secure e-commerce system" |

**Max 3 agents.** For complex tasks, group related competencies into a single role.

## Step 4: Classify Dependencies

Read `references/collaboration-protocol.md` for the full protocol. Quick reference:

- **INDEPENDENT**: No data flow between agents -> run in **parallel**
- **DEPENDENT**: Output of one feeds another -> run **sequentially**, pass handoff notes
- **MIXED**: Parallel first, then sequential for dependent parts

## Step 5: Select Model

Read `references/model-selection-guide.md` for the full matrix. Quick reference:

| Complexity | Model |
|------------|-------|
| Q&A, small edits | `claude-haiku-4-5-20251001` |
| Features, debugging, single-domain | `claude-sonnet-4-6` |
| Architecture, security, multi-agent | `claude-opus-4-6` |

## Step 6: Propose & Confirm

Present the proposed dispatch to the user and wait for confirmation before proceeding.

```
**Proposed dispatch:**
- {Role Name}: {brief contribution description}
- {Role Name}: {brief contribution description}

**Model:** {model} ({complexity} complexity)

Proceed? You can:
- **Enter/yes** to proceed as proposed
- **Change roles**: e.g. "use Security Engineer instead of Backend Developer"
- **Change model**: e.g. "use opus" or "use haiku"
- **Both**: e.g. "use only Frontend Developer with sonnet"
```

If the user modifies roles or model, adjust the dispatch accordingly and proceed. If the user confirms (or just says "yes" / presses Enter), proceed with the original proposal.

## Step 7: Dispatch Agents

Read `references/prompt-templates.md` for the full template. For each role, create an agent using the `Agent` tool with `subagent_type: "general-purpose"`.

Each agent prompt MUST include:
1. Role name and description from the role file
2. Expertise profile and behavioral guidelines
3. The concrete task from the user's request
4. Language directive: respond in `{RESPONSE_LANGUAGE}`
5. Confidence rating requirement: HIGH / MEDIUM / LOW
6. Handoff notes section (if multi-agent)

## Step 8: Review & Synthesize

**Single agent**: Present the result directly.

**Multi-agent**: Read `references/collaboration-protocol.md` and apply the Review Agent protocol:
1. Check completeness against the original request
2. Detect conflicts between agent outputs
3. Verify integration (pieces fit together)
4. Compute aggregate confidence = minimum of individual confidences
5. Decision: APPROVE / NEEDS_REVISION / ESCALATE

If **ESCALATE**: Present conflicting perspectives with pros/cons. Let the user decide.

If **APPROVE**: Synthesize into a single coherent response.

## Rules

- Respond in the user's detected language
- Max 3 agents per request
- All file paths are relative to this skill directory (use `assets/roles/` and `references/`)
- For detailed examples, read `references/examples.md`
- Use `Agent` tool with `subagent_type: "general-purpose"` for each agent
- Agents run in parallel when INDEPENDENT, sequentially when DEPENDENT
- LOW confidence from any agent triggers automatic ESCALATE
- Always wait for user confirmation in Step 6 before dispatching agents
