"use client"

import { Check, Copy } from "lucide-react"
import { useState } from "react"

interface CopyButtonProps {
  text: string
  className?: string
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false)

  const copy = async () => {
    if (!text) return
    await navigator.clipboard.writeText(text)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <button
      onClick={copy}
      type="button"
      className={
        className ||
        "absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white/90 text-slate-500 shadow-xs backdrop-blur-xs transition-all hover:bg-white hover:text-slate-800 hover:border-slate-300 cursor-pointer"
      }
      title="Copy content"
      aria-label="Copy content"
    >
      {isCopied ? <Check size={14} className="text-emerald-500 font-bold" /> : <Copy size={14} />}
    </button>
  )
}
