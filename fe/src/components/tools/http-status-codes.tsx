"use client"

import { useState, useMemo } from "react"
import { CopyButton } from "@/components/shared/copy-button"
import { Search } from "lucide-react"

interface StatusCode {
  code: number
  phrase: string
  category: "1xx" | "2xx" | "3xx" | "4xx" | "5xx"
  description: string
}

const STATUS_CODES: StatusCode[] = [
  // 1xx
  { code: 100, phrase: "Continue", category: "1xx", description: "Initial part of a request has been received and hasn't yet been rejected by the server." },
  { code: 101, phrase: "Switching Protocols", category: "1xx", description: "The requester has asked the server to switch protocols (e.g. HTTP to WebSocket)." },
  { code: 102, phrase: "Processing", category: "1xx", description: "WebDAV: Server has received and is processing the request, but no response is available yet." },
  { code: 103, phrase: "Early Hints", category: "1xx", description: "Used to return headers like Link preload before final HTTP message." },

  // 2xx
  { code: 200, phrase: "OK", category: "2xx", description: "Standard response for successful HTTP requests." },
  { code: 201, phrase: "Created", category: "2xx", description: "The request has been fulfilled, resulting in the creation of a new resource." },
  { code: 202, phrase: "Accepted", category: "2xx", description: "The request has been accepted for processing, but processing has not completed." },
  { code: 204, phrase: "No Content", category: "2xx", description: "The server successfully processed the request and is not returning any content." },
  { code: 206, phrase: "Partial Content", category: "2xx", description: "The server is delivering only part of the resource (byte serving) due to a Range header." },

  // 3xx
  { code: 301, phrase: "Moved Permanently", category: "3xx", description: "This and all future requests should be directed to the given URI." },
  { code: 302, phrase: "Found (Moved Temporarily)", category: "3xx", description: "The resource currently resides temporarily under a different URI." },
  { code: 304, phrase: "Not Modified", category: "3xx", description: "Resource has not been modified since the version specified by request headers (If-Modified-Since / ETag)." },
  { code: 307, phrase: "Temporary Redirect", category: "3xx", description: "Request should be repeated with another URI; request method must NOT be changed." },
  { code: 308, phrase: "Permanent Redirect", category: "3xx", description: "Request and all future requests should be repeated using another URI without changing method." },

  // 4xx
  { code: 400, phrase: "Bad Request", category: "4xx", description: "The server cannot or will not process the request due to client error (e.g. malformed syntax)." },
  { code: 401, phrase: "Unauthorized", category: "4xx", description: "Authentication is required and has failed or has not yet been provided." },
  { code: 403, phrase: "Forbidden", category: "4xx", description: "The request contained valid data and was understood by the server, but the server refuses action." },
  { code: 404, phrase: "Not Found", category: "4xx", description: "The requested resource could not be found on the server." },
  { code: 405, phrase: "Method Not Allowed", category: "4xx", description: "Request method is not supported for the requested resource (e.g. GET on a POST-only form)." },
  { code: 408, phrase: "Request Timeout", category: "4xx", description: "The server timed out waiting for the request." },
  { code: 409, phrase: "Conflict", category: "4xx", description: "Request could not be processed because of conflict in the current state of the resource." },
  { code: 410, phrase: "Gone", category: "4xx", description: "Resource requested is no longer available and will not be available again." },
  { code: 413, phrase: "Payload Too Large", category: "4xx", description: "The request is larger than the server is willing or able to process." },
  { code: 415, phrase: "Unsupported Media Type", category: "4xx", description: "Request entity has a media type which the server or resource does not support." },
  { code: 422, phrase: "Unprocessable Content", category: "4xx", description: "Request was well-formed but was unable to be followed due to semantic errors." },
  { code: 429, phrase: "Too Many Requests", category: "4xx", description: "User has sent too many requests in a given amount of time (rate limiting)." },

  // 5xx
  { code: 500, phrase: "Internal Server Error", category: "5xx", description: "Generic error message when an unexpected condition was encountered on the server." },
  { code: 501, phrase: "Not Implemented", category: "5xx", description: "Server does not recognize request method, or lacks ability to fulfill request." },
  { code: 502, phrase: "Bad Gateway", category: "5xx", description: "Server acting as gateway/proxy received an invalid response from inbound server." },
  { code: 503, phrase: "Service Unavailable", category: "5xx", description: "The server cannot handle the request (temporarily overloaded or down for maintenance)." },
  { code: 504, phrase: "Gateway Timeout", category: "5xx", description: "Server acting as gateway/proxy did not receive a timely response from upstream server." },
  { code: 505, phrase: "HTTP Version Not Supported", category: "5xx", description: "The server does not support the HTTP protocol version used in the request." },
]

export function HttpStatusCodes() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<"ALL" | "1xx" | "2xx" | "3xx" | "4xx" | "5xx">("ALL")

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return STATUS_CODES.filter((item) => {
      const matchCat = selectedCategory === "ALL" || item.category === selectedCategory
      const matchSearch =
        !q ||
        item.code.toString().includes(q) ||
        item.phrase.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      return matchCat && matchSearch
    })
  }, [search, selectedCategory])

  const getBadgeColor = (cat: string) => {
    switch (cat) {
      case "1xx":
        return "bg-slate-100 text-slate-700 border-slate-200"
      case "2xx":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "3xx":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "4xx":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "5xx":
        return "bg-rose-50 text-rose-700 border-rose-200"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-hairline)] pb-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">HTTP Status Codes Reference</h2>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">
            Complete list of standard HTTP response status codes with official RFC definitions and explanations.
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
            placeholder="Search code or description (e.g. 404, bad gateway, rate limit)..."
            className="w-full rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] pl-10 pr-3.5 py-2.5 text-sm text-[var(--color-ink)] focus:border-[var(--color-brand)] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(["ALL", "1xx", "2xx", "3xx", "4xx", "5xx"] as const).map((cat) => (
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

      {/* Grid of Status Codes */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <div
            key={item.code}
            className="relative rounded-xl border border-[var(--color-hairline)] bg-white p-4 shadow-xs space-y-2 hover:border-[var(--color-brand)]/40 transition-all"
          >
            <div className="flex items-center justify-between pr-7">
              <span className={`rounded-md border px-2 py-0.5 font-mono text-sm font-bold ${getBadgeColor(item.category)}`}>
                {item.code}
              </span>
              <span className="font-semibold text-xs text-[var(--color-ink)]">
                {item.phrase}
              </span>
            </div>
            <p className="text-xs text-[var(--color-muted)] leading-relaxed">
              {item.description}
            </p>
            <CopyButton text={`${item.code} ${item.phrase}`} />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-[var(--color-hairline)] p-8 text-center text-xs text-[var(--color-muted)]">
          No HTTP status codes found matching &ldquo;{search}&rdquo;.
        </div>
      )}
    </div>
  )
}
