---
name: blog-publisher
description: "End-to-end editorial and publishing pipeline for thanhnh.id.vn. Ingests PDF, DOCX, Markdown, or web URLs; accurately translates and localizes to Vietnamese while preserving citations and primary sources; crafts high-depth technical and Help Desk blog posts; optimizes search intent, keywords, titles, descriptions, slugs, and H1-H3 hierarchy; generates deterministic SVG diagrams and renders high-quality WebP images; performs QA and link checks; interfaces with AdonisJS Content API and Go CDN to upload assets and create draft posts; enforces dry-run, idempotency, retry/backoff, and zero-leakage security standards."
metadata:
  version: 1.0.0
---

# Blog Publisher Skill

`blog-publisher` là skill điều phối toàn diện quy trình biên tập, đồ họa, tối ưu SEO và tự động hóa xuất bản bài viết lên website `thanhnh.id.vn`. Skill kết hợp sức mạnh của các skill chuyên biệt (`pdf`, `docx`, `content-research-writer`, `ai-seo`, `seo-audit`, `schema`, `copy-editing`) cùng bộ script TypeScript chuyên dụng tương thích trực tiếp với AdonisJS v6 Content API và Go CDN Gateway.

---

## 🎯 1. Nguyên tắc cốt lõi (Core Principles)

1. **Không suy đoán (Zero Guessing)**: Mọi endpoint, trường dữ liệu, kiểu giá trị và ràng buộc validation được trích xuất chính xác từ mã nguồn backend (`api/app/validators/post.ts`, `api/app/validators/media.ts`, `api/app/controllers/`).
2. **Bảo mật tuyệt đối (Zero Credential Leakage)**: Token xác thực được nạp trực tiếp vào bộ nhớ tiến trình từ macOS Keychain (`service: thanhnh.id.vn.production.content-api`, `account: content-automation`) hoặc biến môi trường `CONTENT_API_TOKEN`. Tuyệt đối không ghi token ra file, không in ra màn hình console, không đưa vào command argument hoặc URL query, và không gửi kèm header sang CDN.
3. **An toàn xuất bản (Draft-First & Confirmation Guard)**: Mọi bài viết tạo mới **bắt buộc ở trạng thái `DRAFT`**. Nghiêm cấm tự ý chuyển sang `PUBLISHED` khi chưa có sự xác nhận bằng lệnh rõ ràng từ người dùng.
4. **Chống trùng lặp & Idempotency**: Kiểm tra tính duy nhất của `slug` trước khi tạo bài viết. Nếu bài viết đã tồn tại ở trạng thái `DRAFT`, hệ thống hỗ trợ cập nhật an toàn hoặc giữ nguyên mà không tạo bài trùng hay gây lỗi 422.
5. **Khả năng phục hồi (Resilience)**: Tích hợp cơ chế retry tự động với exponential backoff và jitter khi gặp lỗi tạm thời (HTTP 429, 502, 503, 504, timeout).
6. **Hỗ trợ chạy thử (Dry-Run)**: Tùy chọn `--dry-run` cho phép kiểm tra toàn bộ dữ liệu, định dạng ảnh, cấu trúc heading và tính hợp lệ của payload mà không làm thay đổi cơ sở dữ liệu.

---

## 📚 2. Tích hợp các Agent Skills đã cài đặt

