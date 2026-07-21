# Authentication Patterns

> Choose authentication mechanisms based on each use case.

## Selection Guide

| Mechanism | Best Suited For |
|---------|----------|
| **JWT** | Stateless, microservices |
| **Session** | Traditional web, simple applications |
| **OAuth 2.0** | Third-party integration |
| **API Keys** | Server-to-server communication, public APIs |
| **Passkey** | Modern passwordless login (2025+) |

## JWT Usage Principles

```
Implementation:
├── Keep token lifespan short (e.g., 15 minutes)
├── Use refresh tokens stored securely in HTTP-only cookies
├── Verify signatures on every request
└── Do not store sensitive information in the payload (JWT is only base64 encoded)
```
