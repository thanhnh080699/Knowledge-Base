---
description: Process for managing, starting, and monitoring local preview development servers (Preview Dev Server).
---

# Workflow Command: /preview

Process for managing, starting, and monitoring local preview development servers (Preview Dev Server).

---

## 📋 Description

The `/preview` command is used to control the status of the local dev server. It is a powerful tool to assist design/programming agents (like Frontend Specialist) in running applications and performing visual validation after UI/logic changes.

This command runs via the helper script [auto_preview.py](file:///d:/work/ag-tool-kit/.agents/scripts/auto_preview.py) in the background to ensure the dev server runs asynchronously and does not block the Agent's workspace terminal.

---

## 🔄 Available Actions

### 1. Status Check

Display whether the preview server is running, the process PID, and the active port.
```bash
/preview
```

### 2. Start Preview Server (Start Preview)

Launch the dev server corresponding to the detected project stack. Supports custom port options.
```bash
/preview start [port]
```
*   *Default*: Uses port 3000 or the port defined in the project configuration.
*   *Automation*: The script automatically detects the stack (Node.js, Go, PHP, Python) and runs the corresponding dev command.

### 3. Stop Preview Server (Stop Preview)

Completely shut down the preview server and clean up used resources/ports.
```bash
/preview stop
```
*   *Note*: On Windows, the script uses a process tree termination mechanism (`taskkill /F /T`) to avoid orphaned child processes (e.g. node.exe/php.exe) keeping the port occupied.

### 4. Restart Preview Server (Restart Preview)

```bash
/preview restart [port]
```

### 5. Health Check

Perform an HTTP ping request to the preview homepage to ensure the application is responding normally.
```bash
/preview check
```

### 6. View Server Logs (View Logs)

Print the latest `n` lines of logs from the preview server to debug compiler/runtime errors.
```bash
/preview logs [n]
```
*   *Default*: Displays the last 20 lines.

---

## 💡 Examples

### Start Node.js/Next.js project

```bash
/preview start 3000
```
*Response:*
```plaintext
🚀 Launching Preview Server...
   - Project detected: Node.js (Next.js)
   - Port connection: 3000
   - Execution command: npm run dev -- -p 3000

✅ Preview server is ready!
   - URL Address: http://localhost:3000
   - Process PID: 12452 (running in background)
   - Log file: .agents/preview.log
```

### View error logs when the server is not responding

```bash
/preview logs 10
```
*Response:*
```plaintext
📋 Displaying the last 10 log lines:
------------------------------------------------------------
[next] ready - started server on 0.0.0.0:3000, url: http://localhost:3000
[next] info  - Loaded env from .env.local
[next] event - compiled client and server successfully in 921ms
[next] error - Hydration failed because the initial UI does not match what was rendered on the server.
```
