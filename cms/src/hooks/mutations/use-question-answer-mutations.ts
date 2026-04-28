"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { handleApiError } from "@/lib/error-handler";
import type { ApiItemResponse } from "@/types/common";
import type {
  CreateQuestionAnswerPayload,
  QuestionAnswer,
  UpdateQuestionAnswerPayload,
} from "@/types/question-answer";

export function useCreateQuestionAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateQuestionAnswerPayload) => {
      try {
        const { data } = await api.post<ApiItemResponse<QuestionAnswer>>(
          "/admin/question-answers",
          payload,
        );
        return data.data;
      } catch (error) {
        throw new Error(handleApiError(error, "Không thể tạo Q&A"));
      }
    },
    onSuccess: () => {
      toast.success("Tạo Q&A thành công");
      queryClient.invalidateQueries({ queryKey: ["question-answers"] });
    },
  });
}

export function useUpdateQuestionAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateQuestionAnswerPayload;
    }) => {
      try {
        const { data } = await api.put<ApiItemResponse<QuestionAnswer>>(
          `/admin/question-answers/${id}`,
          payload,
        );
        return data.data;
      } catch (error) {
        throw new Error(handleApiError(error, "Không thể cập nhật Q&A"));
      }
    },
    onSuccess: (_data, variables) => {
      toast.success("Cập nhật Q&A thành công");
      queryClient.invalidateQueries({ queryKey: ["question-answers"] });
      queryClient.invalidateQueries({
        queryKey: ["question-answers", variables.id],
      });
    },
  });
}

export function useDeleteQuestionAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        await api.delete(`/admin/question-answers/${id}`);
      } catch (error) {
        throw new Error(handleApiError(error, "Không thể xóa Q&A"));
      }
    },
    onSuccess: () => {
      toast.success("Xóa Q&A thành công");
      queryClient.invalidateQueries({ queryKey: ["question-answers"] });
    },
  });
}
