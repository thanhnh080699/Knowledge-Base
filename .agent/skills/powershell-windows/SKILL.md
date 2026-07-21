---
name: powershell-windows
description: PowerShell Windows patterns. Critical pitfalls, operator syntax, error handling.
when_to_use: "When working on Windows systems, writing PowerShell scripts, or using Windows-specific commands. NOT for macOS/Linux."
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# PowerShell Windows Patterns

> Critical patterns and pitfalls for Windows PowerShell.

---

## 1. Operator Syntax Rules

### CRITICAL: Parentheses Required

| ❌ Wrong | ✅ Correct |
|----------|-----------|
| `if (Test-Path "a" -or Test-Path "b")` | `if ((Test-Path "a") -or (Test-Path "b"))` |
| `if (Get-Item $x -and $y -eq 5)` | `if ((Get-Item $x) -and ($y -eq 5))` |

**Rule:** Each cmdlet call MUST be in parentheses when using logical operators.

---

## 2. Unicode/Emoji Restriction

### CRITICAL: No Unicode in Scripts

| Purpose | ❌ Don't Use | ✅ Use |
|---------|-------------|--------|
| Success | ✅ ✓ | [OK] [+] |
| Error | ❌ ✗ 🔴 | [!] [X] |
| Warning | ⚠️ 🟡 | [*] [WARN] |
| Info | ℹ️ 🔵 | [i] [INFO] |
| Progress | ⏳ | [...] |

**Rule:** Use ASCII characters only in PowerShell scripts.

---

## 3. Null Check Patterns

### Always Check Before Access

| ❌ Wrong | ✅ Correct |
|----------|-----------|
| `$array.Count -gt 0` | `$array -and $array.Count -gt 0` |
| `$text.Length` | `if ($text) { $text.Length }` |

---

## 4. String Interpolation

### Complex Expressions

| ❌ Wrong | ✅ Correct |
|----------|-----------|
| `"Value: $($obj.prop.sub)"` | Store in variable first |

**Pattern:**
```powershell
$value = $obj.prop.sub
Write-Output "Value: $value"
```

---

## 5. Error Handling

### ErrorActionPreference

| Value | Use |
|-------|-----|
| Stop | Terminates execution on error |
| Continue | Continues execution but shows error |
| SilentlyContinue | Continues silently on error |
