"use client"

import { Send } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { FormEvent, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input, Textarea } from "@/components/ui/input"
import { submitContact } from "@/lib/api"

export function ContactForm() {
  const params = useSearchParams()
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("loading")
    setMessage("")

    const formData = new FormData(event.currentTarget)

    try {
      await submitContact({
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        company: String(formData.get("company") ?? ""),
        message: String(formData.get("message") ?? "")
      })
      event.currentTarget.reset()
      setStatus("success")
      setMessage("Yêu cầu đã được gửi thành công.")
    } catch {
      setStatus("error")
      setMessage("Không thể gửi yêu cầu. Vui lòng thử lại.")
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4">
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Họ tên
          <Input name="name" required autoComplete="name" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Email
          <Input name="email" type="email" required autoComplete="email" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Công ty
          <Input name="company" autoComplete="organization" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Nội dung
          <Textarea name="message" required defaultValue={params.get("message") ?? ""} />
        </label>
      </div>
      {message ? (
        <div className={`mt-4 rounded-md border px-3 py-2 text-sm ${status === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-600"}`} role="status">
          {message}
        </div>
      ) : null}
      <Button type="submit" disabled={status === "loading"} className="mt-5">
        <Send size={16} aria-hidden />
        {status === "loading" ? "Đang gửi..." : "Gửi liên hệ"}
      </Button>
    </form>
  )
}
