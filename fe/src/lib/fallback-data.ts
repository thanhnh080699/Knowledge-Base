import type { Category } from "@/types/category"
import type { Post } from "@/types/post"
import type { Project } from "@/types/project"
import type { Service } from "@/types/service"
import type { Tag } from "@/types/tag"

export const fallbackCategories: Category[] = [
  { id: 1, name: "SysAdmin", slug: "sysadmin", description: "Linux, mạng, máy chủ và vận hành hệ thống" },
  { id: 2, name: "DevOps", slug: "devops", description: "CI/CD, Docker, Kubernetes và triển khai" },
  { id: 3, name: "Development", slug: "development", description: "Backend, frontend và kiến trúc ứng dụng" },
  { id: 4, name: "HelpDesk", slug: "helpdesk", description: "Ghi chú xử lý sự cố và hỗ trợ người dùng" }
]

export const fallbackTags: Tag[] = [
  { id: 1, name: "Linux", slug: "linux", description: null },
  { id: 2, name: "Docker", slug: "docker", description: null },
  { id: 3, name: "Next.js", slug: "nextjs", description: null },
  { id: 4, name: "Security", slug: "security", description: null }
]

export const fallbackPosts: Post[] = [
  {
    id: 1,
    title: "Checklist hardening VPS cho production",
    slug: "checklist-hardening-vps-production",
    content: "## Tổng quan\nCác bước cơ bản để đưa VPS lên production.\n\n## Bảo mật SSH\nTắt đăng nhập bằng mật khẩu, đổi port hợp lý và giới hạn user.\n\n## Firewall\nChỉ mở các port cần thiết và ghi log truy cập bất thường.",
    excerpt: "Checklist ngắn gọn cho SSH, firewall, update, backup và monitoring trên VPS production.",
    status: "PUBLISHED",
    category: fallbackCategories[0],
    tags: [fallbackTags[0], fallbackTags[3]],
    publishedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Docker Compose cho stack web nhỏ",
    slug: "docker-compose-cho-stack-web-nho",
    content: "## Kiến trúc\nTách app, database và reverse proxy thành từng service rõ ràng.\n\n## Volume\nĐặt tên volume dễ hiểu để backup thuận tiện hơn.\n\n## Deploy\nDùng biến môi trường riêng cho production.",
    excerpt: "Cách tổ chức Docker Compose gọn, dễ backup và dễ vận hành cho các website nhỏ.",
    status: "PUBLISHED",
    category: fallbackCategories[1],
    tags: [fallbackTags[1]],
    publishedAt: new Date().toISOString()
  },
  {
    id: 3,
    title: "Next.js App Router cho website tài liệu",
    slug: "nextjs-app-router-cho-website-tai-lieu",
    content: "## Routing\nDùng nested route cho khu vực tài liệu.\n\n## ISR\nĐặt revalidate cho nội dung tài liệu để cân bằng tốc độ và độ mới.\n\n## SEO\nSinh metadata động từ API.",
    excerpt: "Ghi chú triển khai App Router, ISR và metadata động cho website tài liệu kỹ thuật.",
    status: "PUBLISHED",
    category: fallbackCategories[2],
    tags: [fallbackTags[2]],
    publishedAt: new Date().toISOString()
  }
]

export const fallbackProjects: Project[] = [
  {
    id: 1,
    title: "thanhnh.id.vn CMS",
    slug: "thanhnh-cms",
    description: "Admin panel quản trị bài viết, danh mục, media, dự án và dịch vụ.",
    techStack: ["Next.js", "React Query", "Zustand"],
    thumbnailUrl: null,
    demoUrl: null,
    repoUrl: null,
    featured: true
  },
  {
    id: 2,
    title: "AdonisJS Content API",
    slug: "adonisjs-content-api",
    description: "REST API cho content, portfolio, contact va sitemap.",
    techStack: ["AdonisJS", "MariaDB", "Lucid"],
    thumbnailUrl: null,
    demoUrl: null,
    repoUrl: null,
    featured: true
  },
  {
    id: 3,
    title: "Go CDN Service",
    slug: "go-cdn-service",
    description: "Dịch vụ upload, resize ảnh và phân phối media qua CDN nội bộ.",
    techStack: ["Go", "Gin", "Image"],
    thumbnailUrl: null,
    demoUrl: null,
    repoUrl: null,
    featured: true
  }
]

export const fallbackServices: Service[] = [
  {
    id: 1,
    name: "Website doanh nghiệp",
    slug: "website-doanh-nghiep",
    description: "Thiết kế và lập trình website giới thiệu, landing page, blog và trang dịch vụ.",
    features: ["Next.js App Router", "SEO kỹ thuật", "CMS quản trị nội dung", "Tích hợp contact form"],
    priceRange: "8.000.000 VND",
    category: "Web",
    featured: true
  },
  {
    id: 2,
    name: "Hệ thống quản trị nội bộ",
    slug: "he-thong-quan-tri-noi-bo",
    description: "Xây dựng dashboard quản trị, phân quyền, CRUD workflow và báo cáo.",
    features: ["Phân quyền theo vai trò", "Giao diện admin", "REST API", "Workflow dễ kiểm soát"],
    priceRange: "20.000.000 VND",
    category: "Application",
    featured: true
  },
  {
    id: 3,
    name: "Tư vấn DevOps",
    slug: "tu-van-devops",
    description: "Đóng gói, deploy, backup và monitoring cho website hoặc ứng dụng sẵn có.",
    features: ["Docker deployment", "Reverse proxy", "Kế hoạch backup", "Monitoring cơ bản"],
    priceRange: "5.000.000 VND",
    category: "DevOps",
    featured: false
  }
]
