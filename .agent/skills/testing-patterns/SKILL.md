---
name: testing-patterns
description: Testing patterns and principles. Unit, integration, mocking strategies.
when_to_use: "When writing unit tests, integration tests, choosing testing frameworks, or implementing mocking strategies."
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Testing Patterns

> Principles for reliable test suites.

---

## 1. Testing Pyramid

```
        /\          E2E (Few)
       /  \         Critical flows
      /----\
     /      \       Integration (Some)
    /--------\      API, DB queries
   /          \
  /------------\    Unit (Many)
                    Functions, classes
```

---

## 2. AAA Pattern

| Step | Purpose |
|------|---------|
| **Arrange** | Set up test data |
| **Act** | Execute code under test |
| **Assert** | Verify outcome |

---

## 3. Test Type Selection

### When to Use Each

| Type | Best For | Speed |
|------|----------|-------|
| **Unit** | Pure functions, logic | Fast (<100ms) |
| **Integration** | API, DB, services | Medium |
| **E2E** | Critical user flows | Slow |

---

## 4. Unit Test Principles

### Good Unit Tests

| Principle | Meaning |
|-----------|---------|
| Fast | < 100ms each |
| Isolated | No external deps |
| Repeatable | Same result always |
| Self-checking | No manual verification |
| Timely | Written with code |

### What to Unit Test

| Test | Don't Test |
|------|------------|
| Business logic | Framework code |
| Edge cases | Third-party libs |
| Error handling | Simple getters |

---

## 5. Integration Test Principles

### What to Test

| Area | Focus |
|------|-------|
| API endpoints | Request/response |
| Database | Queries, transactions, migrations |
| External services | Integration contracts, error states |
