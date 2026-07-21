---
name: webapp-testing
description: Web application testing principles. E2E, Playwright, deep audit strategies.
when_to_use: "When writing E2E tests with Playwright, performing deep web app audits, or testing user flows. Use with /test workflow."
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Web App Testing

> Discover and test everything. Leave no route untested.

## 🔧 Runtime Scripts

**Execute these for automated browser testing:**

| Script | Purpose | Usage |
|--------|---------|-------|
| `scripts/playwright_runner.py` | Basic browser test | `python scripts/playwright_runner.py https://example.com` |
| | With screenshot | `python scripts/playwright_runner.py <url> --screenshot` |
| | Accessibility check | `python scripts/playwright_runner.py <url> --a11y` |

**Requires:** `pip install playwright && playwright install chromium`

---

## 1. Deep Audit Approach

### Discovery First

| Target | How to Find |
|--------|-------------|
| Routes | Scan app/, pages/, router files |
| API endpoints | Grep for HTTP methods |
| Components | Find component directories |
| Features | Read documentation |

### Systematic Testing

1. **Map** - List all routes/APIs
2. **Scan** - Verify they respond
3. **Test** - Cover critical paths

---

## 2. Testing Pyramid for Web

```
        /\          E2E (Few)
       /  \         Critical user flows
      /----\
     /      \       Integration (Some)
    /--------\      API, data flow
   /          \
  /------------\    Component (Many)
                    Individual UI pieces
```

---

## 3. E2E Test Principles

### What to Test

| Priority | Tests |
|----------|-------|
| 1 | Happy path user flows |
| 2 | Authentication flows |
| 3 | Critical business actions |
| 4 | Error handling |

### E2E Best Practices

| Practice | Why |
|----------|-----|
| Use data-testid | Stable selector, resilient to UI changes |
| Clean state | Avoid test pollution, seed database before test runs |
| Don't test external | Mock external integrations |
