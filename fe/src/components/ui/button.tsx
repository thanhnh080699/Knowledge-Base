import Link from "next/link"
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react"

type ButtonBaseProps = {
  children: ReactNode
  variant?: "primary" | "secondary" | "outline" | "ghost"
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
  primary: "border-blue-600 bg-blue-600 text-white hover:bg-white hover:text-blue-600",
  secondary: "border-slate-900 bg-slate-900 text-white hover:bg-white hover:text-slate-900",
  outline: "border-slate-300 bg-white text-slate-900 hover:border-blue-600 hover:text-blue-600",
  ghost: "border-transparent bg-transparent text-slate-700 hover:border-slate-300 hover:bg-white"
}

export function Button(props: ButtonProps | ButtonLinkProps) {
  const { children, variant = "primary", className = "", ...rest } = props
  const classes = `inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${variants[variant]} ${className}`

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
