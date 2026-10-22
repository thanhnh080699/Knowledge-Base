'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { ContactRequest, ContactFilters } from '@/types/contact';


export function useContacts(filters: ContactFilters = {}) {
  return useQuery({
    queryKey: ['contacts', filters],
    queryFn: async () => {
      const { data } = await api.get<{ data: ContactRequest[] }>('/admin/contact-requests', {
        params: filters,
      });
      // API currently returns non-paginated data for contact requests
      return data;
    },
  });
}
