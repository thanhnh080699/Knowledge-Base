"use client";

import { useParams, useRouter } from "next/navigation";
import { PageForm } from "@/components/content/page-form";
import { useUpdatePage } from "@/hooks/mutations/use-page-mutations";
import { usePage } from "@/hooks/queries/use-pages";
import type { CreatePagePayload, UpdatePagePayload } from "@/types/page";

export default function EditPagePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const pageId = Number(params.id);
  const { data: page, isLoading } = usePage(
    Number.isNaN(pageId) ? null : pageId,
  );
  const updatePage = useUpdatePage();

  async function handleSubmit(payload: CreatePagePayload | UpdatePagePayload) {
    if (Number.isNaN(pageId)) throw new Error("Page ID không hợp lệ");
    await updatePage.mutateAsync({
      id: pageId,
      payload: payload as UpdatePagePayload,
    });
    router.push("/pages");
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-sm">
        <span className="text-sm text-[var(--app-muted)]">Loading page...</span>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="mx-auto w-full max-w-7xl rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-sm">
        <span className="text-sm text-[var(--app-muted)]">Page not found.</span>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-6">
        <div>
          <div className="text-sm text-[var(--app-muted)]">
            Dashboard / Pages
          </div>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            Edit Page
          </h3>
          <span className="mt-1 block text-sm text-[var(--app-muted)]">
            Chỉnh sửa nội dung, trạng thái và SEO metadata của trang.
          </span>
        </div>
        <PageForm
          mode="edit"
          page={page}
          isSubmitting={updatePage.isPending}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
