# Dispatching Examples

## Example 1: SKIP (No Dispatch)

**User request**: "What does useEffect do in React?"

### Triage Decision
- **Lane**: SKIP
- **Reason**: Simple factual question, no implementation, no code involved
- **Action**: Answer directly as generalist. No agents dispatched.

-> Dispatcher answers the question directly without any role matching or agent dispatch.

---

## Example 2: FAST (Single Agent, No Confirmation)

**User request**: "Fix this TypeScript error: Property 'name' does not exist on type '{}'."

### Triage Decision
- **Lane**: FAST
- **Reason**: Single domain (Software Development), 1 obvious role (Frontend/Full-Stack Developer), low complexity

### Dispatch Decision
- **Category match**: Software Development (keyword: TypeScript)
- **Role**: Frontend Developer
- **Agents**: 1
- **Model**: Sonnet (debugging, focused scope)

-> Dispatcher skips confirmation (Step 6) and immediately dispatches a Frontend Developer agent on Sonnet.

---

## Example 3: Simple with Confirmation (Single Agent, FULL)

**User request**: "How do I optimize this SQL query that's taking 30 seconds?"

### Triage Decision
- **Lane**: FULL (could be FAST, but query optimization may involve architecture discussion — defaults to FULL for ambiguous scope)

### Dispatch Decision
- **Category match**: Infrastructure & Ops (keyword: database)
- **Role**: Database Administrator (DBA)
- **Agents**: 1
- **Review Agent**: No
- **Model**: Sonnet (debugging, focused scope)

### Propose & Confirm

```
**Proposed dispatch:**
- Database Administrator (DBA): SQL query optimization and execution plan analysis

**Model:** claude-sonnet-4-6 (medium complexity)

Proceed? You can:
- **Enter/yes** to proceed as proposed
- **Change roles**: e.g. "use Data Engineer instead"
- **Change model**: e.g. "use opus" or "use haiku"
- **Both**: e.g. "use Data Engineer with haiku"
```

**User**: "yes"
-> Dispatcher proceeds with DBA agent on Sonnet.

---

## Example 4: Medium (Two Agents)

**User request**: "I need to build a REST API with authentication and a React dashboard to manage users"

### Dispatch Decision
- **Categories**: Software Development + Cybersecurity
- **Roles**: Backend Developer + Frontend Developer
- **Independence**: MIXED (API design independent of UI, but UI depends on API endpoints)
- **Agents**: 2 (parallel for design, sequential for integration)
- **Review Agent**: Yes
- **Model**: Sonnet (multi-file feature, but well-defined scope)

### Propose & Confirm

```
**Proposed dispatch:**
- Backend Developer: REST API design with authentication
- Frontend Developer: React dashboard for user management

**Model:** claude-sonnet-4-6 (medium complexity)

Proceed? You can:
- **Enter/yes** to proceed as proposed
- **Change roles**: e.g. "add Security Engineer"
- **Change model**: e.g. "use opus"
- **Both**: e.g. "add Security Engineer with opus"
```

**User**: "yes"
-> Dispatcher proceeds with 2 agents on Sonnet.

### Collaboration
- Backend agent provides: endpoint list, auth flow, response schemas
- Frontend agent receives handoff notes with API contract
- Review agent checks: API contract matches frontend expectations, auth flow is consistent

---

## Example 5: Complex (Three Agents)

**User request**: "Design a microservices architecture for our e-commerce platform with payment processing, inventory management, and real-time notifications"

### Dispatch Decision
- **Categories**: Consulting & Training + Software Development + Infrastructure & Ops
- **Roles**: Software Architect + Backend Developer + DevOps Engineer
- **Independence**: DEPENDENT (architecture first, then implementation, then deployment)
- **Agents**: 3 (sequential)
- **Review Agent**: Yes (mandatory for 3-agent coordination)
- **Model**: Opus (architecture + multi-agent coordination)

### Propose & Confirm

```
**Proposed dispatch:**
- Software Architect: microservices boundaries and communication patterns
- Backend Developer: service implementation and API contracts
- DevOps Engineer: deployment strategy and CI/CD pipeline

**Model:** claude-opus-4-6 (high complexity)

Proceed? You can:
- **Enter/yes** to proceed as proposed
- **Change roles**: e.g. "use Security Architect instead of Backend Developer"
- **Change model**: e.g. "use sonnet"
- **Both**: e.g. "remove DevOps Engineer, use sonnet"
```

