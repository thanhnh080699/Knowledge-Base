---
description: Process for creating implementation plans for complex coding tasks.
---

# Workflow Command: /plan

Process for creating implementation plans for complex coding tasks.

---

## 📋 Description

The `/plan` command is activated when starting a new feature, refactoring, or performing a major architectural modification. The goal is to align the AI Agent and the user on the technical approach before modifying any code.

---

## 🔄 Execution Steps

### Step 1: Research & Analysis

1.  Scan the project source code to identify:
    *   Files that will be directly affected.
    *   Relevant libraries and their current versions.
    *   Corresponding coding standards in `.agents/rules/`.
2.  **Strictly forbidden** to create new or modify existing code files in this step.

### Step 2: Create Implementation Plan (Design & Document)

1.  Create an `implementation_plan.md` file in the `.system_generated/` directory or the directory specified by the IDE, based on the template at [templates/implementation_plan.template.md](file:///d:/work/ag-tool-kit/templates/implementation_plan.template.md).
2.  Document fully:
    *   Technical goals.
    *   Design decisions and potential breaking changes.
    *   Open questions requiring user feedback.
    *   List of files to be modified, categorized by component.

### Step 3: User Approval

1.  Send a brief notification to the user letting them know the plan is ready for review.
2.  **Halt execution** and wait for user approval or modification feedback.
3.  Once approved by the user, create the `task.md` file (Task Checklist) to start coding.
