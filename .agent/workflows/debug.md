---
description: Systematic process for debugging and Root Cause Analysis (RCA).
---

# Workflow Command: /debug

Systematic process for debugging and Root Cause Analysis (RCA).

---

## 📋 Description

The `/debug` command is triggered when system errors, failed tests, or unexpected application behaviors are detected. This process helps locate errors quickly and provide the safest resolution.

---

## 🔄 Execution Steps

### Step 1: Information Gathering & Reproduction

1.  Carefully read error logs (stack trace), error codes (status codes), and record when the error occurred.
2.  Identify the input conditions and system state that lead to the occurrence of the error.
3.  Attempt to reproduce the error by running test scripts or invoking the corresponding API/CLI.

### Step 2: Root Cause Analysis

1.  Trace the source code along the data flow from the error reporting point back to its origin.
2.  Formulate hypotheses about the cause of the error.
3.  Test the hypotheses by reading the code or inserting additional debug logging to check variable values.

### Step 3: Remediation & Verification

1.  Present the cause of the error and propose remediation plans (analyzing the pros and cons of each approach).
2.  Once the user approves the approach, apply changes to the source code.
3.  Rerun relevant tests to ensure the error is fully resolved and no new regressions are introduced.
