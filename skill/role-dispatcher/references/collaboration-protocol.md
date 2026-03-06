# Agent Collaboration Protocol

## 1. Independence Check

Before dispatching agents, classify the task:

| Type | Definition | Execution | Example |
|------|-----------|-----------|---------|
| **INDEPENDENT** | Agents work on separate concerns with no data dependencies | Parallel | "Build API + design UI" |
| **DEPENDENT** | One agent's output feeds into another's input | Sequential | "Design schema, then build API on it" |
| **MIXED** | Some parts independent, some dependent | Parallel first, then sequential | "Research + design (parallel), then implement (sequential)" |

## 2. Review Agent Protocol

**When required**: Always when 2+ agents are dispatched.

The Review Agent activates AFTER all specialist agents complete. Its responsibilities:

1. **Validate completeness**: Every part of the user's request is addressed
2. **Detect conflicts**: Contradicting recommendations between agents
3. **Verify integration**: Outputs fit together into a coherent whole
4. **Assess aggregate confidence**: Overall confidence = minimum of all individual agent confidences

### Review Agent Decisions

| Decision | When | Action |
|----------|------|--------|
| **APPROVE** | No conflicts, complete coverage, HIGH/MEDIUM confidence | Synthesize and present to user |
| **NEEDS_REVISION** | Minor gaps or inconsistencies | Request specific agent to revise |
| **ESCALATE** | Critical conflicts or LOW confidence | Present both perspectives with pros/cons, let user decide |

## 3. Conflict Resolution

When agents disagree:

1. **Identify the conflict**: What exactly do they disagree on?
2. **Present both sides**: Each agent's position with reasoning
3. **Provide trade-offs**: Pros and cons of each approach
4. **Do NOT auto-resolve**: Let the user decide. Present options clearly:

```
The agents provided different recommendations on [topic]:

**Option A** ({ROLE_1}): {recommendation}
- Pros: ...
- Cons: ...

**Option B** ({ROLE_2}): {recommendation}
- Pros: ...
- Cons: ...

Which approach do you prefer?
```

## 4. Confidence Scoring

### Individual Agent Confidence

| Level | Meaning | Criteria |
|-------|---------|----------|
| **HIGH** | Strong match | Role's core expertise directly applies to the task |
| **MEDIUM** | Adjacent match | Role has relevant knowledge but task is at the edge of expertise |
| **LOW** | Partial match | Role can contribute but another specialist would be better |

### Aggregate Confidence

- **Aggregate = minimum of all individual confidences**
- If ANY agent reports LOW -> escalate to user with transparency
- If all HIGH -> high confidence in the synthesized answer
- Mixed HIGH/MEDIUM -> proceed with medium confidence, note limitations

## 5. Handoff Protocol

When agents need to pass information:

1. **Source agent** includes in Handoff Notes:
   - What data/decisions the next agent needs
   - Constraints or assumptions made
   - Open questions that affect downstream work

2. **Receiving agent** gets the handoff notes prepended to their prompt:
   ```
   ### Context from {SOURCE_ROLE}
   {HANDOFF_NOTES}

   Consider these inputs when working on your task.
   ```

## 6. Escalation Triggers

Automatically escalate to user when:
- Any agent reports LOW confidence
- Agents produce contradicting recommendations
- The task requires domain knowledge not covered by available roles
- The estimated complexity exceeds what agents can handle autonomously
