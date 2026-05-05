"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"

export function SlugGenerator() {
  const [input, setInput] = useState("")
  const [slug, setSlug] = useState("")
  const [copied, setCopied] = useState(false)

  const generate = () => {
    const result = input
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
    setSlug(result)
    setCopied(false)
  }

  const copy = async () => {
    await navigator.clipboard.writeText(slug)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Input Text</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to convert to slug"
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>
      <Button onClick={generate} variant="primary" disabled={!input}>
        Generate Slug
      </Button>
      {slug && (
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Slug</label>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <input
              type="text"
              value={slug}
              readOnly
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
