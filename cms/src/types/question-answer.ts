import type { Post } from "@/types/post";

export interface QuestionAnswer {
  id: number;
  postId: number;
  question: string;
  answer: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  post?: Post | null;
}

export interface QuestionAnswerFilters {
  page?: number;
  limit?: number;
  search?: string;
  postId?: number | "";
  published?: "" | "true" | "false";
}

export interface CreateQuestionAnswerPayload {
  postId: number;
  question: string;
  answer: string;
  sortOrder?: number;
  isPublished?: boolean;
}

export type UpdateQuestionAnswerPayload = Partial<CreateQuestionAnswerPayload>;
