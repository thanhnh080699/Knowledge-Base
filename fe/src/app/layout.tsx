import type { Metadata } from "next"
import { Footer } from "@/components/shared/footer"
import { Header } from "@/components/shared/header"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "thanhnh.id.vn - Tài liệu kỹ thuật, portfolio, dịch vụ web",
    template: "%s | thanhnh.id.vn"
  },
  description: "Website tài liệu kỹ thuật, portfolio cá nhân và dịch vụ lập trình web.",
  openGraph: {
    title: "thanhnh.id.vn",
    description: "Tài liệu kỹ thuật, portfolio và dịch vụ lập trình web.",
    type: "website"
  }
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
