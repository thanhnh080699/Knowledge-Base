export type PageStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  template: string | null;
  coverImage: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  focusKeyword: string | null;
  canonicalUrl: string | null;
  status: PageStatus;
  isHomepage: boolean;
  publishedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
}

export interface PageFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: PageStatus | "";
  trashed?: boolean;
}

export interface CreatePagePayload {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  template?: string;
  coverImage?: string | File;
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  status?: PageStatus;
  isHomepage?: boolean;
  publishedAt?: string;
}

export type UpdatePagePayload = Partial<CreatePagePayload>;
