import { createElement } from "react"
import type { LucideIcon } from "lucide-react"
import {
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  Fingerprint,
  Lock,
  LockKeyhole,
  Shuffle,
  EyeOff,
  SlidersHorizontal,
  Code2,
  FileJson,
  FileCode,
  Database,
  Terminal,
  Binary,
  Link,
  Link2,
  Code,
  Type,
  Palette,
  AlignLeft,
  Clock,
  CalendarDays,
  CalendarClock,
  Wrench,
  RefreshCw,
} from "lucide-react"

export function ToolIconRenderer({
  slug,
  category,
  size = 17,
  strokeWidth = 1.8,
  className = "",
}: {
  slug: string
  category?: string
  size?: number
  strokeWidth?: number
  className?: string
}) {
  const Icon = getToolIcon(slug, category)
  return createElement(Icon, { size, strokeWidth, className })
}

export function CategoryIconRenderer({
  category,
  size = 16,
  strokeWidth = 2,
  className = "",
}: {
  category: string
  size?: number
  strokeWidth?: number
  className?: string
}) {
  const Icon = getCategoryIcon(category)
  return createElement(Icon, { size, strokeWidth, className })
}

/**
 * Returns a specific Lucide icon for a given tool based on its slug and category.
 */
export function getToolIcon(slug: string, category?: string): LucideIcon {
  // Specific tool slug matching (matched against sample image & functionality)
  if (slug === "crypto-token-generator" || slug === "token-generator") return Shuffle
  if (slug === "crypto-hash-text" || slug === "hash-generator") return EyeOff
  if (slug === "crypto-bcrypt") return ShieldCheck
  if (slug === "uuid-generator") return Fingerprint
  if (slug === "crypto-encrypt-decrypt") return LockKeyhole
  if (slug === "crypto-hmac") return SlidersHorizontal
  if (slug === "crypto-rsa-key-generator") return ShieldAlert
  if (slug === "crypto-password-generator" || slug === "password-generator") return Lock
  if (slug === "jwt-decoder") return KeyRound
  
  // Developer & Formatters
  if (slug === "json-formatter") return FileJson
  if (slug === "xml-formatter") return FileCode
  if (slug === "sql-formatter") return Database
  if (slug === "chmod-calculator") return Terminal

  // Encoders & Decoders
  if (slug === "base64-encoder-decoder") return Binary
  if (slug === "url-encoder-decoder") return Link
  if (slug === "html-entities") return Code

  // Converters & Time
  if (slug === "case-converter") return Type
  if (slug === "color-converter") return Palette
  if (slug === "timestamp-converter") return Clock
  if (slug === "date-formatter") return CalendarDays
  if (slug === "cron-builder") return CalendarClock

  // Text
  if (slug === "slug-generator") return Link2
  if (slug === "lorem-ipsum-generator") return AlignLeft

  // Fallback by category
  switch (category) {
    case "Crypto":
      return KeyRound
    case "Developer":
      return Code2
    case "Encoder":
      return Binary
    case "Converter":
      return RefreshCw
    case "Cron & Date Convert":
      return CalendarClock
    case "Text":
      return Type
    default:
      return Wrench
  }
}

/**
 * Returns a Lucide icon for a category header.
 */
export function getCategoryIcon(category: string): LucideIcon {
  switch (category) {
    case "Crypto":
      return KeyRound
    case "Developer":
      return Code2
    case "Encoder":
      return Binary
    case "Converter":
      return RefreshCw
    case "Cron & Date Convert":
      return CalendarClock
    case "Text":
      return Type
    default:
      return Wrench
  }
}
