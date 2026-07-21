---
name: brainstorming
description: Socratic questioning protocol + user communication. MANDATORY for complex requests, new features, or unclear requirements. Includes progress reporting and error handling.
when_to_use: "When exploring options before implementation, clarifying requirements, or when the user needs creative problem-solving. Use with /brainstorm workflow."
allowed-tools: Read, Glob, Grep
---

# Brainstorming & Communication Protocol

> **MANDATORY:** Use for complex/vague requests, new features, updates.

---

## 🛑 SOCRATIC GATE (ENFORCEMENT)

### When to Trigger

| Pattern | Action |
|---------|--------|
| "Build/Create/Make [thing]" without details | 🛑 ASK 3 questions |
| Complex feature or architecture | 🛑 Clarify before implementing |
| Update/change request | 🛑 Confirm scope |
| Vague requirements | 🛑 Ask purpose, users, constraints |

### 🧠 Memory Check (2026.5.13 — Before Questioning)

> Before asking questions, check if past context exists:

```
0. CHECK MEMORY — Does .agents/memory/MEMORY.md exist?
   → YES: Read index. Apply relevant past decisions silently.
          Skip questions already answered in memory.
   → NO: Proceed with standard Socratic Gate.
```

### 🚫 MANDATORY: 3 Questions Before Implementation

1. **STOP** - Do NOT start coding
2. **CHECK** - Read `.agents/memory/` for past context on this topic
3. **ASK** - Minimum 3 questions (skip any already answered via memory):
   - 🎯 Purpose: What problem are you solving?
   - 👥 Users: Who will use this?
   - 📦 Scope: Must-have vs nice-to-have?
4. **WAIT** - Get response before proceeding
5. **SAVE** - After brainstorming, save key decisions: `/remember [decision]`

---

## 🧠 Dynamic Question Generation

**⛔ NEVER use static templates.** Read `dynamic-questioning.md` for principles.

### Core Principles

| Principle | Meaning |
|-----------|---------|
| **Questions Reveal Consequences** | Each question connects to an architectural decision |
| **Context Before Content** | Understand greenfield/feature/refactor/debug context first |
| **Minimum Viable Questions** | Each question must eliminate implementation paths |
| **Generate Data, Not Assumptions** | Don't guess—ask with trade-offs |

### Question Generation Process

```
1. Parse request → Extract domain, features, scale indicators
2. Identify decision points → Blocking vs. deferable
3. Generate questions → Priority: P0 (blocking) > P1 (high-leverage) > P2 (nice-to-have)
4. Format with trade-offs → What, Why, Options, Default
```

### Question Matrix
Match the questions dynamically to the domain (e.g. database, security, frontend, backend).
Ensure the questions help guide the user toward the best architectural decisions.
