"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { handleApiError } from "@/lib/error-handler";
import { normalizeCdnPath } from "@/lib/utils";
import type { ApiItemResponse } from "@/types/common";
import type { CreatePagePayload, Page, UpdatePagePayload } from "@/types/page";

async function uploadCoverImage(image: string | File | undefined) {
  if (!image || typeof image === "string") return normalizeCdnPath(image);

  const form = new FormData();
  form.append("file", image);
  form.append("folder", "Pages");

  const { data } = await api.post<ApiItemResponse<{ path: string; url: string }>>(
    "/admin/media/upload",
    form,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );

  return normalizeCdnPath(data.data.path || data.data.url);
}

export function useCreatePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePagePayload) => {
      try {
        const coverImage = await uploadCoverImage(payload.coverImage);
        const { data } = await api.post<ApiItemResponse<Page>>("/admin/pages", {
          ...payload,
          coverImage,
        });
        return data.data;
      } catch (error) {
        throw new Error(handleApiError(error, "Không thể tạo trang"));
      }
    },
    onSuccess: () => {
      toast.success("Tạo trang thành công");
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });
}

export function useUpdatePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdatePagePayload;
    }) => {
      try {
        const coverImage = await uploadCoverImage(payload.coverImage);
        const { data } = await api.put<ApiItemResponse<Page>>(
          `/admin/pages/${id}`,
          {
            ...payload,
            coverImage,
          },
        );
        return data.data;
      } catch (error) {
        throw new Error(handleApiError(error, "Không thể cập nhật trang"));
      }
    },
    onSuccess: (_data, variables) => {
      toast.success("Cập nhật trang thành công");
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      queryClient.invalidateQueries({ queryKey: ["pages", variables.id] });
    },
  });
}

export function useDeletePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        await api.delete(`/admin/pages/${id}`);
      } catch (error) {
        throw new Error(
          handleApiError(error, "Không thể chuyển trang vào thùng rác"),
        );
      }
    },
    onSuccess: () => {
      toast.success("Đã chuyển trang vào thùng rác");
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });
}

export function useRestorePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        const { data } = await api.post<ApiItemResponse<Page>>(
          `/admin/pages/${id}/restore`,
        );
        return data.data;
      } catch (error) {
        throw new Error(handleApiError(error, "Không thể khôi phục trang"));
      }
    },
    onSuccess: () => {
      toast.success("Khôi phục trang thành công");
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });
}

export function useForceDeletePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        await api.delete(`/admin/pages/${id}/force`);
      } catch (error) {
        throw new Error(handleApiError(error, "Không thể xóa vĩnh viễn trang"));
      }
    },
    onSuccess: () => {
      toast.success("Xóa vĩnh viễn trang thành công");
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });
}

export function useSetHomepagePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        const { data } = await api.post<ApiItemResponse<Page>>(
          `/admin/pages/${id}/homepage`,
        );
        return data.data;
      } catch (error) {
        throw new Error(handleApiError(error, "Không thể đặt trang chủ"));
      }
    },
    onSuccess: () => {
      toast.success("Đã đặt làm trang chủ");
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });
}
