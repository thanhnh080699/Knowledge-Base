---
name: code-review-graph
description: Source code review token optimization using Tree-sitter AST and MCP. Reduces AI token consumption on large codebases by calculating the blast radius of changes instead of reading the entire codebase. Uses an SQLite graph database for structural analysis.
when_to_use: "When reviewing source code in large codebases (over 500 files), when token costs are high, when making changes across multiple files with cross-module dependencies, or in monorepos. Also used to detect dead code, visualize architecture, and preview refactoring results. DO NOT use for small projects under 200 files with single and isolated changes."
allowed-tools: Read, Grep, Glob, Bash
effort: medium
---

# Code Review Graph — Context Optimization Via MCP

> Significantly reduces token consumption on large codebases by providing the AI with a structural map instead of forcing it to read the entire source code. Benefits scale with project size.

## Overview

`code-review-graph` is an MCP server that uses **Tree-sitter** to statically parse your codebase into an AST graph and store it in **SQLite**. When an AI assistant needs context to perform a task, it queries the graph first to retrieve only the files within the **blast radius** of the changes, rather than reading every file in the directory.

**Token Impact (illustrative - varies by codebase):**

| Codebase Type | Characteristics |
|---------------|---------|
| Large Monorepo (10K+ files) | Greatest savings — the graph reads only a small fraction of related files |
| Medium-sized Project (1K-5K files) | Significantly reduces tokens for multi-file changes |
| Small Project (<200 files) | Minimal benefit — graph management overhead may exceed saved tokens |

> **Regarding Quality:** Limiting the AI's scope to the blast radius reduces information noise, thereby improving focus and code review quality. Measure actual results on your codebase rather than relying on fixed factors.

---

## Bootstrap Protocol (Opt-in)

When activated in the `/plan` workflow or used normally on a medium to large scale project, verify if graph analysis is available before depending on it:
1. **Step 1:** Check if the tool is installed: run `Get-Command code-review-graph` (on Windows) or `which code-review-graph` (on macOS/Linux).
2. **Step 2:** Check if the `.code-review-graph/` configuration directory exists in the workspace.
3. **Step 3:** If the tool is installed but no index database exists, ask for user permission before running `code-review-graph build` (this will scan the entire project).
4. **Step 4:** If not installed and the project is large, ask the user: *"Would you like to install `code-review-graph` (via pip) and build a local map to save tokens for this project?"*. Never install or run the build command without user confirmation.

---

## When to Use vs. When to Skip

### ✅ Should install if:
- The codebase has **500+ files** or more.
- You frequently make **changes across multiple files** with cross-module dependencies.
- You spend a significant amount on token costs for the AI assistant monthly.
- You work with **monorepos**, microservices, or multi-package TypeScript projects.
- You want to **improve code review quality** in addition to saving costs.

### ❌ Skip if:
- The codebase has **fewer than ~200 files** and changes are isolated to individual files.
- Heavily uses **dynamic patterns** (such as reflection, runtime code generation, dynamic imports) making static analysis ineffective.
- You want a **zero-maintenance** system — since the graph needs periodic synchronization as the code changes.

### ⚠️ Evaluate carefully if:
- The codebase has **200–500 files** — run pilot measurements before deciding on long-term adoption.
- There is a mix of **static and dynamic patterns** — test on representative commits to evaluate accuracy.

---

## How It Works (4 Layers)

```
Layer 1: PARSE  ──> Tree-sitter builds AST tree from 19 supported languages
Layer 2: STORE  ──> Nodes + edges are stored in SQLite graph
Layer 3: TRACE  ──> BFS algorithm calculates the blast radius of changes
Layer 4: SERVE  ──> MCP protocol provides graph data to the AI assistant
```

### What does the graph contain?
- **Nodes:** Files, functions, methods, classes, import statements, test files.
- **Edges:** Describes relationships such as "A calls B", "X imports Y", "Test Z tests Function W", "Class A inherits Class B".
- **Metadata:** Name, data type, file path, line range of each node.
- **Privacy:** Only stores structural metadata — **DO NOT** store actual source code content in the graph.

### List of 19 supported languages
Python, TypeScript, JavaScript, Go, Rust, Java, C#, Ruby, Kotlin, Swift, PHP, C/C++, Vue SFC, Solidity, Dart, R, Perl, Lua, Jupyter/Databricks notebooks.

---

## Installation & Configuration

### System Requirements
- Python 3.9+ (`python3 --version`)
- `pip` or `pipx` installed
- MCP-compatible AI client (AG Kit, Claude Code, Cursor, Windsurf, Zed)
- Codebase managed by Git (to support incremental updates)

### Step 1: Install Package
```bash
# Recommended: Install in an isolated environment using pipx
pipx install code-review-graph

# Alternative: Run quickly using uv (without permanent installation)
uvx code-review-graph install

# Alternative: Install globally via pip
pip install code-review-graph
```

### Step 2: Configure MCP Client
Configure the MCP server by running auto-detection and registering it to the client:
```bash
# Auto-detect and configure for supported tools on the system
code-review-graph install

# Or specify a platform client
code-review-graph install --platform cursor
code-review-graph install --platform claude
code-review-graph install --platform zed
```

If configuring manually, add the following to your client's MCP configuration file (e.g. `mcp.json` or `cursor-settings.json`):
```json
{
  "mcpServers": {
    "code-review-graph": {
      "command": "code-review-graph",
      "args": ["run"]
    }
  }
}
```

---

## Usage & Operation Guidelines

### 1. Initialize Graph for the First Time
Navigate to the project directory and run the following command to scan and build the graph:
```bash
code-review-graph build
```
This command will create a local `.code-review-graph/` directory containing the `graph.db` database file.

### 2. Update Graph when Code Changes
The graph supports super fast incremental updates by only analyzing files that have changed compared to Git:
```bash
code-review-graph update
```
*Recommendation:* Add this command to the project's Git `post-commit` hook so the graph is always synchronized automatically.

### 3. MCP Tools Provided to AI
After successful installation, the MCP server will provide the AI assistant with the following tools:
*   `get_blast_radius(files: string[])`: Calculates and returns a list of files/functions directly and indirectly affected by the input file list.
*   `find_dependents(file: string)`: Finds files that import or depend on the current file.
*   `get_call_graph(function_name: string)`: Returns the call graph of the specified function.
*   `show_architecture_summary()`: Visualizes the directory structure and main module relationships in the system.