| Skill | Vai trò tích hợp trong pipeline `blog-publisher` |
|---|---|
| [`pdf`](file:///.agent/skills/pdf/SKILL.md) | Đọc, bóc tách văn bản, bảng biểu và danh mục tài liệu tham khảo từ file `.pdf`. |
| [`docx`](file:///.agent/skills/docx/SKILL.md) | Phân tích file Word `.docx`, chuyển đổi phân cấp tiêu đề Word sang heading H2-H3. |
| [`content-research-writer`](file:///.agent/skills/content-research-writer/SKILL.md) | Nghiên cứu nguồn tài liệu chính thức (Microsoft Learn, RFC, vendor docs), xây dựng dàn ý bài viết và bảo toàn chú dẫn nguồn. |
| [`ai-seo`](file:///.agent/skills/ai-seo/SKILL.md) | Tối ưu cấu trúc câu trả lời trực tiếp (Direct Answer Block) cho Answer Engines (Perplexity, ChatGPT, AI Overviews). |
| [`seo-audit`](file:///.agent/skills/seo-audit/SKILL.md) | Kiểm tra độ dài thẻ tiêu đề (50-60 ký tự), mô tả (140-160 ký tự), mật độ keyword và liên kết nội bộ. |
| [`schema`](file:///.agent/skills/schema/SKILL.md) | Đề xuất cấu trúc JSON-LD (`TechArticle`, `HowTo`) phù hợp với nội dung bài viết kỹ thuật. |
| [`copy-editing`](file:///.agent/skills/copy-editing/SKILL.md) & [`copywriting`](file:///.agent/skills/copywriting/SKILL.md) | Biên tập văn phong tiếng Việt tự nhiên, loại bỏ sáo rỗng AI và quét sạch dấu gạch ngang dài (`—`). |

---

## 🛠️ 3. Quy trình làm việc 6 bước (Workflow)

```
[1. Tiếp nhận tài liệu] ──> [2. Dịch & Biên tập] ──> [3. Tối ưu SEO & TOC]
                                                              │
[6. Xuất bản PUBLISHED] <── [5. Upload & Tạo DRAFT] <── [4. Sinh 3 Ảnh WebP]
      (Cần User duyệt)           (API Gateway)           (Diagram Generator)
```

### Bước 1: Tiếp nhận và phân tích tài liệu đầu vào
- Hỗ trợ các định dạng: `.pdf`, `.docx`, `.md`, hoặc URL web.
- Trích xuất toàn bộ liên kết bên ngoài và chú thích nguồn.
- Kiểm tra tính xác thực của thông tin kỹ thuật đối chiếu với tài liệu gốc của nhà sản xuất.

### Bước 2: Dịch thuật chuẩn xác và biên tập bài viết
- **Ngôn ngữ**: Tiếng Việt chuẩn mực, mạch lạc, phù hợp cho người dùng văn phòng và chuyên viên IT Help Desk/DevOps.
- **Quy tắc "Anti-AI" nghiêm ngặt**:
  - **CẤM DÙNG DẤU GẠCH NGANG DÀI (EM DASH — `U+2014`)**: Thay bằng dấu phẩy, dấu hai chấm, dấu ngoặc đơn hoặc tách câu.
  - Không dùng các cụm từ sáo rỗng: *"đóng vai trò quan trọng"*, *"không chỉ... mà còn..."*, *"trong thời đại số ngày nay"*, *"hãy cùng tìm hiểu"*.
  - Nêu rõ môi trường, phiên bản OS, điều kiện áp dụng và giới hạn.
  - Giải thích cơ chế (tại sao bước này lại giải quyết được sự cố).
  - Với các thao tác có rủi ro (clear spooler, reset TCP/IP, xóa registry): cảnh báo tác động cụ thể và hướng dẫn sao lưu ngay tại bước đó.
- **Độ dài bài viết**: Nhắm đến **1.500 – 2.000 từ tiếng Việt**.

### Bước 3: Tối ưu SEO và phân cấp Heading
- **H1**: Tiêu đề trang được tạo tự động từ `title`. **Không đặt thẻ `<h1>` bên trong `content`**.
- **H2 & H3**: Cấu trúc phân cấp logic, rõ ràng.
- **Table of Contents (Mục lục)**: Toàn bộ liên kết neo (`href="#target"`) phải khớp 100% với `id="target"` trên các heading.
- **Metadata**:
  - `focusKeyword`: Cụm từ khóa tìm kiếm thực tế (ví dụ: `máy in offline windows 11`).
  - `metaTitle`: 50 – 60 ký tự, chứa keyword ở đầu.
  - `metaDescription`: 140 – 160 ký tự, tóm tắt giải pháp cụ thể.
  - `slug`: Kebab-case, chỉ gồm chữ thường `a-z`, số `0-9` và dấu gạch ngang `-` (khớp `/^[a-z0-9-]+$/`).
  - `canonicalUrl`: `https://thanhnh.id.vn/docs/<slug>`.

### Bước 4: Sinh và tối ưu 3 hình ảnh độc bản
Mỗi bài viết bắt buộc phải có đúng **3 hình ảnh WebP**:
1. **Ảnh bìa (Cover Image)**: Tỷ lệ `16:9` (1600x900). Lưu ý: trường `coverImage` trong payload nhận **relative path** từ CDN (ví dụ `blog/help-desk/20261021/cover.webp`).
2. **Sơ đồ chẩn đoán (Diagnostic Flowchart)**: Kích thước `1600x1200` hoặc `1600x900`. Sinh vector xác định bằng `diagram-generator.ts` (SVG $\rightarrow$ PNG qua `sips` $\rightarrow$ WebP qua `cwebp`).
3. **Ảnh minh họa kỹ thuật (Technical Illustration)**: Tỷ lệ `16:9` (1600x900).
- **Quy tắc HTML Content**: Tất cả các thẻ `<img>` trong `content` **bắt buộc dùng URL CDN tuyệt đối**:
  ```html
  <figure>
    <img src="https://cdn.thanhnh.id.vn/medias/blog/help-desk/may-in-offline/so-do-chan-doan.webp" alt="Sơ đồ chẩn đoán sự cố máy in offline theo từng lớp" />
    <figcaption>Hình 1: Quy trình từng bước chẩn đoán sự cố máy in báo Offline từ phần cứng đến phần mềm.</figcaption>
  </figure>
  ```

### Bước 5: Upload Media và tạo bài viết DRAFT
- Sử dụng CLI hoặc client TypeScript để tự động:
  1. Upload 3 ảnh lên `POST /api/automation/media/upload`.
  2. Thay thế placeholder `{{cover}}`, `{{flowchart}}`, `{{tech-illustration}}` thành URL CDN tuyệt đối trong HTML content.
  3. Gán relative path vào trường `coverImage`.
  4. Gửi `POST /api/automation/posts` với `status: "DRAFT"`.
  5. Sinh file preview HTML cục bộ để người dùng kiểm tra trực quan.

### Bước 6: Kiểm duyệt QA và xác nhận xuất bản
- Chạy preview kiểm tra toàn bộ tiêu chí QA.
- Trình bày tóm tắt cho người dùng duyệt.
- Chỉ khi người dùng đồng ý, kích hoạt lệnh xuất bản `publish <postId> --confirm` để chuyển trạng thái sang `PUBLISHED` kèm thời gian UTC thực tế (`publishedAt`).

---

## 💻 4. Hướng dẫn sử dụng Bộ Script CLI

Bộ script chạy trực tiếp trên Node.js v22 bằng tính năng `--experimental-strip-types` (không cần cài thêm thư viện bên ngoài):

### 4.1. Kiểm tra kết nối và quyền API
```bash
node --experimental-strip-types .agent/skills/blog-publisher/scripts/cli.ts verify
```

### 4.2. Tra cứu danh mục và tag có sẵn
```bash
node --experimental-strip-types .agent/skills/blog-publisher/scripts/cli.ts categories
node --experimental-strip-types .agent/skills/blog-publisher/scripts/cli.ts tags
```

### 4.3. Sinh sơ đồ chẩn đoán SVG và render WebP
Có thể dùng `diagram-generator.ts` trực tiếp trong code hoặc qua Node one-liner:
```bash
node --experimental-strip-types -e '
import { DiagramGenerator } from "./.agent/skills/blog-publisher/scripts/diagram-generator.ts";
const gen = new DiagramGenerator();
await gen.renderFlowchartToWebp({
  title: "Xử lý máy in Offline trên Windows 11",
  steps: [
    { check: "Kiểm tra đèn báo và giấy in", label: "Có lỗi vật lý", outcome: "Xử lý kẹt giấy hoặc bổ sung mực" },
    { check: "Kiểm tra kết nối cáp USB hoặc IP mạng", label: "Mất kết nối", outcome: "Cắm lại cáp hoặc kiểm tra switch mạng" },
    { check: "Khởi động lại Print Spooler và xóa hàng đợi", label: "Hàng đợi bị nghẽn", outcome: "Dọn dẹp file spooler và in trang test" }
  ]
}, "./assets/so-do-chan-doan.webp");
'
```

### 4.4. Kiểm tra Dry-Run (Không ghi dữ liệu vào database)
```bash
node --experimental-strip-types .agent/skills/blog-publisher/scripts/cli.ts create-draft article-spec.json --dry-run
```

### 4.5. Tạo bài viết DRAFT chính thức
```bash
node --experimental-strip-types .agent/skills/blog-publisher/scripts/cli.ts create-draft article-spec.json
```
*(Nếu muốn ghi đè lên bài draft cũ cùng slug, thêm cờ `--update`)*.

### 4.6. Tạo file HTML Preview để kiểm tra trực quan
```bash
node --experimental-strip-types .agent/skills/blog-publisher/scripts/cli.ts preview article-spec.json preview.html
```

### 4.7. Xuất bản bài viết (BẮT BUỘC có cờ `--confirm`)
```bash
node --experimental-strip-types .agent/skills/blog-publisher/scripts/cli.ts publish <post_id> --confirm
```

---

## 📋 5. Cấu trúc file cấu hình bài viết (`article-spec.json`)

```json
{
  "title": "Khắc phục lỗi máy in báo Offline trên Windows 11",
  "slug": "khac-phuc-loi-may-in-bao-offline-tren-windows-11",
  "categorySlug": "help-desk",
  "tagSlugs": ["system-administrator"],
  "focusKeyword": "máy in offline windows 11",
  "metaTitle": "Sửa lỗi máy in báo Offline trên Windows 11 hiệu quả",
  "metaDescription": "Hướng dẫn chi tiết từng bước chẩn đoán và khắc phục sự cố máy in báo Offline trên Windows 11 từ kết nối vật lý, Print Spooler đến cổng TCP/IP.",
  "excerpt": "Quy trình khoanh vùng lỗi máy in báo trạng thái Offline trên Windows 11 dành cho người dùng văn phòng và chuyên viên IT Help Desk.",
  "canonicalUrl": "https://thanhnh.id.vn/docs/khac-phuc-loi-may-in-bao-offline-tren-windows-11",
  "images": [
    {
      "id": "cover",
      "localPath": "./assets/cover.webp",
      "folder": "blog/help-desk/20261021",
      "alt": "Minh họa sự cố máy in báo trạng thái Offline trên Windows 11",
      "caption": "Ảnh bìa: Khắc phục sự cố máy in báo Offline trên Windows 11",
      "isCover": true
    },
    {
      "id": "flowchart",
      "localPath": "./assets/so-do-chan-doan.webp",
      "folder": "blog/help-desk/20261021",
      "alt": "Sơ đồ quy trình chẩn đoán lỗi máy in offline từ phần cứng đến phần mềm",
      "caption": "Hình 1: Sơ đồ chẩn đoán sự cố máy in Offline theo từng lớp"
    },
    {
      "id": "tech-illustration",
      "localPath": "./assets/minh-hoa-ky-thuat.webp",
      "folder": "blog/help-desk/20261021",
      "alt": "Minh họa cấu hình Standard TCP/IP Port cho máy in mạng trên Windows",
      "caption": "Hình 2: Cấu hình cổng Standard TCP/IP Port trong Print Management"
    }
  ],
  "content": "<h2>Triệu chứng và nguyên nhân phổ biến</h2><p>Nội dung chi tiết...</p><figure><img src=\"{{flowchart}}\" alt=\"Sơ đồ chẩn đoán\" /><figcaption>Hình 1: Sơ đồ chẩn đoán</figcaption></figure>"
}
```

---

## 🔍 6. Tài liệu tham khảo đi kèm

- [API Schema & Endpoint Reference](references/api-schema.md): Đặc tả chi tiết các endpoint Swagger/OpenAPI, kiểu dữ liệu, mã lỗi và validator rules.
- [Editorial Standards & SEO Guidelines](references/editorial-guidelines.md): Tiêu chuẩn văn phong tiếng Việt, quy tắc cấm em-dash, cấu trúc heading và thông số hình ảnh.
- [Integration Guide](references/integration-guide.md): Hướng dẫn phối hợp giữa `blog-publisher` với các skill `pdf`, `docx`, `content-research-writer`, `ai-seo`.
