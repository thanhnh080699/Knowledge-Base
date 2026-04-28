export function normalizeMediaPath(value: string | null | undefined) {
  if (!value) return value

  try {
    const url = new URL(value)
    const mediaIndex = url.pathname.indexOf('/medias/')
    const pathname =
      mediaIndex >= 0 ? url.pathname.slice(mediaIndex + '/medias/'.length) : url.pathname
    return decodeURIComponent(pathname.replace(/^\//, ''))
  } catch {
    return value
      .split('?')[0]
      .replace(/^\/?medias\//, '')
      .replace(/^\//, '')
  }
}

export function normalizeMediaFields<T extends Record<string, unknown>>(
  payload: T,
  fields: (keyof T)[]
) {
  const normalized = { ...payload }
  for (const field of fields) {
    if (typeof normalized[field] === 'string') {
      normalized[field] = normalizeMediaPath(normalized[field] as string) as T[keyof T]
    }
  }
  return normalized
}
