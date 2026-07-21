---
name: database-design
description: Database design principles and decision-making. Schema design, indexing strategy, ORM selection, serverless databases.
when_to_use: "When designing database schemas, choosing ORMs, planning migrations, or optimizing queries. When working with Prisma, Drizzle, or SQL files."
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Database Design

> **Learn to THINK, not copy SQL patterns.**

## 🎯 Selective Reading Rule

**Read ONLY files relevant to the request!** Check the content map, find what you need.

| File | Description | When to Read |
|------|-------------|--------------|
| `database-selection.md` | PostgreSQL vs Neon vs Turso vs SQLite | Choosing database |
| `orm-selection.md` | Drizzle vs Prisma vs Kysely | Choosing ORM |
| `schema-design.md` | Normalization, PKs, relationships | Designing schema |
| `indexing.md` | Index types, composite indexes | Query optimization |
