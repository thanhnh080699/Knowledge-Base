'use client'

import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import {
  Bell,
  Box,
  Brush,
  CircleDollarSign,
  Code2,
  Database,
  Folder,
  Gauge,
  Globe2,
  Languages,
  Link2,
  Mail,
  MailCheck,
  MapPin,
  Monitor,
  Package,
  Palette,
  Phone,
  Search,
  Settings,
  Share2,
  ShoppingCart,
  SlidersHorizontal,
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
        description: 'View and update your general settings and activate license',
        href: '/dashboard/settings/overview',
        icon: Settings,
      },
      {
        title: 'Email',
        description: 'View and update your email settings and email templates',
        href: '/dashboard/settings/email',
        icon: Mail,
      },
      {
        title: 'Email templates',
        description: 'Email templates using HTML and system variables.',
        href: '/dashboard/settings/email-templates',
        icon: MailCheck,
      },
      {
        title: 'Email rules',
        description: 'Configure email rules for validation',
        href: '/dashboard/settings/email-rules',
        icon: Bell,
      },
      {
        title: 'Phone Number',
        description: 'Configure phone number field settings',
        href: '/dashboard/settings/phone-number',
        icon: Phone,
      },
      {
        title: 'Media',
        description: 'View and update your media settings',
        href: '/dashboard/settings/media',
        icon: Folder,
      },
      {
        title: 'Permalink',
        description: 'View and update your permalink settings',
        href: '/dashboard/settings/permalink',
        icon: Link2,
      },
      {
        title: 'Languages',
        description: 'View and update your website languages',
        href: '/dashboard/settings/languages',
        icon: Languages,
      },
      {
        title: 'Admin appearance',
        description: 'View and update logo, favicon, layout and theme',
        href: '/dashboard/settings/admin-appearance',
        icon: Palette,
      },
      {
        title: 'API Settings',
        description: 'View and update your API settings',
        href: '/dashboard/settings/api',
        icon: Code2,
      },
      {
        title: 'Cache',
        description: 'Configure caching for optimized speed',
        href: '/dashboard/settings/cache',
        icon: Box,
      },
      {
        title: 'Datatables',
        description: 'Settings for datatables',
        href: '/dashboard/settings/datatables',
        icon: Database,
      },
      {
        title: 'Website Tracking',
        description: 'Choose analytics and tracking method for your website',
        href: '/dashboard/settings/website-tracking',
        icon: Globe2,
      },
      {
        title: 'Optimize',
        description: 'Minify HTML output, inline CSS and remove comments',
        href: '/dashboard/settings/optimize',
        icon: Gauge,
      },
      {
        title: 'Sitemap',
        description: 'Manage sitemap configuration',
        href: '/dashboard/settings/sitemap',
        icon: Share2,
      },
    ],
  },
  {
    title: 'Localization',
    items: [
      {
        title: 'Locales',
        description: 'View, download and import locales',
        href: '/dashboard/settings/locales',
        icon: Globe2,
      },
      {
        title: 'Theme Translations',
        description: 'Manage the theme translations',
        href: '/dashboard/settings/theme-translations',
        icon: Languages,
      },
      {
        title: 'Other Translations',
        description: 'Manage the other translations for admin and plugins',
        href: '/dashboard/settings/other-translations',
        icon: Brush,
      },
    ],
  },
  {
    title: 'Ecommerce',
    items: [
      {
        title: 'General',
        description: 'Store name, company info, contact details and notifications',
        href: '/dashboard/settings/ecommerce',
        icon: SlidersHorizontal,
      },
      {
        title: 'Currencies',
        description: 'Currency formats, exchange rates and separators',
        href: '/dashboard/settings/currencies',
        icon: CircleDollarSign,
      },
      {
        title: 'Store locators',
        description: 'View and update the lists of your chains',
        href: '/dashboard/settings/store-locators',
        icon: MapPin,
      },
      {
        title: 'Products',
        description: 'Stock display, SKU generation and product specifications',
        href: '/dashboard/settings/products',
        icon: Package,
      },
      {
        title: 'Product Search',
        description: 'Search behavior, filters and price range filtering',
        href: '/dashboard/settings/product-search',
        icon: Search,
      },
      {
        title: 'Digital Products',
        description: 'Downloadable products, license codes and guest checkout',
        href: '/dashboard/settings/digital-products',
        icon: Monitor,
      },
      {
        title: 'Checkout',
        description: 'Checkout flow, validation and order placement settings',
        href: '/dashboard/settings/checkout',
        icon: ShoppingCart,
      },
    ],
  },
]

export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
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
