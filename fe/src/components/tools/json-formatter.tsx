"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/shared/copy-button"

export function JsonFormatter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")

  const format = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, 2))
      setError("")
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
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON")
      setOutput("")
    }
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
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm focus:border-primary focus:ring-1 focus:ring-primary"
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
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 font-medium">
          {error}
        </div>
      )}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-500">Result</label>
        <div className="relative group">
          <textarea
            value={output}
            readOnly
            rows={10}
            className="w-full rounded-md border border-slate-300 bg-white p-3 pr-10 font-mono text-sm text-slate-800"
            placeholder="Formatted JSON will appear here"
          />
          {output && <CopyButton text={output} />}
        </div>
      </div>
    </div>
  )
}
