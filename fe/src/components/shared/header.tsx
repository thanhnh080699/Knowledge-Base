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
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6" aria-label="Main navigation">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-950">
          {logoUrl ? (
            <Image
              src={absoluteCdnUrl(logoUrl)}
              alt={displayName}
              width={32}
              height={32}
              className="size-9 rounded-md object-contain"
              unoptimized
            />
          ) : (
            <span className="flex size-9 items-center justify-center rounded-md border border-blue-600 bg-blue-600 text-white">{displayName.charAt(0).toUpperCase()}</span>
          )}
          <span>{displayName}</span>
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href} className="inline-flex items-center gap-2 rounded-md border border-transparent px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-600 hover:text-blue-600">
                <Icon size={16} aria-hidden />
                {item.label}
              </Link>
            )
          })}
        </div>
        <Link href="/docs" className="inline-flex items-center justify-center rounded-md border border-slate-300 p-2 text-slate-700 transition-colors hover:border-blue-600 hover:text-blue-600 md:hidden" aria-label="Mở tài liệu">
          <Menu size={20} aria-hidden />
        </Link>
      </nav>
    </header>
  )
}
