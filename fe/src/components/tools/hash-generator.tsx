"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

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
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>
      <Button onClick={generate} variant="primary" disabled={!input}>
        Generate Hashes
      </Button>
      <div className="space-y-4">
        {["SHA-1", "SHA-256", "SHA-384", "SHA-512"].map((algo) => (
          <div key={algo} className="relative rounded-lg border border-slate-200 bg-slate-50 p-4 pt-8">
            <label className="absolute left-4 top-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">{algo}</label>
            <div className="min-h-[2.5rem] break-all rounded-md border border-slate-300 bg-white p-3 font-mono text-sm text-slate-800">
              {hashes[algo] || <span className="text-slate-400 italic">Click Generate to see hash</span>}
            </div>
            {hashes[algo] && (
              <Button
                onClick={() => copy(algo, hashes[algo])}
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 size-8 text-slate-400 hover:text-primary transition-colors"
              >
                {copied === algo ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
