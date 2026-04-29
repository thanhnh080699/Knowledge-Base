"use client"

import { Check, Copy } from "lucide-react"
import { useState } from "react"

export function CopyButton({ text }: { text: string }) {
  const [isCopied, setIsCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <button
      onClick={copy}
      className="absolute right-2 top-2 z-10 rounded-md border border-slate-700 bg-slate-800 p-1.5 text-slate-400 transition-all hover:bg-slate-700 hover:text-white"
      title="Copy code"
    >
      {isCopied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
    </button>
  )
}
