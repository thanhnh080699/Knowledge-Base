'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Tag } from '@/components/ui/tag'
import { useMediaDetail } from '@/hooks/queries/use-media'
import { ArrowLeft, Copy, ExternalLink, FileImage, RotateCcw } from 'lucide-react'

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || 'http://localhost:3002'

export default function MediaDetailPage() {
  const searchParams = useSearchParams()
  const path = searchParams.get('path') || ''
  const { data: media, isLoading } = useMediaDetail(path)

  async function copyPath() {
    if (!media) return
    await navigator.clipboard.writeText(media.path)
  }

  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-[var(--foreground)]">Media Detail</h3>
            <span className="mt-1 text-sm text-[var(--app-muted)]">
              Detailed information for the media file stored on the CDN.
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/media"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[var(--app-border)] bg-[var(--app-surface)] px-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--app-surface-hover)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <Button variant="outline" size="sm" className="h-10 gap-2" disabled={!media} onClick={copyPath}>
              <Copy className="h-4 w-4" />
              Copy Path
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-sm">
          {isLoading ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center gap-2">
              <RotateCcw className="h-6 w-6 animate-spin text-slate-400" />
              <span className="text-sm text-[var(--app-muted)]">Loading media detail...</span>
            </div>
          ) : media ? (
            <div className="flex flex-col">
              <div className="flex min-h-[360px] items-center justify-center border-b border-[var(--app-border)] bg-[var(--app-surface-muted)] p-6">
                {media.mime_type.startsWith('image/') ? (
                  <Image
                    src={absoluteCdnUrl(media.optimized_url || media.url)}
                    alt={media.original_name}
                    width={media.width || 1200}
                    height={media.height || 800}
                    unoptimized
                    className="max-h-[520px] w-auto max-w-full rounded-md object-contain"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-md border border-[var(--app-border)] bg-[var(--app-surface)]">
                    <FileImage className="h-12 w-12 text-slate-400" />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-6 p-6 lg:flex-row">
                <div className="flex-1 space-y-4">
                  <DetailRow label="Name" value={media.original_name} />
                  <DetailRow label="Path" value={media.path} mono />
                  <DetailRow label="URL" value={media.url} mono />
                  <DetailRow label="Optimized URL" value={media.optimized_url || '-'} mono />
                </div>
                <div className="w-full space-y-4 lg:w-80">
                  <DetailRow label="MIME" value={media.mime_type} />
                  <DetailRow label="Size" value={formatBytes(media.size)} />
                  <DetailRow label="Dimensions" value={media.width && media.height ? `${media.width} x ${media.height}` : '-'} />
                  <DetailRow label="Align" value={media.align || 'none'} />
                  <div className="space-y-2">
                    <span className="text-xs font-medium uppercase text-[var(--app-muted)]">Variants</span>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(media.variants || {}).map((key) => (
                        <a
                          key={key}
                          href={absoluteCdnUrl(media.variants?.[key] || '')}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1"
                        >
                          <Tag variant="secondary">
                            {key}
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </Tag>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-[var(--app-muted)]">Media not found.</div>
          )}
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="space-y-1">
      <span className="text-xs font-medium uppercase text-[var(--app-muted)]">{label}</span>
      <p className={mono ? 'break-all font-mono text-xs text-[var(--app-muted-strong)]' : 'text-sm text-[var(--app-muted-strong)]'}>
        {value}
      </p>
    </div>
  )
}

function absoluteCdnUrl(path: string) {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${CDN_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}

function formatBytes(size: number) {
  if (!size) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const index = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1)
  return `${(size / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`
}
