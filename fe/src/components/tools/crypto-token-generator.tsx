"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, RefreshCw } from "lucide-react"

export function CryptoTokenGenerator() {
  const [token, setToken] = useState("")
  const [length, setLength] = useState(32)
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

    if (!chars) return

    let result = ""
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setToken(result)
    setCopied(false)
  }

  const copy = async () => {
    await navigator.clipboard.writeText(token)
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
            max={128}
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
        Generate Token
      </Button>
      <div className="relative rounded-lg border border-slate-200 bg-slate-50 p-4">
        <textarea
          value={token}
          readOnly
          rows={3}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm"
          placeholder="Click Generate to create token"
        />
        {token && (
          <Button
            onClick={copy}
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 size-8 text-slate-400 hover:text-primary transition-colors"
          >
            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          </Button>
        )}
      </div>
    </div>
  )
}