**User**: "yes"
-> Dispatcher proceeds with 3 agents on Opus.

### Execution Sequence
1. **Software Architect** (first): Defines microservice boundaries, communication patterns, data ownership
2. **Backend Developer** (second): Receives architecture, designs service implementations, API contracts, data models
3. **DevOps Engineer** (third): Receives architecture + implementation plan, designs deployment, CI/CD, monitoring

### Review Agent Assessment
- Checks architecture is implementable with proposed tech stack
- Verifies deployment strategy supports the architectural patterns
- Validates all three outputs form a coherent, buildable system
- Aggregate confidence: minimum of three agents

---

## Example 6: User Override (Role + Model Change)

**User request**: "Set up a CI/CD pipeline for our Node.js monorepo with staging and production environments"

### Dispatch Decision
- **Category match**: Infrastructure & Ops
- **Roles**: DevOps Engineer + SRE
- **Agents**: 2
- **Review Agent**: Yes
- **Model**: Sonnet

### Propose & Confirm

```
**Proposed dispatch:**
- DevOps Engineer: CI/CD pipeline design and implementation
- Site Reliability Engineer (SRE): staging/production environment setup and monitoring

**Model:** claude-sonnet-4-6 (medium complexity)

Proceed? You can:
- **Enter/yes** to proceed as proposed
- **Change roles**: e.g. "use Cloud Engineer instead of SRE"
- **Change model**: e.g. "use opus" or "use haiku"
- **Both**: e.g. "use only DevOps Engineer with haiku"
```

**User**: "use only DevOps Engineer with haiku"

-> Dispatcher adjusts: 1 agent (DevOps Engineer), model changed to Haiku, no review agent needed.

---

## Example 7: Large-Scale Project (Agent Team)

**User request**: "Build a complete SaaS project management tool with user auth, team workspaces, real-time collaboration, Stripe billing, email notifications, and an admin dashboard"

### Dispatch Decision
- **Categories**: Software Development + Design & UX + Infrastructure & Ops + Cybersecurity + E-commerce
- **Roles**: Software Architect, Backend Developer, Frontend Developer, UX/UI Designer, DevOps Engineer, Security Engineer, Payment Integration Specialist
- **Independence**: Highly interdependent — architecture drives all layers, security cross-cuts everything
- **Agents**: 7 (Agent Team mode — too many agents for subagent coordination, deep collaboration needed)
- **Model**: Opus (large-scale architecture + multi-agent coordination)

### Propose & Confirm

```
**Proposed dispatch:**
- Software Architect: system architecture, service boundaries, data models
  Key skills: system design, microservices, event-driven architecture
- Backend Developer: API design, auth, real-time WebSocket layer
  Key skills: Node.js, Python, REST, GraphQL, WebSockets
- Frontend Developer: React app, real-time UI, responsive design
  Key skills: React, TypeScript, state management, WebSocket clients
- UX/UI Designer: user flows, wireframes, design system
  Key skills: Figma, design systems, user research, accessibility
- DevOps Engineer: CI/CD, cloud infrastructure, monitoring
  Key skills: Docker, Kubernetes, Terraform, GitHub Actions
- Security Engineer: auth architecture, data protection, compliance
  Key skills: OAuth, RBAC, encryption, OWASP, GDPR
- Payment Integration Specialist: Stripe billing, subscription management
  Key skills: Stripe API, recurring billing, webhook handling

**Model:** claude-opus-4-6 (high complexity)
**Execution:** MIXED (architecture first, then parallel implementation)
**Dispatch mode:** Agent Team — 7 agents with cross-cutting dependencies need shared coordination

Proceed? You can:
- **yes** to proceed as proposed
- **Change roles**: e.g. "remove UX/UI Designer"
- **Change model**: e.g. "use sonnet"
- **use subagents**: force subagent mode instead of team
- **Combine**: e.g. "remove Payment Specialist, use sonnet"
```

**User**: "yes"
-> Dispatcher creates team via TeamCreate, spawns Software Architect as Team Lead, then 6 teammates.

### Team Execution
1. **Team Lead (Software Architect)** creates tasks: "Define service boundaries", "Design data models", "API contract spec", "Auth architecture", "Deployment strategy", "UI component inventory", "Billing integration spec"
2. Teammates claim tasks matching their expertise
3. Security Engineer broadcasts: "All services must use JWT with refresh tokens, RBAC on every endpoint"
4. Frontend Developer messages Backend Developer: "Need WebSocket event schema for real-time updates"
5. Team Lead monitors progress, resolves conflicts (e.g., REST vs GraphQL debate)
6. Team Lead synthesizes all deliverables into a unified architecture document

