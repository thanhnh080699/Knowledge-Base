---
description: Process for verifying the quality and stability of source code after modifications.
---

# Workflow Command: /verify

Process for verifying the quality and stability of source code after modifications.

---

## 📋 Description

The `/verify` command is called after completing coding to ensure that the source code adheres to quality standards, has no syntax errors, passes all test cases, and runs smoothly.

---

## 🔄 Execution Steps

### Step 1: Static Verification

1.  Run the code formatter and linter of the project to ensure there are no style guidelines violations:
    ```bash
    # Example
    npm run lint
    # or
    flake8 .
    ```
2.  Run the compiler or static type checker:
    ```bash
    # Example
    npm run typecheck
    ```

### Step 2: Automated Testing

1.  Run the entire test suite or the specific test modules directly related to the newly written feature:
    ```bash
    # Example
    npm run test
    # or
    pytest
    ```
2.  Ensure that the test coverage meets the project requirements.

### Step 3: Runtime & Manual Verification

1.  Run the application in the local dev server environment.
2.  Call new APIs using curl or verify the interface directly in the browser to ensure a good user experience (UX) and loading performance.
