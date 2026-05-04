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
  primary: "border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-600 hover:bg-white hover:text-blue-700",
  secondary: "border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-400 hover:bg-white hover:text-slate-950",
  outline: "border-slate-300 bg-white text-slate-900 hover:border-blue-600 hover:text-blue-600",
  ghost: "border-transparent bg-transparent text-slate-700 hover:border-slate-300 hover:bg-white"
}

export function Button(props: ButtonProps | ButtonLinkProps) {
  const { children, variant = "primary", size = "default", className = "", ...rest } = props
  const sizes = {
    default: "min-h-10 px-4 py-2",
    sm: "min-h-9 px-3 py-1.5"
  }
  const classes = `inline-flex items-center justify-center gap-2 rounded-md border text-sm font-medium transition-colors cursor-pointer ${sizes[size]} ${variants[variant]} ${className}`

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
