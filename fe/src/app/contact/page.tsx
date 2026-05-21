import type { Metadata } from "next"
import Image from "next/image"
import { Mail, MessageSquareText, Send } from "lucide-react"
import { Suspense } from "react"
import { ContactForm } from "@/components/shared/contact-form"
import { HomeReveal } from "@/components/shared/home-motion"
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
      <section className="page-hero relative min-h-[500px]">
        <Image
          src="/images/home-contact-collab-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="home-hero-bg"
        />
        <div className="page-hero-overlay" />
        <div className="home-glow home-glow-sky bottom-0 right-[16%] h-72 w-72"></div>

        <div className="relative z-10 mx-auto grid min-h-[500px] max-w-7xl items-center gap-8 px-4 py-16 md:px-6 lg:grid-cols-[1fr_0.72fr]">
          <HomeReveal>
            <div className="kb-eyebrow w-fit">
              <Mail size={16} aria-hidden />
              Contact
            </div>
            <h1 className="kb-display-mega mt-4">Liên hệ</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[var(--color-body)] md:text-lg">
              Gửi thông tin nhu cầu để trao đổi về website, dashboard quản trị, API hoặc deployment.
            </p>
          </HomeReveal>
          <HomeReveal delay={0.1}>
            <div className="page-visual-panel">
              <div className="grid gap-3">
                <div className="page-visual-chip">
                  <span>Email</span>
                  <strong>{settings.contact_email || "nguyenhuythanh0806@gmail.com"}</strong>
                  <Mail size={16} aria-hidden />
                </div>
                <div className="page-visual-chip">
                  <span>Brief</span>
                  <strong>Website / API / CMS</strong>
                  <MessageSquareText size={16} aria-hidden />
                </div>
                <div className="page-visual-chip">
                  <span>Response</span>
                  <strong>{settings.working_hours || "Mon - Fri"}</strong>
                  <Send size={16} aria-hidden />
                </div>
              </div>
            </div>
          </HomeReveal>
        </div>
      </section>

      <HomeReveal className="relative z-10 mx-auto -mt-20 max-w-6xl px-4 pb-16 md:px-6 md:pb-20" aria-label="Contact form">
        <Suspense fallback={<div className="rounded-2xl border border-[var(--color-hairline)] bg-white p-5 text-sm text-[var(--color-body)]">Đang tải form...</div>}>
          <ContactForm settings={settings} />
        </Suspense>
      </HomeReveal>
    </main>
  )
}
