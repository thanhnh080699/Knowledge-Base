export function formatDisplayId(id: string | number | undefined | null) {
  if (!id) return '--'
  return String(id).slice(0, 8).toUpperCase()
}

export function formatDateTime(value: string | null) {
  if (!value) {
    return '--'
  }

  return new Date(value).toLocaleDateString('vi-VN')
}
