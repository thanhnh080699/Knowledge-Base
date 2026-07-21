---
name: plan-writing
description: Structured task planning with clear breakdowns, dependencies, and verification criteria. Use when implementing features, refactoring, or any multi-step work.
when_to_use: "When creating structured task plans, breaking down features into tasks, or defining verification criteria. Use with /plan workflow."
allowed-tools: Read, Glob, Grep
---

# Plan Writing

> Source: obra/superpowers

## Overview
This skill provides a framework for breaking down work into clear, actionable tasks with verification criteria.

## Task Breakdown Principles

### 1. Small, Focused Tasks
- Each task should take 2-5 minutes
- One clear outcome per task
- Independently verifiable

### 2. Clear Verification
- How do you know it's done?
- What can you check/test?
- What's the expected output?

### 3. Logical Ordering
- Dependencies identified
- Parallel work where possible
- Critical path highlighted
- **Phase X: Verification is always LAST**

### 4. Dynamic Naming in Project Root
- Plan files are saved as `{task-slug}.md` in the PROJECT ROOT
- Name derived from task (e.g., "add auth" → `auth-feature.md`)
- **NEVER** inside `.agents/`, `docs/`, or temp folders

## Planning Principles (NOT Templates!)

> 🔴 **NO fixed templates. Each plan is UNIQUE to the task.**

### Principle 1: Keep It SHORT

| ❌ Wrong | ✅ Right |
|----------|----------|
| 50 tasks with sub-sub-tasks | 5-10 clear tasks max |
| Every micro-step listed | Only actionable items |
| Verbose descriptions | One-line per task |

> **Rule:** If plan is longer than 1 page, it's too long. Simplify.

---

### Principle 2: Be SPECIFIC, Not Generic

| ❌ Wrong | ✅ Right |
|----------|----------|
| "Set up project" | "Run `npx create-next-app`" |
| "Add authentication" | "Install next-auth, create `/api/auth/[...nextauth].ts`" |
| "Style the UI" | "Add Tailwind classes to `Header.tsx`" |

> **Rule:** Each task should have a clear, verifiable outcome.

---

### Principle 3: Dynamic Content Based on Project Type

**For NEW PROJECTS:** Focus on initialization, structure, and basic dependencies.
**For EXISTING CODEBASES:** Focus on regression risk, file dependencies, and targeted refactoring.
**For BUG FIXING:** Focus on minimal reproduction, root cause analysis, and regression tests.
