#!/usr/bin/env python3
"""
Auto Preview - AG Kit
==============================
Manages (start/stop/status/restart/check/logs) the local development server for previewing the application.

Usage:
    python .agents/scripts/auto_preview.py start [path] [port]
    python .agents/scripts/auto_preview.py stop [path]
    python .agents/scripts/auto_preview.py status [path]
    python .agents/scripts/auto_preview.py restart [path] [port]
    python .agents/scripts/auto_preview.py check [path]
    python .agents/scripts/auto_preview.py logs [path] [lines]
"""

import os
import sys
import time
import json
import signal
import argparse
import subprocess
import re
from pathlib import Path
from typing import Dict, Any, List, Tuple
import urllib.request
import urllib.error

def get_project_root(path: str = None) -> Path:
    if path:
        return Path(path).resolve()
    current = Path.cwd().resolve()
    for parent in [current] + list(current.parents):
        if (parent / ".agents").is_dir() or (parent / ".agent").is_dir():
            return parent
    return current

def get_agent_dir(root: Path) -> Path:
    if (root / ".agents").is_dir():
        return root / ".agents"
    elif (root / ".agent").is_dir():
        return root / ".agent"
    return root / ".agents"

def get_meta_file(root: Path) -> Path:
    return get_agent_dir(root) / "preview.json"

def get_log_file(root: Path) -> Path:
    return get_agent_dir(root) / "preview.log"

def is_running(pid: int) -> bool:
    if pid <= 0:
        return False
    if sys.platform == "win32":
        try:
            out = subprocess.check_output(
                ["tasklist", "/FI", f"PID eq {pid}"], 
                shell=True, 
                text=True, 
                stderr=subprocess.DEVNULL
            )
            return str(pid) in out
        except Exception:
            return False
    else:
        try:
            os.kill(pid, 0)
            return True
        except OSError:
            return False

