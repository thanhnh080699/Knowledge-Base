import {
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Clock,
  Youtube,
} from "lucide-react"
import Link from "next/link"
import type { SiteSettings } from "@/types/category"
import type { Menu as SiteMenu, MenuItem } from "@/types/menu"

const fallbackDocLinks: MenuItem[] = [
  {
    id: 1,
    menuId: 0,
    parentId: null,
    title: "Tài liệu kỹ thuật",
    url: "/docs",
    type: "CUSTOM",
    referenceId: null,
    target: "_self",
    cssClass: null,
    rel: null,
    sortOrder: 0,
  },
  {
    id: 2,
    menuId: 0,
    parentId: null,
    title: "Systems Administration",
    url: "/docs?category=sysadmin",
    type: "CUSTOM",
    referenceId: null,
    target: "_self",
    cssClass: null,
    rel: null,
    sortOrder: 1,
  },
  {
    id: 3,
    menuId: 0,
    parentId: null,
    title: "DevOps",
    url: "/docs?category=devops",
    type: "CUSTOM",
    referenceId: null,
    target: "_self",
    cssClass: null,
    rel: null,
    sortOrder: 2,
  },
  {
    id: 4,
    menuId: 0,
    parentId: null,
    title: "Helpdesk",
    url: "/docs?category=helpdesk",
    type: "CUSTOM",
    referenceId: null,
    target: "_self",
    cssClass: null,
    rel: null,
    sortOrder: 3,
  },
]

const fallbackQuickLinks: MenuItem[] = [
  {
    id: 5,
    menuId: 0,
    parentId: null,
    title: "Dự án",
    url: "/projects",
    type: "CUSTOM",
    referenceId: null,
    target: "_self",
    cssClass: null,
    rel: null,
    sortOrder: 0,
  },
  {
    id: 6,
    menuId: 0,
    parentId: null,
    title: "About Me",
    url: "/portfolio",
    type: "CUSTOM",
    referenceId: null,
    target: "_self",
    cssClass: null,
    rel: null,
    sortOrder: 1,
  },
  {
    id: 7,
    menuId: 0,
    parentId: null,
    title: "Liên hệ",
    url: "/contact",
    type: "CUSTOM",
    referenceId: null,
    target: "_self",
    cssClass: null,
    rel: null,
    sortOrder: 2,
  },
]

function orderedTopLevelItems(
  menu: SiteMenu | null | undefined,
  fallback: MenuItem[],
) {
  const items = menu?.items?.length ? menu.items : fallback
  return [...items]
    .filter((item) => item.parentId === null)
    .sort((a, b) => a.sortOrder - b.sortOrder)
}

function SocialIcon({
  url,
  label,
  children,
}: {
  url: string
  label: string
  children: React.ReactNode
}) {
  if (!url) return null
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex size-9 items-center justify-center rounded-full border border-[var(--color-hairline)] bg-white text-[var(--color-body)] transition-colors hover:border-[var(--color-hairline-strong)] hover:text-[var(--color-ink)]"
    >
      {children}
    </a>
  )
}

export function Footer({
  settings,
  docMenu,
  quickMenu,
}: {
  settings: SiteSettings
  docMenu?: SiteMenu | null
  quickMenu?: SiteMenu | null
}) {
  const currentYear = new Date().getFullYear()
  const siteName = settings.site_name || "Knowledge Base"
  const docLinks = orderedTopLevelItems(docMenu, fallbackDocLinks)
  const quickLinks = orderedTopLevelItems(quickMenu, fallbackQuickLinks)

  return (
    <footer className="border-t border-[var(--color-hairline)] bg-[var(--color-surface)] text-[var(--color-body)]">
      {/* Main footer */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-6">
        {/* Brand */}
        <div>
          <p className="font-display text-2xl font-normal text-[var(--color-ink)]">
            {siteName}
          </p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-[var(--color-body)]">
            Nền tảng chia sẻ tài liệu kỹ thuật mở, ghi chú thực chiến về vận
            hành hệ thống, DevOps và phát triển phần mềm dành cho cộng đồng.
          </p>

          {/* Social links */}
          <div className="mt-5 flex gap-2">
            <SocialIcon url={settings.social_github} label="GitHub">
              <Github size={16} />
            </SocialIcon>
            <SocialIcon url={settings.social_linkedin} label="LinkedIn">
              <Linkedin size={16} />
            </SocialIcon>
            <SocialIcon url={settings.social_youtube} label="YouTube">
              <Youtube size={16} />
            </SocialIcon>
            <SocialIcon url={settings.social_facebook} label="Facebook">
              <Globe size={16} />
            </SocialIcon>
          </div>
        </div>

        {/* Documentation links */}
        <nav aria-label="Tài liệu">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-ink)]">
            Tài liệu
          </p>
          <div className="mt-4 grid gap-2.5">
            {docLinks.map((link) => (
              <Link
                key={link.id}
                href={link.url || "#"}
                target={link.target === "_blank" ? "_blank" : undefined}
                rel={
                  link.rel ??
                  (link.target === "_blank" ? "noopener noreferrer" : undefined)
                }
                className="text-sm text-[var(--color-body)] transition-colors hover:text-[var(--color-ink)]"
              >
                {link.title}
              </Link>
            ))}
          </div>
        </nav>

        {/* Quick links */}
        <nav aria-label="Liên kết nhanh">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-ink)]">
            Khám phá
          </p>
          <div className="mt-4 grid gap-2.5">
            {quickLinks.map((link) => (
              <Link
                key={link.id}
                href={link.url || "#"}
                target={link.target === "_blank" ? "_blank" : undefined}
                rel={
                  link.rel ??
                  (link.target === "_blank" ? "noopener noreferrer" : undefined)
                }
                className="text-sm text-[var(--color-body)] transition-colors hover:text-[var(--color-ink)]"
              >
                {link.title}
              </Link>
            ))}
          </div>
        </nav>

        {/* Contact info */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-ink)]">
            Liên hệ
          </p>
          <div className="mt-4 grid gap-3 text-sm text-[var(--color-body)]">
            {settings.contact_email && (
              <a
                href={`mailto:${settings.contact_email}`}
                className="flex items-center gap-2 transition-colors hover:text-[var(--color-ink)]"
              >
                <Mail size={14} className="shrink-0" />
                <span>{settings.contact_email}</span>
              </a>
            )}
            {settings.contact_phone && (
              <a
                href={`tel:${settings.contact_phone}`}
                className="flex items-center gap-2 transition-colors hover:text-[var(--color-ink)]"
              >
                <Phone size={14} className="shrink-0" />
                <span>{settings.contact_phone}</span>
              </a>
            )}
            {settings.contact_address && (
              <span className="flex items-center gap-2">
                <MapPin size={14} className="shrink-0" />
                <span>{settings.contact_address}</span>
              </span>
            )}
            {settings.working_hours && (
              <span className="flex items-center gap-2">
                <Clock size={14} className="shrink-0" />
                <span>{settings.working_hours}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--color-hairline)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-[var(--color-muted)] md:flex-row md:px-6">
          <p>
            © {currentYear} {siteName}. All rights reserved.
          </p>
          <p>
            Được xây dựng với Next.js, AdonisJS & Go — dành cho cộng đồng kỹ
            thuật.
          </p>
        </div>
      </div>
    </footer>
  )
}
