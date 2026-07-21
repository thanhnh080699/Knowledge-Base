---
name: docker-expert
description: Expert in setting up Docker environments, writing optimized Dockerfiles, configuring multi-service docker-compose, and implementing container security/performance standards.
when_to_use: "When the project contains a 'Dockerfile', 'docker-compose.yml', 'compose.yaml', or '.docker' directory."
---

# Skill: Docker & Containerization Expert

This in-depth guide is automatically loaded when Docker usage is detected in the project to containerize the application.

---

## 🐋 1. Dockerfile Optimization

*   **Multi-stage Builds**:
    *   **Mandatory** to apply multi-stage builds to separate the build environment (containing compiler, package manager, SDK) from the runtime environment (containing only build files and runtime engine).
    *   Goal: Minimize the output image size and reduce security vulnerabilities from unnecessary development tools.
*   **Layer Caching Optimization**:
    *   Arrange instructions in the Dockerfile by frequency of change: less frequently changed commands at the top, frequently changed commands at the bottom.
    *   Example: COPY dependency management files (`package.json`, `composer.json`, `go.mod`) and run package installation before copying the rest of the project source code.
*   **Optimized Base Image Selection**:
    *   Prefer minimal, official images like Alpine Linux (`-alpine`) or Debian Slim (`-slim`) to reduce image size and attack surface.
*   **Run as Non-root User**:
    *   Avoid running applications as the `root` user inside the container.
    *   Always create a new user or use an existing user provided by the base image (e.g., `USER node` for Node.js, `USER www-data` for PHP) before specifying the startup command (`CMD` or `ENTRYPOINT`).
*   **Use `.dockerignore`**:
    *   Always create a `.dockerignore` file at the project root to exclude unnecessary files and directories from the build process (e.g., `.git`, `node_modules`, `vendor`, `.env`, `dist`, logs).
    *   This speeds up sending the build context from the client to the Docker daemon and reduces image size.

---

## 🎼 2. Docker Compose Standards (Multi-container Orchestration)

*   **Environment Variable Management**:
    *   Do not hardcode sensitive configuration information directly in `docker-compose.yml`.
    *   Use the `${VARIABLE_NAME}` syntax and load data from a local `.env` file.
*   **Volume & Data Persistence**:
    *   Use **Named Volumes** to store data that must persist between container recreations (such as database files, public uploads).
    *   Only use **Bind Mounts** (`./host:/container`) for development environments to support hot-reloading code directly from the host machine.
*   **Network Configuration**:
    *   Use separate networks (`networks`) for groups of services to improve security (e.g., `frontend-network`, `backend-network`, `db-network`).
    *   Only expose ports that actually need to communicate outside the host machine (e.g., port 80/443 of the reverse proxy). Internal database or backend API ports should be kept private within the docker network.
*   **Startup & Dependency Management**:
    *   Use `depends_on` to define the startup order of services (e.g., web depends on database).
    *   Use `healthcheck` on backing services (like MySQL, PostgreSQL, Redis) combined with `condition: service_healthy` in dependent services to ensure the application starts only when the database is fully ready to accept connections.

---

## 🛡️ 3. Container Security & Management

*   **Pinning Specific Versions (Tagging)**:
    *   Do not use the `latest` tag for base images in production environments.
    *   Always specify exact version tags (e.g., `node:20.11-alpine` instead of `node:alpine` or `node:latest`) to ensure reproducible builds.
*   **ReadOnly Filesystem**:
    *   For production environments, consider configuring containers to run with a read-only filesystem (`read_only: true` in compose or `--read-only` in docker run) and mount temporary volumes (`tmpfs`) for log or cache directories to prevent attackers from modifying container source code if compromised.
