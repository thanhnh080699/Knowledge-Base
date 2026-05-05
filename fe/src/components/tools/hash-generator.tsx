"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"

export function HashGenerator() {
  const [input, setInput] = useState("")
  const [hashes, setHashes] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState("")

  const generate = async () => {
    const encoder = new TextEncoder()
    const data = encoder.encode(input)

    const results: Record<string, string> = {}

    for (const algo of ["SHA-1", "SHA-256", "SHA-384", "SHA-512"]) {
      const hashBuffer = await crypto.subtle.digest(algo, data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      results[algo] = hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
    }

    setHashes(results)
    setCopied("")
  }

  const copy = async (algo: string, hash: string) => {
    await navigator.clipboard.writeText(hash)
    setCopied(algo)
    setTimeout(() => setCopied(""), 2000)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Input Text</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to hash"
          rows={4}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>
      <Button onClick={generate} variant="primary" disabled={!input}>
        Generate Hashes
      </Button>
      {Object.keys(hashes).length > 0 && (
        <div className="space-y-3">
          {Object.entries(hashes).map(([algo, hash]) => (
            <div key={algo} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold text-slate-700">{algo}</span>
                <Button onClick={() => copy(algo, hash)} variant="outline" size="sm">
                  <Copy size={14} />
                  {copied === algo ? "Copied!" : "Copy"}
                </Button>
              </div>
              <code className="block break-all rounded bg-white p-2 text-xs text-slate-800">
                {hash}
              </code>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
