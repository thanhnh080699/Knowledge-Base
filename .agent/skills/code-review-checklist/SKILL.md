---
name: code-review-checklist
description: Code review guidelines covering code quality, security, and best practices.
when_to_use: "When reviewing code for quality, security, and best practices. When the user says 'review my code' or 'check this PR'."
allowed-tools: Read, Glob, Grep
---

# Code Review Checklist

## Quick Review Checklist

### Correctness
- [ ] Code does what it's supposed to do
- [ ] Edge cases handled
- [ ] Error handling in place
- [ ] No obvious bugs

### Security
- [ ] Input validated and sanitized
- [ ] No SQL/NoSQL injection vulnerabilities
- [ ] No XSS or CSRF vulnerabilities
- [ ] No hardcoded secrets or sensitive credentials
- [ ] **AI-Specific:** Protection against Prompt Injection (if applicable)
- [ ] **AI-Specific:** Outputs are sanitized before being used in critical sinks

### Performance
- [ ] No N+1 queries
- [ ] No unnecessary loops
- [ ] Appropriate caching
- [ ] Bundle size impact considered

### Code Quality
- [ ] Clear naming
- [ ] DRY - no duplicate code
- [ ] SOLID principles followed
- [ ] Appropriate abstraction level

### Testing
- [ ] Unit tests for new code
- [ ] Edge cases tested
- [ ] Tests readable and maintainable

### Documentation
- [ ] Complex logic commented
- [ ] Public APIs documented
- [ ] README updated if needed

## AI & LLM Review Patterns

### Logic & Hallucinations
- [ ] **Chain of Thought:** Does the logic match the actual implementation?
- [ ] **No Placeholders:** Verify that all code blocks are complete, with no comments like "// TODO" or "// implement later".
- [ ] **Edge Cases:** Ensure the model didn't miss edge cases or hallucinate APIs.
