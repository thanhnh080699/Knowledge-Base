---
name: tdd-workflow
description: Test-Driven Development workflow principles. RED-GREEN-REFACTOR cycle.
when_to_use: "When practicing Test-Driven Development, following RED-GREEN-REFACTOR cycle, or writing tests before implementation."
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# TDD Workflow

> Write tests first, code second.

---

## 1. The TDD Cycle

```
🔴 RED → Write failing test
    ↓
🟢 GREEN → Write minimal code to pass
    ↓
🔵 REFACTOR → Improve code quality
    ↓
   Repeat...
```

---

## 2. The Three Laws of TDD

1. Write production code only to make a failing test pass
2. Write only enough test to demonstrate failure
3. Write only enough code to make the test pass

---

## 3. RED Phase Principles

### What to Write

| Focus | Example |
|-------|---------|
| Behavior | "should add two numbers" |
| Edge cases | "should handle empty input" |
| Error states | "should throw for invalid data" |

### RED Phase Rules

- Test must fail first
- Test name describes expected behavior
- One assertion per test (ideally)

---

## 4. GREEN Phase Principles

### Minimum Code

| Principle | Meaning |
|-----------|---------|
| **YAGNI** | You Aren't Gonna Need It |
| **Simplest thing** | Write the minimum to pass |
| **No optimization** | Just make it work |

### GREEN Phase Rules

- Don't write unneeded code
- Don't optimize yet
- Pass the test, nothing else
- Hardcode values if needed to make it green first, then refactor
