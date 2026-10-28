import {
  BookOpen,
  BriefcaseBusiness,
  Code2,
  GitFork,
  Link2,
  Mail,
  Wrench,
} from "lucide-react"
import { MobileNavigation } from "./mobile-navigation"
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
  "git-fork": GitFork,
}

function orderedTopLevelItems(menu?: SiteMenu | null) {
  const source = menu?.items?.length ? menu.items : fallbackNav
  const primary = [
    { title: "Tài liệu IT", url: "/docs", cssClass: "book-open" },
    { title: "Tools", url: "/tools", cssClass: "wrench" },
    { title: "Top Repos", url: "/repos", cssClass: "git-fork" },
  ]
  const primaryItems = primary.map((item, index) => ({
    ...fallbackNav[0],
    ...source.find(candidate => candidate.url === item.url),
    ...item,
    id: -100 - index,
    parentId: null,
    target: "_self",
    sortOrder: index,
  }))
  const secondaryItems = source
    .filter(item => item.parentId === null && !primary.some(primaryItem => primaryItem.url === item.url) && !/top[ -]?repos/i.test(item.title))
    .sort((a, b) => a.sortOrder - b.sortOrder)
  return [...primaryItems, ...secondaryItems]
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
        <div className="hidden items-center gap-1 lg:flex">
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
                className={`inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-2 text-[14px] transition-colors hover:border-[var(--color-hairline-strong)] hover:bg-white hover:text-[var(--color-ink)] ${item.id <= -100 && item.id >= -102 ? "font-semibold text-[var(--color-ink)]" : "font-normal text-[var(--color-muted)]"}`}
              >
                <Icon size={16} aria-hidden />
                {item.title}
              </Link>
            )
          })}
        </div>
        <MobileNavigation>
          {nav.map((item) => {
            const Icon = iconByClass[item.cssClass as keyof typeof iconByClass] ?? Link2
            return (
              <Link
                key={item.id}
                href={item.url || "#"}
                target={item.target === "_blank" ? "_blank" : undefined}
                rel={item.rel ?? (item.target === "_blank" ? "noopener noreferrer" : undefined)}
                className="flex min-h-11 items-center gap-3 rounded-lg px-3 py-3 text-[15px] font-medium text-[var(--color-body)] hover:bg-white hover:text-[var(--color-ink)]"
              >
                <Icon size={18} aria-hidden />
                {item.title}
              </Link>
            )
          })}
        </MobileNavigation>
      </nav>
    </header>
  )
}
