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
      className="absolute right-2 top-2 z-10 rounded-full border border-[var(--color-surface-dark-elevated)] bg-[var(--color-surface-dark-elevated)] p-1.5 text-white/70 transition-all hover:text-white"
      title="Copy code"
    >
      {isCopied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
    </button>
  )
}
