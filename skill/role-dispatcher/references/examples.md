# Dispatching Examples

## Example 1: Simple (Single Agent)

**User request**: "How do I optimize this SQL query that's taking 30 seconds?"

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

## Example 2: Medium (Two Agents)

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

## Example 3: Complex (Three Agents)

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

## Example 4: User Override (Role + Model Change)

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
