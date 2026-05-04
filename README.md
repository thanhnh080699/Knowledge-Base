# ThanhNH - Knowledge Base & Portfolio System

Chào mừng bạn đến với repo chính của **thanhnh.id.vn**. Đây là một hệ thống web hiện đại, hiệu năng cao được xây dựng để thay thế các giải pháp CMS truyền thống, phục vụ mục đích chia sẻ kiến thức kỹ thuật và giới thiệu sản phẩm/dịch vụ cá nhân.

## 🌟 Mục tiêu dự án

Dự án này được xây dựng với tâm thế đóng góp cho cộng đồng công nghệ, tập trung vào:
- **Lưu trữ tri thức**: Hệ thống quản lý tài liệu chuyên sâu về **SysAdmin**, **DevOps**, và **Full-stack Development**.
- **Hiệu năng & Trải nghiệm**: Sử dụng các công nghệ mới nhất (Next.js 15, AdonisJS v6, Golang) để đảm bảo tốc độ tải trang cực nhanh và giao diện mượt mà.
- **Showcase & Dịch vụ**: Cổng thông tin giới thiệu portfolio dự án và các dịch vụ lập trình web chuyên nghiệp.

---

## 🏗 Kiến trúc Hệ thống

Dự án được thiết kế theo kiến trúc Micro-services/Modular gồm 4 thành phần chính:

1.  **API (`/api`)**: Backend RESTful mạnh mẽ được xây dựng bằng **AdonisJS v6**. Quản lý logic nghiệp vụ, xác thực, và kết nối MariaDB.
2.  **FE (`/fe`)**: Frontend người dùng cuối sử dụng **Next.js 15 (App Router)** và **Tailwind CSS v4**. Tối ưu SEO và trải nghiệm người dùng.
3.  **CMS (`/cms`)**: Trang quản trị (Admin Panel) xây dựng trên Next.js kết hợp **React Query** và **Zustand**. Giao diện tinh gọn, chuyên nghiệp.
4.  **CDN (`/cdn`)**: Dịch vụ quản lý và phân phối tài liệu/hình ảnh được viết bằng **Golang (Gin)**. Hỗ trợ xử lý ảnh on-the-fly.

---

## 🛠 Tech Stack

- **Backend**: AdonisJS v6, Lucid ORM, VineJS.
- **Frontend**: Next.js 15, React 19, Framer Motion, Tailwind CSS v4.
- **Admin**: React Query, Zustand, UI Component-based.
- **Media Service**: Golang, Gin Framework.
- **Database**: MariaDB.

---

## 🚀 Hướng dẫn Cài đặt

### 📋 Yêu cầu hệ thống
- **Node.js**: v20.x hoặc mới hơn.
- **Go**: v1.21 hoặc mới hơn.
- **MariaDB**: v10.6 hoặc mới hơn.
- **Package Manager**: `yarn` hoặc `npm`.

### 1. Cài đặt API (Backend)
```bash
cd api
yarn install
cp .env.example .env
# Cấu hình DB_HOST, DB_USER, DB_PASSWORD trong .env
node ace migration:run
node ace db:seed
node ace serve --watch
```

### 2. Cài đặt FE (Frontend)
```bash
cd fe
yarn install
cp .env.example .env
# Cấu hình NEXT_PUBLIC_API_URL trỏ về API
yarn dev
```

### 3. Cài đặt CMS (Admin)
```bash
cd cms
yarn install
cp .env.example .env
# Cấu hình NEXT_PUBLIC_API_URL trỏ về API
yarn dev # Chạy mặc định trên cổng 3002
```

### 4. Cài đặt CDN (Media Service)
```bash
cd cdn
cp .env.example .env
# Cấu hình API_KEY và UPLOAD_DIR
go run main.go
```

---

## 🚢 Quy trình Deployment

Để triển khai hệ thống lên môi trường production, hãy đảm bảo thực hiện các bước sau:

### API
- Kiểm tra `.env` đầy đủ `APP_KEY`, `JWT_SECRET`.
- Chạy `node ace migration:run` để cập nhật cấu trúc database.
- Sử dụng `pm2` hoặc Docker để duy trì process.

### FE & CMS
- Chạy `yarn build` để tối ưu hóa bundle.
- Kiểm tra biến `NEXT_PUBLIC_API_URL` đã trỏ đúng domain production.
- FE hỗ trợ ISR (Incremental Static Regeneration) để tối ưu tốc độ.

### CDN
- Đảm bảo thư mục upload có quyền ghi.
- Whitelist các domain production trong `ALLOW_ORIGINS`.
- Chạy binary đã build bằng `go build`.

---

## 🤝 Cộng đồng & Đóng góp

Dự án này luôn hoan nghênh sự đóng góp từ cộng đồng. Bạn có thể:
- **Gửi Issue**: Báo cáo lỗi hoặc đề xuất tính năng mới.
- **Pull Request**: Cải thiện code hoặc bổ sung tài liệu.
- **Chia sẻ kiến thức**: Sử dụng hệ thống để lan tỏa các bài viết kỹ thuật hữu ích.

---
**ThanhNH.id.vn** - *Sharing Knowledge, Building Excellence.*
