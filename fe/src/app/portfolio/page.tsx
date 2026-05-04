import { ArrowRight, BriefcaseBusiness, CheckCircle2, Code2, GraduationCap, Server, ShieldCheck } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Thông tin cá nhân, kinh nghiệm, học vấn và tech stack của thanhnh.",
  openGraph: {
    title: "Portfolio | thanhnh.id.vn",
    description: "Portfolio cá nhân về SysAdmin, DevOps và Development."
  }
}

const stack = ["Linux", "Docker", "Kubernetes", "AdonisJS", "Next.js", "TypeScript", "MariaDB", "Go", "Nginx"]
const skills = ["System administration", "CI/CD pipeline", "REST API design", "CMS dashboard", "SEO technical", "Production deployment"]
const timeline = [
  { icon: BriefcaseBusiness, title: "Phát triển ứng dụng web", text: "Xây dựng API, CMS và frontend cho website nội dung, portfolio và workflow quản trị." },
  { icon: Server, title: "SysAdmin / DevOps", text: "Vận hành Linux server, reverse proxy, backup, monitoring và Docker deployment." },
  { icon: GraduationCap, title: "Học và chuẩn hóa liên tục", text: "Ghi chép, chuẩn hóa tài liệu và chuyển hóa kinh nghiệm thành checklist có thể tái sử dụng." }
]
const highlights = [
  { label: "Frontend", value: "Next.js, Tailwind CSS", icon: Code2 },
  { label: "Backend", value: "AdonisJS, REST API", icon: BriefcaseBusiness },
  { label: "Operations", value: "Linux, Docker, Nginx", icon: Server },
  { label: "Security", value: "ACL, upload flow, hardening", icon: ShieldCheck }
]

export default function PortfolioPage() {
  return (
    <main className="bg-slate-50">
      <section className="relative min-h-[500px] overflow-hidden border-b border-slate-200 bg-white">
        <Image
          src="/images/portfolio-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(248,250,252,0.99)_0%,rgba(248,250,252,0.92)_43%,rgba(248,250,252,0.34)_100%)]" />

        <div className="relative mx-auto flex min-h-[500px] max-w-7xl items-center px-4 py-16 md:px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Portfolio</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-950 md:text-6xl">Thanh Nguyen</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
              Developer tập trung vào website nội dung, dashboard quản trị, API và hệ thống deployment gọn, dễ vận hành.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/contact" variant="primary">
                Trao đổi dự án <ArrowRight size={16} aria-hidden />
              </Button>
              <Button href="/projects" variant="outline">Xem dự án</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-20 max-w-6xl px-4 pb-16 md:px-6 md:pb-20">
        <div className="grid overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="border-b border-slate-200 bg-slate-50 p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <div className="flex size-24 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-3xl font-bold text-blue-600" aria-label="Avatar thanhnh">
              TN
            </div>
            <h2 className="mt-5 text-2xl font-bold text-slate-950">Developer / SysAdmin</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Kết hợp phát triển sản phẩm web với kinh nghiệm vận hành server để xây dựng hệ thống dễ bàn giao, dễ mở rộng và dễ debug.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {stack.map((item) => <Badge key={item} tone="slate">{item}</Badge>)}
            </div>
          </aside>

          <div className="p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">Capabilities</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-950">Năng lực triển khai</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {highlights.map((item) => (
                <article key={item.label} className="rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-blue-600">
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-blue-100 bg-blue-50 text-blue-600">
                      <item.icon size={18} aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-950">{item.label}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{item.value}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <section className="mt-10">
          <div>
            <Badge tone="slate">Timeline</Badge>
            <h2 className="mt-3 text-3xl font-bold text-slate-950">Kinh nghiệm chính</h2>
          </div>
          <div className="mt-5 grid gap-4">
            {timeline.map((item) => {
              const Icon = item.icon
              return (
                <article key={item.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-blue-600">
                  <div className="flex gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-blue-600">
                      <Icon size={18} aria-hidden />
                    </span>
                    <div>
                      <h2 className="text-lg font-bold text-slate-950">{item.title}</h2>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{item.text}</p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="mt-10">
          <div>
            <Badge tone="slate">Skills</Badge>
            <h2 className="mt-3 text-3xl font-bold text-slate-950">Kỹ năng thực chiến</h2>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {skills.map((skill) => (
              <article key={skill} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-blue-600">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden />
                <h2 className="mt-4 text-base font-bold text-slate-950">{skill}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">Thực hành theo hướng rõ ràng, có tài liệu và ưu tiên khả năng bảo trì.</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}
