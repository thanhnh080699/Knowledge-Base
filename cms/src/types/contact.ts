export interface ContactRequest {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: 'PENDING' | 'REPLIED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

export interface ContactFilters {
  status?: string;
  q?: string;
  page?: number;
  limit?: number;
}
