"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"

export function Base64Tool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const [copied, setCopied] = useState(false)

  const process = () => {
    try {
      if (mode === "encode") {
        setOutput(btoa(input))
      } else {
        setOutput(atob(input))
      }
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
        <Button
          onClick={() => setMode("encode")}
          variant={mode === "encode" ? "primary" : "outline"}
        >
          Encode
        </Button>
        <Button
          onClick={() => setMode("decode")}
          variant={mode === "decode" ? "primary" : "outline"}
        >
          Decode
        </Button>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "encode" ? "Enter text to encode" : "Enter Base64 to decode"}
          rows={4}
          className="w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm"
        />
      </div>
      <Button onClick={process} variant="primary">
        {mode === "encode" ? "Encode" : "Decode"}
      </Button>
      {output && (
        <div className="relative rounded-lg border border-slate-200 bg-slate-50 p-4">
          <label className="mb-2 block text-sm font-medium text-slate-700">Result</label>
          <textarea
            value={output}
            readOnly
            rows={4}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm"
          />
          <Button onClick={copy} variant="ghost" size="sm" className="absolute right-3 top-3">
            <Copy size={14} />
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      )}
    </div>
  )
}
