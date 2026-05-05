"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, RefreshCw } from "lucide-react"

export function PasswordGenerator() {
  const [password, setPassword] = useState("")
  const [length, setLength] = useState(16)
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  })
  const [copied, setCopied] = useState(false)

  const generate = () => {
    let chars = ""
    if (options.uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (options.lowercase) chars += "abcdefghijklmnopqrstuvwxyz"
    if (options.numbers) chars += "0123456789"
    if (options.symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?"

    let result = ""
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(result)
    setCopied(false)
  }

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
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <input
          type="text"
          value={password}
          readOnly
          placeholder="Click Generate"
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm"
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={generate} variant="primary">
          <RefreshCw size={16} />
          Generate
        </Button>
        {password && (
          <Button onClick={copy} variant="outline">
            <Copy size={16} />
            {copied ? "Copied!" : "Copy"}
          </Button>
        )}
      </div>
    </div>
  )
}
