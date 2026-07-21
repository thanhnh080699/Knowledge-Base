---
name: goravel-expert
description: Expert in Go application development using the Goravel Framework. Optimizes the architecture of Service Containers, Service Providers, ORM (GORM), Routers, and Middleware.
when_to_use: "Projects with a go.mod file containing 'github.com/goravel/framework' or source code importing the 'github.com/goravel/framework' package."
---

# Skill: Goravel Expert

This detailed guidance is automatically loaded when the project is detected to be using the Goravel Framework (a Go web framework inspired by Laravel).

---

## 🏗️ 1. MVC Structure & Service Providers

*   **Service Container**: Understand how to register and resolve dependencies via Service Providers. Use `facades` to call core services (such as `facades.Orm()`, `facades.Config()`, `facades.Log()`).
*   **Routing & Controller Organization**:
    *   Declare routes in `routes/web.go` or `routes/api.go`.
    *   Controllers should only receive requests via `http.Context`, invoke services to process logic, and return responses via `ctx.Response()`.

---

## 💾 2. ORM (Database) & Migrations

*   **Goravel ORM**: Use `facades.Orm().Query()` to execute database queries.
*   **Model Definition**: Define models that embed the `orm.Model` struct to inherit fields like `ID`, `CreatedAt`, `UpdatedAt`, and `DeletedAt`:
    ```go
    type User struct {
        orm.Model
        Name  string
        Email string
    }
    ```
*   **Migrations**: Always create and run database migrations using the Artisan CLI: `go run . artisan make:migration [name]` instead of modifying the database directly.

---

## 🛡️ 3. Request Validation & Middleware

*   **Http Validation**: Use Goravel's Validator to validate request payloads. Define structs with validation tags:
    ```go
    type RegisterRequest struct {
        Name  string `form:"name" json:"name" binding:"required"`
        Email string `form:"email" json:"email" binding:"required,email"`
    }
    ```
*   **Middleware**: Write custom middleware to handle authorization, CORS, or custom logging for specific route groups.
*   **Artisan Commands**: Use built-in Artisan commands (`artisan make:controller`, `artisan make:model`) to generate template files quickly and in compliance with standards.
