"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type {
  QuestionAnswer,
  QuestionAnswerFilters,
} from "@/types/question-answer";

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
  };
}

export function useQuestionAnswers(filters: QuestionAnswerFilters = {}) {
  return useQuery({
    queryKey: ["question-answers", filters],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<QuestionAnswer>>(
        "/admin/question-answers",
        { params: filters },
      );
      return data;
    },
  });
}

export function useQuestionAnswer(id: number | string | null) {
  return useQuery({
    queryKey: ["question-answers", id],
    queryFn: async () => {
      const { data } = await api.get<{ data: QuestionAnswer }>(
        `/admin/question-answers/${id}`,
      );
      return data.data;
    },
    enabled: !!id,
  });
}
