# Model Selection Guide

## Decision Matrix

| Task Type | Agents | Review Agent | Model | Rationale |
|-----------|--------|-------------|-------|-----------|
| Q&A / Explanation | 1 | No | `claude-haiku-4-5-20251001` | Simple knowledge retrieval, fast response |
| Single-file code generation | 1 | No | `claude-sonnet-4-6` | Good code quality, balanced speed |
| Code review / debugging | 1-2 | Optional | `claude-sonnet-4-6` | Needs reasoning but focused scope |
| Multi-file feature | 2 | Yes | `claude-sonnet-4-6` | Multiple concerns, needs coordination |
| Architecture / system design | 2-3 | Yes | `claude-opus-4-6` | Deep reasoning, complex trade-offs |
| Security audit / review | 1-2 | Yes | `claude-opus-4-6` | Critical accuracy, no room for error |
| Multi-agent coordination | 3 | Yes | `claude-opus-4-6` | Complex orchestration, synthesis |

## Quick Decision Flow

```
Is it a simple question or small edit?
  YES -> Haiku
  NO  -> Does it require multi-file changes or 2+ agents?
    NO  -> Sonnet
    YES -> Is it architecture, security, or 3-agent coordination?
      NO  -> Sonnet
      YES -> Opus
```

## Cost-Performance Trade-offs

| Model | Speed | Quality | Cost | Best For |
|-------|-------|---------|------|----------|
| Haiku | Fast | Good | Low | Quick answers, simple tasks, explanations |
| Sonnet | Medium | Very Good | Medium | Most development work, debugging, features |
| Opus | Slower | Excellent | High | Complex architecture, security, multi-agent synthesis |

## Override Rules

- **Always use Opus** for: security-sensitive tasks, system architecture, tasks touching production infrastructure
- **Never use Haiku** for: multi-file code changes, security analysis, architecture decisions
- **User override**: If the user explicitly requests a model, respect their choice regardless of this guide
