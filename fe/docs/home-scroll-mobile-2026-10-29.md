# Top Repos scroll và tối ưu mobile, 2026-10-29

Nhánh `codex/home-scroll-mobile`, bắt đầu từ `origin/master` ở `cca5cf6`.
Chưa deploy. Các thay đổi chưa commit ở checkout ban đầu được giữ nguyên.

## Kết quả đo

Lighthouse 13.6.0, mobile mặc định, simulated throttling, Chrome headless.
Các lượt đo chạy nối tiếp, không chạy browser QA hoặc build đồng thời.

| Môi trường | Performance | FCP | LCP | TBT | CLS | Transfer |
|---|---:|---:|---:|---:|---:|---:|
| Public trước sửa | 75 | 1,89 s | 5,44 s | 22 ms | 0 | 705 KiB |
| Source origin/master, local trước sửa | 84 | 1,99 s | 4,29 s | 37,5 ms | 0,001 | 3681 KiB |
| Local sau sửa, lần 1 | 96 | 1,22 s | 2,79 s | 6 ms | 0 | 310 KiB |
| Local sau sửa, lần 2, có bản vá anchor | 96 | 1,21 s | 2,78 s | 12 ms | 0 | 311 KiB |

Dữ liệu máy đọc: [home-scroll-mobile-2026-10-29.json](./home-scroll-mobile-2026-10-29.json).
Bản local dùng đầy đủ API và CDN production, không dùng fixture. Build Next.js
production được chạy bằng `next start`. Các lượt thử ban đầu có cấu hình CDN local
sai đã được loại khỏi bảng này và đo lại cả trước/sau với cấu hình đúng.

Bản public đã có một số tối ưu font/logo và cách phục vụ asset khác source
origin/master. Vì vậy không xem hai môi trường là phép so sánh đồng nhất, không
khẳng định PageSpeed public đã đạt 96. Cần đo lại URL public sau khi deploy.
LCP local còn khoảng 2,8 giây, chưa dưới mục tiêu 2,5 giây; đây là số liệu lab,
không phải dữ liệu Core Web Vitals từ người dùng thật.

## Thay đổi

- Top Repos: đường nối tiến theo cuộn, ảnh bài nổi bật mở dần khung nhìn, các
  bài tiếp theo chuyển động nhẹ theo tiến trình đọc. Không pin riêng phần này.
- Dùng GSAP/ScrollTrigger sẵn có; tải động khi đến gần nội dung tương tác.
  Xử lý tọa độ neo sau khi scene cũ tạo pin spacing, giữ đúng #top-repos và
  #cong-cu cho cả mở trực tiếp lẫn bấm điều hướng từ hero.
- Ảnh hero responsive với preload và fetchPriority cao; ảnh Docs responsive.
- Giữ font display và font Inter desktop qua các subset WOFF2 cục bộ có license;
  mobile dùng font hệ thống cho body. Tránh CSS Google Fonts từ bên ngoài.
- Logo/favicon qua Next Image; giữ kích thước để tránh layout shift.
- Sprite mobile 780×780 giữ đủ chín ô. Chỉ tải direction atlas lúc đầu; reaction
  atlas được tải và giải mã khi người dùng tương tác, có xử lý lỗi tải/unmount.

## Kiểm tra

- Production build và TypeScript: qua.
- ESLint cho toàn bộ TS/TSX đã sửa và git diff --check: qua.
- Browser tại 390×844, 768×1024, 1440×1000: không tràn ngang, không pageerror;
  ảnh Top Repos tải đúng CDN, liên kết và nội dung vẫn hiển thị.
- Reduced motion: rail không transform; nội dung vẫn đọc được.
- Không JavaScript: tiêu đề và bài nổi bật vẫn có trong HTML, không bị ẩn.
- Mèo: reaction atlas không tải trước tương tác, tải đúng bản mobile khi bấm.
- Mở trực tiếp #top-repos, #cong-cu và bấm #top-repos từ hero: mục tiêu dừng
  khoảng 85 px dưới đỉnh viewport, không bị kéo ngược về đầu trang.

## Khi triển khai

Chỉ cần thay đổi FE. Production source có thay đổi chưa commit và khác Git
baseline: ghép patch theo file/hunk, bảo toàn code khác, .env và uploaded media;
không upload toàn bộ checkout đè lên server. Theo AGENTS.md, backup FE trước
khi build với giá trị production, chỉ restart FE, rồi xác minh route, canonical,
sitemap, RSS, API health và đo Lighthouse public. Không có migration.

## Rollback thiết kế theo yêu cầu

Đã khôi phục nguyên section Top Repos, story-motion.css và lib/story-motion.ts từ baseline `cca5cf6`. Bài nổi bật bên trái và hai bài liên quan bên phải. Gỡ các thử nghiệm scroll Top Repos; giữ tối ưu ảnh, font, sprite và hoãn tải GSAP. Chưa deploy. Không dùng điểm Lighthouse của các thử nghiệm cũ để khẳng định điểm của bản rollback.

## Sửa lỗi responsive trong cảnh Khám phá

Giữ bố cục Top Repos gốc. Cảnh workspace dùng ba hàng riêng dưới 900 px; xem [kiểm tra responsive](./workspace-responsive-2026-10-29.md).
