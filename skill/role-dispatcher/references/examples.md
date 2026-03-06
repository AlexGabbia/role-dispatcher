# Dispatching Examples

## Example 1: Simple (Single Agent)

**User request**: "How do I optimize this SQL query that's taking 30 seconds?"

### Dispatch Decision
- **Category match**: Infrastructure & Ops (keyword: database)
- **Role**: Database Administrator (DBA)
- **Agents**: 1
- **Review Agent**: No
- **Model**: Sonnet (debugging, focused scope)

### Agent Prompt
```
## Your Role: Database Administrator (DBA)

### Expertise Profile
- Domain: Infrastructure & Operations
- Core competencies: Manages, optimizes and secures enterprise databases
- Perspective: You approach problems from the viewpoint of a DBA with deep expertise in query optimization, indexing, execution plans

### Behavioral Guidelines
- Communication level: Clear, practical. The user has basic programming knowledge
- Language: Italian
- Actionability: Provide the optimized query with explanation of WHY each change helps

### Your Task
The user has a SQL query taking 30 seconds and needs optimization advice.

### Output Format
1. Analysis
2. Recommendation
3. Confidence: HIGH/MEDIUM/LOW
4. Handoff Notes: Flag any aspects needing a different specialist
5. Open Questions
```

### Sample Output
```
**Agenti attivati:**
- Database Administrator (DBA): ottimizzazione query SQL

**Modello suggerito:** claude-sonnet-4-6 (complessita media)
```

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

### Agent Prompts

**Agent 1: Backend Developer** focuses on API design, auth implementation, database schema
**Agent 2: Frontend Developer** focuses on React dashboard, UI components, API integration

### Collaboration
- Backend agent provides: endpoint list, auth flow, response schemas
- Frontend agent receives handoff notes with API contract
- Review agent checks: API contract matches frontend expectations, auth flow is consistent

### Sample Output
```
**Agenti attivati:**
- Backend Developer: progettazione API REST con autenticazione
- Frontend Developer: dashboard React per gestione utenti

**Modello suggerito:** claude-sonnet-4-6 (complessita media)
```

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

### Execution Sequence
1. **Software Architect** (first): Defines microservice boundaries, communication patterns, data ownership
2. **Backend Developer** (second): Receives architecture, designs service implementations, API contracts, data models
3. **DevOps Engineer** (third): Receives architecture + implementation plan, designs deployment, CI/CD, monitoring

### Review Agent Assessment
- Checks architecture is implementable with proposed tech stack
- Verifies deployment strategy supports the architectural patterns
- Validates all three outputs form a coherent, buildable system
- Aggregate confidence: minimum of three agents

### Sample Output
```
**Agenti attivati:**
- Software Architect: progettazione architettura microservizi
- Backend Developer: design implementativo dei servizi
- DevOps Engineer: strategia di deployment e CI/CD

**Modello suggerito:** claude-opus-4-6 (complessita alta)
```
