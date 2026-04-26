"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { ApiItemResponse, ApiListResponse } from "@/types/common";
import type { Menu, MenuFilters } from "@/types/menu";

export function useMenus(filters: MenuFilters = {}) {
  return useQuery({
    queryKey: ["menus", filters],
    queryFn: async () => {
      const { data } = await api.get<ApiListResponse<Menu>>("/admin/menus", {
        params: filters,
      });
      return data.data;
    },
  });
}

export function useMenu(id: number | string | null) {
  return useQuery({
    queryKey: ["menus", id],
    queryFn: async () => {
      const { data } = await api.get<ApiItemResponse<Menu>>(
        `/admin/menus/${id}`,
      );
      return data.data;
    },
    enabled: !!id,
  });
}
