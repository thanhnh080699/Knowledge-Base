import { Github, Globe, Linkedin, Mail, MapPin, Phone, Clock, Youtube } from "lucide-react"
import Link from "next/link"
import type { SiteSettings } from "@/types/category"

const docLinks = [
  { href: "/docs", label: "Tài liệu kỹ thuật" },
  { href: "/docs?category=sysadmin", label: "Systems Administration" },
  { href: "/docs?category=devops", label: "DevOps" },
  { href: "/docs?category=helpdesk", label: "Helpdesk" }
]

const quickLinks = [
  { href: "/projects", label: "Dự án" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Liên hệ" }
]

function SocialIcon({ url, label, children }: { url: string; label: string; children: React.ReactNode }) {
  if (!url) return null
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex size-9 items-center justify-center rounded-md border border-slate-700 text-slate-400 transition-colors hover:border-blue-500 hover:text-blue-400">
      {children}
    </a>
  )
}

export function Footer({ settings }: { settings: SiteSettings }) {
  const currentYear = new Date().getFullYear()
  const siteName = settings.site_name || "Knowledge Base"

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      {/* Main footer */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-6">
        {/* Brand */}
        <div>
          <p className="text-lg font-bold text-white">{siteName}</p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-slate-400">
            Nền tảng chia sẻ tài liệu kỹ thuật mở, ghi chú thực chiến về vận hành hệ thống, DevOps và phát triển phần mềm dành cho cộng đồng.
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
          <p className="text-sm font-semibold uppercase tracking-wider text-white">Tài liệu</p>
          <div className="mt-4 grid gap-2.5">
            {docLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-slate-400 transition-colors hover:text-blue-400">
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Quick links */}
        <nav aria-label="Liên kết nhanh">
          <p className="text-sm font-semibold uppercase tracking-wider text-white">Khám phá</p>
          <div className="mt-4 grid gap-2.5">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-slate-400 transition-colors hover:text-blue-400">
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Contact info */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-white">Liên hệ</p>
          <div className="mt-4 grid gap-3 text-sm text-slate-400">
            {settings.contact_email && (
              <a href={`mailto:${settings.contact_email}`} className="flex items-center gap-2 transition-colors hover:text-blue-400">
                <Mail size={14} className="shrink-0" />
                <span>{settings.contact_email}</span>
              </a>
            )}
            {settings.contact_phone && (
              <a href={`tel:${settings.contact_phone}`} className="flex items-center gap-2 transition-colors hover:text-blue-400">
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
      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-slate-500 md:flex-row md:px-6">
          <p>© {currentYear} {siteName}. All rights reserved.</p>
          <p>Được xây dựng với Next.js, AdonisJS & Go — dành cho cộng đồng kỹ thuật.</p>
        </div>
      </div>
    </footer>
  )
}
