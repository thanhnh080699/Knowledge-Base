import {
  BookOpen,
  BriefcaseBusiness,
  Code2,
  Link2,
  Mail,
  Menu,
  Wrench,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { absoluteCdnUrl } from "@/lib/cdn-loader"
import type { Menu as SiteMenu, MenuItem } from "@/types/menu"

const fallbackNav: MenuItem[] = [
  {
    id: 1,
    menuId: 0,
    parentId: null,
    title: "Tài liệu",
    url: "/docs",
    type: "CUSTOM",
    referenceId: null,
    target: "_self",
    cssClass: "book-open",
    rel: null,
    sortOrder: 0,
  },
  {
    id: 2,
    menuId: 0,
    parentId: null,
    title: "Tools",
    url: "/tools",
    type: "CUSTOM",
    referenceId: null,
    target: "_self",
    cssClass: "wrench",
    rel: null,
    sortOrder: 1,
  },
  {
    id: 3,
    menuId: 0,
    parentId: null,
    title: "Dự án",
    url: "/projects",
    type: "CUSTOM",
    referenceId: null,
    target: "_self",
    cssClass: "code-2",
    rel: null,
    sortOrder: 2,
  },
  {
    id: 4,
    menuId: 0,
    parentId: null,
    title: "About Me",
    url: "/portfolio",
    type: "CUSTOM",
    referenceId: null,
    target: "_self",
    cssClass: "briefcase-business",
    rel: null,
    sortOrder: 3,
  },
  {
    id: 5,
    menuId: 0,
    parentId: null,
    title: "Liên hệ",
    url: "/contact",
    type: "CUSTOM",
    referenceId: null,
    target: "_self",
    cssClass: "mail",
    rel: null,
    sortOrder: 4,
  },
]

const iconByClass = {
  "book-open": BookOpen,
  wrench: Wrench,
  "code-2": Code2,
  "briefcase-business": BriefcaseBusiness,
  mail: Mail,
}

function orderedTopLevelItems(menu?: SiteMenu | null) {
  const items = menu?.items?.length ? menu.items : fallbackNav
  return [...items]
    .filter((item) => item.parentId === null)
    .sort((a, b) => a.sortOrder - b.sortOrder)
}

export function Header({
  siteName,
  logoUrl,
  menu,
}: {
  siteName?: string
  logoUrl?: string | null
  menu?: SiteMenu | null
}) {
  const displayName = siteName || "Knowledge Base"
  const nav = orderedTopLevelItems(menu)
  const mobileHref = nav[0]?.url || "/docs"

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-hairline)] bg-[var(--color-surface)]/95 backdrop-blur">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-[15px] font-medium text-[var(--color-ink)]"
        >
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
            <span className="flex size-9 items-center justify-center rounded-full border border-[var(--color-hairline-strong)] bg-[var(--color-primary)] !text-[var(--color-on-primary)]">
              {displayName.charAt(0).toUpperCase()}
            </span>
          )}
          <span>{displayName}</span>
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const Icon =
              iconByClass[item.cssClass as keyof typeof iconByClass] ?? Link2
            const href = item.url || "#"
            return (
              <Link
                key={item.id}
                href={href}
                target={item.target === "_blank" ? "_blank" : undefined}
                rel={
                  item.rel ??
                  (item.target === "_blank" ? "noopener noreferrer" : undefined)
                }
                className="inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-2 text-[15px] font-medium text-[var(--color-body)] transition-colors hover:border-[var(--color-hairline-strong)] hover:bg-white hover:text-[var(--color-ink)]"
              >
                <Icon size={16} aria-hidden />
                {item.title}
              </Link>
            )
          })}
        </div>
        <Link
          href={mobileHref}
          className="inline-flex items-center justify-center rounded-full border border-[var(--color-hairline-strong)] p-2 text-[var(--color-ink)] transition-colors hover:bg-white md:hidden"
          aria-label="Mở tài liệu"
        >
          <Menu size={20} aria-hidden />
        </Link>
      </nav>
    </header>
  )
}
