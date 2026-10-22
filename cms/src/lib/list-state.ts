export const DEFAULT_PAGE_SIZE = 20
export const PAGE_SIZES = [10, 20, 50, 100] as const

export function paginationRange(page: number, pageSize: number, total: number) {
  const lastPage = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.max(1, Math.min(page, lastPage))
  return { currentPage, lastPage, from: total ? (currentPage - 1) * pageSize + 1 : 0, to: Math.min(currentPage * pageSize, total) }
}

export function newestFirst<T extends { id: number }>(items: readonly T[]) {
  return [...items].sort((a, b) => b.id - a.id)
}

export function paginateItems<T>(items: readonly T[], page: number, pageSize: number) {
  const { currentPage } = paginationRange(page, pageSize, items.length)
  return items.slice((currentPage - 1) * pageSize, currentPage * pageSize)
}
