import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Service } from "@/types/service"

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-blue-600">
      <p className="text-sm font-semibold text-blue-600">{service.category ?? "Web Development"}</p>
      <h2 className="mt-2 text-xl font-bold text-slate-950">{service.name}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{service.description ?? "Tư vấn, thiết kế và triển khai theo nhu cầu hệ thống."}</p>
      <p className="mt-4 text-sm font-semibold text-red-500">from {service.priceRange ?? "liên hệ"}</p>
      <ul className="mt-4 grid gap-2 text-sm text-slate-700">
        {(service.features ?? []).map((feature) => (
          <li key={feature} className="flex gap-2">
            <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={16} aria-hidden />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button href={`/contact?service=${encodeURIComponent(service.name)}`} className="mt-5 w-full">
        Liên hệ ngay
      </Button>
    </article>
  )
}
