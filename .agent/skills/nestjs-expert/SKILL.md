---
name: nestjs-expert
description: Expert in backend application development using NestJS (Node.js/TypeScript). Shapes the design of Modules, Controllers, Providers, DTOs, Pipes, Guards, and Exception Filters.
when_to_use: "Project detected to have a package.json containing '@nestjs/core' or files ending with .controller.ts, .module.ts, .service.ts"
---

# Skill: NestJS Expert

This deep-dive guide is automatically loaded when the project is detected to use the NestJS Framework.

---

## 🏗️ 1. Core Architecture

*   **Encapsulation**: Every feature must be cleanly encapsulated within Modules. Avoid unguided cross-import declarations, and always use `@Module` to export Services that need to be shared.
*   **Dependency Injection (DI)**: Use the `@Injectable()` decorator for Providers/Services and inject them via the `constructor` (Constructor Injection).
*   **Separation of Concerns**:
    *   **Controller**: Responsible only for receiving requests, calling Services, and returning responses. Do not write business logic in Controllers.
    *   **Service/Provider**: The place containing all business logic and database interactions.

---

## 🛡️ 2. Validation & Security

*   **DTO (Data Transfer Object)**: Always declare DTO classes for request payloads (`Body`, `Query`, `Param`).
*   **class-validator & class-transformer**: Use decorators (such as `@IsString()`, `@IsNotEmpty()`, `@IsEmail()`, `@IsOptional()`) to bind validation rules directly within the DTO.
*   **ValidationPipe**: Ensure the project activates the global `ValidationPipe` with the `whitelist: true` option to automatically strip properties not defined in the DTO:
    ```typescript
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    ```

---

## 🚀 3. Optimization & Exception Handling

*   **Exception Filters**: Use standard NestJS HttpExceptions (`NotFoundException`, `BadRequestException`, `ForbiddenException`) instead of throwing raw string errors. Write a Custom Exception Filter to normalize the returned JSON error response.
*   **Guards & Interceptors**:
    *   Use **Guards** for authorization and authentication tasks (AuthGuard, RolesGuard).
    *   Use **Interceptors** to format returned data (Response Transform) or log request processing time.
