'use client'

import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import {
  Globe2,
  Languages,
  Mail,
  Palette,
  Phone,
  Search,
  Settings,
  Share2,
  KeyRound,
} from 'lucide-react'

type SettingItem = {
  title: string
  description: string
  href: string
  icon: LucideIcon
}

type SettingSection = {
  title: string
  items: SettingItem[]
}

const sections: SettingSection[] = [
  {
    title: 'Common',
    items: [
      {
        title: 'General',
        description: 'View and update your general settings',
        href: '/settings/overview',
        icon: Settings,
      },
      {
        title: 'Email',
        description: 'View and update your email settings',
        href: '/settings/email',
        icon: Mail,
      },
      {
        title: 'Contact',
        description: 'View and update your contact information',
        href: '/settings/contact',
        icon: Phone,
      },
      {
        title: 'Languages',
        description: 'View and update your website languages',
        href: '/settings/languages',
        icon: Languages,
      },
      {
        title: 'Admin appearance',
        description: 'View and update logo, favicon, layout and theme',
        href: '/settings/admin-appearance',
        icon: Palette,
      },
      {
        title: 'Sitemap',
        description: 'Manage sitemap configuration',
        href: '/settings/sitemap',
        icon: Share2,
      },
      {
        title: 'API Tokens',
        description: 'Create access tokens for automation, content and marketing data',
        href: '/settings/api-tokens',
        icon: KeyRound,
      },
    ],
  },
  {
    title: 'Others',
    items: [
      {
        title: 'Google Analytics',
        description: 'Connect and track Google Analytics directly in CMS',
        href: '/settings/others/google-analytics',
        icon: Globe2,
      },
      {
        title: 'Google Search Console',
        description: 'Monitor search performance, queries, and indexing',
        href: '/settings/others/google-search-console',
        icon: Search,
      },
    ],
  },
]

export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Dashboard
          </Link>
          <span className="text-[var(--app-muted)]">/</span>
          <span className="text-[var(--app-muted-strong)]">Settings</span>
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <section key={section.title} className="overflow-hidden rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-sm">
              <div className="border-b border-[var(--app-border)] px-5 py-4">
                <h3 className="text-base font-semibold text-[var(--foreground)]">{section.title}</h3>
              </div>
              <div className="grid gap-x-10 gap-y-5 p-5 md:grid-cols-2 xl:grid-cols-3">
                {section.items.map((item) => (
                  <SettingLink key={`${section.title}-${item.title}`} item={item} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}

function SettingLink({ item }: { item: SettingItem }) {
  const Icon = item.icon

  return (
    <Link href={item.href} className="group flex min-h-14 gap-4 rounded-md p-0.5 transition-colors hover:bg-[var(--app-surface-hover)]">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--app-surface-muted)] text-[var(--app-muted)] ring-1 ring-inset ring-[var(--app-border)] group-hover:text-blue-600">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-blue-600 group-hover:text-blue-700">{item.title}</span>
        <span className="mt-0.5 block text-sm leading-5 text-[var(--app-muted)]">{item.description}</span>
      </span>
    </Link>
  )
}
