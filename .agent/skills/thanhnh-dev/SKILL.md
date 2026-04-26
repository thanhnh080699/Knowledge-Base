---
name: thanhnh-dev
description: Hỗ trợ toàn bộ quy trình phát triển và migration từ WordPress sang stack AdonisJS v6 (API) + Next.js 15 (FE) + Next.js/React Query/Zustand (CMS) + Golang/Gin (CDN) cho dự án thanhnh.id.vn — website cá nhân chuyên lưu trữ tài liệu kỹ thuật (SysAdmin, DevOps, Development), giới thiệu portfolio dự án và mời chào khách hàng thuê dịch vụ lập trình web. Sử dụng skill này khi làm việc với BẤT KỲ thành phần nào trong dự án thanhnh.id.vn bao gồm API (AdonisJS v6/Lucid ORM/MariaDB), FE (Next.js 15/Tailwind CSS v4), CMS (Next.js/React Query/Zustand), CDN (Golang/Gin), hoặc khi cần hướng dẫn migration nội dung từ WordPress. Trigger khi user nhắc đến: thanhnh, new_site, wordpress migration, API endpoint, Next.js page, Lucid model, AdonisJS, MariaDB, node ace, tài liệu kỹ thuật, portfolio, CDN upload, Go handler, Gin route, CMS, admin panel, quản trị, React Query, Zustand.
---

# thanhnh.id.vn Development Skill

Skill này hướng dẫn toàn bộ quy trình phát triển **thanhnh.id.vn** — hệ thống thay thế WordPress gồm 4 dự án chính:

1. **API** — Backend REST API: **AdonisJS v6**, **Lucid ORM**, **MariaDB** → Đọc `references/api.md`
2. **FE** — Giao diện người dùng: **Next.js 15** (App Router), **Tailwind CSS v4**, **Framer Motion** → Đọc `references/fe.md`
3. **CMS** — Trang quản trị (Admin): **Next.js**, **React Query**, **Zustand** → Đọc `references/cms.md`
4. **CDN** — Dịch vụ CDN hiệu năng cao: **Golang**, **Gin**, local storage → Đọc `references/cdn.md`

