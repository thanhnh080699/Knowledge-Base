import type { Metadata } from "next"
import localFont from "next/font/local"
import { Footer } from "@/components/shared/footer"
import { Header } from "@/components/shared/header"
import { SkipLink } from "@/components/shared/skip-link"
import { getMenu, getMenuByLocation, getSettings } from "@/lib/api"
import { absoluteCdnUrl } from "@/lib/cdn-loader"
import { ScrollToTop } from "@/components/shared/scroll-to-top"
import "./globals.css"

const inter = localFont({ src: "./fonts/inter-latin-vietnamese.woff2", weight: "400 700", display: "swap", preload: false, variable: "--font-inter", fallback: ["Arial"], adjustFontFallback: "Arial" })
const garamond = localFont({ src: "./fonts/garamond-latin-vietnamese.woff2", weight: "400", display: "swap", variable: "--font-garamond", fallback: ["Times New Roman"], adjustFontFallback: "Times New Roman" })

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()

  return {
    title: {
      default: `${settings.site_name} — ${settings.site_description}`,
      template: `%s | ${settings.site_name}`,
    },
    alternates: {
      types: { "application/rss+xml": "/rss.xml" },
    },
    description: settings.site_description,
    icons: settings.admin_favicon
      ? { icon: { url: `/_next/image?url=${encodeURIComponent(absoluteCdnUrl(settings.admin_favicon))}&w=48&q=75`, sizes: "48x48" } }
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
    <html lang="vi" data-scroll-behavior="smooth" className={`${inter.variable} ${garamond.variable}`}>
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
