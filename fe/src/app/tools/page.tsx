import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { CalendarClock, KeyRound, Code2, Wrench } from "lucide-react"
import { HomeReveal } from "@/components/shared/home-motion"
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

const categoryIcons: Record<string, typeof Wrench> = {
  "Cron & Date Convert": CalendarClock,
  Crypto: KeyRound,
  Developer: Code2
}

export default async function ToolsPage() {
  const response = await getTools({ limit: 100 })
  const tools = response.data

  const toolsByCategory = Array.from(new Set(tools.map(t => t.category === "Generator" ? "Crypto" : t.category)))
    .map(category => {
      const categoryTools = tools.filter(t =>
        (t.category === category) || (category === "Crypto" && t.category === "Generator")
      )

      const uniqueToolsMap = new Map<string, Tool>()
      categoryTools.forEach(tool => {
        const existing = uniqueToolsMap.get(tool.name)
        if (!existing || (tool.slug.startsWith("crypto-") && !existing.slug.startsWith("crypto-"))) {
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
      <section className="page-hero">
        <div className="home-glow home-glow-lavender right-[12%] top-0 h-64 w-64"></div>
        <div className="home-glow home-glow-peach bottom-0 left-[8%] h-72 w-72"></div>
        <div className="relative z-10 mx-auto grid max-w-[1600px] gap-8 px-4 py-12 md:px-6 lg:grid-cols-[1fr_0.72fr] lg:py-16">
          <HomeReveal>
            <div className="kb-eyebrow w-fit">
              <Wrench size={16} aria-hidden />
              Developer Tools
            </div>
            <h1 className="kb-display-xl mt-5">
              Công cụ nhỏ cho thao tác kỹ thuật hằng ngày
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-body)]">
              Bộ công cụ encode, decode, converter, formatter và generator giúp xử lý nhanh các việc nhỏ khi debug, viết tài liệu hoặc chuẩn bị cấu hình.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <KeyRound size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[var(--color-ink)]">Mã hóa</h4>
                  <p className="text-xs text-[var(--color-muted)]">Base64, MD5, SHA-256</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-50 text-pink-600">
                  <CalendarClock size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[var(--color-ink)]">Thời gian & Cron</h4>
                  <p className="text-xs text-[var(--color-muted)]">Timestamp, Cron parser</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
                  <Code2 size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[var(--color-ink)]">Định dạng</h4>
                  <p className="text-xs text-[var(--color-muted)]">JSON, XML, SQL Parser</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-[var(--color-muted)]">
              <span className="font-medium text-[var(--color-body)]">Từ khóa phổ biến:</span>
              {[
                { name: "Base64 Encoder", slug: "base64-encoder-decoder" },
                { name: "Cron Builder", slug: "cron-builder" },
                { name: "Timestamp", slug: "timestamp-converter" },
                { name: "UUID Generator", slug: "uuid-generator" },
                { name: "JSON Formatter", slug: "json-formatter" },
                { name: "SQL Format", slug: "sql-formatter" }
              ].map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/tools/${tag.slug}`}
                  className="rounded-full bg-[var(--color-surface-strong)] px-2.5 py-1 font-medium hover:text-[var(--color-ink)] transition-colors cursor-pointer"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </HomeReveal>
          <HomeReveal delay={0.1} className="hidden md:block">
            <div className="page-visual-panel page-visual-panel-clean flex items-center justify-center">
              <Image
                src="/images/tools.svg"
                alt="Developer Tools Illustration"
                width={280}
                height={280}
                priority
                unoptimized
                className="h-auto w-auto object-contain max-h-[220px] lg:max-h-[360px] max-w-[220px] lg:max-w-[360px]"
              />
            </div>
          </HomeReveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 py-12 md:px-6">
        <div className="space-y-12">
          {toolsByCategory.map(({ category, tools: categoryTools }, groupIndex) => (
            <HomeReveal key={category} delay={Math.min(groupIndex * 0.04, 0.16)}>
              <div>
                <h2 className="kb-display-sm mb-4">{category}</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {categoryTools.map((tool) => (
                    <Link
                      key={tool.id}
                      href={`/tools/${tool.slug}`}
                      className="kb-card page-motion-card group block"
                    >
                      <h3 className="font-medium text-[var(--color-ink)]">
                        {tool.name}
                      </h3>
                      {tool.description && (
                        <p className="mt-2 text-sm leading-6 text-[var(--color-body)]">{tool.description}</p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </HomeReveal>
          ))}
        </div>
      </section>
    </main>
  )
}
