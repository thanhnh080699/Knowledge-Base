"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tag } from "@/components/ui/tag";
import {
  useDeletePage,
  useForceDeletePage,
  useRestorePage,
  useSetHomepagePage,
} from "@/hooks/mutations/use-page-mutations";
import { usePages } from "@/hooks/queries/use-pages";
import { formatDateTime, formatDisplayId } from "@/lib/admin-format";
import type { PageStatus } from "@/types/page";
import {
  ArchiveRestore,
  Filter,
  Home,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react";

interface DeleteState {
  ids: number[];
  title: string;
  description: string;
}

const FILTER_SELECT_CLASS =
  "h-10 rounded-md border border-[var(--app-input-border)] bg-[var(--app-input-bg)] px-3 text-sm text-[var(--app-muted-strong)] outline-none focus:border-[var(--app-border-strong)]";

function statusVariant(status: PageStatus) {
  if (status === "PUBLISHED") return "success";
  if (status === "ARCHIVED") return "secondary";
  return "warning";
}

export default function PagesPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<PageStatus | "">("");
  const [trashed, setTrashed] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deleteState, setDeleteState] = useState<DeleteState | null>(null);

  const filters = useMemo(
    () => ({
      page: 1,
      limit: 20,
      search: query.trim() || undefined,
      status,
      trashed,
    }),
    [query, status, trashed],
  );
  const { data: pagesResponse, isLoading } = usePages(filters);
  const deletePage = useDeletePage();
  const restorePage = useRestorePage();
  const forceDeletePage = useForceDeletePage();
  const setHomepage = useSetHomepagePage();

  const pages = pagesResponse?.data ?? [];
  const total = pagesResponse?.meta.total ?? pages.length;
  const allSelected = pages.length > 0 && selectedIds.length === pages.length;
  const partiallySelected = selectedIds.length > 0 && !allSelected;
  const isDeleting = deletePage.isPending || forceDeletePage.isPending;

  function toggleAll() {
    setSelectedIds(allSelected ? [] : pages.map((page) => page.id));
  }

  function toggleOne(pageId: number) {
    setSelectedIds((current) =>
      current.includes(pageId)
        ? current.filter((id) => id !== pageId)
        : [...current, pageId],
    );
  }

  async function handleDeleteConfirmed() {
    if (!deleteState) return;
    if (trashed)
      await Promise.all(
        deleteState.ids.map((id) => forceDeletePage.mutateAsync(id)),
      );
    else
      await Promise.all(
        deleteState.ids.map((id) => deletePage.mutateAsync(id)),
      );
    setSelectedIds((current) =>
      current.filter((id) => !deleteState.ids.includes(id)),
    );
    setDeleteState(null);
  }

  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
              Pages
            </h3>
            <span className="mt-1 text-sm text-[var(--app-muted)]">
              Manage static pages for aboutus, contact and homepage content.
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={trashed ? "default" : "outline"}
              size="sm"
              className={`h-10 gap-2 px-4 ${trashed ? "bg-rose-600 text-white hover:bg-rose-700" : ""}`}
              onClick={() => {
                setTrashed((current) => !current);
                setSelectedIds([]);
              }}
            >
              <Trash2 className="h-4 w-4" />
              Trash
            </Button>
            <Link
              href="/pages/create"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[var(--foreground)] px-4 text-sm font-medium text-[var(--app-surface)] transition-colors hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Create New
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[var(--app-border)] p-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by title, slug or content"
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select
                className={FILTER_SELECT_CLASS}
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as PageStatus | "")
                }
              >
                <option value="">All statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                className="h-10 gap-2"
                onClick={() => {
                  setQuery("");
                  setStatus("");
                  setSelectedIds([]);
                }}
              >
                <Filter className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>

          {selectedIds.length > 0 ? (
            <div className="flex items-center justify-between border-b border-[var(--app-border)] bg-[var(--app-surface-muted)] px-4 py-3">
              <span className="text-sm text-[var(--app-muted)]">
                {selectedIds.length} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2"
                onClick={() =>
                  setDeleteState({
                    ids: selectedIds,
                    title: trashed
                      ? "Permanently delete pages"
                      : "Move pages to trash",
                    description: `Are you sure you want to ${trashed ? "permanently delete" : "move to trash"} ${selectedIds.length} selected pages?`,
                  })
                }
              >
                <Trash2 className="h-4 w-4" />
                {trashed ? "Delete permanently" : "Move to trash"}
              </Button>
            </div>
          ) : null}

          <div className="relative w-full overflow-auto">
            <Table className="w-full caption-bottom text-sm">
              <TableHeader className="border-b border-[var(--app-border)] bg-[var(--app-surface-muted)]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[50px] px-4">
                    <Checkbox
                      checked={allSelected}
                      indeterminate={partiallySelected}
                      onChange={toggleAll}
                    />
                  </TableHead>
                  <TableHead className="w-[120px] px-4">ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Homepage</TableHead>
                  <TableHead>{trashed ? "Deleted At" : "Updated At"}</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="[&_tr:last-child]:border-0">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <RotateCcw className="h-6 w-6 animate-spin text-slate-400" />
                        <span className="text-sm text-[var(--app-muted)]">
                          Loading pages...
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : pages.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-20 text-center text-[var(--app-muted)]"
                    >
                      No pages found.
                    </TableCell>
                  </TableRow>
                ) : (
                  pages.map((page) => (
                    <TableRow
                      key={page.id}
                      className="border-b border-[var(--app-border)] transition-colors hover:bg-[var(--app-surface-hover)]"
                    >
                      <TableCell className="px-4">
                        <Checkbox
                          checked={selectedIds.includes(page.id)}
                          onChange={() => toggleOne(page.id)}
                        />
                      </TableCell>
                      <TableCell className="px-4 font-mono text-xs font-medium text-[var(--foreground)]">
                        {formatDisplayId(page.id)}
                      </TableCell>
                      <TableCell>
                        <div className="min-w-[260px]">
                          <div className="line-clamp-1 font-medium text-[var(--app-muted-strong)]">
                            {page.title}
                          </div>
                          <div className="truncate font-mono text-xs text-[var(--app-muted)]">
                            {page.slug}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Tag variant={statusVariant(page.status)}>
                          {page.status}
                        </Tag>
                      </TableCell>
                      <TableCell className="text-sm text-[var(--app-muted)]">
                        {page.template ?? "default"}
                      </TableCell>
                      <TableCell>
                        {page.isHomepage ? (
                          <Tag variant="success">Homepage</Tag>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-2"
                            onClick={() => setHomepage.mutate(page.id)}
                          >
                            <Home className="h-4 w-4" />
                            Set
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-[var(--app-muted)]">
                        {formatDateTime(
                          trashed ? page.deletedAt : page.updatedAt,
                        )}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {trashed ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => restorePage.mutate(page.id)}
                            >
                              <ArchiveRestore className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Link
                              href={`/pages/${page.id}`}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-[var(--app-surface-hover)]"
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[var(--app-muted)] hover:bg-[var(--app-danger-soft-bg)] hover:text-[var(--app-danger-soft-fg)]"
                            onClick={() =>
                              setDeleteState({
                                ids: [page.id],
                                title: trashed
                                  ? `Permanently delete ${page.title}`
                                  : `Move ${page.title} to trash`,
                                description: trashed
                                  ? "This action cannot be undone."
                                  : "The page can be restored from trash later.",
                              })
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between border-t border-[var(--app-border)] bg-[var(--app-surface-muted)] px-6 py-3 text-sm text-[var(--app-muted)]">
            <span>
              Showing {pages.length} of {total} results
            </span>
          </div>
        </div>
      </div>

      <Modal
        isOpen={!!deleteState}
        onClose={() => setDeleteState(null)}
        title={deleteState?.title ?? "Delete pages"}
        className="max-w-md"
      >
        <p className="text-sm text-[var(--app-muted)]">
          {deleteState?.description}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteState(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            isLoading={isDeleting}
            onClick={handleDeleteConfirmed}
          >
            {trashed ? "Delete permanently" : "Move to trash"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
