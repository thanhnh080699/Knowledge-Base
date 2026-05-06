"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

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
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>
      <Button onClick={generate} variant="primary" disabled={!input}>
        Generate Slug
      </Button>
      <div className="relative rounded-lg border border-slate-200 bg-slate-50 p-4">
        <label className="mb-2 block text-sm font-medium text-slate-700">Result</label>
        <input
          type="text"
          value={slug}
          readOnly
          placeholder="URL-friendly slug will appear here"
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm"
        />
        {slug && (
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
  )
}
