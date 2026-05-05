"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"

export function UrlEncoder() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const [copied, setCopied] = useState(false)

  const process = () => {
    try {
      setOutput(mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input))
    } catch {
      setOutput("Error: Invalid input")
    }
    setCopied(false)
  }

  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={() => setMode("encode")} variant={mode === "encode" ? "primary" : "outline"}>
          Encode
        </Button>
        <Button onClick={() => setMode("decode")} variant={mode === "decode" ? "primary" : "outline"}>
          Decode
        </Button>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "encode" ? "Enter URL to encode" : "Enter encoded URL to decode"}
          rows={4}
          className="w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm"
        />
      </div>
      <Button onClick={process} variant="primary">
        {mode === "encode" ? "Encode" : "Decode"}
      </Button>
      {output && (
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Output</label>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <textarea
              value={output}
              readOnly
              rows={4}
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
