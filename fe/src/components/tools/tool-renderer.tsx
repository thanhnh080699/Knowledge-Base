"use client"

import { toolRegistry } from "./registry"

interface Props {
  slug: string
}

export function ToolRenderer({ slug }: Props) {
  const ToolComponent = toolRegistry[slug]

  if (!ToolComponent) {
    return <p className="text-slate-600">Tool implementation coming soon.</p>
  }

  return <ToolComponent />
}
