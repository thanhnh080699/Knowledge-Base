"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, RefreshCw } from "lucide-react"

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
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <input
          type="text"
          value={uuid}
          readOnly
          placeholder="Click Generate to create UUID"
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm"
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={generate} variant="primary">
          <RefreshCw size={16} />
          Generate UUID
        </Button>
        {uuid && (
          <Button onClick={copy} variant="outline">
            <Copy size={16} />
            {copied ? "Copied!" : "Copy"}
          </Button>
        )}
      </div>
    </div>
  )
}
