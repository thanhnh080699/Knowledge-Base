"use client"

import Link from "next/link"
import { ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"
import type { Tool } from "@/types/tool"

interface Props {
  tools: Tool[]
  currentSlug: string
}

export function ToolSidebar({ tools, currentSlug }: Props) {
  const toolsByCategory = Array.from(new Set(tools.map(t => t.category === "Generator" ? "Crypto" : t.category)))
    .map(category => {
      const categoryTools = tools.filter(t => 
        ((t.category === category) || (category === "Crypto" && t.category === "Generator")) && 
        t.status === "PUBLISHED"
      )
      
      // Deduplicate by name, preferring slugs with 'crypto-'
      const uniqueToolsMap = new Map<string, Tool>()
      categoryTools.forEach(tool => {
        const existing = uniqueToolsMap.get(tool.name)
        if (!existing || (tool.slug.startsWith('crypto-') && !existing.slug.startsWith('crypto-'))) {
          uniqueToolsMap.set(tool.name, tool)
        }
      })

      return {
        category,
        tools: Array.from(uniqueToolsMap.values())
      }
    })
    .sort((a, b) => {
      const order = ["Cron & Date Convert", "Crypto", "Developer", "Encoder", "Converter", "Text"]
      const indexA = order.indexOf(a.category)
      const indexB = order.indexOf(b.category)
      if (indexA !== -1 && indexB !== -1) return indexA - indexB
      if (indexA !== -1) return -1
      if (indexB !== -1) return 1
      return 0
    })

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(toolsByCategory.map(c => c.category))
  )

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  return (
    <aside className="w-64 flex-shrink-0">
      <div className="sticky top-4 rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4">
          <h2 className="font-semibold text-slate-900">Tools</h2>
        </div>
        <nav className="p-2">
          {toolsByCategory.map(({ category, tools: categoryTools }) => (
            <div key={category} className="mb-2">
              <button
                onClick={() => toggleCategory(category)}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {expandedCategories.has(category) ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
                {category}
              </button>
              {expandedCategories.has(category) && (
                <div className="ml-4 mt-1 space-y-1">
                  {categoryTools.map((tool) => (
                    <Link
                      key={tool.id}
                      href={`/tools/${tool.slug}`}
                      className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                        tool.slug === currentSlug
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  )
}
