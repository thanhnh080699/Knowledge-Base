export interface ApiListResponse<T> {
  data: T[]
}

export interface ApiItemResponse<T> {
  data: T
}

export interface PaginatedResponse<T> extends ApiListResponse<T> {
  meta: { total: number; perPage: number; currentPage: number; lastPage: number }
}
