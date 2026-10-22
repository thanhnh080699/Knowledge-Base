# API Schema & Endpoint Specification

Tài liệu này tổng hợp toàn bộ phân tích source code AdonisJS API (`api/app/`), Next.js CMS (`cms/src/`) và hệ thống CDN (`cdn/`), không suy đoán bất kỳ endpoint hay trường dữ liệu nào.

---

## 1. Authentication & Security

- **Origin chính thức**: `https://api.thanhnh.id.vn`
- **Base API Path**: `https://api.thanhnh.id.vn/api`
- **Header xác thực**:
  ```http
  x-api-token: <token>
  ```
  *(Có thể dùng `Authorization: Bearer <token>`)*
- **Lưu trữ Token an toàn**:
  - Không hardcode token vào file code, git, log, hay script arguments.
  - Lấy từ macOS Keychain:
    ```bash
    /usr/bin/security find-generic-password -s thanhnh.id.vn.production.content-api -a content-automation -w
    ```
    hoặc biến môi trường `CONTENT_API_TOKEN` khi chạy trên môi trường CI/CD.
  - Bộ nhớ process chỉ giữ token tạm thời; nghiêm cấm forward token sang CDN domain (`cdn.thanhnh.id.vn`) hoặc các URL bên thứ ba.
  - Tắt auto-redirect (`redirect: 'error'`) trên HTTP client để ngăn rò rỉ token qua cross-origin redirect.

---

## 2. Media API Endpoints

### 2.1. Upload Media
- **Route**: `POST /api/automation/media/upload`
- **Quyền yêu cầu**: `media.create`
- **Content-Type**: `multipart/form-data`
- **Form Fields**:
  - `file` *(bắt buộc)*: Binary image (hỗ trợ WebP, PNG, JPG/JPEG).
  - `folder` *(tùy chọn)*: Đường dẫn thư mục trên CDN, ví dụ `blog/help-desk/20261021` hoặc `Posts`.
  - `width` *(tùy chọn)*: Chiều rộng ảnh.
  - `height` *(tùy chọn)*: Chiều cao ảnh.
- **Response thành công (HTTP 201)**:
  ```json
  {
    "message": "File uploaded successfully",
    "data": {
      "original_name": "may-in-offline-windows-11-so-do-chan-doan.webp",
      "file_name": "a1b2c3d4-e5f6-7890-abcd-ef1234567890.webp",
      "path": "blog/help-desk/20261021/a1b2c3d4-e5f6-7890-abcd-ef1234567890.webp",
      "url": "https://cdn.thanhnh.id.vn/medias/blog/help-desk/20261021/a1b2c3d4-e5f6-7890-abcd-ef1234567890.webp",
      "size": 43638,
      "mime_type": "image/webp"
    }
  }
  ```
- **Quy tắc quan trọng về đường dẫn ảnh**:
  - `coverImage`: Sử dụng **relative path** trả về trong `data.path` (ví dụ: `blog/help-desk/20261021/cover.webp`).
  - Thẻ `<img>` trong `content` HTML: **BẮT BUỘC DÙNG URL CDN TUYỆT ĐỐI** dạng `src="https://cdn.thanhnh.id.vn/medias/blog/..."` để hiển thị đúng cả ở Frontend lẫn TinyMCE Editor trong CMS.

### 2.2. Chi tiết & Danh sách Media
- **Route danh sách**: `GET /api/automation/media` (Query: `folder`, `sort`, `direction`, `limit`, `offset`) - Quyền: `media.read`
- **Route chi tiết**: `GET /api/automation/media/detail` (Query: `path`) - Quyền: `media.read`

---

## 3. Posts API Endpoints

### 3.1. Danh sách bài viết
- **Route**: `GET /api/automation/posts`
- **Quyền yêu cầu**: `posts.read`
- **Query Parameters**:
  - `page`: Số trang (mặc định: `1`).
  - `limit`: Số bài mỗi trang (mặc định: `10`).
  - `categoryId`: Lọc theo ID danh mục (sẽ tự động preload cả bài viết thuộc danh mục con).
  - `category`: Lọc theo slug danh mục.
  - `tagId`: Lọc theo ID tag.
  - `tag`: Lọc theo slug tag.
  - `status`: Lọc theo trạng thái (`DRAFT`, `PUBLISHED`, `ARCHIVED`).
  - `search` hoặc `q`: Tìm kiếm theo từ khóa trong `title`, `slug`, `excerpt`, `content`.
  - `trashed`: `true`/`1` để xem bài trong thùng rác (soft-deleted).

### 3.2. Chi tiết bài viết
- **Route**: `GET /api/automation/posts/:id`
- **Quyền yêu cầu**: `posts.read`
- **Params**: `:id` có thể là numeric ID (ví dụ: `123`) hoặc chuỗi `slug` (ví dụ: `windows-11-chay-cham`).
- **Response**: `{ "data": <Post> }`

