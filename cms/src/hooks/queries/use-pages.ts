"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { Page, PageFilters } from "@/types/page";

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
  };
}

export function usePages(filters: PageFilters = {}) {
  return useQuery({
    queryKey: ["pages", filters],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Page>>("/admin/pages", {
        params: filters,
      });
      return data;
    },
  });
}

export function usePage(id: number | string | null) {
  return useQuery({
    queryKey: ["pages", id],
    queryFn: async () => {
      const { data } = await api.get<{ data: Page }>(`/admin/pages/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}
