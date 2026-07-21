---
name: context-compression
description: Manage and compress conversation context in long sessions. Detects context bloat, summarizes completed work phases, and stores old findings while preserving critical decisions. Helps prevent context decay.
when_to_use: "When a session exceeds 20 turns, when context feels repetitive, when the agent loses track of prior work, or when the user asks to 'summarize what we've done'. DO NOT use for short sessions."
allowed-tools: Read, Write, Grep
effort: low
---

# Context Compression — Managing Long Sessions

> Keep sessions efficient by compressing completed phases of work while preserving critical decisions.

## Overview

Long sessions (more than 30 turns) cause context decay — the AI loses track of prior work, repeats itself, or forgets decisions. Context compression proactively summarizes completed phases so that the context window remains focused on the current task.

**Token Impact:** Recovers 5,000 - 15,000 tokens in long sessions by replacing verbose tool outputs with semantic summaries.

---

## When to Compress

| Signal | Action |
|---|---|
| Session has more than 20 turns | Consider proactive compression |
| Agent repeats previous suggestions | Context is saturated — compress immediately |
| User says "we already discussed this" | Compress immediately |
| Transitioning to a new work phase | Compress the completed work phase |
| Large tool output (more than 500 lines) | Micro-compact that output |

---

## Compression Levels

### Level 1: Micro-Compact (Tool Output)

Compress individual tool outputs while retaining semantic content:

```
❌ Before (raw grep output — 200 lines, ~4,000 tokens):
src/auth/jwt.ts:15: import { verify } from 'jsonwebtoken'
src/auth/jwt.ts:23: export function validateToken(token: string) {
src/auth/jwt.ts:24:   try {
src/auth/jwt.ts:25:     const decoded = verify(token, SECRET)
... (195 other lines)

✅ After (micro-compacted — 5 lines, ~100 tokens):
Grep results for "jwt": Found 8 files, 42 matches.
Key files: src/auth/jwt.ts (main JWT logic), src/middleware/auth.ts (middleware),
src/api/login.ts (token generation). Token validation at jwt.ts:23-40.
Error handling at jwt.ts:42-55. Secret loaded from env at jwt.ts:8.
```

### Level 2: Phase Summary

Replace a completed work phase with a summary:

```
❌ Before (full research history — ~3.000 tokens):
[verbose logs, failed attempts, long discussion about framework choices...]

✅ After (phase summary — ~150 tokens):
Phase 1: Technology selection completed. Decided to use Laravel Filament instead of custom Livewire components for the admin panel because of the built-in table builder. Main packages installed: filament/filament v3.2.
```

### Level 3: Memory Integration (Archival)

Save key lessons, decisions, or settings to the memory system:
- Identify actionable conventions and write them to [.agents/memory/project-conventions.md](file:///d:/work/ag-tool-kit/.agents/memory/project-conventions.md).
- Identify key architectural choices and write them to [.agents/memory/architectural-decisions.md](file:///d:/work/ag-tool-kit/.agents/memory/architectural-decisions.md).
- Clear the current long conversation context by starting a new session after memory is successfully integrated.
```
