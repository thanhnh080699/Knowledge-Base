# Editorial Standards & SEO Guidelines

Tài liệu này định hình tiêu chuẩn biên tập, văn phong, quy tắc SEO và đồ họa cho toàn bộ bài viết trên blog `thanhnh.id.vn`.

---

## 1. Giọng văn và Phong cách Biên tập

- **Đối tượng độc giả**: Người dùng văn phòng, chuyên viên IT Help Desk, kỹ sư DevOps và System Administrator.
- **Văn phong**: Tiếp cận gần gũi, chính xác về kỹ thuật, lập luận dựa trên bằng chứng và cơ chế hoạt động thực tế.
- **Độ dài bài viết**: Nhắm đến **1.500 – 2.000 từ tiếng Việt**. Ưu tiên chiều sâu kỹ thuật và tính hữu dụng hơn là độ dài hình thức.
- **Cách diễn đạt có điều kiện**: Nêu rõ môi trường thử nghiệm, phiên bản hệ điều hành (ví dụ: Windows 11 Build 22H2/23H2, Ubuntu 22.04 LTS), các tiền đề, giới hạn và trường hợp ngoại lệ. Không tuyệt đối hóa lời khuyên kỹ thuật.
- **Giải thích cơ chế (Root Cause)**: Không chỉ liệt kê "hãy bấm nút này", mà giải thích tại sao bước này giúp khoanh vùng hoặc giải quyết sự cố (ví dụ: giải thích tại sao cần khởi động lại dịch vụ Print Spooler, cách hoạt động của lệnh `ipconfig /flushdns` và ARP cache).
- **Cảnh báo rủi ro**: Đối với các thao tác có nguy cơ làm gián đoạn hệ thống (như reset network stack, xóa toàn bộ hàng đợi máy in, xóa registry), **bắt buộc** phải nêu rõ tác động cụ thể và hướng dẫn sao lưu ngay tại bước thực hiện.

---

## 2. Các quy tắc "Anti-AI" nghiêm ngặt

1. **TUYỆT ĐỐI KHÔNG DÙNG DẤU GẠCH NGANG DÀI (EM DASH — `U+2014`)**:
   - Thay thế bằng dấu phẩy, dấu hai chấm, dấu ngoặc đơn `(...)` hoặc tách thành câu ngắn tự nhiên.
2. **Không dùng các cụm từ sáo rỗng thường gặp của AI**:
   - Tránh: *"đóng vai trò quan trọng"*, *"không chỉ... mà còn..."*, *"trong thời đại số ngày nay"*, *"hãy cùng tìm hiểu"*, *"như chúng ta đã biết"*, *"tóm lại là"*.
   - Mở bài trực diện vào hiện tượng sự cố, triệu chứng người dùng gặp phải và mục tiêu chẩn đoán.
3. **Không bịa đặt số liệu hay dẫn chứng**:
   - Chỉ dẫn link đến tài liệu chính thức từ hãng (Microsoft Docs/Learn, Apple Support, Nginx/Docker documentation).
   - Dẫn nguồn tự nhiên vào câu văn, không copy nguyên văn các đoạn dài.

---

## 3. Cấu trúc bài viết & Heading Hierarchy

- **H1 (Tiêu đề trang)**: Tiêu đề trang được render tự động từ trường `title`. **TUYỆT ĐỐI KHÔNG lặp lại thẻ `<h1>` bên trong phần `content` HTML**.
- **H2 (Mục lớn)**: Các phần chính của bài viết (Triệu chứng & Nguyên nhân, Quy trình chẩn đoán từng bước, Khắc phục nâng cao, Khi nào cần chuyển lên IT cấp cao).
- **H3 (Bước chi tiết)**: Từng bước thực hiện cụ thể.
- **Mục lục (Table of Contents)**: Mọi link neo `#anchor-id` trong TOC phải khớp 100% với thuộc tính `id="..."` trên các thẻ H2/H3 tương ứng.
- **Khối lệnh (Command Blocks)**: Cung cấp lệnh PowerShell/CMD/Bash nguyên bản, giải thích rõ cờ (flag) và quyền thực thi (Run as Administrator).

---

## 4. Tối ưu SEO & Metadata

