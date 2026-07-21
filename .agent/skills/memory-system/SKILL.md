---
name: memory-system
description: Manages cross-session memory. Allows agents to remember user preferences, project conventions, and past decisions across different sessions via a structured MEMORY.md index file and topic files.
when_to_use: "When the user says 'remember this', 'save this for later', 'don't forget', or when starting a new session and needing to recall past context. Also applies when the /remember workflow is triggered."
allowed-tools: Read, Write, Grep, Glob
effort: low
---

# Memory System — Long-Term Cross-Session Memory

> Allows agents to remember information across sessions. Never have to relearn what is already known.

## Overview

The Memory System provides a **long-term, searchable memory** that persists across different sessions. Instead of having to re-explain preferences, conventions, and past decisions each time you start, the agent simply reads a structured `MEMORY.md` index file and associated topic files.

**Token Impact:** ~1,000 tokens to load the index, but saves between 3,000 to 10,000 tokens by eliminating the need to relearn information from scratch.

---

## Architecture

```
.agents/memory/
├── MEMORY.md              ← Lightweight index file (maximum 200 lines)
├── user-preferences.md    ← Topic file: user roles, preferences, tools
├── project-conventions.md ← Topic file: coding standards, design patterns
├── tech-decisions.md      ← Topic file: past architectural decisions
├── feedback-history.md    ← Topic file: what the user likes/dislikes
└── [topic-name].md        ← Additional topic files as needed
```

---

## MEMORY.md Index Format

The index file is a **lightweight pointer file** — containing short entries that reference topic files for more details.

**Rules:**
- Maximum total length of **200 lines**
- Each entry: **maximum of about 150 characters**
- Format: `- [type] summary → topic-file.md`
- Types: `[user]` `[feedback]` `[project]` `[reference]`

**Example:**
```markdown
# Memory Index

## User
- [user] Prefers dark mode, uses Windows 11, PowerShell → user-preferences.md
- [user] Senior DevOps Engineer, 8 years of experience → user-preferences.md
- [user] Main language: English, occasionally Turkish → user-preferences.md

## Project
- [project] Always use bun instead of npm → project-conventions.md
- [project] Prefer Tailwind v4 over v3 → tech-decisions.md
- [project] Do not use purple/violet in the user interface (UI) → project-conventions.md

## Feedback
- [feedback] User prefers concise, direct responses → feedback-history.md
- [feedback] User dislikes long-winded explanations → feedback-history.md
- [feedback] User prefers tables over bullet points → feedback-history.md

## Reference
- [reference] Squid proxy runs on port 3128 → infrastructure-notes.md
- [reference] Git workflow: feature branch → main → project-conventions.md
```

---

## Topic File Format

Each topic file contains **frontmatter** and **structured content**:

```markdown
---
topic: [topic-name]
last_updated: YYYY-MM-DD
---

# Topic Title

Detailed notes, configurations, preferences, or decisions related to this topic. Use clear bullet points and code blocks where necessary.
```