---

## Example 8: Competing Hypotheses / Debugging (Agent Team)

**User request**: "Our API response times jumped from 50ms to 2s after yesterday's deploy. We changed the ORM, added a new caching layer, and updated the load balancer config. Need to find the root cause."

### Dispatch Decision
- **Categories**: Infrastructure & Ops + Software Development + QA & Testing
- **Roles**: Database Administrator, Backend Developer, Performance Tester, SRE, DevOps Engineer
- **Independence**: INDEPENDENT investigation, but agents need to **challenge each other's hypotheses**
- **Agents**: 5 (Agent Team mode — competing hypotheses require discussion between agents)
- **Model**: Opus (complex debugging + multi-agent debate)

### Propose & Confirm

```
**Proposed dispatch:**
- Database Administrator: ORM migration analysis, query plan regression
  Key skills: query optimization, ORM tuning, execution plans
- Backend Developer: ORM code review, N+1 queries, connection pooling
  Key skills: ORM patterns, connection management, profiling
- Performance Tester: load testing, response time profiling, bottleneck isolation
  Key skills: JMeter, profiling, latency analysis, benchmarking
- Site Reliability Engineer: load balancer config review, traffic patterns
  Key skills: load balancing, traffic analysis, monitoring, alerting
- DevOps Engineer: deployment diff analysis, infrastructure changes
  Key skills: deploy pipelines, config management, rollback procedures

**Model:** claude-opus-4-6 (high complexity)
**Execution:** INDEPENDENT (parallel investigation)
**Dispatch mode:** Agent Team — competing hypotheses need cross-agent discussion

Proceed? You can:
- **yes** to proceed as proposed
- **Change roles**: e.g. "add Security Engineer"
- **Change model**: e.g. "use sonnet"
- **use subagents**: force subagent mode instead of team
```

**User**: "yes"
-> Dispatcher creates team, spawns DBA as Team Lead (database is primary suspect), then 4 teammates.

### Team Execution
1. Each agent investigates their hypothesis in parallel
2. DBA broadcasts: "ORM is generating 3 extra JOINs per query — likely culprit"
3. Backend Developer responds: "Confirmed N+1 pattern in the new ORM mapping, but connection pool is also misconfigured"
4. SRE messages: "Load balancer change is clean — no impact on latency"
5. Performance Tester: "Profiling confirms 80% of latency is in DB layer, 20% in connection pool exhaustion"
6. Team Lead synthesizes: root cause is ORM migration (N+1 + extra JOINs) compounded by connection pool misconfiguration. Proposes fix with rollback strategy.

---

## Example 9: Context Persistence & Checkpoint (Continuation)

**User request**: "Build a complete REST API for a project management tool: user auth, teams, projects, tasks with subtasks, comments, file attachments, activity log, and role-based permissions. Use Node.js with Express and PostgreSQL."

### Triage Decision
- **Lane**: FULL
- **Reason**: Multi-domain, high complexity, multiple interconnected features
- **PERSIST**: YES (estimated 40+ tool calls per agent, multi-phase work)

### Dispatch Decision
- **Categories**: Software Development + Cybersecurity + Infrastructure & Ops
- **Roles**: Backend Developer, Security Engineer, Database Administrator
- **Independence**: DEPENDENT (schema first, then API, then security layer)
- **Agents**: 3 (sequential)
- **Model**: Opus (high complexity)

### Context Persistence Setup

Dispatcher creates `.dispatch/STATE.md` before spawning agents:

```markdown
# Dispatch State

## Project Goal
Build a complete REST API for project management with auth, teams, projects, tasks, comments, attachments, activity log, and RBAC.

## Agent Roster

| ID | Role | Focus Area | Status |
|----|------|------------|--------|
| dba-01 | Database Administrator | Schema design | IN_PROGRESS |
| backend-01 | Backend Developer | Express API + business logic | WAITING |
| security-01 | Security Engineer | Auth + RBAC | WAITING |

## Global Decisions
(none yet)

## Status Summary
- dba-01: Starting schema design
```

### Checkpoint Scenario

The Backend Developer agent (backend-01) is dispatched after the DBA completes the schema. It works through the API endpoints but reaches 22 files touched after implementing 5 of 12 route groups.

