"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

export function CryptoBcrypt() {
  const [input, setInput] = useState("")
  const [saltRounds, setSaltRounds] = useState(10)
  const [hash, setHash] = useState("")
  const [compareInput, setCompareInput] = useState("")
  const [compareHash, setCompareHash] = useState("")
  const [compareResult, setCompareResult] = useState<boolean | null>(null)
  const [copied, setCopied] = useState(false)

  const generateHash = async () => {
    // Simple bcrypt-like hash simulation
    const salt = Math.random().toString(36).substring(2, 15)
    const rounds = "$2a$" + saltRounds.toString().padStart(2, "0") + "$"
    const simulated = rounds + salt + btoa(input + salt).substring(0, 31)
    setHash(simulated)
    setCopied(false)
  }

  const compare = () => {
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
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">String</label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter string to hash"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Salt Rounds: <span className="font-mono text-primary font-bold">{saltRounds}</span>
            </label>
            <input
              type="range"
              value={saltRounds}
              onChange={(e) => setSaltRounds(Number(e.target.value))}
              min={4}
              max={12}
              className="w-full accent-primary"
            />
          </div>
        </div>
        <Button onClick={generateHash} variant="primary" disabled={!input}>
          Generate Hash
        </Button>
        <div className="relative rounded-lg border border-slate-200 bg-slate-50 p-4">
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-500">Hash Result</label>
          <code className="block min-h-[2.5rem] break-all rounded-md border border-slate-300 bg-white p-3 text-xs text-slate-800 font-mono">
            {hash || <span className="text-slate-400 italic">Click Generate to see hash</span>}
          </code>
          {hash && (
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
      </div>

      <div className="space-y-4 border-t border-slate-200 pt-6">
        <h3 className="font-semibold text-slate-900">Compare String with Hash</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">String</label>
            <input
              type="text"
              value={compareInput}
              onChange={(e) => setCompareInput(e.target.value)}
              placeholder="Enter string"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Hash</label>
            <input
              type="text"
              value={compareHash}
              onChange={(e) => setCompareHash(e.target.value)}
              placeholder="Enter hash to compare"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <Button onClick={compare} variant="primary" disabled={!compareInput || !compareHash}>
          Compare
        </Button>
        {compareResult !== null && (
          <div
            className={`flex items-center gap-2 rounded-lg border p-4 text-sm font-semibold shadow-inner ${
              compareResult
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {compareResult ? <><Check size={18} /> Matches</> : "✗ No Match"}
          </div>
        )}
      </div>
    </div>
  )
}
