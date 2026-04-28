'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Modal } from '@/components/ui/modal'
import { useMedia } from '@/hooks/queries/use-media'
import {
  useCreateFolder,
  useDeleteFolder,
  useDeleteMedia,
  useMoveMedia,
  useRenameFolder,
  useUploadMedia,
} from '@/hooks/mutations/use-media-mutations'
import type { MediaAsset, MediaFilters, MediaFolder } from '@/types/media'
import {
  ArrowDownAZ,
  ArrowUpAZ,
  File,
  Folder,
  FolderInput,
  FolderPlus,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  Upload,
} from 'lucide-react'
import { absoluteCdnUrl } from '@/lib/utils'

const SELECT_CLASS =
  'h-10 rounded-md border border-[var(--app-input-border)] bg-[var(--app-input-bg)] px-3 text-sm text-[var(--app-muted-strong)] outline-none focus:border-[var(--app-border-strong)]'
const MEDIA_PAGE_SIZE = 100

export default function MediaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialFolder = searchParams.get('folder') || ''
  const [folder, setFolder] = useState(initialFolder)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<MediaFilters['sort']>('updated_at')
  const [direction, setDirection] = useState<MediaFilters['direction']>('desc')
  const [selectedPaths, setSelectedPaths] = useState<string[]>([])
  const [uploadOpen, setUploadOpen] = useState(false)
  const [folderOpen, setFolderOpen] = useState(false)
  const [moveOpen, setMoveOpen] = useState(false)
  const [renameFolder, setRenameFolder] = useState<MediaFolder | null>(null)
  const [deleteFolder, setDeleteFolder] = useState<MediaFolder | null>(null)

  const filters = useMemo(() => ({ folder, sort, direction, limit: MEDIA_PAGE_SIZE }), [direction, folder, sort])
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useMedia(filters)
  const uploadMedia = useUploadMedia()
  const deleteMedia = useDeleteMedia()
  const moveMedia = useMoveMedia()

  const folders = data?.folders ?? []
  const files = useMemo(() => {
    const items = data?.files ?? []
    if (!query.trim()) return items
    const normalized = query.trim().toLowerCase()
    return items.filter((file) =>
      [file.original_name, file.file_name, file.path, file.mime_type].some((value) =>
        value.toLowerCase().includes(normalized)
      )
    )
  }, [data?.files, query])

  const visibleItemsCount = folders.length + files.length
  const totalFiles = data?.total ?? files.length
  const allSelected = files.length > 0 && selectedPaths.length === files.length
  const partiallySelected = selectedPaths.length > 0 && !allSelected
  const parentFolder = folder.split('/').slice(0, -1).join('/')

  function openFolder(nextFolder: string) {
    setFolder(nextFolder)
    setSelectedPaths([])
    router.push(mediaListHref(nextFolder))
  }

  function toggleAll() {
    setSelectedPaths(allSelected ? [] : files.map((file) => file.path))
  }

  function toggleOne(path: string) {
    setSelectedPaths((current) =>
      current.includes(path) ? current.filter((item) => item !== path) : [...current, path]
    )
  }

  async function handleBulkDelete() {
    await Promise.all(selectedPaths.map((path) => deleteMedia.mutateAsync(path)))
    setSelectedPaths([])
  }

  async function handleBulkMove(targetFolder: string) {
    await Promise.all(selectedPaths.map((path) => moveMedia.mutateAsync({ path, folder: targetFolder })))
    setSelectedPaths([])
    setMoveOpen(false)
  }

  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-[var(--foreground)]">Media Manager</h3>
            <span className="mt-1 text-sm text-[var(--app-muted)]">
              Upload, manage folders, move, and organize media via API.
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="h-10 gap-2" disabled={selectedPaths.length === 0} onClick={() => setMoveOpen(true)}>
              <FolderInput className="h-4 w-4" />
              Move
              <span className="rounded-full bg-[var(--app-surface-muted)] px-2 py-0.5 text-xs text-[var(--app-muted-strong)]">
                {selectedPaths.length}
              </span>
            </Button>
            <Button variant="outline" size="sm" className="h-10 gap-2" disabled={selectedPaths.length === 0} onClick={handleBulkDelete}>
              <Trash2 className="h-4 w-4" />
              Trash
            </Button>
            <Button variant="outline" size="sm" className="h-10 gap-2" onClick={() => setFolderOpen(true)}>
              <FolderPlus className="h-4 w-4" />
              Folder
            </Button>
            <Button size="sm" className="h-10 gap-2" onClick={() => setUploadOpen(true)}>
              <Plus className="h-4 w-4" />
              Upload
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[var(--app-border)] p-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search media by name, path, or MIME" className="pl-9" />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select className={SELECT_CLASS} value={sort} onChange={(event) => setSort(event.target.value as MediaFilters['sort'])}>
                <option value="updated_at">Latest</option>
                <option value="name">Name</option>
                <option value="size">Size</option>
              </select>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10"
                title="Toggle sort direction"
                onClick={() => setDirection(direction === 'asc' ? 'desc' : 'asc')}
              >
                {direction === 'asc' ? <ArrowUpAZ className="h-4 w-4" /> : <ArrowDownAZ className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 border-b border-[var(--app-border)] px-4 py-3 text-sm">
            <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => openFolder('')}>
              Root
            </Button>
            {folder && (
              <>
                <span className="text-slate-400">/</span>
                <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => openFolder(parentFolder)}>
                  ..
                </Button>
                <span className="text-[var(--app-muted)]">{folder}</span>
              </>
            )}
          </div>

          <div className="flex items-center justify-between border-b border-[var(--app-border)] bg-[var(--app-surface-muted)] px-4 py-3">
            <div className="flex items-center gap-3 text-sm text-[var(--app-muted)]">
              <Checkbox checked={allSelected} indeterminate={partiallySelected} onChange={toggleAll} />
              <span>Select all files</span>
            </div>
            <span className="text-sm text-[var(--app-muted)]">
              {visibleItemsCount} items
            </span>
          </div>

          {isLoading ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center gap-2">
              <RotateCcw className="h-6 w-6 animate-spin text-slate-400" />
              <span className="text-sm text-[var(--app-muted)]">Loading media...</span>
            </div>
          ) : (
            <div className="grid min-h-[360px] items-start grid-cols-3 gap-3 p-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
              {folders.map((item) => (
                <FolderTile
                  key={item.path}
                  folder={item}
                  onOpen={() => openFolder(item.path)}
                  onRename={() => setRenameFolder(item)}
                  onDelete={() => setDeleteFolder(item)}
                />
              ))}
              {files.map((file) => (
                <MediaTile
                  key={file.path}
                  file={file}
                  folder={folder}
                  selected={selectedPaths.includes(file.path)}
                  onSelect={() => toggleOne(file.path)}
                  onDelete={() => deleteMedia.mutate(file.path)}
                />
              ))}
              {visibleItemsCount === 0 && (
                <div className="col-span-full flex min-h-[280px] items-center justify-center text-sm text-[var(--app-muted)]">
                  No media found.
                </div>
              )}
            </div>
          )}

          {!isLoading && hasNextPage && (
            <div className="flex justify-center border-t border-[var(--app-border)] px-4 py-4">
              <Button
                variant="outline"
                size="sm"
                className="h-10 gap-2"
                disabled={isFetchingNextPage}
                onClick={() => fetchNextPage()}
              >
                {isFetchingNextPage && <RotateCcw className="h-4 w-4 animate-spin" />}
                Show more
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-[var(--app-border)] bg-[var(--app-surface-muted)] px-6 py-3 text-sm text-[var(--app-muted)]">
            <span>
              Showing {folders.length} folders and {files.length} of {totalFiles} files
            </span>
            <span>{folder || 'root'}</span>
          </div>
        </div>
      </div>

      <UploadModal isOpen={uploadOpen} folder={folder} onClose={() => setUploadOpen(false)} onSubmit={(payload) => uploadMedia.mutateAsync(payload)} />
      <FolderModal isOpen={folderOpen} baseFolder={folder} onClose={() => setFolderOpen(false)} />
      <RenameFolderModal folder={renameFolder} onClose={() => setRenameFolder(null)} />
      <DeleteFolderModal folder={deleteFolder} onClose={() => setDeleteFolder(null)} />
      <MoveModal isOpen={moveOpen} currentFolder={folder} count={selectedPaths.length} onClose={() => setMoveOpen(false)} onMove={handleBulkMove} />
    </div>
  )
}

