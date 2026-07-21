#!/usr/bin/env python3
"""
Session Manager - AG Kit
=================================
Analyzes project state, detects tech stack, tracks file statistics, and provides
a summary of the current session.

Usage:
    python .agents/scripts/session_manager.py status [path]
    python .agents/scripts/session_manager.py info [path]
"""

import os
import json
import argparse
import sys
import re
from pathlib import Path
from typing import Dict, Any, List

def get_project_root(path: str = None) -> Path:
    if path:
        return Path(path).resolve()
    # Try to find .agents or .agent upwards from the current directory
    current = Path.cwd().resolve()
    for parent in [current] + list(current.parents):
        if (parent / ".agents").is_dir() or (parent / ".agent").is_dir():
            return parent
    return current

def analyze_node_project(root: Path) -> Dict[str, Any]:
    pkg_file = root / "package.json"
    if not pkg_file.exists():
        return {}
    
    try:
        with open(pkg_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        deps = data.get("dependencies", {})
        dev_deps = data.get("devDependencies", {})
        all_deps = {**deps, **dev_deps}
        
        stack = []
        if "next" in all_deps: stack.append("Next.js")
        elif "react" in all_deps: stack.append("React")
        elif "vue" in all_deps: stack.append("Vue")
        elif "svelte" in all_deps: stack.append("Svelte")
        elif "express" in all_deps: stack.append("Express")
        elif "nestjs" in all_deps or "@nestjs/core" in all_deps: stack.append("NestJS")
        
        if "tailwindcss" in all_deps: stack.append("Tailwind CSS")
        if "prisma" in all_deps: stack.append("Prisma")
        if "typescript" in all_deps: stack.append("TypeScript")
        
        return {
            "name": data.get("name", "unnamed-node-project"),
            "version": data.get("version", "0.0.0"),
            "language": "TypeScript" if "typescript" in all_deps else "JavaScript",
            "stack": stack
        }
    except Exception as e:
        return {"error": f"Failed to parse package.json: {str(e)}"}

def analyze_go_project(root: Path) -> Dict[str, Any]:
    go_mod = root / "go.mod"
    if not go_mod.exists():
        return {}
    
    try:
        content = go_mod.read_text(encoding='utf-8')
        
        # Parse module name
        module_match = re.search(r'^module\s+(.+)$', content, re.MULTILINE)
        module_name = module_match.group(1).strip() if module_match else "unnamed-go-module"
        
        # Parse go version
        go_match = re.search(r'^go\s+([0-9.]+)', content, re.MULTILINE)
        go_version = go_match.group(1).strip() if go_match else "unknown"
        
        stack = []
        if "github.com/gin-gonic/gin" in content: stack.append("Gin")
        if "github.com/gofiber/fiber" in content: stack.append("Fiber")
        if "github.com/labstack/echo" in content: stack.append("Echo")
        if "github.com/goravel/goravel" in content: stack.append("Goravel")
        if "gorm.io/gorm" in content: stack.append("GORM")
        
        return {
            "name": module_name,
            "version": go_version,
            "language": "Go",
            "stack": stack
        }
    except Exception as e:
        return {"error": f"Failed to parse go.mod: {str(e)}"}

def analyze_php_project(root: Path) -> Dict[str, Any]:
    composer_file = root / "composer.json"
    if not composer_file.exists():
        return {}
    
    try:
        with open(composer_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        reqs = data.get("require", {})
        reqs_dev = data.get("require-dev", {})
        all_reqs = {**reqs, **reqs_dev}
        
        stack = []
        if "laravel/framework" in all_reqs: stack.append("Laravel")
        if "filament/filament" in all_reqs: stack.append("Filament")
        if "symfony/symfony" in all_reqs or "symfony/http-kernel" in all_reqs: stack.append("Symfony")
        if "yiisoft/yii2" in all_reqs: stack.append("Yii2")
        
        return {
            "name": data.get("name", "unnamed-composer-project"),
            "version": data.get("version", "0.0.0"),
            "language": "PHP",
            "stack": stack
        }
    except Exception as e:
        return {"error": f"Failed to parse composer.json: {str(e)}"}

def analyze_python_project(root: Path) -> Dict[str, Any]:
    pyproject = root / "pyproject.toml"
    reqs_txt = root / "requirements.txt"
    pipfile = root / "Pipfile"
    
    has_python_files = any(root.glob("*.py")) or any((root / "src").glob("**/*.py")) if (root / "src").is_dir() else False
    
    if not (pyproject.exists() or reqs_txt.exists() or pipfile.exists() or has_python_files):
        return {}
        
    name = root.name
    version = "0.0.0"
    stack = []
    
    # 1. Parse pyproject.toml if exists
    if pyproject.exists():
        try:
            content = pyproject.read_text(encoding='utf-8')
            name_match = re.search(r'name\s*=\s*["\']([^"\']+)["\']', content)
            version_match = re.search(r'version\s*=\s*["\']([^"\']+)["\']', content)
            if name_match: name = name_match.group(1)
            if version_match: version = version_match.group(1)
            
            stack.append("Poetry/Pyproject")
            if "django" in content.lower(): stack.append("Django")
            if "flask" in content.lower(): stack.append("Flask")
            if "fastapi" in content.lower(): stack.append("FastAPI")
        except Exception:
            pass
            
    # 2. Parse requirements.txt if exists
    elif reqs_txt.exists():
        try:
            content = reqs_txt.read_text(encoding='utf-8')
            stack.append("pip")
            if "django" in content.lower(): stack.append("Django")
            if "flask" in content.lower(): stack.append("Flask")
            if "fastapi" in content.lower(): stack.append("FastAPI")
        except Exception:
            pass
            
    # 3. Pipfile
    elif pipfile.exists():
        try:
            content = pipfile.read_text(encoding='utf-8')
            stack.append("Pipenv")
            if "django" in content.lower(): stack.append("Django")
            if "flask" in content.lower(): stack.append("Flask")
            if "fastapi" in content.lower(): stack.append("FastAPI")
        except Exception:
            pass
            
    else:
        stack.append("Python Script")
        
    return {
        "name": name,
        "version": version,
        "language": "Python",
        "stack": stack
    }

def scan_files(root: Path) -> Dict[str, Any]:
    stats = {}
    ignored_dirs = {
        ".git", "node_modules", "vendor", "__pycache__", "venv", ".venv", 
        "dist", "build", "out", ".next", ".nuxt", "target", "bin", "obj",
        ".gemini", ".idea", ".vscode"
    }
    
    total_files = 0
    total_dirs = 0
    
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in ignored_dirs and not d.startswith(".")]
        
        total_dirs += len(dirnames)
        for filename in filenames:
            if filename.startswith("."):
                continue
            ext = Path(filename).suffix.lower()
            if not ext:
                ext = "no-extension"
            stats[ext] = stats.get(ext, 0) + 1
            total_files += 1
            
    sorted_stats = dict(sorted(stats.items(), key=lambda item: item[1], reverse=True))
    
    return {
        "total_files": total_files,
        "total_dirs": total_dirs,
        "extensions": sorted_stats
    }

def main():
    # Ensure stdout handles UTF-8 correctly, especially on Windows
    if hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8")
        except Exception:
            pass
            
    parser = argparse.ArgumentParser(description="Session Manager - AG Kit")
    parser.add_argument("action", choices=["status", "info"], help="Action to perform")
    parser.add_argument("path", nargs="?", default=None, help="Project root path")
    args = parser.parse_args()
    
    root = get_project_root(args.path)
    
    node_info = analyze_node_project(root)
    go_info = analyze_go_project(root)
    php_info = analyze_php_project(root)
    python_info = analyze_python_project(root)
    
    detected_projects = []
    if node_info and "error" not in node_info: detected_projects.append(("Node.js", node_info))
    if go_info and "error" not in go_info: detected_projects.append(("Go", go_info))
    if php_info and "error" not in php_info: detected_projects.append(("PHP", php_info))
    if python_info and "error" not in python_info: detected_projects.append(("Python", python_info))
    
    file_stats = scan_files(root)
    
    if args.action == "status":
        print("=" * 60)
        print(f"⚡ AG Session Status - Root: {root}")
        print("=" * 60)
        
        if not detected_projects:
            print("🔍 Tech Stack: Generic / Unknown")
        else:
            for lang, info in detected_projects:
                stack_str = f" [{', '.join(info['stack'])}]" if info['stack'] else ""
                print(f"📦 Tech Stack: {lang} (Project: {info['name']} v{info['version']}){stack_str}")
                
        print(f"📁 Workspace: {file_stats['total_files']} files, {file_stats['total_dirs']} directories")
        
        top_exts = list(file_stats['extensions'].items())[:3]
        if top_exts:
            ext_str = ", ".join([f"'{ext}': {count}" for ext, count in top_exts])
            print(f"📊 Top file types: {ext_str}")
        print("=" * 60)
        
    elif args.action == "info":
        output = {
            "root": str(root),
            "projects": {lang: info for lang, info in detected_projects},
            "files": file_stats
        }
        print(json.dumps(output, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
