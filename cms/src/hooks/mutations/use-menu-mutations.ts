"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { handleApiError } from "@/lib/error-handler";
import type { ApiItemResponse } from "@/types/common";
import type {
  CreateMenuPayload,
  Menu,
  MenuItemPayload,
  UpdateMenuPayload,
} from "@/types/menu";

export function useCreateMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateMenuPayload) => {
      try {
        const { data } = await api.post<ApiItemResponse<Menu>>(
          "/admin/menus",
          payload,
        );
        return data.data;
      } catch (error) {
        throw new Error(handleApiError(error, "Không thể tạo menu"));
      }
    },
    onSuccess: () => {
      toast.success("Tạo menu thành công");
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
  });
}

export function useUpdateMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateMenuPayload;
    }) => {
      try {
        const { data } = await api.put<ApiItemResponse<Menu>>(
          `/admin/menus/${id}`,
          payload,
        );
        return data.data;
      } catch (error) {
        throw new Error(handleApiError(error, "Không thể cập nhật menu"));
      }
    },
    onSuccess: (_data, variables) => {
      toast.success("Cập nhật menu thành công");
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      queryClient.invalidateQueries({ queryKey: ["menus", variables.id] });
    },
  });
}

export function useDeleteMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        await api.delete(`/admin/menus/${id}`);
      } catch (error) {
        throw new Error(handleApiError(error, "Không thể xóa menu"));
      }
    },
    onSuccess: () => {
      toast.success("Xóa menu thành công");
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
  });
}

export function useSetDefaultMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        const { data } = await api.post<ApiItemResponse<Menu>>(
          `/admin/menus/${id}/default`,
        );
        return data.data;
      } catch (error) {
        throw new Error(handleApiError(error, "Không thể đặt menu mặc định"));
      }
    },
    onSuccess: () => {
      toast.success("Đã đặt menu mặc định cho trang chủ");
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
  });
}

export function useSyncMenuItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      items,
    }: {
      id: number;
      items: MenuItemPayload[];
    }) => {
      try {
        const { data } = await api.put<ApiItemResponse<Menu>>(
          `/admin/menus/${id}/items`,
          { items },
        );
        return data.data;
      } catch (error) {
        throw new Error(handleApiError(error, "Không thể lưu cấu trúc menu"));
      }
    },
    onSuccess: (_data, variables) => {
      toast.success("Đã lưu cấu trúc menu");
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      queryClient.invalidateQueries({ queryKey: ["menus", variables.id] });
    },
  });
}
