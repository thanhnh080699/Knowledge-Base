"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"

export function RegexTester() {
  const [pattern, setPattern] = useState("([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})")
  const [flags, setFlags] = useState({ g: true, i: true, m: false, s: false, u: false })
  const [testString, setTestString] = useState(
    "Hello team! You can reach support at support@thanhnh.id.vn or admin@example.org for questions."
  )

  const activeFlags = Object.entries(flags)
    .filter(([, active]) => active)
    .map(([flag]) => flag)
    .join("")

  const evaluation = useMemo(() => {
    if (!pattern) return { matches: [], error: null, count: 0 }

    try {
      const re = new RegExp(pattern, activeFlags)
      const matches: { index: number; match: string; groups: string[] }[] = []

      if (flags.g) {
        let m: RegExpExecArray | null
        let safety = 0
        while ((m = re.exec(testString)) !== null && safety < 1000) {
          safety++
          matches.push({
            index: m.index,
            match: m[0],
            groups: m.slice(1),
          })
          if (m.index === re.lastIndex) re.lastIndex++
        }
      } else {
        const m = re.exec(testString)
        if (m) {
          matches.push({
            index: m.index,
            match: m[0],
            groups: m.slice(1),
          })
        }
      }

      return { matches, error: null, count: matches.length }
    } catch (err) {
      return { matches: [], error: err instanceof Error ? err.message : "Invalid regular expression", count: 0 }
    }
  }, [pattern, activeFlags, testString, flags.g])

  const toggleFlag = (flag: keyof typeof flags) => {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }))
  }

  const loadSample = (type: "email" | "ipv4" | "url" | "date") => {
    if (type === "email") {
      setPattern("([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})")
      setTestString("Contact john.doe@work.com and info@thanhnh.id.vn")
    } else if (type === "ipv4") {
      setPattern("\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b")
      setTestString("Server IPs: 192.168.1.1, DNS: 8.8.8.8 and invalid: 999.999.999.999")
    } else if (type === "url") {
      setPattern("https?://[a-zA-Z0-9.-]+(?:\\.[a-zA-Z]{2,})(?:/[^\\s]*)?")
      setTestString("Visit https://thanhnh.id.vn or http://github.com/CorentinTh/it-tools for tools.")
    } else if (type === "date") {
      setPattern("(\\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])")
      setTestString("Dates: 2026-09-08 and release on 2026-12-31")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-hairline)] pb-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">Regex Tester</h2>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">
            Test and debug regular expressions in real-time with capture groups and flag controls.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <Button onClick={() => loadSample("email")} variant="outline" size="sm">
            Email
          </Button>
          <Button onClick={() => loadSample("ipv4")} variant="outline" size="sm">
            IPv4
          </Button>
          <Button onClick={() => loadSample("url")} variant="outline" size="sm">
            URL
          </Button>
          <Button onClick={() => loadSample("date")} variant="outline" size="sm">
            Date
          </Button>
        </div>
      </div>

      {/* Regex Pattern Bar */}
      <div className="rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-4 space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
          Regular Expression &amp; Flags
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-1 items-center rounded-xl border border-[var(--color-hairline)] bg-white px-3 py-2 font-mono text-sm">
            <span className="text-[var(--color-muted)] font-bold">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter regex pattern..."
              className="flex-1 px-2 font-mono text-sm text-[var(--color-ink)] focus:outline-none"
            />
            <span className="text-[var(--color-muted)] font-bold">/{activeFlags}</span>
          </div>

          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[var(--color-hairline)]">
            {(["g", "i", "m", "s", "u"] as const).map((f) => (
              <button
                key={f}
                onClick={() => toggleFlag(f)}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                  flags[f]
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-muted)] hover:bg-[var(--color-surface-soft)]"
                }`}
                title={`Flag /${f}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {evaluation.error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700 font-mono">
            {evaluation.error}
          </div>
        )}
      </div>

      {/* Test String Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
            Test String
          </label>
          <span className="text-xs font-medium text-[var(--color-muted)]">
            Found <strong className="text-[var(--color-ink)]">{evaluation.count}</strong> match{evaluation.count === 1 ? "" : "es"}
          </span>
        </div>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          rows={6}
          placeholder="Paste or write your test string here..."
          className="w-full rounded-xl border border-[var(--color-hairline)] bg-white p-3.5 font-mono text-sm text-[var(--color-ink)] focus:border-[var(--color-brand)] focus:outline-none leading-relaxed"
        />
      </div>

      {/* Matches List */}
      {evaluation.matches.length > 0 && (
        <div className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
            Match Details &amp; Capture Groups
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            {evaluation.matches.map((m, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-3.5 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between border-b border-[var(--color-hairline)] pb-1.5">
                  <span className="font-semibold text-[var(--color-ink)]">
                    Match #{idx + 1}
                  </span>
                  <span className="font-mono text-[11px] text-[var(--color-muted)]">
                    Index: {m.index}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[var(--color-muted)] block mb-0.5">Full Match:</span>
                  <code className="block rounded bg-white p-1.5 font-mono font-bold text-[var(--color-ink)] border border-[var(--color-hairline)] break-all">
                    {m.match}
                  </code>
                </div>
                {m.groups.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] text-[var(--color-muted)] block">Groups:</span>
                    {m.groups.map((grp, gIdx) => (
                      <div key={gIdx} className="flex items-center gap-2 font-mono text-[11px]">
                        <span className="text-[var(--color-muted)]">Group {gIdx + 1}:</span>
                        <code className="bg-white px-1.5 py-0.5 rounded border border-[var(--color-hairline)] text-emerald-700 break-all">
                          {grp ?? "undefined"}
                        </code>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