def detect_stack(root: Path) -> Tuple[str, List[str]]:
    # Node.js
    pkg_file = root / "package.json"
    if pkg_file.exists():
        try:
            with open(pkg_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            deps = {**data.get("dependencies", {}), **data.get("devDependencies", {})}
            stack = ["Node.js"]
            if "next" in deps: stack.append("Next.js")
            if "react" in deps: stack.append("React")
            if "vue" in deps: stack.append("Vue")
            if "nestjs" in deps: stack.append("NestJS")
            if "express" in deps: stack.append("Express")
            return "Node.js", stack
        except Exception:
            pass

    # Go
    go_mod = root / "go.mod"
    if go_mod.exists():
        try:
            content = go_mod.read_text(encoding='utf-8')
            stack = ["Go"]
            if "github.com/goravel/goravel" in content: stack.append("Goravel")
            if "github.com/gin-gonic/gin" in content: stack.append("Gin")
            if "github.com/gofiber/fiber" in content: stack.append("Fiber")
            return "Go", stack
        except Exception:
            pass

    # PHP
    composer_file = root / "composer.json"
    if composer_file.exists():
        try:
            with open(composer_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            reqs = {**data.get("require", {}), **data.get("require-dev", {})}
            stack = ["PHP"]
            if "laravel/framework" in reqs: stack.append("Laravel")
            if "filament/filament" in reqs: stack.append("Filament")
            return "PHP", stack
        except Exception:
            pass

    # Python
    pyproject = root / "pyproject.toml"
    reqs_txt = root / "requirements.txt"
    if pyproject.exists() or reqs_txt.exists() or any(root.glob("*.py")):
        stack = ["Python"]
        if pyproject.exists():
            try:
                content = pyproject.read_text(encoding='utf-8')
                if "django" in content.lower(): stack.append("Django")
                if "fastapi" in content.lower(): stack.append("FastAPI")
                if "flask" in content.lower(): stack.append("Flask")
            except Exception: pass
        elif reqs_txt.exists():
            try:
                content = reqs_txt.read_text(encoding='utf-8')
                if "django" in content.lower(): stack.append("Django")
                if "fastapi" in content.lower(): stack.append("FastAPI")
                if "flask" in content.lower(): stack.append("Flask")
            except Exception: pass
        return "Python", stack

    return "Generic", []

def get_start_command(root: Path, stack_type: str, stack_details: List[str], port: int) -> Tuple[List[str], Dict[str, str]]:
    env = os.environ.copy()
    env["PORT"] = str(port)
    
    if stack_type == "Node.js":
        try:
            with open(root / "package.json", 'r', encoding='utf-8') as f:
                data = json.load(f)
            scripts = data.get("scripts", {})
            
            if "dev" in scripts:
                cmd = ["npm", "run", "dev"]
                if "next" in stack_details:
                    cmd += ["--", "-p", str(port)]
                elif "vue" in stack_details or "vite" in scripts.get("dev", ""):
                    cmd += ["--", "--port", str(port)]
                return cmd, env
            elif "start" in scripts:
                return ["npm", "start"], env
        except Exception:
            pass
        return ["npm", "start"], env

    elif stack_type == "Go":
        if "Goravel" in stack_details:
            return ["go", "run", "main.go"], env
        if (root / "main.go").exists():
            return ["go", "run", "main.go"], env
        return ["go", "run", "."], env

    elif stack_type == "PHP":
        if "Laravel" in stack_details or "Filament" in stack_details:
            return ["php", "artisan", "serve", f"--port={port}"], env
        return ["php", "-S", f"localhost:{port}"], env

    elif stack_type == "Python":
        if "FastAPI" in stack_details:
            if (root / "app" / "main.py").exists():
                return ["python", "-m", "uvicorn", "app.main:app", "--port", str(port), "--reload"], env
            return ["python", "-m", "uvicorn", "main:app", "--port", str(port), "--reload"], env
        elif "Django" in stack_details:
            return ["python", "manage.py", "runserver", f"127.0.0.1:{port}"], env
        elif "Flask" in stack_details:
            env["FLASK_RUN_PORT"] = str(port)
            return ["python", "-m", "flask", "run"], env
        return ["python", "-m", "http.server", str(port)], env

    return ["python", "-m", "http.server", str(port)], env

def start_server(root: Path, port: int = 3000):
    meta_file = get_meta_file(root)
    log_file = get_log_file(root)
    
    if meta_file.exists():
        try:
            meta = json.loads(meta_file.read_text(encoding='utf-8'))
            pid = meta.get("pid", 0)
            if is_running(pid):
                print(f"⚠️  Preview server is already running (PID: {pid}, Port: {meta.get('port')})")
                print("💡 Use '/preview stop' or '/preview restart' first.")
                return
        except Exception:
            pass
            
    stack_type, stack_details = detect_stack(root)
    stack_str = f"{stack_type} ({', '.join(stack_details)})" if stack_details else stack_type
    
    cmd, env = get_start_command(root, stack_type, stack_details, port)
    
    print(f"🚀 Starting Preview Server...")
    print(f"   - Tech Stack: {stack_str}")
    print(f"   - Port: {port}")
    print(f"   - Command: {' '.join(cmd)}")
    
    get_agent_dir(root).mkdir(parents=True, exist_ok=True)
    
    log_fd = open(log_file, "w", encoding="utf-8")
    
    popen_kwargs = {
        "cwd": str(root),
        "stdout": log_fd,
        "stderr": subprocess.STDOUT,
        "env": env,
        "text": True
    }
    
    if sys.platform == "win32":
        if cmd[0] in ["npm", "go", "php"]:
            popen_kwargs["shell"] = True
        popen_kwargs["creationflags"] = subprocess.CREATE_NEW_PROCESS_GROUP
    else:
        popen_kwargs["preexec_fn"] = os.setsid
        
    try:
        proc = subprocess.Popen(cmd, **popen_kwargs)
        
        meta = {
            "pid": proc.pid,
            "port": port,
            "stack": stack_str,
            "cmd": cmd,
            "start_time": time.time()
        }
        meta_file.write_text(json.dumps(meta, indent=2), encoding='utf-8')
        
        time.sleep(1.5)
        if proc.poll() is not None:
            print("❌ Preview server failed to start immediately. Check log file:")
            print(f"   Log: {log_file}")
            if log_file.exists():
                lines = log_file.read_text(encoding='utf-8').splitlines()
                print("\n".join(lines[-10:]))
            if meta_file.exists():
                meta_file.unlink()
            return
            
        print(f"✅ Preview ready!")
        print(f"   - URL: http://localhost:{port}")
        print(f"   - PID: {proc.pid}")
        print(f"   - Log: {log_file}")
        
    except Exception as e:
        print(f"❌ Error starting server: {e}")

def stop_server(root: Path):
    meta_file = get_meta_file(root)
    if not meta_file.exists():
        print("ℹ️  No preview server running (no metadata found).")
        return
        
    try:
        meta = json.loads(meta_file.read_text(encoding='utf-8'))
        pid = meta.get("pid", 0)
        port = meta.get("port")
        
        if not is_running(pid):
            print(f"ℹ️  Server (PID: {pid}) is already stopped.")
            meta_file.unlink()
            return
            
        print(f"🛑 Stopping Preview Server (PID: {pid}, Port: {port})...")
        
        if sys.platform == "win32":
            subprocess.run(
                ["taskkill", "/F", "/T", "/PID", str(pid)], 
                stdout=subprocess.DEVNULL, 
                stderr=subprocess.DEVNULL
            )
        else:
            try:
                pgid = os.getpgid(pid)
                os.killpg(pgid, signal.SIGTERM)
                time.sleep(1)
                if is_running(pid):
                    os.killpg(pgid, signal.SIGKILL)
            except Exception:
                try:
                    os.kill(pid, signal.SIGTERM)
                except Exception:
                    pass
                    
        time.sleep(0.5)
        if not is_running(pid):
            print("✅ Preview server stopped successfully.")
            meta_file.unlink()
        else:
            print("⚠️  Warning: Failed to stop server. It might still be running.")
            
    except Exception as e:
        print(f"❌ Error stopping server: {e}")

def get_status(root: Path):
    meta_file = get_meta_file(root)
    if not meta_file.exists():
        print("🛑 Preview Server is: STOPPED")
        return
        
    try:
        meta = json.loads(meta_file.read_text(encoding='utf-8'))
        pid = meta.get("pid", 0)
        port = meta.get("port")
        stack = meta.get("stack", "Unknown")
        
        if is_running(pid):
            uptime = int(time.time() - meta.get("start_time", time.time()))
            print("🟢 Preview Server is: RUNNING")
            print(f"   - Tech Stack: {stack}")
            print(f"   - Port: {port}")
            print(f"   - URL: http://localhost:{port}")
            print(f"   - PID: {pid}")
            print(f"   - Uptime: {uptime}s")
        else:
            print("🛑 Preview Server is: STOPPED (stale metadata cleaned)")
            meta_file.unlink()
    except Exception as e:
        print(f"❌ Error reading status: {e}")

def check_health(root: Path):
    meta_file = get_meta_file(root)
    if not meta_file.exists():
        print("❌ Health Check Failed: Server is not running.")
        return
        
    try:
        meta = json.loads(meta_file.read_text(encoding='utf-8'))
        port = meta.get("port", 3000)
        url = f"http://localhost:{port}"
        
        print(f"🔍 Pinging preview server at {url}...")
        
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'AG-Kit-Preview-Check'}
        )
        
        try:
            with urllib.request.urlopen(req, timeout=3) as response:
                status = response.status
                print(f"✅ Health Check: OK (Status: {status})")
        except urllib.error.HTTPError as e:
            print(f"✅ Health Check: OK (Server responded with HTTP {e.code})")
        except urllib.error.URLError as e:
            print(f"❌ Health Check FAILED: Connection Refused or Timeout ({e.reason})")
            
    except Exception as e:
        print(f"❌ Health Check FAILED: {e}")

