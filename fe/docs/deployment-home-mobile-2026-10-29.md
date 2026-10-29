# Production: tối ưu mobile trang chủ, 2026-10-29

Đã deploy frontend tại https://thanhnh.id.vn trên `web-srv`, SSH qua
`192.168.12.102`, application root `/home/thanhnh.id.vn`.
Source commit `4cb9490e6fa711f369e30a4ba5c4cf14b7a3c331`, đã push lên
`origin/codex/home-scroll-mobile`. Build đang chạy: `G3T56v8E4wfKiyUOYab1D`.

## Phạm vi đã chốt

- Giữ bố cục Top Repos gốc (featured + hai bài liên quan). Không triển khai các
  thử nghiệm chồng thẻ và gallery đã bị người dùng yêu cầu rollback.
- Cảnh workspace Khám phá dưới 900 px: ba hàng riêng, hiện nối tiếp, không
  xoay/dịch ngang che chữ. Desktop rộng vẫn giữ fan animation ban đầu.
- Màn ngang thấp cuộn tự nhiên không pin; màn dọc thấp giữ chữ cuối tránh nút
  về đầu trang. CSS và GSAP dùng cùng breakpoint và kích thước canvas.
- Ảnh hero/Docs responsive, hero preload/fetchPriority cao, GSAP tải gần cảnh
  tương tác, sprite mobile nhỏ hơn và reaction atlas chỉ tải khi tương tác.
- Giữ nguyên font cục bộ, logo/favicon tối ưu, scoped Tailwind, reading/tool CSS,
  header và Brotli wrapper đã có riêng trên production. Không ghi đè globals.css,
  layout, header, package.json, server.mjs, fonts hay source ngoài phạm vi.

## Kiểm định

Build trong candidate riêng bằng dependency và .env production; chỉ chuyển build
sau khi thành công. Hai static-delivery tests passed. Candidate/public browser
checks qua ở 390×844, 672×912, 1440×1000, 844×390 và đổi breakpoint tablet.
Không pageerror hay tràn ngang; ba thẻ compact không chồng nhau/che chữ.

Các route trang chủ, Docs, Tools, Repos, Projects, Portfolio, Contact và bài
Top Repos mẫu HTTP 200. Canonical trang chủ đúng `https://thanhnh.id.vn`.
Đủ 7 bài Top Repos xuất bản gốc. RSS XML hợp lệ có 226 item; sitemap XML hợp lệ
có 320 URL; robots.txt và API health HTTP 200. JS dùng Brotli, cache immutable.
Asset JS build cũ vẫn HTTP 200 cho các trang còn mở/cached HTML.

Bốn PM2 process đều online. Chỉ FE đổi PID/restart (3 → 4); API/CMS/CDN giữ
nguyên PID và restart count. Không có migration, không đổi database hay media
CDN. .env trước/sau khớp SHA-256.

## Lighthouse trên URL public

Lighthouse 13.6.0, mobile mặc định, simulated throttling, Chrome headless.
Hai lượt nối tiếp trên **https://thanhnh.id.vn/**, không chạy browser QA hoặc
build đồng thời. Không phải điểm từ PageSpeed Insights API hay CrUX.
Lượt public trước release: 75/100, LCP 5,44 giây, TBT 22 ms, CLS 0.

| Lượt | Performance | FCP | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| 1 | 99 | 1.41 s | 1.86 s | 14 ms | 0.000 |
| 2 | 99 | 1.42 s | 1.95 s | 18 ms | 0.000 |

Số chính xác: [deployment-home-mobile-2026-10-29.json](./deployment-home-mobile-2026-10-29.json).
Điểm lab có thể biến động và không thay thế dữ liệu người dùng thật.

## Rollback

Root-only directory (mode 700):
`/home/deploy-backups/thanhnh-home-mobile-20261029-4cb9490/`.

- `fe-before.tar.gz`: source/build trước release, chứa .env nên chỉ root truy cập.
- `previous-next`: build nguyên bản, giữ nguyên cache/build phục vụ rollback.
- `rollback.sh`: khôi phục các source đã thay và build cũ, chỉ restart FE;
  không restore database, không ghi đè .env hiện hành.
- `deployment.json`: commit, build IDs và hash các file triển khai.
- `build.log`, `delivery-tests.log`, `pm2-before.json`, `pm2-after.json`.

Không git pull/reset toàn bộ production: checkout server có thay đổi riêng ngoài
baseline. Các lần deploy sau cần tiếp tục đối chiếu và ghép theo file/hunk.
