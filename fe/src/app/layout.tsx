import type { Metadata } from "next"
import { Footer } from "@/components/shared/footer"
import { Header } from "@/components/shared/header"
import { SkipLink } from "@/components/shared/skip-link"
import { getMenu, getMenuByLocation, getSettings } from "@/lib/api"
import { absoluteCdnUrl } from "@/lib/cdn-loader"
import { ScrollToTop } from "@/components/shared/scroll-to-top"
import "./globals.css"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()

  return {
    title: {
      default: `${settings.site_name} — ${settings.site_description}`,
      template: `%s | ${settings.site_name}`,
    },
    description: settings.site_description,
    icons: settings.admin_favicon
      ? { icon: absoluteCdnUrl(settings.admin_favicon) }
      : undefined,
    openGraph: {
      title: settings.site_name,
      description: settings.site_description,
      type: "website",
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE_CODE,
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [settings, headerMenu, footerDocMenu, footerQuickMenu] =
    await Promise.all([
      getSettings(),
      getMenuByLocation("header"),
      getMenu("footer-documentation"),
      getMenu("footer-explore"),
    ])

  return (
    <html lang="vi" data-scroll-behavior="smooth">
      <body>
        <SkipLink />
        <Header
          siteName={settings.site_name}
          logoUrl={settings.admin_logo}
          menu={headerMenu}
        />
        {children}
        <Footer
          settings={settings}
          docMenu={footerDocMenu}
          quickMenu={footerQuickMenu}
        />
        <ScrollToTop />
      </body>
    </html>
  )
}