| Thuộc tính | Tiêu chuẩn | Ví dụ |
|---|---|---|
| **Title (Tiêu đề)** | 3 - 255 ký tự, chứa Focus Keyword | *Sửa lỗi máy in Offline trên Windows 11: Quy trình chẩn đoán từ kết nối đến Spooler* |
| **Meta Title** | 50 – 60 ký tự, hấp dẫn, chứa keyword ở đầu | *Khắc phục lỗi máy in Offline trên Windows 11 hiệu quả* |
| **Meta Description** | 140 – 160 ký tự, tóm tắt giải pháp cụ thể | *Hướng dẫn từng bước chẩn đoán và khắc phục lỗi máy in báo Offline trên Windows 11, từ kiểm tra kết nối mạng, reset Print Spooler đến cập nhật driver.* |
| **Focus Keyword** | Cụm từ người dùng hay tìm kiếm | `máy in offline windows 11` |
| **Slug** | Kebab-case, duy nhất, khớp regex `^[a-z0-9-]+$` | `may-in-offline-windows-11` |
| **Canonical URL** | Khớp đường dẫn công khai trên website | `https://thanhnh.id.vn/docs/may-in-offline-windows-11` |
| **Excerpt** | 1 - 2 câu tóm tắt nội dung bài viết | *Quy trình khoanh vùng lỗi máy in báo trạng thái Offline trên Windows 11 dành cho người dùng văn phòng và IT Help Desk.* |

---

## 5. Quy chuẩn Hình ảnh & Đồ họa

Mỗi bài viết hoàn chỉnh cần đúng **3 hình ảnh độc bản**:

1. **Ảnh bìa (Cover Image)**:
   - Tỷ lệ: `16:9` (khuyến nghị 1600x900).
   - Nội dung: Minh họa chủ đề bài viết trực quan, phong cách hiện đại, không dùng stock photo rẻ tiền.
   - Định dạng: **WebP**, chất lượng nén 82 - 85.
   - Lưu trữ: Relative path từ CDN gán vào trường `coverImage`.

2. **Sơ đồ chẩn đoán (Diagnostic Flowchart)**:
   - Kích thước: `1600x1200` hoặc `1600x900`.
   - Nội dung: Sơ đồ thuật toán/quy trình chẩn đoán từng bước, có số thứ tự, mũi tên luồng đi, hành động kiểm tra và kết quả xử lý.
   - Sinh bằng công cụ vẽ vector xác định (`diagram-generator.ts` sinh SVG rồi render WebP).
   - Nhúng trong bài viết bằng thẻ `<figure>`:
     ```html
     <figure>
       <img src="https://cdn.thanhnh.id.vn/medias/blog/help-desk/may-in-offline-windows-11/so-do-chan-doan.webp" alt="Sơ đồ quy trình chẩn đoán lỗi máy in offline trên Windows 11" />
       <figcaption>Hình 1: Quy trình từng bước chẩn đoán sự cố máy in báo Offline từ phần cứng đến dịch vụ Print Spooler.</figcaption>
     </figure>
     ```

3. **Minh họa kỹ thuật (Technical Illustration)**:
   - Tỷ lệ: `16:9` (1600x900).
   - Nội dung: Minh họa kiến trúc, cấu hình cổng TCP/IP Standard Port, hoặc giao diện công cụ chẩn đoán.
   - Định dạng: **WebP**.
   - Phải có alt text tiếng Việt mô tả chính xác và chú thích `<figcaption>`.

---

## 6. Checklist Kiểm thử Chất lượng (QA)

Trước khi chuyển trạng thái bài viết từ `DRAFT` sang `PUBLISHED`, phải hoàn thành bảng kiểm tra:

- [ ] Bài viết đã được tạo ở trạng thái `DRAFT` và kiểm tra response API trả về.
- [ ] Không có thẻ `<h1>` bên trong thân bài viết.
- [ ] Số lượng dấu gạch ngang dài (em dash `—`) bằng 0.
- [ ] Cả 3 hình ảnh tải thành công qua đường dẫn CDN tuyệt đối (`https://cdn.thanhnh.id.vn/...`).
- [ ] Tất cả các liên kết trong Table of Contents đều trỏ đúng anchor id trong bài.
- [ ] Kiểm tra hiển thị responsive trên giao diện web (không bị tràn chiều ngang `scrollWidth <= width`).
- [ ] Người dùng (User) đã kiểm duyệt nội dung preview và đồng ý xuất bản.
