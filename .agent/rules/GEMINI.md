---
trigger: always_on
---

# GEMINI.md - Agent Operating Standards (AG Kit)

> This file defines how the AI Agent operates and behaves in this workspace. This is the highest priority standard.

---

## 🔴 IMPORTANT: AGENT & SKILL PROTOCOL (MANDATORY)

> **MANDATORY:** You must read the appropriate agent file and its skills BEFORE making any changes. This is the highest priority rule.

### 1. Conditional Skill Loading Protocol
When the Agent is activated $\rightarrow$ Check frontmatter "skills:" $\rightarrow$ Read `SKILL.md` (main index file) $\rightarrow$ Read specific related sections.
*   **Selective Reading:** DO NOT read all files in the skills directory at once. Only read `SKILL.md` first, then read only the sections strictly relevant to the user's request to save context.
*   **Rule Priority:** P0 (GEMINI.md) > P1 (Agent .md) > P2 (SKILL.md). All rules must be strictly followed.
*   **Global Skill Fallback:** If the local skill directory is not found in the project at `.agents/skills/<skill-name>/`, the AI Agent must search the system's global directory at `~/.ag-kit/.agents/skills/<skill-name>/` (or `%USERPROFILE%\.ag-kit\.agents\skills\<skill-name>\` on Windows) and load the knowledge from there.

### 2. Execution Protocol
*   **Upon Activation:** Read Rules $\rightarrow$ Check Agent Frontmatter $\rightarrow$ Load the corresponding SKILL.md $\rightarrow$ Apply all rules.
*   **Forbidden:** Never skip reading agent rules or skill guidelines. The "Read $\rightarrow$ Understand $\rightarrow$ Apply" process is mandatory.
*   **Global Memory Hub Integration:** Besides reading the local memory file at `.agents/memory/MEMORY.md`, the AI Agent should check the shared accumulated knowledge in the user's global memory directory `~/.ag-kit/memory/` (or `%USERPROFILE%\.ag-kit\memory\` on Windows) to inherit gotchas and common conventions accumulated from other projects.

---

## 📥 1. REQUEST CLASSIFIER (STEP 1)

**Before performing any action, classify the user's request:**

| Request Type | Identification Keywords | Application Level | Output Result |
| :--- | :--- | :--- | :--- |
| **QUESTION** | "what is", "how to", "explain" | TIER 0 Only | Text Response |
| **SURVEY / INTEL** | "analyze", "list files", "overview" | TIER 0 + Explorer Agent | Session Intel (No file edits) |
| **SIMPLE CODE** | "fix", "add", "change" (on 1 file) | TIER 0 + TIER 1 (Lite) | Inline Edit |
| **COMPLEX CODE**| "build", "create new", "deploy", "refactor" | TIER 0 + TIER 1 (Full) + Expert Agent | **Mandatory Plan & Task Checklist** |
| **DESIGN / UI** | "design", "interface", "page", "dashboard" | TIER 0 + TIER 1 + Expert Agent | **Mandatory Plan & Task Checklist** |

---

## 🤖 2. AUTOMATIC AGENT ROUTING (STEP 2)

**ALWAYS ACTIVE: Before responding to any programming or design request, automatically analyze and select the appropriate specialist.**

> 🔴 **MANDATORY:** You must comply with the automatic routing workflow defined in [intelligent-routing](file:///d:/work/ag-tool-kit/.agents/skills/intelligent-routing/SKILL.md).

### Automatic Routing Workflow
1.  **Silent Analysis**: Identify the task domain (Frontend, Backend, Security, PM, QA...) from the user's request.
2.  **Select Agent**: Choose the corresponding specialist in the `.agents/agent/` directory.
3.  **Inform the User (MANDATORY)**: Print the following notice as the very first line before replying:
    ```markdown
    🤖 **Applying knowledge of `@[agent-name]`...**
    ```
4.  **Load Skills**: Read the `skills` attribute in the frontmatter of the selected agent and load the relevant instructions from `.agents/skills/`.

### Routing Rules
*   **Silent Analysis**: Do not explain your routing analysis steps in detail (e.g., forbidden to write "I am analyzing...").
*   **Respect Specifications**: If the user explicitly mentions an `@agent`, use that agent.
*   **Complex Tasks**: For complex multi-domain requests, use the `orchestrator` and ask questions to clarify the design first.

### ⚠️ AGENT ROUTING CHECKLIST (MANDATORY BEFORE CODING/DESIGNING)
**Before writing any line of code, you must complete the following mental checklist:**
1.  Have you identified the correct agent for this domain? (If not $\rightarrow$ STOP. Analyze the domain first).
2.  Have you read the agent configuration file `.agents/agent/{agent}.md`? (If not $\rightarrow$ STOP and open the file).
3.  Have you printed the notice `🤖 **Applying knowledge of @[agent]...**`? (If not $\rightarrow$ STOP and add it to the top of the response).
4.  Have you loaded the skills defined in the agent's frontmatter? (If not $\rightarrow$ STOP and read them).

*Violation of this checklist is considered a severe protocol breach.*

---

## TIER 0: GLOBAL RULES (ALWAYS ACTIVE)

### 🌐 3. Language Handling
*   **Communication Language**: Reply in the user's language (in this project, default is Vietnamese).
*   **Writing Code**: Code comments, variable names, function names, and classes must be written in English to ensure international standardization.

### 💬 4. Communication Style
*   **Concise & Focused**: Do not write long explanations or repeat unnecessary code. Provide direct solutions.
*   **Use Clickable Links**: When referring to any file, class, struct, or function in the source code, you **must** create a markdown link format: `[file_name](file:///absolute_path_to_file)`.

### 🧹 5. Clean Code Standards
*   **SRP**: Single Responsibility Principle - each function/class does ONLY one thing.
*   **DRY**: Don't Repeat Yourself - reuse code, avoid duplication.
*   **KISS & YAGNI**: Keep the solution as simple as possible and do not build features that are not yet needed.
*   **Avoid Hardcoding**: Put all configurations, API keys, and URL endpoints into environment variables (`.env`).
*   **Error Handling**: Always check returned errors and log them in detail. No silent failures.

### 📁 6. File Dependency Awareness
*   Before modifying any file, you must check its dependency graph (using `CODEBASE.md` or manual checking) to prevent regression. Modify the source file and related dependent files within the same task.

### 🐙 7. Git & Commit Standards
The system follows the **Conventional Commits** standard (`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`).

### 🧪 8. Task Execution Workflow
All complex changes (classified as COMPLEX CODE or DESIGN/UI) must follow a 3-step process:
1.  **Planning**: Research the current source code, propose solutions, and create `implementation_plan.md` for the user to approve.
2.  **Execution**: Write code and continuously update progress in `task.md`.
3.  **Verification & Walkthrough**: Run automated tests, perform manual verification, and write a handover report `walkthrough.md`.