export interface MediaAsset {
  original_name: string
  file_name: string
  path: string
  url: string
  optimized_url: string
  html: string
  size: number
  mime_type: string
  width?: number
  height?: number
  display_width?: number
  display_height?: number
  alt: string
  align: 'none' | 'left' | 'center' | 'right'
  variants?: Record<string, string>
}

export interface MediaFolder {
  name: string
  path: string
  parent: string
  file_count: number
  created_at: string
  updated_at: string
}

export interface MediaList {
  current_folder: string
  folders: MediaFolder[]
  files: MediaAsset[]
  total?: number
  limit?: number
  offset?: number
  has_more?: boolean
  next_offset?: number
}

export interface MediaFilters {
  folder?: string
  sort?: 'updated_at' | 'name' | 'size'
  direction?: 'asc' | 'desc'
  limit?: number
}

export interface UploadMediaPayload {
  file: File
  folder?: string
  width?: string
  height?: string
}

export interface MoveMediaPayload {
  path: string
  folder?: string
}
