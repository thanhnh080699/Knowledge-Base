"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, RefreshCw } from "lucide-react"

export function LoremIpsum() {
  const [text, setText] = useState("")
  const [paragraphs, setParagraphs] = useState(3)
  const [copied, setCopied] = useState(false)

  const lorem = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.",
  ]

  const generate = () => {
    const result = Array.from({ length: paragraphs }, (_, i) => lorem[i % lorem.length]).join("\n\n")
    setText(result)
    setCopied(false)
  }

  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Paragraphs: {paragraphs}</label>
        <input
          type="range"
          value={paragraphs}
          onChange={(e) => setParagraphs(Number(e.target.value))}
          min={1}
          max={10}
          className="w-full"
        />
      </div>
      <Button onClick={generate} variant="primary">
        <RefreshCw size={16} />
        Generate
      </Button>
      {text && (
        <div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <textarea
              value={text}
              readOnly
              rows={10}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
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
