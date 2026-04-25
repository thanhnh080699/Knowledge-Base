# CDN Reference — Golang + Gin (ĐÃ CÓ SẴN)

CDN service đã được xây dựng hoàn chỉnh tại `cdn/`. Dưới đây là tài liệu chi tiết về kiến trúc và cách sử dụng.

> **Lưu ý**: Module name hiện tại là `meditour/cdn`, cần refactor sang `thanhnh/cdn` khi có thời gian.

---

## Cấu trúc thư mục

```
cdn/
├── main.go                 # Entry point, route registration, CORS, rate limiting
├── config/
│   └── config.go           # Env loading (godotenv), Config struct
├── handlers/
│   ├── upload.go           # SingleUploadHandler, MultiUploadHandler
│   ├── image.go            # ServeFileHandler (on-the-fly processing + cache)
│   ├── folder.go           # Create/Rename/Delete folder handlers
│   ├── file.go             # DeleteFileHandler (+ cache cleanup)
│   └── middleware.go       # RateLimitMiddleware, SignatureMiddleware, AuthMiddleware
├── utils/
│   └── utils.go            # DetectMimeType, IsAllowedExtension, GenerateUniqueFileName
├── tests/                  # Integration tests
├── go.mod                  # Dependencies: gin, imaging, uuid, godotenv, cors, time
├── go.sum
├── .env.example
└── .gitignore
```

---

## Biến môi trường (.env)

```env
PORT=8081
APP_DEBUG=true
UPLOAD_DIR=./medias
UPLOAD_PATH=/medias/
ALLOWED_EXTENSIONS=jpg,jpeg,png,gif,webp,svg,mp4,mov,avi,webm,pdf,doc,docx,xls,xlsx,ppt,pptx,txt
MAX_UPLOAD_SIZE=10485760
API_KEY=your_secret_key_here
BASE_URL=http://localhost:8081
GIN_MODE=debug
ALLOW_ORIGINS=*
CACHE_DIR=./medias/cache
RATE_LIMIT_RPS=5.0
RATE_LIMIT_BURST=10
REQUIRE_SIGNATURE=false
SIGNATURE_KEY=your_signature_secret_key_here
```

---

## API Endpoints

### Health Check
- `GET /health` → `{"status": "UP", "info": "..."}`

### File Upload (Auth required: `X-API-KEY` header)
- `POST /api/upload` — Single file upload (`multipart/form-data`, field: `file`, optional: `folder`)
- `POST /api/uploads` — Multiple files upload (field: `files`)

### Folder Management (Auth required)
- `POST /api/folder` — Create folder: `{"path": "products/2026"}`
- `PUT /api/folder` — Rename: `{"old_path": "...", "new_path": "..."}`
- `DELETE /api/folder` — Delete folder (recursive): `{"path": "..."}`

### File Management (Auth required)
- `DELETE /api/file` — Delete file: `?path=...` hoặc body `{"path": "..."}`

### File Serving (Public, optional signature)
- `GET /medias/{path}` — Serve file
  - `?w=300` — Resize width
  - `?h=200` — Resize height
  - `?fmt=webp` — Convert format
  - `?sig=...&exp=...` — Signed URL (if enabled)

---

## Tính năng chính

### On-the-fly Image Processing
- Resize theo `w`, `h` query params
- Convert format qua `fmt` param (webp/jpg/png)
- Cache tự động: `CACHE_DIR/{path}/{name}_w{w}_h{h}.{ext}`
- Header: `X-Cache: HIT/MISS`

### Security
- **Auth**: API Key qua header `X-API-KEY` hoặc query `?api_key=`
- **Deep Inspection**: Đọc magic bytes (512 bytes đầu) để xác thực MIME type
- **Path Traversal Protection**: Clean path, block `..`
- **Rate Limiting**: Per-IP limiter (`golang.org/x/time/rate`)
- **Signed URLs**: HMAC-SHA256(`path + expiry`, signature_key) — bật/tắt qua config

### File Storage
- Cấu trúc: `UPLOAD_DIR/{folder}/{uuid}.{ext}`
- Nếu không có `folder` param → lưu vào root
- UUID filename ngăn collision
- Cache cleanup tự động khi xóa file gốc

---

## Dependencies (go.mod)

```
github.com/gin-gonic/gin          # HTTP framework
github.com/gin-contrib/cors        # CORS middleware
github.com/disintegration/imaging  # Image processing (resize, format convert)
github.com/google/uuid             # UUID generation
github.com/joho/godotenv           # .env file loading
github.com/stretchr/testify        # Testing assertions
golang.org/x/time                  # Rate limiting
```

---

## Commands

```bash
# Dev
go run main.go

# Build
go build -o cdn-server main.go

# Test
go test -v ./tests/...

# Dependencies
go mod tidy
```

---

## Response Format

### Upload Success

```json
{
  "message": "File uploaded successfully",
  "data": {
    "original_name": "image.jpg",
    "file_name": "3f4b5c...jpg",
    "path": "folder/3f4b5c...jpg",
    "url": "/medias/folder/3f4b5c...jpg",
    "size": 102400,
    "mime_type": "image/jpeg"
  }
}
```

### Error

```json
{
  "error": "Error message description"
}
```

---

## Tích hợp với API (AdonisJS)

Khi API cần upload ảnh (cover_image, thumbnail), gọi CDN endpoint:

```typescript
// Trong AdonisJS controller hoặc service
import axios from 'axios'
import FormData from 'form-data'

async function uploadToCdn(file: Buffer, filename: string, folder: string) {
  const form = new FormData()
  form.append('file', file, filename)
  form.append('folder', folder)

  const { data } = await axios.post(`${CDN_URL}/api/upload`, form, {
    headers: {
      'X-API-KEY': CDN_API_KEY,
      ...form.getHeaders(),
    },
  })
  return data.data.url // → /medias/folder/uuid.ext
}
```