**Agent writes `.dispatch/backend-01-log.md`:**

```markdown
---
agent: Backend Developer
id: backend-01
continuation: 0
files_touched: 22
status: CHECKPOINT
last_updated: 2026-03-06T15:45:00
---

## Completed
- [x] Project setup (Express, TypeScript, Zod, Drizzle ORM)
- [x] Database connection and migration runner
- [x] Auth routes: register, login, refresh, logout
- [x] User routes: CRUD, profile, avatar upload
- [x] Team routes: CRUD, member management, invitations
- [x] Project routes: CRUD, team assignment, status transitions
- [x] Task routes: CRUD, subtasks, assignment, status workflow

## In Progress
- [ ] Comment routes (not started)

## Key Decisions
- Drizzle ORM over Prisma (better SQL control for complex queries)
- Zod schemas co-located with route files
- Middleware pattern: auth -> validate -> authorize -> handler
- File uploads via multer to local disk (S3 integration left for DevOps)
- Activity log via database triggers + explicit logging in handlers

## Next Steps
- Comment routes (CRUD, mentions, threading)
- File attachment routes (upload, download, delete, link to tasks/comments)
- Activity log routes (filtered timeline per project/task/user)
- Global error handler refinement
- Integration tests for all completed routes

## Files Modified
- src/index.ts, src/db/connection.ts, src/db/migrate.ts
- src/middleware/auth.ts, src/middleware/validate.ts
- src/routes/auth.ts, src/routes/users.ts, src/routes/teams.ts
- src/routes/projects.ts, src/routes/tasks.ts
- src/schemas/ (5 schema files)
- src/utils/errors.ts, src/utils/pagination.ts
```

**Agent's output ends with:**
```
<!-- CHECKPOINT:CONTINUE -->
Checkpoint: Work log saved to `.dispatch/backend-01-log.md`. Remaining work: comment routes, file attachments, activity log, error handler, integration tests.
```

### Continuation

Dispatcher detects the CHECKPOINT signal (scans last 10 lines for `CHECKPOINT:CONTINUE`), reads the log, sees `continuation: 0`, and spawns a fresh Backend Developer agent using the **Continuation Agent Template** with `continuation: 1`:

```
## Your Role: Backend Developer (Continuation)

### Expertise Profile
- **Domain**: Software Development
- **Core competencies**: Server-side development, API design, database integration
- **Key skills**: Node.js, Express, TypeScript, REST API, PostgreSQL, Drizzle ORM
- **Perspective**: You approach problems as a Backend Developer with deep expertise in API architecture

### Continuation Context
You are continuing the work of a previous Backend Developer agent (continuation #1).
**Read your work log first**: `.dispatch/backend-01-log.md`
Resume from "Next Steps". Do NOT repeat completed work.
Your files_touched counter resets to 0. Continue checkpointing as normal.
**Max continuations**: 5. If you are continuation #5, prioritize completing the most
critical remaining work — this is your last run.

### Collaboration Context
- You are one of 3 specialists working on this request
- Your focus area: Express API + business logic
- Other agents cover: Database schema (DBA), Auth + RBAC (Security Engineer)
- Stay strictly within your domain

### Your Task
Build a complete REST API for a project management tool (comment routes, file attachments, activity log, error handler, integration tests).

### Language
Respond in Italian

### Context Persistence (NON-NEGOTIABLE)
- **Your work log**: `.dispatch/backend-01-log.md`
- **Global state**: `.dispatch/STATE.md` — update your status line when you checkpoint
- **Track files touched**: Count every distinct file you read or modify
- **Checkpoint triggers**: 15+ files → soft checkpoint, 25+ files → hard checkpoint
- **Pre-exit verification**: Before ending, check triggers and update STATE.md
```

The fresh agent reads the log, sees what's done and what's next, and continues building the remaining routes without repeating any work. It completes all remaining endpoints and finishes with status `COMPLETE` — no further checkpoint needed.

### Final State

`.dispatch/STATE.md` is updated:

```markdown
## Status Summary
- dba-01: COMPLETE - Schema delivered (12 tables, indexes, triggers)
- backend-01: COMPLETE - All 12 route groups implemented (continued once)
- security-01: COMPLETE - RBAC middleware, permission matrix, security audit
```

Dispatcher proceeds to Step 8 (Review & Synthesize) with all three agents' work.
