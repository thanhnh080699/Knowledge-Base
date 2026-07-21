---
name: api-patterns
description: API design principles and decision making. Choosing between REST vs GraphQL vs tRPC, response formatting, versioning, and pagination.
when_to_use: "When designing REST/GraphQL/tRPC APIs, defining response formats, versioning, pagination, or API authentication. DO NOT use for UI/frontend work."
allowed-tools: Read, Write, Edit, Glob, Grep
---

# API Design Patterns (API Patterns)

> API design principles and decision making.
> **Learn to THINK, do not copy patterns blindly.**

## 🎯 Selective Reading Rule

**Only read files relevant to the request!** Check the content map and find what you need.

---

## 📑 Content Map

| File | Description | When to read |
|------|-------------|--------------|
| `api-style.md` | Decision matrix between REST vs GraphQL vs tRPC | When choosing API type |
| `rest.md` | Resource naming, HTTP methods, status codes | When designing REST API |
| `response.md` | Envelope pattern, error format, pagination | API response structure |
| `graphql.md` | Schema design, when to use, security | When considering GraphQL |
| `trpc.md` | TypeScript monorepo, type safety | Fullstack TypeScript projects |
| `versioning.md` | Versioning via URI/Header/Query | API evolution planning |
| `auth.md` | JWT, OAuth, Passkey, API Keys | Choosing authentication mechanism |
| `rate-limiting.md` | Token bucket, sliding window | Implementing API protection |
