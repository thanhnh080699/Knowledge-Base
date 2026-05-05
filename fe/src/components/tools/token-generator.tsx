"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, RefreshCw } from "lucide-react"

export function TokenGenerator() {
  const [token, setToken] = useState("")
  const [length, setLength] = useState(32)
  const [copied, setCopied] = useState(false)

  const generate = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
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
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Token Length</label>
        <input
          type="number"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          min={8}
          max={128}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <textarea
          value={token}
          readOnly
          placeholder="Click Generate to create token"
          rows={3}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm"
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={generate} variant="primary">
          <RefreshCw size={16} />
          Generate Token
        </Button>
        {token && (
          <Button onClick={copy} variant="outline">
            <Copy size={16} />
            {copied ? "Copied!" : "Copy"}
          </Button>
        )}
      </div>
    </div>
  )
}
