# Automation Post API

Tài liệu này mô tả cách dùng Access Token để automation tạo bài viết vào hệ thống CMS/API.

## 1. Tạo Access Token trong CMS

1. Đăng nhập CMS.
2. Vào `Settings / API Tokens`.
3. Bấm `Create token`.
4. Nhập tên token, ví dụ `Marketing automation`.
5. Chọn thời hạn:
   - `1 tuần`
   - `1 tháng`
   - `1 năm`
   - `No expire`
6. Cấp quyền trong nhóm CMS Content.

Quyền tối thiểu để tạo bài viết:

```text
posts.create
```

Quyền thường dùng cho automation bài viết:

```text
posts.read
posts.create
posts.update
posts.delete
media.read
media.create
categories.read
tags.read
```

Token chỉ hiển thị một lần sau khi tạo. Cần copy và lưu vào secret manager hoặc biến môi trường của automation.

## 2. Endpoint tạo bài viết

```http
POST /api/automation/posts
```

Base URL local mặc định:

```text
http://localhost:4000
```

Header bắt buộc:

```http
Content-Type: application/json
X-API-TOKEN: <token>
```

Có thể dùng Bearer token thay thế:

```http
Authorization: Bearer <token>
```

## 3. Payload

Các field bắt buộc:

```json
{
  "title": "Tiêu đề bài viết",
  "slug": "tieu-de-bai-viet",
  "content": "<p>Nội dung bài viết</p>"
}
```

Payload đầy đủ:

```json
{
  "title": "Triển khai Kubernetes cơ bản",
  "slug": "trien-khai-kubernetes-co-ban",
  "content": "<h2>Giới thiệu</h2><p>Nội dung HTML hoặc Markdown đã render.</p>",
  "excerpt": "Tóm tắt ngắn cho bài viết.",
  "metaTitle": "Triển khai Kubernetes cơ bản",
  "metaDescription": "Hướng dẫn triển khai Kubernetes cơ bản cho DevOps.",
  "focusKeyword": "kubernetes",
  "canonicalUrl": "https://thanhnh.id.vn/docs/trien-khai-kubernetes-co-ban",
  "coverImage": "Posts/2026/05/cover.webp",
  "status": "DRAFT",
  "categoryId": 1,
  "seriesId": 2,
  "tagIds": [1, 2, 3],
  "publishedAt": "2026-05-15T09:00:00.000Z"
}
```

## 4. Field Rules

`title`:

Tên bài viết, tối thiểu 3 ký tự, tối đa 255 ký tự.

`slug`:

Chỉ dùng chữ thường, số và dấu gạch ngang. Ví dụ `cai-dat-nginx-tren-ubuntu`.

`content`:

Nội dung bài viết. API hiện nhận chuỗi text/HTML.

`status`:

Một trong các giá trị:

```text
DRAFT
PUBLISHED
ARCHIVED
```

Nếu automation chưa muốn public ngay, dùng `DRAFT`.

`categoryId`, `seriesId`, `tagIds`:

Là ID đã tồn tại trong database. Nếu gửi ID không tồn tại, API trả về lỗi validate.

`coverImage`:

Chỉ gửi URL/path ảnh đã có. Không upload file trực tiếp qua endpoint tạo bài. Upload media phải đi qua Media API/CMS trước, sau đó dùng path trả về làm `coverImage`.

## 5. Upload ảnh cho bài viết

Automation có thể upload ảnh vào CDN qua API token trước, sau đó dùng `path` trả về cho `coverImage` hoặc chèn vào `content`.

Endpoint:

```http
POST /api/automation/media/upload
```

Header:

```http
X-API-TOKEN: <token>
```

Form data:

```text
file=<image file>
folder=Posts
```

Ví dụ:

```bash
curl -X POST "http://localhost:4000/api/automation/media/upload" \
  -H "X-API-TOKEN: ${AUTO_POST_TOKEN}" \
  -F "file=@./cover.png" \
  -F "folder=Posts"
```

Response thành công gồm `path`, `url`, `optimized_url` và các biến thể ảnh nếu CDN trả về. Dùng `path` làm `coverImage`.

```json
{
  "data": {
    "path": "Posts/2026/05/cover.webp",
    "url": "Posts/2026/05/cover.webp"
  }
}
```

## 6. Ví dụ curl tạo bài

```bash
curl -X POST "http://localhost:4000/api/automation/posts" \
  -H "Content-Type: application/json" \
  -H "X-API-TOKEN: ${AUTO_POST_TOKEN}" \
  -d '{
    "title": "Cài đặt Nginx trên Ubuntu",
    "slug": "cai-dat-nginx-tren-ubuntu",
    "content": "<h2>Chuẩn bị</h2><p>Cài đặt package nginx.</p>",
    "excerpt": "Hướng dẫn cài đặt Nginx trên Ubuntu.",
    "status": "DRAFT",
    "categoryId": 1,
    "tagIds": [1, 2]
  }'
```

Response thành công:

```json
{
  "data": {
    "id": 123,
    "title": "Cài đặt Nginx trên Ubuntu",
    "slug": "cai-dat-nginx-tren-ubuntu",
    "status": "DRAFT"
  }
}
```

## 7. Ví dụ Node.js

```ts
const apiUrl = process.env.API_URL ?? 'http://localhost:4000'
const token = process.env.AUTO_POST_TOKEN

if (!token) {
  throw new Error('AUTO_POST_TOKEN is required')
}

const response = await fetch(`${apiUrl}/api/automation/posts`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-TOKEN': token,
  },
  body: JSON.stringify({
    title: 'Cài đặt Nginx trên Ubuntu',
    slug: 'cai-dat-nginx-tren-ubuntu',
    content: '<h2>Chuẩn bị</h2><p>Cài đặt package nginx.</p>',
    excerpt: 'Hướng dẫn cài đặt Nginx trên Ubuntu.',
    status: 'DRAFT',
    categoryId: 1,
    tagIds: [1, 2],
  }),
})

if (!response.ok) {
  const error = await response.json()
  throw new Error(error.message ?? 'Cannot create post')
}

const result = await response.json()
console.log(result.data)
```

## 8. Các endpoint automation liên quan

```http
GET    /api/automation/posts
GET    /api/automation/posts/:id
POST   /api/automation/posts
PUT    /api/automation/posts/:id
DELETE /api/automation/posts/:id

GET    /api/automation/media
GET    /api/automation/media/detail
POST   /api/automation/media/upload
```

Quyền tương ứng:

```text
posts.read
posts.create
posts.update
posts.delete
media.read
media.create
```

## 9. Lỗi thường gặp

`401 API token is required`:

Thiếu header `X-API-TOKEN` hoặc `Authorization: Bearer`.

`401 Invalid or expired API token`:

Token sai, đã hết hạn hoặc đã bị xóa trong CMS.

`403 Insufficient token permissions`:

Token chưa được cấp quyền tương ứng, ví dụ thiếu `posts.create`.

`422 Validation error`:

Payload sai format, slug đã tồn tại, hoặc `categoryId`, `seriesId`, `tagIds` không tồn tại.

## 10. Checklist triển khai automation

- Tạo token trong CMS và lưu vào secret manager.
- Cấp tối thiểu quyền `posts.create`.
- Cấp thêm `media.create` nếu automation cần upload ảnh.
- Chuẩn hóa slug trước khi gọi API.
- Dùng `DRAFT` cho bài cần kiểm duyệt thủ công.
- Upload ảnh qua Media API/CMS trước, chỉ gửi path ảnh vào `coverImage`.
- Log lại response lỗi để dễ kiểm tra validation.
