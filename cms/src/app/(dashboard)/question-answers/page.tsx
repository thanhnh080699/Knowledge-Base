"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateQuestionAnswer,
  useDeleteQuestionAnswer,
  useUpdateQuestionAnswer,
} from "@/hooks/mutations/use-question-answer-mutations";
import { useQuestionAnswers } from "@/hooks/queries/use-question-answers";
import { usePosts } from "@/hooks/queries/use-posts";
import { formatDateTime, formatDisplayId } from "@/lib/admin-format";
import type {
  CreateQuestionAnswerPayload,
  QuestionAnswer,
} from "@/types/question-answer";
import {
  Filter,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react";

const FILTER_SELECT_CLASS =
  "h-10 rounded-md border border-[var(--app-input-border)] bg-[var(--app-input-bg)] px-3 text-sm text-[var(--app-muted-strong)] outline-none focus:border-[var(--app-border-strong)]";

type FormState = {
  postId: string;
  question: string;
  answer: string;
  sortOrder: string;
  isPublished: boolean;
};

const EMPTY_FORM: FormState = {
  postId: "",
  question: "",
  answer: "",
  sortOrder: "0",
  isPublished: true,
};

function toFormState(item: QuestionAnswer | null): FormState {
  if (!item) return EMPTY_FORM;

  return {
    postId: String(item.postId),
    question: item.question,
    answer: item.answer,
    sortOrder: String(item.sortOrder ?? 0),
    isPublished: item.isPublished,
  };
}

function toPayload(form: FormState): CreateQuestionAnswerPayload {
  return {
    postId: Number(form.postId),
    question: form.question.trim(),
    answer: form.answer.trim(),
    sortOrder: Number(form.sortOrder) || 0,
    isPublished: form.isPublished,
  };
}

export default function QuestionAnswersPage() {
  const [query, setQuery] = useState("");
  const [published, setPublished] = useState<"" | "true" | "false">("");
  const [postId, setPostId] = useState<number | "">("");
  const [editingItem, setEditingItem] = useState<QuestionAnswer | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<QuestionAnswer | null>(null);

  const filters = useMemo(
    () => ({
      page: 1,
      limit: 20,
      search: query.trim() || undefined,
      postId,
      published,
    }),
    [postId, published, query],
  );

  const { data: response, isLoading } = useQuestionAnswers(filters);
  const { data: postsResponse } = usePosts({ page: 1, limit: 100 });
  const createQuestionAnswer = useCreateQuestionAnswer();
  const updateQuestionAnswer = useUpdateQuestionAnswer();
  const deleteQuestionAnswer = useDeleteQuestionAnswer();

  const items = useMemo(() => response?.data ?? [], [response?.data]);
  const posts = useMemo(() => postsResponse?.data ?? [], [postsResponse?.data]);
  const total = response?.meta.total ?? items.length;
  const isSaving = createQuestionAnswer.isPending || updateQuestionAnswer.isPending;

  function openCreateModal() {
    setEditingItem(null);
    setForm({ ...EMPTY_FORM, postId: posts[0] ? String(posts[0].id) : "" });
    setIsFormOpen(true);
  }

  function openEditModal(item: QuestionAnswer) {
    setEditingItem(item);
    setForm(toFormState(item));
    setIsFormOpen(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = toPayload(form);

    if (editingItem) {
      await updateQuestionAnswer.mutateAsync({ id: editingItem.id, payload });
    } else {
      await createQuestionAnswer.mutateAsync(payload);
    }

    setIsFormOpen(false);
    setEditingItem(null);
  }

  async function handleDeleteConfirmed() {
    if (!deleteItem) return;
    await deleteQuestionAnswer.mutateAsync(deleteItem.id);
    setDeleteItem(null);
  }

  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
              Question & Answer
            </h3>
            <span className="mt-1 text-sm text-[var(--app-muted)]">
              Manage post-specific FAQs for website content.
            </span>
          </div>
          <Button className="h-10 gap-2 px-4" onClick={openCreateModal}>
            <Plus className="h-4 w-4" />
            Create New
          </Button>
        </div>

        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[var(--app-border)] p-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by question or answer"
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select
                className={FILTER_SELECT_CLASS}
                value={published}
                onChange={(event) =>
                  setPublished(event.target.value as "" | "true" | "false")
                }
              >
                <option value="">All statuses</option>
                <option value="true">Published</option>
                <option value="false">Draft</option>
              </select>
              <select
                value={postId}
                onChange={(event) =>
                  setPostId(event.target.value ? Number(event.target.value) : "")
                }
                className={`${FILTER_SELECT_CLASS} w-52`}
              >
                <option value="">All posts</option>
                {posts.map((post) => (
                  <option key={post.id} value={post.id}>
                    {post.title}
                  </option>
                ))}
              </select>
              <Button
                variant="outline"
                size="sm"
                className="h-10 gap-2"
                onClick={() => {
                  setQuery("");
                  setPublished("");
                  setPostId("");
                }}
              >
                <Filter className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>

          <div className="relative w-full overflow-auto">
            <Table className="w-full caption-bottom text-sm">
              <TableHeader className="border-b border-[var(--app-border)] bg-[var(--app-surface-muted)]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[120px] px-4">ID</TableHead>
                  <TableHead>Post</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Updated At</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="[&_tr:last-child]:border-0">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <RotateCcw className="h-6 w-6 animate-spin text-slate-400" />
                        <span className="text-sm text-[var(--app-muted)]">
                          Loading Q&A...
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-20 text-center text-[var(--app-muted)]"
                    >
                      No Q&A found.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow
                      key={item.id}
                      className="border-b border-[var(--app-border)] transition-colors hover:bg-[var(--app-surface-hover)]"
                    >
                      <TableCell className="px-4 font-mono text-xs font-medium text-[var(--foreground)]">
                        {formatDisplayId(item.id)}
                      </TableCell>
                      <TableCell>
                        <div className="min-w-[220px]">
                          <div className="line-clamp-1 text-sm font-medium text-[var(--app-muted-strong)]">
                            {item.post?.title ?? `Post #${item.postId}`}
                          </div>
                          <div className="truncate font-mono text-xs text-[var(--app-muted)]">
                            {item.post?.slug ?? item.postId}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="min-w-[320px] max-w-2xl">
                          <div className="line-clamp-1 font-medium text-[var(--app-muted-strong)]">
                            {item.question}
                          </div>
                          <div className="line-clamp-2 text-xs text-[var(--app-muted)]">
                            {item.answer}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Tag variant={item.isPublished ? "success" : "secondary"}>
                          {item.isPublished ? "Published" : "Draft"}
                        </Tag>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-[var(--app-muted)]">
                        {item.sortOrder}
                      </TableCell>
                      <TableCell className="text-sm text-[var(--app-muted)]">
                        {formatDateTime(item.updatedAt)}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEditModal(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[var(--app-muted)] hover:bg-[var(--app-danger-soft-bg)] hover:text-[var(--app-danger-soft-fg)]"
                            onClick={() => setDeleteItem(item)}
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
              Showing {items.length} of {total} results
            </span>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingItem ? "Edit Q&A" : "Create Q&A"}
        className="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="postId">Post</Label>
            <select
              id="postId"
              value={form.postId}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  postId: event.target.value,
                }))
              }
              className="h-10 w-full rounded-md border border-[var(--app-input-border)] bg-[var(--app-input-bg)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--app-border-strong)]"
              required
            >
              <option value="" disabled>
                Select a post
              </option>
              {posts.map((post) => (
                <option key={post.id} value={post.id}>
                  {post.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              value={form.question}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  question: event.target.value,
                }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="answer">Answer</Label>
            <Textarea
              id="answer"
              value={form.answer}
              onChange={(event) =>
                setForm((current) => ({ ...current, answer: event.target.value }))
              }
              className="min-h-40"
              required
            />
          </div>

          <div className="max-w-36 space-y-2">
            <div className="space-y-2">
              <Label htmlFor="sortOrder">Order</Label>
              <Input
                id="sortOrder"
                type="number"
                min={0}
                value={form.sortOrder}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    sortOrder: event.target.value,
                  }))
                }
              />
            </div>
          </div>

          <label className="flex items-center gap-3 rounded-md border border-[var(--app-border)] bg-[var(--app-surface-muted)] px-3 py-2 text-sm text-[var(--app-muted-strong)]">
            <Checkbox
              checked={form.isPublished}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  isPublished: event.target.checked,
                }))
              }
            />
            Published
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsFormOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {editingItem ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        title="Delete Q&A"
        className="max-w-md"
      >
        <p className="text-sm text-[var(--app-muted)]">
          Are you sure you want to delete this Q&A? This action cannot be
          undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteItem(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            isLoading={deleteQuestionAnswer.isPending}
            onClick={handleDeleteConfirmed}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