function mediaListHref(folder: string) {
  return folder ? `/media?folder=${encodeURIComponent(folder)}` : '/media'
}

function FolderTile({ folder, onOpen, onRename, onDelete }: { folder: MediaFolder; onOpen: () => void; onRename: () => void; onDelete: () => void }) {
  return (
    <div className="group relative flex flex-col items-center rounded-lg border border-transparent p-2 text-center transition-all duration-200 hover:border-[var(--app-border)] hover:bg-[var(--app-surface-hover)] hover:shadow-sm">
      <button type="button" className="flex w-full flex-col items-center gap-1.5" onClick={onOpen} title={folder.path}>
        <span className="flex h-14 w-16 items-center justify-center rounded-md bg-[var(--app-warning-soft-bg)] text-[var(--app-warning-soft-fg)]">
          <Folder className="h-8 w-8" />
        </span>
        <span className="line-clamp-2 w-full break-words text-xs font-medium leading-4 text-[var(--app-muted-strong)]">
          {folder.name}
        </span>
      </button>
      <div className="absolute right-2 top-2 hidden items-center gap-1 rounded-md border border-[var(--app-border)] bg-[var(--app-surface)] p-1 shadow-sm group-hover:flex">
        <Button variant="ghost" size="icon" className="h-7 w-7" title="Rename folder" onClick={onRename}>
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-red-600" title="Delete folder" onClick={onDelete}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}

function MediaTile({
  file,
  folder,
  selected,
  onSelect,
  onDelete,
}: {
  file: MediaAsset
  folder: string
  selected: boolean
  onSelect: () => void
  onDelete: () => void
}) {
  const isImage = file.mime_type.startsWith('image/')
  const detailParams = new URLSearchParams({ path: file.path })
  if (folder) detailParams.set('folder', folder)

  return (
    <div
      className={[
        'group relative flex flex-col items-center rounded-lg border p-2 text-center transition-all duration-200',
        selected
          ? 'border-[var(--app-border-strong)] bg-[var(--app-surface-hover)] shadow-sm'
          : 'border-transparent hover:border-[var(--app-border)] hover:bg-[var(--app-surface-hover)] hover:shadow-sm',
      ].join(' ')}
    >
      <div className="absolute left-2 top-2 z-10 rounded bg-[var(--app-surface)] shadow-sm" title="Select file">
        <Checkbox checked={selected} onChange={onSelect} />
      </div>
      <Link href={`/media/detail?${detailParams.toString()}`} className="flex w-full flex-col items-center gap-2" title={file.path}>
        <div className="flex h-14 w-16 items-center justify-center overflow-hidden rounded-md border border-[var(--app-border)] bg-[var(--app-surface-muted)]">
          {isImage ? (
            <Image
              src={absoluteCdnUrl(file.variants?.thumbnail || file.url)}
              alt=""
              width={160}
              height={120}
              unoptimized
              className="h-full w-full object-cover"
            />
          ) : (
            <File className="h-8 w-8 text-slate-400" />
          )}
        </div>
        <span className="line-clamp-2 w-full break-words text-xs font-medium leading-4 text-[var(--app-muted-strong)]">
          {file.original_name}
        </span>
      </Link>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 hidden h-7 w-7 border border-[var(--app-border)] bg-[var(--app-surface)] text-slate-500 shadow-sm hover:text-red-600 group-hover:inline-flex"
        title="Delete media"
        onClick={onDelete}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}

function UploadModal({ isOpen, folder, onClose, onSubmit }: { isOpen: boolean; folder: string; onClose: () => void; onSubmit: (payload: { file: File; folder?: string }) => Promise<unknown> }) {
  const [file, setFile] = useState<File | null>(null)

  async function submit() {
    if (!file) return
    await onSubmit({ file, folder })
    setFile(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Media">
      <div className="space-y-6">
        <div className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[var(--app-border)] bg-[var(--app-surface-muted)] p-10 text-center transition-colors hover:border-[var(--app-border-strong)] hover:bg-[var(--app-surface-hover)]">
          <input 
            type="file" 
            accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.mp4,.mov,.avi,.webm,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
            className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
            onChange={(event) => setFile(event.target.files?.[0] || null)} 
          />
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--app-surface)] shadow-sm">
              <Upload className="h-8 w-8 text-[var(--app-muted-strong)]" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-semibold text-[var(--app-muted-strong)]">
                {file ? file.name : 'Drop your files here'}
              </p>
              {!file && (
                <p className="text-sm text-[var(--app-muted)]">
                  or <span className="text-[var(--app-primary)] font-medium">browse files</span>
                </p>
              )}
            </div>
            <p className="mt-2 text-xs text-[var(--app-muted)]">
              Destination: <span className="font-mono">{folder || 'root'}</span>
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} disabled={!file}>
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>
    </Modal>
  )
}

function FolderModal({ isOpen, baseFolder, onClose }: { isOpen: boolean; baseFolder: string; onClose: () => void }) {
  const [name, setName] = useState('')
  const createFolder = useCreateFolder()

  async function submit() {
    const path = [baseFolder, name].filter(Boolean).join('/')
    await createFolder.mutateAsync(path)
    setName('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create folder">
      <div className="space-y-4">
        <Field label="Folder name">
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="documents" />
        </Field>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} disabled={!name.trim()}>Create</Button>
        </div>
      </div>
    </Modal>
  )
}

function RenameFolderModal({ folder, onClose }: { folder: MediaFolder | null; onClose: () => void }) {
  const [name, setName] = useState('')
  const rename = useRenameFolder()

  async function submit() {
    if (!folder || !name.trim()) return
    const parent = folder.path.split('/').slice(0, -1).join('/')
    await rename.mutateAsync({ oldPath: folder.path, newPath: [parent, name].filter(Boolean).join('/') })
    setName('')
    onClose()
  }

  return (
    <Modal isOpen={!!folder} onClose={onClose} title="Rename folder">
      <div className="space-y-4">
        <Field label="New name">
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder={folder?.name} />
        </Field>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} disabled={!name.trim()}>Rename</Button>
        </div>
      </div>
    </Modal>
  )
}

function DeleteFolderModal({ folder, onClose }: { folder: MediaFolder | null; onClose: () => void }) {
  const deleteFolder = useDeleteFolder()

  async function submit() {
    if (!folder) return
    await deleteFolder.mutateAsync(folder.path)
    onClose()
  }

  return (
    <Modal isOpen={!!folder} onClose={onClose} title="Delete Folder" description="This action will delete all files and subfolders.">
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant="destructive" onClick={submit}>Delete</Button>
      </div>
    </Modal>
  )
}

function MoveModal({ isOpen, currentFolder, count, onClose, onMove }: { isOpen: boolean; currentFolder: string; count: number; onClose: () => void; onMove: (folder: string) => Promise<void> }) {
  const [targetFolder, setTargetFolder] = useState(currentFolder)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Move Media" description={`Move ${count} files to the specified folder.`}>
      <div className="space-y-4">
        <Field label="Target folder">
          <Input value={targetFolder} onChange={(event) => setTargetFolder(event.target.value)} placeholder="media/archive" />
        </Field>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onMove(targetFolder)}>Move</Button>
        </div>
      </div>
    </Modal>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex-1 space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  )
}
