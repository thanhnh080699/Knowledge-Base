# Versioning Strategies

> Plan for API evolution from day one.

## Decision Factors

| Strategy | Implementation | Trade-offs |
|----------|---------------|------------|
| **URI** | /v1/users | Explicit, easy to configure cache |
| **Header** | Accept-Version: 1 | Cleaner URLs, harder to discover automatically |
| **Query** | ?version=1 | Easy to add, but adds clutter |
| **None** | Careful evolution | Best for internal use, high risk for public APIs |

## Best Practices

- Avoid breaking changes unless absolutely necessary.
- Use versioning in the URL (/v1) for public or external APIs to ensure simplicity.
- Keep old versions active alongside a clear deprecation policy.
