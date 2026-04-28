import { Mail, MapPin } from "lucide-react"
import type { Metadata } from "next"
import { Suspense } from "react"
import { ContactForm } from "@/components/shared/contact-form"
import { Card } from "@/components/ui/card"
import { fallbackServices } from "@/lib/fallback-data"
import { getServices } from "@/lib/api"

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Liên hệ tư vấn lập trình web, dashboard quản trị và DevOps.",
  openGraph: {
    title: "Liên hệ | thanhnh.id.vn",
    description: "Gửi yêu cầu liên hệ cho dịch vụ lập trình web."
  }
}

export default async function ContactPage() {
  const servicesResponse = await getServices()
  const services = servicesResponse.length ? servicesResponse : fallbackServices

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-[0.8fr_1.2fr] md:px-6">
      <section>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Contact</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Liên hệ</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Gửi thông tin nhu cầu để trao đổi về website, dashboard quản trị, API hoặc deployment.
        </p>
        <div className="mt-6 grid gap-4">
          <Card className="p-5">
            <div className="flex gap-3">
              <Mail className="text-blue-600" size={20} aria-hidden />
              <div>
                <h2 className="font-bold text-slate-950">Email</h2>
                <p className="text-sm text-slate-600">contact@thanhnh.id.vn</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex gap-3">
              <MapPin className="text-blue-600" size={20} aria-hidden />
              <div>
                <h2 className="font-bold text-slate-950">Location</h2>
                <p className="text-sm text-slate-600">Viet Nam</p>
              </div>
            </div>
          </Card>
        </div>
      </section>
      <section aria-label="Contact form">
        <Suspense fallback={<div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">Đang tải form...</div>}>
          <ContactForm services={services} />
        </Suspense>
      </section>
    </main>
  )
}
