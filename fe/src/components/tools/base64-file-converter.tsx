"use client"

import { useState, useRef } from "react"
import { CopyButton } from "@/components/shared/copy-button"
import { Button } from "@/components/ui/button"
import { Upload, Download, Image as ImageIcon, FileText, RotateCcw } from "lucide-react"

export function Base64FileConverter() {
  const [tab, setTab] = useState<"file-to-base64" | "base64-to-file">("file-to-base64")

  // File to Base64 State
  const [fileName, setFileName] = useState("")
  const [fileSize, setFileSize] = useState("")
  const [mimeType, setMimeType] = useState("")
  const [base64DataUrl, setBase64DataUrl] = useState("")
  const [rawBase64, setRawBase64] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Base64 to File State
  const [inputBase64, setInputBase64] = useState("")
  const [downloadName, setDownloadName] = useState("converted-file")

  const handleFileUpload = (file: File) => {
    setFileName(file.name)
    setFileSize((file.size / 1024).toFixed(2) + " KB")
    setMimeType(file.type || "application/octet-stream")

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setBase64DataUrl(result)
      const commaIdx = result.indexOf(",")
      if (commaIdx !== -1) {
        setRawBase64(result.substring(commaIdx + 1))
      } else {
        setRawBase64(result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDownloadFromFile = () => {
    if (!inputBase64.trim()) return

    try {
      let dataUrl = inputBase64.trim()
      if (!dataUrl.startsWith("data:")) {
        dataUrl = `data:application/octet-stream;base64,${dataUrl}`
      }

      const link = document.createElement("a")
      link.href = dataUrl
      link.download = downloadName || "downloaded-file"
      link.click()
    } catch {
      alert("Invalid Base64 string format.")
    }
  }

  const handleReset = () => {
    setFileName("")
    setFileSize("")
    setMimeType("")
    setBase64DataUrl("")
    setRawBase64("")
    setInputBase64("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-hairline)] pb-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">Base64 File Converter</h2>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">
            Convert files to Base64 Data URLs and decode Base64 back into downloadable files.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setTab(tab === "file-to-base64" ? "base64-to-file" : "file-to-base64")}
            variant="outline"
            size="sm"
          >
            Switch to {tab === "file-to-base64" ? "Base64 to File" : "File to Base64"}
          </Button>
          <Button onClick={handleReset} variant="ghost" size="sm">
            <RotateCcw size={14} />
            Reset
          </Button>
        </div>
      </div>

      {tab === "file-to-base64" ? (
        <div className="space-y-6">
          {/* Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-8 text-center transition-all hover:border-[var(--color-brand)]/50 hover:bg-white cursor-pointer"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              className="hidden"
            />
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xs text-[var(--color-brand)] mb-3">
              <Upload size={22} />
            </div>
            <p className="text-sm font-semibold text-[var(--color-ink)]">
              Click to select or drop any file here
            </p>
            <p className="text-xs text-[var(--color-muted)] mt-1">
              Supports Images, Documents, Audio, PDF, and Binary files
            </p>
          </div>

          {fileName && (
            <div className="rounded-xl border border-[var(--color-hairline)] bg-white p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-surface-soft)] text-[var(--color-brand)]">
                  {mimeType.startsWith("image/") ? <ImageIcon size={20} /> : <FileText size={20} />}
                </div>
                <div>
                  <span className="font-semibold text-sm text-[var(--color-ink)] block">
                    {fileName}
                  </span>
                  <span className="text-xs text-[var(--color-muted)]">
                    {fileSize} • {mimeType}
                  </span>
                </div>
              </div>

              {mimeType.startsWith("image/") && base64DataUrl && (
                <div className="h-12 w-12 rounded-lg border border-[var(--color-hairline)] overflow-hidden bg-slate-50 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={base64DataUrl} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
          )}

          {base64DataUrl && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                  Data URI Format (data:...;base64,...)
                </span>
                <div className="relative group">
                  <textarea
                    readOnly
                    value={base64DataUrl}
                    rows={4}
                    className="w-full rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-3 pr-10 font-mono text-xs text-[var(--color-ink)] focus:outline-none"
                  />
                  <CopyButton text={base64DataUrl} />
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                  Raw Base64 String
                </span>
                <div className="relative group">
                  <textarea
                    readOnly
                    value={rawBase64}
                    rows={4}
                    className="w-full rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-3 pr-10 font-mono text-xs text-[var(--color-ink)] focus:outline-none"
                  />
                  <CopyButton text={rawBase64} />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Base64 to File */
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Paste Base64 String or Data URI
            </label>
            <textarea
              value={inputBase64}
              onChange={(e) => setInputBase64(e.target.value)}
              rows={8}
              placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
              className="w-full rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-3 font-mono text-xs text-[var(--color-ink)] focus:bg-white focus:outline-none leading-relaxed"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                value={downloadName}
                onChange={(e) => setDownloadName(e.target.value)}
                placeholder="downloaded-filename.ext"
                className="w-full rounded-xl border border-[var(--color-hairline)] bg-white px-3.5 py-2 text-xs font-mono text-[var(--color-ink)]"
              />
            </div>
            <Button onClick={handleDownloadFromFile} variant="primary" size="default" disabled={!inputBase64}>
              <Download size={15} />
              Decode &amp; Download File
            </Button>
          </div>

          {inputBase64.startsWith("data:image/") && (
            <div className="rounded-2xl border border-[var(--color-hairline)] bg-white p-4 shadow-xs space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                Image Preview
              </span>
              <div className="max-h-64 overflow-auto rounded-lg border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-2 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={inputBase64} alt="Base64 Preview" className="max-h-60 max-w-full object-contain rounded" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
