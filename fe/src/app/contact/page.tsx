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
    <main className="bg-slate-50">
      <section className="relative min-h-[500px] overflow-hidden border-b border-slate-200 bg-white">
        <Image
          src="/images/contact-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(248,250,252,0.98)_0%,rgba(248,250,252,0.9)_42%,rgba(248,250,252,0.3)_100%)]" />

        <div className="relative mx-auto flex min-h-[300px] max-w-7xl items-center px-4 py-16 md:px-6">
          <div className="max-w-2xl">
            <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-950 md:text-6xl">Liên hệ</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
              Gửi thông tin nhu cầu để trao đổi về website, dashboard quản trị, API hoặc deployment.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-20 max-w-6xl px-4 pb-16 md:px-6 md:pb-20" aria-label="Contact form">
        <Suspense fallback={<div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">Đang tải form...</div>}>
          <ContactForm settings={settings} />
        </Suspense>
      </section>
    </main>
  )
}
