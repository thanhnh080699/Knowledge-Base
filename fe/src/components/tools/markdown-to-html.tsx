"use client"

import { useState, useMemo } from "react"
import { CopyButton } from "@/components/shared/copy-button"
import { Button } from "@/components/ui/button"
import ReactMarkdown from "react-markdown"
import { Sparkles, RotateCcw } from "lucide-react"

// Simple markdown to raw HTML generator
function markdownToHtmlString(md: string): string {
  return md
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/gim, "<em>$1</em>")
    .replace(/`([^`]+)`/gim, "<code>$1</code>")
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
    .replace(/^\s*\n\*/gm, "<ul>\n*")
    .replace(/^(\*.+)\s*\n([^\*])/gm, "$1\n</ul>\n\n$2")
    .replace(/^\* (.*$)/gim, "<li>$1</li>")
    .replace(/^\s*\n([^\n]+)/gim, "<p>$1</p>")
    .trim()
}

export function MarkdownToHtml() {
  const [markdown, setMarkdown] = useState(
    `# Hello World\n\nThis is a **Markdown to HTML** previewer.\n\n## Features\n- Live Markdown preview\n- Raw HTML generation\n- Export and copy to clipboard\n\nVisit [thanhnh.id.vn](https://thanhnh.id.vn) for more developer tools!`
  )
  const [viewTab, setViewTab] = useState<"preview" | "html">("preview")

  const htmlOutput = useMemo(() => {
    return markdownToHtmlString(markdown)
  }, [markdown])

  const handleSample = () => {
    setMarkdown(
      `# API Documentation\n\nWelcome to the **Developer Portal**.\n\n### Authentication\nUse the \`Authorization: Bearer <TOKEN>\` header on all protected endpoints.\n\n### Endpoints\n- \`GET /api/v1/posts\` - List published posts\n- \`GET /api/v1/tools\` - List tools hub items`
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-hairline)] pb-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">Markdown to HTML Converter</h2>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">
            Write or paste Markdown on the left and see live rendered HTML or raw HTML markup on the right.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleSample} variant="outline" size="sm">
            <Sparkles size={14} />
            Sample Doc
          </Button>
          <Button onClick={() => setMarkdown("")} variant="ghost" size="sm">
            <RotateCcw size={14} />
            Clear
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Markdown Editor */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
            Markdown Input
          </label>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            rows={16}
            placeholder="# Write markdown here..."
            className="w-full rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-4 font-mono text-xs text-[var(--color-ink)] focus:bg-white focus:outline-none leading-relaxed"
          />
        </div>

        {/* Right: Output (Preview or Raw HTML) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 bg-[var(--color-surface-soft)] p-1 rounded-lg border border-[var(--color-hairline)]">
              <button
                onClick={() => setViewTab("preview")}
                className={`rounded px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                  viewTab === "preview" ? "bg-white text-[var(--color-ink)] shadow-xs" : "text-[var(--color-muted)]"
                }`}
              >
                Rendered Preview
              </button>
              <button
                onClick={() => setViewTab("html")}
                className={`rounded px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                  viewTab === "html" ? "bg-white text-[var(--color-ink)] shadow-xs" : "text-[var(--color-muted)]"
                }`}
              >
                Raw HTML
              </button>
            </div>
            {viewTab === "html" && htmlOutput && <span className="text-xs text-[var(--color-muted)]">HTML Markup</span>}
          </div>

          <div className="relative min-h-[300px]">
            {viewTab === "preview" ? (
              <div className="prose prose-sm max-w-none rounded-xl border border-[var(--color-hairline)] bg-white p-6 overflow-auto min-h-[350px]">
                <ReactMarkdown>{markdown}</ReactMarkdown>
              </div>
            ) : (
              <div className="relative group">
                <textarea
                  readOnly
                  value={htmlOutput}
                  rows={16}
                  className="w-full rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-4 pr-10 font-mono text-xs text-[var(--color-ink)] focus:outline-none leading-relaxed"
                />
                <CopyButton text={htmlOutput} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
