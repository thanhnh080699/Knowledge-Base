# Integration Guide: Coordinating Installed Agent Skills

Skill `blog-publisher` hoạt động như một nhạc trưởng (Orchestration Skill) kết hợp sức mạnh của các skill chuyên biệt đã được cài đặt sẵn trong hệ sinh thái AG Kit:

```
[Nguồn đầu vào: PDF / DOCX / URL / MD]
                  │
                  ▼
         ┌──────────────────┐
         │ Document Ingestion│  <─── Skill: `pdf` & `docx`
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │ Research & Draft │  <─── Skill: `content-research-writer`
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │ Copywriting & QA │  <─── Skill: `copywriting` & `copy-editing` (Loại bỏ AI slop, cấm em-dash)
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │  SEO & Schema    │  <─── Skill: `ai-seo` & `seo-audit` & `schema`
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │ Visuals & Assets │  <─── Scripts: `diagram-generator.ts` (SVG/WebP)
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │ Automation & API │  <─── Scripts: `cli.ts` & `content-api.ts` (Dry-run, Draft, Publish)
         └──────────────────┘
```

---

## 1. Tích hợp Skill `pdf` & `docx`

- **Khi đọc tài liệu PDF**:
  - Dùng công cụ từ skill `pdf` để bóc tách văn bản, bảng biểu, danh mục thuật ngữ và danh sách nguồn tài liệu tham khảo.
  - Bảo toàn nguyên vẹn các đường link citation và chú thích cuối trang (footnotes) để đưa vào phần tài liệu tham khảo tiếng Việt.
- **Khi đọc tài liệu Word (`.docx`)**:
  - Tận dụng cấu trúc tiêu đề (Heading 1, 2, 3) có sẵn trong file `.docx` để chuyển đổi tự nhiên sang sơ đồ cấu trúc bài viết (H2, H3).
  - Trích xuất bảng số liệu kỹ thuật giữ nguyên định dạng Markdown table.

---

## 2. Tích hợp Skill `content-research-writer`

- Hỗ trợ xây dựng dàn ý 4 tầng (Triệu chứng $\rightarrow$ Nguyên nhân gốc rễ $\rightarrow$ Các bước xử lý tuần tự $\rightarrow$ Hướng dẫn leo thang lên cấp IT quản trị).
- Tìm kiếm tài liệu đối chứng chính thức (Microsoft Learn, RFC, IEEE, tài liệu nhà sản xuất thiết bị như HP, Canon, Cisco).
- Đảm bảo trích dẫn nguồn đúng ngữ cảnh, không đưa ra giả định suy đoán.

---

## 3. Tích hợp Skill `copy-editing` & `copywriting`

- **Kiểm soát văn phong**:
  - Loại bỏ các câu trúc lặp, các cặp câu đối lập sáo rỗng thường gặp ở LLM (*"không phải là X, mà là Y"*).
  - Thay đổi linh hoạt độ dài câu văn, sử dụng đại từ xưng hô phù hợp với văn hóa IT Việt Nam.
  - Rà soát tự động để đảm bảo **0 dấu gạch ngang dài (em dash —)** trong toàn văn bản.

---

## 4. Tích hợp Skill `ai-seo` & `seo-audit` & `schema`

- **Answer Engine Optimization (AEO)**:
  - Tối ưu cấu trúc câu trả lời trực tiếp (Direct Answer Block) ngay dưới mỗi thẻ H2 để các công cụ tìm kiếm AI (Google AI Overviews, Perplexity, ChatGPT Search) có thể trích dẫn (cite) làm nguồn chuẩn xác.
  - Phân tích search intent: Người dùng đang cần khắc phục sự cố khẩn cấp (troubleshooting intent) hay tìm hiểu kiến trúc (informational intent).
- **Internal Linking Strategy**:
  - Tự động quét danh sách các bài viết hiện có trên `https://thanhnh.id.vn` để đề xuất liên kết nội bộ liên quan (ví dụ: liên kết giữa bài viết *Cấu hình Nginx* và bài viết *Tối ưu Caching*).
- **Schema Markup**:
  - Đề xuất cấu trúc JSON-LD dạng `TechArticle` hoặc `HowTo` phù hợp với bài viết hướng dẫn kỹ thuật.
