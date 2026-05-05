"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"

export function JsonFormatter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const format = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, 2))
      setError("")
      setCopied(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON")
      setOutput("")
    }
  }

  const minify = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setError("")
      setCopied(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON")
      setOutput("")
    }
  }

  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Input JSON</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"key": "value"}'
          rows={8}
          className="w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm"
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={format} variant="primary">
          Format
        </Button>
        <Button onClick={minify} variant="outline">
          Minify
        </Button>
      </div>
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {output && (
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Output</label>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <textarea
              value={output}
              readOnly
              rows={8}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm"
            />
          </div>
          <Button onClick={copy} variant="outline" className="mt-2">
            <Copy size={16} />
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      )}
    </div>
  )
}
