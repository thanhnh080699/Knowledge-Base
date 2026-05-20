import { BookOpen, BriefcaseBusiness, Code2, Mail, Menu, Wrench } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { absoluteCdnUrl } from "@/lib/cdn-loader"

const nav = [
  { href: "/docs", label: "Tài liệu", icon: BookOpen },
  { href: "/tools", label: "Tools", icon: Wrench },
  { href: "/portfolio", label: "Portfolio", icon: BriefcaseBusiness },
  { href: "/projects", label: "Dự án", icon: Code2 },
  { href: "/contact", label: "Liên hệ", icon: Mail }
]

export function Header({ siteName, logoUrl }: { siteName?: string; logoUrl?: string | null }) {
  const displayName = siteName || "Knowledge Base"

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-hairline)] bg-[var(--color-surface)]/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6" aria-label="Main navigation">
        <Link href="/" className="flex items-center gap-2 text-[15px] font-medium text-[var(--color-ink)]">
          {logoUrl ? (
            <Image
              src={absoluteCdnUrl(logoUrl)}
              alt={displayName}
              width={32}
              height={32}
              className="size-9 rounded-full object-contain"
              unoptimized
            />
          ) : (
            <span className="flex size-9 items-center justify-center rounded-full border border-[var(--color-hairline-strong)] bg-[var(--color-primary)] !text-[var(--color-on-primary)]">{displayName.charAt(0).toUpperCase()}</span>
          )}
          <span>{displayName}</span>
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href} className="inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-2 text-[15px] font-medium text-[var(--color-body)] transition-colors hover:border-[var(--color-hairline-strong)] hover:bg-white hover:text-[var(--color-ink)]">
                <Icon size={16} aria-hidden />
                {item.label}
              </Link>
            )
          })}
        </div>
        <Link href="/docs" className="inline-flex items-center justify-center rounded-full border border-[var(--color-hairline-strong)] p-2 text-[var(--color-ink)] transition-colors hover:bg-white md:hidden" aria-label="Mở tài liệu">
          <Menu size={20} aria-hidden />
        </Link>
      </nav>
    </header>
  )
}
