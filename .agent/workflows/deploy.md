---
description: Process for packaging, recording changes, and preparing the product for handover.
---

# Workflow Command: /deploy

Process for packaging, recording changes, and preparing the product for handover.

---

## 📋 Description

The `/deploy` command is called when all features have been coded and have passed quality verification. This process focuses on creating clear handover documentation and deployment instructions for staging or production environments.

---

## 🔄 Execution Steps

### Step 1: Production Build Validation

1.  Run the project packaging command to ensure the bundle builds successfully without compilation errors in the production environment:
    ```bash
    # Example
    npm run build
    ```
2.  Check the size of the generated bundle files (bundle size) to ensure they do not exceed project thresholds.

### Step 2: Create Handover Documentation (Walkthrough Documentation)

1.  Create or update the `walkthrough.md` file in the `.system_generated/` directory or the directory specified by the IDE, based on the template at [templates/walkthrough.template.md](file:///d:/work/ag-tool-kit/templates/walkthrough.template.md).
2.  The documentation must clearly list:
    *   Changes made (including clickable links to the files).
    *   Test results (unit tests passed, lint passed).
    *   Attach illustrative images or videos (if there are changes to the user interface).

### Step 3: Push Code & Trigger CI/CD (Release & Deploy)

1.  Create a commit message following the Conventional Commits standard.
2.  Push code to the remote branch (Git Push) to trigger the CI/CD pipeline (GitHub Actions, GitLab CI).
3.  Provide the pipeline log link or manual deployment instructions if the project is not configured for automatic deployment.
