"use client"

import { useState, useMemo } from "react"
import { CopyButton } from "@/components/shared/copy-button"
import { Search } from "lucide-react"

interface RegexToken {
  category: string
  syntax: string
  description: string
  example: string
}

const REGEX_TOKENS: RegexToken[] = [
  // Character Classes
  { category: "Character Classes", syntax: ".", description: "Any character except newline (unless 's' flag is set)", example: "a.c matches abc, a1c" },
  { category: "Character Classes", syntax: "\\d", description: "Any digit [0-9]", example: "\\d+ matches 123" },
  { category: "Character Classes", syntax: "\\D", description: "Any non-digit [^0-9]", example: "\\D+ matches ABC" },
  { category: "Character Classes", syntax: "\\w", description: "Any word character [a-zA-Z0-9_]", example: "\\w+ matches user_1" },
  { category: "Character Classes", syntax: "\\W", description: "Any non-word character", example: "\\W matches ! or space" },
  { category: "Character Classes", syntax: "\\s", description: "Any whitespace character (space, tab, newline)", example: "\\s+ matches spaces" },
  { category: "Character Classes", syntax: "\\S", description: "Any non-whitespace character", example: "\\S+ matches text" },
  { category: "Character Classes", syntax: "[abc]", description: "Any character in the set (a, b, or c)", example: "[aeiou] matches vowels" },
  { category: "Character Classes", syntax: "[^abc]", description: "Any character NOT in the set", example: "[^0-9] matches non-digits" },
  { category: "Character Classes", syntax: "[a-z]", description: "Character range from a to z", example: "[0-9a-fA-F] matches hex" },

  // Quantifiers
  { category: "Quantifiers", syntax: "*", description: "0 or more times (greedy)", example: "a* matches '', a, aaa" },
  { category: "Quantifiers", syntax: "+", description: "1 or more times (greedy)", example: "a+ matches a, aaa" },
  { category: "Quantifiers", syntax: "?", description: "0 or 1 time (optional)", example: "colou?r matches color and colour" },
  { category: "Quantifiers", syntax: "{n}", description: "Exactly n times", example: "\\d{4} matches 2026" },
  { category: "Quantifiers", syntax: "{n,}", description: "n or more times", example: "\\d{2,} matches 12, 123" },
  { category: "Quantifiers", syntax: "{n,m}", description: "Between n and m times", example: "\\d{2,4} matches 12, 123, 1234" },
  { category: "Quantifiers", syntax: "*?", description: "0 or more times (lazy / non-greedy)", example: "<.*?> matches <b> not <b>hello</b>" },
  { category: "Quantifiers", syntax: "+?", description: "1 or more times (lazy / non-greedy)", example: "a+? matches 'a' in 'aaaa'" },

  // Anchors & Boundaries
  { category: "Anchors", syntax: "^", description: "Start of string (or line if 'm' flag set)", example: "^Hello matches Hello at start" },
  { category: "Anchors", syntax: "$", description: "End of string (or line if 'm' flag set)", example: "end$ matches end at line end" },
  { category: "Anchors", syntax: "\\b", description: "Word boundary", example: "\\bcat\\b matches cat not catch" },
  { category: "Anchors", syntax: "\\B", description: "Non-word boundary", example: "\\Bcat\\B matches certificate" },

  // Groups & References
  { category: "Grouping", syntax: "(abc)", description: "Capturing group", example: "(\\d{2})-(\\d{2}) captures parts" },
  { category: "Grouping", syntax: "(?:abc)", description: "Non-capturing group", example: "(?:https?|ftp):// matches protocol" },
  { category: "Grouping", syntax: "(?<name>abc)", description: "Named capturing group", example: "(?<year>\\d{4}) captures year" },
  { category: "Grouping", syntax: "\\1", description: "Backreference to group #1", example: "([\"']).*?\\1 matches quoted strings" },
  { category: "Grouping", syntax: "a|b", description: "Alternation (match either a or b)", example: "cat|dog matches cat or dog" },

  // Lookarounds
  { category: "Lookaround", syntax: "(?=abc)", description: "Positive lookahead (followed by abc)", example: "\\d+(?=px) matches 100 in 100px" },
  { category: "Lookaround", syntax: "(?!abc)", description: "Negative lookahead (not followed by abc)", example: "\\d+(?!px) matches 100 in 100em" },
  { category: "Lookaround", syntax: "(?<=abc)", description: "Positive lookbehind (preceded by abc)", example: "(?<=\\$)\\d+ matches 50 in $50" },
  { category: "Lookaround", syntax: "(?<!abc)", description: "Negative lookbehind (not preceded by abc)", example: "(?<!\\$)\\d+ matches 50 in €50" },

  // Flags
  { category: "Flags", syntax: "g", description: "Global: don't return after first match", example: "/a/g matches all 'a's" },
  { category: "Flags", syntax: "i", description: "Case-insensitive matching", example: "/cat/i matches cat, CAT, Cat" },
  { category: "Flags", syntax: "m", description: "Multiline: ^ and $ match line boundaries", example: "Handles multi-line input" },
  { category: "Flags", syntax: "s", description: "DotAll: allows '.' to match newline characters", example: "/<p>.*<\\/p>/s" },
  { category: "Flags", syntax: "u", description: "Unicode: treats pattern as a sequence of unicode code points", example: "/\\p{Emoji}/u" },
]

export function RegexMemo() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("ALL")

  const categories = useMemo(() => {
    const set = new Set(REGEX_TOKENS.map((t) => t.category))
    return ["ALL", ...Array.from(set)]
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return REGEX_TOKENS.filter((item) => {
      const matchCat = selectedCategory === "ALL" || item.category === selectedCategory
      const matchSearch =
        !q ||
        item.syntax.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.example.toLowerCase().includes(q)
      return matchCat && matchSearch
    })
  }, [search, selectedCategory])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-hairline)] pb-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">Regex Syntax Cheatsheet</h2>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">
            Quick reference guide for regular expression syntax, character classes, quantifiers, and lookaround assertions.
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search regex syntax (e.g. lookahead, digit, boundary, greedy)..."
            className="w-full rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] pl-10 pr-3.5 py-2.5 text-sm text-[var(--color-ink)] focus:border-[var(--color-brand)] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-surface-soft)] text-[var(--color-muted)] hover:bg-[var(--color-surface-strong)] hover:text-[var(--color-ink)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Tokens */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="relative rounded-xl border border-[var(--color-hairline)] bg-white p-3.5 shadow-xs space-y-1.5 hover:border-[var(--color-brand)]/40 transition-all"
          >
            <div className="flex items-center justify-between pr-7">
              <code className="font-mono text-base font-bold text-[var(--color-brand)] bg-[var(--color-surface-soft)] px-2 py-0.5 rounded">
                {item.syntax}
              </code>
              <span className="text-[10px] font-semibold uppercase text-[var(--color-muted)]">
                {item.category}
              </span>
            </div>
            <p className="text-xs text-[var(--color-ink)] font-medium">
              {item.description}
            </p>
            <p className="text-[11px] font-mono text-[var(--color-muted)] bg-[var(--color-surface-soft)]/50 p-1.5 rounded">
              {item.example}
            </p>
            <CopyButton text={item.syntax} />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-[var(--color-hairline)] p-8 text-center text-xs text-[var(--color-muted)]">
          No matching Regex syntax found for &ldquo;{search}&rdquo;.
        </div>
      )}
    </div>
  )
}
