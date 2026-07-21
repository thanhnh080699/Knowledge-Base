# Choosing API Design Style

> REST vs GraphQL vs tRPC - which one to choose, and when?

## Decision Tree

```
Who is the API consumer?
│
├── Public API / Multi-platform
│   └── REST + OpenAPI (broadest compatibility)
│
├── Complex data needs / Multiple frontends
│   └── GraphQL (flexible querying)
│
├── Both frontend + backend use TypeScript (monorepo)
│   └── tRPC (end-to-end type safety)
│
├── Real-time / Event-driven
│   └── WebSocket + AsyncAPI
│
└── Internal Microservices
    └── gRPC (high performance) or REST (simple)
```

## Comparison

| Factor | REST | GraphQL | tRPC |
|--------|------|---------|------|
| **Type Safety** | Manual / OpenAPI | Generated from Schema | End-to-end (TS) |
| **Over-fetching** | Common | Minimized | Minimized |
| **Caching** | Excellent (HTTP) | Complex | Harder |
| **Learning Curve** | Low | High | Low (for TS developers) |
