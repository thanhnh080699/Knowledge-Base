'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { File, Folder, RotateCcw, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { useMedia } from '@/hooks/queries/use-media'
import { absoluteCdnUrl } from '@/lib/utils'
import type { MediaAsset, MediaFilters, MediaFolder } from '@/types/media'

const MEDIA_PAGE_SIZE = 100

interface MediaLibraryModalProps {
  isOpen: boolean
  title?: string
  initialFolder?: string
  imagesOnly?: boolean
  onClose: () => void
  onSelect: (asset: MediaAsset) => void
}

export function MediaLibraryModal({
  isOpen,
  title = 'Select media',
  initialFolder = '',
  imagesOnly = true,
  onClose,
  onSelect,
}: MediaLibraryModalProps) {
  const [folder, setFolder] = useState(initialFolder)
  const [query, setQuery] = useState('')
  const [sort] = useState<MediaFilters['sort']>('updated_at')
  const [direction] = useState<MediaFilters['direction']>('desc')

  const filters = useMemo(() => ({ folder, sort, direction, limit: MEDIA_PAGE_SIZE }), [direction, folder, sort])
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useMedia(filters)

  const folders = data?.folders ?? []
  const parentFolder = folder.split('/').slice(0, -1).join('/')
  const files = useMemo(() => {
    const items = data?.files ?? []
    const visible = imagesOnly ? items.filter((file) => file.mime_type.startsWith('image/')) : items
    if (!query.trim()) return visible

    const normalized = query.trim().toLowerCase()
    return visible.filter((file) =>
      [file.original_name, file.file_name, file.path, file.mime_type].some((value) =>
        value.toLowerCase().includes(normalized)
      )
    )
  }, [data?.files, imagesOnly, query])

  function selectAsset(asset: MediaAsset) {
    onSelect(asset)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} description="Choose an existing image from the media library." className="max-w-5xl">
      <div className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search media by name, path, or MIME" className="pl-9" />
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--app-muted)]">
            <Button type="button" variant="outline" size="sm" onClick={() => setFolder('')}>Root</Button>
            {folder ? (
              <>
                <Button type="button" variant="outline" size="sm" onClick={() => setFolder(parentFolder)}>..</Button>
                <span className="max-w-64 truncate">{folder}</span>
              </>
            ) : null}
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-80 flex-col items-center justify-center gap-2">
            <RotateCcw className="h-6 w-6 animate-spin text-slate-400" />
            <span className="text-sm text-[var(--app-muted)]">Loading media...</span>
          </div>
        ) : (
          <div className="grid max-h-[55dvh] min-h-80 grid-cols-2 gap-3 overflow-y-auto rounded-xl border border-[var(--app-border)] p-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
            {folders.map((item) => (
              <FolderCard key={item.path} folder={item} onOpen={() => setFolder(item.path)} />
            ))}
            {files.map((file) => (
              <MediaCard key={file.path} asset={file} onSelect={() => selectAsset(file)} />
            ))}
            {folders.length + files.length === 0 ? (
              <div className="col-span-full flex min-h-64 items-center justify-center text-sm text-[var(--app-muted)]">
                No media found.
              </div>
            ) : null}
          </div>
        )}

        {!isLoading && hasNextPage ? (
          <div className="flex justify-center">
            <Button type="button" variant="outline" size="sm" disabled={isFetchingNextPage} onClick={() => fetchNextPage()}>
              {isFetchingNextPage ? <RotateCcw className="mr-2 h-4 w-4 animate-spin" /> : null}
              Show more
            </Button>
          </div>
        ) : null}
      </div>
    </Modal>
  )
}

function FolderCard({ folder, onOpen }: { folder: MediaFolder; onOpen: () => void }) {
  return (
    <button
      type="button"
      className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-lg border border-transparent p-2 text-center transition-colors hover:border-[var(--app-border)] hover:bg-[var(--app-surface-hover)]"
      onClick={onOpen}
      title={folder.path}
    >
      <span className="flex h-14 w-16 items-center justify-center rounded-md bg-[var(--app-warning-soft-bg)] text-[var(--app-warning-soft-fg)]">
        <Folder className="h-8 w-8" />
      </span>
      <span className="line-clamp-2 w-full break-words text-xs font-medium text-[var(--app-muted-strong)]">{folder.name}</span>
    </button>
  )
}

function MediaCard({ asset, onSelect }: { asset: MediaAsset; onSelect: () => void }) {
  const isImage = asset.mime_type.startsWith('image/')

  return (
    <button
      type="button"
      className="flex min-h-32 flex-col items-center gap-2 rounded-lg border border-transparent p-2 text-center transition-colors hover:border-[var(--app-border)] hover:bg-[var(--app-surface-hover)]"
      onClick={onSelect}
      title={asset.path}
    >
      <span className="flex h-20 w-full items-center justify-center overflow-hidden rounded-md border border-[var(--app-border)] bg-[var(--app-surface-muted)]">
        {isImage ? (
          <Image
            src={absoluteCdnUrl(asset.variants?.thumbnail || asset.url)}
            alt={asset.alt || asset.original_name}
            width={180}
            height={120}
            unoptimized
            className="h-full w-full object-cover"
          />
        ) : (
          <File className="h-8 w-8 text-slate-400" />
        )}
      </span>
      <span className="line-clamp-2 w-full break-words text-xs font-medium leading-4 text-[var(--app-muted-strong)]">
        {asset.original_name}
      </span>
    </button>
  )
}
