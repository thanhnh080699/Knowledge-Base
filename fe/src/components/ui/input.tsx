import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react"

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`min-h-11 w-full rounded-lg border border-[var(--color-hairline-strong)] bg-white px-4 py-3 text-base text-[var(--color-ink)] outline-none transition-colors placeholder:text-[var(--color-muted-soft)] focus:border-[var(--color-ink)] focus:ring-1 focus:ring-[var(--color-ink)] ${className}`}
      {...props}
    />
  )
}

export function Textarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`min-h-32 w-full rounded-lg border border-[var(--color-hairline-strong)] bg-white px-4 py-3 text-base text-[var(--color-ink)] outline-none transition-colors placeholder:text-[var(--color-muted-soft)] focus:border-[var(--color-ink)] focus:ring-1 focus:ring-[var(--color-ink)] ${className}`}
      {...props}
    />
  )
}
