import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/providers/toast-provider";
import { absoluteCdnUrl } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  let icon: string | undefined;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api";
    const response = await fetch(`${apiUrl.replace(/\/$/, "")}/settings/public`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      const { data } = (await response.json()) as {
        data?: { admin_favicon?: string | null; admin_logo?: string | null };
      };
      icon = absoluteCdnUrl(data?.admin_favicon || data?.admin_logo) || undefined;
    }
  } catch {
    // Keep the CMS accessible when public settings are temporarily unavailable.
  }

  return {
    title: "CMS - thanhnh.id.vn",
    description: "Content Management System",
    icons: icon ? { icon } : undefined,
  };
}

const themeScript = `
(() => {
  try {
    const storedTheme = JSON.parse(localStorage.getItem('theme-storage') || '{}')?.state?.theme || 'system';
    const resolvedTheme = storedTheme === 'dark' || (storedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ? 'dark'
      : 'light';
    const root = document.documentElement;

    root.dataset.theme = resolvedTheme;
    root.style.colorScheme = resolvedTheme;
  } catch {
    const resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.style.colorScheme = resolvedTheme;
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {themeScript}
        </Script>
      </head>
      <body className="min-h-full flex flex-col bg-[var(--app-bg)] text-[var(--foreground)]">
        <ThemeProvider>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
