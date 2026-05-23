import { ArrowRight, BriefcaseBusiness, CheckCircle2, Code2, GraduationCap, Server, ShieldCheck } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HomeReveal } from "@/components/shared/home-motion"

export const metadata: Metadata = {
  title: "About Me",
  description: "Thông tin cá nhân, kinh nghiệm, học vấn và tech stack của thanhnh.",
  openGraph: {
    title: "About Me | thanhnh.id.vn",
    description: "Câu chuyện triển khai sản phẩm về SysAdmin, DevOps và Development."
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
    <main className="bg-[var(--color-surface)]">
      <section className="page-hero relative min-h-[500px]">
        <Image
          src="/images/home-portfolio-profile-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="home-hero-bg"
        />
        <div className="page-hero-overlay" />
        <div className="home-glow home-glow-peach bottom-0 right-[12%] h-72 w-72"></div>

        <div className="relative z-10 mx-auto grid min-h-[500px] max-w-7xl items-center gap-8 px-4 py-16 md:px-6 lg:grid-cols-[1fr_0.92fr]">
          <HomeReveal>
            <p className="kb-eyebrow">About Me</p>
            <h1 className="kb-display-mega mt-4">Thanh Nguyen</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[var(--color-body)] md:text-lg">
              Developer tập trung vào website nội dung, dashboard quản trị, API và hệ thống deployment gọn, dễ vận hành.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/contact" variant="primary">
                Trao đổi dự án <ArrowRight size={16} aria-hidden />
              </Button>
              <Button href="/projects" variant="outline">Xem dự án</Button>
            </div>
          </HomeReveal>
          <HomeReveal delay={0.1} className="hidden md:block">
            <div className="page-visual-panel page-visual-panel-clean flex items-center justify-center">
              <Image
                src="/images/about-us.svg"
                alt="About Us"
                width={640}
                height={360}
                priority
                unoptimized
                className="h-auto w-full max-w-[420px] object-contain lg:max-w-[620px] xl:max-w-[680px]"
              />
            </div>
          </HomeReveal>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-20 max-w-6xl px-4 pb-16 md:px-6 md:pb-20">
        <HomeReveal className="grid overflow-hidden rounded-2xl border border-[var(--color-hairline)] bg-white lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="border-b border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <div className="kb-icon size-24 text-3xl font-medium" aria-label="Avatar thanhnh">
              TN
            </div>
            <h2 className="kb-display-sm mt-5">Developer / SysAdmin</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--color-body)]">
              Kết hợp phát triển sản phẩm web với kinh nghiệm vận hành server để xây dựng hệ thống dễ bàn giao, dễ mở rộng và dễ debug.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {stack.map((item) => <Badge key={item} tone="slate">{item}</Badge>)}
            </div>
          </aside>

          <div className="p-6 sm:p-8">
            <p className="kb-eyebrow">Capabilities</p>
            <h2 className="kb-display-sm mt-3">Năng lực triển khai</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {highlights.map((item) => (
                <article key={item.label} className="page-motion-card rounded-2xl border border-[var(--color-hairline)] bg-white p-4">
                  <div className="flex items-start gap-3">
                    <span className="kb-icon size-10 shrink-0">
                      <item.icon size={18} aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-medium text-[var(--color-ink)]">{item.label}</h3>
                      <p className="mt-1 text-sm leading-6 text-[var(--color-body)]">{item.value}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </HomeReveal>

        <HomeReveal className="mt-10" delay={0.08}>
          <div>
            <Badge tone="slate">Timeline</Badge>
            <h2 className="kb-display-lg mt-3">Kinh nghiệm chính</h2>
          </div>
          <div className="mt-5 grid gap-4">
            {timeline.map((item) => {
              const Icon = item.icon
              return (
                <article key={item.title} className="kb-card page-motion-card">
                  <div className="flex gap-4">
                    <span className="kb-icon size-10 shrink-0">
                      <Icon size={18} aria-hidden />
                    </span>
                    <div>
                      <h2 className="text-lg font-medium text-[var(--color-ink)]">{item.title}</h2>
                      <p className="mt-1 text-sm leading-6 text-[var(--color-body)]">{item.text}</p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </HomeReveal>

        <HomeReveal className="mt-10" delay={0.12}>
          <div>
            <Badge tone="slate">Skills</Badge>
            <h2 className="kb-display-lg mt-3">Kỹ năng thực chiến</h2>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {skills.map((skill) => (
              <article key={skill} className="kb-card page-motion-card">
                <CheckCircle2 className="h-5 w-5 text-[var(--color-ink)]" aria-hidden />
                <h2 className="mt-4 text-base font-medium text-[var(--color-ink)]">{skill}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--color-body)]">Thực hành theo hướng rõ ràng, có tài liệu và ưu tiên khả năng bảo trì.</p>
              </article>
            ))}
          </div>
        </HomeReveal>
      </section>
    </main>
  )
}