### 3.3. Tạo bài viết mới
- **Route**: `POST /api/automation/posts`
- **Quyền yêu cầu**: `posts.create`
- **Content-Type**: `application/json`
- **Validation Rules (VineJS - `api/app/validators/post.ts`)**:

| Field | Type | Bắt buộc | Ràng buộc / Định dạng |
|---|---|---|---|
| `title` | string | **Có** | `minLength(3)`, `maxLength(255)`, trim |
| `slug` | string | **Có** | Regex `^[a-z0-9-]+$`, trim, lowercase, **unique trong bảng posts** |
| `content` | string | **Có** | HTML string, trim |
| `excerpt` | string | Không | Tóm tắt ngắn, trim |
| `metaTitle` | string | Không | `maxLength(255)`, trim (khuyến nghị 50-60 ký tự) |
| `metaDescription` | string | Không | trim (khuyến nghị 140-160 ký tự) |
| `focusKeyword` | string | Không | `maxLength(255)`, trim |
| `canonicalUrl` | string | Không | Định dạng URL hợp lệ (`https://thanhnh.id.vn/...`) |
| `coverImage` | string | Không | Đường dẫn CDN tương đối (sẽ được tự động chuẩn hóa qua `normalizeMediaPath`) |
| `status` | enum | Không | Giá trị: `'DRAFT'`, `'PUBLISHED'`, `'ARCHIVED'` (Mặc định: `'DRAFT'`) |
| `views` | number | Không | Số nguyên `min(0)` |
| `categoryId` | number | Không | Phải tồn tại trong bảng `categories` |
| `seriesId` | number | Không | Phải tồn tại trong bảng `series` |
| `tagIds` | number[] | Không | Mảng ID, từng ID phải tồn tại trong bảng `tags` |
| `publishedAt` | string | Không | Định dạng ngày giờ ISO 8601 (ví dụ `2026-10-21T07:53:25.000Z`) |

### 3.4. Cập nhật bài viết
- **Route**: `PUT /api/automation/posts/:id`
- **Quyền yêu cầu**: `posts.update`
- **Params**: `:id` là ID số của bài viết.
- **Payload**: Các trường giống như khi tạo bài viết (tất cả đều là tùy chọn). Nếu truyền `slug`, hệ thống kiểm tra tính duy nhất loại trừ bài viết hiện tại.

### 3.5. Xóa bài viết
- **Route**: `DELETE /api/automation/posts/:id`
- **Quyền yêu cầu**: `posts.delete`
- **Cơ chế**: Soft delete (đặt `deletedAt = now()`).

---

## 4. Taxonomies (Categories & Tags)

### 4.1. Categories (Công khai)
- **Danh sách**: `GET /api/categories` (hỗ trợ `page`, `limit`, `q`, `parent_id`, `roots`)
- **Chi tiết**: `GET /api/categories/:id` (ID hoặc slug)
- **ID các danh mục chính trên hệ thống**:
  - `ID: 2` - Help Desk (`slug: help-desk`)
  - `ID: 14` - Kiến trúc hệ thống (`slug: kien-truc-he-thong`)
  - `ID: 15` - Triển khai & Hiệu năng (`slug: trien-khai-hieu-nang`)
  - `ID: 1` - System Administrator (`slug: system-administrator`)
  - `ID: 3` - Dev Ops (`slug: dev-ops`)
  - `ID: 8` - Docker (`slug: docker`)
  - `ID: 7` - Linux (`slug: linux-4`)
  - `ID: 4` - Nginx (`slug: nginx-3`)
  - `ID: 6` - MySQL (`slug: mysql`)
  - `ID: 9` - Monitoring (`slug: monitoring`)
  - `ID: 10` - Caching Solutions (`slug: caching-solutions`)

### 4.2. Tags (Công khai)
- **Danh sách**: `GET /api/tags` (hỗ trợ `page`, `limit`, `q`)
- **Chi tiết**: `GET /api/tags/:id` (ID hoặc slug)

---

## 5. HTTP Status Codes & Error Formats

| Status Code | Tình huống | Cấu trúc phản hồi |
|---|---|---|
| **200 OK** | Truy vấn hoặc cập nhật thành công | `{ "data": ... }` |
| **201 Created** | Tạo bài viết hoặc upload media thành công | `{ "data": ... }` |
| **204 No Content** | Xóa bài viết thành công | *(Trống)* |
| **401 Unauthorized** | Thiếu token hoặc token sai/hết hạn | `{"message": "API token is required"}` hoặc `{"message": "Invalid or expired API token"}` |
| **403 Forbidden** | Token thiếu quyền cần thiết (ví dụ thiếu `posts.create`) | `{"message": "Insufficient token permissions"}` |
| **404 Not Found** | Không tìm thấy ID/Slug | `{"message": "Row not found"}` |
| **422 Unprocessable** | Vi phạm validation (trùng slug, sai format) | `{"errors": [{"message": "...", "field": "slug", "rule": "unique"}]}` |
| **500 Server Error** | Lỗi nội bộ server | `{"message": "..."}` |
