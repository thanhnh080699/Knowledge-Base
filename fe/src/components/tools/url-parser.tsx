"use client"

import { useState, useMemo } from "react"
import { CopyButton } from "@/components/shared/copy-button"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Sparkles, RotateCcw } from "lucide-react"

export function UrlParser() {
  const [urlInput, setUrlInput] = useState(
    "https://developer:secret123@thanhnh.id.vn:8443/docs/api/v1/search?category=security&page=2&filter=active#section-results"
  )

  const parsed = useMemo(() => {
    try {
      const u = new URL(urlInput)
      const queryParams: { key: string; value: string }[] = []
      u.searchParams.forEach((value, key) => {
        queryParams.push({ key, value })
      })

      return {
        protocol: u.protocol,
        origin: u.origin,
        username: u.username,
        password: u.password,
        hostname: u.hostname,
        port: u.port || (u.protocol === "https:" ? "443" : "80"),
        pathname: u.pathname,
        search: u.search,
        hash: u.hash,
        queryParams,
        error: null,
      }
    } catch {
      return {
        protocol: "",
        origin: "",
        username: "",
        password: "",
        hostname: "",
        port: "",
        pathname: "",
        search: "",
        hash: "",
        queryParams: [],
        error: "Please enter a valid URL (including protocol like https://)",
      }
    }
  }, [urlInput])

  const updateParam = (index: number, newKey: string, newValue: string) => {
    try {
      const u = new URL(urlInput)
      const currentParams: [string, string][] = []
      u.searchParams.forEach((v, k) => currentParams.push([k, v]))

      if (index >= 0 && index < currentParams.length) {
        currentParams[index] = [newKey, newValue]
      }

      const newSearch = new URLSearchParams(currentParams).toString()
      u.search = newSearch ? `?${newSearch}` : ""
      setUrlInput(u.toString())
    } catch {}
  }

  const removeParam = (index: number) => {
    try {
      const u = new URL(urlInput)
      const currentParams: [string, string][] = []
      u.searchParams.forEach((v, k) => currentParams.push([k, v]))
      currentParams.splice(index, 1)

      const newSearch = new URLSearchParams(currentParams).toString()
      u.search = newSearch ? `?${newSearch}` : ""
      setUrlInput(u.toString())
    } catch {}
  }

  const addParam = () => {
    try {
      const u = new URL(urlInput)
      u.searchParams.append("new_key", "new_value")
      setUrlInput(u.toString())
    } catch {}
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-hairline)] pb-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">URL Parser &amp; Query Editor</h2>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">
            Deconstruct URLs into protocol, host, port, path, authentication, and interactively edit query parameters.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() =>
              setUrlInput("https://api.github.com/repos/CorentinTh/it-tools/pulls?state=open&sort=created&direction=desc#page")
            }
            variant="outline"
            size="sm"
          >
            <Sparkles size={14} />
            GitHub API
          </Button>
          <Button onClick={() => setUrlInput("")} variant="ghost" size="sm">
            <RotateCcw size={14} />
            Clear
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-4 space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
          Full URL Input
        </label>
        <div className="relative group">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/path?key=value#hash"
            className="w-full rounded-xl border border-[var(--color-hairline)] bg-white px-3.5 py-2.5 pr-10 font-mono text-sm text-[var(--color-ink)] focus:border-[var(--color-brand)] focus:outline-none"
          />
          {urlInput && <CopyButton text={urlInput} />}
        </div>
      </div>

      {parsed.error ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs font-medium text-amber-800">
          {parsed.error}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Decomposed Parts Grid */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Protocol", value: parsed.protocol },
              { label: "Hostname", value: parsed.hostname },
              { label: "Port", value: parsed.port },
              { label: "Origin", value: parsed.origin },
              { label: "Pathname", value: parsed.pathname },
              { label: "Hash / Anchor", value: parsed.hash || "(none)" },
              { label: "Username", value: parsed.username || "(none)" },
              { label: "Password", value: parsed.password || "(none)" },
            ].map((item) => (
              <div
                key={item.label}
                className="relative rounded-xl border border-[var(--color-hairline)] bg-white p-3.5 shadow-xs"
              >
                <span className="text-[11px] font-medium text-[var(--color-muted)] block mb-1">
                  {item.label}
                </span>
                <span className="font-mono text-xs font-semibold text-[var(--color-ink)] break-all pr-7 block">
                  {item.value}
                </span>
                {item.value !== "(none)" && <CopyButton text={item.value} />}
              </div>
            ))}
          </div>

          {/* Interactive Query Parameters Table */}
          <div className="rounded-2xl border border-[var(--color-hairline)] bg-white p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-[var(--color-hairline)] pb-3">
              <div>
                <h3 className="font-semibold text-sm text-[var(--color-ink)]">Query Parameters</h3>
                <p className="text-xs text-[var(--color-muted)]">
                  Edit parameters below to automatically recalculate the full URL above.
                </p>
              </div>
              <Button onClick={addParam} variant="outline" size="sm">
                <Plus size={14} /> Add Parameter
              </Button>
            </div>

            {parsed.queryParams.length === 0 ? (
              <div className="text-xs text-[var(--color-muted)] italic py-4 text-center">
                No query parameters in this URL. Click &ldquo;Add Parameter&rdquo; to add one.
              </div>
            ) : (
              <div className="space-y-2">
                {parsed.queryParams.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={p.key}
                      onChange={(e) => updateParam(idx, e.target.value, p.value)}
                      placeholder="key"
                      className="w-1/3 rounded-lg border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] px-3 py-1.5 font-mono text-xs text-[var(--color-ink)] focus:bg-white focus:outline-none"
                    />
                    <span className="text-[var(--color-muted)] font-mono">=</span>
                    <input
                      type="text"
                      value={p.value}
                      onChange={(e) => updateParam(idx, p.key, e.target.value)}
                      placeholder="value"
                      className="flex-1 rounded-lg border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] px-3 py-1.5 font-mono text-xs text-[var(--color-ink)] focus:bg-white focus:outline-none"
                    />
                    <button
                      onClick={() => removeParam(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Remove parameter"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
