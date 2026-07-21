# Rate Limiting Principles

> Protect your API from abuse and overload.

## Why Rate Limit?

```
Protect against:
├── Brute force attacks
├── System resource exhaustion
├── Cost overruns (if using pay-per-use services)
└── Unfair resource usage
```

## Strategy Selection

| Strategy Type | How it works | When to use |
|------|-----|------|
| **Token bucket** | Allows burst, refilled over time | Most APIs |
| **Sliding window** | Smooth distribution along a sliding window | Strict limits required |
| **Fixed window** | Resets at fixed time intervals | Simple requirements |
