"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"

export function CaseConverter() {
  const [input, setInput] = useState("")
  const [results, setResults] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState("")

  const convert = () => {
    setResults({
      camelCase: input.replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => i === 0 ? w.toLowerCase() : w.toUpperCase()).replace(/\s+/g, ""),
      PascalCase: input.replace(/(?:^\w|[A-Z]|\b\w)/g, w => w.toUpperCase()).replace(/\s+/g, ""),
      snake_case: input.toLowerCase().replace(/\s+/g, "_"),
      "kebab-case": input.toLowerCase().replace(/\s+/g, "-"),
      UPPER_CASE: input.toUpperCase().replace(/\s+/g, "_"),
      "lower case": input.toLowerCase(),
      "UPPER CASE": input.toUpperCase(),
    })
    setCopied("")
  }

  const copy = async (key: string, value: string) => {
    await navigator.clipboard.writeText(value)
    setCopied(key)
    setTimeout(() => setCopied(""), 2000)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Input Text</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to convert"
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>
      <Button onClick={convert} variant="primary" disabled={!input}>
        Convert
      </Button>
      <div className="grid gap-4 md:grid-cols-2">
        {["camelCase", "PascalCase", "snake_case", "kebab-case", "UPPER_CASE"].map((key) => (
          <div key={key} className="relative rounded-lg border border-slate-200 bg-slate-50 p-4">
            <label className="mb-2 block text-sm font-medium text-slate-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
            <div className="min-h-[2.5rem] w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm">
              {results[key] || <span className="text-slate-400">...</span>}
            </div>
            {results[key] && (
              <Button onClick={() => copy(key, results[key])} variant="ghost" size="sm" className="absolute right-3 top-3">
                <Copy size={16} />
                {copied === key ? "Copied!" : ""}
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
