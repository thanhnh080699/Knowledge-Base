---
name: golang-expert
description: Expert in Go (Golang) application development. Defines patterns for error handling, concurrency, interface design, and performance optimization.
when_to_use: "Projects with a go.mod file or files with .go extensions."
---

# Skill: Go (Golang) Expert

This detailed guidance is automatically loaded when the project is detected to be using the Go language.

---

## 🏗️ 1. Project & Package Structure

*   **Standard Go Project Layout**: Clearly organize directories:
    *   `/cmd`: Contains the application entry points (`main.go` functions).
    *   `/internal`: Contains private codebase packages that are not allowed to be imported from outside the project.
    *   `/pkg`: Contains shared library code that can be publicly shared.
*   **Avoid Circular Dependencies**: Design packages to be independent and have clearly decoupled responsibilities. If you encounter circular dependency errors, use **Interfaces** in intermediate packages to resolve them.

---

## 🛠️ 2. Error Handling

*   **Error is Value**: In Go, errors are explicit return values. Always check for errors immediately:
    ```go
    val, err := DoSomething()
    if err != nil {
        return fmt.Errorf("failed to do something: %w", err) // wrap error
    }
    ```
*   **Do Not Abuse Panic**: Only use `panic` for critical, unrecoverable errors during startup (e.g., failure to connect to the primary database). For runtime business logic, you must return an `error`.

---

## ⚡ 3. Concurrency & Context

*   **Goroutine Leaks**: Always ensure goroutines are released when no longer needed. Avoid initializing goroutines that run indefinitely without a termination mechanism.
*   **Channels**: Use channels to communicate between goroutines. Use `select` to handle timeouts or task cancellations.
*   **Context Propagation**: 
    *   Always pass `ctx context.Context` as the first parameter of functions performing I/O operations (Database, HTTP Requests, Files).
    *   Use `context.WithTimeout` or `context.WithCancel` to prevent queries from hanging indefinitely.
