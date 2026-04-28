"use client";

import { useRouter } from "next/navigation";
import { PageForm } from "@/components/content/page-form";
import { useCreatePage } from "@/hooks/mutations/use-page-mutations";
import type { CreatePagePayload, UpdatePagePayload } from "@/types/page";

export default function CreatePagePage() {
  const router = useRouter();
  const createPage = useCreatePage();

  async function handleSubmit(payload: CreatePagePayload | UpdatePagePayload) {
    await createPage.mutateAsync(payload as CreatePagePayload);
    router.push("/pages");
  }

  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-6">
        <div>
          <div className="text-sm text-[var(--app-muted)]">
            Dashboard / Pages
          </div>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            Create Page
          </h3>
          <span className="mt-1 block text-sm text-[var(--app-muted)]">
            Tạo trang tĩnh cho About, Contact hoặc landing page.
          </span>
        </div>
        <PageForm
          mode="create"
          isSubmitting={createPage.isPending}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
