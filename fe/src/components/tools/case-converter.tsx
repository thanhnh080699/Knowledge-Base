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
      {Object.keys(results).length > 0 && (
        <div className="space-y-2">
          {Object.entries(results).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <span className="w-32 text-sm font-medium text-slate-700">{key}</span>
              <code className="flex-1 rounded bg-white px-2 py-1 text-sm">{value}</code>
              <Button onClick={() => copy(key, value)} variant="outline" size="sm">
                <Copy size={14} />
                {copied === key ? "✓" : ""}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
