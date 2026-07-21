import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { CalendarClock, KeyRound, Code2, Wrench } from "lucide-react"
import { HomeReveal } from "@/components/shared/home-motion"
import { getTools } from "@/lib/api"
import { ToolsCatalog } from "@/components/tools/tools-catalog"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Tools - Công cụ Kỹ thuật cho Developer",
  description: "Bộ công cụ hữu ích cho developer và IT professional: Bcrypt hash, JSON formatter, Base64, Timestamp, UUID, SQL prettify.",
  openGraph: {
    title: "Tools | thanhnh.id.vn",
    description: "Các công cụ encode, decode, converter và generator trực quan, dễ sử dụng."
  }
}

export default async function ToolsPage() {
  const response = await getTools({ limit: 100 })
  const tools = response.data

  return (
    <main className="bg-[var(--color-surface)] min-h-screen">
      <section className="page-hero border-b border-[var(--color-hairline)]">
        <div className="home-glow home-glow-lavender right-[12%] top-0 h-64 w-64"></div>
        <div className="home-glow home-glow-peach bottom-0 left-[8%] h-72 w-72"></div>
        <div className="relative z-10 mx-auto grid max-w-[1600px] gap-8 px-4 py-12 md:px-6 lg:grid-cols-[1fr_0.72fr] lg:py-16">
          <HomeReveal>
            <div className="kb-eyebrow w-fit">
              <Wrench size={16} aria-hidden />
              Developer Tools Hub
            </div>
            <h1 className="kb-display-xl mt-5">
              Công cụ kỹ thuật hằng ngày cho Developer
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-body)]">
              Bộ công cụ encode, decode, converter, formatter và generator trực quan giúp xử lý nhanh công việc khi debug, mã hóa mật khẩu, viết tài liệu hoặc định dạng cấu hình.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex items-center gap-3 rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-3.5 shadow-xs">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                  <KeyRound size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[var(--color-ink)]">Mã hóa &amp; Security</h4>
                  <p className="text-xs text-[var(--color-muted)]">Bcrypt (Cost 12), Base64, SHA</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-3.5 shadow-xs">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-50 text-pink-600 dark:bg-pink-950/50 dark:text-pink-400">
                  <CalendarClock size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[var(--color-ink)]">Thời gian &amp; Cron</h4>
                  <p className="text-xs text-[var(--color-muted)]">Unix Timestamp, Cron Parser</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-3.5 shadow-xs">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400">
                  <Code2 size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[var(--color-ink)]">Định dạng &amp; Parse</h4>
                  <p className="text-xs text-[var(--color-muted)]">JSON, XML, SQL Formatter</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-[var(--color-muted)]">
              <span className="font-medium text-[var(--color-body)]">Từ khóa phổ biến:</span>
              {[
                { name: "Bcrypt 12", slug: "crypto-bcrypt" },
                { name: "Base64 Encoder", slug: "base64-encoder-decoder" },
                { name: "Cron Builder", slug: "cron-builder" },
                { name: "Unix Timestamp", slug: "timestamp-converter" },
                { name: "UUID Generator", slug: "uuid-generator" },
                { name: "JSON Formatter", slug: "json-formatter" },
                { name: "SQL Formatter", slug: "sql-formatter" }
              ].map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/tools/${tag.slug}`}
                  className="rounded-full border border-[var(--color-hairline)] bg-[var(--color-surface-strong)] px-3 py-1 font-medium hover:border-[var(--color-brand)]/40 hover:text-[var(--color-ink)] transition-colors cursor-pointer"
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

      <section className="mx-auto max-w-[1600px] px-4 py-10 md:px-6">
        <ToolsCatalog initialTools={tools} />
      </section>
    </main>
  )
}
