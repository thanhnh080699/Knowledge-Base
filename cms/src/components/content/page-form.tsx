"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { absoluteCdnUrl, slugify } from "@/lib/utils";
import type {
  CreatePagePayload,
  Page,
  PageStatus,
  UpdatePagePayload,
} from "@/types/page";
import { Home, ImageIcon, X } from "lucide-react";

type PagePayload = CreatePagePayload | UpdatePagePayload;

interface PageFormProps {
  mode: "create" | "edit";
  page?: Page | null;
  isSubmitting: boolean;
  onSubmit: (payload: PagePayload) => Promise<void> | void;
}

interface FormState {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  template: string;
  coverImage: string;
  coverImageFile: File | null;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  canonicalUrl: string;
  status: PageStatus;
  isHomepage: boolean;
  publishedAt: string;
}

const emptyForm: FormState = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  template: "",
  coverImage: "",
  coverImageFile: null,
  metaTitle: "",
  metaDescription: "",
  focusKeyword: "",
  canonicalUrl: "",
  status: "DRAFT",
  isHomepage: false,
  publishedAt: "",
};

const SELECT_CLASS =
  "h-10 rounded-md border border-[var(--app-input-border)] bg-[var(--app-input-bg)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--app-border-strong)]";

function toDatetimeLocal(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 16);
}

export function PageForm({
  mode,
  page,
  isSubmitting,
  onSubmit,
}: PageFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!page) return;
    setForm({
      title: page.title,
      slug: page.slug,
      content: page.content,
      excerpt: page.excerpt ?? "",
      template: page.template ?? "",
      coverImage: page.coverImage ?? "",
      coverImageFile: null,
      metaTitle: page.metaTitle ?? "",
      metaDescription: page.metaDescription ?? "",
      focusKeyword: page.focusKeyword ?? "",
      canonicalUrl: page.canonicalUrl ?? "",
      status: page.status,
      isHomepage: page.isHomepage,
      publishedAt: toDatetimeLocal(page.publishedAt),
    });
    setPreview(page.coverImage);
  }, [page]);

  function updateTitle(title: string) {
    setForm((current) => ({
      ...current,
      title,
      slug: mode === "create" ? slugify(title) : current.slug,
      metaTitle: current.metaTitle || title,
    }));
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setForm((current) => ({ ...current, coverImageFile: file }));
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function removeCoverImage() {
    setForm((current) => ({
      ...current,
      coverImage: "",
      coverImageFile: null,
    }));
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) {
      setError("Tiêu đề, slug và nội dung là bắt buộc");
      return;
    }

    try {
      await onSubmit({
        title: form.title.trim(),
        slug: form.slug.trim().toLowerCase(),
        content: form.content.trim(),
        excerpt: form.excerpt.trim() || undefined,
        template: form.template.trim() || undefined,
        coverImage: form.coverImageFile || form.coverImage || undefined,
        metaTitle: form.metaTitle.trim() || undefined,
        metaDescription: form.metaDescription.trim() || undefined,
        focusKeyword: form.focusKeyword.trim() || undefined,
        canonicalUrl: form.canonicalUrl.trim() || undefined,
        status: form.status,
        isHomepage: form.isHomepage,
        publishedAt: form.publishedAt
          ? new Date(form.publishedAt).toISOString()
          : undefined,
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Không thể lưu trang",
      );
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error ? (
        <div className="rounded-lg border border-[var(--app-danger-soft-border)] bg-[var(--app-danger-soft-bg)] px-4 py-3 text-sm text-[var(--app-danger-soft-fg)]">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div>
          <h4 className="text-base font-semibold text-[var(--foreground)]">
            Content
          </h4>
          <p className="mt-1 text-sm text-[var(--app-muted)]">
            Dùng cho About, Contact, landing page hoặc trang tĩnh cần SEO riêng.
          </p>
        </div>
        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_180px]">
            <div className="space-y-2">
              <Label htmlFor="page-title">Title</Label>
              <Input
                id="page-title"
                value={form.title}
                onChange={(event) => updateTitle(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="page-status">Status</Label>
              <select
                id="page-status"
                className={SELECT_CLASS}
                value={form.status}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    status: event.target.value as PageStatus,
                  }))
                }
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="page-slug">Slug</Label>
              <Input
                id="page-slug"
                value={form.slug}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    slug: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="page-content">Content</Label>
              <Textarea
                id="page-content"
                className="min-h-[320px] font-mono"
                value={form.content}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    content: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="page-excerpt">Excerpt</Label>
              <Textarea
                id="page-excerpt"
                className="min-h-24"
                value={form.excerpt}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    excerpt: event.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div>
          <h4 className="text-base font-semibold text-[var(--foreground)]">
            Publishing
          </h4>
          <p className="mt-1 text-sm text-[var(--app-muted)]">
            Template, trang chủ, publish date và ảnh đại diện của page.
          </p>
        </div>
        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-sm">
          <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="page-template">Template</Label>
                  <Input
                    id="page-template"
                    placeholder="default, about, contact"
                    value={form.template}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        template: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="page-published-at">Published at</Label>
                  <Input
                    id="page-published-at"
                    type="datetime-local"
                    value={form.publishedAt}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        publishedAt: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <label className="flex items-center gap-3 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-4 text-sm text-[var(--app-muted-strong)]">
                <Checkbox
                  checked={form.isHomepage}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      isHomepage: event.currentTarget.checked,
                    }))
                  }
                />
                <Home className="h-4 w-4" />
                Set as homepage
              </label>
            </div>
            <aside className="space-y-2">
              <Label>Cover image</Label>
              <div
                className="group relative flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-[var(--app-border)] bg-[var(--app-surface-muted)]"
                onClick={() => fileInputRef.current?.click()}
              >
                {preview ? (
                  <img
                    src={absoluteCdnUrl(preview)}
                    alt="Cover preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-8 w-8 text-[var(--app-muted)]" />
                )}
              </div>
              {preview ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-2 text-[var(--app-danger-soft-fg)]"
                  onClick={removeCoverImage}
                >
                  <X className="h-4 w-4" />
                  Remove image
                </Button>
              ) : null}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </aside>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div>
          <h4 className="text-base font-semibold text-[var(--foreground)]">
            SEO
          </h4>
          <p className="mt-1 text-sm text-[var(--app-muted)]">
            Metadata riêng cho các page quan trọng như aboutus và contact.
          </p>
        </div>
        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="page-meta-title">Meta title</Label>
              <Input
                id="page-meta-title"
                value={form.metaTitle}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    metaTitle: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="page-focus-keyword">Focus keyword</Label>
              <Input
                id="page-focus-keyword"
                value={form.focusKeyword}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    focusKeyword: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="page-meta-description">Meta description</Label>
              <Textarea
                id="page-meta-description"
                value={form.metaDescription}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    metaDescription: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="page-canonical-url">Canonical URL</Label>
              <Input
                id="page-canonical-url"
                value={form.canonicalUrl}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    canonicalUrl: event.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div />
        <div className="flex justify-end gap-3">
          <Button type="submit" isLoading={isSubmitting}>
            {mode === "create" ? "Create page" : "Save changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
