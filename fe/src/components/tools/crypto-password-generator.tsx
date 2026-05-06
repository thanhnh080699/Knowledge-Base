"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Copy, RefreshCw } from "lucide-react"

export function CryptoPasswordGenerator() {
  const [password, setPassword] = useState("")
  const [length, setLength] = useState(16)
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  })
  const [copied, setCopied] = useState(false)
  const [strength, setStrength] = useState({ score: 0, label: "", color: "" })

  const calculateStrength = (pwd: string) => {
    let score = 0
    if (pwd.length >= 8) score += 1
    if (pwd.length >= 12) score += 1
    if (pwd.length >= 16) score += 1
    if (/[a-z]/.test(pwd)) score += 1
    if (/[A-Z]/.test(pwd)) score += 1
    if (/[0-9]/.test(pwd)) score += 1
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 1

    if (score <= 2) return { score, label: "Weak", color: "text-red-600" }
    if (score <= 4) return { score, label: "Medium", color: "text-yellow-600" }
    if (score <= 6) return { score, label: "Strong", color: "text-green-600" }
    return { score, label: "Very Strong", color: "text-green-700" }
  }

  const generate = () => {
    let chars = ""
    if (options.uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (options.lowercase) chars += "abcdefghijklmnopqrstuvwxyz"
    if (options.numbers) chars += "0123456789"
    if (options.symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?"

    if (!chars) return

    let result = ""
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(result)
    setStrength(calculateStrength(result))
    setCopied(false)
  }

  useEffect(() => {
    generate()
  }, [])

  const copy = async () => {
    await navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Length: {length}</label>
        <input
          type="range"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          min={8}
          max={64}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        {Object.entries(options).map(([key, value]) => (
          <label key={key} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
              className="size-4"
            />
            <span className="text-sm capitalize text-slate-700">{key}</span>
          </label>
        ))}
      </div>
      <div className="relative rounded-lg border border-slate-200 bg-slate-50 p-4">
        <input
          type="text"
          value={password}
          readOnly
          placeholder="Generated password will appear here"
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm"
        />
        {password && (
          <Button onClick={copy} variant="ghost" size="sm" className="absolute right-6 top-6">
            <Copy size={16} />
            {copied ? "Copied!" : "Copy"}
          </Button>
        )}
      </div>
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">Password Strength:</span>
          <span className={`text-sm font-semibold ${strength.color || "text-slate-400"}`}>
            {strength.label || "N/A"}
          </span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
          <div
            className={`h-2 rounded-full transition-all ${
              strength.score <= 2
                ? "bg-red-500"
                : strength.score <= 4
                  ? "bg-yellow-500"
                  : "bg-green-500"
            }`}
            style={{ width: `${(strength.score / 7) * 100}%` }}
          />
        </div>
      </div>
      <Button onClick={generate} variant="primary">
        <RefreshCw size={16} />
        Refresh
      </Button>
    </div>
  )
}
