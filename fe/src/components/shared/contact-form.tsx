"use client"

import { Camera, Clock, Facebook, Github, Gitlab, Linkedin, Mail, MapPin, Phone, Send, Share2, Video } from "lucide-react"
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

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: string; errors?: { message?: string }[] } } }).response
    return response?.data?.message || response?.data?.errors?.[0]?.message
  }

  return undefined
}

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
    } catch (error: unknown) {
      setStatus("error")
      const apiMessage = getErrorMessage(error)
      setMessage(apiMessage || "Không thể gửi yêu cầu. Vui lòng thử lại.")
    }
  }

  const inputClass = "min-h-12 border-[var(--color-hairline-strong)] bg-white px-4 focus:border-[var(--color-ink)]"
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
    <div className="grid overflow-hidden rounded-2xl border border-[var(--color-hairline)] bg-white lg:grid-cols-[1.15fr_0.85fr]">
      <form onSubmit={onSubmit} className="px-5 py-8 sm:px-8 md:px-10">
        <div>
          <p className="kb-eyebrow">Let&apos;s talk</p>
          <h2 className="kb-display-md mt-4">Kể mình nghe về dự án</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--color-body)]">
            Mô tả ngắn vấn đề, phạm vi và deadline dự kiến. Mình sẽ phản hồi với hướng triển khai phù hợp.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-[var(--color-body-strong)]">
            Họ tên
            <Input name="name" required autoComplete="name" placeholder="Nguyễn Văn A" className={inputClass} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-[var(--color-body-strong)]">
            Email
            <Input name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={inputClass} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-[var(--color-body-strong)] md:col-span-2">
            Số điện thoại
            <Input name="phone" type="tel" autoComplete="tel" placeholder="0123456789" className={inputClass} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-[var(--color-body-strong)] md:col-span-2">
            Nội dung
            <Textarea
              name="message"
              required
              defaultValue={params.get("message") ?? ""}
              placeholder="Website, CMS, API, DevOps..."
              className="min-h-36 border-[var(--color-hairline-strong)] bg-white px-4 py-3 focus:border-[var(--color-ink)]"
            />
          </label>
        </div>

        {message ? (
          <div className={`mt-5 rounded-lg border px-3 py-2 text-sm ${status === "success" ? "border-[var(--color-success)]/30 bg-white text-[var(--color-success)]" : "border-[var(--color-error)]/30 bg-white text-[var(--color-error)]"}`} role="status">
            {message}
          </div>
        ) : null}

        <Button
          type="submit"
          disabled={status === "loading"}
          className="mt-6 min-h-12 px-6"
        >
          <Send size={16} aria-hidden />
          {status === "loading" ? "Đang gửi..." : "Gửi liên hệ"}
        </Button>
      </form>

      <aside className="border-t border-[var(--color-hairline)] bg-[var(--color-surface-soft)] px-5 py-8 text-[var(--color-body)] sm:px-8 md:px-10 lg:border-l lg:border-t-0" aria-label="Thông tin liên hệ">
        <p className="kb-eyebrow">Contact info</p>
        <h2 className="kb-display-sm mt-4">Thông tin liên hệ</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--color-body)]">
          Phù hợp cho dự án cá nhân, doanh nghiệp nhỏ và hệ thống nội bộ cần triển khai gọn, dễ vận hành.
        </p>

        <div className="mt-8 grid gap-5 text-sm">
          {settings.contact_email ? (
            <a href={`mailto:${settings.contact_email}`} className="flex gap-3 text-[var(--color-body)] transition-colors hover:text-[var(--color-ink)]">
              <Mail className="mt-0.5 shrink-0 text-[var(--color-ink)]" size={18} aria-hidden />
              <span>
                <span className="block font-medium text-[var(--color-ink)]">Email</span>
                {settings.contact_email}
              </span>
            </a>
          ) : null}
          {settings.contact_phone ? (
            <a href={phoneHref} className="flex gap-3 text-[var(--color-body)] transition-colors hover:text-[var(--color-ink)]">
              <Phone className="mt-0.5 shrink-0 text-[var(--color-ink)]" size={18} aria-hidden />
              <span>
                <span className="block font-medium text-[var(--color-ink)]">Phone</span>
                {settings.contact_phone}
              </span>
            </a>
          ) : null}
          {settings.contact_address ? (
            <span className="flex gap-3 text-[var(--color-body)]">
              <MapPin className="mt-0.5 shrink-0 text-[var(--color-ink)]" size={18} aria-hidden />
              <span>
                <span className="block font-medium text-[var(--color-ink)]">Location</span>
                {settings.contact_address}
              </span>
            </span>
          ) : null}
          {settings.working_hours ? (
            <span className="flex gap-3 text-[var(--color-body)]">
              <Clock className="mt-0.5 shrink-0 text-[var(--color-ink)]" size={18} aria-hidden />
              <span>
                <span className="block font-medium text-[var(--color-ink)]">Working hours</span>
                {settings.working_hours}
              </span>
            </span>
          ) : null}
          {visibleSocialLinks.length ? (
            <div className="border-t border-[var(--color-hairline)] pt-5">
              <span className="block font-medium text-[var(--color-ink)]">Social links</span>
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
                      className="inline-flex size-10 items-center justify-center rounded-full border border-[var(--color-hairline)] bg-white text-[var(--color-body)] transition-colors hover:border-[var(--color-hairline-strong)] hover:text-[var(--color-ink)]"
                    >
                      <Icon size={17} aria-hidden />
                    </a>
                  )
                })}
              </div>
            </div>
          ) : null}
          {!hasContactInfo ? (
            <div className="rounded-2xl border border-[var(--color-hairline)] bg-white p-4 text-sm leading-6 text-[var(--color-body)]">
              Thông tin liên hệ sẽ hiển thị sau khi được cấu hình trong CMS.
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  )
}
