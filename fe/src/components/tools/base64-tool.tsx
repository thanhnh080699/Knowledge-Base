"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/shared/copy-button"

export function Base64Tool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<"encode" | "decode">("encode")

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
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-500">Result</label>
          <div className="relative group">
            <textarea
              value={output}
              readOnly
              rows={4}
              className="w-full rounded-md border border-slate-300 bg-white p-3 pr-10 font-mono text-sm"
            />
            <CopyButton text={output} />
          </div>
        </div>
      )}
    </div>
  )
}
