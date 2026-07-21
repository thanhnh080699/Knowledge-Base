"use client"

import { useEffect } from "react"
import { toolRegistry } from "./registry"

interface Props {
  slug: string
}

const RECENT_TOOLS_KEY = "kb_recently_used_tools"

export function ToolRenderer({ slug }: Props) {
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_TOOLS_KEY)
      const list: string[] = stored ? JSON.parse(stored) : []
      const updated = [slug, ...list.filter((s) => s !== slug)].slice(0, 6)
      localStorage.setItem(RECENT_TOOLS_KEY, JSON.stringify(updated))
    } catch {
      // Ignore localStorage errors
    }
  }, [slug])

  const ToolComponent = toolRegistry[slug]

  if (!ToolComponent) {
    return <p className="text-slate-600">Tool implementation coming soon.</p>
  }

  return (
    <div className="tool-workspace">
      <ToolComponent />
    </div>
  )
}
