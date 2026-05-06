"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

export function XmlFormatter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const format = () => {
    try {
      let formatted = ""
      const reg = /(>)(<)(\/*)/g
      const xml = input.replace(reg, "$1\r\n$2$3")
      let pad = 0
      xml.split("\r\n").forEach((node) => {
        let indent = 0
        if (node.match(/.+<\/\w[^>]*>$/)) {
          indent = 0
        } else if (node.match(/^<\/\w/)) {
          if (pad !== 0) pad -= 1
        } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
          indent = 1
        } else {
          indent = 0
        }

        let padding = ""
        for (let i = 0; i < pad; i++) padding += "  "
        formatted += padding + node + "\r\n"
        pad += indent
      })
      setOutput(formatted.trim())
      setError("")
      setCopied(false)
    } catch (e) {
      setError("Invalid XML")
      setOutput("")
    }
  }

  const minify = () => {
    try {
      const minified = input.replace(/>\s+</g, "><").trim()
      setOutput(minified)
      setError("")
      setCopied(false)
    } catch (e) {
      setError("Invalid XML")
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
        <label className="mb-2 block text-sm font-medium text-slate-700">Input XML</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="<root><child>text</child></root>"
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
      <div className="relative rounded-lg border border-slate-200 bg-slate-50 p-4">
        <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-500">Result</label>
        <textarea
          value={output}
          readOnly
          rows={10}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-800"
          placeholder="Formatted XML will appear here"
        />
        {output && (
          <Button
            onClick={copy}
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 size-8 text-slate-400 hover:text-primary transition-colors"
          >
            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          </Button>
        )}
      </div>
    </div>
  )
}
