---
name: performance-profiling
description: Guidelines for performance profiling and system measurement. How to use profiling tools, measure Core Web Vitals, and diagnose CPU and memory.
when_to_use: "When needing to measure, analyze performance, benchmark, find root causes of CPU/RAM slowness, or optimize Core Web Vitals."
allowed-tools: Read, Write, Grep
---

# Skill: Performance Profiling

> Guidelines for measuring and analyzing performance before optimization.

## 🛠️ Recommended Measurement Tools

1.  **Lighthouse / PageSpeed Insights**: Measure Core Web Vitals and suggest general optimization for web applications.
2.  **Chrome DevTools (Performance Tab)**:
    *   Use to record interactions and find "Long Tasks" (> 50ms) blocking the main thread.
    *   Check Layout Shifts to identify causes of increased CLS.
3.  **Chrome DevTools (Memory Tab)**:
    *   Take a **Heap Snapshot** to compare memory usage before and after an action to search for memory leaks.
4.  **Laravel Debugbar / Telescope / Clockwork**:
    *   Check the number of SQL queries, controller execution time, and RAM usage on the Backend.

## 📈 3-Step Measurement Process

### Step 1: Establish a Baseline

*   Run measurements in a production-like environment or a local production build (for frontend).
*   Record current metrics (e.g., LCP = 4.2s, INP = 350ms).

### Step 2: Implement Changes & Retest

*   Apply optimization changes to the largest bottleneck.
*   Rerun measurements under the same test conditions (same network configuration, same emulated device).

### Step 3: Compare & Validate

*   Confirm successful optimization only when actual metrics improve significantly without introducing regressions.
