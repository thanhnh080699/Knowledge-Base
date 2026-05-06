"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, RefreshCw } from "lucide-react"

export function UuidGenerator() {
  const [uuid, setUuid] = useState("")
  const [copied, setCopied] = useState(false)

  const generate = () => {
    setUuid(crypto.randomUUID())
    setCopied(false)
  }

  const copy = async () => {
    await navigator.clipboard.writeText(uuid)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <Button onClick={generate} variant="primary">
        <RefreshCw size={16} />
        Generate UUID
      </Button>
      <div className="relative rounded-lg border border-slate-200 bg-slate-50 p-4">
        <label className="mb-2 block text-sm font-medium text-slate-700">Result (UUID v4)</label>
        <input
          type="text"
          value={uuid}
          readOnly
          placeholder="Click Generate to create UUID"
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm"
        />
        {uuid && (
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
