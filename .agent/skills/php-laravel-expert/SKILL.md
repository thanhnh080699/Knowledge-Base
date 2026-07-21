---
name: php-laravel-expert
description: Expert in PHP web application development using the Laravel Framework. Designed Service Container, Eloquent ORM, Form Request Validation, API Resources, Queues, and Artisan Commands.
when_to_use: "Project detected to have a composer.json containing 'laravel/framework' or an 'artisan' file at the root, or files with a .php extension"
---

# Skill: PHP & Laravel Expert

This deep-dive guide is automatically loaded when the project is detected to use PHP and the Laravel Framework.

---

## 🏗️ 1. Service Container & IoC

*   **Dependency Injection**: Maximize the use of the Service Container to automatically inject class dependencies via `constructor` or method injection.
*   **Service Providers**: Register bindings, singletons, or boot-up logic within Service Providers (e.g., `AppServiceProvider`).
*   **Facades vs Contracts**: Prefer using Dependency Injection via Contracts to improve unit testability. Only use Facades for quick tasks or small scripts.

---

## 💾 2. Eloquent ORM & Migrations

*   **Eloquent Relationships**: Clearly declare relationships (`hasMany`, `belongsTo`, `belongsToMany`) and always use **Eager Loading** (`with()`) to prevent N+1 query problems.
*   **Database Migrations**:
    *   All database schema changes must be implemented via Migration files.
    *   Ensure the `down()` method is defined accurately to support clean rollbacks.
*   **Mass Assignment Protection**: Use `$fillable` or `$guarded` in Models to protect the system against mass assignment vulnerabilities.

---

## 🛡️ 3. HTTP Layer & Validation

*   **Form Requests**: Do not write validation logic inside Controllers. Always create dedicated Form Request classes (`php artisan make:request`) to handle authorization and payload validation.
*   **API Resources**: Use `Eloquent Resources` (`php artisan make:resource`) to format output JSON, decoupling the physical database table structure from the public API.
*   **Middleware**: Apply default security middleware (CSRF validation, Auth, Rate Limiting).
*   **Artisan Commands**: Always use Artisan commands to generate code, standardizing the directory structure of Laravel.
*   **Queues & Jobs**: Push heavy tasks (such as sending emails, image processing, or third-party data synchronization) to Queue Background Jobs to avoid blocking user requests.
