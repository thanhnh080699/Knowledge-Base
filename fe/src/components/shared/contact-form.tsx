"use client"

import { Camera, Clock, Facebook, Github, Gitlab, Linkedin, Mail, MapPin, Phone, Send, Share2, UserRound, Video } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { FormEvent, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input, Textarea } from "@/components/ui/input"
import { submitContact } from "@/lib/api"
import type { SiteSettings } from "@/types/category"

const socialLinks = [
  { key: "social_facebook", label: "Facebook", icon: Facebook },
  { key: "social_twitter", label: "Twitter", icon: Share2 },
  { key: "social_linkedin", label: "LinkedIn", icon: Linkedin },
  { key: "social_github", label: "GitHub", icon: Github },
  { key: "social_gitlab", label: "GitLab", icon: Gitlab },
  { key: "social_youtube", label: "YouTube", icon: Video },
  { key: "social_instagram", label: "Instagram", icon: Camera }
] as const

export function ContactForm({ settings }: { settings: SiteSettings }) {
  const params = useSearchParams()
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("loading")
    setMessage("")

    const formData = new FormData(event.currentTarget)
    const form = event.currentTarget

    try {
      await submitContact({
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        message: String(formData.get("message") ?? "")
      })
      setStatus("success")
      setMessage("Yêu cầu đã được gửi thành công.")
      form.reset()
    } catch (error: any) {
      setStatus("error")
      const apiMessage = error.response?.data?.message || error.response?.data?.errors?.[0]?.message
      setMessage(apiMessage || "Không thể gửi yêu cầu. Vui lòng thử lại.")
    }
  }

  const inputClass = "min-h-12 border-slate-200 bg-white px-4 focus:border-blue-600"
  const phoneHref = settings.contact_phone ? `tel:${settings.contact_phone.replace(/[^\d+]/g, "")}` : ""
  const visibleSocialLinks = socialLinks
    .map((item) => ({ ...item, url: settings[item.key] }))
    .filter((item) => Boolean(item.url))
  const hasContactInfo = Boolean(
    settings.contact_name ||
    settings.contact_email ||
    settings.contact_phone ||
    settings.contact_address ||
    settings.working_hours ||
    visibleSocialLinks.length
  )

  return (
    <div className="grid overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:grid-cols-[1.15fr_0.85fr]">
      <form onSubmit={onSubmit} className="px-5 py-8 sm:px-8 md:px-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Let&apos;s talk</p>
          <h2 className="mt-3 text-2xl font-bold text-slate-950 md:text-3xl">Kể mình nghe về dự án</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            Mô tả ngắn vấn đề, phạm vi và deadline dự kiến. Mình sẽ phản hồi với hướng triển khai phù hợp.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Họ tên
            <Input name="name" required autoComplete="name" placeholder="Nguyễn Văn A" className={inputClass} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Email
            <Input name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={inputClass} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700 md:col-span-2">
            Số điện thoại
            <Input name="phone" type="tel" autoComplete="tel" placeholder="0123456789" className={inputClass} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700 md:col-span-2">
            Nội dung
            <Textarea
              name="message"
              required
              defaultValue={params.get("message") ?? ""}
              placeholder="Website, CMS, API, DevOps..."
              className="min-h-36 border-slate-200 bg-white px-4 py-3 focus:border-blue-600"
            />
          </label>
        </div>

        {message ? (
          <div className={`mt-5 rounded-md border px-3 py-2 text-sm ${status === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-600"}`} role="status">
            {message}
          </div>
        ) : null}

        <Button
          type="submit"
          disabled={status === "loading"}
          className="mt-6 min-h-12 border-blue-600 bg-blue-600 px-6 text-white hover:border-blue-600 hover:bg-white hover:text-blue-600"
        >
          <Send size={16} aria-hidden />
          {status === "loading" ? "Đang gửi..." : "Gửi liên hệ"}
        </Button>
      </form>

      <aside className="border-t border-slate-200 bg-slate-50 px-5 py-8 text-slate-700 sm:px-8 md:px-10 lg:border-l lg:border-t-0" aria-label="Thông tin liên hệ">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">Contact info</p>
        <h2 className="mt-3 text-2xl font-bold text-slate-950">Thông tin liên hệ</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Phù hợp cho dự án cá nhân, doanh nghiệp nhỏ và hệ thống nội bộ cần triển khai gọn, dễ vận hành.
        </p>

        <div className="mt-8 grid gap-5 text-sm">
          {settings.contact_email ? (
            <a href={`mailto:${settings.contact_email}`} className="flex gap-3 text-slate-600 transition-colors hover:text-blue-600">
              <Mail className="mt-0.5 shrink-0 text-blue-600" size={18} aria-hidden />
              <span>
                <span className="block font-semibold text-slate-950">Email</span>
                {settings.contact_email}
              </span>
            </a>
          ) : null}
          {settings.contact_phone ? (
            <a href={phoneHref} className="flex gap-3 text-slate-600 transition-colors hover:text-blue-600">
              <Phone className="mt-0.5 shrink-0 text-blue-600" size={18} aria-hidden />
              <span>
                <span className="block font-semibold text-slate-950">Phone</span>
                {settings.contact_phone}
              </span>
            </a>
          ) : null}
          {settings.contact_address ? (
            <span className="flex gap-3 text-slate-600">
              <MapPin className="mt-0.5 shrink-0 text-blue-600" size={18} aria-hidden />
              <span>
                <span className="block font-semibold text-slate-950">Location</span>
                {settings.contact_address}
              </span>
            </span>
          ) : null}
          {settings.working_hours ? (
            <span className="flex gap-3 text-slate-600">
              <Clock className="mt-0.5 shrink-0 text-blue-600" size={18} aria-hidden />
              <span>
                <span className="block font-semibold text-slate-950">Working hours</span>
                {settings.working_hours}
              </span>
            </span>
          ) : null}
          {visibleSocialLinks.length ? (
            <div className="border-t border-slate-200 pt-5">
              <span className="block font-semibold text-slate-950">Social links</span>
              <div className="mt-3 flex flex-wrap gap-2">
                {visibleSocialLinks.map((item) => {
                  const Icon = item.icon

                  return (
                    <a
                      key={item.key}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={item.label}
                      className="inline-flex size-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition-colors hover:border-blue-600 hover:text-blue-600"
                    >
                      <Icon size={17} aria-hidden />
                    </a>
                  )
                })}
              </div>
            </div>
          ) : null}
          {!hasContactInfo ? (
            <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
              Thông tin liên hệ sẽ hiển thị sau khi được cấu hình trong CMS.
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  )
}
