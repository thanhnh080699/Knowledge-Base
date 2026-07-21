---
description: Store information in long-term memory to retrieve in future sessions. Save preferences, conventions, decisions, and context.
---

# /remember — Persistent Memory Management

$ARGUMENTS

---

## 🔴 CRITICAL RULES

1. **Load memory-system skill** — Read `.agents/skills/memory-system/SKILL.md` first
2. **Never auto-delete memories** — Always ask user before pruning
3. **Keep index under 200 lines** — Warn if approaching limit
4. **Distill, don't copy** — Save insights, not full conversations

---

## Task

Use the `memory-system` skill to save information:

```
CONTEXT:
- User wants to remember: $ARGUMENTS
- Memory location: .agents/memory/

WORKFLOW:
1. CLASSIFY the information type: user | feedback | project | reference
2. CHECK if relevant topic file exists in .agents/memory/
3. SAVE to appropriate topic file (create if needed)
4. UPDATE .agents/memory/MEMORY.md index with one-line pointer
```
