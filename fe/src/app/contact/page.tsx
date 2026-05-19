import type { Metadata } from "next"
import Image from "next/image"
import { Suspense } from "react"
import { ContactForm } from "@/components/shared/contact-form"
import { getSettings } from "@/lib/api"

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Liên hệ trao đổi website, dashboard quản trị, API và DevOps.",
  openGraph: {
    title: "Liên hệ | thanhnh.id.vn",
    description: "Gửi yêu cầu liên hệ cho dự án web, API, CMS hoặc deployment."
  }
}

export default async function ContactPage() {
  const settings = await getSettings()

  return (
    <main className="bg-[var(--color-surface)]">
      <section className="relative min-h-[500px] overflow-hidden border-b border-[var(--color-hairline)] bg-[var(--color-surface)]">
        <Image
          src="/images/contact-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(245,245,245,0.98)_0%,rgba(245,245,245,0.9)_42%,rgba(245,245,245,0.38)_100%)]" />
        <div className="kb-orb kb-orb-sky bottom-0 right-[16%] h-72 w-72"></div>

        <div className="relative mx-auto flex min-h-[300px] max-w-7xl items-center px-4 py-16 md:px-6">
          <div className="max-w-2xl">
            <h1 className="kb-display-mega mt-4">Liên hệ</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[var(--color-body)] md:text-lg">
              Gửi thông tin nhu cầu để trao đổi về website, dashboard quản trị, API hoặc deployment.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-20 max-w-6xl px-4 pb-16 md:px-6 md:pb-20" aria-label="Contact form">
        <Suspense fallback={<div className="rounded-2xl border border-[var(--color-hairline)] bg-white p-5 text-sm text-[var(--color-body)]">Đang tải form...</div>}>
          <ContactForm settings={settings} />
        </Suspense>
      </section>
    </main>
  )
}
