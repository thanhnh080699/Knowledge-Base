import type { Metadata } from "next"
import Link from "next/link"
import { Wrench } from "lucide-react"
import { getTools } from "@/lib/api"
import type { Tool } from "@/types/tool"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Tools",
  description: "Bộ công cụ hữu ích cho developer và IT professional.",
  openGraph: {
    title: "Tools | thanhnh.id.vn",
    description: "Các công cụ encode, decode, converter và generator."
  }
}

export default async function ToolsPage() {
  const response = await getTools({ limit: 100 })
  const tools = response.data

  const toolsByCategory = Array.from(new Set(tools.map(t => t.category === "Generator" ? "Crypto" : t.category)))
    .map(category => {
      const categoryTools = tools.filter(t => 
        (t.category === category) || (category === "Crypto" && t.category === "Generator")
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

  return (
    <main className="bg-[var(--color-surface)]">
      <section className="relative overflow-hidden border-b border-[var(--color-hairline)] bg-[var(--color-surface)]">
        <div className="kb-orb kb-orb-lavender right-[12%] top-0 h-64 w-64"></div>
        <div className="mx-auto max-w-[1600px] px-4 py-12 md:px-6">
          <div className="kb-eyebrow">
            <Wrench size={16} aria-hidden />
            Developer Tools
          </div>
          <h1 className="kb-display-xl mt-5">
            Công cụ hữu ích cho Developer
          </h1>
          <p className="mt-4 max-w-3xl text-base text-[var(--color-body)]">
            Bộ sưu tập các công cụ encode, decode, converter và generator giúp tăng năng suất làm việc.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 py-12 md:px-6">
        <div className="space-y-12">
          {toolsByCategory.map(({ category, tools: categoryTools }) => (
            <div key={category}>
              <h2 className="kb-display-sm mb-4">{category}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categoryTools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.slug}`}
                    className="kb-card group block"
                  >
                    <h3 className="font-medium text-[var(--color-ink)]">
                      {tool.name}
                    </h3>
                    {tool.description && (
                      <p className="mt-2 text-sm text-[var(--color-body)]">{tool.description}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
