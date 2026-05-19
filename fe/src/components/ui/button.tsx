import Link from "next/link"
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react"

type ButtonBaseProps = {
  children: ReactNode
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "default" | "sm"
  className?: string
}

type ButtonProps = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never
  }

type ButtonLinkProps = ButtonBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
  }

const variants = {
  primary: "border-[var(--color-primary)] bg-[var(--color-primary)] text-white hover:border-[var(--color-primary-active)] hover:bg-[var(--color-primary-active)]",
  secondary: "border-[var(--color-hairline)] bg-[var(--color-surface-strong)] text-[var(--color-ink)] hover:border-[var(--color-hairline-strong)] hover:bg-white",
  outline: "border-[var(--color-hairline-strong)] bg-transparent text-[var(--color-ink)] hover:border-[var(--color-ink)] hover:bg-white",
  ghost: "border-transparent bg-transparent text-[var(--color-ink)] hover:border-[var(--color-hairline)] hover:bg-white"
}

export function Button(props: ButtonProps | ButtonLinkProps) {
  const { children, variant = "primary", size = "default", className = "", ...rest } = props
  const sizes = {
    default: "min-h-10 px-5 py-2.5",
    sm: "min-h-9 px-4 py-2"
  }
  const classes = `inline-flex items-center justify-center gap-2 rounded-full border text-[15px] font-medium leading-none tracking-normal transition-colors cursor-pointer disabled:pointer-events-none disabled:opacity-50 ${sizes[size]} ${variants[variant]} ${className}`

  if ("href" in rest && rest.href) {
    return (
      <Link className={classes} {...rest}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}
