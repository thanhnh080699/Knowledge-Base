# FE Reference — Next.js 15 + Tailwind CSS v4

## Khởi tạo

```bash
npx create-next-app@latest fe --typescript --tailwind --app --src-dir
cd fe
npm install framer-motion lucide-react @tanstack/react-query axios
npm install -D @tailwindcss/typography
```

---

## Cấu trúc thư mục

```
fe/src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                          # Homepage
│   ├── (docs)/[category]/[slug]/page.tsx # Tài liệu kỹ thuật
│   ├── portfolio/page.tsx
│   ├── portfolio/[slug]/page.tsx
│   ├── services/page.tsx
│   ├── services/[slug]/page.tsx
│   └── contact/page.tsx
├── components/
│   ├── ui/           # Button, Badge, Card, Typography
│   └── shared/       # Header, Footer, PostCard, ProjectCard,
│                     # CategoryNav, TableOfContents, ContactForm
├── hooks/            # usePosts, useProjects, useContact
├── lib/api.ts        # Axios instance
└── types/            # post.ts, project.ts, service.ts
```

---

## Design System

**KHÔNG glassmorphism.** Border + flat color là chuẩn tuyệt đối.

```css
/* globals.css */
:root {
  --color-primary:       #2563EB;   /* Blue-600 — CTAs, links */
  --color-primary-light: #DBEAFE;   /* Blue-100 — badges */
  --color-secondary:     #10B981;   /* Emerald — success */
  --color-accent:        #F59E0B;   /* Amber — featured */
  --color-surface:       #F8FAFC;   /* Page background */
  --color-card:          #FFFFFF;
  --color-border:        #E2E8F0;   /* Slate-200 — dividers */
  --color-text:          #0F172A;   /* Slate-900 */
  --color-muted:         #64748B;   /* Slate-500 */
}
```

---

## Nguyên tắc cứng — không ngoại lệ

- Phân tách bằng `border border-slate-200`, không shadow lớn
- Shadow tối đa `shadow-sm`
- Border radius: `rounded-lg` card / `rounded-md` button, input
- Hover: reverse-color hoặc border-color swap — **cấm `hover:scale-*`**
- Mọi element tương tác phải có `cursor-pointer`
- Icon: Lucide React, 18-20px header / 14-16px inline
- Pricing: `text-red-500`, prefix "from"

### Mẫu card chuẩn

```tsx
<article className="bg-white border border-slate-200 rounded-lg p-5 hover:border-blue-500 transition-colors cursor-pointer">
  <Badge>{post.category.name}</Badge>
  <h2 className="text-slate-900 font-semibold mt-2">{post.title}</h2>
  <p className="text-slate-500 text-sm mt-1">{post.excerpt}</p>
</article>
```

---

## SEO (bắt buộc mọi page)

### Static page

```typescript
export const metadata: Metadata = {
  title: '...', description: '...',
  openGraph: { title: '...', description: '...', images: ['...'] }
}
```

### Dynamic route

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug)
  return { title: post.title, description: post.excerpt }
}
```

### Quy tắc SEO

- Một `<h1>` duy nhất / page
- Mọi ảnh có `alt`
- Semantic HTML: `<article>`, `<section>`, `<aside>`, `<nav>`
- Ưu tiên Server Components — `'use client'` chỉ khi cần state/event

---

## Performance

- **ISR/SSG** cho trang tài liệu: `revalidate: 60`
- **SSR** chỉ cho data real-time (contact form status, etc.)
- Lazy load images với `next/image`
- Code splitting tự động qua App Router

---

## HOME / Landing Page Standard

Trang `fe/src/app/page.tsx` là mặt tiền của `thanhnh.id.vn`, không phải nơi mô tả implementation UI. Khi chỉnh HOME:

- Lấy content từ thực tế dự án: đọc `README.md`; nếu API local đang chạy, gọi `/api/categories?roots=true`, `/api/posts`, `/api/tools`, `/api/projects` để hiểu dữ liệu live.
- Copy chính phải phản ánh đúng mục đích site: knowledge base kỹ thuật SysAdmin/DevOps/Development, câu chuyện triển khai/kinh nghiệm sản phẩm, dự án/module hệ thống, và công cụ vận hành.
- Hero headline giữ cấu trúc: dòng 1 `Knowledge`, dòng 2 `Base vận hành thực chiến`; caret/typing chỉ nằm ở chữ `chiến`.
- Dùng generated bitmap assets đúng ngữ cảnh cho hero và menu sections. Lưu asset project-bound vào `fe/public/images/home-*.png`; không tham chiếu trực tiếp file trong `$CODEX_HOME/generated_images`.
- Section menu phải có ảnh/context đan xen trái/phải, nhưng nội dung phải nói về giá trị thực tế của Docs, Tools, Projects, About Me, Contact.
- Menu trỏ tới `/portfolio` nên hiển thị là `About Me` và đặt cạnh `Liên hệ`. Nội dung section này vẫn phải né cụm **Hồ sơ năng lực**; nên diễn đạt theo hướng "câu chuyện triển khai", "kinh nghiệm xây sản phẩm", "delivery story", hoặc "các lớp sản phẩm đã xây".
- `Projects` trên HOME bám README: API (AdonisJS/MariaDB), FE (Next.js/ISR/SEO), CMS (React Query/Zustand), CDN (Go/Gin). Tránh card trắng/trống; visual của CMS phải liệt kê module quản trị như Bài viết, Danh mục, Tags, Media, Dự án, Menu, Pages, Settings, Contacts, Users, Roles, API Tokens.
- Motion chỉ dùng client component nhỏ trong `src/components/shared`; luôn tôn trọng `prefers-reduced-motion`.

---

## Build check

```bash
npm run dev && npm run build && npm run lint   # Phải pass cả 3
```

---

## API Client (lib/api.ts)

```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  headers: { 'Content-Type': 'application/json' },
})

export default api
```

---

## CDN Integration

Ảnh từ CDN sử dụng URL format:

```
https://cdn.thanhnh.id.vn/medias/{path}?w=300&h=200&fmt=webp
```

Dùng `next/image` với loader custom cho CDN:

```typescript
// lib/cdn-loader.ts
export default function cdnLoader({ src, width, quality }) {
  return `${process.env.NEXT_PUBLIC_CDN_URL}/medias/${src}?w=${width}&fmt=webp`
}
```
