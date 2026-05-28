"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { handleApiError } from "@/lib/error-handler";
import type { ApiItemResponse } from "@/types/common";
import type {
  LlmProvider,
  LlmProviderPayload,
  SendTestEmailPayload,
  SendTestEmailResult,
  SettingsGroup,
  TestLlmConnectionPayload,
  TestLlmConnectionResult,
  UpdateSettingsGroupPayload,
} from "@/types/settings";

export function useUpdateSettingsGroup(group: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateSettingsGroupPayload) => {
      try {
        const { data } = await api.put<ApiItemResponse<SettingsGroup>>(
          `/admin/settings/${group}`,
          payload,
        );
        return data.data;
      } catch (error) {
        throw new Error(handleApiError(error, "Không thể cập nhật cài đặt"));
      }
    },
    onSuccess: () => {
      toast.success("Cập nhật cài đặt thành công");
      queryClient.invalidateQueries({ queryKey: ["settings", group] });
    },
  });
}

export function useSendTestEmail() {
  return useMutation({
    mutationFn: async (payload: SendTestEmailPayload) => {
      try {
        const { data } = await api.post<ApiItemResponse<SendTestEmailResult>>(
          "/admin/settings/email/test",
          payload,
        );
        return data.data;
      } catch (error) {
        throw new Error(handleApiError(error, "Không thể gửi email kiểm tra"));
      }
    },
    onSuccess: () => {
      toast.success("Đã gửi email kiểm tra");
    },
  });
}

export function useTestLlmConnection() {
  return useMutation({
    mutationFn: async (payload: TestLlmConnectionPayload) => {
      try {
        const { data } = await api.post<
          ApiItemResponse<TestLlmConnectionResult>
        >("/admin/settings/llm/test", payload);
        return data.data;
      } catch (error) {
        throw new Error(
          handleApiError(error, "Không thể kết nối tới LLM provider"),
        );
      }
    },
    onSuccess: (data) => {
      const suffix =
        data.modelFound === false
          ? ", nhưng model đã chọn không có trong danh sách trả về"
          : "";
      toast.success(`Kết nối LLM thành công${suffix}`);
    },
  });
}

export function useCreateLlmProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: LlmProviderPayload) => {
      try {
        const { data } = await api.post<ApiItemResponse<LlmProvider>>(
          "/admin/settings/llm/providers",
          payload,
        );
        return data.data;
      } catch (error) {
        throw new Error(handleApiError(error, "Không thể tạo LLM provider"));
      }
    },
    onSuccess: () => {
      toast.success("Đã tạo LLM provider");
      queryClient.invalidateQueries({
        queryKey: ["settings", "llm-providers"],
      });
    },
  });
}

export function useUpdateLlmProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: LlmProviderPayload;
    }) => {
      try {
        const { data } = await api.put<ApiItemResponse<LlmProvider>>(
          `/admin/settings/llm/providers/${id}`,
          payload,
        );
        return data.data;
      } catch (error) {
        throw new Error(
          handleApiError(error, "Không thể cập nhật LLM provider"),
        );
      }
    },
    onSuccess: () => {
      toast.success("Đã cập nhật LLM provider");
      queryClient.invalidateQueries({
        queryKey: ["settings", "llm-providers"],
      });
    },
  });
}

export function useDeleteLlmProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        await api.delete(`/admin/settings/llm/providers/${id}`);
      } catch (error) {
        throw new Error(handleApiError(error, "Không thể xóa LLM provider"));
      }
    },
    onSuccess: () => {
      toast.success("Đã xóa LLM provider");
      queryClient.invalidateQueries({
        queryKey: ["settings", "llm-providers"],
      });
    },
  });
}

export function useTestSavedLlmProvider() {
  return useMutation({
    mutationFn: async (id: number) => {
      try {
        const { data } = await api.post<
          ApiItemResponse<TestLlmConnectionResult>
        >(`/admin/settings/llm/providers/${id}/test`);
        return data.data;
      } catch (error) {
        throw new Error(
          handleApiError(error, "Không thể kết nối tới LLM provider"),
        );
      }
    },
    onSuccess: (data) => {
      const suffix =
        data.modelFound === false
          ? ", nhưng model đã lưu không có trong danh sách trả về"
          : "";
      toast.success(`Kết nối LLM provider thành công${suffix}`);
    },
  });
}
