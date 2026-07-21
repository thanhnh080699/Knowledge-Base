# Response Format Principles

> Consistency is key - choose a format and stick to it.

## Common Models

```
Choose one:
├── Envelope pattern ({ success, data, error })
├── Direct data (returns resource only)
└── HAL/JSON:API (hypermedia)
```

## Error Responses

```
Should include:
├── Error code (for programmatic handling)
├── User message (to display on the UI)
├── Details (for debugging, field-specific validation errors)
├── Request ID (for support, log tracing)
└── DO NOT include internal/system details (security risk!)
```

## Pagination Types

| Type | Pros | Cons | Use Case |
|------|------|------|----------|
| **Offset-based** | Simple, total page count known | Slow at large offsets, data can be duplicated/missed when changes occur | Small datasets |
| **Cursor-based** | Fast, consistent data | Total record count unknown, more complex | Large datasets, infinite scroll |