def show_logs(root: Path, lines: int = 20):
    log_file = get_log_file(root)
    if not log_file.exists():
        print("ℹ️  No preview logs found.")
        return
        
    try:
        content = log_file.read_text(encoding='utf-8', errors='ignore')
        log_lines = content.splitlines()
        
        print(f"📋 Last {min(lines, len(log_lines))} log lines from {log_file.name}:")
        print("-" * 60)
        print("\n".join(log_lines[-lines:]))
        print("-" * 60)
    except Exception as e:
        print(f"❌ Error reading log file: {e}")

def main():
    if hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8")
        except Exception:
            pass
            
    parser = argparse.ArgumentParser(description="Auto Preview Manager - AG Kit")
    parser.add_argument("action", choices=["start", "stop", "status", "restart", "check", "logs"], help="Action to perform")
    parser.add_argument("path", nargs="?", default=None, help="Project path")
    parser.add_argument("extra", nargs="?", default=None, help="Port for start/restart, or lines count for logs")
    args = parser.parse_args()
    
    root = get_project_root(args.path)
    
    if args.action == "start":
        port = int(args.extra) if args.extra and args.extra.isdigit() else 3000
        start_server(root, port)
    elif args.action == "stop":
        stop_server(root)
    elif args.action == "status":
        get_status(root)
    elif args.action == "restart":
        port = int(args.extra) if args.extra and args.extra.isdigit() else 3000
        stop_server(root)
        time.sleep(1)
        start_server(root, port)
    elif args.action == "check":
        check_health(root)
    elif args.action == "logs":
        lines = int(args.extra) if args.extra and args.extra.isdigit() else 20
        show_logs(root, lines)

if __name__ == "__main__":
    main()
