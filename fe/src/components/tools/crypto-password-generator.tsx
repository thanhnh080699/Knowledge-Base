"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, RefreshCw } from "lucide-react"

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

  const copy = async () => {
    await navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-slate-700 min-w-[80px]">Length: <span className="font-mono text-primary">{length}</span></label>
          <input
            type="range"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            min={8}
            max={64}
            className="w-48 accent-primary"
          />
        </div>
        <div className="flex flex-wrap items-center gap-4 border-l border-slate-200 pl-6">
          {Object.entries(options).map(([key, value]) => (
            <label key={key} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
                className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
              />
              <span className="text-sm capitalize text-slate-600">{key}</span>
            </label>
          ))}
        </div>
      </div>
      <Button onClick={generate} variant="primary">
        <RefreshCw size={16} />
        Generate Password
      </Button>
      <div className="relative rounded-lg border border-slate-200 bg-slate-50 p-4">
        <input
          type="text"
          value={password}
          readOnly
          placeholder="Click Generate to create password"
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm"
        />
        {password && (
          <Button
            onClick={copy}
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 size-8 text-slate-400 hover:text-primary transition-colors"
          >
            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          </Button>
        )}
      </div>
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
        <h3 className="mb-4 text-sm font-semibold text-slate-900">Check Password Strength</h3>
        <div className="space-y-4">
          <input
            type="text"
            onChange={(e) => setStrength(calculateStrength(e.target.value))}
            placeholder="Type a password to check its strength..."
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Strength:</span>
              <span className={`text-sm font-semibold ${strength.color || "text-slate-400"}`}>
                {strength.label || "Enter password"}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  strength.score <= 2
                    ? "bg-red-500"
                    : strength.score <= 4
                      ? "bg-yellow-500"
                      : "bg-green-500"
                }`}
                style={{ width: `${strength.label ? (strength.score / 7) * 100 : 0}%` }}
              />
            </div>
            <ul className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 mt-2">
              <li className="flex items-center gap-1">• Min 8 characters</li>
              <li className="flex items-center gap-1">• Uppercase & Lowercase</li>
              <li className="flex items-center gap-1">• Numbers</li>
              <li className="flex items-center gap-1">• Special characters</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
