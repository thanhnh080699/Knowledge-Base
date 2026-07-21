# REST Design Principles

> Resource-oriented API design - use nouns, not verbs.

## Resource Naming Rules

```
Principles:
├── Use NOUNS, not verbs (resources, not actions)
├── Use PLURAL nouns (/users instead of /user)
├── Use lowercase with hyphens (/user-profiles)
├── Nest for relationships (/users/123/posts)
└── Keep structure shallow (maximum 3 levels of nesting)
```

## HTTP Method Selection

| Method | Purpose | Idempotent? | Has Body? |
|--------|---------|-------------|-------|
| **GET** | Read resource(s) | Yes | No |
| **POST** | Create new resource | No | Yes |
| **PUT** | Replace entire resource | Yes | Yes |
| **PATCH** | Update resource partially | No | Yes |
| **DELETE** | Delete resource | Yes | No |
