# CMS Reference — Next.js + React Query + Zustand (Admin Panel)

Trang quản trị (Admin) cho hệ thống thanhnh.id.vn. Sử dụng kiến trúc **Atomic Minimalism** và **App Router**.

> **Repository**: [https://github.com/thanhnh-id-vn/cms](https://github.com/thanhnh-id-vn/cms)
> **Port mặc định**: `3002`

---

## Cấu trúc thư mục

```
cms/
├── src/
│   ├── app/                        # App Router pages
│   │   ├── layout.tsx              # Root layout (providers, sidebar)
│   │   ├── page.tsx                # Dashboard
│   │   ├── posts/
│   │   │   ├── page.tsx            # List posts
│   │   │   ├── create/page.tsx     # Create post
│   │   │   └── [id]/edit/page.tsx  # Edit post
│   │   ├── categories/
│   │   ├── tags/
│   │   ├── series/
│   │   ├── projects/
│   │   ├── services/
│   │   └── contacts/
│   │
│   ├── components/
│   │   ├── ui/                     # Atomic components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Label.tsx
│   │   │   ├── Tag.tsx
│   │   │   ├── Typography.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   └── Select.tsx
│   │   └── shared/                 # Reusable sections
│   │       ├── Sidebar.tsx
│   │       ├── Header.tsx
│   │       ├── SEOBlock.tsx        # SEO config + OG tabs + Google Snippet Preview
│   │       ├── AdvancedFilterModal.tsx
│   │       ├── ConfirmDeleteModal.tsx
│   │       ├── InlineEditableSlug.tsx
│   │       └── BulkActions.tsx
│   │
│   ├── hooks/
│   │   ├── queries/                # useQuery hooks
│   │   │   ├── use-posts.ts
│   │   │   ├── use-categories.ts
│   │   │   ├── use-tags.ts
│   │   │   ├── use-projects.ts
│   │   │   └── use-services.ts
│   │   └── mutations/              # useMutation hooks
│   │       ├── use-post-mutations.ts
│   │       ├── use-category-mutations.ts
│   │       └── use-project-mutations.ts
│   │
│   ├── lib/
│   │   ├── api-client.ts           # Axios/fetch wrapper với base URL + auth headers
│   │   ├── error-handler.ts        # handleApiError(err, defaultMessage)
│   │   ├── query-client.ts         # React Query client config
│   │   └── utils.ts                # Helpers (formatDate, slugify...)
│   │
│   ├── stores/                     # Zustand stores
│   │   ├── use-auth-store.ts       # Auth state (token, user)
│   │   ├── use-sidebar-store.ts    # Sidebar collapsed/expanded
│   │   └── use-theme-store.ts      # Dark/Light mode
│   │
│   └── types/                      # TypeScript types
│       ├── post.ts
│       ├── category.ts
│       ├── tag.ts
│       ├── project.ts
│       ├── service.ts
│       ├── contact.ts
│       └── common.ts               # PaginatedResponse, ApiError, FilterParams...
│
├── public/
├── .env.local
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## Biến môi trường (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_CDN_URL=http://localhost:8081
NEXT_PUBLIC_APP_NAME=thanhnh CMS
```

---

## 💻 Quy trình tạo Module mới

### Bước 1: Khai báo Types

Tạo file type trong `src/types/[module].ts`. **Cấm sử dụng `any`**.

```typescript
// src/types/post.ts
export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  coverImage: string | null
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  views: number
  categoryId: string
  seriesId: string | null
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  category?: Category
  tags?: Tag[]
  series?: Series
}

export interface CreatePostPayload {
  title: string
  slug?: string
  excerpt?: string
  content: string
  coverImage?: string
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  categoryId: string
  seriesId?: string
  tagIds?: string[]
  publishedAt?: string
}

export interface UpdatePostPayload extends Partial<CreatePostPayload> {}
```

### Bước 2: Tạo Hooks

#### Query Hook

```typescript
// src/hooks/queries/use-posts.ts
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { Post, PaginatedResponse } from '@/types'

interface UsePostsParams {
  page?: number
  limit?: number
  category?: string
  tag?: string
  status?: string
  search?: string
  trashed?: boolean
  filters?: string    // JSON string of advanced filters
  logic?: 'AND' | 'OR'
}

export function usePosts(params: UsePostsParams = {}) {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Post>>('/posts', { params })
      return data
    },
  })
}

export function usePost(id: string) {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Post }>(`/posts/${id}`)
      return data.data
    },
    enabled: !!id,
  })
}
```

#### Mutation Hook

```typescript
// src/hooks/mutations/use-post-mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { handleApiError } from '@/lib/error-handler'
import { toast } from 'sonner'
import type { CreatePostPayload, UpdatePostPayload } from '@/types'

export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreatePostPayload) =>
      apiClient.post('/admin/posts', payload),
    onSuccess: () => {
      toast.success('Tạo bài viết thành công')
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
    onError: (err) => handleApiError(err, 'Không thể tạo bài viết'),
  })
}

export function useUpdatePost(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdatePostPayload) =>
      apiClient.put(`/admin/posts/${id}`, payload),
    onSuccess: () => {
      toast.success('Cập nhật bài viết thành công')
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['posts', id] })
    },
    onError: (err) => handleApiError(err, 'Không thể cập nhật bài viết'),
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(`/admin/posts/${id}`),
    onSuccess: () => {
      toast.success('Xóa bài viết thành công')
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
    onError: (err) => handleApiError(err, 'Không thể xóa bài viết'),
  })
}
```

> **Quy tắc xử lý lỗi**: Luôn dùng `handleApiError(err, defaultMessage)` từ `@/lib/error-handler`. KHÔNG tự viết `toast.error` trong mutation hooks.

### Bước 3: Xây dựng Giao diện — Màn hình List

#### Bảng danh sách (Table)

- Cột đầu tiên **BẮT BUỘC** là checkbox
- Hỗ trợ "Chọn tất cả" và **Bulk Actions** phía trên
- Khi xem danh sách đã xóa (Trash), đổi cột "Ngày tạo" thành "Ngày xóa" (`deleted_at`)

```typescript
// Cấu trúc cột mẫu
const columns = [
  { key: 'checkbox', label: <Checkbox checked={allSelected} onChange={toggleAll} />, width: '40px' },
  { key: 'title',    label: 'Tiêu đề' },
  { key: 'category', label: 'Danh mục' },
  { key: 'status',   label: 'Trạng thái' },
  { key: 'views',    label: 'Lượt xem' },
  // Đổi cột dựa trên trạng thái trash
  isTrashed
    ? { key: 'deletedAt', label: 'Ngày xóa' }
    : { key: 'createdAt', label: 'Ngày tạo' },
  { key: 'actions',  label: '' },
]
```

#### Lọc (Advanced Filter)

Sử dụng `AdvancedFilterModal` và đồng bộ trạng thái lọc lên **URL Search Params** (`filters`, `logic`).

```typescript
// Đồng bộ filter lên URL
const searchParams = new URLSearchParams()
searchParams.set('filters', JSON.stringify(activeFilters))
searchParams.set('logic', filterLogic) // 'AND' | 'OR'
router.push(`?${searchParams.toString()}`)
```

### Bước 4: Xây dựng Giao diện — Màn hình Thêm/Sửa

#### Layout 2 cột (CSS Grid 12 cột)

```tsx
<div className="grid grid-cols-12 gap-6">
  {/* Cột trái: Nội dung chính */}
  <div className="col-span-8">
    <TitleInput />
    <InlineEditableSlug />
    <ContentEditor />
    <SEOBlock />          {/* 2 tab: Cấu hình / OG + Google Snippet Preview */}
  </div>

  {/* Cột phải: Sidebar hành động */}
  <div className="col-span-4">
    <PublishActions />    {/* Status, publishedAt, Save/Publish buttons */}
    <CategorySelect />
    <TagSelect />
    <CoverImageUpload />
  </div>
</div>
```

#### Tiêu chuẩn SEO Block

Bắt buộc có khối SEO thống nhất trên mọi form Thêm/Sửa:

- **Tab 1 — Cấu hình**: meta title, meta description, canonical URL, focus keyword
- **Tab 2 — OG**: og:title, og:description, og:image
- **Google Snippet Preview**: Real-time preview hiển thị title + description + URL

#### Slug

Cho phép sửa trực tiếp (**Inline Editable Slug**) ngay dưới tiêu đề.

```tsx
// src/components/shared/InlineEditableSlug.tsx
<div className="flex items-center gap-2 text-sm text-slate-500">
  <span>URL: /docs/</span>
  {isEditing ? (
    <Input value={slug} onChange={setSlug} onBlur={save} autoFocus />
  ) : (
    <span onClick={() => setIsEditing(true)} className="cursor-pointer hover:text-slate-700">
      {slug}
      <Pencil size={14} className="inline ml-1" />
    </span>
  )}
</div>
```

#### Confirm Delete Action

Xóa dữ liệu **BẮT BUỘC** phải qua Modal xác nhận:

```tsx
// src/components/shared/ConfirmDeleteModal.tsx
<Modal open={open} onClose={onClose}>
  <div className="flex flex-col items-center gap-4 p-6">
    <AlertTriangle size={48} className="text-rose-600" />
    <Typography variant="h3">Xác nhận xóa?</Typography>
    <Typography variant="body" className="text-slate-500">
      Hành động này không thể hoàn tác.
    </Typography>
    <div className="flex gap-3">
      <Button variant="outline" onClick={onClose}>Hủy</Button>
      <Button variant="destructive" className="bg-rose-600" onClick={onConfirm}>
        Xóa
      </Button>
    </div>
  </div>
</Modal>
```

#### Modal/Popup Scroll Standard

Tất cả popup/modal trong CMS phải dùng modal component dùng chung từ `src/components/ui`. Component này phải xử lý tốt khi viewport bị thấp do DevTools/F12, split screen, hoặc màn hình nhỏ:

- Overlay/modal wrapper dùng vùng `fixed inset-0` có `overflow-y-auto`.
- Modal panel có `max-height` theo viewport, ví dụ `max-h-[calc(100dvh-4rem)]`.
- Modal panel là flex column; header/action quan trọng không bị cắt, phần body dùng `overflow-y-auto`.
- Khi modal mở, khóa scroll của page chính nhưng vẫn cho phép scroll nội dung trong modal.
- Không tạo popup bằng layout chỉ `items-center justify-center` nếu panel không có `max-height` và scroll container.
- Không dùng chiều cao cứng (`h-screen`, `height: 700px`, v.v.) cho form modal dài.

Mẫu cấu trúc chuẩn:

```tsx
<div className="fixed inset-0 z-50 overflow-y-auto p-4 pointer-events-none">
  <div className="flex min-h-full items-start justify-center py-4 sm:items-center">
    <div className="pointer-events-auto flex max-h-[calc(100dvh-4rem)] w-full max-w-lg flex-col overflow-hidden rounded-xl border bg-[var(--app-surface)] shadow-lg">
      <div className="shrink-0 border-b px-6 py-4">
        {/* header */}
      </div>
      <div className="overflow-y-auto px-6 py-6">
        {/* form/content */}
      </div>
    </div>
  </div>
</div>
```

---

## 🎨 Tiêu chuẩn Giao diện (Aesthetics)

### Atomic Components

Tuyệt đối **KHÔNG dùng thẻ HTML thô** (`<button>`, `<input>`, `<label>`...). Luôn dùng components từ `src/components/ui`:

| Thẻ HTML       | Component thay thế |
|----------------|-------------------|
| `<button>`     | `<Button />`      |
| `<input>`      | `<Input />`       |
| `<label>`      | `<Label />`       |
| `<span>` (tag) | `<Tag />`         |
| `<h1>...<p>`   | `<Typography />`  |
| `<table>`      | `<Table />`       |
| `<select>`     | `<Select />`      |

### Icon

Sử dụng **Lucide React** (`lucide-react`):
- Header/Toolbar: size `18-20`
- Nội dung/Table: size `14-16`
- Không dùng icon libraries khác (FontAwesome, Heroicons...)

### Animation

Sử dụng **Framer Motion** cho hiệu ứng chuyển động:
- Fade-in cho page transitions
- Slide cho sidebar/menu mở/đóng
- Không dùng CSS animation thủ công

```tsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2 }}
>
  {children}
</motion.div>
```

### Premium Design

- **Bảng màu**: Neutral (Grays) — `slate-50` → `slate-900`
- **Đường kẻ**: Mảnh, `border-slate-200` (light) / `border-slate-700` (dark)
- **Khoảng trắng**: Rộng rãi — padding `p-6`, gap `gap-4`
- **Border radius**: `rounded-lg` card, `rounded-md` button
- **Shadow**: Tối đa `shadow-sm`

### Dark Mode

Mọi thành phần phải hiển thị tốt ở cả Light và Dark mode:

```tsx
<div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
  <div className="border border-slate-200 dark:border-slate-700">
    {/* content */}
  </div>
</div>
```

---

## 🔧 Lib & Utilities

### API Client

```typescript
// src/lib/api-client.ts
import axios from 'axios'

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Interceptor: attach auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
```

### Error Handler

```typescript
// src/lib/error-handler.ts
import { toast } from 'sonner'
import { AxiosError } from 'axios'

export function handleApiError(err: unknown, defaultMessage: string) {
  if (err instanceof AxiosError && err.response?.data?.message) {
    toast.error(err.response.data.message)
  } else {
    toast.error(defaultMessage)
  }
}
```

---

## 🏪 Zustand Stores

### Hydration Check Pattern

Khi dùng Zustand `persist`, **PHẢI** kiểm tra component đã mounted để tránh lỗi Hydration:

```typescript
// src/stores/use-theme-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeStore {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    { name: 'theme-storage' }
  )
)
```

```tsx
// Component sử dụng — BẮT BUỘC kiểm tra mounted
'use client'
import { useEffect, useState } from 'react'
import { useThemeStore } from '@/stores/use-theme-store'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, toggleTheme } = useThemeStore()

  useEffect(() => setMounted(true), [])
  if (!mounted) return null  // Tránh hydration mismatch

  return (
    <Button onClick={toggleTheme}>
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </Button>
  )
}
```

---

## 📋 Quy trình tạo Module mới (Checklist)

1. ☐ Tạo file type `src/types/[module].ts` — **cấm `any`**
2. ☐ Tạo query hook `src/hooks/queries/use-[module].ts`
3. ☐ Tạo mutation hook `src/hooks/mutations/use-[module]-mutations.ts`
4. ☐ Xử lý lỗi bằng `handleApiError` — không tự viết `toast.error`
5. ☐ Invalidate queries sau mọi mutation
6. ☐ List page: checkbox cột đầu + Bulk Actions + Advanced Filter (URL sync)
7. ☐ Trash view: đổi "Ngày tạo" → "Ngày xóa"
8. ☐ Form page: Grid 12 cột (8+4) + SEO Block + Inline Slug
9. ☐ Delete action: qua `ConfirmDeleteModal` (AlertTriangle + rose-600)
10. ☐ Dùng Atomic components — không HTML thô
11. ☐ Dark mode hoạt động
12. ☐ `yarn build` pass không lỗi Type/Hydration

---

## Commands

```bash
# Dev (port 3002)
yarn dev -p 3002

# Build (kiểm tra trước khi commit)
yarn build

# Lint
yarn lint

# Install dependencies
yarn install
```