### 🔗 Repository Links
- **API**: [https://github.com/thanhnh-id-vn/api.git](https://github.com/thanhnh-id-vn/api.git)
- **FE**: [https://github.com/thanhnh-id-vn/fe.git](https://github.com/thanhnh-id-vn/fe.git)
- **CMS**: [https://github.com/thanhnh-id-vn/cms.git](https://github.com/thanhnh-id-vn/cms.git)
- **CDN**: [https://github.com/thanhnh-id-vn/cdn.git](https://github.com/thanhnh-id-vn/cdn.git)

---

## 🗺 Kiến trúc Tổng thể

```
thanhnh.id.vn/
├── api/                        # AdonisJS v6 + Lucid ORM + MariaDB
│   ├── app/
│   │   ├── controllers/        # HTTP Controllers
│   │   ├── models/             # Lucid Models (Active Record)
│   │   ├── middleware/         # Auth, RateLimit, ...
│   │   └── validators/         # VineJS schemas
│   ├── config/
│   │   ├── database.ts         # MariaDB connection config
│   │   └── auth.ts
│   ├── database/
│   │   ├── migrations/         # Lucid migration files
│   │   └── seeders/            # Seed data
│   ├── start/
│   │   ├── routes.ts           # Route definitions
│   │   └── kernel.ts           # Middleware stack
│   ├── .env
│   └── package.json
│
├── fe/                         # Next.js 15 App Router + Tailwind CSS v4
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   │   ├── ui/             # Atomic components
│   │   │   └── shared/         # Reusable sections
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── types/
│   ├── public/
│   ├── .env.local
│   └── package.json
│
├── cms/                        # Next.js + React Query + Zustand (Admin)
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   ├── components/
│   │   │   ├── ui/             # Atomic components (Button, Input, Tag...)
│   │   │   └── shared/         # Reusable sections
│   │   ├── hooks/
│   │   │   ├── queries/        # useQuery hooks
│   │   │   └── mutations/      # useMutation hooks
│   │   ├── lib/                # API client, error-handler, utils
│   │   ├── stores/             # Zustand stores
│   │   └── types/              # TypeScript types
│   ├── public/
│   ├── .env.local
│   └── package.json
│
└── cdn/                        # Golang + Gin (ĐÃ CÓ SẴN)
    ├── main.go                 # Entry point, routes
    ├── config/config.go        # Env loading
    ├── handlers/               # Upload, Image, Folder, File, Middleware
    ├── utils/utils.go          # Helper functions
    ├── tests/                  # Integration tests
    ├── go.mod
    └── .env
```

---

## 🔑 Domain Model

### Content
- **Post**: title, slug, content (Markdown), excerpt, status, views, publishedAt
- **Category**: SysAdmin / DevOps / Development / Tools / Security…
- **Tag**: nhãn phân loại nhanh (many-to-many với Post)
- **Series**: chuỗi bài (e.g. "Kubernetes từ A-Z")

### Portfolio
- **Project**: title, slug, description, techStack (JSON), demoUrl, repoUrl, thumbnail, featured, status
- **Service**: tên dịch vụ, features (JSON), priceRange, category, featured

### Engagement
- **ContactRequest**: name, email, company, message, serviceId?, status
- **Newsletter**: email, active

---

## 📋 Quy tắc bất biến (Toàn bộ dự án)

### 🧪 Quy trình Kiểm thử & Commit (BẮT BUỘC)
- **Luôn có file test**: Mọi feature mới hoặc bug fix ĐỀU PHẢI có file test tương ứng.
- **Pass Test trước khi Commit**: KHÔNG commit hoặc push code nếu chưa pass toàn bộ test suite của project đó.

### 🖼️ Media & Upload Standards (Toàn dự án)
- **Centralized Upload**: Mọi hành động upload file ĐỀU PHẢI thông qua API Media chuyên dụng (`/admin/media/upload`).
- **Business Controllers**: Các business controller (như `CategoriesController`, `PostsController`) TUYỆT ĐỐI KHÔNG xử lý file upload trực tiếp. Chúng chỉ nhận chuỗi URL/Path từ frontend.
- **Two-Step Upload Flow**: Frontend thực hiện upload file lên Media API trước → nhận về URL → sau đó mới gửi URL này kèm theo payload nghiệp vụ đến business API.
- **Image Display**: Luôn dùng helper `absoluteCdnUrl` (trong CMS) hoặc logic tương đương để hiển thị ảnh. Helper này chịu trách nhiệm gắn thêm CDN URL nếu đường dẫn trong DB là tương đối.
- **CDN Folder**: Phân loại ảnh theo module tương ứng (ví dụ: `Categories`, `Posts`, `Settings`) khi upload để quản lý tập trung.

### API (AdonisJS v6)
- **MariaDB Local**: host: `192.168.11.254`, user: `thanhnh.id.vn`, pass: `thanhnh.id.vn`, db: `thanhnh.id.vn`.
- **UUID** — Dùng `beforeCreate` hook + `randomUUID()` (Node.js built-in). Không dùng auto-increment ID.
- **JSON Array fields** — Dùng Lucid `column({ prepare, consume })` để auto serialize/deserialize. KHÔNG để raw JSON string lọt ra response.
- **Soft delete** — Mọi query list PHẢI filter `.whereNull('deleted_at')` hoặc dùng scope.
- **Validator** — Dùng VineJS (`vine.compile`). Không import Zod.
- **Relations** — Luôn dùng `.preload()` khi cần data liên quan. Không query thủ công bằng raw ID.
- **Swagger** — Mọi bộ CRUD sau khi hoàn thiện PHẢI được bổ sung vào Swagger documentation. Truy cập tại `/swagger`.
- **ACL Sync** — Sau khi thêm module hoặc permission mới vào `ACL_MODULES`, PHẢI chạy `node ace sync:permissions` để cập nhật database.
- **Seeding** — `AclSeeder` chịu trách nhiệm đồng bộ quyền, khởi tạo role và tạo admin mặc định. Luôn chạy seeder này khi setup môi trường mới.

### FE (Next.js 15)
- **KHÔNG glassmorphism** — Border + flat color tuyệt đối.
- Shadow tối đa `shadow-sm`, border radius: `rounded-lg` card / `rounded-md` button.
- Hover: reverse-color hoặc border-color swap — **cấm `hover:scale-*`**
- Ưu tiên Server Components — `'use client'` chỉ khi cần state/event.
- **ISR/SSG** cho trang tài liệu (`revalidate: 60`). SSR chỉ cho data real-time.
- SEO bắt buộc mọi page: `metadata`, một `<h1>` duy nhất, semantic HTML.

### CMS (Next.js + React Query + Zustand)
- **Botble CMS UI Standard** — Giao diện PHẢI mô phỏng phong cách Botble CMS:
  - **Main Layout**: BẮT BUỘC dùng cấu trúc `flex flex-1 flex-col p-8` cho nội dung chính. KHÔNG dùng `grid` cho layout bao ngoài.
  - **Page Structure**: 
    ```html
    <div class="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 class="text-2xl font-semibold tracking-tight">Title</h3>
            <span class="text-sm text-slate-500">Description</span>
          </div>
          <div class="flex gap-2">
            <!-- Action Buttons: Trash, Filter, Create New -->
          </div>
        </div>
        <!-- Content Card -->
        <div class="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div class="relative w-full overflow-auto">
            <table class="w-full text-sm">
              <thead class="bg-slate-50/50 border-b">...</thead>
              <tbody>...</tbody>
            </table>
          </div>
          <!-- Pagination/Footer -->
          <div class="flex items-center justify-between border-t bg-slate-50/50 px-6 py-3">
            <span>Showing X to Y of Z results</span>
            <div class="flex gap-2">...</div>
          </div>
        </div>
      </div>
    </div>
    ```
  - **Sidebar**: Tối (Dark Sidebar), Header trắng với thanh search full-width.
  - **Atomic Minimalism** — Luôn dùng `Button`, `Input`, `Label`, `Tag`, `Typography` từ `src/components/ui`.
  - **Dark Mode**: Mọi thành phần phải hiển thị tốt ở cả Light và Dark mode.
  - **Port mặc định**: `3002`.
  - **Settings Module Layout** — Màn hình `/dashboard/settings` PHẢI là trang danh sách setting theo phong cách Botble:
    - Có breadcrumb dạng `Dashboard / Settings` ở đầu trang.
    - Chia setting thành các section card lớn như `Common`, `Localization`, `Ecommerce`; mỗi section có header riêng và grid item 3 cột trên desktop.
    - Mỗi setting item gồm icon trong ô vuông nền nhạt, title màu xanh, description màu muted; toàn bộ item là link đến màn hình setting detail.
    - Không hiển thị form chỉnh sửa trực tiếp ở trang list setting.
  - **Settings Detail Layout** — Các màn hình setting detail như `/dashboard/settings/overview` PHẢI chia form thành từng block ngang giống Botble:
    - Mỗi block dùng layout hai cột `lg:grid-cols-[280px_1fr]`: cột trái là title + description của block, cột phải là card form.
    - Form card dùng `rounded-xl border bg-surface shadow-sm p-5`, các field xếp dọc với `Label`, control, help text.
    - Nút hành động chính đặt cuối trang trong cột phải, gồm `Save settings` và `Reset` khi cần.
    - Không dùng sidebar phụ cho setting detail nếu màn hình là form cấu hình; ưu tiên block rõ ràng như `License`, `General Information`, `Website Identity`.
  - **Settings Assets** — Toàn bộ ảnh cấu hình hệ thống (Logo, Favicon, ...) PHẢI được upload vào thư mục `settings` trên CDN để quản lý tập trung.
  - **Modal/Popup Scroll Standard** — Mọi popup/modal trong CMS PHẢI dùng component modal dùng chung có `max-height` theo viewport và vùng nội dung `overflow-y-auto`. Khi viewport thấp do DevTools/F12 hoặc màn hình nhỏ, modal không được bị cắt mất header/footer/action; người dùng phải cuộn được nội dung bên trong popup. Không khóa cứng chiều cao popup theo `h-screen`, `fixed height`, hoặc center-only layout không có scroll container.

### CDN (Golang)
- Module name: `thanhnh/cdn` (cần refactor từ `meditour/cdn`).
- Auth qua `X-API-KEY` header.
- File lưu theo cấu trúc `YYYY/MM/DD/uuid.ext`.
- Image processing on-the-fly với cache: `?w=300&h=200&fmt=webp`.
- Deep inspection (magic bytes) cho security.

---

## 🔄 Migration từ WordPress

### Export
```bash
wp export --path=/var/www/wordpress --dir=/tmp/wp-export
```

### Field Mapping

| WordPress field      | MariaDB column      |
|----------------------|---------------------|
| post_title           | title               |
| post_name            | slug                |
| post_content         | content             |
| post_excerpt         | excerpt             |
| post_date            | published_at        |
| post_status=publish  | status='PUBLISHED'  |
| category             | category_id (lookup)|
| tags                 | post_tags (sync)    |

### SEO Redirects (fe/next.config.ts)
```typescript
redirects: async () => [
  { source: '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug', destination: '/docs/:slug', permanent: true },
  { source: '/category/:cat', destination: '/docs?category=:cat', permanent: true },
  { source: '/?p=:id',        destination: '/',                   permanent: true },
]
```

---

## 📋 Checklist trước khi Deploy

**API:**
- [ ] `.env` đủ `APP_KEY`, `DB_*`, `JWT_SECRET`
- [ ] MariaDB user có quyền: `GRANT ALL ON thanhnh.* TO 'thanhnh'@'%'`
- [ ] `node ace migration:run` đã chạy trên production
- [ ] `node ace db:seed` đã chạy (để đồng bộ permissions và tạo admin mặc định)
- [ ] `node ace sync:permissions` đã chạy (nếu có thay đổi trong ACL_MODULES)
- [ ] `node ace test` pass toàn bộ

**FE:**
- [ ] `npm run build` không lỗi
- [ ] `npm run lint` clean
- [ ] Mọi page có `metadata`
- [ ] Redirects WordPress URLs đã khai báo
- [ ] `NEXT_PUBLIC_API_URL` trỏ đúng API server

**CMS:**
- [ ] `yarn build` không lỗi Type/Hydration
- [ ] `NEXT_PUBLIC_API_URL` trỏ đúng API server
- [ ] Mọi module có đầy đủ Types (cấm `any`)
- [ ] Dark Mode hoạt động chính xác
- [ ] Chạy cổng `3002`

**CDN:**
- [ ] `.env` đã cấu hình đúng `API_KEY`, `BASE_URL`, `UPLOAD_DIR`
- [ ] `go test -v ./tests/...` pass
- [ ] `ALLOW_ORIGINS` chỉ whitelist domain production

---

## 📚 Reference Files

Khi cần chi tiết implementation cho từng component, đọc file tương ứng:

- **`references/api.md`** — Chi tiết AdonisJS v6: Lucid Models, Migrations, Controllers, Validators, Routes, Seeders, node ace commands
- **`references/fe.md`** — Chi tiết Next.js 15: Design System, Components, Hooks, SEO, App Router structure
- **`references/cms.md`** — Chi tiết CMS: Quy trình tạo Module, Atomic Components, React Query/Zustand patterns, UI Standards
- **`references/cdn.md`** — Chi tiết Golang CDN: Gin routes, Handlers, Config, Image processing, Middleware, Testing
