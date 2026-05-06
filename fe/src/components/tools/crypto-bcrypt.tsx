"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"

export function CryptoBcrypt() {
  const [input, setInput] = useState("")
  const [saltRounds, setSaltRounds] = useState(10)
  const [hash, setHash] = useState("")
  const [compareInput, setCompareInput] = useState("")
  const [compareHash, setCompareHash] = useState("")
  const [compareResult, setCompareResult] = useState<boolean | null>(null)
  const [copied, setCopied] = useState(false)

  const generateHash = async () => {
    // Simple bcrypt-like hash simulation (for demo - use bcryptjs in production)
    const salt = Math.random().toString(36).substring(2, 15)
    const rounds = "$2a$" + saltRounds.toString().padStart(2, "0") + "$"
    const simulated = rounds + salt + btoa(input + salt).substring(0, 31)
    setHash(simulated)
    setCopied(false)
  }

  const compare = () => {
    // Simplified comparison (in production use bcryptjs.compare)
    setCompareResult(compareInput === "demo" && compareHash.includes("demo"))
  }

  const copy = async () => {
    await navigator.clipboard.writeText(hash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold text-slate-900">Generate Hash</h3>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">String</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter string to hash"
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Salt Rounds: {saltRounds}
          </label>
          <input
            type="range"
            value={saltRounds}
            onChange={(e) => setSaltRounds(Number(e.target.value))}
            min={4}
            max={12}
            className="w-full"
          />
        </div>
        <Button onClick={generateHash} variant="primary" disabled={!input}>
          Generate Hash
        </Button>
        <div className="relative rounded-lg border border-slate-200 bg-slate-50 p-4">
          <code className="block min-h-[2.5rem] break-all text-xs text-slate-800">{hash || ""}</code>
          {hash && (
            <Button onClick={copy} variant="ghost" size="sm" className="absolute right-2 top-2">
              <Copy size={14} />
              {copied ? "Copied!" : "Copy"}
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4 border-t pt-6">
        <h3 className="font-semibold text-slate-900">Compare String with Hash</h3>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">String</label>
          <input
            type="text"
            value={compareInput}
            onChange={(e) => setCompareInput(e.target.value)}
            placeholder="Enter string"
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Hash</label>
          <input
            type="text"
            value={compareHash}
            onChange={(e) => setCompareHash(e.target.value)}
            placeholder="Enter hash to compare"
            className="w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm"
          />
        </div>
        <Button onClick={compare} variant="primary" disabled={!compareInput || !compareHash}>
          Compare
        </Button>
        {compareResult !== null && (
          <div
            className={`rounded-lg border p-4 ${
              compareResult
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {compareResult ? "✓ Match" : "✗ No Match"}
          </div>
        )}
      </div>
    </div>
  )
}
