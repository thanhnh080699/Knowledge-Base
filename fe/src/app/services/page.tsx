import type { Metadata } from "next"
import { ServiceCard } from "@/components/shared/service-card"
import { fallbackServices } from "@/lib/fallback-data"
import { getServices } from "@/lib/api"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Dịch vụ",
  description: "Dịch vụ lập trình web, dashboard quản trị và tư vấn DevOps.",
  openGraph: {
    title: "Dịch vụ | thanhnh.id.vn",
    description: "Dịch vụ lập trình web với Next.js, API, CMS và deployment."
  }
}

export default async function ServicesPage() {
  const servicesResponse = await getServices()
  const services = servicesResponse.length ? servicesResponse : fallbackServices

  return (
    <main className="mx-auto max-w-[1600px] px-4 py-10 md:px-6">
      <section className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Services</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Dịch vụ lập trình web</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Thiết kế, lập trình và triển khai website, dashboard quản trị, API và hạ tầng vận hành.
        </p>
      </section>
      <section className="grid gap-5 md:grid-cols-3" aria-label="Service packages">
        {services.map((service) => <ServiceCard key={service.id} service={service} />)}
      </section>
    </main>
  )
}
