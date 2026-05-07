'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/axios';
import { handleApiError } from '@/lib/error-handler';
import type { ContactRequest } from '@/types/contact';

export function useUpdateContactStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const { data } = await api.put<{ data: ContactRequest }>(`/admin/contact-requests/${id}`, { status });
      return data.data;
    },
    onSuccess: () => {
      toast.success('Đã cập nhật trạng thái liên hệ');
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: (error) => {
      toast.error(handleApiError(error, 'Không thể cập nhật trạng thái liên hệ'));
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/contact-requests/${id}`);
    },
    onSuccess: () => {
      toast.success('Đã xóa liên hệ thành công');
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: (error) => {
      toast.error(handleApiError(error, 'Không thể xóa liên hệ'));
    },
  });
}
