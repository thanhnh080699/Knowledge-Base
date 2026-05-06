"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"

export function JwtDecoder() {
  const [token, setToken] = useState("")
  const [header, setHeader] = useState("")
  const [payload, setPayload] = useState("")
  const [error, setError] = useState("")
  const [copiedHeader, setCopiedHeader] = useState(false)
  const [copiedPayload, setCopiedPayload] = useState(false)

  const decode = () => {
    try {
      const parts = token.split(".")
      if (parts.length !== 3) throw new Error("Invalid JWT format")

      const headerDecoded = JSON.parse(atob(parts[0]))
      const payloadDecoded = JSON.parse(atob(parts[1]))

      setHeader(JSON.stringify(headerDecoded, null, 2))
      setPayload(JSON.stringify(payloadDecoded, null, 2))
      setError("")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JWT")
      setHeader("")
      setPayload("")
    }
  }

  const copyHeader = async () => {
    await navigator.clipboard.writeText(header)
    setCopiedHeader(true)
    setTimeout(() => setCopiedHeader(false), 2000)
  }

  const copyPayload = async () => {
    await navigator.clipboard.writeText(payload)
    setCopiedPayload(true)
    setTimeout(() => setCopiedPayload(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">JWT Token</label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          rows={3}
          className="w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm"
        />
      </div>
      <Button onClick={decode} variant="primary">
        Decode
      </Button>
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {header && (
        <div className="relative rounded-lg border border-slate-200 bg-slate-50 p-4">
          <label className="mb-2 block text-sm font-medium text-slate-700">Header</label>
          <pre className="rounded-lg border border-slate-300 bg-white p-4 text-sm overflow-auto">
            {header}
          </pre>
          <Button onClick={copyHeader} variant="ghost" size="sm" className="absolute right-3 top-3">
            <Copy size={14} />
            {copiedHeader ? "Copied!" : "Copy"}
          </Button>
        </div>
      )}
      {payload && (
        <div className="relative rounded-lg border border-slate-200 bg-slate-50 p-4">
          <label className="mb-2 block text-sm font-medium text-slate-700">Payload</label>
          <pre className="rounded-lg border border-slate-300 bg-white p-4 text-sm overflow-auto">
            {payload}
          </pre>
          <Button onClick={copyPayload} variant="ghost" size="sm" className="absolute right-3 top-3">
            <Copy size={14} />
            {copiedPayload ? "Copied!" : "Copy"}
          </Button>
        </div>
      )}
    </div>
  )
}
