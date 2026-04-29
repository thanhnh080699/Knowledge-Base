import { BriefcaseBusiness, GraduationCap, Server } from "lucide-react"
import type { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { SectionTitle } from "@/components/ui/typography"

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

export default function PortfolioPage() {
  return (
    <main className="mx-auto max-w-[1600px] px-4 py-10 md:px-6">
      <section className="grid gap-6 md:grid-cols-[320px_1fr]">
        <Card className="p-6">
          <div className="flex size-28 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-4xl font-bold text-blue-600" aria-label="Avatar thanhnh">
            TN
          </div>
          <h1 className="mt-5 text-3xl font-bold text-slate-950">Thanh Nguyen</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Developer tập trung vào website nội dung, dashboard quản trị, API và hệ thống deployment gọn, dễ vận hành.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {stack.map((item) => <Badge key={item} tone="slate">{item}</Badge>)}
          </div>
        </Card>

        <section>
          <SectionTitle>Timeline</SectionTitle>
          <div className="mt-5 grid gap-4">
            {timeline.map((item) => {
              const Icon = item.icon
              return (
                <article key={item.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
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
      </section>

      <section className="mt-10">
        <SectionTitle>Skills</SectionTitle>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {skills.map((skill) => (
            <article key={skill} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-blue-600">
              <h2 className="text-base font-bold text-slate-950">{skill}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Thực hành theo hướng rõ ràng, có tài liệu và ưu tiên khả năng bảo trì.</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
